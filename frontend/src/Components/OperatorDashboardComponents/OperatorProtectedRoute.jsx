import React, { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const OperatorProtectedRoute = () => {
    const user = useSelector((state)=> state.Auth.user)

    if(!user || user.role !== "operator"){
        return <Navigate to="/become-operator" replace />
    }
  return <Outlet />
}

export default OperatorProtectedRoute