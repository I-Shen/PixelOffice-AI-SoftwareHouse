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
      taskType: "reasoning",
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

    // Extract exact immutable project title
    let lockedTitle = "Girl Basketball Management SMALA";
    const titleMatch = this.currentRawPrompt.match(/["'“]([^"'”]+)["'”]/i);
    if (titleMatch && titleMatch[1]) {
      lockedTitle = titleMatch[1].trim();
    }

    const result = {
      reply: cleanReply,
      text: cleanReply,
      isDeal: true,
      score: 100,
      scope: this.detectedScope,
      projectName: lockedTitle,
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

    const prompt = `Berdasarkan seluruh hasil diskusi dan kesepakatan eksekutif berikut:
"""
${chatContext}
"""

Tuliskan SPESIFIKASI PROYEK MASTER EMAS (GOLDEN PRD SCORE 100/100) yang padat, terstruktur, presisi, dan siap jalan untuk diinputkan ke SDLC Pipeline.

STRUKTUR PRD WAJIB:
1. JUDUL & IDENTITAS PROYEK: Nama aplikasi yang diminta secara tepat (contoh: "Girl Basketball Management SMALA").
2. BENCHMARK DESAIN & INSPIRASI DRIBBLE:
   - Adaptasi Top Dribbble Sports/Enterprise UI: Obsidian Dark Mode (#080C14), aksen Vibrant Orange (#FF6B00), Glassmorphism (backdrop-filter: blur(16px)), dan Claymorphism 3D tactile buttons.
   - Tipografi Google Fonts modern (Plus Jakarta Sans / Outfit), court line accents, dan glowing status badges.
3. SKEMA DATA MASTER TER-HIDRASI (SINGLE SOURCE OF TRUTH):
   - Wajib generate minimal 8 entitas data dummy realistis di JavaScript (misal: Roster 8 atlet putri lengkap dengan statistik PPG/RPG/APG, rekam medis/cedera, gol darah, status berkas pendaftaran).
   - Sinkronisasi data master ini ke seluruh modul: Roster, Dropdown Evaluasi Video Coach, dan Tabel Berkas Turnamen.
4. ATURAN AKSES & PERAN (DYNAMIC RBAC MATRIX):
   - Switcher Role: Publik/Suporter (Hanya Berita/Galeri/Jadwal) vs Internal Tim (Admin, Coach, Keuangan dengan Guarded View).
5. DEKOMPOSISI 8 MODUL LENGKAP:
   - Keuangan (Metrik Saldo, Mutasi Kas, Form Add), Roster & Medis (Cards + Modal Popup Detail), Statistik & Video Review Coach (Form Evaluasi Drill), Jadwal & WhatsApp Broadcast Generator (Format WA bersih + 1-Click Copy), Filling Berkas (Checklist KTS/Akta/Izin), Galeri, Berita, Multi-Role Login.
6. STANDAR KUALITAS KODE SENIOR (10+ TAHUN):
   - Single-file HTML5/CSS3/JS mandiri, bebas hambatan CSP, interaktivitas event listener 100% aktif, DILARANG memotong kode atau menggunakan placeholder kosong.

Tuliskan instruksi di atas dalam satu kesatuan prompt instruksi PRD yang komprehensif tanpa komentar basa-basi.`;

    const response = await this.router.generateText({
      prompt,
      systemInstruction: `Anda adalah Dr. Elena Rostova, Chief PRD Architect PixelOffice AI Software House. Rumuskan prompt PRD master bernilai 100/100 yang presisi, kaya data (hydrated state), dan setia 100% pada kebutuhan aktual proyek Bos @I-Shen.`,
      taskType: "fast",
      agentId: "optimizer"
    });

    this.masterPrompt = response.text.trim();
    return this.masterPrompt;
  }
}

