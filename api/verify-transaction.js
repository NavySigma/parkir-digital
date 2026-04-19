import { createClient } from '@supabase/supabase-js';

export async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { tx_id } = req.body;

  if (!tx_id) {
    return res.status(400).json({ success: false, message: 'Missing tx_id' });
  }

  try {
    // Update status menjadi 'verified' (artinya petugas sudah scan)
    const { error } = await supabase
      .from('transactions')
      .update({ status: 'verified' })
      .eq('tx_id', tx_id);

    if (error) throw error;

    return res.status(200).json({ success: true, message: 'Transaction verified successfully' });
  } catch (error) {
    console.error('Verify Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export default handler;
