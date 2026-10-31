'use strict';

// ---------------------------------------------------------------------------
// Lexicon — scored word sets used for rule-based analysis
// ---------------------------------------------------------------------------

// ── English positive words ──────────────────────────────────────────────────
const POSITIVE_WORDS = {
  // product quality
  excellent: 3, outstanding: 3, superb: 3, exceptional: 3, perfect: 3,
  amazing: 2, fantastic: 2, wonderful: 2, brilliant: 2, magnificent: 2,
  great: 2, good: 1, nice: 1, solid: 1, quality: 1, reliable: 1,
  durable: 1, sturdy: 1, premium: 2, impressive: 2, beautiful: 1,
  elegant: 1, stylish: 1, 'well-made': 2, 'well made': 2,

  // service
  helpful: 2, professional: 2, responsive: 2, friendly: 1, efficient: 2,
  prompt: 1, courteous: 2, supportive: 1, attentive: 2, knowledgeable: 2,

  // price/value
  affordable: 1, 'value for money': 2, bargain: 2,
  'worth it': 2, 'worth every': 2, 'good deal': 2, inexpensive: 1,

  // delivery / packaging
  fast: 1, quick: 1, speedy: 2, timely: 1, 'on time': 2, punctual: 1,
  'well packaged': 2, 'well-packaged': 2, secure: 1, intact: 1,

  // general positive sentiment
  love: 3, loved: 3, like: 1, liked: 1, recommend: 2, recommended: 2,
  satisfied: 2, satisfaction: 2, happy: 2, pleased: 2, delighted: 3,
  thrilled: 3, impressed: 2, enjoy: 1, enjoyed: 1, exceeded: 2,
  'exceeded expectations': 3, awesome: 2, 'top notch': 2, 'top-notch': 2,
  works: 1, 'works great': 2, 'works well': 2, 'easy to use': 2,
  comfortable: 1, convenient: 1, smooth: 1, seamless: 2, flawless: 3,
};

// ── English negative words ──────────────────────────────────────────────────
const NEGATIVE_WORDS = {
  // product quality
  terrible: 3, awful: 3, horrible: 3, dreadful: 3, atrocious: 3,
  poor: 2, bad: 2, defective: 3, broken: 2, damaged: 2, faulty: 2,
  flimsy: 2, fragile: 1, 'low quality': 2, 'low-quality': 2,
  disappointing: 2, disappointed: 2, 'not worth': 2, 'waste of': 2,

  // service
  rude: 3, unhelpful: 2, unprofessional: 3, slow: 1, unresponsive: 2,
  ignorant: 2, dismissive: 2, 'no help': 2, useless: 2,

  // price
  expensive: 1, overpriced: 2, 'rip off': 3, 'rip-off': 3, costly: 1,
  'not worth the price': 3, 'not worth the money': 3,

  // delivery / packaging
  late: 1, delayed: 2, 'not delivered': 3, lost: 2, missing: 2,
  'poorly packaged': 2, 'poorly-packaged': 2,
  'arrived broken': 3, 'arrived damaged': 3,

  // general negative sentiment
  hate: 3, hated: 3, dislike: 2, disliked: 2, frustrating: 2,
  frustrated: 2, annoying: 2, annoyed: 2, 'not working': 3,
  "doesn't work": 3, 'does not work': 3, 'stopped working': 3,
  refund: 2, 'want a refund': 3, complaint: 2, issue: 1, problem: 1,
  issues: 1, problems: 1, failure: 2, failed: 2, fail: 2, error: 1,
  worst: 3, 'never again': 3, regret: 2, regretted: 2,
  'not satisfied': 2, dissatisfied: 2, unhappy: 2,
};

