
import User from "../Models/UserModel.js"
import { Response } from "../utils/ResponseHandler.js"



export const UpdateUserProfile = async(req,res)=>{
    try {
        const userId = req.user
         const {username,email,phoneno} = req.body 
         if(!username || !phoneno || !email){
            return Response(res,400,"All fields is required")
         }
        
        const user = await User.findById(userId)
        if(!user){
            return Response(res,400,"user not found")
        }
        const updateduser = await User.findByIdAndUpdate(userId,{username,email,phoneno},{new:true})
        return Response(res,200,"Profile update successfully",updateduser)
    } catch (error) {
        console.log("failed to update profile",error)
        return Response(res,500,"Internal Server error")
    }
}