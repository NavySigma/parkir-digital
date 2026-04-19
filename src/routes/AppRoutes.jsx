import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import TmdbCallback from "../pages/TmdbCallback";
import GenerateQR from "../pages/GenerateQR";
import PayPage from "../pages/PayPage";
import VerifyPage from "../pages/VerifyPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/auth/tmdb/callback" element={<TmdbCallback />} />
      <Route path="/qrcode" element={<GenerateQR />} />
      <Route path="/pay/:tx_id" element={<PayPage/>} />
      <Route path="/verify/:tx_id" element={<VerifyPage/>} />
    </Routes>
  );
}
