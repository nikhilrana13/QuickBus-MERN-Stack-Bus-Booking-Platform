import express from "express"
import multer from "multer"
import { AddBus, DeleteBus, EachBusDetails, EachOperatorBuses, FindActiveRoutes, GetAllBuses, UpdateBusDetails, UpdateBusStatusActiveorNot } from "../Controllers/BusController.js"
import { isOperator } from "../Middlewares/isOperator.js"

const router = express.Router()

// multer config
const storage = multer.memoryStorage()
const upload = multer({storage:storage,
    //  300 kb per limit
    limits:{fileSize:500 * 1024},
    fileFilter:(req,file,cb)=>{
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase())
        const mimetype = allowedTypes.test(file.mimetype);
        if(extname && mimetype){
            cb(null,true);
        }else{
            cb(new Error("Only images (jpeg, jpg, png, webp) are allowed!"))
        }
    }
})
// routes 
router.post("/add-bus",upload.array("images",6),isOperator,AddBus)
router.get("/my-buses",isOperator,EachOperatorBuses)
router.get("/activeroutes",isOperator,FindActiveRoutes)
router.get("/buses",GetAllBuses)
router.delete("/:id/delete",isOperator,DeleteBus)
router.get("/:id",EachBusDetails)
router.put("/update-bus/:id",upload.array("images",6),isOperator,UpdateBusDetails)
router.patch("/:id/status",isOperator,UpdateBusStatusActiveorNot)






export default router