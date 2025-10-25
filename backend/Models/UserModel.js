import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username:{type:String,default:""},
    email:{type:String,required:true},
    emailOtp:{type:String},
    emailOtpExpiry:{type:String},
    role:{type:String,default:"customer"},
    mytrips:[{type:mongoose.Schema.Types.ObjectId,ref:"Booking"}],
    phoneno:{type:String,default:""},
},{Timestamp:true})

const User = mongoose.model("User",UserSchema)
export default User