import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VerifyPage() {
  const { tx_id } = useParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Sedang memverifikasi tiket...');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`${API_URL}/verify-transaction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx_id })
        });
        const data = await res.json();

        if (data.success) {
          setStatus('success');
          setMessage('Tiket Berhasil Diverifikasi! Pengendara akan diarahkan ke pembayaran.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Gagal memverifikasi tiket.');
        }
      } catch (e) {
        setStatus('error');
        setMessage('Terjadi kesalahan koneksi.');
      }
    }

    if (tx_id) verify();
  }, [tx_id, API_URL]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full border-t-8 border-gray-900">
        <h2 className="text-2xl font-black mb-4">PETUGAS PARKIR</h2>
        
        {status === 'processing' && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900 mx-auto my-6"></div>
        )}

        {status === 'success' && (
          <div className="text-green-500 text-6xl mb-4">✓</div>
        )}

        {status === 'error' && (
          <div className="text-red-500 text-6xl mb-4">✕</div>
        )}

        <p className={`font-semibold ${status === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
          {message}
        </p>

        <p className="mt-6 text-[10px] text-gray-400 font-mono italic">
          Transaction ID: {tx_id}
        </p>
      </div>
    </div>
  );
}
