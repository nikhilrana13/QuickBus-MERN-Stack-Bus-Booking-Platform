import express from "express"
import { Logout, SendOtptoOperator, VerifyOperatorOtp } from "../Controllers/AuthController.js"
import { isOperator } from "../Middlewares/isOperator.js"
import { UpdateOperatorProfile } from "../Controllers/OperatorController.js"
const router = express.Router()



// routes 
router.post("/send-otp",SendOtptoOperator)
router.post("/verify-otp",VerifyOperatorOtp)
router.get("/logout",Logout)
router.put("/:id/update",isOperator,UpdateOperatorProfile)


export default router