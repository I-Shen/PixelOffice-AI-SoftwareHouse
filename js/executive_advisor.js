/**
 * PixelOffice AI Software House - Executive Suite Consultation Engine
 * Master Corporate Blueprint Ground Truth, Fast-Track PRD Formulation & Zero-Hallucination SDLC Handover
 * Arthur Vance (Head of Engineering) & Dr. Elena Rostova (Chief PRD Architect)
 */

import { CONFIG } from './config.js';

export class ExecutiveAdvisor {
  constructor(llmRouter) {
    this.router = llmRouter;
    this.conversationHistory = [];
    this.currentRawPrompt = "";
    this.isDealReached = false;
    this.masterPrompt = "";
    this.detectedScope = null;
    this.turnCount = 0;
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
    
    if (/marketplace|multi[- ]vendor|tokopedia|shopee|fintech|payment gateway|escrow|saas|multi[- ]tenant|ai[- ]platform|vector store|rag|crypto|trading/i.test(text)) {
      return {
        tier: "COMPLEX_PLATFORM",
        label: "Platform Kompleks / Marketplace / SaaS / AI Platform",
        description: "Memerlukan penelaahan arsitektur mendalam: model AI, skema transaksi, dan otentikasi."
      };
    }
    
    if (/upload|storage|database|crud|login|autentikasi|api endpoint|backend service|microservice/i.test(text)) {
      return {
        tier: "INTERACTIVE_APP",
        label: "Aplikasi Web Interaktif / Layanan Data",
        description: "Memerlukan verifikasi skema input/output data, validasi file, dan adapter database."
      };
    }

    return {
      tier: "STATIC_SHOWCASE",
      label: "Website Company Profile / Showcase Modern / Portofolio",
      description: "Fokus pada estetika UI modern-minimalis, branding 10 pegawai senior, motto korporat, dan modal detail profil."
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

    this.conversationHistory.push({
      role: "user",
      content: this.currentRawPrompt || "Halo Arthur dan Elena, mari buat website company profile untuk software house kita."
    });

    const companyInfo = CONFIG.company ? `
IDENTITAS RESMI PERUSAHAAN KITA:
• Nama Perusahaan : ${CONFIG.company.name}
• Tagline / Motto : "${CONFIG.company.tagline}"
• Spesialisasi     : ${CONFIG.company.shortDescription}
• Keunggulan Unik : ${CONFIG.company.uniqueAdvantage}
• Visi & Misi     : ${CONFIG.company.vision}
• 10 Tenaga Ahli  : Arthur, Elena, Marcus, Devon, Sophia, Kai, Sarah, Viktor, Naomi, Alex.
• Target Klien    : Perusahaan Swasta (B2B) & Instansi Pemerintah (B2G).
• Jaminan         : 100% Hak Cipta Milik Klien (No Lock-in), SAST 0 Vulnerabilities, Lighthouse 100/100.` : "";

    const systemInstruction = `Anda adalah duo eksekutif software house kelas dunia di RUANG EKSEKUTIF:
1. Arthur Vance (Head of Engineering): Menilai arsitektur dan kelayakan eksekusi.
2. Dr. Elena Rostova (Chief PRD Architect): Merumuskan spesifikasi PRD Emas.
${companyInfo}

PERAN & BATASAN KETAT EKSEKUTIF (ZERO-HALLUCINATION):
- TUGAS ANDA HANYA MERUMUSKAN DAN MENGUNCI PRD (SPESIFIKASI PROYEK).
- DILARANG KERAS berpura-pura koding telah selesai atau membuat URL staging/production fiktif (seperti staging.pxo-aisoft.com atau passcode fiktif).
- DILARANG KERAS menanyakan hal-hal pasca-rilis (seperti Google Analytics vs Hotjar) sebelum website dibangun!
- Koding dan deployment HANYA akan dieksekusi setelah Bos menekan tombol [🚀 Mulai Siklus SDLC].

ATURAN RESPON SESI 1:
1. Apresiasi ide Bos @I-Shen secara profesional dengan mengaitkannya pada identitas resmi ${CONFIG.company?.name || "PxO AI Soft"}.
2. Tawarkan 2 opsi tata letak konkret (Opsi 1: Interactive Leadership Grid vs Opsi 2: High-Impact Executive Matrix dengan Modal Popup Detail) dengan penjelasan ringkas.
3. Beritahu Bos bahwa setelah Bos memilih atau menambahkan detail, PRD Emas akan langsung dikunci 100% untuk dieksekusi di pipeline SDLC.`;

    const analysisPrompt = `Pesan Bos @I-Shen:
"${this.currentRawPrompt}"

Berikan respon terstruktur dari Arthur Vance dan Dr. Elena Rostova sesuai aturan di atas.`;

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

    // If user already provided exhaustive details in turn 1
    const hasFullSpecs = /10 pegawai|pxo|motto|minimalis|modal|dummy/i.test(this.currentRawPrompt);
    if (hasFullSpecs) {
      this.isDealReached = true;
      this.masterPrompt = await this.synthesizeFinalPRD();
    }

    const result = {
      reply: reply.replace(/\[DEAL_REACHED\]/g, '').trim(),
      text: reply.replace(/\[DEAL_REACHED\]/g, '').trim(),
      isDeal: this.isDealReached,
      score: this.isDealReached ? 100 : 95,
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
    if (!text) return { reply: "", text: "", isDeal: this.isDealReached, score: 95 };

    this.turnCount++;
    this.conversationHistory.push({
      role: "user",
      content: text
    });

    this.emit('message_sent', { text });

    const chatContext = this.conversationHistory.map(m => `${m.role === 'user' ? 'Bos @I-Shen' : 'Eksekutif (Arthur & Elena)'}: ${m.content}`).join('\n\n');

    const prompt = `Riwayat Konsultasi Ruang Eksekutif:
${chatContext}

Tanggapi balasan terbaru dari Bos @I-Shen: "${text}"

ATURAN MUTLAK PENYELESAIAN (DEAL FINAL):
1. Bos @I-Shen telah menentukan pilihan atau memberikan spesifikasi proyek.
2. HENTIKAN SEMUA PERTANYAAN TAMBAHAN! JANGAN membuat pertanyaan baru lagi.
3. DILARANG KERAS membuat URL staging fiktif, passcode palsu, atau berpura-pura bahwa website sudah live.
4. SAMBUT KEPUTUSAN BOS DENGAN KONSENSUS DEAL (SKOR 100/100).
5. Rangkum secara padat poin-poin yang disepakati:
   - Nama Perusahaan: ${CONFIG.company?.name || "PxO AI Soft"}
   - Tema & Estetika (Clear-Modern-Minimalist)
   - Motto Perusahaan: "${CONFIG.company?.tagline || "Inovasi Berkelanjutan, Solusi Masa Depan..."}"
   - Komponen Tim: 10 Rekan Kerja dengan biodata dummy & Modal Detail interaktif.
6. Beritahu Bos: "PRD Emas telah terkunci 100%. Silakan klik tombol '🚀 Mulai Siklus SDLC' di bawah untuk mengeksekusi pembuatan kode dan peluncuran website secara nyata!"
7. Wajib cantumkan tag [DEAL_REACHED] di paling akhir pesan.`;

    const response = await this.router.generateText({
      prompt,
      systemInstruction: `Anda adalah Arthur Vance & Dr. Elena Rostova di Ruang Eksekutif ${CONFIG.company?.name || "PxO AI Soft"}. Kunci kesepakatan PRD Emas 100/100 secara tegas tanpa memperpanjang diskusi.`,
      taskType: "fast",
      agentId: "optimizer"
    });

    const reply = response.text;
    this.conversationHistory.push({
      role: "assistant",
      content: reply
    });

    this.isDealReached = true;
    this.masterPrompt = await this.synthesizeFinalPRD();

    const cleanReply = reply.replace(/\[DEAL_REACHED\]/g, '').trim();

    const result = {
      reply: cleanReply,
      text: cleanReply,
      isDeal: true,
      score: 100,
      scope: this.detectedScope,
      masterPrompt: this.masterPrompt
    };

    this.emit('message_received', result);
    return result;
  }

  async continueConsultation(userText) {
    return this.sendMessage(userText);
  }

  /**
   * Synthesize final comprehensive PRD prompt for the SDLC Engine
   */
  async synthesizeFinalPRD() {
    const chatContext = this.conversationHistory.map(m => `${m.role === 'user' ? 'Bos @I-Shen' : 'Eksekutif'}: ${m.content}`).join('\n\n');

    const companyData = CONFIG.company || {};

    const prompt = `Berdasarkan seluruh hasil diskusi dan kesepakatan eksekutif berikut:
${chatContext}

Tuliskan SPESIFIKASI PROYEK MASTER EMAS (PRD SKOR 100/100) yang padat, presisi, dan siap jalan untuk diinputkan ke SDLC Pipeline.
FORMAT INSTRUKSI:
Buatkan website company profile '${companyData.name || "PxO AI Soft"}' dengan tema Clear-Modern-Minimalist.
Wajib memuat:
1. Header & Hero Section: Branding ${companyData.name || "PxO AI Soft"} dan Motto resmi: "${companyData.tagline || "Inovasi Berkelanjutan, Solusi Masa Depan: Memaksimalkan Otomasi, Efisiensi, dan Optimasi Bisnis Anda Bersama PxO AI Soft."}"
2. Nilai Keunggulan: Skuad 10 Tenaga Ahli Senior yang adaptif dan problem solver berwawasan global.
3. Showcase 10 Pegawai Resmi Kantor: Arthur Vance, Dr. Elena Rostova, Marcus Chen, Devon Reed, Sophia Sterling, Kai Takahashi, Sarah Jenkins, Viktor Petrov, Naomi Ward, Alex Rivera dengan biodata/pengalaman kerja dummy kelas enterprise.
4. Fitur Interaktif Modal Detail: Saat kartu profil salah satu dari 10 pegawai diklik, buka jendela modal popup elegan berisi biodata lengkap, riwayat karir dummy, dan keahlian teknologi.
5. Bagian 4 Layanan Unggulan: Enterprise Business Automation, Intelligent Web Portals, Public Sector & SPBE Systems, Security & Code Audit.
6. Form Kontak Konsultasi dengan validasi client-side.
7. Desain responsif, modern, glassmorphism dengan CSS framework (Tailwind/Bootstrap/Vanilla) mandiri.

Tuliskan instruksi di atas dalam satu kesatuan prompt instruksi yang komprehensif tanpa komentar basa-basi.`;

    const response = await this.router.generateText({
      prompt,
      systemInstruction: `Anda adalah Dr. Elena Rostova, Chief PRD Architect ${companyData.name || "PxO AI Soft"}. Rumuskan prompt PRD master bernilai 100/100 murni.`,
      taskType: "fast",
      agentId: "optimizer"
    });

    this.masterPrompt = response.text.trim();
    return this.masterPrompt;
  }
}
