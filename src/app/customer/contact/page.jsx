"use client";

import PageSectionHeader from "@/components/ui/PageHeader";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaInstagram,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const subject = form.subject.value;
    const message = form.message.value;

    // Format WhatsApp message
    const whatsappMessage = `New Contact Form Submission:%0A%0AName: ${name}%0AEmail: ${email}%0ASubject: ${subject}%0AMessage: ${message}`;

    // Open WhatsApp with pre-filled message
    window.open(
      `https://wa.me/2347052555505?text=${whatsappMessage}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <section className="container mx-auto px-6 py-6">
        <PageSectionHeader
          title="Get In Touch"
          subtitle="We'd love to hear from you!"
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-pink-800 mb-6 font-serif">
              Send Us a Message
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-pink-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-pink-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-pink-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="What's this about?"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-pink-700 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                Send via WhatsApp <IoMdSend className="text-lg" />
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-pink-800 mb-6 font-serif">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full text-pink-600">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-pink-800 mb-2">
                      Our Boutiques
                    </h3>
                    <ul className="text-pink-700 space-y-2 list-disc list-inside">
                      <li>
                        <span className="font-semibold">Ready to Wear:</span>{" "}
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Shop+204,+Maitama+Mall,+Osun+Crescent"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-pink-800"
                        >
                          Shop 204, Maitama Mall, Osun Crescent
                        </a>
                      </li>
                      <li>
                        <span className="font-semibold">Bespoke:</span>{" "}
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Number+6+Oyo+Street,+Garki+Area+II"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-pink-800"
                        >
                          Number 6 Oyo Street, Garki Area II
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full text-pink-600">
                    <FaPhoneAlt className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-pink-800">Phone</h3>
                    <a
                      href="tel:+2347052555505"
                      className="text-pink-700 hover:text-pink-800 transition-colors"
                    >
                      +234 705 255 5505
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full text-pink-600">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-pink-800">Email</h3>
                    <a
                      href="mailto:info@icequeenbyice.com"
                      className="text-pink-700 hover:text-pink-800 transition-colors"
                    >
                      info@icequeenbyice.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full text-pink-600">
                    <FaClock className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-pink-800">Store Hours</h3>
                    <p className="text-pink-700">Monday - Friday: 10am - 8pm</p>
                    <p className="text-pink-700">Saturday: 10am - 9pm</p>
                    <p className="text-pink-700">Sunday: 11am - 6pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-pink-800 mb-6 font-serif">
                Connect With Us
              </h2>
              <p className="text-pink-700 mb-6">
                Follow us on social media for the latest styles, promotions, and
                fashion tips!
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://instagram.com/icequeenbyice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-6 py-2 rounded-full font-medium transition-colors duration-300 flex items-center gap-2"
                >
                  <FaInstagram className="text-lg" /> Instagram
                </a>
                <button className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-6 py-2 rounded-full font-medium transition-colors duration-300">
                  Facebook
                </button>
                <button className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-6 py-2 rounded-full font-medium transition-colors duration-300">
                  Pinterest
                </button>
                <button className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-6 py-2 rounded-full font-medium transition-colors duration-300">
                  TikTok
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