// ── Indonesian positive words ───────────────────────────────────────────────
const POSITIVE_WORDS_ID = {
  // product quality
  bagus: 2, berkualitas: 2, kualitasnya: 2, 'kualitas baik': 2,
  'sangat bagus': 3, 'sangat baik': 3, sempurna: 3, luar: 1,
  biasa: -1, // will be handled carefully, "luar biasa" = wonderful
  'luar biasa': 3, indah: 1, elegan: 1, kokoh: 2, kuat: 1, tahan: 1,
  premium: 2, mewah: 2, 'produk bagus': 2, 'produk berkualitas': 2,

  // service
  ramah: 2, helpful: 2, profesional: 2, responsif: 2, baik: 1,
  'pelayanan bagus': 2, 'pelayanan baik': 2, 'sangat membantu': 3,
  membantu: 1, 'customer service bagus': 2, 'staff ramah': 2,
  cepat: 1, sigap: 2, tanggap: 2,

  // price/value
  murah: 1, terjangkau: 1, 'harga terjangkau': 2, 'harga murah': 2,
  'harga sebanding': 2, 'worth it': 2, sepadan: 1, 'nilai uang': 1,
  'harga bagus': 2, 'harga oke': 1, 'sesuai harga': 1,

  // delivery / packaging
  'pengiriman cepat': 2, 'sampai cepat': 2, 'pengiriman tepat': 2,
  'dikemas dengan baik': 2, 'pengemasan bagus': 2, 'kemasan bagus': 2,
  'cepat sampai': 2, 'tepat waktu': 2,

  // general satisfaction
  puas: 2, memuaskan: 2, 'sangat puas': 3, 'sangat memuaskan': 3,
  nyaman: 1, 'sangat nyaman': 2, suka: 1, 'sangat suka': 2,
  senang: 1, 'sangat senang': 2, terbaik: 3, 'yang terbaik': 3,
  rekomendasi: 2, direkomendasikan: 2, 'sangat direkomendasikan': 3,
  'pasti beli lagi': 3, 'akan beli lagi': 2, 'beli lagi': 1,
  'terima kasih': 1, mantap: 2, 'sangat mantap': 3, keren: 1,
  'sangat keren': 2, oke: 1, 'oke banget': 2, 'cocok': 1,
  'sesuai ekspektasi': 2, 'melebihi ekspektasi': 3, 'sesuai deskripsi': 1,
  'sesuai gambar': 1,
};

// ── Indonesian negative words ───────────────────────────────────────────────
const NEGATIVE_WORDS_ID = {
  // product quality
  buruk: 2, jelek: 2, 'kualitas buruk': 3, 'kualitas jelek': 3,
  rusak: 2, cacat: 2, 'barang rusak': 3, 'barang cacat': 3,
  'tidak berkualitas': 2, 'tidak bagus': 2, 'tidak baik': 2,
  murahan: 2, 'tidak sesuai': 2, 'tidak sesuai deskripsi': 3,
  'tidak sesuai gambar': 2, 'tidak sesuai pesanan': 3,
  'palsu': 2, 'tiruan': 1,

  // service
  'tidak ramah': 2, 'kurang ramah': 1, 'pelayanan buruk': 3,
  'pelayanan jelek': 3, 'tidak responsif': 2, 'lambat respon': 2,
  'tidak membantu': 2, 'tidak profesional': 2, 'staff kasar': 3,
  'customer service buruk': 3, 'tidak ditanggapi': 2,

  // price
  mahal: 1, 'terlalu mahal': 2, 'harga mahal': 2, 'kemahalan': 2,
  'tidak worth it': 2, 'tidak sepadan': 2, 'tidak sesuai harga': 2,
  'harga tidak sesuai': 2,

  // delivery / packaging
  lambat: 1, 'pengiriman lambat': 2, 'lama sampai': 2, 'telat': 1,
  'terlambat': 2, 'belum sampai': 2, 'tidak sampai': 3,
  'barang tidak sampai': 3, 'pengemasan buruk': 2, 'kemasan rusak': 2,
  'kemasan buruk': 2, 'dikemas buruk': 2,

  // general negative sentiment
  kecewa: 2, 'sangat kecewa': 3, mengecewakan: 2, 'sangat mengecewakan': 3,
  'tidak puas': 2, 'sangat tidak puas': 3, 'kapok': 2,
  'tidak akan beli lagi': 3, 'tidak rekomen': 2, 'tidak direkomendasikan': 2,
  komplain: 1, masalah: 1, 'banyak masalah': 2, keluhan: 1,
  'minta refund': 3, 'minta pengembalian': 2, 'penipuan': 3,
  'dibohongi': 2, bohong: 2, 'tidak jujur': 2,
  'kecewa sekali': 3, 'sangat buruk': 3, 'parah': 2, 'sangat parah': 3,
};

// ── Indonesian neutral/contextual words ─────────────────────────────────────
// These are used only for relevance detection, not for scoring
const NEUTRAL_WORDS_ID = [
  'biasa', 'biasa saja', 'standar', 'cukup', 'cukup baik', 'cukup bagus',
  'tersedia', 'diinformasikan', 'sudah', 'lumayan', 'lumayan bagus',
  'tidak buruk', 'tidak jelek', 'sesuai', 'oke', 'ok',
];

