import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const { error } = await supabase
      .from('contacts')
      .insert([{ name, email, message }]);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
