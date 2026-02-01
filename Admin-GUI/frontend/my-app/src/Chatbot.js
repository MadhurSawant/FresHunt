const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // <-- Import axios

const app = express();
const port = 5001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect('mongodb://localhost:27017/suppodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully to suppodb.'))
.catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema & Model ---
const messageSchema = new mongoose.Schema({
  text: String,
  sender: String, // 'user' or 'bot'
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// --- API Endpoint ---
app.post('/api/chat', async (req, res) => {
  try {
    const { text } = req.body;

    // 1. Save the user's message to the database
    const userMessage = new Message({ text: text, sender: 'user' });
    await userMessage.save();

    // 2. === NEW LOGIC: Use axios to call an external API ===
    let botReplyText = "Sorry, I couldn't fetch a response right now."; // Default reply

    try {
      // Here is the "direct link" API call using axios
      const apiResponse = await axios.get('https://catfact.ninja/fact');
      
      // Get the fact from the API's response data
      if (apiResponse.data && apiResponse.data.fact) {
        botReplyText = apiResponse.data.fact; // Use the fact as the reply
      }

    } catch (apiError) {
      console.error("Error calling external API:", apiError.message);
      // If the API call fails, we'll just use the default reply
    }
    // ======================================================

    // 3. Save the bot's response to the database
    const botMessage = new Message({ text: botReplyText, sender: 'bot' });
    await botMessage.save();

    // 4. Send the bot's reply back to the frontend
    res.json({ reply: botReplyText });

  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
