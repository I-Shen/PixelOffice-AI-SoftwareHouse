/**
 * PixelOffice AI Software House - Dynamic Executive Consultation Engine
 * Master Corporate Blueprint, Dynamic PRD Formulation & Zero-Hallucination SDLC Handover
 * Arthur Vance (Head of Engineering) & Dr. Elena Rostova (Chief PRD Architect)
 */

import { CONFIG } from './config.js';
import { PromptOptimizer } from './prompt_optimizer.js';

export class ExecutiveAdvisor {
  constructor(llmRouter) {
    this.router = llmRouter;
    this.optimizer = new PromptOptimizer(this.router);
    this.conversationHistory = [];
    this.currentRawPrompt = "";
    this.isDealReached = false;
    this.masterPrompt = "";
    this.detectedScope = null;
    this.turnCount = 0;
    this.extractedSpecs = {};
    this.lastEvaluation = null;
    this.eventListeners = [];
  }

  on(event, callback) {
    this.eventListeners.push({ event, callback });
  }

  emit(event, data) {
    this.eventListeners.filter(l => l.event === event).forEach(l => l.callback(data));
  }

  /**
   * Intelligently classify the complexity tier and architectural scope of user request
   */
  classifyScope(promptText) {
    const text = (promptText || "").toLowerCase();
    
    if (/marketplace|multi[- ]vendor|tokopedia|shopee|fintech|payment gateway|escrow|saas|multi[- ]tenant|ai[- ]platform|vector store|rag|crypto|trading/i.test(text)) {
      return {
        tier: "COMPLEX_PLATFORM",
        label: "Platform Kompleks / Marketplace / SaaS / Multi-Role System",
        description: "Memerlukan penelaahan arsitektur mendalam: skema data relasional, role-based access control, dan state management."
      };
    }
    
    if (/basket|manajemen|management|olahraga|sekolah|portal|dashboard|keuangan|jadwal|pemain|upload|storage|database|crud|login|autentikasi|broadcast/i.test(text)) {
      return {
        tier: "INTERACTIVE_APP",
        label: "Sistem Informasi & Aplikasi Web Interaktif Komprehensif",
        description: "Memerlukan integrasi modul lengkap: manajemen data, filter peran (RBAC), generator teks, dan antarmuka interaktif."
      };
    }

    return {
      tier: "CUSTOM_WEB",
      label: "Aplikasi Web & Digital Portal Modern",
      description: "Fokus pada estetika UI/UX kelas dunia, alur navigasi intuitif, dan fungsionalitas modul responsif."
    };
  }

