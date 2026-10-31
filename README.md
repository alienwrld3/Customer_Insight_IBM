# Smart Customer Insight – AI-Powered Feedback Analysis

A modern, professional, and responsive web application for analysing customer feedback using a **rule-based sentiment engine**.

---

## Features

| Feature | Description |
|---|---|
| **Sentiment classification** | POSITIVE / NEGATIVE / NEUTRAL with confidence score |
| **Explanation** | Plain-language explanation of why the verdict was reached |
| **Aspect detection** | Product quality, Customer service, Pricing & value, Delivery & shipping, Packaging |
| **Negation handling** | "not good", "doesn't work", "not helpful" correctly flip polarity |
| **Intensifier handling** | "very", "extremely", "incredibly" scale word scores |
| **Main concern** | Highlights the most impactful negative signal |
| **Business recommendations** | Actionable suggestions tailored to detected issues |
| **Summary** | One-paragraph summary of the full feedback |
| **Debug panel** | Reveals every positive/negative signal and the aggregate score |
| **Example feedback** | 5 built-in examples to test (Positive, Negative, Mixed, Neutral, Delivery Issue) |
| **Demo notice** | Clear banner informing users that results are rule-based, not from an AI model |

---

## Project Structure

```
smart-customer-insight/
├── server.js          # Express server & API routes
├── package.json
├── src/
│   └── analyzer.js    # Rule-based sentiment engine (lexicon, scoring, aspects)
└── public/
    ├── index.html     # App shell
    ├── styles.css     # Styles
    └── app.js         # Frontend JS (fetch, render)
```

---

## How to Run

### Prerequisites
- **Node.js** v16 or newer  
  Download from [nodejs.org](https://nodejs.org/)

### Steps

```bash
# 1. Navigate into the project folder
cd smart-customer-insight

# 2. Install dependencies (only needed once)
npm install

# 3. Start the server
npm start
```

Then open your browser and go to **http://localhost:3000**

The server listens on port **3000** by default.  
To use a different port: `PORT=8080 npm start`

---

## API

### `POST /api/analyze`

**Request body:**
```json
{ "text": "Your customer feedback here..." }
```

**Response:**
```json
{
  "mode": "rule-based",
  "sentiment": "POSITIVE",
  "explanation": "...",
  "positiveAspects": ["product quality", "delivery & shipping"],
  "negativeAspects": [],
  "mainConcern": null,
  "confidence": 86,
  "recommendations": ["..."],
  "summary": "...",
  "_debug": {
    "totalScore": 8,
    "positiveHits": ["quality", "outstanding"],
    "negativeHits": []
  }
}
```

### `GET /api/health`
Returns `{ "status": "ok", "timestamp": "..." }`.

---

## Connecting a Real AI Model (Optional)

The engine lives entirely in [`src/analyzer.js`](src/analyzer.js).  
To swap it for a real AI model (e.g. IBM Watson NLU, OpenAI, or Hugging Face):

1. Add your API credentials to a `.env` file.
2. Replace the `analyze()` function body in `src/analyzer.js` with a call to the AI SDK.
3. Return the same response shape so the frontend requires no changes.
4. Change `mode: 'rule-based'` to `mode: 'ai'` in the response — the frontend will hide the demo notice automatically.

---

## Sentiment Colours

| Sentiment | Colour |
|---|---|
| POSITIVE | 🟢 Green |
| NEGATIVE | 🔴 Red |
| NEUTRAL | 🟡 Yellow |

---

## License
MIT
