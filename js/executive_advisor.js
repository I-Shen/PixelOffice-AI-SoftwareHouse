/**
 * PixelOffice AI Software House - Executive Suite Consultation Engine
 * Dynamic Context-Aware, Proactive Solution-Oriented & Complexity-Adaptive Reasoning Protocol
 * Arthur Vance (Head of Engineering) & Dr. Elena Rostova (Chief PRD Architect)
 */

export class ExecutiveAdvisor {
  constructor(llmRouter) {
    this.router = llmRouter;
    this.conversationHistory = [];
    this.currentRawPrompt = "";
    this.isDealReached = false;
    this.masterPrompt = "";
    this.detectedScope = null;
    this.extractedSpecs = {};
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
    
    // High complexity: Marketplace, E-commerce multi-vendor, SaaS multi-tenant, Fintech payment gateway, AI-agent platform, Real-time engine
    if (/marketplace|multi[- ]vendor|tokopedia|shopee|fintech|payment gateway|escrow|saas|multi[- ]tenant|ai[- ]platform|vector store|rag|crypto|trading/i.test(text)) {
      return {
        tier: "COMPLEX_PLATFORM",
        label: "Platform Kompleks / Marketplace / SaaS / AI Platform",
        description: "Memerlukan penelaahan arsitektur mendalam: teknologi AI (model/SDK), skema transaksi/escrow, RBAC, dan integritas data."
      };
    }
    
    // Medium complexity: Interactive web app with database, upload form, auth, CRUD
    if (/upload|storage|database|crud|login|autentikasi|api endpoint|backend service|microservice/i.test(text)) {
      return {
        tier: "INTERACTIVE_APP",
        label: "Aplikasi Web Interaktif / Layanan Data",
        description: "Memerlukan verifikasi skema input/output data, validasi MIME/file, dan adapter database."
      };
    }

    // Default / Static / Showcase / Landing / Company Profile
    return {
      tier: "STATIC_SHOWCASE",
      label: "Website Statis / Company Profile / Showcase Portofolio",
      description: "Fokus pada estetika UI modern, responsivitas, branding 10 pegawai, dan form kontak (Fast-Track Consensus)."
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
    this.detectedScope = this.classifyScope(this.currentRawPrompt);

    this.conversationHistory.push({
      role: "user",
      content: this.currentRawPrompt || "Halo Arthur & Elena, saya ingin membuat website company profile."
    });

    const hasDetails = this.currentRawPrompt.length > 40 || /10 pegawai|portfolio|disclaimer|form/i.test(this.currentRawPrompt);

    const systemInstruction = `Anda adalah duo eksekutif software house kelas dunia di RUANG EKSEKUTIF:
1. Arthur Vance (Head of Engineering 14+ tahun): Menilai arsitektur, kelayakan teknis, dan waktu delivery.
2. Dr. Elena Rostova (Chief PRD Architect 11+ tahun): Mengunci spesifikasi PRD, skema data DTO, dan skor prompt.

KLASIFIKASI KONTEKS PROYEK SAAT INI:
• Kategori : [${this.detectedScope.tier}] - ${this.detectedScope.label}
• Karakter : ${this.detectedScope.description}

ATURAN PENALARAN KONTEKSTUAL & PROAKTIF MEMBERI OPSI:
1. JIKA TIER = STATIC_SHOWCASE (Company Profile, Showcase Produk, Landing Page, Portofolio):
   - JANGAN menanyakan arsitektur SaaS rumit, backend database mendalam, multi-tenancy, atau payment escrow di luar konteks.
   - Pahami bahwa fokus utama adalah desain UI modern (glassmorphism/minimalis), branding 10 pegawai senior kita, portofolio karya, dan form kontak.
   - Sambut dengan hangat, apresiasi ide desain, dan LANGSUNG capai KONSENSUS DEAL (SKOR 100/100) dalam 1 pesan! Cantumkan tag [DEAL_REACHED].

2. JIKA TIER = COMPLEX_PLATFORM (Marketplace, SaaS, Fintech, Multi-Agent AI System):
   - WAJIB MENYERTAKAN CONTOH JAWABAN / OPSI SOLUSI: Setiap kali menanyakan aspek teknis, Anda WAJIB memberikan 2-3 pilihan opsi solusi konkret (Opsi A vs Opsi B) beserta contohnya agar Bos @I-Shen tinggal memilih atau menyetujui rekomendasi Anda.
     * Contoh AI: "Opsi 1: Google Gemini 2.5 Flash untuk semantic search cepat | Opsi 2: Multimodal Gemini Pro untuk analisa visual."
     * Contoh Marketplace: "Opsi A: Escrow Payment Gateway otomatis | Opsi B: Direct Settlement dengan webhook."
   - Keputusan akhir tetap berada di tangan Bos @I-Shen.

3. JIKA TIER = INTERACTIVE_APP (Upload foto, CRUD, Form adapter):
   - Berikan opsi rekomendasi adapter (misal: S3-compatible cloud storage vs local file adapter) dan batas validasi 5MB MIME png/jpg.

4. ATURAN UNIVERSAL (SEMUA TIER):
   - BACA DENGAN TELITI apa yang SUDAH disebutkan oleh Bos @I-Shen. JANGAN PERNAH menanyakan kembali hal yang sudah dijelaskan (nama brand, fitur, tema).
   - Selalu berdialog secara natural antara Arthur Vance dan Dr. Elena Rostova.`;

    const analysisPrompt = `Riwayat Diskusi Ruang Eksekutif:
Bos @I-Shen: "${this.currentRawPrompt}"

Tugas Anda:
1. Sambut Bos @I-Shen secara profesional.
2. Tunjukkan bahwa Anda memahami tingkat kompleksitas proyek (${this.detectedScope.label}).
3. Berikan penilaian tajam:
   - Jika STATIC_SHOWCASE: Validasi estetika modern, konfirmasi 10 pegawai resmi, dan langsung nyatakan KONSENSUS DEAL (100/100) dengan tag [DEAL_REACHED].
   - Jika COMPLEX_PLATFORM: Tanyakan 2 poin arsitektur esensial DENGAN MEMBERIKAN CONTOH OPSI JAWABAN (Opsi A, Opsi B) yang siap dipilih Bos.
   - Jika INTERACTIVE_APP: Validasi adapter dan alur data dengan memberikan rekomendasi teknis terbaik.`;

    const response = await this.router.generateText({
      prompt: analysisPrompt,
      systemInstruction,
      taskType: "reasoning",
      agentId: "manager"
    });

    const reply = response.text;
    this.conversationHistory.push({
      role: "assistant",
      content: reply
    });

    // Check if deal is reached
    const isDeal = reply.includes("[DEAL_REACHED]") || (this.detectedScope.tier === "STATIC_SHOWCASE" && hasDetails) || /(sepakat|deal|siap mulai|100\/100|siap dieksekusi)/i.test(reply);
    this.isDealReached = isDeal;

    if (isDeal) {
      this.masterPrompt = await this.synthesizeFinalPRD();
    }

    const cleanReply = reply.replace(/\[DEAL_REACHED\]/g, '').trim();

    const result = {
      reply: cleanReply,
      text: cleanReply,
      isDeal: this.isDealReached,
      score: this.isDealReached ? 100 : 94,
      scope: this.detectedScope,
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
    if (!text) return { reply: "", text: "", isDeal: this.isDealReached, score: 94 };

    this.conversationHistory.push({
      role: "user",
      content: text
    });

    this.emit('message_sent', { text });

    const isConfirming = /ya|iya|setuju|sepakat|deal|mulai|eksekusi|lanjut|oke|ok|gas|bikin|buatkan|mantap|siap|cukup|paham|pilih|opsi/i.test(text);

    const chatContext = this.conversationHistory.map(m => `${m.role === 'user' ? 'Bos @I-Shen' : 'Eksekutif (Arthur & Elena)'}: ${m.content}`).join('\n\n');

    const prompt = `Riwayat Konsultasi Ruang Eksekutif Lengkap:
${chatContext}

Tanggapi balasan terbaru dari Bos @I-Shen ("${text}"):
PANDUAN PENALARAN PROAKTIF:
1. Konteks Proyek: [${this.detectedScope ? this.detectedScope.tier : 'STATIC_SHOWCASE'}]
2. Jika Bos telah menentukan pilihan opsi atau memberikan konfirmasi setuju (${isConfirming ? 'BOS SUDAH MEMILIH / MENYETUJUI' : 'memberikan info'}), SEGERA NYATAKAN KONSENSUS DEAL FINAL (SKOR 100/100).
3. Jika masih ada detail yang perlu ditentukan pada platform kompleks, berikan 2 opsi solusi pilihan yang jelas dan ringkas.
4. JANGAN PERNAH menanyakan hal repetitif yang sudah dibahas sebelumnya.
5. Tegaskan bahwa Arthur Vance & Dr. Elena Rostova telah merumuskan PRD Emas dan tim 10 engineer siap koding.
6. Cantumkan tag [DEAL_REACHED] di akhir pesan jika sudah sepakat.`;

    const response = await this.router.generateText({
      prompt,
      systemInstruction: "Anda adalah Arthur Vance & Dr. Elena Rostova di Ruang Eksekutif. Berikan solusi proaktif dengan pilihan opsi yang jelas, ambil keputusan cepat, dan berikan kepastian skor 100/100.",
      taskType: "fast",
      agentId: "optimizer"
    });

    const reply = response.text;
    this.conversationHistory.push({
      role: "assistant",
      content: reply
    });

    const isDeal = reply.includes("[DEAL_REACHED]") || isConfirming || /(sepakat|deal|siap mulai|100\/100|siap dieksekusi)/i.test(reply);
    this.isDealReached = isDeal;

    if (isDeal && !this.masterPrompt) {
      this.masterPrompt = await this.synthesizeFinalPRD();
    }

    const cleanReply = reply.replace(/\[DEAL_REACHED\]/g, '').trim();

    const result = {
      reply: cleanReply,
      text: cleanReply,
      isDeal: this.isDealReached,
      score: this.isDealReached ? 100 : 96,
      scope: this.detectedScope,
      masterPrompt: this.masterPrompt
    };

    this.emit('message_received', result);
    return result;
  }

  /**
   * Alias for sendMessage to ensure full compatibility
   */
  async continueConsultation(userText) {
    return this.sendMessage(userText);
  }

  /**
   * Synthesize final structured PRD from the conversation to execute in SDLC
   */
  async synthesizeFinalPRD() {
    const chatContext = this.conversationHistory.map(m => `${m.role === 'user' ? 'Bos @I-Shen' : 'Eksekutif'}: ${m.content}`).join('\n\n');

    const prompt = `Berdasarkan seluruh hasil diskusi dan kesepakatan eksekutif berikut:
${chatContext}

Tuliskan SPESIFIKASI PROYEK MASTER EMAS (PRD SKOR 100/100) yang padat, presisi, dan siap jalan.
PANDUAN FORMAT WAJIB:
- Baris pertama: Judul resmi dalam tanda petik, contoh: Buatkan website company profile 'PxO AI Soft dotcom'... (atau sesuai permintaan Bos).
- Rinci spesifikasi inti yang telah disepakati sesuai ruang lingkup proyek dan opsi yang dipilih.
- Jika ada fitur 10 pegawai resmi, cantumkan pengenalan ke-10 senior engineer kantor.
- Jika ada disclaimer, cantumkan bahwa sistem dibangun oleh Google Gemini AI.
- Hasilkan satu paragraf prompt instruksi master yang komprehensif tanpa komentar basa-basi.`;

    const response = await this.router.generateText({
      prompt,
      systemInstruction: "Anda adalah Dr. Elena Rostova. Rumuskan prompt PRD master bernilai 100/100 murni tanpa komentar pendahuluan.",
      taskType: "fast",
      agentId: "optimizer"
    });

    this.masterPrompt = response.text.trim();
    return this.masterPrompt;
  }
}
