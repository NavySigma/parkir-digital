import { createClient } from '@supabase/supabase-js';
import midtransClient from 'midtrans-client';

// 1. Setup Supabase & Midtrans
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

let snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY
});

export default async function handler(req, res) {
  // Hanya terima POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { customer_name, amount } = req.body;
    const finalAmount = amount || 2000;
    const tx_id = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`;

    // 2. Simpan ke PostgreSQL (Supabase)
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        { 
          tx_id: tx_id, 
          customer_name: customer_name || 'Guest', 
          amount: finalAmount, 
          status: 'pending' 
        }
      ])
      .select();

    if (error) throw error;

    // 3. Request ke Midtrans Snap
    let parameter = {
      "transaction_details": {
        "order_id": tx_id,
        "gross_amount": finalAmount
      },
      "customer_details": {
        "first_name": customer_name || 'Guest'
      }
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Update data transaksi dengan token & redirect url
    await supabase
      .from('transactions')
      .update({ 
        snap_token: transaction.token,
        payment_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${transaction.token}`
      })
      .eq('tx_id', tx_id);

    // 4. Balikin hasil ke Frontend
    return res.status(200).json({
      success: true,
      transaction: {
        tx_id,
        amount: finalAmount,
        snap_token: transaction.token,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
