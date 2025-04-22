"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  PrinterIcon,
} from "@heroicons/react/outline";
import DiamondLoader from "@/components/ui/DiamondLoader";

export default function page() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState({
    order: null,
    loading: true,
    error: null,
  });
  const [processing, setProcessing] = useState(false);
  const [shipping, setShipping] = useState(false);
  const receiptRef = useRef(null);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${id}`);
      setData({
        order: response.data.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      setData({
        order: null,
        loading: false,
        error: err.response?.data?.error || "Failed to fetch order details",
      });
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateOrderStatus = async (status) => {
    if (status === "DELIVERED") setProcessing(true);
    if (status === "SHIPPED") setShipping(true);

    try {
      await axios.put(`/api/orders/${id}`, { status });
      await fetchOrder();
      router.refresh();
    } catch (err) {
      console.error("Failed to update order:", err);
    } finally {
      setProcessing(false);
      setShipping(false);
    }
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>IceQueenbyIce - Order Receipt #${data.order?.id?.slice(0, 8) || ""}</title>
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
                  <span class="info-value">${data.order?.id?.slice(0, 8) || ""}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${new Date(
                    data.order?.createdAt
                  ).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="info-value" style="color: ${
                    data.order?.status === "DELIVERED"
                      ? "#10b981"
                      : data.order?.status === "SHIPPED"
                        ? "#3b82f6"
                        : "#ec4899"
                  }">${data.order?.status?.toLowerCase() || "unknown"}</span>
                </div>
              </div>
              
              <div class="info-section">
                <h2 class="receipt-title">Customer</h2>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${data.order?.customerDetails?.fullName || "N/A"}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${data.order?.customerDetails?.email || "N/A"}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${data.order?.customerDetails?.phone || "N/A"}</span>
                </div>
              </div>
            </div>
            
            <h2 class="receipt-title">Shipping Information</h2>
            <div class="info-section">
              <div class="info-row">
                <span class="info-label">Receiver:</span>
                <span class="info-value">${
                  data.order?.shippingDetails?.receiverName ||
                  data.order?.customerDetails?.fullName ||
                  "N/A"
                }</span>
              </div>
              <div class="info-row">
                <span class="info-label">Address:</span>
                <span class="info-value">${data.order?.shippingDetails?.fullAddress || "N/A"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Note:</span>
                <span class="info-value">${data.order.note || "N/A"}</span>
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
                  ${data.order?.items
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
                <span class="info-value">₦${data.order?.items
                  ?.reduce(
                    (sum, item) =>
                      sum + (item.price || 0) * (item.quantity || 0),
                    0
                  )
                  .toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span class="info-label">Delivery Fee:</span>
                <span class="info-value">₦${data.order?.fee?.toLocaleString() || "0"}</span>
              </div>
              <div class="total-row grand-total">
                <span>Grand Total:</span>
                <span>₦${(data.order?.totalAmount || 0).toLocaleString()}</span>
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

  if (data.loading) {
    return <DiamondLoader />;
  }

  if (data.error) {
    return (
      <div className="p-6 text-rose-500 bg-rose-50 rounded-lg mx-4">
        Error: {data.error}
      </div>
    );
  }

  if (!data.order) {
    return <div className="p-6 text-pink-700">Order not found</div>;
  }

  const {
    customerDetails = { fullName: "", email: "" },
    shippingDetails = { receiverName: "", fullAddress: "" },
    items = [],
    ...order
  } = data.order;

  // Calculate values
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  const feesAndTaxes = (order.totalAmount || 0) - subtotal;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-pink-900">
            Order #{order.id?.slice(0, 8) || ""}
          </h1>
          <p className="text-pink-700 mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrintReceipt}
            variant="outline"
            className="border-pink-500 text-pink-600 hover:bg-pink-50 flex items-center gap-1"
          >
            <PrinterIcon className="h-4 w-4" />
            Print Receipt
          </Button>
          <Link href="/admin/orders">
            <Button
              variant="outline"
              className="border-pink-500 text-pink-600 hover:bg-pink-50 flex items-center gap-1"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
          <h2 className="text-lg font-semibold text-pink-900 mb-4 pb-2 border-b border-pink-100">
            Customer Information
          </h2>
          <div className="space-y-3 text-pink-700">
            <p>
              <span className="font-medium text-pink-900">Name:</span>{" "}
              {customerDetails.fullName || "N/A"}
            </p>
            <p>
              <span className="font-medium text-pink-900">Email:</span>{" "}
              {customerDetails.email || "N/A"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
          <h2 className="text-lg font-semibold text-pink-900 mb-4 pb-2 border-b border-pink-100">
            Shipping Information
          </h2>
          <div className="space-y-3 text-pink-700">
            <p>
              <span className="font-medium text-pink-900">Receiver:</span>{" "}
              {shippingDetails.receiverName ||
                customerDetails.fullName ||
                "N/A"}
            </p>
            <p>
              <span className="font-medium text-pink-900">Address:</span>{" "}
              {shippingDetails.fullAddress || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-pink-100">
          <h2 className="text-lg font-semibold text-pink-900">Order Items</h2>
          <div className="flex items-center gap-4">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.status === "PENDING"
                  ? "bg-pink-100 text-pink-800"
                  : order.status === "SHIPPED"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {order.status?.toLowerCase() || "unknown"}
            </div>

            {order.status === "PENDING" && (
              <Button
                onClick={() => updateOrderStatus("SHIPPED")}
                disabled={shipping}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white flex items-center gap-1"
              >
                <TruckIcon className="h-4 w-4" />
                {shipping ? "Shipping..." : "Mark as Shipped"}
              </Button>
            )}

            {order.status === "SHIPPED" && (
              <Button
                onClick={() => updateOrderStatus("DELIVERED")}
                disabled={processing}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white flex items-center gap-1"
              >
                <CheckCircleIcon className="h-4 w-4" />
                {processing ? "Processing..." : "Mark as Delivered"}
              </Button>
            )}
          </div>
        </div>

        {items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full divide-y divide-pink-100">
                <TableHeader className="bg-pink-50">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                      Product
                    </TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs font-medium text-pink-900 uppercase tracking-wider">
                      Price
                    </TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs font-medium text-pink-900 uppercase tracking-wider">
                      Qty
                    </TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs font-medium text-pink-900 uppercase tracking-wider">
                      Subtotal
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-pink-100">
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-pink-50">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              src={
                                item.product?.images?.[0] ||
                                "/placeholder-product.jpg"
                              }
                              alt={item.product?.name}
                              className="h-full w-full object-cover rounded-lg border border-pink-200"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${item.productId}`}
                              className="font-medium text-pink-900 hover:underline"
                            >
                              {item.product?.name || "Unknown Product"}
                            </Link>
                            <div className="text-sm text-pink-600 mt-1">
                              {[item.product?.fabricType, item.product?.size]
                                .filter(Boolean)
                                .join(" • ") || "No details"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right text-pink-900">
                        ₦{(item.price || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right text-pink-700">
                        {item.quantity || 0}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right font-medium text-pink-900">
                        ₦
                        {(
                          (item.price || 0) * (item.quantity || 0)
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-md space-y-3 bg-pink-50 rounded-lg p-6">
                <div className="flex justify-between text-pink-700">
                  <span>Subtotal:</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-pink-700">
                  <span>Delivery Fee + VAT:</span>
                  <span>₦{feesAndTaxes.toLocaleString()}</span>
                </div>

                <div className="border-t border-pink-200 pt-3 flex justify-between font-medium text-lg text-pink-900">
                  <span>Total:</span>
                  <span>₦{(order.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-pink-700 bg-pink-50 rounded-lg">
            No items found in this order
          </div>
        )}
      </div>
    </div>
  );
}
