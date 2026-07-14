import { createClient } from '@supabase/supabase-js';

export async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const txPage = parseInt(req.query.tx_page) || 1;
    const userPage = parseInt(req.query.user_page) || 1;
    const limit = 10;
    const txOffset = (txPage - 1) * limit;
    const userOffset = (userPage - 1) * limit;

    const [txRes, txCount, userRes, userCount] = await Promise.all([
      supabase.from("transactions").select("*").order("tx_id", { ascending: false }).range(txOffset, txOffset + limit - 1),
      supabase.from("transactions").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*").range(userOffset, userOffset + limit - 1),
      supabase.from("users").select("*", { count: "exact", head: true }),
    ]);

    const transactions = txRes.data || [];
    const users = userRes.data || [];
    const stats = {
      total: txCount.count || 0,
      pending: 0,
      verified: 0,
      paid: 0,
    };

    const allTx = await supabase.from("transactions").select("status");
    if (allTx.data) {
      stats.pending = allTx.data.filter(t => t.status === "pending").length;
      stats.verified = allTx.data.filter(t => t.status === "verified").length;
      stats.paid = allTx.data.filter(t => t.status === "paid" || t.status === "settlement").length;
    }

    return res.status(200).json({
      success: true,
      transactions,
      users,
      stats,
      txPage,
      userPage,
      txTotalPages: Math.ceil((txCount.count || 0) / limit),
      userTotalPages: Math.ceil((userCount.count || 0) / limit),
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export default handler;
