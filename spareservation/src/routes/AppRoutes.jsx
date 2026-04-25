import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard'; 
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import CitasDelDia from '../pages/CitasDelDia';

const AppRoutes = () => {
  const { user } = useAuth();

  const getHomeRoute = () => {
    if (user?.rol === 'admin') return '/reservaciones'; 
    return '/citas-dia'; 
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={getHomeRoute()} /> : <Login />} />
        <Route path="/reservaciones" element={<ProtectedRoute><Dashboard /></ProtectedRoute> } />
        <Route path="/citas-dia" element={<ProtectedRoute><CitasDelDia /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={user ? getHomeRoute() : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;