import React, { useState } from "react";

const WhatsAppReminder = () => {
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const sendWhatsAppReminder = async () => {
    try {
      const formattedNumber = to.startsWith("+") ? to : `+${to}`;

      const response = await fetch("https://backend-kf6u.onrender.com/send-whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: formattedNumber, date, time }),
      });

      if (!response.ok) {
        throw new Error("Failed to send WhatsApp reminder");
      }

      const result = await response.json();
      setMessage("WhatsApp reminder sent successfully!");
      console.log("WhatsApp reminder sent:", result);
    } catch (error) {
      console.error("Error sending WhatsApp reminder:", error);
      setMessage("Error sending reminder. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Send WhatsApp Reminder</h2>

      <input
        type="text"
        placeholder="Enter phone number (+91...)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <button
        onClick={sendWhatsAppReminder}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Send Reminder
      </button>

      {message && <p className="text-center text-red-500">{message}</p>}
    </div>
  );
};

export default WhatsAppReminder;
