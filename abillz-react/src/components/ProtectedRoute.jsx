import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StateContext } from '../contexts/ContextProvider';

function ProtectedRoute({ children }) {
    const { token } = useContext(StateContext);
    if (!token) {
        return <Navigate to="/auth" replace />;
    }
    return children;
}

export default ProtectedRoute;