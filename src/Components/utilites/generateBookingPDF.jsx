import jsPDF from 'jspdf';

export const generateBookingPDF = (bookingData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = [93, 0, 114]; // #5D0072
  const secondaryColor = [147, 51, 234]; // Purple
  const accentColor = [236, 72, 153]; // Pink
  const textColor = [55, 65, 81]; // Gray-700
  const lightGray = [243, 244, 246]; // Gray-100
  
  // Helper function to add gradient-like effect
  const addGradientHeader = () => {
    // Main header background
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 45, 'F');
    
    // Decorative elements
    pdf.setFillColor(255, 255, 255, 0.1);
    pdf.circle(pageWidth - 20, 15, 25, 'F');
    pdf.circle(-10, 35, 20, 'F');
    
    // Header text
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BOOKING CONFIRMATION', pageWidth / 2, 25, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Your celebration is confirmed!', pageWidth / 2, 35, { align: 'center' });
  };
  
  // Helper function to add section
  const addSection = (title, y, content) => {
    // Section header
    pdf.setFillColor(...lightGray);
    pdf.rect(15, y, pageWidth - 30, 8, 'F');
    
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, 20, y + 6);
    
    let currentY = y + 15;
    
    // Section content
    pdf.setTextColor(...textColor);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    content.forEach(item => {
      if (item.type === 'row') {
        pdf.setFont('helvetica', 'bold');
        pdf.text(item.label + ':', 20, currentY);
        pdf.setFont('helvetica', 'normal');
        pdf.text(item.value, 80, currentY);
        currentY += 6;
      } else if (item.type === 'list') {
        pdf.setFont('helvetica', 'bold');
        pdf.text(item.label + ':', 20, currentY);
        currentY += 6;
        item.items.forEach(listItem => {
          pdf.setFont('helvetica', 'normal');
          pdf.text('• ' + listItem, 25, currentY);
          currentY += 5;
        });
        currentY += 2;
      }
    });
    
    return currentY + 5;
  };
  
  // Add header
  addGradientHeader();
  
  let yPosition = 55;
  
  // Booking Details Section
  const bookingDetails = [
    { type: 'row', label: 'Booking Name', value: bookingData.bookingName || 'N/A' },
    { type: 'row', label: 'Celebration Person', value: bookingData.NameUser || 'N/A' },
    { type: 'row', label: 'Email', value: bookingData.email || 'N/A' },
    { type: 'row', label: 'WhatsApp Number', value: '+91 ' + (bookingData.whatsapp || 'N/A') },
    { type: 'row', label: 'Address', value: bookingData.address || 'N/A' },
    { type: 'row', label: 'Occasion', value: bookingData.occasion || 'N/A' }
  ];
  
  yPosition = addSection('PERSONAL DETAILS', yPosition, bookingDetails);
  
  // Event Details Section
  const eventDetails = [
    { type: 'row', label: 'Date', value: bookingData.date || 'N/A' },
    { type: 'row', label: 'Time Slot', value: bookingData.lastItem ? `${bookingData.lastItem.start} - ${bookingData.lastItem.end}` : 'N/A' },
    { type: 'row', label: 'Package Type', value: (bookingData.slotType || 'N/A').toUpperCase() },
    { type: 'row', label: 'Number of People', value: bookingData.people?.toString() || 'N/A' },
    { type: 'row', label: 'Decoration', value: bookingData.wantDecoration || 'N/A' }
  ];
  
  yPosition = addSection('EVENT DETAILS', yPosition, eventDetails);
  
  // Add-ons Section (if any)
  if (bookingData.extraDecorations && bookingData.extraDecorations.length > 0) {
    const addOnNames = {
      'fog-01': 'Fog Entry (02 Pots) - ₹750',
      'fog-02': 'Fog Entry (04 Pots) - ₹1000',
      'candle_light': 'Candle Light Dinner - ₹499',
      'photo_clipping': 'Photo Clipping - ₹149',
      'led_numbers': 'LED Numbers - ₹99',
      'led_hbd': 'LED HBD - ₹99',
      'candle_pathway': 'Candle Pathway - ₹249',
      'cold_piros': 'Cold Piros (02 pcs) - ₹499',
      'reel': 'Reel - ₹999',
      'photography': 'Photography (1 hour) - ₹1499'
    };
    
    const addOns = bookingData.extraDecorations.map(addon => addOnNames[addon] || addon);
    
    const addOnDetails = [
      { type: 'list', label: 'Selected Add-ons', items: addOns }
    ];
    
    yPosition = addSection('PREMIUM ADD-ONS', yPosition, addOnDetails);
  }
  
  // Payment Details Section
  const paymentDetails = [
    { type: 'row', label: 'Total Amount', value: '₹' + (bookingData.totalAmount || '0') },
    { type: 'row', label: 'Advance Paid', value: '₹1026 (₹1000 + ₹26 convenience fee)' },
    { type: 'row', label: 'Remaining Amount', value: '₹' + ((bookingData.totalAmount || 0) - 1000) },
    { type: 'row', label: 'Payment Status', value: 'Advance Paid' },
    { type: 'row', label: 'Payment ID', value: bookingData.paymentId || 'N/A' }
  ];
  
  yPosition = addSection('PAYMENT DETAILS', yPosition, paymentDetails);
  
  // Important Notes Section
  const importantNotes = [
    'Arrive 15 minutes before your scheduled time',
    'Bring your AADHAAR card for verification',
    'No smoking/drinking allowed inside the theater',
    'Maintain cleanliness in the theater',
    'Remaining amount to be paid before the event',
    'Contact +91-9764535650 for any queries'
  ];
  
  const notesDetails = [
    { type: 'list', label: 'Important Notes', items: importantNotes }
  ];
  
  yPosition = addSection('IMPORTANT INFORMATION', yPosition, notesDetails);
  
  // Footer
  const footerY = pageHeight - 25;
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, footerY, pageWidth, 25, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Thank you for choosing our service!', pageWidth / 2, footerY + 8, { align: 'center' });
  pdf.text('Generated on: ' + new Date().toLocaleDateString('en-IN'), pageWidth / 2, footerY + 15, { align: 'center' });
  pdf.text('© 2025 Akaay Studio. All rights reserved.', pageWidth / 2, footerY + 20, { align: 'center' });
  
  // Add decorative elements
  pdf.setDrawColor(...accentColor);
  pdf.setLineWidth(0.5);
  pdf.line(15, 50, pageWidth - 15, 50);
  
  return pdf;
};