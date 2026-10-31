'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const { analyze } = require('./src/analyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/** Health check */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/** Main analysis endpoint */
app.post('/api/analyze', (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Request body must contain a "text" field with a non-empty string.',
      });
    }

    if (text.trim().length < 5) {
      return res.status(400).json({
        error: 'Feedback text is too short. Please provide at least a sentence.',
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: 'Feedback text must be 5000 characters or fewer.',
      });
    }

    const result = analyze(text.trim());
    return res.json(result);
  } catch (err) {
    console.error('[analyze] Error:', err.message);
    return res.status(500).json({ error: 'Internal analysis error. Please try again.' });
  }
});

/** Serve the SPA for any other GET */
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n  🚀  Smart Customer Insight running at http://localhost:${PORT}\n`);
});
