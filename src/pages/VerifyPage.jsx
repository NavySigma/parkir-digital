import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VerifyPage() {
  const { tx_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState(null);
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/check-status?tx_id=${tx_id}`);
      const data = await res.json();
      if (data.success) {
        setTx(data.transaction);
      } else {
        setMessage('Transaksi tidak ditemukan.');
      }
    } catch (e) {
      setMessage('Gagal mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tx_id) fetchStatus();
  }, [tx_id]);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch(`${API_URL}/verify-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_id })
      });
      const data = await res.json();
      if (data.success) {
        await fetchStatus(); // Refresh data
        alert('Berhasil Verifikasi! Halaman user akan otomatis beralih.');
      }
    } catch (e) {
      alert('Gagal verifikasi.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  );

  if (!tx) return <div className="p-10 text-center font-bold text-red-500">{message || 'Data tidak tersedia'}</div>;

  const isPaid = tx.status === 'paid' || tx.status === 'settlement';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200">
        <div className="bg-gray-900 p-6 text-white text-center">
          <h2 className="text-xl font-black tracking-widest uppercase">Panel Petugas</h2>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Verifikasi & Status Pembayaran</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Nama Pelanggan</p>
              <p className="font-bold text-gray-800 text-lg">{tx.customer_name}</p>
            </div>

            <div className="pb-3 border-b border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Nominal Pembayaran</p>
              <p className="font-black text-xl text-gray-900">Rp{tx.amount?.toLocaleString('id-ID')}</p>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Status Pembayaran</p>
              <div className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                isPaid ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {isPaid ? '✓ Sudah Bayar' : '● Belum Bayar'}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
            <p className="text-[10px] text-gray-400 uppercase font-bold text-center mb-4">Aksi Petugas</p>
            
            {tx.status === 'verified' || isPaid ? (
              <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-center text-xs font-bold uppercase tracking-tight">
                {isPaid ? 'Pembayaran Berhasil Diterima' : 'Tiket Sudah Diverifikasi'}
              </div>
            ) : (
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-xl disabled:opacity-50"
              >
                {isVerifying ? 'Memproses...' : 'Konfirmasi & Alihkan User'}
              </button>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 text-center">
          <p className="text-[10px] text-gray-400 font-mono">Order ID: {tx.tx_id}</p>
        </div>
      </div>

      <button 
        onClick={() => window.location.reload()}
        className="mt-6 text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-gray-600"
      >
        Refresh Data
      </button>
    </div>
  );
}
