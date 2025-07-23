import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  status: {
    type: String,
    enum: ["open", "done"],
    default: "open",
  },

  customerId: {
    type: String,
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export const Ticket = mongoose.model("Ticket", ticketSchema);
