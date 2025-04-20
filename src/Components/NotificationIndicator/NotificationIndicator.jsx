import React from 'react';

/**
 * Notification indicator component that shows the status of a WhatsApp notification
 * @param {Object} props - Component props
 * @param {Boolean} props.sent - Whether the notification was sent successfully
 * @param {String} props.type - The type of notification (confirmation, reminder)
 * @returns {JSX.Element} - Rendered component
 */
const NotificationIndicator = ({ sent, type = 'confirmation' }) => {
  // If status is null or undefined (not yet determined), don't show anything
  if (sent === null || sent === undefined) return null;
  
  return (
    <div className={`flex items-center gap-2 text-sm mt-2 ${sent ? 'text-green-600' : 'text-amber-600'}`}>
      {sent ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
          </svg>
          {type === 'confirmation' 
            ? 'WhatsApp confirmation sent successfully!' 
            : 'Reminder scheduled for 24 hours before your event'
          }
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {type === 'confirmation'
            ? 'WhatsApp notification could not be sent. We\'ll contact you separately.'
            : 'Could not schedule reminder. We\'ll contact you before your event.'
          }
        </>
      )}
    </div>
  );
};

export default NotificationIndicator;