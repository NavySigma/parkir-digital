import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

export default function App(){
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <AppRoutes />
    </div>
  )
}
