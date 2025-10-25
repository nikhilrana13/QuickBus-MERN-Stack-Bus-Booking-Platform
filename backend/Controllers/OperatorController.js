import Operator from "../Models/OperatorModel.js"
import { Response } from "../utils/ResponseHandler.js"



export const UpdateOperatorProfile = async(req,res)=>{
    try {
        const operatorId = req.operator
         const {companyName,contactno} = req.body 
        
        const operator = await Operator.findById(operatorId)
        if(!operator){
            return Response(res,400,"Operator not found")
        }
        const updatedOperator = await Operator.findByIdAndUpdate(operatorId,{companyName,contactno},{new:true})
        return Response(res,200,"Profile update successfully",updatedOperator)
    } catch (error) {
        console.log("failed to update profile",error)
        return Response(res,500,"Internal Server error")
    }
}