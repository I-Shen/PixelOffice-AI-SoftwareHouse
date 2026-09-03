/**
 * PixelOffice AI Software House - Main Application Controller (v2.8.1)
 * Unified Interactive Dialogue Stream & Headquarters Live Project Cockpit
 */

import { CONFIG } from './config.js';
import { LLMRouter } from './llm_router.js';
import { PixelOfficeCanvas } from './pixel_canvas.js';
import { IsometricBuildingCanvas } from './isometric_building.js';
import { DebateEngine } from './debate_engine.js';
import { SDLCOrchestrator } from './sdlc_orchestrator.js';
import { PromptOptimizer } from './prompt_optimizer.js';
import { KanbanQueue } from './kanban_queue.js';
import { ExecutiveAdvisor } from './executive_advisor.js';

export class PixelOfficeApp {
  constructor() {
    try {
      this.router = new LLMRouter();
      this.optimizer = new PromptOptimizer(this.router);
      this.debateEngine = new DebateEngine(this.router);
      this.orchestrator = new SDLCOrchestrator(this.router, this.debateEngine, this.optimizer);
      this.advisor = new ExecutiveAdvisor(this.router);
      this.kanban = new KanbanQueue((projects) => this.renderKanbanList(projects));
    } catch (e) {
      console.error("[Core Services Init Error]", e);
    }
    
    this.canvasEngine = null;
    this.buildingEngine = null;
    this.dialogueHistory = [];
    this.unreadDialogueCount = 0;
    this.isSidebarOpen = false;
    this.activeDialogueFilter = 'executive'; // Default to Ruang Eksekutif
    this.lastSpeechTime = 0;
    this.lastSpeechText = "";

    this.initDOM();
    this.initEventListeners();
    this.initDigitalClock();
    this.renderAgentCards();
    if (this.kanban) this.renderKanbanList(this.kanban.getAllProjects());
    if (this.orchestrator && this.orchestrator.analytics) {
      this.updateAnalyticsUI(this.orchestrator.analytics.getMetrics());
    }

    this.appendTerminalLog("system", "🏢 PixelOffice AI Software House Online.");
    this.appendTerminalLog("system", `🔀 Smart Gemini Multi-Tier Fallback Gateway Active (Primary: ${CONFIG.models.fastTier[0]}).`);
    this.appendTerminalLog("system", "💬 Live Inter-Agent Dialogue Stream & Meta-Evaluation Engine Ready.");
  }

  initDOM() {
    try {
      const canvas = document.getElementById('officeCanvas');
      const bubbleContainer = document.getElementById('speechBubbleLayer');
      if (canvas && bubbleContainer) {
        this.canvasEngine = new PixelOfficeCanvas(canvas, bubbleContainer);
      }
      const buildingCanvas = document.getElementById('buildingCanvas');
      if (buildingCanvas) {
        this.buildingEngine = new IsometricBuildingCanvas(buildingCanvas);
      }
    } catch (err) {
      console.error("[Canvas Init Error]", err);
    }

    // Cockpit Prompt & SDLC Actions
    this.promptInput = document.getElementById('projectPrompt');
    this.startBtn = document.getElementById('startProjectBtn');
    this.auditBtn = document.getElementById('auditPromptBtn');
    this.openSidebarFromDockBtn = document.getElementById('openSidebarFromDockBtn');
    this.scoreValue = document.getElementById('promptScoreValue');
    this.presetButtons = document.querySelectorAll('.preset-btn');

    // Cockpit Tabs & Panels
    this.cockpitTabBtns = document.querySelectorAll('.cockpit-tab-btn');
    this.cockpitPanes = document.querySelectorAll('.cockpit-tab-pane');
    this.cockpitCodeTitle = document.getElementById('cockpitCodeTitle');
    this.cockpitCodeContent = document.getElementById('cockpitCodeContent');
    this.copyCodeBtn = document.getElementById('copyCodeBtn');

    // Cockpit Security Matrix Badges
    this.secStatusPentest = document.getElementById('secStatusPentest');
    this.secStatusSandbox = document.getElementById('secStatusSandbox');
    this.secStatusPRD = document.getElementById('secStatusPRD');
    this.secStatusArthur = document.getElementById('secStatusArthur');

    // Right Pane HUD
    this.addToQueueBtn = document.getElementById('addToQueueBtn');
    this.kanbanListContainer = document.getElementById('kanbanListContainer');
    this.terminalOutput = document.getElementById('terminalOutput');
    this.modelBadge = document.getElementById('activeModelBadge');
    this.copyLogsBtn = document.getElementById('copyLogsBtn');

    // Analytics Header Elements
    this.analyticsTotalTokens = document.getElementById('analyticsTotalTokens');
    this.analyticsCostSaved = document.getElementById('analyticsCostSaved');

    // Progress Stepper Elements
    this.progressBarFill = document.getElementById('progressBarFill');
    this.progressPercentageDisplay = document.getElementById('progressPercentageDisplay');
    this.currentStageText = document.getElementById('currentStageText');
    this.securityPatchBadge = document.getElementById('securityPatchBadge');

    // Live Dialogue Sidebar Drawer DOM
    this.sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    this.dialogueSidebar = document.getElementById('dialogueSidebar');
    this.closeSidebarBtn = document.getElementById('closeSidebarBtn');
    this.sidebarBackdrop = document.getElementById('sidebarBackdrop');
    this.dialogueFeedList = document.getElementById('dialogueFeedList');
    this.dialogueUnreadBadge = document.getElementById('dialogueUnreadBadge');
    this.sidebarScorecard = document.getElementById('sidebarScorecard');
    this.scorecardScoreBadge = document.getElementById('scorecardScoreBadge');
    this.scorecardMetrics = document.getElementById('scorecardMetrics');
    this.exportDialogueJsonBtn = document.getElementById('exportDialogueJsonBtn');
    this.clearDialogueBtn = document.getElementById('clearDialogueBtn');
    this.dialogueFilterBar = document.getElementById('dialogueFilterBar');
    this.dialogueFilterChips = document.querySelectorAll('.dialogue-filter-bar .filter-chip');

    // Integrated Sidebar Chat Dock & Deal Card
    this.sidebarChatDock = document.querySelector('.sidebar-chat-dock');
    this.sidebarChatInput = document.getElementById('sidebarChatInput');
    this.sidebarSendChatBtn = document.getElementById('sidebarSendChatBtn');
    this.dealConsensusCard = document.getElementById('dealConsensusCard');
    this.dealSummaryText = document.getElementById('dealSummaryText');
    this.dealMasterPromptText = document.getElementById('dealMasterPromptText');
    this.closeDealCardBtn = document.getElementById('closeDealCardBtn');
    this.sidebarExecuteSdlcBtn = document.getElementById('sidebarExecuteSdlcBtn');
    this.sidebarReviewCockpitBtn = document.getElementById('sidebarReviewCockpitBtn');
    this.quickChips = document.querySelectorAll('.sidebar-quick-prompts .quick-chip');
  }

