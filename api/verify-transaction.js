import { createClient } from '@supabase/supabase-js';

export async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { tx_id } = req.body;
  if (!tx_id) return res.status(400).json({ success: false, message: 'Missing tx_id' });

  try {
    // Ambil status sekarang
    const { data: currentTx } = await supabase.from('transactions').select('status').eq('tx_id', tx_id).single();

    // Hanya update ke 'verified' jika statusnya masih 'pending'
    if (currentTx && currentTx.status === 'pending') {
      await supabase.from('transactions').update({ status: 'verified' }).eq('tx_id', tx_id);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
export default handler;
