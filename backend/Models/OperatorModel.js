import mongoose from "mongoose";


const OperatorSchema = mongoose.Schema({
    companyName:{type:String,default:""},
    email:{type:String,required:true},
    emailOtp:{type:String},
    emailOtpExpiry:{type:String},
    contactno:{type:String,default:""},
    role:{type:String,default:"operator"},
    mybuses:[{type:mongoose.Schema.Types.ObjectId,ref:"Bus"}]
},{Timestamp:true})

const Operator = mongoose.model("Operator",OperatorSchema)
export default Operator 