// ── Indonesian intensifiers ─────────────────────────────────────────────────
const INTENSIFIERS_ID = {
  sangat: 2, 'amat sangat': 2.5, amat: 1.8, banget: 1.5,
  sekali: 1.5, 'benar-benar': 2, 'sungguh': 1.8, bener: 1.3,
  'bgt': 1.4, 'beneran': 1.3, 'paling': 1.8,
  // NOTE: 'terlalu' removed from intensifiers — it appears inside phrases like
  // "terlalu mahal" which are already scored at the phrase level. Keeping it
  // as an intensifier would double-penalise when the phrase is not matched.
};

// ── Contrast / adversative conjunctions (bilingual) ────────────────────────
// Words that signal a shift from positive to negative (or vice-versa).
// The clause AFTER one of these words is scored independently.
const CONTRAST_WORDS = new Set([
  // Indonesian
  'tetapi', 'tapi', 'namun', 'namun demikian', 'akan tetapi', 'meski',
  'meskipun', 'walaupun', 'walau', 'padahal', 'sedangkan', 'sementara',
  'sayangnya', 'malangnya',
  // English
  'but', 'however', 'although', 'though', 'even though', 'despite',
  'yet', 'unfortunately', 'sadly', 'whereas',
]);

// ── Indonesian negations ─────────────────────────────────────────────────────
const NEGATIONS_ID = new Set([
  'tidak', 'tak', 'bukan', 'belum', 'jangan', 'kurang', 'tanpa',
  'tanpa ada', 'tanpa',
]);

// ── English intensifiers ────────────────────────────────────────────────────
const INTENSIFIERS = {
  very: 1.5, extremely: 2, incredibly: 2, absolutely: 2, totally: 1.5,
  completely: 1.5, really: 1.3, quite: 1.2, rather: 1.2, so: 1.2,
  exceptionally: 2, genuinely: 1.3, truly: 1.5, highly: 1.5,
};

// ── English negations ────────────────────────────────────────────────────────
const NEGATIONS = new Set([
  'not', "don't", 'dont', 'no', 'never', 'neither', 'nobody',
  'nothing', 'nor', 'cannot', "can't", 'cant', "won't", 'wont',
  "isn't", 'isnt', "wasn't", 'wasnt', "doesn't", 'doesnt',
  "didn't", 'didnt', "wouldn't", 'wouldnt', "couldn't", 'couldnt',
]);

// ── Aspect keywords (bilingual) ──────────────────────────────────────────────
const ASPECT_MAP = {
  'product quality': [
    // English
    'product', 'quality', 'build', 'material', 'design', 'construction',
    'made', 'durable', 'sturdy', 'flimsy', 'defective', 'broken', 'faulty',
    'excellent', 'poor', 'premium', 'cheap',
    // Indonesian
    'produk', 'kualitas', 'bahan', 'desain', 'konstruksi', 'rusak', 'cacat',
    'bagus', 'buruk', 'jelek', 'berkualitas', 'kokoh', 'kuat', 'murahan',
  ],
  'customer service': [
    // English
    'service', 'support', 'staff', 'team', 'representative', 'agent',
    'helpful', 'rude', 'professional', 'response', 'customer service',
    'customer support', 'friendly', 'knowledgeable',
    // Indonesian
    'pelayanan', 'layanan', 'cs', 'admin', 'penjual', 'toko', 'respon',
    'ramah', 'responsif', 'membantu', 'tanggap', 'sopan',
  ],
  'pricing & value': [
    // English
    'price', 'cost', 'expensive', 'affordable', 'value', 'worth',
    'money', 'overpriced', 'bargain', 'deal', 'discount', 'fee', 'charge',
    // Indonesian
    'harga', 'biaya', 'mahal', 'murah', 'terjangkau', 'sepadan', 'promo',
    'diskon', 'bayar',
  ],
  'delivery & shipping': [
    // English
    'delivery', 'shipping', 'delivered', 'arrived', 'ship', 'transit',
    'fast', 'slow', 'late', 'delayed', 'on time', 'quick', 'speedy',
    // Indonesian
    'pengiriman', 'kurir', 'ekspedisi', 'kirim', 'sampai', 'tiba', 'diterima',
    'lambat', 'cepat', 'terlambat', 'telat', 'belum sampai',
  ],
  'packaging': [
    // English
    'packaging', 'package', 'box', 'wrapped', 'packing', 'packed',
    'secure', 'intact', 'damaged', 'broken',
    // Indonesian
    'kemasan', 'bungkus', 'packing', 'kardus', 'kotak', 'pembungkus',
    'dikemas', 'terbungkus',
  ],
};

