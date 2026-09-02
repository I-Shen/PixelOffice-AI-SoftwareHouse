/**
 * Token-Capped Autonomous Multi-Agent Debate & Consensus Engine
 * Upgraded: Max 3 Rounds in War Room with Authoritative Executive Verdict by Arthur Vance.
 */

export class DebateEngine {
  constructor(llmRouter) {
    this.router = llmRouter;
    this.eventListeners = [];
  }

  on(event, callback) {
    this.eventListeners.push({ event, callback });
  }

  emit(event, data) {
    this.eventListeners.filter(l => l.event === event).forEach(l => l.callback(data));
  }

  async conductDebate({ topic, context, maxRounds = 3 }) {
    this.emit('debate_start', { topic, maxRounds });
    const debateLog = [];

    // =========================================================================
    // ROUND 1: Sophia Sterling (Chief Architect) - Blueprint & Dribbble Benchmark
    // =========================================================================
    this.emit('agent_speaking', {
      agentId: "architect",
      agentName: "Sophia Sterling (Architect)",
      action: "Ronde 1: Memaparkan Proposal Arsitektur & Analisis Top 5 Desain Dribbble...",
      zone: "meeting"
    });

    const architectProposal = await this.router.generateText({
      prompt: `Topik Proyek: "${topic}". 
Berdasarkan riset Devon Reed mengenai Top 5 Inspirasi Desain Dribbble untuk domain ini:
1. Obsidian Glassmorphism & High-Contrast Cyberpunk UI (Dark #080C14 + Vibrant Orange Glow).
2. Tactile Claymorphism 3D Dashboard (Soft rounded widgets, elevated cards).
3. Pro Sports Analytics & Tactical Court Board (Radar skills & player trading cards).
4. Scandinavian Clean Athletic Portal (High-density clean typography & crisp tables).
5. Enterprise Multi-Tier Sports Hub (Strict RBAC visual layers & guarded modal views).

Sebagai Chief Architect (15+ thn), pilih 2 kandidat terkuat, usulkan arsitektur Modular Monolith dengan Single Source of Truth (Master State), dan paparkan dalam 3 poin padat.`,
      systemInstruction: "Anda adalah Sophia Sterling, Chief Architect 15+ thn. Gunakan format padat, berwawasan desain Dribbble modern, dan berorientasi arsitektur enterprise.",
      taskType: "fast",
      agentId: "architect"
    });

    debateLog.push({
      round: 1,
      speaker: "Sophia Sterling (Architect)",
      role: "architect",
      content: architectProposal.text
    });

    this.emit('speech_bubble', {
      agentId: "architect",
      text: "Ronde 1: Saya mengusulkan adaptasi Dribbble Obsidian Glassmorphism + Claymorphism 3D dengan Master State tersinkronisasi!"
    });

    await new Promise(r => setTimeout(r, 1100));

    // =========================================================================
    // ROUND 2: Kai Takahashi (Senior Coder) - Dribbble Vote & Defensive Hooks
    // =========================================================================
    this.emit('agent_speaking', {
      agentId: "coder",
      agentName: "Kai Takahashi (Coder)",
      action: "Ronde 2: Voting Desain Dribbble #1 & Penyiapan Master Mock State...",
      zone: "meeting"
    });

    const coderCritique = await this.router.generateText({
      prompt: `Tinjau proposal Sophia: "${architectProposal.text}". 
Sebagai Senior Polyglot Coder (11+ thn):
1. Tentukan pilihan FINAL desain Dribbble #1 yang akan diadaptasi untuk proyek "${topic}".
2. Pastikan State JavaScript ter-hidrasi (pre-populated) dengan data dummy minimal 8 atlet/entitas lengkap agar website tidak kosong.
3. Konfirmasi kesiapan implementasi clipboard copy WhatsApp dan guarded RBAC view.
Jawab dalam 3 poin teknis padat.`,
      systemInstruction: "Anda adalah Kai Takahashi, Senior Coder 11+ thn. Utamakan estetika UI Dribbble kelas dunia, performa tinggi, dan Single Source of Truth.",
      taskType: "fast",
      agentId: "coder"
    });

    debateLog.push({
      round: 2,
      speaker: "Kai Takahashi (Senior Coder)",
      role: "coder",
      content: coderCritique.text
    });

    this.emit('speech_bubble', {
      agentId: "coder",
      text: "Ronde 2: Disepakati! Saya akan mengadaptasi Desain Dribbble #1 & menyiapkan 8 profil data dummy ter-hidrasi lengkap."
    });

    await new Promise(r => setTimeout(r, 1100));

    // =========================================================================
    // ROUND 3: Viktor Petrov (Security Lead) - Attack Surface & Zero-Trust Check
    // =========================================================================
    this.emit('agent_speaking', {
      agentId: "security",
      agentName: "Viktor Petrov (Security)",
      action: "Ronde 3: Audit Keamanan Militer & Guarded RBAC Boundary...",
      zone: "meeting"
    });

    const securityAudit = await this.router.generateText({
      prompt: `Audit keamanan ketat untuk proposal arsitektur: "${architectProposal.text}" dan komitmen koding Kai: "${coderCritique.text}". 
Periksa 3 vektor:
1. Dynamic RBAC Guard (Memastikan publik tidak dapat membongkar data medis/keuangan).
2. Input Sanitization & Anti-XSS pada form input dinamis.
3. Zero-Dependency CSP Compliance.
Berikan syarat mitigasi mutlak dalam 2 poin.`,
      systemInstruction: "Anda adalah Viktor Petrov, Principal Pentest & Security Lead 13+ thn (CISSP/OSCP). Terapkan standar Zero-Tolerance.",
      taskType: "fast",
      agentId: "security"
    });

    debateLog.push({
      round: 3,
      speaker: "Viktor Petrov (Security Auditor)",
      role: "security",
      content: securityAudit.text
    });

    this.emit('speech_bubble', {
      agentId: "security",
      text: "Ronde 3: Proteksi Guarded RBAC disetujui. Pastikan sanitasi form dan enkripsi data lokal client-side terpasang."
    });

    await new Promise(r => setTimeout(r, 1100));

    // =========================================================================
    // FINAL VERDICT: Arthur Vance (Engineering Manager) - Authoritative Decision
    // =========================================================================
    this.emit('agent_speaking', {
      agentId: "manager",
      agentName: "Arthur Vance (Eng Manager)",
      action: "Menetapkan Keputusan Eksekutif Final (Arthur Vance)...",
      zone: "meeting"
    });

    const managerVerdict = await this.router.generateText({
      prompt: `Berdasarkan 3 ronde debat teknis tim berikut:
- Ronde 1 (Arsitek & Dribbble Options): ${architectProposal.text}
- Ronde 2 (Coder & Pilihan Dribbble #1): ${coderCritique.text}
- Ronde 3 (Security & RBAC Guard): ${securityAudit.text}

Sebagai Engineering Manager (14+ thn), tetapkan KEPUTUSAN EKSEKUTIF FINAL (Authoritative Verdict):
1. Mengesahkan adaptasi Desain Dribbble #1 (Obsidian Dark + Basketball Orange Glow + Claymorphism 3D).
2. Mewajibkan Kai Takahashi menulis kode lengkap, padat data dummy realistis (Hydrated State), dan 100% interaktif tanpa ketergesa-gesaan.
3. Mengesahkan Guarded RBAC dan generator broadcast WhatsApp 1-klik.`,
      systemInstruction: "Anda adalah Arthur Vance, Engineering Manager 14+ thn. Tegas, terstruktur, dan berorientasi pada standar produk enterprise berkelas dunia.",
      taskType: "fast",
      agentId: "manager"
    });

    const consensusSummary = `### ⚖️ Keputusan Eksekutif Final Arthur Vance (Maksimal 3 Ronde):
${managerVerdict.text || `1. **Desain Terpilih**: Adaptasi Dribbble Obsidian Dark Glassmorphism + 3D Claymorphism Tactile UI.
2. **Koding & Data**: Implementasi Master State dengan 8+ profil dummy ter-hidrasi lengkap tanpa pemotongan kode.
3. **Keamanan & RBAC**: Guarded Role Access Control dan sanitasi form tervalidasi 100%.`}`;

    debateLog.push({
      round: "verdict",
      speaker: "Arthur Vance (Engineering Manager)",
      role: "manager",
      content: consensusSummary
    });

    this.emit('speech_bubble', {
      agentId: "manager",
      text: "Debat War Room selesai! Desain Dribbble #1 disahkan. Kai, bangun produk lengkap tanpa terburu-buru!"
    });

    this.emit('debate_end', {
      debateLog,
      consensus: consensusSummary,
      roundsCompleted: 3
    });

    return {
      debateLog,
      consensus: consensusSummary,
      roundsCompleted: 3
    };
  }

  async conductArchitectureDebate(topic, context) {
    return this.conductDebate({ topic, context, maxRounds: 3 });
  }
}
