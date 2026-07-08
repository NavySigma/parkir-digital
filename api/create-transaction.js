import { createClient } from '@supabase/supabase-js';
import midtransClient from 'midtrans-client';

export async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProd = serverKey && serverKey.startsWith('Mid-server-');

  const snap = new midtransClient.Snap({
    isProduction: isProd,
    serverKey: serverKey
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ success: false, message: 'Missing Environment Variables' });
  }

  try {
    const { customer_name, amount } = req.body;
    const finalAmount = amount || 2000;

    let tx_id;
    let retries = 0;
    while (true) {
      tx_id = Math.random().toString(36).substring(2, 10).toUpperCase();
      const { data: existing } = await supabase
        .from('transactions')
        .select('tx_id')
        .eq('tx_id', tx_id)
        .maybeSingle();
      if (!existing) break;
      retries++;
      if (retries > 5) throw new Error('Gagal generate ID unik');
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        { 
          tx_id, 
          customer_name: customer_name || 'Guest', 
          amount: finalAmount, 
          status: 'pending' 
        }
      ]);

    if (error) throw error;

    let parameter = {
      "transaction_details": { "order_id": tx_id, "gross_amount": finalAmount },
      "customer_details": { "first_name": customer_name || 'Guest' }
    };

    const transaction = await snap.createTransaction(parameter);
    
    await supabase
      .from('transactions')
      .update({ 
        snap_token: transaction.token,
        payment_url: transaction.redirect_url
      })
      .eq('tx_id', tx_id);

    return res.status(200).json({
      success: true,
      transaction: { tx_id, amount: finalAmount, snap_token: transaction.token, status: 'pending' }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export default handler;
