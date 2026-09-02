/**
 * Meta-Prompt Evaluator & Optimizer Engine
 * Analyzes user prompts, calculates a multi-dimensional quality score (1-100),
 * and generates a high-precision PRD prompt for the SDLC pipeline.
 */

export class PromptOptimizer {
  constructor(llmRouter) {
    this.router = llmRouter;
  }

  evaluatePromptHeuristics(rawPrompt) {
    const text = rawPrompt.trim();
    if (!text) {
      return {
        score: 0,
        clarity: 0,
        scope: 0,
        architecture: 0,
        testing: 0,
        feedback: "Prompt kosong. Silakan tuliskan kebutuhan aplikasi Anda.",
        optimizedPrompt: ""
      };
    }

    const wordCount = text.split(/\s+/).length;
    let clarity = Math.min(25, Math.floor(wordCount * 1.2) + (text.includes("?") || text.includes(":") ? 8 : 4));
    
    const hasTechKeywords = /(api|database|framework|backend|frontend|ui|ux|responsive|rest|sql|json|docker|security|upload|auth)/i.test(text);
    let architecture = hasTechKeywords ? 23 : Math.min(18, wordCount >= 10 ? 14 : 8);
    
    const hasScopeKeywords = /(fitur|halaman|dashboard|auth|login|crud|export|table|button|user|role|form|foto)/i.test(text);
    let scope = hasScopeKeywords ? 24 : Math.min(17, wordCount >= 15 ? 13 : 7);
    
    const hasQualityKeywords = /(test|keamanan|audit|perform|cepat|clean code|validasi|error|owasp)/i.test(text);
    let testing = hasQualityKeywords ? 23 : Math.min(16, wordCount >= 20 ? 12 : 6);

    const totalScore = Math.min(98, clarity + architecture + scope + testing);

    return {
      score: totalScore,
      clarity,
      scope,
      architecture,
      testing,
      wordCount,
      grade: totalScore >= 85 ? "A (Sangat Siap Produksi)" : totalScore >= 70 ? "B (Cukup Baik)" : "C (Perlu Dioptimalkan)"
    };
  }

  async optimizePrompt(rawPrompt) {
    const heuristics = this.evaluatePromptHeuristics(rawPrompt);
    
    const prompt = `Analisis kebutuhan software house berikut dari klien:
"${rawPrompt}"

Tugas Anda sebagai Senior Requirements & Prompt Specialist (Dr. Elena Rostova):
1. Buat versi prompt yang disempurnakan (GOLDEN PRD Format 100/100):
   - Nama Proyek & Identitas Spesifik
   - Desain & Estetika UI/UX (Inspirasi Dribbble: Glassmorphism + Claymorphism 3D, palet warna tematik)
   - Skema Data Master (Single Source of Truth dengan data dummy realistis ter-hidrasi di JavaScript)
   - Pembagian Hak Akses (Dynamic Multi-Role RBAC: Publik vs Internal Manajemen)
   - Dekomposisi 8 Modul Fungsional Lengkap (Interaktif dengan feedback instan & WhatsApp generator 1-klik)
   - Standar Kualitas Koding Senior (Single-file HTML/CSS/JS tanpa placeholder, bebas CSP)
2. Buat ringkasan dalam Bahasa Indonesia yang profesional, terstruktur, dan tegas.`;

    const response = await this.router.generateText({
      prompt,
      systemInstruction: "Anda adalah Dr. Elena Rostova, pakar Requirements Engineering dan Prompt Optimization 11+ tahun pengalaman. Bangun PRD Emas yang mengunci standar senior developer 10+ tahun, data terisi padat, dan estetika Dribbble kelas dunia.",
      taskType: "fast",
      agentId: "optimizer"
    });

    return {
      ...heuristics,
      optimizedPromptText: response.text,
      modelUsed: response.modelUsed
    };
  }
}
