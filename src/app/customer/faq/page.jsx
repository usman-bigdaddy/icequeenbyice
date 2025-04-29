"use client";

import PageSectionHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaShippingFast,
  FaExchangeAlt,
  FaCreditCard,
  FaShieldAlt,
} from "react-icons/fa";

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqCategories = [
    {
      title: "Shipping & Delivery",
      icon: <FaShippingFast className="text-2xl text-pink-600" />,
      questions: [
        {
          question: "How long does delivery take?",
          answer:
            "Delivery time is usually 1-2 hours but this may vary based on your location.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes! We ship to over 5 countries worldwide. International shipping rates and delivery times vary by destination.",
        },
      ],
    },
    {
      title: "Returns & Exchanges",
      icon: <FaExchangeAlt className="text-2xl text-pink-600" />,
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We accept returns within 5 days of purchase. Items must be unworn, unwashed, and with all original tags attached.",
        },
        {
          question: "How do I initiate a return?",
          answer:
            "You can initiate a return by contacting our customer service team.",
        },
        {
          question: "How long do refunds take?",
          answer:
            "Once we receive your return, processing takes 30 minutes. Your bank may take additional time to post the credit to your account.",
        },
      ],
    },
    {
      title: "Payment & Security",
      icon: <FaCreditCard className="text-2xl text-pink-600" />,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept payments via Paystack, which supports all major credit cards (Visa, Mastercard, and more), as well as local payment methods.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Absolutely. We use industry-standard SSL encryption and never store your full payment details on our servers.",
        },
      ],
    },
    {
      title: "Product & Sizing",
      icon: <FaShieldAlt className="text-2xl text-pink-600" />,
      questions: [
        {
          question: "How do I know what size to order?",
          answer: "We provide detailed size for each product.",
        },
        {
          question: "Are your products true to size?",
          answer:
            "Most of our products run true to size, but we always recommend checking the specific size for each item as some styles may vary.",
        },
        {
          question: "What materials are your clothes made from?",
          answer:
            "We use a variety of high-quality materials including organic cotton, linen, silk, and sustainable synthetic blends. Each product page lists the specific materials used.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <section className="container mx-auto px-6 py-6">
        <PageSectionHeader
          title="FAQ's"
          subtitle="We have answers to the most common questions"
        />
        <div className="max-w-4xl mx-auto space-y-8">
          {faqCategories.map((category, catIndex) => (
            <div
              key={catIndex}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="flex items-center bg-pink-100 p-6">
                <div className="mr-4">{category.icon}</div>
                <h2 className="text-2xl font-bold text-pink-800 font-serif">
                  {category.title}
                </h2>
              </div>
              <div className="divide-y divide-pink-100">
                {category.questions.map((item, index) => (
                  <div key={index} className="p-6">
                    <button
                      className="flex justify-between items-center w-full text-left"
                      onClick={() => toggleAccordion(`${catIndex}-${index}`)}
                    >
                      <h3 className="text-lg font-medium text-pink-800">
                        {item.question}
                      </h3>
                      {activeIndex === `${catIndex}-${index}` ? (
                        <FaChevronUp className="text-pink-600" />
                      ) : (
                        <FaChevronDown className="text-pink-600" />
                      )}
                    </button>
                    {activeIndex === `${catIndex}-${index}` && (
                      <div className="mt-4 text-pink-700">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-pink-100 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-pink-800 mb-6 font-serif">
            Still Have Questions?
          </h2>
          <p className="text-xl text-pink-700 mb-8 max-w-2xl mx-auto">
            Our customer care team is available 7 days a week to assist you with
            any inquiries.
          </p>
          <Link href="/customer/contact">
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300">
              Contact Customer Service
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
