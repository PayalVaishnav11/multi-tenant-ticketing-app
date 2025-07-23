import { readFile } from "fs/promises";
import path from "path";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getUserScreens = async (req, res) => {
  try {
    const registryPath = path.join(process.cwd(), "registry.json");
    const data = await readFile(registryPath, "utf-8");
    const screens = JSON.parse(data);
     const { customerId } = req.user; 
     const userScreens = screens[customerId] || [];

    return res
    .status(200)
    .json( new ApiResponse(200,{data:userScreens},'Screens fetched successfully')
    );

  } catch (error) {
    console.error("❌ Error reading registry:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to load screens",
    });
  }
};
