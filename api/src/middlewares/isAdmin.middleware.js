import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const isAdmin = asyncHandler(async(req ,res , next )=> {
     if (req.user?.role !== "Admin") {
        throw new ApiError(403, "Access denied. Admins only.");
     }
     next();
})