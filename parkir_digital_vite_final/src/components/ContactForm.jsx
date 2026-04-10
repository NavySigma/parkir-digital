import { useState } from "react";
import InputField from './InputField';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showPopup, setShowPopup] = useState(null); // null | 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("http://localhost:8000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(formData)
    });


    if (!res.ok) throw new Error("Gagal");

    setShowPopup("success");
    setFormData({ name: "", email: "", message: "" });
  } catch (err) {
    setShowPopup("error");
  } finally {
    setLoading(false);
    setTimeout(() => setShowPopup(null), 3000);
  }
};


  return (
    <div className="relative">
      {showPopup === "success" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full
                        bg-green-600 text-white px-4 py-1 rounded-md shadow-md whitespace-nowrap">
          ✅ Pesan anda berhasil terkirim
        </div>
      )}
      {showPopup === "error" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full
                        bg-red-600 text-white px-4 py-1 rounded-md shadow-md whitespace-nowrap">
          ❌ Gagal mengirim pesan
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded-md shadow-md space-y-4">
        <InputField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        <label className="block">
          <div className="mb-1 font-medium">Message</div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            rows="5"
          ></textarea>
        </label>

        <div className="text-right">
          <button disabled={loading} className="px-4 py-2 bg-primary text-white rounded-md">
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
