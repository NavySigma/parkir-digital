import { createClient } from '@supabase/supabase-js';

export async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, email, username } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: 'id required' });
  }

  try {
    const { error } = await supabase
      .from('users')
      .insert({ id, email, username: username || email, role: false });

    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export default handler;
