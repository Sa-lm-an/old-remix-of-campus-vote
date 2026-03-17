/**
 * Twilio SMS Utility
 * 
 * NOTE: Using Twilio API directly from frontend is NOT secure for production
 * as it exposes Account SID and Auth Token. 
 * For this project, we are using it as requested.
 */

const TWILIO_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

export const sendOTP = async (to: string, otp: string): Promise<boolean> => {
  if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE) {
    console.error('Twilio credentials missing in .env');
    return false;
  }

  // Format phone number (ensure it starts with + and country code)
  // Assuming standard 10-digit Indian numbers for this context, adding +91
  const formattedTo = to.startsWith('+') ? to : `+91${to}`;

  const message = `Your VoxNova verification code is: ${otp}. Valid for 5 minutes.`;
  
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
  
  const formData = new URLSearchParams();
  formData.append('To', formattedTo);
  formData.append('From', TWILIO_PHONE);
  formData.append('Body', message);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('SMS sent successfully:', data.sid);
      return true;
    } else {
      console.error('Twilio Error:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
};
