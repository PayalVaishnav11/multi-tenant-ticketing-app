import { Router } from "express";
import { createTicket,getAllTickets,getTicketById,deleteTicket, getMyTickets,updateTicketStatus} from "../controllers/ticket.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router();
router.route("/create-ticket").post(verifyJWT,createTicket);
router.route("/get-all-tickets").get(verifyJWT,isAdmin,getAllTickets); 
router.route("/delete-ticket/:ticketId").delete(verifyJWT,isAdmin,deleteTicket);
router.route("/my-tickets").get(verifyJWT,  getMyTickets);
router.route("/:ticketId").get(verifyJWT, getTicketById); 
router.route("/:ticketId/status").post(verifyJWT,isAdmin,updateTicketStatus);



export default router