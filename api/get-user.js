import { createClient } from '@supabase/supabase-js';

export async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'user_id required' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return res.status(200).json({ success: true, user: data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export default handler;
