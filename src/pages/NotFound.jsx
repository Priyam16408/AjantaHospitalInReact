import React from 'react'
import { Navigate } from 'react-router-dom';

export default function NotFound() {
    const token = localStorage.getItem("userData");
    console.log("takenf",token);
    return (
        <>
            {token === null ? <Navigate to='/login' replace/> : <Navigate to='/dashboard' replace/>}
        </>
    )
}
