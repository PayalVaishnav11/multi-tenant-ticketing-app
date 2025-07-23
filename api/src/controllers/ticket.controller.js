import axios from "axios";
import { Ticket } from "../models/ticket.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { getIO } from "../socket.js";

export const createTicket  = asyncHandler(async(req , res )=> {

    const { title, description } = req.body;

    if (!(title && description)) {
        throw new ApiError(400, "Title and description are required");
    }

    const { customerId, _id: userId } = req.user; // from verifyJWT middleware

    const newTicket = new Ticket({
        title ,
        description,
        status:"open",
        customerId,
        createdBy:userId,
    });
    await newTicket.save();

    const user =await User.findById(userId).select(" -password");
    const emailId = user?.email;

    //calls n8n webhook
    try {
         await axios.post(
            process.env.N8N_WEBHOOK_URL ,
            {
                ticketId: newTicket._id,
                customerId,
                email:emailId
               
            },
            {
                headers: {
                   "x-secret-header": process.env.WEBHOOK_SECRET,
                },
            }
        )
        
    } catch (error) {
         console.error("❌ Error calling n8n webhook:", error.message);
    }


    return res
    .status(201)
    .json(new ApiResponse(201, newTicket, "Ticket created & workflow triggered"));
});

export const getAllTickets = asyncHandler(async(req , res)=> {
    const tickets = await Ticket.find({}).populate("createdBy","name email") 
    //.populate Fetches the user referenced by createdBy, and return only their name and email.

     if(!tickets){
            throw new ApiError(400,"Somthing went wrong while retriving notes")
     }

     return res
    .status(200)
    .json(new ApiResponse(200, tickets, "All tickets fetched successfully"));
})

export const getTicketById = asyncHandler(async (req, res) => {
  console.log("req.params",req.params);
  const { id } = req.params;

  const ticket = await Ticket.findById(id).populate("createdBy", "name email");

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  const isOwner = ticket.createdBy._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "Admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "Access denied");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ticket, "Ticket fetched successfully"));


});

export const deleteTicket = asyncHandler(async (req, res) => {
  console.log("req.params",req.params);
  const ticketId = req.params.ticketId

  const ticket = await Ticket.findById(ticketId);
   console.log("ticket under deleteTicket controller : ",ticketId);

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  await ticket.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Ticket deleted successfully"));
});

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id });
    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch your tickets",
    });
  }
};

export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;
  if (!["open", "done"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });

  if (!updatedTicket) {
    throw new ApiError(404, "Ticket not found");
  }


  const io = getIO();
  io.emit("ticket-updated", { ticketId: updatedTicket._id, status });

  return res.status(200).json(new ApiResponse(200, {data:updatedTicket}, "Status updated successfully"));
});