  initEventListeners() {
    // -------------------------------------------------------------
    // Cockpit Tab Switching
    // -------------------------------------------------------------
    if (this.cockpitTabBtns) {
      this.cockpitTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab');
          this.cockpitTabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          if (this.cockpitPanes) {
            this.cockpitPanes.forEach(pane => {
              if (pane.id === `pane-${tabId}`) {
                pane.style.display = 'flex';
                pane.classList.add('active');
              } else {
                pane.style.display = 'none';
                pane.classList.remove('active');
              }
            });
          }
        });
      });
    }

    if (this.copyCodeBtn && this.cockpitCodeContent) {
      this.copyCodeBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(this.cockpitCodeContent.innerText || "")
          .then(() => {
            const orig = this.copyCodeBtn.innerText;
            this.copyCodeBtn.innerText = "✅ Tersalin!";
            setTimeout(() => { this.copyCodeBtn.innerText = orig; }, 2000);
          })
          .catch(() => alert("Gagal menyalin kode."));
      });
    }

    // SDLC Launch & Audit Buttons
    if (this.startBtn) this.startBtn.addEventListener('click', () => this.handleStartSDLC());
    if (this.auditBtn) this.auditBtn.addEventListener('click', () => this.handleAuditPrompt());

    if (this.openSidebarFromDockBtn) {
      this.openSidebarFromDockBtn.addEventListener('click', () => {
        this.toggleDialogueSidebar(true);
        const prompt = this.promptInput ? this.promptInput.value.trim() : "";
        if (prompt && this.dialogueHistory.length === 0) {
          this.startSidebarConsultation(prompt);
        }
      });
    }

    // Sidebar Toggle Button Handlers
    if (this.sidebarToggleBtn) {
      this.sidebarToggleBtn.addEventListener('click', () => this.toggleDialogueSidebar(true));
    }
    if (this.closeSidebarBtn) {
      this.closeSidebarBtn.addEventListener('click', () => this.toggleDialogueSidebar(false));
    }
    if (this.sidebarBackdrop) {
      this.sidebarBackdrop.addEventListener('click', () => this.toggleDialogueSidebar(false));
    }

    // Sidebar Action Buttons
    if (this.exportDialogueJsonBtn) {
      this.exportDialogueJsonBtn.addEventListener('click', () => this.exportDialogueJson());
    }
    if (this.clearDialogueBtn) {
      this.clearDialogueBtn.addEventListener('click', () => this.clearDialogueFeed());
    }

    // Sidebar Interactive Chat Handlers (Ruang Eksekutif Only)
    if (this.sidebarSendChatBtn) {
      this.sidebarSendChatBtn.addEventListener('click', () => this.handleSendSidebarChat());
    }
    if (this.sidebarChatInput) {
      this.sidebarChatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleSendSidebarChat();
        }
      });
    }

    // Quick Chips in Sidebar
    if (this.quickChips) {
      this.quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const text = chip.getAttribute('data-text');
          if (!text) return;
          if (text.includes("Mulai SDLC") || text.includes("eksekusi")) {
            const prompt = (this.advisor && this.advisor.masterPrompt) || (this.promptInput ? this.promptInput.value.trim() : "");
            this.handleStartSDLC(prompt);
          } else if (this.sidebarChatInput) {
            this.sidebarChatInput.value = text;
            this.handleSendSidebarChat();
          }
        });
      });
    }

    // Deal Consensus Card Buttons
    if (this.closeDealCardBtn && this.dealConsensusCard) {
      this.closeDealCardBtn.addEventListener('click', () => {
        this.dealConsensusCard.style.display = 'none';
      });
    }

    if (this.sidebarExecuteSdlcBtn) {
      this.sidebarExecuteSdlcBtn.addEventListener('click', () => {
        if (this.dealConsensusCard) {
          this.dealConsensusCard.style.display = 'none';
        }
        const prompt = (this.advisor && this.advisor.masterPrompt) ? this.advisor.masterPrompt : "";
        this.handleStartSDLC(prompt);
      });
    }

    if (this.sidebarReviewCockpitBtn) {
      this.sidebarReviewCockpitBtn.addEventListener('click', () => {
        if (this.dealConsensusCard) {
          this.dealConsensusCard.style.display = 'none';
        }
        const telemetryBtn = document.querySelector('.cockpit-tab-btn[data-tab="telemetry"]');
        if (telemetryBtn) telemetryBtn.click();
      });
    }

    // Router Telemetry & Real-Time Model Status Listeners
    if (this.router) {
      this.router.on('model_attempt', (data) => {
        if (this.modelBadge) {
          this.modelBadge.textContent = `${data.model} (Kunci #${data.keyIndex})`;
        }
        this.appendTerminalLog("router", `[Router] ${data.model} (Kunci #${data.keyIndex}/${data.totalKeys}) ➡️ ${data.agentId} (${data.taskType})...`);
      });

      this.router.on('generation_success', (data) => {
        if (this.modelBadge) {
          this.modelBadge.textContent = `${data.model} (${data.elapsedSec}s)`;
        }
        this.appendTerminalLog("router", `✅ [Sukses] ${data.model} (Kunci #${data.keyIndex}) selesai dalam ${data.elapsedSec}s [${data.tokens} tokens].`);
      });

      this.router.on('rate_limited', (data) => {
        const resetDate = new Date(Date.now() + (data.durationSec * 1000));
        const resetStr = resetDate.toLocaleTimeString();
        if (this.modelBadge) {
          this.modelBadge.textContent = `⏳ ${data.model} Limit (${resetStr})`;
        }
        this.appendTerminalLog("router", `⚠️ [Limit 429] ${data.model} mencapai batas kuota Google (Terdeteksi dalam ${data.elapsedSec}s). Reset jam ${resetStr}.`);
      });

      this.router.on('timeout_event', (data) => {
        if (this.modelBadge) {
          this.modelBadge.textContent = `⏱️ ${data.model} Timeout`;
        }
        this.appendTerminalLog("router", `⏱️ [Server Google Sibuk] ${data.model} (Kunci #${data.keyIndex}) belum merespons setelah ${data.elapsedSec} detik. Menghitung latensi riil & beralih otomatis...`);
      });

      this.router.on('high_demand_event', (data) => {
        if (this.modelBadge) {
          this.modelBadge.textContent = `⚠️ ${data.model} High Demand`;
        }
        this.appendTerminalLog("router", `⚠️ [High Demand 503] ${data.model} (Kunci #${data.keyIndex}) overload di server Google (${data.elapsedSec}s). Beralih otomatis...`);
      });

      this.router.on('fallback_triggered', (data) => {
        this.appendTerminalLog("router", `🔀 [Auto-Switch] Beralih dari ${data.failedModel} ke ${data.nextModel} (${data.reason}).`);
      });
    }

    // Dialogue Filter Chips with Mouse Wheel Horizontal Scrolling
    if (this.dialogueFilterBar) {
      this.dialogueFilterBar.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          this.dialogueFilterBar.scrollLeft += e.deltaY;
        }
      }, { passive: false });
    }

    if (this.dialogueFilterChips) {
      this.dialogueFilterChips.forEach(chip => {
        chip.addEventListener('click', () => {
          this.dialogueFilterChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.activeDialogueFilter = chip.getAttribute('data-filter') || 'all';

          // Strictly toggle chat dock: ONLY visible in Ruang Eksekutif!
          if (this.sidebarChatDock) {
            this.sidebarChatDock.style.display = (this.activeDialogueFilter === 'executive') ? 'flex' : 'none';
          }

          this.renderFilteredDialogues();
        });
      });
    }

    if (this.copyLogsBtn) {
      this.copyLogsBtn.addEventListener('click', () => {
        const logEntries = Array.from(this.terminalOutput.querySelectorAll('.log-entry'))
          .map(el => el.innerText)
          .join('\n');
        
        navigator.clipboard.writeText(logEntries || "Tidak ada log terminal.")
          .then(() => {
            const originalText = this.copyLogsBtn.innerText;
            this.copyLogsBtn.innerText = "✅ Tersalin!";
            setTimeout(() => { this.copyLogsBtn.innerText = originalText; }, 2000);
          })
          .catch(() => {
            alert("Gagal menyalin log otomatis. Silakan blok dan salin teks manual.");
          });
      });
    }

    // Weather Switcher Controller
    const weatherBtn = document.getElementById('weatherToggleBtn');
    if (weatherBtn) {
      weatherBtn.addEventListener('click', () => {
        if (this.canvasEngine) {
          const next = this.canvasEngine.cycleNextWeather();
          this.appendTerminalLog("system", `🌤️ [Cuaca Luar Kantor] Berubah menjadi: ${next.icon} ${next.name}`);
        }
      });
    }

    // Canvas Fullscreen Toggle
    const fsBtn = document.getElementById('canvasFullscreenBtn');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        this.toggleCanvasFullscreen();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('.canvas-wrapper.is-fullscreen')) {
        this.toggleCanvasFullscreen(false);
      }
    });

    // Global Error Capture
    window.addEventListener('error', (e) => {
      const src = e.filename ? e.filename.split('/').pop() : 'script';
      this.appendTerminalLog("security", `⚠️ [UNCAUGHT ERROR] ${e.message} (${src}:${e.lineno})`);
    });

    window.addEventListener('unhandledrejection', (e) => {
      const reason = e.reason ? (e.reason.message || String(e.reason)) : 'Promise Rejected';
      this.appendTerminalLog("security", `⚠️ [PROMISE ERROR] ${reason}`);
    });

    if (this.addToQueueBtn) {
      this.addToQueueBtn.addEventListener('click', () => {
        const text = this.promptInput.value.trim();
        if (!text) return;
        this.kanban.addProject(text.slice(0, 30), text, "HIGH");
        this.appendTerminalLog("system", `🗂️ Proyek ditambahkan ke Antrean Kanban Sprint.`);
      });
    }

    if (this.presetButtons) {
      this.presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const prompt = btn.getAttribute('data-prompt');
          if (prompt && this.promptInput) {
            this.promptInput.value = prompt;
            this.handleAuditPrompt();
          }
        });
      });
    }

    if (this.promptInput) {
      this.promptInput.addEventListener('input', () => {
        const evalResult = this.optimizer.evaluatePromptHeuristics(this.promptInput.value);
        if (this.scoreValue && evalResult) {
          this.scoreValue.textContent = evalResult.score;
        }
      });
    }

    // LLM Router Telemetry
    this.router.on('model_attempt', data => {
      if (this.modelBadge) this.modelBadge.textContent = data.model;
      this.appendTerminalLog("router", `[Router] ${data.model} ➡️ ${data.agentId} (${data.taskType})...`);
    });

    this.router.on('fallback_triggered', data => {
      this.appendTerminalLog("router", `⚠️ [Fallback Switch] ${data.failedModel} limit 429 ➡️ Beralih ke: ${data.nextModel}`);
      this.orchestrator.analytics.recordUsage({ tokensUsed: 400, modelUsed: data.nextModel, isFallback: true });
      this.updateAnalyticsUI(this.orchestrator.analytics.getMetrics());
    });

    // War Room Debate Engine Event Wiring
    this.debateEngine.on('agent_speaking', data => {
      if (this.canvasEngine) {
        this.canvasEngine.setAgentTarget(data.agentId, data.zone);
      }
      this.appendTerminalLog("debate", `🗣️ [War Room] ${data.agentName}: ${data.action}`);
    });

    this.debateEngine.on('speech_bubble', data => {
      if (this.canvasEngine) {
        this.canvasEngine.showSpeechBubble(data.agentId, data.text, true);
      }
    });

    // -------------------------------------------------------------
    // Canvas Speech Bubble Synchronization to Dialogue Stream
    // (Only formal dialogue events will reach here)
    // -------------------------------------------------------------
    if (this.canvasEngine) {
      this.canvasEngine.onSpeech(data => {
        const now = Date.now();
        if (now - this.lastSpeechTime < 800 && this.lastSpeechText === data.text) return;
        this.lastSpeechTime = now;
        this.lastSpeechText = data.text;

        this.appendDialogueMessage({
          agentId: data.agentId,
          name: data.name,
          role: data.role,
          avatar: data.avatar,
          color: data.color,
          stage: "Diskusi Kantor",
          message: data.text
        });
      });
    }

    // SDLC Pipeline Event Listeners
    this.orchestrator.on('dialogue_event', dialogue => {
      this.appendDialogueMessage(dialogue);
    });

    this.orchestrator.on('meta_evaluation_completed', evalData => {
      this.renderMetaEvaluationScorecard(evalData);
    });

    this.orchestrator.on('artifact_generated', artifact => {
      if (artifact.stage === "code" || artifact.stage === "security_code") {
        if (this.cockpitCodeContent) {
          this.cockpitCodeContent.innerText = artifact.data || "";
        }
      }
    });

    this.orchestrator.on('stage_change', stage => {
      let tag = "code";
      if (stage.stageId.includes("review")) tag = "review";
      else if (stage.stageId.includes("devops")) tag = "deploy";
      else if (stage.stageId.includes("security")) tag = "security";
      else if (stage.stageId.includes("ceo")) tag = "system";
      
      this.appendTerminalLog(tag, `📍 [SDLC] ${stage.stageName}`);
      if (this.canvasEngine) {
        this.canvasEngine.setAgentTarget(stage.activeAgent, stage.zone);
      }
      this.highlightActiveAgentCard(stage.activeAgent, stage.stageName);

      // Update Security & QA Badges
      if (stage.stageId === "testing" && this.secStatusSandbox) {
        this.secStatusSandbox.textContent = "● Uji Unit & DOM Lolos (Sandbox)";
        this.secStatusSandbox.style.color = "#10b981";
      }
      if (stage.stageId === "security" && this.secStatusPentest) {
        this.secStatusPentest.textContent = "● 0 Vulnerabilities (SAST Cleared)";
        this.secStatusPentest.style.color = "#10b981";
      }
      if (stage.stageId === "review" && this.secStatusPRD) {
        this.secStatusPRD.textContent = "● 100% PRD Strict Compliance";
        this.secStatusPRD.style.color = "#10b981";
      }
      if (stage.stageId === "devops" && this.secStatusArthur) {
        this.secStatusArthur.textContent = "● Disetujui untuk Rilis Production";
        this.secStatusArthur.style.color = "#10b981";
      }

      // Update Live Progress Bar
      const pct = stage.progressPercent || 10;
      if (this.progressBarFill) this.progressBarFill.style.width = `${pct}%`;
      if (this.progressPercentageDisplay) this.progressPercentageDisplay.textContent = `${pct}%`;
      if (this.currentStageText) this.currentStageText.textContent = stage.stageName;

      if (stage.stageId === "security_revision" || stage.stageId === "security_passed") {
        if (this.securityPatchBadge) this.securityPatchBadge.style.display = "inline-flex";
      }

      this.updateStepChips(stage.stageId);
    });

    this.orchestrator.on('sdlc_complete', res => {
      if (this.startBtn) {
        this.startBtn.disabled = false;
        this.startBtn.innerHTML = `<span>🚀 Mulai Siklus SDLC</span>`;
      }
      this.appendTerminalLog("system", `🎉 [SDLC SELESAI] Terbackup di GitHub & Terdeploy live di Vercel.`);
      if (this.canvasEngine) {
        this.canvasEngine.showSpeechBubble("manager", "Proyek selesai 100%! Seluruh kode & audit telah diverifikasi.", true);
        this.canvasEngine.unlockAllAgents();
      }

      if (this.progressBarFill) this.progressBarFill.style.width = `100%`;
      if (this.progressPercentageDisplay) this.progressPercentageDisplay.textContent = `100%`;
      if (this.currentStageText) this.currentStageText.textContent = `✅ Proyek 100% Selesai & Terdeploy Live`;

      for (let i = 0; i <= 8; i++) {
        const chip = document.getElementById(`step-${i}`);
        if (chip) chip.className = "milestone-step-chip done";
      }

      if (res.analytics) {
        this.updateAnalyticsUI(res.analytics);
      }
    });

    this.orchestrator.on('sdlc_error', err => {
      if (this.startBtn) {
        this.startBtn.disabled = false;
        this.startBtn.innerHTML = `<span>🚀 Mulai Siklus SDLC</span>`;
      }
      this.appendTerminalLog("security", `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      this.appendTerminalLog("security", `❌ [SDLC PIPELINE ERROR TERDETEKSI]`);
      this.appendTerminalLog("security", `📍 Tahap : ${err.stage || 'Pipeline SDLC'}`);
      this.appendTerminalLog("security", `⚠️ Pesan : ${err.error || 'Terjadi kendala teknis'}`);
      if (err.stack) {
        this.appendTerminalLog("security", `🔍 Detail: ${err.stack}`);
      }
      this.appendTerminalLog("security", `💡 Tips  : Klik tombol '📋 Salin Log' di atas lalu kirimkan ke AI.`);
      this.appendTerminalLog("security", `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      
      if (this.canvasEngine) {
        this.canvasEngine.unlockAllAgents();
      }
      if (this.currentStageText) {
        this.currentStageText.textContent = `⚠️ Error pada ${err.stage || 'SDLC'}: ${err.error || 'Periksa log'}`;
      }
    });
  }

  // ===========================================================================
  // 💬 Dialogue Sidebar & Fast-Track Consultation Engine
  // ===========================================================================

  toggleDialogueSidebar(open) {
    this.isSidebarOpen = true;
    if (this.sidebarChatInput) {
      this.sidebarChatInput.focus();
    }
  }

  appendDialogueMessage(dialogue) {
    if (!dialogue || !dialogue.message) return;
    
    if (!dialogue.timestamp) {
      dialogue.timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    this.dialogueHistory.push(dialogue);

    if (!this.isSidebarOpen) {
      this.unreadDialogueCount++;
      if (this.dialogueUnreadBadge) {
        this.dialogueUnreadBadge.style.display = 'inline-block';
        this.dialogueUnreadBadge.textContent = this.unreadDialogueCount;
      }
    }

    const emptyState = this.dialogueFeedList ? this.dialogueFeedList.querySelector('.dialogue-empty-state') : null;
    if (emptyState) {
      emptyState.remove();
    }

    if (this._matchesDialogueFilter(dialogue, this.activeDialogueFilter)) {
      this._renderSingleDialogueCard(dialogue);
    }
  }

  _renderSingleDialogueCard(dialogue) {
    if (!this.dialogueFeedList) return;

    const card = document.createElement('div');
    card.className = 'dialogue-msg-card';
    card.style.borderLeftColor = dialogue.color || '#3b82f6';
    card.setAttribute('data-stage-type', this._categorizeStage(dialogue.stage));

    card.innerHTML = `
      <div class="msg-header">
        <div class="msg-author-info">
          <span class="msg-avatar">${dialogue.avatar || '👤'}</span>
          <span class="msg-author-name">${dialogue.name || 'Agent'}</span>
          <span class="msg-role-tag">${dialogue.role || 'Staff'}</span>
        </div>
        <span class="msg-timestamp">${dialogue.timestamp}</span>
      </div>
      <div class="msg-stage-badge">${dialogue.stage || 'SDLC'}</div>
      <div class="msg-text-bubble">${(dialogue.message || '').replace(/\n/g, '<br>')}</div>
    `;

    this.dialogueFeedList.appendChild(card);
    this.dialogueFeedList.scrollTop = this.dialogueFeedList.scrollHeight;
  }

  _categorizeStage(stageName) {
    const s = (stageName || "").toLowerCase();
    if (s.includes('eksekutif') || s.includes('konsultasi') || s.includes('executive')) return 'executive';
    if (s.includes('war room') || s.includes('debate')) return 'debate';
    if (s.includes('coding') || s.includes('modular') || s.includes('architect') || s.includes('planning') || s.includes('triage') || s.includes('research')) return 'engineering';
    if (s.includes('qa') || s.includes('testing') || s.includes('security') || s.includes('review') || s.includes('devops')) return 'qa_sec';
    return 'other';
  }

  _matchesDialogueFilter(dialogue, filterType) {
    if (filterType === 'all') return true;
    if (filterType === 'executive') {
      const stage = (dialogue.stage || "").toLowerCase();
      return stage.includes('eksekutif') || 
             stage.includes('konsultasi') ||
             dialogue.agentId === "user" ||
             dialogue.agentId === "manager" ||
             dialogue.agentId === "optimizer";
    }
    const cat = this._categorizeStage(dialogue.stage);
    return cat === filterType;
  }

  renderFilteredDialogues() {
    if (this.sidebarChatDock) {
      this.sidebarChatDock.style.display = (this.activeDialogueFilter === 'executive') ? 'flex' : 'none';
    }

    if (!this.dialogueFeedList) return;
    this.dialogueFeedList.innerHTML = "";

    const filtered = this.dialogueHistory.filter(d => this._matchesDialogueFilter(d, this.activeDialogueFilter));
    if (filtered.length === 0) {
      const isExec = this.activeDialogueFilter === 'executive';
      this.dialogueFeedList.innerHTML = `
        <div class="dialogue-empty-state">
          <span style="font-size: 24px;">${isExec ? '👑' : '🔍'}</span>
          <p>${isExec ? 'Belum ada percakapan di Ruang Eksekutif.<br>Ketik ide Anda di bawah untuk berdiskusi langsung dengan Arthur & Elena!' : 'Tidak ada percakapan pada kategori ini.'}</p>
        </div>
      `;
      return;
    }

    filtered.forEach(d => this._renderSingleDialogueCard(d));
  }

  renderMetaEvaluationScorecard(metrics) {
    if (!this.sidebarScorecard) return;
    this.sidebarScorecard.style.display = 'block';

    if (this.scorecardScoreBadge) {
      this.scorecardScoreBadge.textContent = `${metrics.promptAdherence}% Match`;
    }

    if (this.scorecardMetrics) {
      this.scorecardMetrics.innerHTML = `
        <div>🛡️ <strong>Keamanan:</strong> ${metrics.securityCompliance}</div>
        <div>🔍 <strong>Kepatuhan PRD:</strong> ${metrics.prdStrictness}</div>
        <div>📐 <strong>Arsitektur:</strong> ${metrics.architectureRating}</div>
        <div>💻 <strong>Estetika UI:</strong> ${metrics.uiAestheticScore}</div>
        <div>🧪 <strong>QA Sandbox:</strong> ${metrics.testingResilience}</div>
        <div>🚀 <strong>Rilis:</strong> ${metrics.rolloutSafety}</div>
        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08); font-style: italic; color: #cbd5e1;">
          "${metrics.summary}"
        </div>
      `;
    }
  }

  exportDialogueJson() {
    const exportData = {
      exportedAt: new Date().toISOString(),
      activeProject: this.promptInput ? this.promptInput.value : "Unknown",
      totalDialogues: this.dialogueHistory.length,
      dialogues: this.dialogueHistory,
      metaEvaluation: this.orchestrator.projectArtifacts ? this.orchestrator.projectArtifacts.metaEvaluation : null
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixeloffice_dialogue_log_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  clearDialogueFeed() {
    this.dialogueHistory = [];
    if (this.dialogueFeedList) {
      this.dialogueFeedList.innerHTML = `
        <div class="dialogue-empty-state">
          <span style="font-size: 28px;">👑</span>
          <p>Log percakapan dibersihkan.<br>Ketik ide Anda di bawah untuk memulai diskusi baru di Ruang Eksekutif.</p>
        </div>
      `;
    }
    if (this.sidebarScorecard) {
      this.sidebarScorecard.style.display = 'none';
    }
    if (this.dealConsensusCard) {
      this.dealConsensusCard.style.display = 'none';
    }
  }

  // -------------------------------------------------------------
  // Fast-Track Interactive Consultation in Ruang Eksekutif
  // -------------------------------------------------------------
  async startSidebarConsultation(rawPrompt) {
    const text = (rawPrompt || "").trim();
    if (!text) return;

    this.activeDialogueFilter = 'executive';
    if (this.dialogueFilterChips) {
      this.dialogueFilterChips.forEach(c => {
        if (c.getAttribute('data-filter') === 'executive') c.classList.add('active');
        else c.classList.remove('active');
      });
    }

    this.appendDialogueMessage({
      agentId: "user",
      name: "Bos @I-Shen",
      role: "CEO / Klien",
      avatar: "👤",
      color: "#38bdf8",
      stage: "Ruang Eksekutif",
      message: text
    });

    if (this.canvasEngine) {
      this.canvasEngine.setAgentTarget("manager", "executive");
      this.canvasEngine.setAgentTarget("optimizer", "executive");
      this.canvasEngine.showSpeechBubble("manager", "Arthur: Membuka sesi konsultasi di Ruang Eksekutif...", true);
    }

    try {
      const response = await this.advisor.startConsultation(text);
      this.appendDialogueMessage({
        agentId: "manager",
        name: "Arthur Vance & Dr. Elena Rostova",
        role: "Executive Advisor",
        avatar: "👑",
        color: "#f59e0b",
        stage: "Ruang Eksekutif",
        message: response.reply
      });

      if (this.canvasEngine) {
        this.canvasEngine.showSpeechBubble("optimizer", "Dr. Elena: Menilai spesifikasi & arsitektur proyek.", true);
      }

      if (response.isDeal) {
        this.showDealConsensusCard(response);
      }
    } catch (e) {
      console.error("[Sidebar Consultation Error]", e);
    }
  }

  async handleSendSidebarChat() {
    if (!this.sidebarChatInput) return;
    const text = this.sidebarChatInput.value.trim();
    if (!text) return;

    this.sidebarChatInput.value = "";
    this.sidebarSendChatBtn.disabled = true;
    this.sidebarSendChatBtn.innerText = "⏳...";

    // Switch to executive view if not already
    this.activeDialogueFilter = 'executive';
    if (this.dialogueFilterChips) {
      this.dialogueFilterChips.forEach(c => {
        if (c.getAttribute('data-filter') === 'executive') c.classList.add('active');
        else c.classList.remove('active');
      });
    }

    this.appendDialogueMessage({
      agentId: "user",
      name: "Bos @I-Shen",
      role: "CEO / Klien",
      avatar: "👤",
      color: "#38bdf8",
      stage: "Ruang Eksekutif",
      message: text
    });

    if (this.canvasEngine) {
      this.canvasEngine.setAgentTarget("manager", "executive");
      this.canvasEngine.setAgentTarget("optimizer", "executive");
      this.canvasEngine.showSpeechBubble("manager", "Arthur: Menganalisis instruksi di Ruang Eksekutif...", true);
    }

    try {
      const response = await this.advisor.sendMessage(text);
      this.appendDialogueMessage({
        agentId: "manager",
        name: "Arthur Vance & Dr. Elena Rostova",
        role: "Executive Advisor",
        avatar: "👑",
        color: "#f59e0b",
        stage: "Ruang Eksekutif",
        message: response.reply
      });

      if (this.canvasEngine) {
        this.canvasEngine.showSpeechBubble("manager", "Arthur: Analisis selesai! Klik 'Mulai SDLC' untuk eksekusi tim.", true);
        this.canvasEngine.showSpeechBubble("optimizer", "Dr. Elena: PRD Emas siap dieksekusi tim.", true);
      }

      if (response.isDeal) {
        this.showDealConsensusCard(response);
      }
    } catch (e) {
      console.error("[Send Sidebar Chat Error]", e);
    } finally {
      this.sidebarSendChatBtn.disabled = false;
      this.sidebarSendChatBtn.innerText = "💬 Kirim";
    }
  }

  showDealConsensusCard(response) {
    if (!this.dealConsensusCard) return;
    this.dealConsensusCard.style.display = 'flex';

    if (this.dealSummaryText) {
      this.dealSummaryText.innerHTML = `
        <strong>🏆 Konsensus Tercapai (Skor 100/100 Emas)!</strong><br>
        Arthur Vance & Dr. Elena Rostova telah merumuskan PRD Emas siap eksekusi.
      `;
    }

    if (this.dealMasterPromptText && response && response.masterPrompt) {
      this.dealMasterPromptText.textContent = response.masterPrompt;
    }

    if (response && response.masterPrompt && this.promptInput) {
      this.promptInput.value = response.masterPrompt;
      if (this.scoreValue) this.scoreValue.textContent = "100";
    }
  }

  // -------------------------------------------------------------
  // Audit Prompt Mandiri & SDLC Pipeline Execution
  // -------------------------------------------------------------
  async handleAuditPrompt() {
    const rawText = this.promptInput.value.trim();
    if (!rawText) {
      alert("Silakan ketikkan prompt atau kebutuhan aplikasi terlebih dahulu!");
      return;
    }

    this.auditBtn.disabled = true;
    this.auditBtn.innerHTML = `✨ Menganalisis...`;
    this.appendTerminalLog("system", `🔍 [Elena] Memulai audit mutu & formulasi PRD Emas 100/100...`);

    if (this.canvasEngine) {
      this.canvasEngine.setAgentTarget("optimizer", "executive");
      this.canvasEngine.showSpeechBubble("optimizer", "Menganalisis mutu prompt teknis...", true);
    }
    this.highlightActiveAgentCard("optimizer", "Audit Prompt");

    try {
      const result = await this.optimizer.optimizePrompt(rawText);
      if (this.scoreValue) this.scoreValue.textContent = result.score;
      if (result.optimizedPromptText) {
        this.promptInput.value = result.optimizedPromptText;
      }
      this.appendTerminalLog("system", `📊 [Audit Mutu Prompt] Skor: ${result.score}/100 [${result.grade}]`);

      this.appendDialogueMessage({
        agentId: "optimizer",
        name: "Dr. Elena Rostova",
        role: "PRD Architect",
        avatar: "🔍",
        color: "#8b5cf6",
        stage: "Ruang Eksekutif",
        message: `Audit Prompt Selesai. Skor Mutu: ${result.score}/100 [${result.grade}]. PRD master telah siap disalurkan ke pipeline SDLC.`
      });

      if (this.canvasEngine) {
        this.canvasEngine.showSpeechBubble("optimizer", `Skor Mutu: ${result.score}/100 (${result.grade})`, true);
      }
    } catch (err) {
      console.error("[Audit Prompt Error]", err);
      this.appendTerminalLog("security", `⚠️ Gagal audit prompt: ${err.message || String(err)}`);
    } finally {
      this.auditBtn.disabled = false;
      this.auditBtn.innerHTML = `✨ Audit Prompt (<span id="promptScoreValue" style="color: #10b981; font-weight: bold;">${this.scoreValue ? this.scoreValue.textContent : '100'}</span>)`;
    }
  }

  async handleStartSDLC(customPrompt = null) {
    let rawText = customPrompt || (this.advisor && this.advisor.masterPrompt) || (this.promptInput ? this.promptInput.value.trim() : "");
    if (!rawText && this.advisor && this.advisor.currentDiscussionPrompt) {
      rawText = this.advisor.currentDiscussionPrompt;
    }
    if (!rawText) {
      const lastUserMsg = [...this.dialogueHistory].reverse().find(d => d.agentId === "user");
      if (lastUserMsg && lastUserMsg.message) {
        rawText = lastUserMsg.message;
      }
    }
    if (!rawText) {
      alert("Silakan diskusikan kebutuhan proyek Anda di Ruang Eksekutif terlebih dahulu!");
      return;
    }

    if (this.dealConsensusCard) {
      this.dealConsensusCard.style.display = 'none';
    }

    if (this.startBtn) {
      this.startBtn.disabled = true;
      this.startBtn.innerHTML = `<span>⏳ SDLC Berjalan...</span>`;
    }
    if (this.progressBarFill) this.progressBarFill.style.width = "5%";
    if (this.progressPercentageDisplay) this.progressPercentageDisplay.textContent = "5%";
    if (this.currentStageText) this.currentStageText.textContent = "Inisialisasi Tim & Meta-Prompt...";

    await this.orchestrator.runFullSDLC(rawText);
  }

  updateStepChips(stageId) {
    const stageMap = {
      "triage": 0,
      "planning": 1,
      "research": 2,
      "debate": 3,
      "coding": 4,
      "testing": 5,
      "security": 6,
      "security_revision": 6,
      "security_passed": 6,
      "review": 7,
      "ceo_gate": 8,
      "devops": 8,
      "complete": 8
    };

    const currentStepIndex = stageMap[stageId] ?? 0;

    for (let i = 0; i <= 8; i++) {
      const chip = document.getElementById(`step-${i}`);
      if (!chip) continue;

      if (i < currentStepIndex) {
        chip.className = "milestone-step-chip done";
      } else if (i === currentStepIndex) {
        chip.className = "milestone-step-chip active";
      } else {
        chip.className = "milestone-step-chip";
      }
    }
  }

  updateAnalyticsUI(metrics) {
    if (!metrics) return;
    if (this.analyticsTotalTokens) this.analyticsTotalTokens.textContent = metrics.formattedTokens;
    if (this.analyticsCostSaved) this.analyticsCostSaved.textContent = metrics.formattedSavings;
  }

  renderKanbanList(projects) {
    if (!this.kanbanListContainer) return;
    this.kanbanListContainer.innerHTML = "";

    projects.forEach(p => {
      const item = document.createElement('div');
      item.className = `kanban-item ${p.status}`;
      item.innerHTML = `
        <div style="display: flex; flex-direction: column; min-width: 0;">
          <span style="font-size: 10px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</span>
          <span style="font-size: 8.5px; color: #94a3b8;">${p.createdAt} • ${p.status.toUpperCase()}</span>
        </div>
        <span class="priority-badge priority-${p.priority.toLowerCase()}">${p.priority}</span>
      `;
      item.addEventListener('click', () => {
        if (this.promptInput) this.promptInput.value = p.prompt;
        this.handleAuditPrompt();
      });
      this.kanbanListContainer.appendChild(item);
    });
  }

  renderAgentCards() {
    const list = document.getElementById('agentListContainer');
    if (!list) return;
    list.innerHTML = "";

    CONFIG.agents.forEach(agent => {
      const card = document.createElement('div');
      card.className = 'agent-card';
      card.id = `agent-card-${agent.id}`;
      const shortRole = agent.role.split('&')[0].trim();
      card.innerHTML = `
        <div class="agent-avatar" style="border-color: ${agent.color}; color: ${agent.color}">${agent.avatar}</div>
        <div class="agent-info">
          <div class="agent-meta">
            <div class="agent-name" title="${agent.name} (${agent.exp})">${agent.name}</div>
            <div class="agent-role" title="${agent.role}">${shortRole}</div>
          </div>
          <div class="agent-activity-status" id="status-${agent.id}">
            <span>●</span> Standby
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  }

  highlightActiveAgentCard(agentId, taskName = "Bertugas") {
    document.querySelectorAll('.agent-card').forEach(c => c.classList.remove('active'));
    const target = document.getElementById(`agent-card-${agentId}`);
    if (target) {
      target.classList.add('active');
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const status = document.getElementById(`status-${agentId}`);
      if (status) status.innerHTML = `<span style="color: #10b981">●</span> Sedang ${taskName.slice(0, 18)}`;
    }
  }

  appendTerminalLog(tag, message) {
    if (!this.terminalOutput) return;
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    const time = new Date().toTimeString().split(' ')[0];
    let tagHtml = `<span class="log-tag-${tag}">[${tag.toUpperCase()}]</span>`;
    
    entry.innerHTML = `<span class="log-time">${time}</span> ${tagHtml} ${message}`;
    this.terminalOutput.appendChild(entry);
    this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
  }

  // -------------------------------------------------------------
  // Digital Clock & Canvas Fullscreen Controller
  // -------------------------------------------------------------
  initDigitalClock() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const dayName = days[now.getDay()];
    const dateNum = String(now.getDate()).padStart(2, '0');
    const monthName = months[now.getMonth()];
    const yearNum = now.getFullYear();

    const formattedDate = `${dayName}, ${dateNum} ${monthName} ${yearNum}`;

    const hoursElem = document.getElementById('clockHours');
    const minutesElem = document.getElementById('clockMinutes');
    const secondsElem = document.getElementById('clockSeconds');
    const dateTextElem = document.getElementById('clockDateText');

    if (hoursElem) hoursElem.textContent = h;
    if (minutesElem) minutesElem.textContent = m;
    if (secondsElem) secondsElem.textContent = `:${s}`;
    if (dateTextElem) dateTextElem.textContent = formattedDate;
  }

  toggleCanvasFullscreen(forceState = null) {
    const wrapper = document.querySelector('.canvas-wrapper');
    const fsText = document.getElementById('fullscreenText');
    const fsIcon = document.getElementById('fullscreenIcon');
    if (!wrapper) return;

    const shouldBeFs = forceState !== null ? forceState : !wrapper.classList.contains('is-fullscreen');

    if (shouldBeFs) {
      wrapper.classList.add('is-fullscreen');
      if (fsText) fsText.textContent = "Keluar Fullscreen";
      if (fsIcon) fsIcon.textContent = "✕";

      if (!document.getElementById('floatingExitFullscreenBtn')) {
        const exitBtn = document.createElement('button');
        exitBtn.id = 'floatingExitFullscreenBtn';
        exitBtn.className = 'btn-exit-fullscreen';
        exitBtn.innerHTML = '✕ Keluar Layar Penuh (ESC)';
        exitBtn.style.cssText = 'position:fixed;top:16px;right:20px;z-index:100001;background:rgba(220,38,38,0.9);color:#fff;border:1px solid #f87171;padding:8px 16px;border-radius:8px;font-family:monospace;font-size:12px;font-weight:bold;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.6);backdrop-filter:blur(8px);';
        exitBtn.onclick = () => this.toggleCanvasFullscreen(false);
        document.body.appendChild(exitBtn);
      }
    } else {
      wrapper.classList.remove('is-fullscreen');
      if (fsText) fsText.textContent = "Fullscreen Ruangan";
      if (fsIcon) fsIcon.textContent = "⛶";

      const exitBtn = document.getElementById('floatingExitFullscreenBtn');
      if (exitBtn) exitBtn.remove();
    }
  }
}

function initApp() {
  if (!window.pixelOfficeApp) {
    try {
      window.pixelOfficeApp = new PixelOfficeApp();
    } catch (err) {
      console.error("[PixelOfficeApp Init Error]", err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
