// server/index.js - Minimal chat proxy. Provides /api/chat that proxies to OpenAI or returns canned replies when no API key.

const express = require('express');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(express.json());

// Basic rate limiting
const limiter = rateLimit({ windowMs: 10 * 1000, max: 10 });
app.use('/api/', limiter);

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4';

app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body || {};
  if(!message) return res.status(400).json({error: 'No message provided'});

  // If no OpenAI key configured, return a canned response
  if(!OPENAI_KEY){
    let reply = 'Thanks for your question! Please provide more details or use the contact form so we can follow up.';
    if(/price|cost|starter/i.test(message)) reply = 'Our Starter Website starts at R2,500 (approx. $150). We can customise features per your needs.';
    if(/maintenance|support/i.test(message)) reply = 'Monthly Maintenance is R250 / $15 and includes hosting, updates, backups and support.';
    return res.json({reply});
  }

  try{
    // Use configured model (defaults to GPT-4). Adjust token limit for more capable models.
    const modelToUse = OPENAI_MODEL;
    const maxTokens = modelToUse && modelToUse.toLowerCase().startsWith('gpt-4') ? 1200 : 400;
    console.log('Using OpenAI model:', modelToUse);

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [{role:'user', content: message}],
        max_tokens: maxTokens,
        temperature: 0.2
      })
    });
    if(!r.ok){
      const errBody = await r.text();
      console.error('OpenAI error', r.status, errBody);
      return res.status(502).json({error: 'AI provider error'});
    }
    const data = await r.json();
    const reply = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ? data.choices[0].message.content.trim() : 'Sorry, no response.';
    res.json({reply});
  }catch(err){
    console.error('Chat proxy error', err);
    res.status(500).json({error: 'Server error'});
  }
});

// Serve static site for simple local testing
app.use(express.static('..', { index: ['index.html'] }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Chat proxy server running on port ${PORT}`));