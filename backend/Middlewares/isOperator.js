import { Response } from "../utils/ResponseHandler.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()



export const isOperator = async(req,res,next)=>{
         const Authheader = req.headers.authorization
         if(!Authheader || !Authheader.startsWith("Bearer")){
            return Response(res,401,'Unauthorized or invalid token')
         }
        //  console.log("Authheader",Authheader)
    try {
        const token = Authheader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        // console.log("decoded",decoded)
        // console.log("secret key",process.env.JWT_SECRET_KEY)
        if(decoded.role !== "operator"){
            return Response(res,403,"Access denied. operator only route.")
        }
        req.operator = decoded.id 
        // console.log("decoded id",decoded.id)
        req.role = decoded.role
        // console.log("role from middleware",req.role)
        next()
    } catch (error) {
        console.log("failed to verify token",error)
        return Response(res,401,"Error in Authentication middleware")
    }
}