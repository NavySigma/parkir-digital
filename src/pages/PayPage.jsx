import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PayPage() {
  const { tx_id } = useParams();
  const [message, setMessage] = useState('Sedang menyiapkan pembayaran...');
  const [error, setError] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function doRedirect() {
      try {
        // 1. Ambil data transaksi dari database lewat API kita
        const res = await fetch(`${API_URL}/check-status?tx_id=${tx_id}`);
        const data = await res.json();

        if (!data.success) {
          setMessage('Maaf, transaksi tidak ditemukan atau sudah kedaluwarsa.');
          setError(true);
          return;
        }

        const tx = data.transaction;

        // 2. Jika sudah bayar, jangan ke Midtrans lagi
        if (tx.status === 'paid' || tx.status === 'settlement') {
          setMessage('Transaksi ini sudah dibayar. Terima kasih!');
          return;
        }

        if (!tx.payment_url) {
          setMessage('URL Pembayaran belum siap. Silakan coba beberapa saat lagi.');
          setError(true);
          return;
        }

        // 3. LANGSUNG ALIHKAN KE MIDTRANS
        setMessage('Mengalihkan ke halaman pembayaran Midtrans...');
        window.location.href = tx.payment_url;

      } catch (e) {
        console.error(e);
        setMessage('Gagal menghubungi server. Pastikan koneksi internet stabil.');
        setError(true);
      }
    }

    if (tx_id) {
      doRedirect();
    }
  }, [tx_id, API_URL]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 text-center">
      <div className={`p-8 bg-white rounded-2xl shadow-xl border-t-4 ${error ? 'border-red-500' : 'border-blue-500'}`}>
        {!error && !message.includes('sudah dibayar') && (
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
        
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {error ? 'Waduh!' : 'Mohon Tunggu'}
        </h2>
        
        <p className={`text-sm ${error ? 'text-red-500' : 'text-gray-600'}`}>
          {message}
        </p>

        {error && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-full text-xs font-semibold"
          >
            Coba Lagi
          </button>
        )}
      </div>
      
      <p className="mt-8 text-xs text-gray-400 font-mono">ID: {tx_id}</p>
    </div>
  );
}
