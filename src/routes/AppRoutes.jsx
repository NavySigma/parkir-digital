import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import GenerateQR from "../pages/GenerateQR";
import PayPage from "../pages/PayPage";
import VerifyPage from "../pages/VerifyPage";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/qrcode" element={<GenerateQR />} />
      <Route path="/pay/:tx_id" element={<PayPage/>} />
      <Route path="/verify/:tx_id" element={<VerifyPage/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
