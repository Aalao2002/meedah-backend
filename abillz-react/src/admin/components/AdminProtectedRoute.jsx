import { Navigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { StateContext } from '../../contexts/ContextProvider';

function AdminProtectedRoute({ children }) {
    const { token, isAdmin} = useContext(StateContext);

    if(!token){
        return <Navigate to="/auth" replace />
    }
    if(!isAdmin) {
        return <Navigate to="/dashboard" replace />
    }
    return children;
}

export default AdminProtectedRoute;