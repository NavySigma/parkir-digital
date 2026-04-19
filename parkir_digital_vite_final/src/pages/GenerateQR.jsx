import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

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

  if (loading) return <div className="p-6">Generating ticket...</div>;
  if (!tx) return <div className="p-6 text-center">No transaction found.</div>;

  // QR points to your frontend pay route
  const payUrl = `${window.location.origin}/pay/${tx.tx_id}`;

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Ticket / QR untuk bayar Rp2.000</h2>
      <QRCode value={payUrl} size={220} />
      <p className="mt-2">Order: {tx.tx_id}</p>
      <p>Status: {tx.status}</p>
    </div>
  );
}
