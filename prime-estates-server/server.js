const express = require('express');
const twilio = require('twilio');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env
dotenv.config();

const app = express();

// ✅ Proper CORS configuration for Netlify
const corsOptions = {
  origin: 'https://bhawaniayans.netlify.app', // Your frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

// ⚠️ Important: Respond to preflight OPTIONS requests
app.options('*', cors(corsOptions));

app.get('/', (req, res) => {
  res.send('✅ API server is live and running 🚀');
});

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

app.post('/send-whatsapp', async (req, res) => {
  const { name, email, phone, date, message } = req.body;

  const whatsappMessage = `New Contact Form Submission:
Name: ${name}
Email: ${email}
Phone: ${phone}
Preferred Date: ${date || 'Not specified'}
Message: ${message || 'No message'}`;

  try {
    await client.messages.create({
      body: whatsappMessage,
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: 'whatsapp:+919937113700'   // Your verified number
    });

    res.status(200).json({ success: true, message: 'WhatsApp message sent successfully' });
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
    res.status(500).json({ success: false, error: 'Failed to send WhatsApp message' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
