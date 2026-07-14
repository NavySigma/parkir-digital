import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdmin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, verified: 0 });
  const [txPage, setTxPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("account"));
    if (!stored || !stored.role) {
      alert("Akses ditolak!");
      navigate("/");
      return;
    }
    setAuthorized(true);
    setUser(stored);
    fetchData(1, 1);
  }, []);

  async function fetchData(txP, userP) {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/get-admin-data?tx_page=${txP}&user_page=${userP}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
        setUsers(data.users);
        setStats(data.stats);
        setTxPage(data.txPage);
        setUserPage(data.userPage);
        setTxTotalPages(data.txTotalPages);
        setUserTotalPages(data.userTotalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function Pagination({ page, total, onPage }) {
    if (total <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 p-3 border-t border-gray-50">
        <button onClick={() => onPage(page - 1)} disabled={page <= 1}
          className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 disabled:opacity-30 hover:bg-gray-200 transition-all">
          Prev
        </button>
        <span className="text-[10px] font-bold text-gray-400">Hlm {page} / {total}</span>
        <button onClick={() => onPage(page + 1)} disabled={page >= total}
          className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 disabled:opacity-30 hover:bg-gray-200 transition-all">
          Next
        </button>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Super Admin</h1>
          <p className="text-gray-400 text-sm font-bold">{user?.username}</p>
        </div>
        <button onClick={() => fetchData(txPage, userPage)}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
          disabled={loading}>
          {loading ? "Memuat..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Total Transaksi</p>
          <p className="text-3xl font-black mt-1">{stats.total}</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
          <p className="text-[10px] text-orange-500 uppercase font-bold">Pending</p>
          <p className="text-3xl font-black mt-1 text-orange-600">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <p className="text-[10px] text-blue-500 uppercase font-bold">Terverifikasi</p>
          <p className="text-3xl font-black mt-1 text-blue-600">{stats.verified}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
          <p className="text-[10px] text-green-500 uppercase font-bold">Lunas</p>
          <p className="text-3xl font-black mt-1 text-green-600">{stats.paid}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 text-white p-4">
            <h2 className="text-sm font-black uppercase tracking-widest">Transaksi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase tracking-wider">
                  <th className="p-3 text-left font-bold">ID</th>
                  <th className="p-3 text-left font-bold">Customer</th>
                  <th className="p-3 text-left font-bold">Status</th>
                  <th className="p-3 text-left font-bold">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="4" className="p-6 text-center text-gray-400 font-bold">Belum ada transaksi</td></tr>
                ) : transactions.map(tx => (
                  <tr key={tx.tx_id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="p-3 font-mono font-bold">{tx.tx_id}</td>
                    <td className="p-3">{tx.customer_name}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        tx.status === "paid" || tx.status === "settlement" ? "bg-green-100 text-green-700" :
                        tx.status === "verified" ? "bg-blue-100 text-blue-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>{tx.status}</span>
                    </td>
                    <td className="p-3 text-gray-400 font-mono text-[10px]">
                      {tx.created_at ? new Date(tx.created_at).toLocaleString("id-ID") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={txPage} total={txTotalPages} onPage={(p) => fetchData(p, userPage)} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 text-white p-4">
            <h2 className="text-sm font-black uppercase tracking-widest">Pengguna</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase tracking-wider">
                  <th className="p-3 text-left font-bold">Username</th>
                  <th className="p-3 text-left font-bold">Email</th>
                  <th className="p-3 text-left font-bold">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="3" className="p-6 text-center text-gray-400 font-bold">Belum ada pengguna</td></tr>
                ) : users.map(u => (
                  <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="p-3 font-bold">{u.username}</td>
                    <td className="p-3 text-gray-500">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        u.role ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                      }`}>{u.role ? "Petugas" : "User"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={userPage} total={userTotalPages} onPage={(p) => fetchData(txPage, p)} />
        </div>
      </div>
    </div>
  );
}
