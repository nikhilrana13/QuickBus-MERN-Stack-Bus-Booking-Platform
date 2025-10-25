
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { XCircle } from 'lucide-react'
import { toast } from 'sonner'

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const navigate = useNavigate()
  const [status, SetStatus] = useState("loading")

  // update booking status 
  useEffect(() => {
    if (bookingId) {
      const UpdateBookingStatus = async () => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/${bookingId}/mark-success`, {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }, withCredentials: true
          })
          // console.log("response", response.data.status)
          if (response?.data?.status === "success") {
            toast.success(response?.data?.message)
            SetStatus("success")
            setTimeout(() => {
              navigate("/")
            }, 2000);
          }
        } catch (error) {
          console.log("failed to update booking status", error)
          toast.error(error?.response?.data?.message)
          SetStatus("failed")
        }
      }
      UpdateBookingStatus()
    } else {
      SetStatus("failed")
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
          status === "success" && (
            <>
              <div className="flex justify-center">
                <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-600 mt-4">
                Payment Successful 🎉
              </h1>
              <p className="text-gray-600 mt-2">
                Thank you for using Quickbus. Your payment has been confirmed.
              </p>
              <div className="mt-6 bg-gray-100 p-3 rounded-md text-sm font-medium text-gray-700">
                Booking ID: <span className="text-gray-900">{bookingId || "NA"}</span>
              </div>
              <p className="mt-6 text-gray-500 text-sm">
                Redirecting you to your bookings...
              </p>
            </>
          )

        }
        {status === "failed" && (
          <>
            <XCircle className="w-20 h-20 text-red-500 mx-auto" />
            <h1 className="text-2xl md:text-3xl font-bold text-red-600 mt-4">
              Payment Verification Failed
            </h1>
            <p className="text-gray-600 mt-2">
              Something went wrong. Please check your booking history.
            </p>
            <button
              onClick={() => navigate("/mybookings/mytrips")}
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Go Home
            </button>
          </>)}


      </div>
    </div>
  )
}

export default PaymentSuccess