import React, { useEffect, useState } from 'react'
import { Bus, TicketCheck, IndianRupee, BarChart2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import axios from 'axios';
import { useSelector } from 'react-redux';
import ShimmerCard from './DashboardShimmrCard';

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  const [loadingEarning, setLoadingEarning] = useState(false)
  const [loadingActiveRoute, setLoadingActiveRoute] = useState(false)
  const [activeRoutesData, setActiveroutesData] = useState([])
  const [activeRoutesCount, setActiveroutesCount] = useState(0)
  const [States, setStates] = useState({
    revenue: 0,
    bookings: 0,
    buses: 0
  })
  const [earnings, SetEarnings] = useState([])
  const user = useSelector((state) => state.Auth.user)
  // fetch total revenue and total bookings and total buses 
  useEffect(() => {
    const FetchTotalRevenue = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/total-revenue`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          withCredentials: true
        })
        // console.log("response",response.data)
        if (response.data) {
          setStates((prev) => ({ ...prev, revenue: response?.data?.data?.totalRevenue, bookings: response?.data?.data?.totalBookings, buses: response.data?.data?.totalbuses }))
        }
      } catch (error) {
        console.error("failed to fetch total revenue", error)
      } finally {
        setLoading(false)
      }
    }
    FetchTotalRevenue()
  }, [])
  // fetch monthly earnings
  useEffect(() => {
    const FetchMonthlyEarning = async () => {
      try {
        setLoadingEarning(true)
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/earnings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          withCredentials: true
        })
        // console.log("response",response.data)
        if (response.data) {
          SetEarnings(response?.data?.data)
        }
      } catch (error) {
        console.error("failed to fetch total revenue", error)
      } finally {
        setLoadingEarning(false)
      }
    }
    FetchMonthlyEarning()
  }, [])
  // console.log("earnings",earnings)
  // fetch active routes
  useEffect(() => {
    const FetchActiveRoutes = async () => {
      try {
        setLoadingActiveRoute(true)
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bus/activeroutes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          withCredentials: true
        })
        // console.log("response",response.data)
        if (response.data) {
          setActiveroutesCount(response?.data?.data?.activeRouteCount)
          setActiveroutesData(response?.data?.data?.routeDetails)
        }
      } catch (error) {
        console.error("failed to fetch active routes", error)
      } finally {
        setLoadingActiveRoute(false)
      }
    }
    FetchActiveRoutes()
  }, [])

  return (
    <div className="w-full bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-600">Dashboard</h1>
        <p className="text-gray-600">Hello, {user?.companyName || "Operator"}👋</p>
        <p className="text-gray-500 text-sm">
          Here's the latest update about your buses.
        </p>
      </div>
      {/* Stats Grid */}
      {
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => {
              return (
                <ShimmerCard key={i} />
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-red-500 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{States?.buses || 0}</h2>
                  <p className="text-gray-500">Total Buses</p>
                </div>
                <Bus className="text-red-500" size={36} />
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-yellow-500 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{States?.bookings || 0}</h2>
                  <p className="text-gray-500">Bookings</p>
                </div>
                <TicketCheck className="text-yellow-500" size={36} />
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-green-500 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">₹{States?.revenue || 0}</h2>
                  <p className="text-gray-500">Earnings</p>
                </div>
                <IndianRupee className="text-green-500" size={36} />
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-blue-500 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{activeRoutesCount || 0}</h2>
                  <p className="text-gray-500">Active Routes</p>
                </div>
                <BarChart2 className="text-blue-500" size={36} />
              </div>
            </div>
          </div>
        )
      }
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Line Chart */}
        {
          loadingEarning ? (
            <div className="bg-white shadow-lg rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Earnings Over Months
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )
        }
        {
          loadingActiveRoute ? (
            <div className="bg-white shadow-lg rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="overflow-x-auto scrollbar-hide">
                <div style={{ width: '600px', minWidth: '100%' }}>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Active Routes
              </h3>
              <div style={{ width: '100%', overflowX: 'auto' }} className='overflow-x-clip scrollbar-hide'> {/* scrollable wrapper */}
                <div style={{ width: `${activeRoutesData.length * 100}px`, minWidth: '100%' }}> {/* chart width based on data */}
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activeRoutesData}>
                      <XAxis dataKey="route" interval={0}
                        tick={{ angle: -30, textAnchor: 'end' }}
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="buses" fill="#2563eb" barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Dashboard


