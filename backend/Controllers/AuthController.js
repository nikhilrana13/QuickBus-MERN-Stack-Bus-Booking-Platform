import User from "../Models/UserModel.js"
import { SendOtptoEmail } from "../Services/EmailService.js"
import { Response } from "../utils/ResponseHandler.js"
import jwt from "jsonwebtoken"
import Operator from "../Models/OperatorModel.js"




// user auth functions
export const SendOtptoUser = async(req,res)=>{
    try {
        const {email} = req.body 
        // console.log("req.body",req.body)
        
        // generate a 4 digit otp
        const Otp = Math.floor(1000 + Math.random() * 9000).toString()
        const expiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

        let user = await User.findOne({email})
        if(user){
            // update otp if user already exists
            user.emailOtp = Otp,
            user.emailOtpExpiry = expiry
            await user.save()
        }else{
            // create new user with otp
            user = await User.create({
            email,
            emailOtp:Otp,
            emailOtpExpiry:expiry
            })
        }
        //send otp to email
        await SendOtptoEmail(email,Otp)
        return Response(res,200,"Otp send to your email",{email})        
    } catch (error) {
      console.log("failed to send otp",error)
      return Response(res,500,"Internal Server error",error)
    }
}
export const VerifyUserOtp = async(req,res)=>{
    try {
        const {Otp} = req.body 
        // find user with this otp
        const user = await User.findOne({emailOtp:Otp})
        if(!user){           
            return Response(res,400,"Invalid Otp ")
        }
        if(user.emailOtpExpiry < new Date()){
            return Response(res,400,"Otp Expired")
        }
        // clear otp after verfication
        user.emailOtp = null,
        user.emailOtpExpiry = null,
        await user.save();
        // generate jwt token
        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
        res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"none"})
        return Response(res,200,"Login Successfully",{user,token})
    } catch (error) {
     console.log("failed to verify otp",error)
      return Response(res,500,"Internal Server error",error) 
    }
}

export const Logout = async(req,res)=>{
     try {
    res.clearCookie("token",{httpOnly:true,secure:true,sameSite:"none"},)
    return Response(res,200,"Logout Sucessfully")

  } catch (error) {
      console.log("failed to Signout",error)
      return Response(res,500,"Internal Server error")
  }
}
// Operator auth functions

export const SendOtptoOperator = async(req,res)=>{
    try {
        const {email} = req.body 
        const Otp = Math.floor(1000 + Math.random() * 9000).toString()
        const expiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

        let operator = await Operator.findOne({email})
        if(operator){
            // update otp if user already exists
            operator.emailOtp = Otp,
            operator.emailOtpExpiry = expiry
            await operator.save()
        }else{
            // create new user with otp
            operator= await Operator.create({
            email,
            emailOtp:Otp,
            emailOtpExpiry:expiry
            })
        }
        //send otp to email
        await SendOtptoEmail(email,Otp)
        return Response(res,200,"Otp send to your email",{email})        
    } catch (error) {
      console.log("failed to send otp",error)
      return Response(res,500,"Internal Server error",error)
    }
}
export const VerifyOperatorOtp = async(req,res)=>{
    try {
        const {Otp} = req.body 
        // find user with this otp
        const operator = await Operator.findOne({emailOtp:Otp})
        if(!operator){           
            return Response(res,400,"Invalid Otp ")
        }
        if(operator.emailOtpExpiry < new Date()){
            return Response(res,400,"Otp Expired")
        }
        // clear otp after verfication
        operator.emailOtp = null,
        operator.emailOtpExpiry = null,
        await operator.save();
        // generate jwt token
        const token = jwt.sign({id:operator._id,role:operator.role},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
        console.log("jwt secret",process.env.JWT_SECRET_KEY)
        res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"none"})
        return Response(res,200,"Login Successfully",{operator,token})
    } catch (error) {
     console.log("failed to verify otp",error)
      return Response(res,500,"Internal Server error",error) 
    }
}

export const OperatorLogout = async(req,res)=>{
     try {
    res.clearCookie("token",{httpOnly:true,secure:true,sameSite:"none"},)
    return Response(res,200,"Logout Sucessfully")

  } catch (error) {
      console.log("failed to Signout",error)
      return Response(res,500,"Internal Server error")
  }
}


