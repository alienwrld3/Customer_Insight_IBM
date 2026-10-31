'use strict';

/* ============================================================
   Smart Customer Insight — Frontend JavaScript
   ============================================================ */

const API_URL = '/api/analyze';

// ── Example feedback texts ──────────────────────────────────
const EXAMPLES = {
  // ── English examples ────────────────────────────────────
  positive: `I recently purchased the wireless headphones from this store and I'm absolutely thrilled with the quality. The sound is exceptional, the build is very sturdy and the battery life is outstanding. The customer service team was incredibly helpful when I had a question about pairing. Delivery was fast and the packaging was excellent — the product arrived perfectly intact. Highly recommend to anyone looking for premium audio gear!`,

  negative: `This was a terrible experience from start to finish. The product arrived damaged — clearly poorly packaged — and when I contacted customer service they were rude and completely unhelpful. It took three weeks to get a response. The quality is dreadful for the price, which is outrageously expensive. I definitely want a refund and will never buy from this company again.`,

  mixed: `The product itself is great — really good build quality and it works exactly as described. However, the delivery was frustratingly slow (arrived two weeks late) and the packaging was poor; one corner was crushed. Customer support was helpful when I finally reached them but the wait time was way too long. The price is fair for what you get. Overall I'm satisfied with the product but disappointed with the logistics.`,

  neutral: `I received the item within the expected timeframe. The packaging was standard. The product functions as described in the listing. I have not encountered any major issues so far. The price is in line with similar products on the market. I may purchase again if the need arises.`,

  delivery: `The item I ordered still has not arrived after four weeks. Tracking shows it has been stuck at the distribution center for 10 days with no updates. I contacted support twice and both times I was told to "just wait". This is completely unacceptable. I need this for an important event and now it is too late. The product may be good — I honestly do not know — but the shipping and customer service have been absolutely awful. I am opening a dispute.`,

  // ── Indonesian examples ─────────────────────────────────
  id_positive: `Saya sangat puas dengan produk ini! Kualitasnya sangat bagus dan sesuai dengan deskripsi. Pengemasan sangat rapi dan aman, barang sampai dalam kondisi sempurna. Pengiriman cepat, hanya 2 hari sudah tiba. Pelayanan penjual sangat ramah dan responsif saat saya bertanya. Harga sangat terjangkau untuk kualitas yang ditawarkan. Sangat direkomendasikan! Pasti beli lagi di sini.`,

  id_negative: `Sangat kecewa dengan pembelian ini. Barang yang saya terima rusak dan tidak sesuai dengan gambar di toko. Kemasan buruk sekali, tidak ada pelindung sama sekali. Pengiriman sangat lambat, sudah 3 minggu baru sampai. Pelayanan customer service tidak membantu sama sekali dan tidak responsif. Harga mahal tapi kualitas sangat mengecewakan. Saya minta refund tapi tidak ditanggapi. Tidak akan beli lagi di sini dan tidak merekomendasikan toko ini.`,

  id_mixed: `Produknya bagus dan berkualitas, tetapi harganya terlalu mahal dan pelayanannya lambat. Kualitas produk memang memuaskan, namun pengiriman terlambat dari estimasi dan kemasan kurang rapi. Secara keseluruhan barang oke, tapi layanan dan harga perlu diperbaiki.`,

  id_neutral: `Barang sudah diterima sesuai pesanan. Kemasan standar, tidak ada keistimewaan. Produk berfungsi seperti yang diinformasikan di deskripsi. Pengiriman cukup, tidak terlalu cepat dan tidak terlalu lambat. Harga biasa saja, sesuai dengan pasaran. Belum ada masalah sejauh ini. Lumayan untuk kebutuhan sehari-hari.`,

  irrelevant: `Halo, saya ingin bertanya tentang cara memasak nasi goreng yang enak. Bahan-bahan yang diperlukan antara lain nasi, kecap, bawang merah, dan telur. Langkah pertama adalah panaskan minyak di wajan.`,
};

// ── DOM refs ────────────────────────────────────────────────
const textarea          = document.getElementById('feedback-text');
const charsUsed         = document.getElementById('chars-used');
const analyzeBtn        = document.getElementById('analyze-btn');
const clearBtn          = document.getElementById('clear-btn');
const loadingEl         = document.getElementById('loading');
const errorBanner       = document.getElementById('error-banner');
const irrelevantBanner  = document.getElementById('irrelevant-banner');
const resultsEl         = document.getElementById('results');

// Results sub-elements
const sentimentBadge  = document.getElementById('sentiment-badge');
const sentimentValue  = document.getElementById('sentiment-value');
const mixedBadge      = document.getElementById('mixed-badge');
const confidencePct   = document.getElementById('confidence-pct');
const confidenceFill  = document.getElementById('confidence-fill');
const explanationText = document.getElementById('explanation-text');
const positiveList    = document.getElementById('positive-aspects');
const negativeList    = document.getElementById('negative-aspects');
const mainConcernEl   = document.getElementById('main-concern');
const recList         = document.getElementById('recommendations');
const summaryText     = document.getElementById('summary-text');
const debugPos        = document.getElementById('debug-pos');
const debugNeg        = document.getElementById('debug-neg');
const debugScore      = document.getElementById('debug-score');

// ── Character counter ───────────────────────────────────────
textarea.addEventListener('input', () => {
  charsUsed.textContent = textarea.value.length;
});

// ── Example buttons ─────────────────────────────────────────
document.querySelectorAll('.btn-example').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.example;
    if (EXAMPLES[key]) {
      textarea.value = EXAMPLES[key];
      charsUsed.textContent = textarea.value.length;
      textarea.focus();
      hideError();
    }
  });
});

