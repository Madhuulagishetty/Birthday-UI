// WhatsApp messaging service to handle all communication with the Zaply API
import axios from 'axios';

/**
 * Send a WhatsApp message to the customer with booking details
 * @param {Object} bookingDetails - The booking information
 * @returns {Promise} - Response from the API
 */
const sendWhatsAppReminder = async (bookingDetails) => {
  try {
    // Format the WhatsApp message with booking details
    const message = formatBookingMessage(bookingDetails);
    
    // Call the backend API to send the WhatsApp message
    const response = await axios.post('https://backend-kf6u.onrender.com/send-whatsapp', {
      phoneNumber: bookingDetails.to, // Already formatted with country code
      message: message,
      bookingInfo: {
        date: bookingDetails.date,
        time: bookingDetails.time,
        name: bookingDetails.bookingName,
        people: bookingDetails.people,
        location: bookingDetails.location || 'Our Theater',
        slotType: bookingDetails.slotType,
        hasDecorations: bookingDetails.decorations ? 'Yes' : 'No',
        extraDecorations: bookingDetails.extraDecorations || 'None'
      }
    });
    
    console.log('WhatsApp notification sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    // Still return success even if WhatsApp fails - don't block the booking process
    return { success: false, error: error.message };
  }
};

/**
 * Format the confirmation message with booking details
 * @param {Object} details - Booking details
 * @returns {String} - Formatted message
 */
const formatBookingMessage = (details) => {
  return `🎉 *Booking Confirmed!* 🎉

Thank you for booking with us, ${details.bookingName || 'valued customer'}!

*Your Booking Details:*
📅 Date: ${details.date}
⏰ Time: ${details.time}
👥 Number of People: ${details.people}
📍 Location: ${details.location || 'Our Theater'}
🎭 Event Type: ${details.slotType || 'Birthday Celebration'}
${details.decorations ? '🎊 Decorations: Included' : ''}
${details.extraDecorations ? `✨ Extra Decorations: ${details.extraDecorations}` : ''}

We've received your advance payment and your slot is now confirmed. Please remember to bring your AADHAAR card during check-in.

We'll send you a reminder 24 hours before your event. If you have any questions, please don't hesitate to contact us.

Looking forward to making your special day memorable! 🎂`;
};

/**
 * Schedule a WhatsApp reminder for the future
 * @param {Object} bookingDetails - The booking information including date and time
 * @returns {Promise} - Response from the API
 */
const scheduleWhatsAppReminder = async (bookingDetails) => {
  try {
    // Extract date and start time from bookingDetails
    const { date, time } = bookingDetails;
    
    // Assuming time format is "HH:MM - HH:MM" (start - end)
    const startTime = time.split(' - ')[0];
    
    // Create a combined date-time string
    const slotDateTime = `${date}T${startTime}`;
    
    const response = await axios.post('https://backend-kf6u.onrender.com/book-slot', {
      phoneNumber: bookingDetails.to,
      slotDate: date,
      slotTime: startTime,
      bookingName: bookingDetails.bookingName,
      people: bookingDetails.people,
      slotType: bookingDetails.slotType
    });
    
    console.log('WhatsApp reminder scheduled successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error scheduling WhatsApp reminder:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

export { sendWhatsAppReminder, scheduleWhatsAppReminder };