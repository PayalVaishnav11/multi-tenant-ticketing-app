import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from 'dotenv';
import { Server } from "socket.io"; 
import http from "http"; 
import { setIO } from "./socket.js";

dotenv.config({
    path:"./env"
})

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

setIO(io);


connectDB()  // data base connection 
.then(()=> {
    server.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is running at port :${process.env.PORT}`);
    })
})
.catch((error)=> {
    console.log("MongoDb connection failed !!",error);
})