import express from "express"
import { Logout, SendOtptoUser, VerifyUserOtp } from "../Controllers/AuthController.js"
import { UpdateUserProfile } from "../Controllers/UserController.js"
import { isCustomer } from "../Middlewares/isCustomer.js"
const router = express.Router()



// routes 
router.post("/send-otp",SendOtptoUser)
router.post("/verify-otp",VerifyUserOtp)
router.get("/logout",Logout)
router.put("/profile-update",isCustomer,UpdateUserProfile)


export default router