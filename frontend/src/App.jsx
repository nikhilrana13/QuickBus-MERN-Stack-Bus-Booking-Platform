import React, { useRef,useEffect } from 'react'
import Home from './Pages/Home'
import { Routes, Route, useLocation } from 'react-router-dom'
import OperatorDashboard from './Pages/OperatorDashboard'
import { Toaster } from './Components/ui/sonner'
import UserProfile from './Components/PageComponents/UserProfile'
import UserBookings from './Components/PageComponents/UserBookings'
import OperatorHomePage from './Pages/OperatorHomePage'
import Dashboard from './Components/OperatorDashboardComponents/Dashboard'
import MangeBookings from './Components/OperatorDashboardComponents/MangeBookings'
import MangeBuses from './Components/OperatorDashboardComponents/MangeBuses'
import UpdateOperatorProfile from './Components/OperatorDashboardComponents/UpdateOperatorProfile'
import UpdateBusDetails from './Components/OperatorDashboardComponents/UpdateBusDetails'
import AddBusForm from './Components/OperatorDashboardComponents/AddBusFormComponent/AddBusForm'
import UpdateBusForm from './Components/OperatorDashboardComponents/UpdateBusFormComponent/UpdateBusForm'
import SearchBuses from './Components/PageComponents/SearchBuses'
import PaymentSuccess from './Components/PageComponents/PaymentSuccess'
import PaymentFailed from './Components/PageComponents/PaymentFailed'
import Mytrips from './Components/PageComponents/Mytrips'
import Myprofile from './Components/PageComponents/Myprofile'
import ProtectedRoute from './Components/PageComponents/ProtectedRoute'
import OperatorProtectedRoute from './Components/OperatorDashboardComponents/OperatorProtectedRoute'
import { AnimatePresence ,motion} from 'framer-motion'
import ScrollToTop from './Components/PageComponents/ScrollToTop'




const pageVariants = {
  initial: (direction) => ({
    x: direction === "right" ? "100%" : direction === "left" ? "-100%" : 0,
    opacity: direction === "none" ? 1 : 0,
  }),
  in: { x: 0, opacity: 1 },
  out: (direction) => ({
    x: direction === "right" ? "-100%" : direction === "left" ? "100%" : 0,
    opacity: 0,
  }),
}
const pageTransition = { duration: 0.5 }
const App = () => {
   const location = useLocation()
   const firstRenderRef = useRef(true)
   

  const getDirection = (pathname) => {
     // first render: no animation
    if (firstRenderRef.current) {
      if (pathname === '/') firstRenderRef.current = false
      return "none"
    }
    // Home -> SearchBuses = right
    if(location.pathname === '/' && pathname === '/searchbuses') return "right"
    // SearchBuses -> Home = left
    if(location.pathname === '/searchbuses' && pathname === '/') return "left"
    return "right" // default
  }

  return (
    <div className='app font-inter overflow-x-hidden'>
        {/* Routes */}
    
        <AnimatePresence mode='wait' >
              <ScrollToTop />
           <Routes location={location} key={location.pathname}>
          <Route path="/" element={<motion.div custom={getDirection('/')} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} >
           <Home />
          </motion.div>} />
          <Route element={<ProtectedRoute />}>
            <Route path='/myprofile' element={<UserProfile />} />
            <Route path='/mybookings' element={<UserBookings />}>
              <Route path='mytrips' element={<Mytrips />} /> 
              <Route path='myprofile' element={<Myprofile />} />
            </Route>
          </Route>
          <Route path='/searchbuses' element={<motion.div
                custom={getDirection('/searchbuses')}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <SearchBuses />
              </motion.div>} />
          {/* payment routes */}
           <Route path='/payment-success' element={<PaymentSuccess />} />
           <Route path='/payment-failed' element={<PaymentFailed />} />
          {/* operator routes */}
           <Route path='/become-operator' element={<OperatorHomePage />} />
           <Route element={<OperatorProtectedRoute />}>
           <Route path="/operator-dashboard" element={<OperatorDashboard />}>
             <Route path="dashboard" element={<Dashboard />} />
             <Route path="add-bus" element={<AddBusForm />} />
              <Route path="manage-bookings" element={<MangeBookings />} />
              <Route path="manage-buses" element={<MangeBuses />} />
              <Route path='update-bus-details/:id' element={<UpdateBusForm />}  />
              <Route path="update-bus/:id" element={<UpdateBusDetails />} />
              <Route path='update-profile' element={<UpdateOperatorProfile />} />
           </Route>
           </Route>
           
        </Routes>
        </AnimatePresence>
       
        <Toaster position="bottom-center" reverseOrder={false} />
    </div>
    
  )
}

export default App