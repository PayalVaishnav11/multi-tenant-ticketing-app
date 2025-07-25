import express from 'express';
import cors from 'cors';
import cookieParser from   'cookie-parser';

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended :true , limit:"16kb"}))  
app.use(cookieParser())
//routes import 
import ticketRouter from "./routes/ticket.routes.js";
import authRouter from "./routes/auth.routes.js";
import meRouter from "./routes/me.routes.js";

//routes declaration 
app.use("/api/tickets",ticketRouter);
app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);


export {app}
