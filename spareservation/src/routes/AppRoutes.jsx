import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard'; 
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/reservaciones" /> : <Login />} />
        <Route path="/reservaciones" element={<ProtectedRoute><Dashboard /></ProtectedRoute> } />
        <Route path="*" element={<Navigate to={user ? "/reservaciones" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;