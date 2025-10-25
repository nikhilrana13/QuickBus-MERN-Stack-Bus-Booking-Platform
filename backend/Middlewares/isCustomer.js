import { Response } from "../utils/ResponseHandler.js"
import jwt from "jsonwebtoken"

export const isCustomer = async(req,res,next)=>{
         const Authheader = req.headers.authorization
         if(!Authheader || !Authheader.startsWith("Bearer")){
            return Response(res,404,'Unauthorized or invalid token')
         }
    try {
        const token = Authheader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(decoded.role !== "customer"){
            return Response(res,404,"Access denied. Customer only route.")
        }
        req.user = decoded.id 
        req.role = decoded.role
        next()
    } catch (error) {
        console.log("failed to verify token",error)
        return Response(res,401,"Error in Authentication middleware")
    }
}