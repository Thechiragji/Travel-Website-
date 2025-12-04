import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Lead() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // POSTS to pages/api/lead.js serverless route
      await axios.post("/api/lead", form);
      alert("Lead submitted — we will contact you shortly!");
      setForm({ name: "", phone: "", email: "", service: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Submission failed — you can also WhatsApp 8602837299");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center">Get a Quick Quote</h1>
        <p className="text-center text-sm text-gray-600 mt-2">Fill details and our agent will contact you</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Full name" className="p-3 border rounded" />
          <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone / WhatsApp" className="p-3 border rounded" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email (optional)" className="p-3 border rounded" />
          <select name="service" value={form.service} onChange={handleChange} className="p-3 border rounded">
            <option value="">Select service</option>
            <option>Flight Ticket</option>
            <option>Railway Ticket</option>
            <option>Bus Ticket</option>
            <option>Cab Booking</option>
            <option>Visa Service</option>
            <option>Passport Assistance</option>
          </select>
          <textarea name="message" value={form.message} onChange={handleChange} rows="4" placeholder="Message / route / travel dates" className="p-3 border rounded" />
          <button disabled={loading} className="bg-blue-600 text-white p-3 rounded">
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
