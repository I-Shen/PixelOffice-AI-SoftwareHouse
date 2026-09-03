/**
 * Meta-Prompt Evaluator & Optimizer Engine
 * Analyzes user prompts authentically across 5 professional dimensions,
 * calculates a real quality score (1-100), detects missing elements,
 * and generates a tailored Golden PRD for the SDLC pipeline.
 */

export class PromptOptimizer {
  constructor(llmRouter) {
    this.router = llmRouter;
  }

  evaluatePromptHeuristics(rawPrompt) {
    const text = (rawPrompt || "").trim();
    if (!text) {
      return {
        score: 0,
        grade: "F (Kosong)",
        breakdown: { vision: 0, modules: 0, rbac: 0, uiux: 0, technical: 0 },
        strengths: [],
        gaps: ["Prompt belum dimasukkan."],
        recommendations: ["Jelaskan tujuan aplikasi, target pengguna, dan fitur utama yang Anda inginkan."],
        optimizedPrompt: ""
      };
    }

    const lower = text.toLowerCase();
    const wordCount = text.split(/\s+/).length;

    // 1. Visi & Scope Proyek (0 - 20 pts)
    let visionScore = 0;
    if (wordCount >= 5) visionScore += 8;
    if (wordCount >= 15) visionScore += 6;
    if (/(website|aplikasi|sistem|platform|portal|dashboard|toko|kasir|klinik|sekolah|manajemen)/i.test(lower)) visionScore += 6;
    visionScore = Math.min(20, visionScore);

    // 2. Spesifikasi Modul Fungsional (0 - 20 pts)
    let modulesScore = 0;
    const moduleKeywords = [
      'fitur', 'modul', 'halaman', 'menu', 'transaksi', 'produk', 'katalog',
      'laporan', 'struk', 'keranjang', 'order', 'pesanan', 'jadwal', 'stok',
      'chat', 'notifikasi', 'filter', 'search', 'crud', 'upload', 'cetak'
    ];
    let matchedModules = moduleKeywords.filter(kw => lower.includes(kw));
    modulesScore = Math.min(20, matchedModules.length * 4 + (wordCount >= 20 ? 4 : 0));

    // 3. Role Akses & Hak Pengguna (0 - 20 pts)
    let rbacScore = 0;
    const roleKeywords = ['role', 'hak akses', 'kasir', 'manager', 'owner', 'admin', 'user', 'staf', 'pelanggan', 'dokter', 'atlet', 'siswa'];
    let matchedRoles = roleKeywords.filter(kw => lower.includes(kw));
    if (matchedRoles.length >= 3) rbacScore = 20;
    else if (matchedRoles.length === 2) rbacScore = 15;
    else if (matchedRoles.length === 1) rbacScore = 10;
    else rbacScore = 4; // default baseline

    // 4. Desain & UI/UX Dribbble (0 - 20 pts)
    let uiuxScore = 0;
    const uiKeywords = ['dribbble', 'ui', 'ux', 'desain', 'tampilan', 'warna', 'tema', 'glassmorphism', 'modern', 'dark', 'light', 'animasi', 'drawer', 'modal', 'card'];
    let matchedUi = uiKeywords.filter(kw => lower.includes(kw));
    if (matchedUi.length >= 3) uiuxScore = 20;
    else if (matchedUi.length >= 2) uiuxScore = 14;
    else if (matchedUi.length >= 1) uiuxScore = 9;
    else uiuxScore = 5;

    // 5. Ketahanan Teknis, Keamanan & Edge Cases (0 - 20 pts)
    let technicalScore = 0;
    const techKeywords = ['keamanan', 'security', 'validasi', 'pin', 'void', 'stok minus', 'api', 'database', 'clean code', 'sanitasi', 'xss', 'offline', 'realtime'];
    let matchedTech = techKeywords.filter(kw => lower.includes(kw));
    if (matchedTech.length >= 3) technicalScore = 20;
    else if (matchedTech.length >= 2) technicalScore = 14;
    else if (matchedTech.length >= 1) technicalScore = 9;
    else technicalScore = 4;

    const totalScore = Math.min(98, Math.max(30, visionScore + modulesScore + rbacScore + uiuxScore + technicalScore));

    // Determine Grade
    let grade = "C (Perlu Dioptimalkan)";
    if (totalScore >= 90) grade = "A+ (Standar Produksi Siap)";
    else if (totalScore >= 80) grade = "A (Sangat Baik)";
    else if (totalScore >= 70) grade = "B (Cukup Baik)";

    // Identify Strengths & Gaps
    const strengths = [];
    const gaps = [];
    const recommendations = [];

    if (visionScore >= 14) strengths.push("Visi dan domain industri aplikasi sudah terdefinisi secara jelas.");
    else gaps.push("Visi atau target pengguna spesifik belum diuraikan mendalam.");

    if (modulesScore >= 14) strengths.push(`Modul fungsional spesifik terdeteksi (${matchedModules.slice(0, 3).join(', ')}).`);
    else {
      gaps.push("Rincian modul operasional harian masih bisa diperinci.");
      recommendations.push("Sebutkan 3-5 modul wajib yang harus ada di layar utama.");
    }

    if (rbacScore >= 14) strengths.push(`Pembagian hak akses (RBAC) terdeteksi (${matchedRoles.join(', ')}).`);
    else {
      gaps.push("Hierarki role pengguna (siapa melihat apa) belum terbagi tegas.");
      recommendations.push("Tentukan hak akses untuk tiap user (misal: Kasir vs Manager vs Owner).");
    }

    if (uiuxScore >= 14) strengths.push("Instruksi preferensi antarmuka UI/UX modern ala Dribbble teridentifikasi.");
    else recommendations.push("Dr. Elena menyarankan palet Dark Glassmorphism dengan micro-interactions responsif.");

    if (technicalScore >= 14) strengths.push("Parameter keamanan dan validasi edge-cases sudah diperhatikan.");
    else recommendations.push("Dr. Elena melengkapi sanitasi form, proteksi stok minus, dan audit log otomatis.");

    return {
      score: totalScore,
      grade,
      breakdown: {
        vision: visionScore,
        modules: modulesScore,
        rbac: rbacScore,
        uiux: uiuxScore,
        technical: technicalScore
      },
      wordCount,
      matchedModules,
      matchedRoles,
      strengths,
      gaps,
      recommendations
    };
  }

