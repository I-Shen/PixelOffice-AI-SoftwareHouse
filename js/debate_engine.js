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
    // ROUND 1: Sophia Sterling (Chief Architect) - Blueprint & Modularity
    // =========================================================================
    this.emit('agent_speaking', {
      agentId: "architect",
      agentName: "Sophia Sterling (Architect)",
      action: "Ronde 1: Memaparkan Proposal Arsitektur Modular...",
      zone: "meeting"
    });

    const architectProposal = await this.router.generateText({
      prompt: `Topik: "${topic}". Berikan proposal arsitektur teknis Modular Monolith yang efisien, kohesif, dan bebas over-engineering dalam 3 poin padat.`,
      systemInstruction: "Anda adalah Sophia Sterling, Chief Architect 15+ thn. Gunakan format padat tanpa basa-basi.",
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
      text: "Ronde 1: Proposal Modular Monolith siap. Komponen terisolasi dengan data contracts yang jelas."
    });

    await new Promise(r => setTimeout(r, 1100));

    // =========================================================================
    // ROUND 2: Kai Takahashi (Senior Coder) - Feasibility & Defensive Hooks
    // =========================================================================
    this.emit('agent_speaking', {
      agentId: "coder",
      agentName: "Kai Takahashi (Coder)",
      action: "Ronde 2: Meninjau Kompleksitas Kode & Proteksi Defensif...",
      zone: "meeting"
    });

    const coderCritique = await this.router.generateText({
      prompt: `Tinjau proposal arsitektur ini: "${architectProposal.text}". 
Apakah ada potensi over-engineering atau masalah latensi rendering UI? 
Berikan rekomendasi implementasi praktis dan defensive programming dalam 2 kalimat.`,
      systemInstruction: "Anda adalah Kai Takahashi, Senior Coder 11+ thn. Utamakan estetika UI, performa tinggi, dan sanitasi input sejak putaran pertama.",
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
      text: "Ronde 2: Siap! Sederhanakan layer data agar latensi rendah dan pasang sanitasi input otomatis."
    });

    await new Promise(r => setTimeout(r, 1100));

    // =========================================================================
    // ROUND 3: Viktor Petrov (Security Lead) - Attack Surface & Zero-Trust Check
    // =========================================================================
    this.emit('agent_speaking', {
      agentId: "security",
      agentName: "Viktor Petrov (Security)",
      action: "Ronde 3: Audit Keamanan Militer & OWASP Penetration Check...",
      zone: "meeting"
    });

    const securityAudit = await this.router.generateText({
      prompt: `Audit keamanan ketat untuk proposal arsitektur: "${architectProposal.text}" dan catatan coder: "${coderCritique.text}". 
Periksa 3 vektor: SQLi/Injection, DOM-XSS, dan Secrets/Token Exposure. 
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
      text: "Ronde 3: Wajib sanitasi form ketat, isolasi error, dan enkripsi token credentials."
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
- Ronde 1 (Arsitek): ${architectProposal.text}
- Ronde 2 (Coder): ${coderCritique.text}
- Ronde 3 (Security): ${securityAudit.text}

Sebagai Engineering Manager, tetapkan KEPUTUSAN EKSEKUTIF FINAL (Authoritative Verdict) yang mengikat seluruh tim dalam format 3 poin konsensus padat.`,
      systemInstruction: "Anda adalah Arthur Vance, Engineering Manager 14+ thn. Tegas, terstruktur, dan berorientasi pada hasil produksi terbaik.",
      taskType: "fast",
      agentId: "manager"
    });

    const consensusSummary = `### ⚖️ Keputusan Eksekutif Final Arthur Vance (Maksimal 3 Ronde):
${managerVerdict.text || `1. **Arsitektur**: Modular Monolith kohesif tanpa over-engineering.
2. **Koding**: UI modern berestetika tinggi dengan defensive coding bawaan.
3. **Keamanan**: Disetujui dengan penguncian sanitasi input dan proteksi OWASP.`}`;

    debateLog.push({
      round: "verdict",
      speaker: "Arthur Vance (Engineering Manager)",
      role: "manager",
      content: consensusSummary
    });

    this.emit('speech_bubble', {
      agentId: "manager",
      text: "Debat 3 ronde selesai. Keputusan eksekutif telah ditetapkan. Tim lanjut ke eksekusi!"
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
