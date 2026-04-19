import hero from '../assets/images/bike.png';
import laptop from '../assets/images/laptop.png';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function Home(){
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("account"));

  const handlePayClick = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Silakan login terlebih dahulu untuk melakukan pembayaran.");
      // Karena login di Navbar menggunakan TMDB, kita beri tahu user
      // atau bisa kita arahkan ke halaman tertentu jika ada.
      // Untuk sekarang, Rea tampilkan alert dan tetap di home agar user klik 'Login' di Navbar.
      return;
    }
    navigate('/qrcode');
  };

  return (
    <main className="container mx-auto p-8">
      <section className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-md shadow-md">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-extrabold mb-4 text-gray-900">PARKIR DIGITAL</h2>
          <p className="text-gray-600 mb-4">Parkir Digital yang Cepat dan Efisien</p>
          <p className="mb-4">Solusi parkir cerdas untuk memudahkan pencarian lokasi parkir secara real-time.</p>
          <button 
            onClick={handlePayClick}
            className="inline-block px-8 py-4 bg-primary text-white rounded-md font-bold shadow-lg active:scale-95 transition-transform"
          >
            Bayar Disini
          </button>
        </div>
        <img src={hero} alt="hero" className="md:w-1/2 w-full" />
      </section>

      <section className="mt-8 bg-white p-8 rounded-md shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-center">Kenapa Memilih Kami?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 rounded-xl text-center border border-gray-100 font-medium">Booking Cepat</div>
          <div className="p-6 bg-gray-50 rounded-xl text-center border border-gray-100 font-medium">Sistem Keamanan Tinggi</div>
          <div className="p-6 bg-gray-50 rounded-xl text-center border border-gray-100 font-medium">Dukungan 24/7</div>
        </div>
      </section>

      <section className="mt-12 text-center">
        <h3 className="text-2xl font-bold mb-6">Mudah Digunakan di Mana Saja</h3>
        <img src={laptop} alt="illustration" className="w-full max-w-2xl mx-auto rounded-2xl" />
      </section>

      <Footer />
    </main>
  )
}
