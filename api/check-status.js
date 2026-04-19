import { createClient } from '@supabase/supabase-js';

export async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { tx_id } = req.query;

  if (!tx_id) {
    return res.status(400).json({ success: false, message: 'Missing tx_id' });
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('tx_id', tx_id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    return res.status(200).json({ success: true, transaction: data });
  } catch (error) {
    console.error('Error fetching status:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export default handler;
