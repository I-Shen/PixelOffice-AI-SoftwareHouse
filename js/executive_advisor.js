/**
 * PixelOffice AI Software House - Dynamic Executive Consultation Engine
 * Master Corporate Blueprint, Dynamic PRD Formulation & Zero-Hallucination SDLC Handover
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

    this.conversationHistory.push({
      role: "user",
      content: this.currentRawPrompt || "Halo Arthur dan Elena, tolong rancang dan kembangkan sistem web aplikasi baru kita."
    });

    const systemInstruction = `Anda adalah duo eksekutif software house kelas dunia di RUANG EKSEKUTIF PIXELOFFICE:
1. Arthur Vance (Head of Engineering): Menilai kelayakan arsitektur, data flow, dan modularitas teknis.
2. Dr. Elena Rostova (Chief PRD Architect): Merumuskan spesifikasi kebutuhan fungsional (FR) dan non-fungsional (NFR).

PRINSIP KONSULTASI EKSEKUTIF (100% DINAMIS & ZERO-HALLUCINATION):
- Analisis secara cerdas dan SPESIFIK apa yang sebenarnya diminta oleh Bos @I-Shen (nama sistem/proyek, modul-modul inti, palet warna, role pengguna, dan fitur unik).
- DILARANG KERAS memaksakan template 'Company Profile PxO' jika Bos meminta proyek custom lain (seperti Basketball Management, Portal Sekolah, Marketplace, E-Commerce, Dashboard, dll)!
- TUGAS ANDA: Memvalidasi kebutuhan Bos, merumuskan arsitektur modular, dan menyiapkan PRD Emas.
- DILARANG KERAS berpura-pura koding telah selesai atau membuat URL staging/passcode fiktif.

ATURAN RESPON SESI 1:
1. Apresiasi dan rangkum pemahaman Arthur & Elena terhadap proyek spesifik yang diminta Bos @I-Shen secara antusias dan berbobot.
2. Paparkan ringkasan modul & fitur yang teridentifikasi dari prompt Bos.
3. Tawarkan 2 opsi arsitektur konkret (Opsi A vs Opsi B) yang relevan dengan domain proyek tersebut.
4. Beritahu Bos bahwa setelah Bos memilih/menyetujui, PRD Emas akan langsung dikunci 100% untuk dieksekusi oleh 10 agen di pipeline SDLC.`;

    const analysisPrompt = `Pesan & Spesifikasi Proyek dari Bos @I-Shen:
"""
${this.currentRawPrompt}
"""

Berikan respon konsultasi tingkat tinggi dari Arthur Vance dan Dr. Elena Rostova sesuai aturan di atas.`;

    const response = await this.router.generateText({
      prompt: analysisPrompt,
      systemInstruction,
      taskType: "fast",
      agentId: "manager"
    });

    const reply = response.text;
    this.conversationHistory.push({
      role: "assistant",
      content: reply
    });

    // If user prompt was already extremely thorough and complete (>60 words or contains multiple modules)
    const isExhaustive = (this.currentRawPrompt.length > 200 && (this.currentRawPrompt.includes("1.") || this.currentRawPrompt.includes("modul") || this.currentRawPrompt.includes("fitur")));
    if (isExhaustive) {
      this.isDealReached = true;
      this.masterPrompt = await this.synthesizeFinalPRD();
    }

    const result = {
      reply: reply.replace(/\[DEAL_REACHED\]/g, '').trim(),
      text: reply.replace(/\[DEAL_REACHED\]/g, '').trim(),
      isDeal: this.isDealReached,
      score: this.isDealReached ? 100 : 96,
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
1. Bos @I-Shen telah menentukan pilihan atau mengonfirmasi spesifikasi proyek.
2. HENTIKAN SEMUA PERTANYAAN TAMBAHAN! JANGAN membuat pertanyaan baru lagi.
3. DILARANG KERAS membuat URL staging fiktif, passcode palsu, atau berpura-pura bahwa website sudah live.
4. SAMBUT KEPUTUSAN BOS DENGAN KONSENSUS DEAL (SKOR 100/100).
5. Rangkum secara padat poin-poin yang disepakati (Judul Proyek, Tema/Palet Desain, Modul Utama, Role Akses, dan Fitur Khusus).
6. Beritahu Bos: "PRD Emas telah terkunci 100%. Silakan klik tombol '🚀 Mulai Siklus SDLC' di bawah untuk mengeksekusi pembuatan kode dan peluncuran website secara nyata!"
7. Wajib cantumkan tag [DEAL_REACHED] di paling akhir pesan.`;

    const response = await this.router.generateText({
      prompt,
      systemInstruction: `Anda adalah Arthur Vance & Dr. Elena Rostova di Ruang Eksekutif PixelOffice. Kunci kesepakatan PRD Emas 100/100 secara tegas berdasarkan permintaan aktual proyek Bos @I-Shen.`,
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

    // Extract exact dynamic project title based on client input
    const dynamicTitle = this._extractDynamicTitle(this.currentRawPrompt);

    const result = {
      reply: cleanReply,
      text: cleanReply,
      isDeal: true,
      score: 100,
      scope: this.detectedScope,
      projectName: dynamicTitle,
      masterPrompt: this.masterPrompt
    };

    this.emit('message_received', result);
    return result;
  }

  _extractDynamicTitle(text) {
    if (!text) return "Enterprise Web Application";
    const cleanText = String(text).trim();

    // 1. Quoted title right after keywords (e.g. website "...", aplikasi "...", sistem "...", proyek "...")
    const directNamedMatch = cleanText.match(/(?:website|aplikasi|sistem|proyek|project|platform|portal|toko|klinik|dashboard|software)\s+["'“]([^"'”]+)["'”]/i);
    if (directNamedMatch && directNamedMatch[1] && !this._isIgnoredWord(directNamedMatch[1])) {
      return directNamedMatch[1].trim();
    }

    // 2. Explicit pattern (e.g. nama proyek: "...", judul website adalah "...")
    const explicitQuotes = cleanText.match(/(?:nama\s+proyek|nama\s+website|nama\s+aplikasi|nama\s+sistem|judul|brand)\s+(?:[^\n\r"']{0,40}?\s+)?(?:adalah|yaitu|=|:)\s*["'“]([^"'”]+)["'”]/i);
    if (explicitQuotes && explicitQuotes[1] && !this._isIgnoredWord(explicitQuotes[1])) {
      return explicitQuotes[1].trim();
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
    return /^(clean|modern|minimalis|profesional|eyecatching|tailwind|bootstrap|vanilla|outfit|plus-jakarta-sans|inter|roboto|montserrat|poppins|lato|arial|font|fonts|modal|detail|about-us|hero|layanan|kontak|portfolio|portofolio|cta|salin|copy|format|whatsapp|broadcast)$/i.test(s);
  }

  async continueConsultation(userText) {
    return this.sendMessage(userText);
  }

  /**
   * Synthesize final comprehensive PRD prompt for the SDLC Engine
   */
  async synthesizeFinalPRD() {
    const chatContext = this.conversationHistory.map(m => `${m.role === 'user' ? 'Bos @I-Shen' : 'Eksekutif'}: ${m.content}`).join('\n\n');

    const prompt = `Berdasarkan seluruh hasil diskusi dan kesepakatan eksekutif berikut:
"""
${chatContext}
"""

Tuliskan SPESIFIKASI PROYEK MASTER EMAS (GOLDEN PRD SCORE 100/100) yang padat, terstruktur, presisi, dinamis sesuai domain proyek yang diminta klien, dan siap jalan untuk diinputkan ke SDLC Pipeline.

STRUKTUR PRD WAJIB:
1. JUDUL & IDENTITAS PROYEK: Ekstrak nama aplikasi / brand yang diminta klien secara tepat dan dinamis.
2. BENCHMARK DESAIN & INSPIRASI DRIBBBLE (SESUAIKAN DENGAN DOMAIN KLIEN):
   - Kurasi palet warna dan tema Dribbble yang relevan dengan domain bisnis klien (misal: Sporty Neon untuk Olahraga, Emerald/Navy untuk Medis/Fintech, Warm Amber untuk F&B, High-Contrast Obsidian Glassmorphism untuk Enterprise/SaaS).
   - Tipografi Google Fonts modern, kartu elevasi bertingkat, dan bayangan 3D lembut.
3. SKEMA DATA MASTER TER-HIDRASI (SINGLE SOURCE OF TRUTH):
   - Wajib generate minimal 15-20 entitas data dummy realistis di JavaScript yang relevan dengan domain proyek (misal: Roster Atlet untuk Olahraga, Pasien/Dokter untuk Medis, Produk/Katalog untuk E-Commerce, Siswa/Guru untuk Sekolah, Transaksi untuk Keuangan).
   - Sinkronisasi data master ini ke seluruh modul dan tabel aplikasi.
4. ATURAN AKSES & PERAN (DYNAMIC RBAC MATRIX):
   - Sediakan minimal 3-4 role relevan dengan domain klien (misal: Publik vs Staff vs Manager vs Admin).
   - Role Switcher harus membedakan hak akses secara nyata (Guarded View / Lock Screen untuk data rahasia/keuangan).
5. DEKOMPOSISI MODUL LENGKAP:
   - Rincikan seluruh modul fungsional yang diminta klien dalam diskusi beserta fitur interaktif (Card Grid, Modal Popup Detail saat data diklik, Form Input Dinamis, Filter Kategori, dan Generator WhatsApp/Export jika relevan).
6. STANDAR KUALITAS KODE SENIOR (10+ TAHUN):
   - Single-file HTML5/CSS3/JS mandiri, interaktivitas event listener 100% aktif, DILARANG memotong kode atau menggunakan placeholder kosong.

Tuliskan instruksi di atas dalam satu kesatuan prompt instruksi PRD yang komprehensif tanpa komentar basa-basi.`;

    const response = await this.router.generateText({
      prompt,
      systemInstruction: `Anda adalah Dr. Elena Rostova, Chief PRD Architect PixelOffice AI Software House. Rumuskan prompt PRD master bernilai 100/100 yang presisi, kaya data (hydrated state), dan setia 100% pada kebutuhan aktual proyek Bos @I-Shen apapun jenis industri/domainnya.`,
      taskType: "fast",
      agentId: "optimizer"
    });

    this.masterPrompt = response.text.trim();
    return this.masterPrompt;
  }
}

