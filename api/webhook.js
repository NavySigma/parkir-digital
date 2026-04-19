import { createClient } from '@supabase/supabase-js';
import midtransClient from 'midtrans-client';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const serverKey = process.env.MIDTRANS_SERVER_KEY;
const isProd = serverKey && serverKey.startsWith('Mid-server-');

let apiClient = new midtransClient.Snap({
  isProduction: isProd,
  serverKey: serverKey
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const notificationJson = req.body;

    const statusResponse = await apiClient.transaction.notification(notificationJson);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let dbStatus = 'pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        dbStatus = 'pending';
      } else if (fraudStatus === 'accept') {
        dbStatus = 'paid';
      }
    } else if (transactionStatus === 'settlement') {
      dbStatus = 'paid';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      dbStatus = 'failed';
    } else if (transactionStatus === 'pending') {
      dbStatus = 'pending';
    }

    const updateData = { status: dbStatus };
    if (dbStatus === 'paid') {
      updateData.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('tx_id', orderId);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