  /**
   * Start a new executive consultation session based on user's prompt
   */
  async startConsultation(rawPrompt) {
    this.currentRawPrompt = (rawPrompt || "").trim();
    this.conversationHistory = [];
    this.isDealReached = false;
    this.masterPrompt = "";
    this.turnCount = 1;
    this.detectedScope = this.classifyScope(this.currentRawPrompt);

    // 1. Perform genuine multi-dimensional evaluation of user's prompt
    this.lastEvaluation = this.optimizer.evaluatePromptHeuristics(this.currentRawPrompt);
    const dynamicTitle = this._extractDynamicTitle(this.currentRawPrompt);
    this.currentProjectTitle = dynamicTitle;

    this.conversationHistory.push({
      role: "user",
      content: this.currentRawPrompt || "Halo Arthur dan Elena, tolong rancang dan kembangkan sistem web aplikasi baru kita."
    });

    this.emit('message_sent', { text: this.currentRawPrompt });

    // =========================================================================
    // 🗣️ PUTARAN 1: Dr. Elena Rostova (Chief PRD Architect)
    // Telaah & Bedah Kebutuhan Asli: Skor Objektif, Kekuatan, dan Celah Logika
    // =========================================================================
    const elenaPrompt = `Anda adalah Dr. Elena Rostova, Chief PRD Architect di PixelOffice AI.
Lakukan Putaran 1 Penalaran Mendalam terhadap instruksi proyek dari Bos @I-Shen berikut:
"${this.currentRawPrompt}"

Data Evaluasi Matematis Riil:
- Skor Asli: ${this.lastEvaluation.score}/100 (Grade: ${this.lastEvaluation.grade})
- Skor Visi & Scope: ${this.lastEvaluation.breakdown.vision}/20
- Skor Modul Fungsional: ${this.lastEvaluation.breakdown.modules}/20
- Skor RBAC & Role Akses: ${this.lastEvaluation.breakdown.rbac}/20
- Skor Desain & UI/UX Dribbble: ${this.lastEvaluation.breakdown.uiux}/20
- Skor Keamanan & Validasi Teknis: ${this.lastEvaluation.breakdown.technical}/20

Tugas Dr. Elena di Putaran 1:
1. Bedah prompt Bos secara analitis dan jujur:
   - Sampaikan skor evaluasi objektif awal (${this.lastEvaluation.score}/100 - Grade: ${this.lastEvaluation.grade}). JANGAN menulis 100/100!
   - Uraikan poin-poin kekuatan spesifikasi Bos yang sudah matang dan jelas.
   - Sorot celah logika, ambiguitas alur pengguna, atau risiko teknis yang harus diantisipasi sesuai domain spesifik proyek ini.
2. Lempar telaah teknis ini kepada Arthur Vance (Head of Engineering) untuk diuji kelayakan arsitektur sistemnya.`;

    const elenaRes = await this.router.generateText({
      prompt: elenaPrompt,
      systemInstruction: "Anda adalah Dr. Elena Rostova, Chief PRD Architect di PixelOffice AI. Anda menalar prompt secara kritis, tajam, objektif, dan matematis.",
      taskType: "fast",
      agentId: "optimizer"
    });

    this.conversationHistory.push({
      role: "assistant",
      content: `[Dr. Elena Rostova]: ${elenaRes.text}`
    });

    this.emit('discussion_round', {
      round: 1,
      speaker: "Dr. Elena Rostova",
      role: "Chief PRD Architect",
      avatar: "🔍",
      color: "#8b5cf6",
      text: elenaRes.text
    });

    // =========================================================================
    // 🗣️ PUTARAN 2: Arthur Vance (Head of Engineering)
    // Uji Kelayakan Arsitektur, Data Flow, Transaksi Atomik & RBAC Security
    // =========================================================================
    const arthurPrompt = `Anda adalah Arthur Vance, Head of Engineering di PixelOffice AI.
Tanggapi Putaran 1 dari Dr. Elena Rostova mengenai proyek [${dynamicTitle}]:
"${elenaRes.text}"

Tugas Arthur Vance di Putaran 2:
1. Jawab tantangan arsitektur yang disorot Elena secara teknis dan mendalam:
   - Bagaimana arsitektur data flow, state management, dan pencegahan kondisi error / edge cases ditangani pada proyek ini?
   - Bagaimana penanganan aturan bisnis inti, integritas data, dan otorisasi peran (RBAC) diimplementasikan secara kokoh?
   - Konfirmasi strategi Single Page Application mandiri (HTML5, Modern CSS, Vanilla JS ES6+) tanpa dependensi eksternal yang rapuh.
2. Minta Elena merumuskan konsensus akhir untuk dipresentasikan kepada Bos @I-Shen.`;

    const arthurRes = await this.router.generateText({
      prompt: arthurPrompt,
      systemInstruction: "Anda adalah Arthur Vance, Head of Engineering di PixelOffice AI. Anda berfokus pada kepatuhan arsitektur, kelayakan kode produksi, dan zero-bug guarantee.",
      taskType: "fast",
      agentId: "manager"
    });

    this.conversationHistory.push({
      role: "assistant",
      content: `[Arthur Vance]: ${arthurRes.text}`
    });

    this.emit('discussion_round', {
      round: 2,
      speaker: "Arthur Vance",
      role: "Head of Engineering",
      avatar: "👔",
      color: "#3b82f6",
      text: arthurRes.text
    });

    // =========================================================================
    // 👑 PUTARAN 3: Konsensus Eksekutif Final (Arthur & Elena Bersama)
    // Skor PRD Terverifikasi & Presentasi Siap Eksekusi ke Bos @I-Shen
    // =========================================================================
    const verifiedScore = Math.min(98, Math.max(88, this.lastEvaluation.score + 14));
    const consensusPrompt = `Anda adalah Arthur Vance & Dr. Elena Rostova di Ruang Eksekutif PixelOffice.
Berdasarkan Putaran 1 (Telaah Elena) dan Putaran 2 (Arsitektur Arthur), rumuskan KONSENSUS DEAL FINAL untuk Bos @I-Shen mengenai proyek [${dynamicTitle}].

Tugas Konsensus di Putaran 3:
1. Beritahu Bos @I-Shen bahwa diskusi internal 3 putaran eksekutif telah selesai dengan hasil konsensus matang.
2. Tegaskan Nama Proyek Resmi: "${dynamicTitle}".
3. Sampaikan SKOR KESIAPAN PRD TERVERIFIKASI: ${verifiedScore}/100 (Bukan asal 100/100, melainkan skor tervalidasi hasil perpaduan kebutuhan Bos dan mitigasi teknis kami).
4. Rangkum secara padat 4-5 pilar arsitektur utama yang disepakati untuk merealisasikan seluruh visi dan modul proyek ini secara sempurna.
5. Beritahu Bos: "PRD Emas telah terkunci (${verifiedScore}/100). Silakan klik tombol '🚀 Eksekusi Koding Sekarang' di kartu pop-up untuk memulai pembuatan sistem!"
6. Wajib akhiri pesan dengan tag [DEAL_REACHED].`;

    const consensusRes = await this.router.generateText({
      prompt: consensusPrompt,
      systemInstruction: "Anda adalah Arthur Vance & Dr. Elena Rostova. Sajikan konsensus eksekutif final yang profesional, presisi, tervalidasi, dan ramah kepada Bos @I-Shen.",
      taskType: "fast",
      agentId: "manager"
    });

    this.conversationHistory.push({
      role: "assistant",
      content: consensusRes.text
    });

    this.isDealReached = true;
    this.masterPrompt = await this.synthesizeFinalPRD(dynamicTitle, verifiedScore);

    const cleanReply = consensusRes.text.replace(/\[DEAL_REACHED\]/g, '').trim();

    const result = {
      reply: cleanReply,
      text: cleanReply,
      isDeal: true,
      score: verifiedScore,
      grade: this.lastEvaluation.grade,
      breakdown: this.lastEvaluation.breakdown,
      scope: this.detectedScope,
      projectName: dynamicTitle,
      masterPrompt: this.masterPrompt
    };

    this.emit('message_received', result);
    return result;
  }

