import { createClient } from '@supabase/supabase-js';

export async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { tx_id } = req.body;

  try {
    const { error } = await supabase
      .from('transactions')
      .update({ 
        // Mengubah status menjadi 'completed' atau tetap 'paid' tapi update timestamp
        status: 'paid', 
        paid_at: new Date().toISOString(),
        // Jika ada kolom khusus petugas, bisa ditambahkan di sini, misal:
        // verified_by_officer: true 
      })
      .eq('tx_id', tx_id);

    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
export default handler;
