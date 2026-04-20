import { useState } from 'react';
import hero from '../assets/images/bike.png';
import laptop from '../assets/images/laptop.png';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function Home(){
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("account"));

  // --- LOGIKA MINIGAME ---
  const gridSize = 5;
  const [carPos, setCarPos] = useState({ x: 0, y: 4 });
  const [targetPos] = useState({ x: 4, y: 0 });
  const [obstacles] = useState([
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
    { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }
  ]);
  const [gameStatus, setGameStatus] = useState("playing");

  const moveCar = (dx, dy) => {
    if (gameStatus !== "playing") return;
    const newX = Math.max(0, Math.min(gridSize - 1, carPos.x + dx));
    const newY = Math.max(0, Math.min(gridSize - 1, carPos.y + dy));
    
    const hitObstacle = obstacles.find(obs => obs.x === newX && obs.y === newY);
    if (hitObstacle) {
      setGameStatus("hit");
      setTimeout(() => resetGame(), 1000);
      return;
    }

    setCarPos({ x: newX, y: newY });
    if (newX === targetPos.x && newY === targetPos.y) {
      setGameStatus("won");
    }
  };

  const resetGame = () => {
    setCarPos({ x: 0, y: 4 });
    setGameStatus("playing");
  };
  // -----------------------

  const handlePayClick = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Silakan login terlebih dahulu untuk melakukan pembayaran.");
      navigate('/login');
      return;
    }
    navigate('/qrcode');
  };

  return (
    <main className="container mx-auto p-8">
      {/* SECTION HERO */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-md shadow-md">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-extrabold mb-4 text-gray-900 uppercase">PARKIR DIGITAL</h2>
          <p className="text-gray-600 mb-4 font-medium">Parkir Digital yang Cepat dan Efisien</p>
          <p className="mb-6 text-gray-500">Solusi parkir cerdas untuk memudahkan pencarian lokasi parkir secara real-time dan pembayaran digital yang aman.</p>
          <button 
            onClick={handlePayClick}
            className="inline-block px-10 py-4 bg-primary text-white rounded-md font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
          >
            Bayar Disini
          </button>
        </div>
        <img src={hero} alt="hero" className="md:w-1/2 w-full transform hover:scale-105 transition-transform duration-500" />
      </section>

      {/* SECTION WHY CHOOSE US */}
      <section className="mt-8 bg-white p-10 rounded-md shadow-md">
        <h3 className="text-xl font-bold mb-8 text-center uppercase tracking-wider">Why choose us</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 rounded-xl text-center border border-gray-100 hover:shadow-inner transition-shadow">
            <div className="text-3xl mb-3">⚡</div>
            <p className="font-bold text-gray-800">Fast booking</p>
            <p className="text-xs text-gray-400 mt-2">Pesan tiket hanya dalam hitungan detik tanpa antri.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-xl text-center border border-gray-100 hover:shadow-inner transition-shadow">
            <div className="text-3xl mb-3">🛡️</div>
            <p className="font-bold text-gray-800">Secure</p>
            <p className="text-xs text-gray-400 mt-2">Transaksi aman terenkripsi melalui sistem Midtrans.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-xl text-center border border-gray-100 hover:shadow-inner transition-shadow">
            <div className="text-3xl mb-3">📞</div>
            <p className="font-bold text-gray-800">24/7 Support</p>
            <p className="text-xs text-gray-400 mt-2">Layanan bantuan pelanggan siap membantu kapan saja.</p>
          </div>
        </div>
      </section>

      {/* MINIGAME SECTION */}
      <section className="mt-8 bg-gray-900 p-8 rounded-md shadow-md text-white overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-black mb-4 uppercase italic">Parking Master Challenge</h3>
            <p className="text-gray-400 mb-6 text-sm">Gunakan tombol panah untuk memarkir mobil di area hijau tanpa menabrak rintangan!</p>
            
            {/* CONTROLS */}
            <div className="grid grid-cols-3 gap-2 w-40 mx-auto md:mx-0">
              <div/>
              <button onClick={() => moveCar(0, -1)} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl">▲</button>
              <div/>
              <button onClick={() => moveCar(-1, 0)} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl">◀</button>
              <button onClick={() => moveCar(0, 1)} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl">▼</button>
              <button onClick={() => moveCar(1, 0)} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl">▶</button>
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col items-center">
            <div className="grid grid-cols-5 gap-1 bg-gray-800 p-2 rounded-xl border-2 border-gray-700">
              {[...Array(gridSize * gridSize)].map((_, i) => {
                const x = i % gridSize;
                const y = Math.floor(i / gridSize);
                const isCar = carPos.x === x && carPos.y === y;
                const isTarget = targetPos.x === x && targetPos.y === y;
                const isObstacle = obstacles.find(obs => obs.x === x && obs.y === y);
                return (
                  <div key={i} className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl ${
                    isTarget ? 'bg-green-500/20 border border-green-500' : isObstacle ? 'bg-red-500/20 border border-red-500' : 'bg-gray-700/50'
                  }`}>
                    {isCar ? '🚗' : isTarget ? '🅿️' : isObstacle ? '🚧' : ''}
                  </div>
                );
              })}
            </div>
            {gameStatus === 'won' && <p className="mt-4 text-green-500 font-bold animate-bounce text-sm">YOU WIN! 🅿️🏆</p>}
            {gameStatus === 'hit' && <p className="mt-4 text-red-500 font-bold animate-shake text-sm">CRASHED! 💥</p>}
          </div>
        </div>
      </section>

      {/* SECTION ILLUSTRATION */}
      <section className="mt-8 text-center">
        <div className="bg-white p-8 rounded-md shadow-md inline-block w-full">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 uppercase">Kelola Parkir dalam Genggaman</h3>
          <img src={laptop} alt="illustration" className="w-full max-w-2xl mx-auto rounded-lg" />
        </div>
      </section>

      <Footer />
    </main>
  )
}
