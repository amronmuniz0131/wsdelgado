"use client";

import { Placeholder } from "@/components/Placeholder";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [sentAmount, setSentAmount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('sent_amount');
    if (stored) setSentAmount(parseInt(stored));
  }, []);

  const handleSubmit = async (e) => {
    setSentAmount(parseInt(sentAmount) + 1);
    localStorage.setItem('sent_amount', parseInt(sentAmount) + 1);
    e.preventDefault();
    setStatus("Sending...");

    try {
      if (parseInt(sentAmount) >= 3) {
        setStatus("You have sent 3 messages already. Please try again later.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Form */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-12">
              Contact
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full border-gray-300 border-b focus:border-gray-900 focus:ring-0 pl-2 text-black sm:text-sm py-2 px-0 bg-transparent placeholder-gray-400"
                  placeholder="Name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full border-gray-300 border-b focus:border-gray-900 focus:ring-0 pl-2 text-black sm:text-sm py-2 px-0 bg-transparent placeholder-gray-400"
                  placeholder="Email"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="block w-full border-gray-300 border-b focus:border-gray-900 focus:ring-0 pl-2 text-black sm:text-sm py-2 px-0 bg-transparent placeholder-gray-400"
                  placeholder="Subject"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="block w-full border-gray-300 border-b focus:border-gray-900 focus:ring-0 pl-2 text-black sm:text-sm py-2 px-0 bg-transparent placeholder-gray-400 resize-none"
                  placeholder="Message"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === "Sending..."}
                  className="w-full bg-gray-200 text-gray-900 py-3 px-6 rounded-none text-sm font-bold uppercase tracking-wider hover:bg-gray-300 transition-colors border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "Sending..." ? "Sending..." : "Send Message"}
                </button>
                {status && status !== "Sending..." && (
                  <p className={`mt-4 text-sm font-medium ${status.includes("success") ? "text-green-600" : "text-rose-600"}`}>
                    {status}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Placeholder */}
          <div className="h-full min-h-[400px]">
            <img src="https://img.freepik.com/premium-photo/construction-team-working-with-blueprints-modern-devices-office_161094-12264.jpg" alt="Contact" className="w-full object-contain h-full min-h-[400px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
