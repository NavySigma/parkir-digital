import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PayPage() {
  const { tx_id } = useParams();
  const [message, setMessage] = useState('Redirecting to payment...');

  useEffect(() => {
    async function doRedirect() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/transaction/status/${tx_id}`);
        const data = await res.json();
        if (!data.success) {
          setMessage('Transaksi tidak ditemukan');
          return;
        }
        const tx = data.transaction;
        if (!tx.payment_url) {
          setMessage('Payment URL belum tersedia, coba lagi nanti');
          return;
        }
        // Redirect to Midtrans payment page (VT-Web)
        window.location.href = tx.payment_url;
      } catch (e) {
        console.error(e);
        setMessage('Gagal menghubungi server');
      }
    }
    doRedirect();
  }, [tx_id]);

  return <div className="p-6">{message}</div>;
}
