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
Berdasarkan riset Devon Reed mengenai konsep desain Dribbble untuk domain proyek ini,
sebagai Chief Architect (15+ thn):
1. Usulkan arsitektur antarmuka modern (Glassmorphism, hierarki visual bersih, kontras tajam, palet tematik yang selaras).
2. Usulkan arsitektur data modular dengan Single Source of Truth (Master Reactive State).
3. Uraikan 3 poin teknis padat sebagai blueprint bagi tim koding.`,
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
      text: "Ronde 1: Saya mengusulkan blueprint arsitektur modern Dribbble dengan Master State tersinkronisasi!"
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
1. Tentukan pilihan FINAL arah desain Dribbble yang paling presisi dan intuitif untuk proyek "${topic}".
2. Pastikan State JavaScript ter-hidrasi (pre-populated) dengan data dummy yang relevan dan bermakna agar aplikasi hidup.
3. Konfirmasi kesiapan implementasi logika bisnis murni, interaktivitas, dan kontrol akses (RBAC).
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
      text: "Ronde 2: Disepakati! Saya akan mengadaptasi konsep desain terbaik & menyiapkan data dummy ter-hidrasi lengkap."
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
1. Dynamic RBAC Guard (Memastikan publik tidak dapat membongkar data internal/privat).
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
      text: "Ronde 3: Proteksi Guarded RBAC disetujui. Pastikan sanitasi form dan integritas data client-side terpasang."
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
- Ronde 1 (Arsitek & Konsep Desain): ${architectProposal.text}
- Ronde 2 (Coder & Komitmen Koding): ${coderCritique.text}
- Ronde 3 (Security & RBAC Guard): ${securityAudit.text}

Sebagai Engineering Manager (14+ thn), tetapkan KEPUTUSAN EKSEKUTIF FINAL (Authoritative Verdict):
1. Mengesahkan arah desain antarmuka dan arsitektur terpilih yang sesuai dengan karakteristik proyek "${topic}".
2. Mewajibkan Kai Takahashi menulis kode lengkap, padat data dummy realistis (Hydrated State), dan 100% interaktif tanpa ketergesa-gesaan.
3. Mengesahkan Guarded RBAC dan validasi logika bisnis murni.`,
      systemInstruction: "Anda adalah Arthur Vance, Engineering Manager 14+ thn. Tegas, terstruktur, dan berorientasi pada standar produk enterprise berkelas dunia.",
      taskType: "fast",
      agentId: "manager"
    });

    const consensusSummary = `### ⚖️ Keputusan Eksekutif Final Arthur Vance (Maksimal 3 Ronde):
${managerVerdict.text || `1. **Desain Terpilih**: Adaptasi Dribbble Glassmorphism Modern dengan hierarki visual terpadu.
2. **Koding & Data**: Implementasi Master State dengan data ter-hidrasi lengkap tanpa pemotongan kode.
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
