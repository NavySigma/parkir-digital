import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function GenerateQR() {
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
      // You can include customer data here if you want (name, phone, vehicle_plate)
      const body = {
        customer_name: user.username,
        amount: 2000
      };

      const res = await fetch("http://127.0.0.1:8000/api/transaction/create", {
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
  if (!tx) return <div className="p-6">Generating ticket...</div>;

  // QR should point to your frontend pay route
  const payUrl = `http://localhost:5173/pay/${tx.tx_id}`;

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Ticket / QR untuk bayar Rp2.000</h2>
      <QRCode value={payUrl} size={220} />
      <p className="mt-2">Order: {tx.tx_id}</p>
      <p>Status: {tx.status}</p>
    </div>
  );
}