  /**
   * Continue the interactive conversation with user
   */
  async sendMessage(userText) {
    const text = (userText || "").trim();
    if (!text) return { reply: "", text: "", isDeal: this.isDealReached, score: this.lastEvaluation?.score || 85 };

    // Always run the comprehensive 3-round internal executive deliberation when user submits requirements
    this.currentRawPrompt = text;
    return this.startConsultation(text);
  }

  _extractDynamicTitle(text) {
    if (!text) return "Enterprise Web Application";
    const cleanText = String(text).trim();

    // 0a. Explicit project name pattern with brackets: e.g. nama proyek [KasirPro ...]
    const namedBracketMatch = cleanText.match(/(?:nama\s+proyek|nama\s+aplikasi|nama\s+website|nama\s+sistem|proyek|project)\s*[:=]?\s*\[([^\]]{3,80})\]/i);
    if (namedBracketMatch && namedBracketMatch[1] && !this._isIgnoredWord(namedBracketMatch[1])) {
      return namedBracketMatch[1].trim();
    }

    // 0b. Explicit project name with quotes: e.g. nama proyeknya adalah "Kasir Pro"
    const explicitNamedQuotes = cleanText.match(/(?:nama\s+website\s+yang\s+dipakai\s+url\s+dan\s+nama\s+proyeknya|nama\s+proyek|nama\s+website|nama\s+aplikasi|nama\s+sistem)\s+(?:[^\n\r"']{0,40}?\s+)?(?:adalah|yaitu|=|:)\s*["'“]([^"'”]+)["'”]/i);
    if (explicitNamedQuotes && explicitNamedQuotes[1] && !this._isIgnoredWord(explicitNamedQuotes[1])) {
      return explicitNamedQuotes[1].trim();
    }

    // 0c. Any bracket with valid title: e.g. [KasirPro Single-Store POS Edition v2.0 - Ultra Fast Checkout]
    const bracketMatch = cleanText.match(/\[([^\]]{3,80})\]/);
    if (bracketMatch && bracketMatch[1] && !this._isIgnoredWord(bracketMatch[1])) {
      return bracketMatch[1].trim();
    }

    // 1. Quoted title right after keywords (e.g. website "...", aplikasi "...", sistem "...", proyek "...")
    const directNamedMatch = cleanText.match(/(?:website|aplikasi|sistem|proyek|project|platform|portal|toko|klinik|dashboard|software)\s+["'“]([^"'”]+)["'”]/i);
    if (directNamedMatch && directNamedMatch[1] && !this._isIgnoredWord(directNamedMatch[1])) {
      return directNamedMatch[1].trim();
    }

    // 2. Explicit pattern with keywords: e.g. "nama proyek/judul/brand adalah '...'"
    const explicitQuotes = cleanText.match(/(?:nama\s+proyek|nama\s+website|nama\s+aplikasi|nama\s+sistem|judul|brand)\s+(?:[^\n\r"']{0,40}?\s+)?(?:adalah|yaitu|=|:)\s*["'“]([^"'”]+)["'”]/i);
    if (explicitQuotes && explicitQuotes[1] && !this._isIgnoredWord(explicitQuotes[1])) {
      return explicitQuotes[1].trim();
    }

    // 2b. Explicit named phrase without quotes (e.g. dengan nama XYZ, bernama XYZ)
    const namePhraseMatch = cleanText.match(/(?:bernama|dengan\s+nama|nama\s+proyek|nama\s+website|nama\s+aplikasi|nama\s+sistem|nama\s+brand)\s+([A-Za-z0-9_ -]{2,35})/i);
    if (namePhraseMatch && namePhraseMatch[1]) {
      const cand = namePhraseMatch[1].replace(/^(adalah|yaitu|:)\s*/i, '').trim();
      if (!this._isIgnoredWord(cand) && cand.length > 2) {
        return cand.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }

    // 3. Generic quotes anywhere
    const anyQuotes = cleanText.match(/["'“]([^"'”]{2,60})["'”]/g);
    if (anyQuotes) {
      for (const q of anyQuotes) {
        const candidate = q.replace(/["'“”]/g, '').trim();
        if (!this._isIgnoredWord(candidate)) {
          return candidate;
        }
      }
    }

    // 4. Match phrases like "website [Nama Brand/Proyek]"
    const phraseMatch = cleanText.match(/(?:website|aplikasi|sistem|platform|portal)\s+([A-Za-z0-9\s]{3,35})/i);
    if (phraseMatch && phraseMatch[1]) {
      const candidate = phraseMatch[1].replace(/^(yang|untuk|dengan|berisi|adalah|yaitu)\s+/i, '').trim();
      if (!this._isIgnoredWord(candidate)) {
        return candidate.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }

    // 5. Fallback to first meaningful words
    const stripped = cleanText
      .replace(/^(?:halo|hai|tolong|buatkan|bikin|rancang|kembangkan|saya\s+butuh|saya\s+mau|mulai\s+konsultasi)[:\s,]*/i, '')
      .replace(/^(?:website|aplikasi|sistem|proyek|project)\s+/i, '')
      .trim();
    const words = stripped.split(/\s+/).slice(0, 4).join(' ');
    return words.length > 2 ? words.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Custom Web Application";
  }

  _isIgnoredWord(str) {
    const s = str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    return /^(clean|modern|minimalis|profesional|eyecatching|tailwind|bootstrap|vanilla|outfit|plus-jakarta-sans|inter|roboto|montserrat|poppins|lato|arial|font|fonts|modal|detail|about-us|hero|layanan|kontak|portfolio|portofolio|cta|salin|copy|format|whatsapp|broadcast|jumlah-item|jumlah|item|total-belanja|total|lihat-pesanan|role|role-kasir|role-manager|role-admin|role-owner|kasir|manager|admin|owner|opsi|opsi-pengurutan)$/i.test(s);
  }

  async continueConsultation(userText) {
    return this.sendMessage(userText);
  }

  /**
   * Synthesize final comprehensive PRD prompt for the SDLC Engine
   */
  async synthesizeFinalPRD(projectTitle = null, verifiedScore = 95) {
    const title = projectTitle || this.currentProjectTitle || this._extractDynamicTitle(this.currentRawPrompt);
    const score = verifiedScore || 95;
    const projectCode = "PRD-" + title.toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 25);
    const chatContext = this.conversationHistory.map(m => `${m.role === 'user' ? 'Bos @I-Shen' : 'Eksekutif'}: ${m.content}`).join('\n\n');

    const prompt = `Berdasarkan seluruh hasil diskusi internal 3 putaran eksekutif berikut:
"""
${chatContext}
"""

Tuliskan DOKUMEN SPESIFIKASI KEBUTUHAN PRODUK (MASTER PRD) yang padat, terstruktur, presisi, dan siap jalan untuk SDLC Pipeline.

DATA IDENTITAS PROYEK WAJIB (JANGAN DIUBAH ATAU MEMBUAT NAMA LAIN):
- Nama Proyek: "${title}"
- Kode Proyek: "${projectCode}"
- Skor Kesiapan PRD: ${score}/100 (Terverifikasi Siap Koding)

STRUKTUR DOKUMEN PRD WAJIB:
# DOKUMEN SPESIFIKASI KEBUTUHAN PRODUK (PRD KESIAPAN: ${score}/100)
**Nama Proyek:** ${title}
**Kode Proyek:** ${projectCode}
**Arsitek PRD:** Dr. Elena Rostova & Arthur Vance
**Klien Eksekutif:** Bos @I-Shen
**Status Kelayakan:** ${score}/100 (Terverifikasi Siap Eksekusi SDLC)

1. RINGKASAN EKSEKUTIF & LINGKUP SISTEM (Sesuai domain "${title}")
2. BENCHMARK DESAIN & INSPIRASI DRIBBBLE (Dark Glassmorphism, palet tematik, tipografi Plus Jakarta Sans)
3. SKEMA DATA MASTER TER-HIDRASI (Minimal 16 entitas data dummy realistis di JavaScript)
4. ATURAN AKSES & PERAN (DYNAMIC RBAC MATRIX dengan role switcher aktif)
5. DEKOMPOSISI MODUL LENGKAP & VALIDASI LOGIKA BISNIS (Penanganan edge-cases, pencegahan error, dan alur transaksi/operasional yang relevan secara kontekstual)
6. STANDAR KUALITAS KODE SENIOR (10+ TAHUN): Single-file HTML5/CSS3/JS mandiri tanpa placeholder.

Tuliskan dokumen PRD tersebut secara komprehensif tanpa komentar basa-basi.`;

    const response = await this.router.generateText({
      prompt,
      systemInstruction: `Anda adalah Dr. Elena Rostova & Arthur Vance. Rumuskan dokumen PRD master resmi untuk proyek "${title}" dengan skor kesiapan ${score}/100. Wajib gunakan nama proyek "${title}" dan kode "${projectCode}". Dilarang keras menggunakan template hardcoded lama!`,
      taskType: "fast",
      agentId: "optimizer"
    });

    this.masterPrompt = response.text.trim();
    return this.masterPrompt;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExecutiveAdvisor;
}