// ---------------------------------------------------------------------------
// Relevance detection — is the text plausibly customer feedback?
// ---------------------------------------------------------------------------

// Customer-feedback indicator words / phrases (bilingual)
const FEEDBACK_INDICATORS = [
  // English
  'product', 'service', 'quality', 'delivery', 'shipping', 'packaging',
  'price', 'cost', 'buy', 'bought', 'purchase', 'purchased', 'order',
  'ordered', 'store', 'shop', 'seller', 'support', 'refund', 'return',
  'arrived', 'received', 'recommend', 'satisfied', 'dissatisfied', 'happy',
  'unhappy', 'complaint', 'issue', 'problem', 'experience', 'customer',
  'review', 'rating', 'item', 'goods', 'package',
  // Indonesian
  'produk', 'layanan', 'kualitas', 'pengiriman', 'kurir', 'kemasan',
  'harga', 'beli', 'beli', 'pesan', 'toko', 'penjual', 'barang',
  'puas', 'kecewa', 'bagus', 'buruk', 'ramah', 'masalah', 'keluhan',
  'pengalaman', 'pelanggan', 'ulasan', 'sampai', 'terima', 'diterima',
  'refund', 'retur',
];

/**
 * Returns true if the text looks like customer feedback, false if it appears
 * to be random/off-topic input (e.g. code, gibberish, unrelated prose).
 */
