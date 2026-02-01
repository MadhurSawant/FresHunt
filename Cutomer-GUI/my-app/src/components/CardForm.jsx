import React, { useState } from "react";

const CardForm = () => {
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  const validate = () => {
    let newErrors = {};
    if (!cardData.name) newErrors.name = "Name is required";
    if (!/^\d{16}$/.test(cardData.number))
      newErrors.number = "Card number must be 16 digits";
    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry))
      newErrors.expiry = "Format should be MM/YY";
    if (!/^\d{3,4}$/.test(cardData.cvv))
      newErrors.cvv = "CVV must be 3 or 4 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Payment submitted successfully!");
      console.log("Card Data:", cardData);
      setCardData({ name: "", number: "", expiry: "", cvv: "" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          💳 Card Payment Form
        </h2>

        {/* Card Preview */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-4 mb-6 shadow-md">
          <p className="text-sm tracking-widest">{cardData.number || "•••• •••• •••• ••••"}</p>
          <div className="flex justify-between mt-4 text-sm">
            <p>{cardData.name || "CARD HOLDER"}</p>
            <p>{cardData.expiry || "MM/YY"}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cardholder Name</label>
            <input
              type="text"
              name="name"
              value={cardData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              name="number"
              value={cardData.number}
              onChange={handleChange}
              maxLength="16"
              className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="1234 5678 9012 3456"
            />
            {errors.number && <p className="text-red-500 text-xs">{errors.number}</p>}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                name="expiry"
                value={cardData.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.expiry && <p className="text-red-500 text-xs">{errors.expiry}</p>}
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="password"
                name="cvv"
                value={cardData.cvv}
                onChange={handleChange}
                maxLength="4"
                className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="123"
              />
              {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardForm;
