import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function GenerateQR() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("account")) || {
    username: "Guest",
    id: "0000",
  };

  useEffect(() => {
    createTransaction();
    // eslint-disable-next-line
  }, []);

  async function createTransaction() {
    setLoading(true);
    try {
      const body = {
        customer_name: user.username,
        amount: 2000
      };

      const res = await fetch(`${API_URL}/create-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setTx(data.transaction);
      } else {
        alert(data.message || "Gagal membuat transaksi");
      }
    } catch (e) {
      console.error(e);
      alert("Error creating transaction");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Menyiapkan Tiket...</p>
      </div>
    </div>
  );

  if (!tx) return <div className="p-6 text-center">Transaksi tidak ditemukan.</div>;

  // ISI QR CODE ADALAH LINK LENGKAP
  const payUrl = `${window.location.origin}/pay/${tx.tx_id}`;

  return (
    <div className="p-4 md:p-8 flex justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header Tiket */}
        <div className="bg-gray-900 p-6 text-white text-center">
          <h2 className="text-2xl font-black tracking-tighter">PARKIR DIGITAL</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">E-Ticket & Payment</p>
        </div>

        {/* Info Area */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashed">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Pengendara</p>
              <p className="font-bold text-gray-800">{user.username}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Biaya Parkir</p>
              <p className="font-black text-xl text-green-600">Rp2.000</p>
            </div>
          </div>

          {/* AREA QR CODE */}
          <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl shadow-inner">
              <QRCodeSVG 
                value={payUrl} 
                size={180}
                level={"H"} // High error correction agar mudah di-scan
                includeMargin={false}
              />
            </div>
            <p className="mt-4 text-[10px] text-gray-500 font-mono font-bold">
              ID: {tx.tx_id}
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-bold uppercase">Tanggal</span>
              <span className="text-gray-700 font-semibold">{new Date().toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-bold uppercase">Status</span>
              <span className="text-orange-500 font-black uppercase tracking-wider">{tx.status}</span>
            </div>
          </div>
        </div>

        {/* Footer / Cut Line (Sobekan Tiket) */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-200 -translate-y-1/2"></div>
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full shadow-inner"></div>
          <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full shadow-inner"></div>
        </div>

        <div className="p-6 bg-gray-50 text-center">
          <p className="text-[10px] text-gray-400 leading-tight uppercase font-bold tracking-tight">
            Arahkan kamera HP ke QR Code di atas<br/>
            untuk melakukan pembayaran Midtrans.
          </p>
          
          <button 
            onClick={() => window.open(payUrl, '_blank')}
            className="mt-4 w-full bg-gray-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <span>Scan Sekarang</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
