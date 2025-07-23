
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "./api/src/models/user.model.js";
import { Ticket } from "./api/src/models/ticket.model.js";
import connectDB from "./api/src/db/index.js";

dotenv.config();
const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Ticket.deleteMany();

    const password = await bcrypt.hash("password123", 10);

  
     const logisticsUser = await User.create({
      name: "Logistics User",
      email: "user@logistics.com",
      password,
      role: "User",
      customerId: "LogisticsCo",
    });
     const retailUser = await User.create({
      name: "Retail User",
      email: "user@retail.com",
      password,
      role: "User",
      customerId: "RetailGmbH",
    });

     const admin = await User.create({
      name: "Admin User",
      email: "admin@logistics.com",
      password,
      role: "Admin",
      customerId: "admin", 
     });
   
    await Ticket.create([
      {
        title: "LogisticsCo: Server Downtime",
        description: "Facing downtime on warehouse APIs",
        createdBy: logisticsUser._id,
        customerId: logisticsUser.customerId,
        status: "open"
      },
      {
        title: "RetailGmbH: UI Bug",
        description: "Issue in POS screen not loading",
        createdBy: retailUser._id,
        customerId: retailUser.customerId,
        status: "open"
      }
    ]);

    console.log("✅ Seed data inserted successfully.");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    mongoose.disconnect();
  }
};

seed();
