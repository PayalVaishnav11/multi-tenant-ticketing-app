//this middleware will verify  if user is there or not 
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


export const verifyJWT = asyncHandler( async(req,res,next)=> {
    
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Authorization header missing or malformed");
        }

        const token = authHeader.replace("Bearer ", "");

        if(!token){
            throw new ApiError(401 , "Unauthorized request")
        }

    try {
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decodedToken?._id).select(" -password")
    
       if(!user){
        throw new ApiError(401, "Invalid Access Token")
       }
       
       req.user = user;
      //  console.log("req.user in verifyJWT:",req.user);
       next()
   
      } catch (error) {
          throw new ApiError(401 , error?.message  || "Inavlid access token")
      }
})


