import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { SetUser } from '@/Redux/AuthSlice'

const Myprofile = () => {
    const [Step, setStep] = useState(1)
    const user = useSelector((state) => state.Auth.user)
    const [Error,setError] = useState("")
    const dispatch = useDispatch()

    // Form data for edit mode
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        phoneno: user?.phoneno || "",
    });

    const HandleEditProfile = () => {
        setStep(2)
        setError("")
    }
    const HandleCancel = () => {
          setFormData({
        username: user?.username || "",
        email: user?.email || "",
        phoneno: user?.phoneno || "",
    });
        setStep(1);
    };

    const HandleSave = async() => {
        if(formData.username.trim() === "" || formData.email.trim() === "" || formData.phoneno.trim() === ""){
            setError("Please fill all fields")
            return
        }
        console.log("Saved Profile Data:", formData);
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile-update`,formData,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                },withCredentials:true
            })
            // console.log("data",response.data)
            if(response.data){
                toast.success(response?.data?.message)
                dispatch(SetUser(response?.data?.data))
                setStep(1)
            }

        } catch (error) {
            console.log("Failed to update profile",error)
            toast.error(error?.response?.data?.message)
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
         if (Error) setError("");
    };

    return (
        <div className='py-5 px-2 lg:px-10'>
            <h3 className='text-[1.2rem] text-[#656161]'>My Profile</h3>
            {
                Step === 1 && (
                    <div className="bg-white rounded-xl shadow-md p-6 md:p-10 w-full max-w-4xl mx-auto mt-10 border">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-700">YOUR PROFILE</h2>
                            <button onClick={HandleEditProfile} className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-green-700">
                                EDIT
                            </button>
                        </div>
                        {/* Top Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Your Name</p>
                                <p className="text-lg font-semibold text-gray-800 mt-1">{formData.username || "N/A"}</p>
                            </div>
                        </div>
                        {/* Contact Section */}
                        <div className="mt-6">
                            <h3 className="text-center text-gray-600 font-semibold mb-6 tracking-wide">
                                CONTACT DETAILS
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">Email ID</p>
                                    <p className="text-base font-semibold text-gray-800 mt-1">
                                        {formData.email || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">Mobile Number</p>
                                    <p className="text-base font-semibold text-gray-800 mt-1">{formData.phoneno || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* ===================== EDIT MODE ===================== */}
            {Step === 2 && (
                <div className="bg-white rounded-xl shadow-md p-6 md:p-10 w-full max-w-4xl mx-auto mt-10 border">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-700">EDIT PROFILE</h2>
                    </div>

                    {/* Editable Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide">Your Name</p>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => handleChange("username", e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-green-600"
                            />
                              {Error && <p className='mt-2 text-red-500 text-sm'>{Error}</p>}
                        </div>
                    </div>

                    {/* Contact Details Editable */}
                    <div className="mt-6">
                        <h3 className="text-center text-gray-600 font-semibold mb-6 tracking-wide">
                            CONTACT DETAILS
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                 <p className="text-sm text-gray-500 uppercase tracking-wide">Email ID</p>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-green-600"
                                />
                               {Error && <p className='mt-2 text-red-500 text-sm'>{Error}</p>}
                                
                            </div>
                              
                            <div> 
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Mobile Number</p>
                                <input
                                    type="text"
                                    value={formData.phoneno}
                                    onChange={(e) => handleChange("phoneno", e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-green-600"
                                />
                              {Error && <p className='mt-2 text-red-500 text-sm'>{Error}</p>}
                            </div> 
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            onClick={HandleCancel}
                            className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={HandleSave}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                        >
                            SAVE
                        </button>
                    </div>
                </div>
            )}
        </div>


    )
}

export default Myprofile


