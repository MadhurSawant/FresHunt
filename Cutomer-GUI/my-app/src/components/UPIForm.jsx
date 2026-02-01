import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const UPIForm = () => {
  const [upiData, setUpiData] = useState({ upiId: "", amount: "" });
  const [errors, setErrors] = useState({});
  const [isGenerated, setIsGenerated] = useState(false); // ✅ Track QR generation
  const qrRef = useRef(null);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpiData({ ...upiData, [name]: value });
    setIsGenerated(false); // reset QR when input changes
  };

  // 🔹 Validate UPI and amount
  const validate = () => {
    let newErrors = {};
    if (!/^[\w.\-]+@[\w]+$/.test(upiData.upiId))
      newErrors.upiId = "Enter a valid UPI ID (e.g. name@upi)";
    if (!upiData.amount || isNaN(upiData.amount) || Number(upiData.amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Generate UPI Link
  const upiLink = `upi://pay?pa=${upiData.upiId}&pn=User&am=${upiData.amount}&cu=INR`;

  // 🔹 Copy UPI Link
  const copyLink = () => {
    navigator.clipboard.writeText(upiLink);
    alert("✅ UPI Payment Link copied!");
  };

  // 🔹 Download QR Code
  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `UPI_QR_${upiData.amount}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔹 Handle QR generation button click
  const handleGenerate = () => {
    if (validate()) {
      setIsGenerated(true);
      alert("🎉 QR Code Generated Successfully!");
    } else {
      setIsGenerated(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
          💳 UPI Payment Generator
        </h2>

        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">UPI ID</label>
            <input
              type="text"
              name="upiId"
              value={upiData.upiId}
              onChange={handleChange}
              placeholder="username@upi"
              className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.upiId && (
              <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={upiData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Generate QR
          </button>
        </div>

        {/* ✅ Show QR Code only when valid */}
        {isGenerated && (
          <div ref={qrRef} className="flex flex-col items-center mt-6">
            <p className="font-medium mb-2">
              Scan to Pay ₹{upiData.amount} via {upiData.upiId}
            </p>
            <QRCodeCanvas value={upiLink} size={200} includeMargin />
            <div className="flex gap-3 mt-4">
              <button
                onClick={copyLink}
                className="bg-gray-200 text-sm px-3 py-1 rounded-md hover:bg-gray-300"
              >
                Copy Link
              </button>
              <button
                onClick={downloadQR}
                className="bg-indigo-600 text-white text-sm px-3 py-1 rounded-md hover:bg-indigo-700"
              >
                Download QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UPIForm;
