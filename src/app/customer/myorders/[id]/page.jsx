"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  ShoppingBagIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  PrinterIcon,
} from "@heroicons/react/outline";
import DiamondLoader from "@/components/ui/DiamondLoader";
import Image from "next/image";
import Link from "next/link";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/${id}`);
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "SHIPPED":
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case "DELIVERED":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "CANCELLED":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      SHIPPED: "bg-blue-100 text-blue-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100"} capitalize`}
      >
        {status.toLowerCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>IceQueenbyIce - Order Receipt #${order?.id?.slice(0, 8) || ""}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
            body { 
              font-family: 'Montserrat', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
              background: #fafafa;
            }
            .receipt-container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              background: white;
              box-shadow: 0 0 20px rgba(0,0,0,0.05);
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
              padding-bottom: 20px;
              border-bottom: 2px solid #f3e8eb;
            }
            .brand-name {
              font-size: 42px;
              font-weight: 700;
              color: #ec4899;
              margin: 0;
              letter-spacing: -1px;
              text-transform: uppercase;
            }
            .brand-slogan {
              font-size: 16px;
              color: #9ca3af;
              margin: 8px 0 0;
              font-weight: 500;
            }
            .receipt-title {
              font-size: 24px;
              font-weight: 600;
              margin: 30px 0 15px;
              color: #ec4899;
              padding-bottom: 8px;
              border-bottom: 2px dashed #f3e8eb;
            }
            .order-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            .info-section {
              background: #fdf2f8;
              padding: 20px;
              border-radius: 12px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              font-size: 16px;
            }
            .info-label {
              font-weight: 600;
              color: #6b7280;
            }
            .info-value {
              font-weight: 500;
              color: #111827;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
              font-size: 16px;
              table-layout: fixed;
            }
            .items-table th {
              padding: 15px;
              background: #fdf2f8;
              color: #ec4899;
              font-weight: 600;
              border-bottom: 2px solid #f3e8eb;
            }
            .items-table td {
              padding: 15px;
              border-bottom: 1px solid #f3e8eb;
              vertical-align: top;
              word-wrap: break-word;
            }
            .items-table tr:last-child td {
              border-bottom: none;
            }
            .total-section {
              background: #fdf2f8;
              padding: 25px;
              border-radius: 12px;
              margin-top: 30px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              font-size: 18px;
            }
            .grand-total {
              font-size: 22px;
              font-weight: 700;
              color: #ec4899;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 2px dashed #f3e8eb;
            }
            .thank-you {
              text-align: center;
              margin: 40px 0 30px;
              font-size: 20px;
              font-weight: 600;
              color: #ec4899;
            }
            .footer {
              text-align: center;
              margin-top: 50px;
              padding-top: 20px;
              border-top: 2px solid #f3e8eb;
              font-size: 14px;
              color: #9ca3af;
            }
            .contact-info {
              display: flex;
              justify-content: center;
              gap: 20px;
              margin: 15px 0;
            }
            .contact-link {
              color: #ec4899;
              text-decoration: none;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .social-link {
              color: #ec4899;
              text-decoration: none;
              font-weight: 600;
            }
            .designer {
              font-size: 12px;
              margin-top: 20px;
            }
            @media print {
              body { 
                padding: 0 !important;
                background: white !important;
              }
              .receipt-container { 
                box-shadow: none !important;
                padding: 20px !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1 class="brand-name">IceQueenbyIce</h1>
              <p class="brand-slogan">Where Style Meets Class</p>
            </div>
            
            <div class="order-info">
              <div class="info-section">
                <h2 class="receipt-title">Order Details</h2>
                <div class="info-row">
                  <span class="info-label">Order #:</span>
                  <span class="info-value">${order?.id?.slice(0, 8) || ""}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${new Date(
                    order?.createdAt
                  ).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="info-value" style="color: ${
                    order?.status === "DELIVERED"
                      ? "#10b981"
                      : order?.status === "SHIPPED"
                        ? "#3b82f6"
                        : "#ec4899"
                  }">${order?.status?.toLowerCase() || "unknown"}</span>
                </div>
              </div>
              
              <div class="info-section">
                <h2 class="receipt-title">Customer</h2>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${order?.customerDetails?.fullName || "N/A"}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${order?.customerDetails?.email || "N/A"}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${order?.customerDetails?.phone || "N/A"}</span>
                </div>
              </div>
            </div>
            
            <h2 class="receipt-title">Shipping Information</h2>
            <div class="info-section">
              <div class="info-row">
                <span class="info-label">Receiver:</span>
                <span class="info-value">${
                  order?.shippingDetails?.receiverName ||
                  order?.customerDetails?.fullName ||
                  "N/A"
                }</span>
              </div>
              <div class="info-row">
                <span class="info-label">Address:</span>
                <span class="info-value">${order?.shippingDetails?.fullAddress || "N/A"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Note:</span>
                <span class="info-value">${order.note || "N/A"}</span>
              </div>
            </div>
            
            <h2 class="receipt-title">Order Items</h2>
            <div style="overflow-x: auto;">
              <table class="items-table">
                <colgroup>
                  <col style="width: 40%">
                  <col style="width: 15%">
                  <col style="width: 15%">
                  <col style="width: 30%">
                </colgroup>
                <thead>
                  <tr>
                    <th style="text-align: left;">Product</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: center;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order?.items
                    ?.map(
                      (item) => `
                    <tr>
                      <td style="text-align: left;">
                        <strong>${item.product?.name || "Unknown Product"}</strong><br>
                        <small style="color: #6b7280">
                          ${
                            [item.product?.fabricType, item.product?.size]
                              .filter(Boolean)
                              .join(" • ") || "No details"
                          }
                        </small>
                      </td>
                      <td style="text-align: right; white-space: nowrap;">
                        ₦${(item.price || 0).toLocaleString()}
                      </td>
                      <td style="text-align: center;">
                        ${item.quantity || 0}
                      </td>
                      <td style="text-align: center; white-space: nowrap;">
                        <strong>₦${(
                          (item.price || 0) * (item.quantity || 0)
                        ).toLocaleString()}</strong>
                      </td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            
            <div class="total-section">
              <h2 class="receipt-title">Payment Summary</h2>
              <div class="total-row">
                <span class="info-label">Subtotal:</span>
                <span class="info-value">₦${order?.items
                  ?.reduce(
                    (sum, item) =>
                      sum + (item.price || 0) * (item.quantity || 0),
                    0
                  )
                  .toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span class="info-label">Delivery Fee:</span>
                <span class="info-value">₦${order?.fee?.toLocaleString() || "0"}</span>
              </div>
              <div class="total-row grand-total">
                <span>Grand Total:</span>
                <span>₦${(order?.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
            
            <div class="thank-you">
              Thank you for shopping with IceQueenbyIce!
            </div>
            
            <div class="footer">
              <div class="contact-info">
                <a href="tel:07052555505" class="contact-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  07052555505
                </a>
                <a href="https://wa.me/2347052555505" class="contact-link" target="_blank">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21z"></path>
                  </svg>
                  WhatsApp
                </a>
                <a href="https://instagram.com/icequeenbyice" class="contact-link" target="_blank">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  @icequeenbyice
                </a>
              </div>
              <div class="designer">
                Designed by <a href="https://softtechseamless.onrender.com" target="_blank">SoftTech Seamless</a>
              </div>
            </div>
          </div>
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const links = document.querySelectorAll('a');
              links.forEach(link => {
                link.addEventListener('click', function(e) {
                  if(this.getAttribute('target') === '_blank') {
                    e.preventDefault();
                    window.open(this.href, '_blank');
                  } else if(this.href.startsWith('tel:')) {
                    e.preventDefault();
                    window.location.href = this.href;
                  }
                });
              });
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (loading) {
    return <DiamondLoader />;
  }

  if (error) {
    return (
      <div className="p-4 text-rose-500 bg-rose-50 rounded-lg mx-4">
        Error: {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 text-gray-500 bg-gray-50 rounded-lg mx-4">
        Order not found.
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/customer/myorders"
          className="inline-flex items-center text-pink-600 hover:text-pink-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Orders
        </Link>
        <button
          onClick={handlePrintReceipt}
          className="inline-flex items-center px-4 py-2 border border-pink-300 rounded-md shadow-sm text-sm font-medium text-pink-700 bg-white hover:bg-pink-50 focus:outline-none"
        >
          <PrinterIcon className="h-5 w-5 mr-2" />
          Print Receipt
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pink-900 mb-2">
          Order #{order.id}
        </h1>
        <p className="text-pink-700">Placed on {formatDate(order.createdAt)}</p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 shadow-sm border border-pink-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              {getStatusIcon(order.status)}
            </div>
            <div>
              <h3 className="text-sm font-medium text-pink-800">Status</h3>
              <div className="mt-1">{getStatusBadge(order.status)}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <ShoppingBagIcon className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-pink-800">
                Order Amount
              </h3>
              <p className="mt-1 text-xl font-bold text-pink-900">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(order.totalAmount - order.fee)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <TruckIcon className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-pink-800">
                Delivery Fee
              </h3>
              <p className="mt-1 text-xl font-bold text-pink-900">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(order.fee)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-pink-800">Items</h3>
              <p className="mt-1 text-lg font-semibold text-pink-900">
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer & Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6">
          <h2 className="text-lg font-semibold text-pink-900 mb-4">
            Customer Details
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-pink-700">Full Name</p>
              <p className="font-medium text-pink-900">
                {order.customerDetails.fullName}
              </p>
            </div>
            <div>
              <p className="text-sm text-pink-700">Email</p>
              <p className="font-medium text-pink-900">
                {order.customerDetails.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-pink-700">Additional Note</p>
              <p className="font-medium text-pink-900">{order.note}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6">
          <h2 className="text-lg font-semibold text-pink-900 mb-4">
            Shipping Details
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-pink-700">Receiver Name</p>
              <p className="font-medium text-pink-900">
                {order.shippingDetails.receiverName}
              </p>
            </div>
            <div>
              <p className="text-sm text-pink-700">Phone Number</p>
              <p className="font-medium text-pink-900">
                {order.shippingDetails.receiverNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-pink-700">Delivery Address</p>
              <p className="font-medium text-pink-900">
                {order.shippingDetails.fullAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-pink-900 mb-6">
          Order Items ({order.items.length})
        </h2>
        <div className="space-y-6">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row gap-4 p-4 border-b border-pink-100 last:border-0"
            >
              <div className="w-full md:w-32 h-32 bg-pink-50 rounded-lg overflow-hidden">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-pink-900">
                  {item.product.name}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-pink-700">
                  <span>₦{item.price.toLocaleString()}</span>
                  <span>•</span>
                  <span>Qty: {item.quantity}</span>
                  <span>•</span>
                  <span>Size: {item.product.size}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full">
                    {item.product.fabricType}
                  </span>
                </div>
              </div>
              <div className="md:text-right">
                <p className="font-semibold text-pink-900">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6">
        <h2 className="text-lg font-semibold text-pink-900 mb-6">
          Order Summary
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-pink-700">Subtotal</span>
            <span className="font-medium text-pink-900">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(order.totalAmount - order.fee)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-pink-700">Delivery</span>
            <span className="font-medium text-pink-900">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(order.fee)}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-pink-100">
            <span className="text-lg font-semibold text-pink-900">
              Grand Total
            </span>
            <span className="text-lg font-bold text-pink-900">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