function isRelevantFeedback(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const wordCount = words.length;

  // Very short inputs that contain no feedback signals → irrelevant
  if (wordCount < 3) return false;

  // Count how many feedback indicator words/phrases appear
  let hits = 0;
  for (const indicator of FEEDBACK_INDICATORS) {
    if (lower.includes(indicator)) hits++;
  }

  // Also check if any scored lexicon words are present
  const allScoredWords = [
    ...Object.keys(POSITIVE_WORDS),
    ...Object.keys(NEGATIVE_WORDS),
    ...Object.keys(POSITIVE_WORDS_ID),
    ...Object.keys(NEGATIVE_WORDS_ID),
  ];
  for (const w of allScoredWords) {
    if (lower.includes(w)) hits++;
    if (hits >= 2) break; // early exit once we have enough evidence
  }

  // Require at least 2 hits for longer text, 1 for short text
  const threshold = wordCount > 20 ? 2 : 1;
  return hits >= threshold;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function tokenize(text) {
  return text.toLowerCase().replace(/['']/g, "'").split(/\s+/);
}

/**
 * Split a single sentence into clauses at contrast-word boundaries.
 * Returns an array of { clause: string, isPostContrast: boolean }.
 *
 * Example:
 *   "Produknya bagus, tetapi harganya mahal dan pelayanannya lambat."
 *   → [ { clause: "Produknya bagus,", isPostContrast: false },
 *       { clause: "harganya mahal dan pelayanannya lambat.", isPostContrast: true } ]
 */
function splitAtContrast(sentence) {
  const lower = sentence.toLowerCase();

  // Try multi-word contrast phrases first (longest match wins)
  const sortedContrast = [...CONTRAST_WORDS].sort((a, b) => b.length - a.length);

  for (const cw of sortedContrast) {
    // Match the contrast word as a whole word (surrounded by spaces, punctuation, or start/end)
    const pattern = new RegExp('(?:^|[\\s,;])' + cw.replace(/[-]/g, '[-]') + '(?:[\\s,;]|$)', 'i');
    const m = pattern.exec(lower);
    if (m) {
      const splitIdx = m.index + m[0].indexOf(cw);
      const before = sentence.slice(0, splitIdx).trim();
      const after  = sentence.slice(splitIdx + cw.length).trim();
      if (before && after) {
        return [
          { clause: before, isPostContrast: false },
          { clause: after,  isPostContrast: true  },
        ];
      }
    }
  }

  // No contrast word found — return the sentence as a single pre-contrast clause
  return [{ clause: sentence, isPostContrast: false }];
}

/**
 * Score a single sentence against both EN and ID lexicons.
 * Returns { score: number, positiveHits: string[], negativeHits: string[] }
 */
function scoreSentence(sentence) {
  const tokens = tokenize(sentence);
  let score = 0;
  const positiveHits = [];
  const negativeHits = [];

  const lower = sentence.toLowerCase();

  // ── Multi-word phrase matching (priority over single words) ──────────────
  // Collect all multi-word keys from all four lexicons
  const phraseKeys = [
    ...Object.keys(POSITIVE_WORDS).filter((k) => k.includes(' ')),
    ...Object.keys(NEGATIVE_WORDS).filter((k) => k.includes(' ')),
    ...Object.keys(POSITIVE_WORDS_ID).filter((k) => k.includes(' ')),
    ...Object.keys(NEGATIVE_WORDS_ID).filter((k) => k.includes(' ')),
  ];
  // Sort by length descending so longer phrases match first (e.g. "sangat tidak puas" before "tidak puas")
  phraseKeys.sort((a, b) => b.split(' ').length - a.split(' ').length);

  const matchedRanges = [];

  for (const phrase of phraseKeys) {
    const idx = lower.indexOf(phrase);
    if (idx === -1) continue;

    const wordCount = phrase.split(' ').length;
    const tokenIndex = lower.slice(0, idx).split(/\s+/).length - 1;

    // Skip if any of the token positions are already consumed
    const range = Array.from({ length: wordCount }, (_, i) => tokenIndex + i);
    if (range.some((r) => matchedRanges.includes(r))) continue;

    const isPositive = (phrase in POSITIVE_WORDS) || (phrase in POSITIVE_WORDS_ID);
    const wordScore = isPositive
      ? (POSITIVE_WORDS[phrase] ?? POSITIVE_WORDS_ID[phrase])
      : (NEGATIVE_WORDS[phrase] ?? NEGATIVE_WORDS_ID[phrase]);

    // Check for negation in the 3-token window before the phrase.
    // Skip if the phrase itself starts with a negation word (e.g. "tidak bagus",
    // "tidak sesuai deskripsi") — it is already self-negated by lexicon design.
    const allNegations = new Set([...NEGATIONS, ...NEGATIONS_ID]);
    const phraseFirstToken = phrase.split(' ')[0];
    let negated = false;
    if (!allNegations.has(phraseFirstToken)) {
      for (let k = Math.max(0, tokenIndex - 3); k < tokenIndex; k++) {
        if (allNegations.has(tokens[k])) { negated = true; break; }
      }
    }

    const finalScore = negated ? -wordScore : wordScore;
    if (isPositive) {
      score += finalScore;
      if (finalScore > 0) positiveHits.push(phrase);
      else negativeHits.push(`not ${phrase}`);
    } else {
      score -= negated ? -wordScore : wordScore;
      const effective = negated ? wordScore : -wordScore;
      if (effective < 0) negativeHits.push(phrase);
      else positiveHits.push(`not ${phrase}`);
    }

    range.forEach((r) => matchedRanges.push(r));
  }

  // ── Single-word scoring ───────────────────────────────────────────────────
  const allIntensifiers = { ...INTENSIFIERS, ...INTENSIFIERS_ID };
  const allNegations = new Set([...NEGATIONS, ...NEGATIONS_ID]);

  for (let i = 0; i < tokens.length; i++) {
    if (matchedRanges.includes(i)) continue;

    const token = tokens[i].replace(/[^a-zàáâãäåèéêëìíîïòóôõöùúûü']/g, '');
    if (!token) continue;

    // Intensifier on the immediately preceding token
    let multiplier = 1;
    if (i > 0 && allIntensifiers[tokens[i - 1]]) {
      multiplier = allIntensifiers[tokens[i - 1]];
    }

    // Negation within a 3-token window
    let negated = false;
    for (let k = Math.max(0, i - 3); k < i; k++) {
      if (allNegations.has(tokens[k])) { negated = true; break; }
    }

    if (token in POSITIVE_WORDS) {
      const raw = POSITIVE_WORDS[token] * multiplier;
      const delta = negated ? -raw : raw;
      score += delta;
      if (delta > 0) positiveHits.push(token);
      else if (delta < 0) negativeHits.push(`not ${token}`);
    } else if (token in NEGATIVE_WORDS) {
      const raw = NEGATIVE_WORDS[token] * multiplier;
      const delta = negated ? raw : -raw;
      score += delta;
      if (delta < 0) negativeHits.push(token);
      else if (delta > 0) positiveHits.push(`not ${token}`);
    } else if (token in POSITIVE_WORDS_ID) {
      const raw = POSITIVE_WORDS_ID[token] * multiplier;
      const delta = negated ? -raw : raw;
      score += delta;
      if (delta > 0) positiveHits.push(token);
      else if (delta < 0) negativeHits.push(`tidak ${token}`);
    } else if (token in NEGATIVE_WORDS_ID) {
      const raw = NEGATIVE_WORDS_ID[token] * multiplier;
      const delta = negated ? raw : -raw;
      score += delta;
      if (delta < 0) negativeHits.push(token);
      else if (delta > 0) positiveHits.push(`tidak ${token}`);
    }
  }

  return { score, positiveHits, negativeHits };
}

// ---------------------------------------------------------------------------
// Clause-level analysis — splits on both sentence boundaries AND contrast words
// ---------------------------------------------------------------------------

// Weight applied to post-contrast clauses (after "tetapi", "but", etc.).
// The customer's complaint after a contrast word carries extra communicative weight.
const CONTRAST_WEIGHT = 1.5;

/**
 * Expand raw sentences by further splitting each at contrast-word boundaries.
 * Returns an array of { clause, score, positiveHits, negativeHits }.
 *
 * Post-contrast clauses have their score multiplied by CONTRAST_WEIGHT to
 * reflect that "X is good, BUT Y is bad" emphasises the Y complaint.
 */
function getClauses(text) {
  const rawSentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const clauses = [];

  for (const sent of rawSentences) {
    const parts = splitAtContrast(sent);
    for (const { clause, isPostContrast } of parts) {
      const { score: rawScore, positiveHits, negativeHits } = scoreSentence(clause);
      const score = isPostContrast ? rawScore * CONTRAST_WEIGHT : rawScore;
      clauses.push({ clause, score, positiveHits, negativeHits, isPostContrast });
    }
  }

  return clauses;
}

// ---------------------------------------------------------------------------
// Mixed sentiment detection
// ---------------------------------------------------------------------------

/**
 * Detect which aspects are mentioned and what polarity each carries.
 * Returns { positiveAspects, negativeAspects, isMixed }
 *
 * Uses clause-level granularity (sentence + contrast-word splits) so that
 * "Produknya bagus, tetapi harganya mahal" correctly scores pricing as negative.
 *
 * Aspect polarity is assigned ONLY when there is direct lexical evidence
 * in the same clause that mentions the aspect keyword.
 * The zero-fallback is intentionally removed — if no sentiment evidence
 * is present in a clause, the aspect is simply not categorised.
 */
function detectAspects(text) {
  const clauses = getClauses(text);

  const positiveAspects = [];
  const negativeAspects = [];

  // isMixed = true when at least one clause scores positive AND another negative
  const hasPosClause = clauses.some((c) => c.score > 0);
  const hasNegClause = clauses.some((c) => c.score < 0);
  const isMixed = hasPosClause && hasNegClause;

  for (const [aspect, keywords] of Object.entries(ASPECT_MAP)) {
    let aspectPosScore = 0;
    let aspectNegScore = 0;
    let mentioned = false;

    for (const { clause, score } of clauses) {
      const clauseLower = clause.toLowerCase();
      const keywordHit = keywords.some((kw) => clauseLower.includes(kw));
      if (!keywordHit) continue;

      mentioned = true;
      // Only accumulate score if the clause itself has clear sentiment signal
      if (score > 0) aspectPosScore += score;
      else if (score < 0) aspectNegScore += score;
    }

    if (!mentioned) continue;

    // Assign polarity only with direct evidence — no zero-fallback
    if (aspectPosScore > 0) positiveAspects.push(aspect);
    if (aspectNegScore < 0) negativeAspects.push(aspect);
    // If score is exactly 0 for all matching clauses, the aspect is genuinely
    // neutral or ambiguous — we do NOT force it into either list.
  }

  return {
    positiveAspects: [...new Set(positiveAspects)],
    negativeAspects: [...new Set(negativeAspects)],
    isMixed,
  };
}

// ---------------------------------------------------------------------------
// Supporting helpers
// ---------------------------------------------------------------------------

function findMainConcern(negativeHits) {
  if (negativeHits.length === 0) return null;
  const freq = {};
  for (const hit of negativeHits) {
    freq[hit] = (freq[hit] || 0) + 1;
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

function generateRecommendations(sentiment, negativeAspects, positiveAspects) {
  const recs = [];

  if (sentiment === 'POSITIVE' && negativeAspects.length === 0) {
    recs.push('Maintain current quality standards and service levels.');
    recs.push('Leverage positive reviews in marketing campaigns.');
    recs.push('Encourage satisfied customers to leave public reviews.');
  }

  if (sentiment === 'POSITIVE' && negativeAspects.length > 0) {
    recs.push('Address the minor concerns raised to convert satisfied customers into loyal advocates.');
  }

  if (sentiment === 'NEGATIVE') {
    recs.push('Investigate and resolve the reported issues promptly to prevent customer churn.');
  }

  if (sentiment === 'NEUTRAL') {
    recs.push('Identify and improve areas that are merely "adequate" to create memorable experiences.');
  }

  const aspectRecs = {
    'product quality': [
      'Review and improve product manufacturing or sourcing.',
      'Implement a quality control checklist before shipping.',
    ],
    'customer service': [
      'Invest in customer service training for staff.',
      'Set and monitor response-time SLAs.',
    ],
    'pricing & value': [
      'Audit pricing strategy against competitor benchmarks.',
      'Introduce loyalty programmes or bundle offers to improve perceived value.',
    ],
    'delivery & shipping': [
      'Audit logistics partners and negotiate faster delivery options.',
      'Provide real-time tracking notifications to customers.',
    ],
    'packaging': [
      'Upgrade packaging materials to prevent transit damage.',
      'Test packaging under simulated shipping conditions.',
    ],
  };

  for (const aspect of negativeAspects) {
    if (aspectRecs[aspect]) recs.push(...aspectRecs[aspect]);
  }

  if (recs.length === 0) {
    recs.push('Continue collecting feedback to identify improvement areas.');
  }

  return [...new Set(recs)].slice(0, 5);
}

function buildSummary(sentiment, isMixed, positiveAspects, negativeAspects) {
  const pa = positiveAspects.length > 0 ? positiveAspects.join(', ') : null;
  const na = negativeAspects.length > 0 ? negativeAspects.join(', ') : null;

  if (isMixed) {
    return `The feedback is mixed — the customer has both positive and negative opinions. ${pa ? `Strengths: ${pa}.` : ''} ${na ? `Pain points: ${na}.` : ''} Targeted improvement on the negative aspects could significantly improve overall satisfaction.`;
  }

  if (sentiment === 'POSITIVE') {
    return `The customer expressed a positive experience. ${pa ? `Key strengths identified: ${pa}.` : ''} The overall tone was enthusiastic and appreciative.`;
  }
  if (sentiment === 'NEGATIVE') {
    return `The customer expressed dissatisfaction. ${na ? `Main pain points: ${na}.` : ''} ${pa ? `Some positives were noted: ${pa}.` : ''} Immediate attention is recommended.`;
  }
  return `The feedback is neutral or balanced. ${pa ? `Positive aspects: ${pa}.` : ''} ${na ? `Areas for improvement: ${na}.` : ''} The customer has moderate opinions with no strong sentiment.`;
}

function computeConfidence(score, wordCount) {
  const magnitude = Math.abs(score);
  const density = magnitude / Math.max(wordCount, 1);
  const raw = Math.min(density / 0.8, 1);
  return Math.round(55 + raw * 44);
}

function buildExplanation(sentiment, score, isMixed, positiveHits, negativeHits) {
  const pCount = positiveHits.length;
  const nCount = negativeHits.length;

  if (isMixed) {
    return `The feedback contains both positive (${pCount} signal${pCount !== 1 ? 's' : ''}) and negative (${nCount} signal${nCount !== 1 ? 's' : ''}) opinions in different parts of the text (aggregate score: ${score >= 0 ? '+' : ''}${score.toFixed(1)}). The overall verdict leans ${sentiment === 'POSITIVE' ? 'positive' : sentiment === 'NEGATIVE' ? 'negative' : 'neutral'} but both sides should be acknowledged.`;
  }

  if (sentiment === 'POSITIVE') {
    if (nCount > 0) {
      return `The feedback is predominantly positive (${pCount} positive signal${pCount !== 1 ? 's' : ''} vs ${nCount} negative), with an aggregate score of +${score.toFixed(1)}. The customer is generally satisfied despite minor concerns.`;
    }
    return `The feedback contains ${pCount} positive signal${pCount !== 1 ? 's' : ''} with an aggregate score of +${score.toFixed(1)}, indicating clear satisfaction.`;
  }

  if (sentiment === 'NEGATIVE') {
    if (pCount > 0) {
      return `The feedback is predominantly negative (${nCount} negative signal${nCount !== 1 ? 's' : ''} vs ${pCount} positive), with an aggregate score of ${score.toFixed(1)}. The customer is dissatisfied overall despite some positive remarks.`;
    }
    return `The feedback contains ${nCount} negative signal${nCount !== 1 ? 's' : ''} with an aggregate score of ${score.toFixed(1)}, indicating clear dissatisfaction.`;
  }

  return `The feedback is balanced with ${pCount} positive and ${nCount} negative signal${nCount !== 1 ? 's' : ''} (aggregate score: ${score.toFixed(1)}), resulting in a neutral overall sentiment.`;
}

// ---------------------------------------------------------------------------
// Main exported function
// ---------------------------------------------------------------------------

/**
 * Analyse customer feedback text and return a structured result.
 * @param {string} text
 * @returns {object}
 */
function analyze(text) {
  if (!text || text.trim().length === 0) {
    throw new Error('Feedback text must not be empty.');
  }

  const trimmed = text.trim();

  // ── Relevance guard ────────────────────────────────────────────────────────
  if (!isRelevantFeedback(trimmed)) {
    return {
      mode: 'rule-based',
      irrelevant: true,
      sentiment: 'UNKNOWN',
      explanation: 'The input does not appear to be customer feedback. Please enter a review or feedback about a product, service, delivery, or overall shopping experience.',
      positiveAspects: [],
      negativeAspects: [],
      mainConcern: null,
      confidence: 0,
      recommendations: ['Please provide relevant customer feedback for accurate analysis.'],
      summary: 'Unable to analyse: the input text does not contain recognisable customer feedback signals.',
      _debug: { totalScore: 0, positiveHits: [], negativeHits: [] },
    };
  }

  // ── Clause-level scoring (sentence splits + contrast-word splits) ──────────
  const clauses = getClauses(trimmed);
  const allPositiveHits = [];
  const allNegativeHits = [];
  let totalScore = 0;

  for (const { score, positiveHits, negativeHits } of clauses) {
    totalScore += score;
    allPositiveHits.push(...positiveHits);
    allNegativeHits.push(...negativeHits);
  }

  // ── Aspect detection (with mixed-sentiment awareness) ──────────────────────
  const { positiveAspects, negativeAspects, isMixed } = detectAspects(trimmed);

  // ── Overall sentiment ──────────────────────────────────────────────────────
  // Compute raw positive / negative sums to determine the dominant side.
  const rawPosSumClauses = clauses.reduce((acc, c) => acc + Math.max(0, c.score), 0);
  const rawNegSumClauses = clauses.reduce((acc, c) => acc + Math.min(0, c.score), 0);

  let sentiment;
  if (isMixed) {
    // For mixed feedback, compare the magnitude of each side.
    // If negative signals are stronger, lean NEGATIVE; if positive stronger, POSITIVE;
    // otherwise stay NEUTRAL.
    const posMag = rawPosSumClauses;
    const negMag = Math.abs(rawNegSumClauses);
    if (negMag > posMag * 1.1) sentiment = 'NEGATIVE';       // negative clearly dominates
    else if (posMag > negMag * 1.1) sentiment = 'POSITIVE';  // positive clearly dominates
    else sentiment = 'NEUTRAL';                               // genuinely balanced
  } else {
    if (totalScore > 1.5) sentiment = 'POSITIVE';
    else if (totalScore < -1.5) sentiment = 'NEGATIVE';
    else sentiment = 'NEUTRAL';
  }

  const mainConcern = findMainConcern(allNegativeHits);
  const recommendations = generateRecommendations(sentiment, negativeAspects, positiveAspects);
  const wordCount = tokenize(trimmed).length;
  const confidence = computeConfidence(totalScore, wordCount);
  const explanation = buildExplanation(sentiment, totalScore, isMixed, allPositiveHits, allNegativeHits);
  const summary = buildSummary(sentiment, isMixed, positiveAspects, negativeAspects);

  return {
    mode: 'rule-based',
    irrelevant: false,
    sentiment,
    isMixed,
    explanation,
    positiveAspects,
    negativeAspects,
    mainConcern,
    confidence,
    recommendations,
    summary,
    _debug: {
      totalScore: parseFloat(totalScore.toFixed(2)),
      positiveHits: [...new Set(allPositiveHits)],
      negativeHits: [...new Set(allNegativeHits)],
    },
  };
}

module.exports = { analyze };
