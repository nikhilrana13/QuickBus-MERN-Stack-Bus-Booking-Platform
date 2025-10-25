import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { XCircle } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

const PaymentFailed = () => {
     const [searchParams] = useSearchParams()
    const bookingId = searchParams.get("bookingId")
    const navigate = useNavigate()
    const [status,SetStatus] = useState("loading")
     // update booking status 
  useEffect(() => {
    if (bookingId) {
      const UpdateCancelBookingStatus = async () => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/${bookingId}/mark-failed`, {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }, withCredentials: true
          })
          // console.log("response", response.data)
          if (response?.data?.data?.paymentStatus === "Failed") {
            SetStatus("Failed")
            setTimeout(() => {
              navigate("/")
            }, 4000);
          }
        } catch (error) {
          console.log("failed to update booking status", error)
          toast.error(error?.response?.data?.message)
          SetStatus("Failed")
        }
      }
      UpdateCancelBookingStatus()
    } else {
      SetStatus("Failed")
    }
  }, [bookingId, navigate])
  return (
     <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border">

        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Verifying your payment...</p>
          </>
        )}
        {
          status === "Failed" && (
            <>
          <div className="flex justify-center">
          <XCircle className="w-20 h-20 text-red-500 animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-red-600 mt-4">
          Payment Failed ❌
        </h1>
        <p className="text-gray-600 mt-2">
          Unfortunately, your payment could not be processed.
        </p>
        <div className="mt-6 bg-gray-100 p-3 rounded-md text-sm font-medium text-gray-700">
          Booking ID: <span className="text-gray-900">{bookingId}</span>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Go Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
        {/* Redirecting message */}
        <p className="mt-6 text-gray-500 text-sm">
          Redirecting you to the home page...
        </p>
            </>
          )
        }
      </div>
    </div>
  )
}

export default PaymentFailed