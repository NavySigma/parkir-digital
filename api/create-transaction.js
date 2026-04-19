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

  // Hanya terima POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ success: false, message: 'Missing Supabase Environment Variables' });
  }

  try {
    const { customer_name, amount } = req.body;
    const finalAmount = amount || 2000;
    const tx_id = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`;

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
    
    await supabase
      .from('transactions')
      .update({ 
        snap_token: transaction.token,
        payment_url: transaction.redirect_url
      })
      .eq('tx_id', tx_id);

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
