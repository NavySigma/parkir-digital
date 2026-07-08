import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PetugasScan() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const scannerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
    startScanner();
    return () => stopScanner();
  }, []);

  async function startScanner() {
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("barcode-scanner");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 100 },
        },
        onScanSuccess,
        onScanFailure,
      );
    } catch (e) {
      setError(e.message || "Kamera tidak tersedia");
      console.log("Scan manual via input tersedia");
    }
  }

  function stopScanner() {
    if (scannerRef.current) {
      try { scannerRef.current.stop(); } catch (e) {}
      try { scannerRef.current.clear(); } catch (e) {}
      scannerRef.current = null;
    }
  }

  function onScanSuccess(decodedText) {
    stopScanner();
    const id = decodedText.trim().toUpperCase();
    if (id) navigate(`/verify/${id}`);
  }

  function onScanFailure(e) {}

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      const val = e.target.value.trim().toUpperCase();
      if (val) navigate(`/verify/${val}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase">Scan Petugas</h2>
          <p className="text-[10px] opacity-75 mt-1 font-bold uppercase tracking-widest">
            Scan barcode tiket untuk verifikasi
          </p>
        </div>

        <div className="p-6">
          <div id="barcode-scanner" className="w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center text-gray-400 text-xs font-bold uppercase">
            {error ? (
              <span className="text-red-400 p-4 text-center">{error}</span>
            ) : (
              <span>Mengaktifkan kamera...</span>
            )}
          </div>

          <div className="relative">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Atau ketik ID Tiket</label>
            <input
              ref={inputRef}
              type="text"
              onKeyDown={handleKeyDown}
              placeholder="Ketik ID lalu tekan Enter..."
              className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-center text-lg font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-8 text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
      >
        ← Kembali
      </button>
    </div>
  );
}
