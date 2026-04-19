import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function GenerateQR() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("account")) || null;

  useEffect(() => {
    if (user) {
      createTransaction();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (tx && tx.status !== 'verified') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/check-status?tx_id=${tx.tx_id}`);
          const data = await res.json();
          if (data.success && data.transaction.status === 'verified') {
            clearInterval(interval);
            window.location.href = data.transaction.payment_url;
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [tx, API_URL]);

  async function createTransaction() {
    setLoading(true);
    try {
      const body = { customer_name: user.username, amount: 2000 };
      const res = await fetch(`${API_URL}/create-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setTx(data.transaction);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <div className="p-10 text-center font-bold">Silakan login terlebih dahulu.</div>;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div><p>Menyiapkan Tiket...</p></div>
    </div>
  );

  if (!tx) return <div className="p-6 text-center">Gagal memuat tiket.</div>;

  const verifyUrl = `${window.location.origin}/verify/${tx.tx_id}`;

  return (
    <div className="p-4 md:p-8 flex justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gray-900 p-6 text-white text-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase">Tiket Parkir</h2>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Tunjukkan ke Petugas untuk Scan</p>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashed">
            <div><p className="text-[10px] text-gray-400 uppercase font-bold">User</p><p className="font-bold">{user.username}</p></div>
            <div className="text-right"><p className="text-[10px] text-gray-400 uppercase font-bold">Biaya</p><p className="font-black text-xl text-green-600">Rp2.000</p></div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl shadow-inner">
              <QRCodeSVG value={verifyUrl} size={180} level={"H"} />
            </div>
            <p className="mt-4 text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest italic animate-pulse text-center">
              Menunggu Scan Petugas di Lokasi...
            </p>
          </div>
        </div>

        <div className="p-8 bg-gray-50 text-center border-t border-dashed">
          <p className="text-[10px] text-gray-400 leading-tight uppercase font-bold">
            Halaman ini akan otomatis dialihkan ke pembayaran setelah petugas melakukan verifikasi fisik.
          </p>
          <p className="mt-4 text-[9px] text-gray-300 font-mono">ORDER ID: {tx.tx_id}</p>
        </div>
      </div>
    </div>
  );
}
