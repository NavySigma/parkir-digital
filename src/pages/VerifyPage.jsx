import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VerifyPage() {
  const { tx_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/check-status?tx_id=${tx_id}`);
      const data = await res.json();
      if (data.success) setTx(data.transaction);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function autoVerify() {
      try {
        // Otomatis verifikasi agar user dialihkan ke Midtrans
        await fetch(`${API_URL}/verify-transaction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx_id })
        });
        fetchStatus();
      } catch (e) {
        fetchStatus();
      }
    }
    if (tx_id) autoVerify();

    // Polling setiap 2 detik untuk memantau status pembayaran user
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [tx_id]);

  const handleFinalACC = async () => {
    setIsConfirming(true);
    try {
      const res = await fetch(`${API_URL}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_id })
      });
      const data = await res.json();
      if (data.success) {
        alert("TRANSAKSI SELESAI! Menutup halaman...");
        // KEPENTAL KELUAR (Redirect ke home atau halaman scan baru)
        window.location.href = '/'; 
      }
    } catch (e) {
      alert("Gagal melakukan ACC.");
    } finally {
      setIsConfirming(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">MENGECEK TIKET...</div>;
  if (!tx) return <div className="p-10 text-center text-red-500 font-bold">TIKET TIDAK VALID</div>;

  const isPaid = tx.status === 'paid' || tx.status === 'settlement';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase">Validasi Petugas</h2>
          <p className="text-[10px] opacity-75 mt-1 font-bold uppercase tracking-widest">Pengecekan Pembayaran Akhir</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-end border-b pb-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">User</p>
              <p className="font-bold text-gray-800 text-lg leading-none mt-1">{tx.customer_name}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Biaya Parkir</p>
              <p className="font-black text-2xl text-gray-900 leading-none mt-1">Rp2.000</p>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border-2 text-center transition-all ${isPaid ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200 animate-pulse'}`}>
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Status Pembayaran User</p>
            <div className={`text-xl font-black uppercase tracking-tighter ${isPaid ? 'text-green-600' : 'text-orange-500'}`}>
              {isPaid ? '✓ LUNAS / PAID' : '⌛ MENUNGGU USER...'}
            </div>
          </div>

          <div className="pt-4">
            {isPaid ? (
              <button
                onClick={handleFinalACC}
                disabled={isConfirming}
                className="w-full bg-gray-900 text-white py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 shadow-green-900/20"
              >
                {isConfirming ? 'MEMPROSES...' : 'KLIK UNTUK ACC & SELESAI'}
              </button>
            ) : (
              <div className="w-full bg-gray-200 text-gray-400 py-5 rounded-2xl text-sm font-black uppercase tracking-widest text-center cursor-not-allowed">
                TOMBOL ACC TERKUNCI
              </div>
            )}
            {!isPaid && <p className="text-[9px] text-center text-gray-400 mt-3 italic uppercase font-bold tracking-tight">Tombol aktif otomatis setelah user membayar via Midtrans</p>}
          </div>
        </div>

        <div className="p-4 bg-gray-50 text-center border-t border-dashed">
          <p className="text-[9px] text-gray-400 font-mono tracking-tighter">ORDER ID: {tx.tx_id}</p>
        </div>
      </div>
      
      <button 
        onClick={() => window.location.href = '/'}
        className="mt-8 text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
      >
        ← BATALKAN & KEMBALI
      </button>
    </div>
  );
}