// ── Clear button ────────────────────────────────────────────
clearBtn.addEventListener('click', () => {
  textarea.value = '';
  charsUsed.textContent = '0';
  hideResults();
  hideError();
  hideIrrelevant();
  textarea.focus();
});

// ── Analyze button ───────────────────────────────────────────
analyzeBtn.addEventListener('click', runAnalysis);
textarea.addEventListener('keydown', (e) => {
  // Ctrl+Enter or Cmd+Enter to submit
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runAnalysis();
});

// ── Core analysis flow ───────────────────────────────────────
async function runAnalysis() {
  const text = textarea.value.trim();
  if (!text) {
    showError('Please enter some customer feedback before analyzing.');
    textarea.focus();
    return;
  }
  if (text.length < 5) {
    showError('Feedback is too short. Please provide at least a sentence.');
    return;
  }

  hideError();
  hideIrrelevant();
  hideResults();
  showLoading(true);
  analyzeBtn.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error (${response.status})`);
    }

    // If the backend flagged the input as irrelevant, show warning instead of results
    if (data.irrelevant) {
      showIrrelevant(
        '⚠️ Input tidak relevan / Input not relevant: ' + data.explanation
      );
      return;
    }

    renderResults(data);
  } catch (err) {
    showError(`Analysis failed: ${err.message}. Please ensure the server is running.`);
  } finally {
    showLoading(false);
    analyzeBtn.disabled = false;
  }
}

// ── Render results ───────────────────────────────────────────
function renderResults(data) {
  const s = data.sentiment.toUpperCase();
  const colorKey = s === 'POSITIVE' ? 'positive' : s === 'NEGATIVE' ? 'negative' : 'neutral';

  // Sentiment badge emoji
  const emojiMap = { POSITIVE: '😊', NEGATIVE: '😞', NEUTRAL: '😐' };
  sentimentBadge.textContent = emojiMap[s] || '❓';
  sentimentBadge.className = `sentiment-badge sentiment-badge--${colorKey}`;

  // Sentiment label
  sentimentValue.textContent = s;
  sentimentValue.className = `sentiment-value sentiment-value--${colorKey}`;

  // Mixed feedback badge
  if (data.isMixed) {
    mixedBadge.classList.remove('hidden');
  } else {
    mixedBadge.classList.add('hidden');
  }

  // Confidence bar
  const pct = data.confidence;
  confidencePct.textContent = `${pct}%`;
  confidenceFill.style.width = `${pct}%`;
  confidenceFill.className = `confidence-fill confidence-fill--${colorKey}`;
  confidenceFill.parentElement.setAttribute('aria-valuenow', pct);

  // Explanation
  explanationText.textContent = data.explanation;

  // Positive aspects
  renderAspectList(positiveList, data.positiveAspects, 'positive');

  // Negative aspects
  renderAspectList(negativeList, data.negativeAspects, 'negative');

  // Main concern
  if (data.mainConcern) {
    mainConcernEl.textContent = capitalise(data.mainConcern);
    mainConcernEl.classList.remove('aspect-empty');
  } else {
    mainConcernEl.textContent = 'No critical concern identified.';
    mainConcernEl.classList.add('aspect-empty');
    mainConcernEl.classList.remove('concern-text');
  }

  // Recommendations
  recList.innerHTML = '';
  if (data.recommendations && data.recommendations.length > 0) {
    data.recommendations.forEach((rec) => {
      const li = document.createElement('li');
      li.textContent = rec;
      recList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No specific recommendations at this time.';
    recList.appendChild(li);
  }

  // Summary
  summaryText.textContent = data.summary;

  // Debug signals
  const debug = data._debug || {};
  debugPos.textContent   = (debug.positiveHits || []).length > 0
    ? debug.positiveHits.join(', ')
    : '(none detected)';
  debugNeg.textContent   = (debug.negativeHits || []).length > 0
    ? debug.negativeHits.join(', ')
    : '(none detected)';
  debugScore.textContent = debug.totalScore !== undefined
    ? (debug.totalScore >= 0 ? `+${debug.totalScore}` : `${debug.totalScore}`)
    : '—';

  // Show results with animation
  resultsEl.classList.remove('hidden');
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderAspectList(listEl, aspects, type) {
  listEl.innerHTML = '';
  if (!aspects || aspects.length === 0) {
    const li = document.createElement('li');
    li.className = 'aspect-empty';
    li.textContent = type === 'positive'
      ? 'No specific positive aspects identified.'
      : 'No specific negative aspects identified.';
    listEl.appendChild(li);
    return;
  }
  aspects.forEach((aspect) => {
    const li = document.createElement('li');
    li.textContent = capitalise(aspect);
    listEl.appendChild(li);
  });
}

// ── Helpers ──────────────────────────────────────────────────
function showLoading(show) {
  loadingEl.classList.toggle('hidden', !show);
}

function showError(msg) {
  errorBanner.textContent = `⚠️ ${msg}`;
  errorBanner.classList.remove('hidden');
}

function hideError() {
  errorBanner.classList.add('hidden');
  errorBanner.textContent = '';
}

function showIrrelevant(msg) {
  irrelevantBanner.textContent = msg;
  irrelevantBanner.classList.remove('hidden');
}

function hideIrrelevant() {
  irrelevantBanner.classList.add('hidden');
  irrelevantBanner.textContent = '';
}

function hideResults() {
  resultsEl.classList.add('hidden');
}

function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
