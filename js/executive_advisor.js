/**
 * PixelOffice AI Software House - Executive Suite Consultation Engine
 * Fast-Track, Adaptive, & Context-Aware Protocol
 * Arthur Vance (Head of Engineering) & Dr. Elena Rostova (Chief PRD Architect)
 */

export class ExecutiveAdvisor {
  constructor(llmRouter) {
    this.router = llmRouter;
    this.conversationHistory = [];
    this.currentRawPrompt = "";
    this.isDealReached = false;
    this.masterPrompt = "";
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
   * Start a new executive consultation session based on user's prompt
   */
  async startConsultation(rawPrompt) {
    this.currentRawPrompt = (rawPrompt || "").trim();
    this.conversationHistory = [];
    this.isDealReached = false;
    this.masterPrompt = "";

    this.conversationHistory.push({
      role: "user",
      content: this.currentRawPrompt || "Halo Arthur & Elena, saya ingin membuat website company profile."
    });

    const isCompanyProfileOrWeb = /website|company profile|landing|profile|web/i.test(this.currentRawPrompt);
    const hasDetails = this.currentRawPrompt.length > 50 || /10 pegawai|portfolio|disclaimer|form/i.test(this.currentRawPrompt);

    const systemInstruction = `Anda adalah duo eksekutif software house kelas dunia:
1. Arthur Vance (Head of Engineering 14+ tahun): Fokus pada kelayakan arsitektur Modular Monolith, efisiensi waktu, dan kesiapan tim.
2. Dr. Elena Rostova (Chief PRD Architect 11+ tahun): Fokus pada kelengkapan spesifikasi PRD, skema data DTO, dan skor mutu prompt.

ATURAN REASONING ADAPTIF & FAST-TRACK:
1. BACA & CATAT SELURUH DETAIL DARI BOS @I-Shen:
   - Jika Bos @I-Shen sudah menyebutkan judul/nama brand, tema desain, 10 pegawai senior, atau fitur tertentu, JANGAN PERNAH menanyakannya lagi!
2. JANGAN MEMPERUMIT MASALAH (NO OUT-OF-SCOPE BLOAT):
   - Jika Bos meminta website company profile, JANGAN menanyakan arsitektur SaaS rumit, multi-tenancy, atau backend database kompleks di luar konteks.
3. KESEPAKATAN CEPAT (FAST-TRACK DEAL):
   - Jika instruksi awal sudah cukup jelas (${hasDetails ? 'SUDAH SANGAT JELAS' : 'cukup jelas'}), SAMBUT DENGAN HANGAT, BERIKAN SARAN DESAIN TERBAIK, DAN LANGSUNG NYATAKAN KESEPAKATAN (DEAL) DENGAN SKOR 100/100!
   - Format: Arthur memvalidasi arsitektur frontend/UI modern, Elena mengonfirmasi PRD telah terkunci 100/100 tanpa celah.
   - Cantumkan tag [DEAL_REACHED] di akhir balasan jika spesifikasi sudah mantap.`;

    const analysisPrompt = `Riwayat Diskusi:
Bos @I-Shen: "${this.currentRawPrompt}"

Tugas Anda:
1. Sambut Bos @I-Shen secara profesional dan penuh semangat.
2. Validasi ide proyek tersebut dengan tajam dan apresiatif.
3. Tunjukkan poin-poin yang sudah dipahami dengan sempurna (nama proyek, tema tech modern minimalis, grid 10 pegawai resmi, portofolio karya, dan form kontak/konsultasi).
4. Jika sudah lengkap, nyatakan KONSENSUS DEAL (SKOR 100/100) dan ajak Bos untuk langsung mengeksekusi siklus SDLC!
5. Jika ada tag [DEAL_REACHED], sertakan ringkasan Master PRD Emas.`;

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
    const isDeal = reply.includes("[DEAL_REACHED]") || hasDetails || /(sepakat|deal|siap mulai|100\/100|siap dieksekusi)/i.test(reply);
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

    const isConfirming = /ya|iya|setuju|sepakat|deal|mulai|eksekusi|lanjut|oke|ok|gas|bikin|buatkan|mantap|siap/i.test(text);

    const chatContext = this.conversationHistory.map(m => `${m.role === 'user' ? 'Bos @I-Shen' : 'Eksekutif (Arthur & Elena)'}: ${m.content}`).join('\n\n');

    const prompt = `Riwayat Konsultasi Eksekutif Lengkap:
${chatContext}

Tanggapi pesan terbaru dari Bos @I-Shen ("${text}"):
PANDUAN REASONING:
1. Pahami bahwa Bos ingin alur kerja cepat dan tidak berbelit-belit.
2. Jika Bos memberikan konfirmasi setuju (${isConfirming ? 'BOS MENYETUJUI' : 'membalas'}), LANGSUNG NYATAKAN KESEPAKATAN FINAL (DEAL TERCAPAI - SKOR 100/100).
3. JANGAN PERNAH menanyakan pertanyaan yang sama atau mempermasalahkan detail teknis sepele yang tidak diminta.
4. Tegaskan bahwa Arthur Vance & Dr. Elena Rostova telah mengunci PRD Emas dan tim 10 engineer siap langsung koding.
5. Cantumkan tag [DEAL_REACHED] di akhir pesan.`;

    const response = await this.router.generateText({
      prompt,
      systemInstruction: "Anda adalah Arthur Vance & Dr. Elena Rostova. Ambil keputusan eksekutif cepat, to-the-point, dan berikan kepastian skor 100/100.",
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
- Baris pertama: Judul resmi dalam tanda petik, contoh: Buatkan website company profile 'PxO AI Soft dotcom'...
- Cantumkan kebutuhan spesifik:
  1. Tema Tech Modern Minimalis dengan CSS glassmorphism & responsif.
  2. Menampilkan 10 pegawai senior resmi kantor (Arthur, Elena, Marcus, Devon, Sophia, Kai, Sarah, Viktor, Naomi, Alex) beserta role dan tugasnya.
  3. Portofolio karya software house.
  4. Disclaimer resmi bahwa sistem dibangun oleh Google Gemini AI.
  5. Form interaktif konsultasi klien.
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
