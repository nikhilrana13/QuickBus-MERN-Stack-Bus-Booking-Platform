import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogOverlay } from "../ui/dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "../ui/input-otp"
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { SetUser } from '@/Redux/AuthSlice';
import { useNavigate } from 'react-router-dom';

export const LoginDialog = ({onLoginSuccess}) => {
    const [loading,setLoading] = useState(false)
    const [ Otp, setOtp] = useState("")
    const [email, Setemail] = useState("")
    const [step, setStep] = useState(1)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [Open,setOpen] = useState(false)

    // handle send otp 
    const handleSendOtp = async () => {
        const emailPattern =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailPattern.test(email)) {
            try {
                setLoading(true)
              const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/send-otp`,{email},{
                withCredentials:true
              })
              if(response.data){
                toast.success(response?.data?.message)
                setStep(2)
              }
            } catch (error) {
              console.error("failed to send otp",error)
              toast.error(error?.response?.data?.message || "Internal server error")
            }finally{
                setLoading(false)
            }
        }else{
            toast.error("please enter valid email address")
        }
    }
    // handle verify otp
    const handleVerifyOtp = async()=>{
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/verify-otp`,{Otp},{
                withCredentials:true
            })
            // console.log("response",response.data)
            if(response.data){
                toast.success(response?.data.message)
                localStorage.setItem("token",response?.data?.data?.token)
                dispatch(SetUser(response?.data?.data?.user))
                //  close dialog & reset
                setOpen(false)
                setStep(1)
                setOtp("")
                Setemail("")
                // close sidebar
                if(onLoginSuccess) onLoginSuccess()
                setTimeout(() => {
                    navigate("/") 
                }, 300);
               
            }
        } catch (error) {
            console.error("failed to verify otp",error)
            toast.error(error?.response?.data?.message) 
        }finally{
                 setLoading(false)
        }
    }
    return (
        <Dialog open={Open} onOpenChange={(isOpen)=>{
            setOpen(isOpen)
            if(!isOpen){
                // reset when dialog closes
                setStep(1)
                setOtp("")
                Setemail("")
            }
        }}>
            <DialogTrigger asChild>
                <button onClick={()=>setOpen(true)} className='px-4 py-3 rounded-full text-[1rem] font-[500] text-white bg-[#D63941]'>Log in</button>
            </DialogTrigger>
           
            <DialogContent overlayClassName="bg-black/20 z-[10050]" className="sm:max-w-[550px] w-full mx-auto z-[10051]">
                
                <DialogHeader>
                    <DialogTitle className="text-xl font-[500]">
                        {step === 1 ? "Login to get exciting offers" : "Verify OTP"}
                    </DialogTitle>
                </DialogHeader>
                {step === 1 && (
                    <div className="flex flex-col gap-4 mt-4">
                        <h3 className='text-[1.4rem] font-[700]'>What's your email address?</h3>
                        <input
                            type="email"
                            value={email}
                            required
                            onChange={(e) => Setemail(e.target.value)}
                            placeholder="Enter Your email"
                            className="border p-3  outline-none 
             placeholder-shown:text-base placeholder-shown:font-normal 
             text-lg font-semibold  focus:border-[#D63941] focus:ring-2 focus:ring-[#FECACA] 
             focus:ring-opacity-50 transition-all rounded-md"
                        />
    
                           <button onClick={handleSendOtp} className={`px-4 flex justify-center items-center py-3 mt-10 rounded-full text-[1rem] font-[500] text-white bg-[#D63941] ${loading ? "bg-gray-500 text-gray-300":"bg-[#D63941]"} `}>{loading ? <><Loader2 className='animate-spin w-5 h-5 mr-2 text-[#D63941] ' />Generating Otp...</>  :"Generate Otp"}</button>
                    </div>
                )}
                {step === 2 && (
                    <div className="flex flex-col gap-4 mt-4">
                        <h3 className='text-[1.3rem] font-[700]'>Enter the OTP we just sent you</h3>
                        <div className='flex justify-between  items-center'>
                            <div className='flex flex-col '>
                                <span className='text-black font-[500]'>{email || "Not Available"}</span>
                                <span className='text-gray-500'>Email address</span>
                            </div>
                            <span onClick={()=>{setStep(1),setOtp("")}} className='text-sm font-[600] cursor-pointer underline'>Edit</span>
                        </div>
                        {/* otp box */}
                        <div className='flex flex-col gap-3'>
                            <h5 className='text-gray-500 font-[400] text-sm'>Enter Otp</h5>
                            <div>
                                <InputOTP maxLength={4} value={Otp} onChange={(value) => {
                                    // allow numeric only
                                    const onlyNums = value.replace(/[^0-9]/g, "")
                                    setOtp(onlyNums)
                                }}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>
                        <button onClick={handleVerifyOtp} className={`px-4 flex justify-center items-center py-3 mt-10 rounded-full text-[1rem] font-[500] text-white bg-[#D63941] ${loading ? "bg-gray-500 text-gray-300":"bg-[#D63941]"} `}>{loading ? <><Loader2 className='animate-spin w-5 h-5 mr-2 text-[#D63941] ' />Verify Otp...</>  :"Verify Otp"}</button>
                    </div>
                )}
            </DialogContent>

        </Dialog>

    )
}

export default LoginDialog



