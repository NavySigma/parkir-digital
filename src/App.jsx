import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

export default function App(){
  const location = useLocation();
  
  const hideNavbar = location.pathname.startsWith('/verify/') || location.pathname.startsWith('/pay/') || location.pathname === '/petugas';

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </div>
  )
}