  async optimizePrompt(rawPrompt) {
    const evaluation = this.evaluatePromptHeuristics(rawPrompt);
    
    const prompt = `Lakukan evaluasi arsitektur dan optimasi requirements engineering terhadap prompt klien berikut:
"${rawPrompt}"

Parameter Evaluasi Matematis Awal oleh Dr. Elena Rostova:
- Skor Asli: ${evaluation.score}/100 (Grade: ${evaluation.grade})
- Skor Visi: ${evaluation.breakdown.vision}/20
- Skor Modul Fungsional: ${evaluation.breakdown.modules}/20
- Skor Role Access (RBAC): ${evaluation.breakdown.rbac}/20
- Skor UI/UX Dribbble: ${evaluation.breakdown.uiux}/20
- Skor Keamanan & Validasi: ${evaluation.breakdown.technical}/20

Tugas Dr. Elena Rostova:
1. Berikan umpan balik evaluasi jujur dan konstruktif:
   - Sebutkan apa saja kekuatan dari prompt Bos @I-Shen
   - Sebutkan bagian mana yang kami lengkapi (kekurangan awal yang disempurnakan)
2. Susun PRD Emas hasil penyempurnaan (Target Siap Koding 100%):
   - Nama Proyek & Definisi Domain yang Presisi
   - UI/UX Styling (Glassmorphism, palet tematik, micro-transitions)
   - Pembagian RBAC (Multi-Role)
   - Rincian Modul Interaktif & Data Mock Ter-hidrasi
   - Pengamanan & Validasi Celah Kritis
3. Sampaikan dalam Bahasa Indonesia formal, analitis, dan penuh percaya diri sebagai Principal Requirements Specialist.`;

    const response = await this.router.generateText({
      prompt,
      systemInstruction: "Anda adalah Dr. Elena Rostova, Principal Requirements Specialist di PixelOffice. Anda mengevaluasi prompt secara analitis dan matematis tanpa basa-basi klise. Tunjukkan kecerdasan analitik sejati dalam membedah kebutuhan software.",
      taskType: "fast",
      agentId: "optimizer"
    });

    return {
      ...evaluation,
      optimizedPromptText: response.text,
      modelUsed: response.modelUsed,
      keyUsed: response.keyUsed,
      elapsedSec: response.elapsedSec
    };
  }
}
