// Contact.js
import React, { useState } from "react";
import userApi from '../../services/userApi';
import toast from 'react-hot-toast';

const Contact = () => {
  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if all fields are filled
  const isFormValid = name.trim() && email.trim() && message.trim();

  // handle contact form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill out all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await userApi.sendContactMessage({ name, email, message });
      if (ok) {
        // reset form after submit
        setName("");
        setEmail("");
        setMessage("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-offWhite">

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <h1 className="text-4xl font-black text-gray-900 mb-6">Contact Us</h1>
          <p className="mb-8 text-gray-600">
            We'd love to hear from you! Whether you have a question, suggestion, or just want to say hi — reach out to us.
          </p>

          {/* Contact Info */}
          <div className="space-y-4 mb-8">
            <p className="flex items-center gap-3 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span><span className="font-semibold text-gray-900">Email:</span> support@weblinqo.com</span>
            </p>
          </div>

          {/* Contact form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="5"
                placeholder="Your message"
                className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full bg-primary hover:bg-white hover:text-primary border-primary border-2 border text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;