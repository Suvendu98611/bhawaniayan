const express = require('express');
const twilio = require('twilio');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// ✅ Allow frontend from Netlify
app.use(cors({
  origin: 'https://bhawaniayans.netlify.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API server is live and running 🚀');
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

app.post('/send-whatsapp', async (req, res) => {
  const { name, email, phone, date, message } = req.body;

  const whatsappMessage = `New Contact Form Submission:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPreferred Date: ${date || 'Not specified'}\nMessage: ${message || 'No message'}`;

  try {
    await client.messages.create({
      body: whatsappMessage,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+919937113700'
    });
    res.status(200).json({ success: true, message: 'WhatsApp message sent successfully' });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ success: false, error: 'Failed to send WhatsApp message' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

