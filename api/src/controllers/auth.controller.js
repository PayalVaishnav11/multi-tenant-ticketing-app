import asyncHandler from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';


const generateToken = (user)=> {
        return jwt.sign(
            {
                _id:user._id,
                role:user.role,
                customerId : user.customerId
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );
};

export const registerUser = asyncHandler(async (req , res )=> {

    const { name, email, password, role, customerId } = req.body;

    if(
        [name,email,password,role, customerId].some((field)=> field?.trim() === "")
      ){
            throw new ApiError(400,"All fields are required !");
    };

    if (role === "ADMIN" && (customerId !== "adminTenant")) {
           return res.status(400).json({ message: "ADMIN must register under adminTenant" });
    }
    if (role === "CUSTOMER" && (customerId === "adminTenant")) {
           return res.status(400).json({ message: "CUSTOMER cannot register under adminTenant" });
    }


    const existedUser = await  User.findOne( {email})
    if(existedUser){
        throw new ApiError(409,"User with this email already exsits")
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser =new User({
        name,
        email,
        password: hashedPassword,
        role,
        customerId
    });
    await newUser.save();

    return res
      .status(201)
      .json(
         new ApiResponse(201,{id:newUser._id , email : newUser.email},'User registered successfully')
    );

});

export const loginUser = asyncHandler(async (req , res )=> {
    const { email, password } = req.body;

    if( !(email && password) ){
        throw new ApiError(400, "Email and Password is required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password , user.password);
    if(!isPasswordValid){
        throw new ApiError(401 , "Invalid user credentials")
    }

    const token = generateToken(user);
    const loggedInUser = await User.findById(user._id).select("-password");

    return res
      .status(200)
      .json(
         new ApiResponse(200 , {user:loggedInUser , token },"Login successful")
       )
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, "Current user fetched")
  );
});



