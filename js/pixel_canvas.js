/**
 * PixelOffice AI Software House - Command Center Canvas Engine
 * Silicon Valley / Californian Organic Architecture:
 * - Seamless fine-grain cream terrazzo stone & curved caramel oak pods.
 * - Centerpiece Aquascape Aquarium with autonomous swimming tropical fish & oxygen bubbles.
 * - Autonomous Software Engineering Senior Personas & Roaming Mascot Cat.
 */

import { CONFIG } from './config.js';

export class PixelOfficeCanvas {
  constructor(canvasElement, bubbleContainerElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.bubbleContainer = bubbleContainerElement;
    
    // Widescreen High-Resolution Coordinate System
    this.width = 1200;
    this.height = 560;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Senior Agent Profiles
    const agentProfiles = {
      manager:   { hairColor: "#451a03", hairStyle: "short", shirtColor: "#2563eb", pantsColor: "#1e293b", accessory: "tie" },
      optimizer: { hairColor: "#7c2d12", hairStyle: "ponytail", shirtColor: "#8b5cf6", pantsColor: "#334155", accessory: "glasses" },
      planner:   { hairColor: "#172554", hairStyle: "messy", shirtColor: "#db2777", pantsColor: "#1e293b", accessory: "badge" },
      researcher:{ hairColor: "#78350f", hairStyle: "curly", shirtColor: "#9333ea", pantsColor: "#334155", accessory: "glasses" },
      architect: { hairColor: "#0f172a", hairStyle: "sleek", shirtColor: "#0284c7", pantsColor: "#1e293b", accessory: "tablet" },
      coder:     { hairColor: "#18181b", hairStyle: "spiky", shirtColor: "#059669", pantsColor: "#1e293b", accessory: "headphones" },
      qa:        { hairColor: "#b45309", hairStyle: "bob", shirtColor: "#d97706", pantsColor: "#334155", accessory: "checklist" },
      security:  { hairColor: "#1e293b", hairStyle: "buzz", shirtColor: "#dc2626", pantsColor: "#0f172a", accessory: "visor" },
      reviewer:  { hairColor: "#831843", hairStyle: "bun", shirtColor: "#e11d48", pantsColor: "#1e293b", accessory: "glasses" },
      devops:    { hairColor: "#1e3a8a", hairStyle: "short", shirtColor: "#0d9488", pantsColor: "#1e293b", accessory: "rocket" }
    };

    this.agents = CONFIG.agents.map(a => {
      const prof = agentProfiles[a.id] || { hairColor: "#334155", hairStyle: "short", shirtColor: "#3b82f6", pantsColor: "#1e293b", accessory: "none" };
      return {
        ...a,
        ...prof,
        x: a.deskX,
        y: a.deskY,
        targetX: a.deskX,
        targetY: a.deskY,
        state: "sitting",
        facing: "down",
        animFrame: 0,
        hasCoffee: false,
        isTaskLocked: false,
        emote: null,
        emoteTimer: 0
      };
    });

    // Centerpiece Aquarium Setup & Tropical Fish
    this.aquarium = {
      x: 530,
      y: 232,
      w: 140,
      h: 38
    };

    this.fishes = [
      { x: 550, y: 242, speed: 0.8, color: "#38bdf8", tailColor: "#ef4444", size: 6, dir: 1, offset: 0 },
      { x: 620, y: 252, speed: 0.5, color: "#f59e0b", tailColor: "#fde047", size: 7, dir: -1, offset: 2 },
      { x: 580, y: 247, speed: 1.0, color: "#ec4899", tailColor: "#a855f7", size: 5, dir: 1, offset: 4 },
      { x: 645, y: 240, speed: 0.6, color: "#34d399", tailColor: "#10b981", size: 6, dir: -1, offset: 1 },
      { x: 565, y: 256, speed: 0.7, color: "#60a5fa", tailColor: "#3b82f6", size: 5, dir: 1, offset: 3 }
    ];

    // Autonomous Roaming Mascot Cat
    this.cat = {
      x: 720,
      y: 155,
      targetX: 720,
      targetY: 155,
      state: "sitting",
      facing: "right",
      animFrame: 0,
      tailTick: 0,
      heartTimer: 0,
      emote: null,
      idleTimer: 0
    };

    // Clocks
    this.tick = 0;
    this.cloudOffset = 0;
    this.serverLightTick = 0;
    this.coffeeSteamTick = 0;
    this.musicNoteTick = 0;
    this.bubbleTick = 0;

    this.initCanvasInteractions();
    this.startRenderLoop();
    this.startAutonomousRoutines();
    this.startCatRoamingAI();
  }

  initCanvasInteractions() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      // Click on cat
      const distToCat = Math.hypot(clickX - this.cat.x, clickY - this.cat.y);
      if (distToCat < 40) {
        this.petCat("User (Bos @I-Shen)");
        return;
      }

      // Click on aquarium to feed fish!
      if (clickX >= this.aquarium.x && clickX <= this.aquarium.x + this.aquarium.w &&
          clickY >= this.aquarium.y && clickY <= this.aquarium.y + this.aquarium.h) {
        this.feedFish();
      }
    });
  }

  feedFish() {
    const bubble = document.createElement('div');
    bubble.className = 'pixel-speech-bubble';
    bubble.style.borderColor = '#0284c7';
    bubble.innerHTML = `
      <div class="bubble-author" style="color: #0284c7;">🐠 AQUASCAPE KANTOR</div>
      <div class="bubble-content">Memberi makan ikan! (Ikan-ikan berkumpul riang 🫧)</div>
    `;
    bubble.style.left = `50%`;
    bubble.style.top = `38%`;
    this.bubbleContainer.appendChild(bubble);

    // Scatter fishes happily
    this.fishes.forEach(f => {
      f.dir = Math.random() > 0.5 ? 1 : -1;
      f.speed = 1.4;
      setTimeout(() => { f.speed = 0.6 + Math.random() * 0.4; }, 4000);
    });

    setTimeout(() => { if (bubble.parentNode) bubble.remove(); }, 3500);
  }

  petCat(petterName = "Seseorang") {
    this.cat.state = "being_pet";
    this.cat.heartTimer = 120;
    this.cat.emote = "💖";

    const existing = document.getElementById('bubble-cat');
    if (existing) existing.remove();

    const bubble = document.createElement('div');
    bubble.id = 'bubble-cat';
    bubble.className = 'pixel-speech-bubble';
    bubble.style.borderColor = '#ea580c';
    bubble.innerHTML = `
      <div class="bubble-author" style="color: #ea580c;">🐱 PIXEL THE CAT</div>
      <div class="bubble-content">Purrr... Meong! 💖 (Dielus oleh ${petterName})</div>
    `;

    const percentX = (this.cat.x / this.width) * 100;
    const percentY = ((this.cat.y - 28) / this.height) * 100;
    bubble.style.left = `${Math.min(Math.max(percentX, 6), 92)}%`;
    bubble.style.top = `${Math.min(Math.max(percentY, 4), 86)}%`;

    this.bubbleContainer.appendChild(bubble);

    setTimeout(() => {
      if (bubble.parentNode) bubble.remove();
      if (this.cat.state === "being_pet") this.cat.state = "sitting";
    }, 3800);
  }

  setAgentTarget(agentId, targetZoneName, actionState = "walking") {
    const agent = this.agents.find(a => a.id === agentId);
    if (!agent) return;

    agent.isTaskLocked = true;
    agent.hasCoffee = false;
    agent.emote = "idea";
    agent.emoteTimer = 80;

    let targetX = agent.deskX;
    let targetY = agent.deskY;

    if (targetZoneName === "meeting") {
      const meetingOffsets = [
        { x: 920, y: 115 }, { x: 970, y: 115 }, { x: 1020, y: 115 }, { x: 1070, y: 115 },
        { x: 920, y: 165 }, { x: 970, y: 165 }, { x: 1020, y: 165 }, { x: 1070, y: 165 }
      ];
      const offset = meetingOffsets[Math.floor(Math.random() * meetingOffsets.length)];
      targetX = offset.x;
      targetY = offset.y;
    } else if (targetZoneName === "pantry") {
      targetX = 580 + Math.floor(Math.random() * 160);
      targetY = 110 + Math.floor(Math.random() * 50);
    } else if (targetZoneName === "bullpen") {
      targetX = agent.deskX;
      targetY = agent.deskY;
    } else if (targetZoneName === "server") {
      targetX = agent.deskX;
      targetY = agent.deskY;
    } else if (targetZoneName === "executive") {
      targetX = agent.deskX;
      targetY = agent.deskY;
    }

    agent.targetX = targetX;
    agent.targetY = targetY;
    agent.state = actionState;
  }

  unlockAllAgents() {
    this.agents.forEach(a => {
      a.isTaskLocked = false;
      a.targetX = a.deskX;
      a.targetY = a.deskY;
      a.emote = null;
    });
  }

  startCatRoamingAI() {
    const catDestinations = [
      { x: 690, y: 155, state: "sleeping" },
      { x: 750, y: 145, state: "sitting" },
      { x: 590, y: 115, state: "sitting" },
      { x: 600, y: 285, state: "sitting" },  // Watching the aquarium!
      { x: 140, y: 150, state: "walking" },
      { x: 380, y: 150, state: "sitting" },
      { x: 270, y: 400, state: "sitting" },
      { x: 860, y: 400, state: "walking" },
      { x: 980, y: 150, state: "sitting" }
    ];

    setInterval(() => {
      if (this.cat.state === "being_pet") return;

      const dest = catDestinations[Math.floor(Math.random() * catDestinations.length)];
      this.cat.targetX = dest.x;
      this.cat.targetY = dest.y;
      this.cat.state = "walking";
      this.cat.facing = dest.x > this.cat.x ? "right" : "left";

      setTimeout(() => {
        if (this.cat.state !== "being_pet") {
          this.cat.state = dest.state;
          if (dest.state === "sleeping") {
            this.cat.emote = "zzz";
          }
        }
      }, 3500);
    }, 9000);
  }

  startAutonomousRoutines() {
    const coffeeQuotes = [
      "☕ Seduh espresso dobel hangat...",
      "☕ Aroma kopi latte bikin fokus!",
      "☕ Refill cappuccino creamy..."
    ];

    const petQuotes = [
      "🐱 Mengelus si Pixel... (Purrrr! 🐾)",
      "🐱 Kucing pintar teman koding!",
      "🐱 Pixel lagi santai di pod kayu, gemas!"
    ];

    const aquariumQuotes = [
      "🐠 Melihat ikan berenang bikin mata rileks...",
      "🐠 Aquascape kantor bikin pikiran jernih untuk koding!",
      "🐠 Stress hilang setelah lihat neon tetra berenang 🫧"
    ];

    const chatQuotes = [
      "💬 Diskusi arsitektur bareng rekan...",
      "💬 Review pull request sebentar...",
      "💬 Optimasi query bareng tim..."
    ];

    setInterval(() => {
      const idleAgents = this.agents.filter(a => !a.isTaskLocked && a.state === "sitting");
      if (idleAgents.length === 0) return;

      const agent = idleAgents[Math.floor(Math.random() * idleAgents.length)];
      const actionType = Math.floor(Math.random() * 4);

      if (actionType === 0) {
        // 1. Grab Coffee in Micro-Kitchen
        agent.targetX = 590 + Math.floor(Math.random() * 30);
        agent.targetY = 115;
        agent.state = "walking";
        agent.emote = "coffee";
        agent.emoteTimer = 100;
        this.showSpeechBubble(agent.id, coffeeQuotes[Math.floor(Math.random() * coffeeQuotes.length)]);

        setTimeout(() => {
          if (!agent.isTaskLocked) {
            agent.hasCoffee = true;
            agent.state = "coffee";
            setTimeout(() => {
              if (!agent.isTaskLocked) {
                agent.targetX = agent.deskX;
                agent.targetY = agent.deskY;
                agent.state = "walking";
                setTimeout(() => { agent.hasCoffee = false; }, 6000);
              }
            }, 4500);
          }
        }, 3000);

      } else if (actionType === 1) {
        // 2. Pet the Cat
        agent.targetX = this.cat.x + (this.cat.facing === "left" ? 22 : -22);
        agent.targetY = this.cat.y;
        agent.state = "walking";
        agent.emote = "heart";
        agent.emoteTimer = 110;

        setTimeout(() => {
          if (!agent.isTaskLocked) {
            agent.state = "petting";
            this.petCat(`${agent.name.split(' ')[0]}`);
            this.showSpeechBubble(agent.id, petQuotes[Math.floor(Math.random() * petQuotes.length)]);

            setTimeout(() => {
              if (!agent.isTaskLocked) {
                agent.targetX = agent.deskX;
                agent.targetY = agent.deskY;
                agent.state = "walking";
              }
            }, 4500);
          }
        }, 3000);

      } else if (actionType === 2) {
        // 3. Walk to Centerpiece Aquarium to relax
        agent.targetX = 600 + (Math.random() * 40 - 20);
        agent.targetY = 282;
        agent.state = "walking";
        agent.emote = "idea";
        agent.emoteTimer = 100;
        this.showSpeechBubble(agent.id, aquariumQuotes[Math.floor(Math.random() * aquariumQuotes.length)]);

        setTimeout(() => {
          if (!agent.isTaskLocked) {
            agent.state = "idle";
            setTimeout(() => {
              if (!agent.isTaskLocked) {
                agent.targetX = agent.deskX;
                agent.targetY = agent.deskY;
                agent.state = "walking";
              }
            }, 5000);
          }
        }, 3000);

      } else if (actionType === 3) {
        // 4. Collaborative chat
        const otherAgents = this.agents.filter(a => a.id !== agent.id && !a.isTaskLocked);
        if (otherAgents.length > 0) {
          const colleague = otherAgents[Math.floor(Math.random() * otherAgents.length)];
          agent.targetX = colleague.deskX + (Math.random() > 0.5 ? 26 : -26);
          agent.targetY = colleague.deskY;
          agent.state = "walking";
          agent.emote = "chat";
          agent.emoteTimer = 80;
          this.showSpeechBubble(agent.id, chatQuotes[Math.floor(Math.random() * chatQuotes.length)]);

          setTimeout(() => {
            if (!agent.isTaskLocked) {
              agent.state = "chatting";
              setTimeout(() => {
                if (!agent.isTaskLocked) {
                  agent.targetX = agent.deskX;
                  agent.targetY = agent.deskY;
                  agent.state = "walking";
                }
              }, 4500);
            }
          }, 3000);
        }
      }
    }, 7000);
  }

  showSpeechBubble(agentId, text) {
    const agent = this.agents.find(a => a.id === agentId);
    if (!agent) return;

    const existing = document.getElementById(`bubble-${agentId}`);
    if (existing) existing.remove();

    const authorName = agent.id === "optimizer" ? "Dr. Elena" : agent.name.split(' ')[0];

    const bubble = document.createElement('div');
    bubble.id = `bubble-${agentId}`;
    bubble.className = 'pixel-speech-bubble';
    bubble.innerHTML = `
      <div class="bubble-author">${authorName} • ${agent.role.split(' ')[0]}</div>
      <div class="bubble-content">${text}</div>
    `;

    const percentX = (agent.x / this.width) * 100;
    const percentY = ((agent.y - 32) / this.height) * 100;

    bubble.style.left = `${Math.min(Math.max(percentX, 5), 93)}%`;
    bubble.style.top = `${Math.min(Math.max(percentY, 4), 86)}%`;

    this.bubbleContainer.appendChild(bubble);

    setTimeout(() => {
      if (bubble.parentNode) bubble.remove();
    }, 4200);
  }

  startRenderLoop() {
    let lastTime = performance.now();

    const render = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      this.update(delta);
      this.draw();

      this.animationTimer = requestAnimationFrame(render);
    };

    this.animationTimer = requestAnimationFrame(render);
  }

  update(delta) {
    this.tick += delta * 0.002;
    this.serverLightTick += delta * 0.006;
    this.coffeeSteamTick += delta * 0.008;
    this.musicNoteTick += delta * 0.004;
    this.bubbleTick += delta * 0.01;
    this.cloudOffset = (this.cloudOffset + delta * 0.015) % 1200;

    // Update Fishes swimming
    const aqLeft = this.aquarium.x + 8;
    const aqRight = this.aquarium.x + this.aquarium.w - 12;
    this.fishes.forEach(f => {
      f.x += f.speed * f.dir;
      if (f.x > aqRight) {
        f.x = aqRight;
        f.dir = -1;
      } else if (f.x < aqLeft) {
        f.x = aqLeft;
        f.dir = 1;
      }
    });

    // Update cat movement
    if (this.cat.heartTimer > 0) this.cat.heartTimer -= 1;
    this.cat.tailTick += delta * 0.005;

    const cdx = this.cat.targetX - this.cat.x;
    const cdy = this.cat.targetY - this.cat.y;
    const cdist = Math.hypot(cdx, cdy);

    if (cdist > 2) {
      this.cat.x += (cdx / cdist) * Math.min(cdist, 1.8);
      this.cat.y += (cdy / cdist) * Math.min(cdist, 1.8);
      this.cat.state = "walking";
      this.cat.facing = cdx > 0 ? "right" : "left";
      this.cat.animFrame += 0.2;
    } else {
      this.cat.x = this.cat.targetX;
      this.cat.y = this.cat.targetY;
    }

    // Update agents
    this.agents.forEach(agent => {
      if (agent.emoteTimer > 0) agent.emoteTimer -= 1;
      else agent.emote = null;

      const dx = agent.targetX - agent.x;
      const dy = agent.targetY - agent.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 2) {
        agent.x += (dx / dist) * Math.min(dist, 2.3);
        agent.y += (dy / dist) * Math.min(dist, 2.3);
        agent.state = "walking";
        agent.facing = dx > 0 ? "right" : (dx < 0 ? "left" : (dy > 0 ? "down" : "up"));
        agent.animFrame += 0.22;
      } else {
        agent.x = agent.targetX;
        agent.y = agent.targetY;
        if (agent.state === "walking") {
          agent.state = (agent.x === agent.deskX && agent.y === agent.deskY) ? "sitting" : "idle";
        }
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this._drawLofiBackground();
    this._drawCalifornianTerrazzoFloor();
    this._drawCurvedCaramelOakIslands();
    this._drawZones();
    this._drawFurniture();
    this._drawCenterpieceAquarium();
    this._drawCatMascot();
    this._drawAgents();
    this._drawAtmosphereLighting();
  }

  _drawLofiBackground() {
    this.ctx.fillStyle = "#1e293b";
    this.ctx.fillRect(0, 0, this.width, 42);

    for (let wx = 80; wx < this.width - 100; wx += 220) {
      const winW = 160;
      const winH = 30;
      const winY = 6;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(wx, winY, winW, winH);
      this.ctx.clip();

      this.ctx.fillStyle = "#38bdf8";
      this.ctx.fillRect(wx, winY, winW, winH);

      const loopW = winW + 80;
      const cloudX = ((this.cloudOffset * 0.45) + (wx * 0.6)) % loopW - 40;

      this.ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
      this.ctx.fillRect(wx + cloudX, winY + 13, 34, 9);
      this.ctx.fillRect(wx + cloudX + 6, winY + 8, 22, 7);
      this.ctx.fillRect(wx + cloudX + 11, winY + 4, 12, 5);

      const cloud2X = (cloudX + 85) % loopW - 40;
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      this.ctx.fillRect(wx + cloud2X, winY + 16, 22, 6);
      this.ctx.fillRect(wx + cloud2X + 4, winY + 12, 14, 5);

      this.ctx.restore();

      this.ctx.strokeStyle = "#475569";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(wx, winY, winW, winH);

      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      this.ctx.beginPath();
      this.ctx.moveTo(wx + (winW / 2), winY);
      this.ctx.lineTo(wx + (winW / 2), winY + winH);
      this.ctx.stroke();
    }
  }

  _drawCalifornianTerrazzoFloor() {
    this.ctx.fillStyle = "#ede6dc";
    this.ctx.fillRect(0, 42, this.width, this.height - 42);

    this.ctx.fillStyle = "rgba(180, 150, 120, 0.18)";
    for (let y = 50; y < this.height; y += 18) {
      for (let x = 15; x < this.width; x += 22) {
        const offset = ((x * 7) + (y * 13)) % 5;
        this.ctx.fillRect(x + offset, y + (offset % 3), 2, 2);
      }
    }

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    for (let y = 60; y < this.height; y += 24) {
      for (let x = 25; x < this.width; x += 30) {
        const offset = ((x * 11) + (y * 5)) % 4;
        this.ctx.fillRect(x + offset, y + (offset % 2), 2, 2);
      }
    }
  }

  _drawCurvedCaramelOakIslands() {
    this._drawCurvedOakPod(50, 60, 200, 165, 20);
    this._drawCurvedOakPod(290, 60, 220, 165, 20);

    // Sunken Lounge & Coffee Pod
    this._drawCurvedOakPod(550, 60, 275, 165, 28);
    this.ctx.fillStyle = "#baa38a";
    this._drawRoundedRect(590, 110, 200, 95, 16, true, false);

    this._drawCurvedOakPod(865, 60, 280, 165, 20);
    this._drawCurvedOakPod(50, 280, 500, 230, 26);
    this._drawCurvedOakPod(590, 280, 560, 230, 26);
  }

  _drawCurvedOakPod(x, y, w, h, radius) {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    this._drawRoundedRect(x + 2, y + 4, w, h, radius, true, false);

    this.ctx.fillStyle = "#c89462";
    this._drawRoundedRect(x, y, w, h, radius, true, false);

    this.ctx.strokeStyle = "rgba(120, 65, 20, 0.12)";
    this.ctx.lineWidth = 1;
    for (let py = y + 16; py < y + h - 8; py += 16) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 12, py);
      this.ctx.lineTo(x + w - 12, py);
      this.ctx.stroke();
    }

    this.ctx.strokeStyle = "#ba834f";
    this._drawRoundedRect(x, y, w, h, radius, false, true);
  }

  _drawRoundedRect(x, y, w, h, r, fill = true, stroke = false) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
    this.ctx.closePath();
    if (fill) this.ctx.fill();
    if (stroke) this.ctx.stroke();
  }

  _drawZones() {
    this.ctx.font = "8px 'Press Start 2P', monospace, sans-serif";
    
    const podTagPositions = {
      executive: { centerX: 150, bottomY: 220 },
      planning:  { centerX: 400, bottomY: 220 },
      pantry:    { centerX: 687, bottomY: 220 },
      meeting:   { centerX: 1005, bottomY: 220 },
      bullpen:   { centerX: 300, bottomY: 504 },
      server:    { centerX: 870, bottomY: 504 }
    };

    Object.values(CONFIG.zones).forEach(zone => {
      const pos = podTagPositions[zone.id] || { centerX: zone.x + zone.width / 2, bottomY: zone.y + zone.height - 5 };
      const text = zone.name.toUpperCase();
      const textMetrics = this.ctx.measureText(text);
      const padding = 12;
      const bannerWidth = textMetrics.width + (padding * 2);
      const bannerHeight = 16;
      const bannerX = pos.centerX - (bannerWidth / 2);
      const bannerY = pos.bottomY - (bannerHeight / 2);

      // Shadow
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      this._drawRoundedRect(bannerX + 1, bannerY + 2, bannerWidth, bannerHeight, 5, true, false);

      // Glass Container
      this.ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
      this._drawRoundedRect(bannerX, bannerY, bannerWidth, bannerHeight, 5, true, false);

      // Accent Border
      this.ctx.strokeStyle = zone.color;
      this.ctx.lineWidth = 1;
      this._drawRoundedRect(bannerX, bannerY, bannerWidth, bannerHeight, 5, false, true);

      // Text
      this.ctx.fillStyle = zone.color;
      this.ctx.textAlign = "center";
      this.ctx.fillText(text, pos.centerX, bannerY + 11);
      this.ctx.textAlign = "start";
    });
  }

  _drawFurniture() {
    // 1. Executive Suite
    this._drawCalifornianOakDesk(100, 135);
    this._drawCalifornianOakDesk(190, 135);
    this._drawMonsteraPlant(50, 195);
    this._drawAcousticFocusBooth(238, 75); // Soundproof 1-person Focus Booth

    // 2. Planning & Tech Library
    this._drawCalifornianOakDesk(340, 135);
    this._drawCalifornianOakDesk(430, 135);
    this._drawOakBookshelf(295, 75);
    this._drawStickyWhiteboard(465, 75); // Glass Architecture Sprint Board

    // 3. Fuel Station Coffee Bar & Sunken Lounge
    this._drawCurvedOakCoffeeBar(565, 80); // Espresso + Cold Brew Tap
    this._drawSnackCorner(642, 80);
    this._drawWaterDispenser(785, 80);
    this._drawSunkenLoungeSofa(660, 135);
    this._drawLofiVinylPlayer(765, 85);
    this._drawCozyBeanbag(615, 170);
    this._drawMonsteraPlant(800, 195);

    // 4. War Room & Boardroom
    this._drawProjectorBigScreen(900, 70);
    this._drawOvalBoardroomTable(895, 130);

    // 5. Engineering Bullpen Workstations
    this._drawModernAppleDevStation(130, 370);
    this._drawModernAppleDevStation(270, 370);
    this._drawModernAppleDevStation(410, 370);
    this._drawMonsteraPlant(50, 480);
    this._drawDeskLamp(220, 340);

    // 6. Security Vault & DevOps Server Pod
    this._drawCiCdBeaconTower(580, 310); // CI/CD Build Light / Traffic Beacon Tower
    this._drawServerRackTowers(610, 300);
    this._drawModernAppleDevStation(720, 370);
    this._drawModernAppleDevStation(860, 370);
    this._drawModernAppleDevStation(1000, 370);
    this._drawServerRackTowers(1090, 300);
    this._drawServerRackTowers(1090, 380);
  }

  /**
   * Centerpiece Modern Aquascape Aquarium (Center Hallway)
   * With animated swimming tropical fishes, oxygen bubbles, and aquatic plants.
   */
  _drawCenterpieceAquarium() {
    const { x, y, w, h } = this.aquarium;

    // 1. Drop Shadow under aquarium
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    this._drawRoundedRect(x + 2, y + 4, w, h + 10, 8, true, false);

    // 2. Oak Stand Base
    this.ctx.fillStyle = "#a16207";
    this._drawRoundedRect(x - 4, y + h - 2, w + 8, 12, 4, true, false);
    this.ctx.strokeStyle = "#78350f";
    this._drawRoundedRect(x - 4, y + h - 2, w + 8, 12, 4, false, true);

    // 3. Crystal Clear Blue Water Tank
    const waterGrad = this.ctx.createLinearGradient(x, y, x, y + h);
    waterGrad.addColorStop(0, "rgba(56, 189, 248, 0.85)");
    waterGrad.addColorStop(1, "rgba(2, 132, 199, 0.95)");
    this.ctx.fillStyle = waterGrad;
    this._drawRoundedRect(x, y, w, h, 6, true, false);

    // 4. Substrate & Sand Layer at bottom
    this.ctx.fillStyle = "#78350f";
    this.ctx.fillRect(x + 4, y + h - 6, w - 8, 4);
    this.ctx.fillStyle = "#d97706";
    this.ctx.fillRect(x + 6, y + h - 8, w - 12, 3);

    // 5. Swaying Green Aquatic Plants
    const plantSway = Math.sin(this.tick * 4) * 2;
    this.ctx.fillStyle = "#059669";
    this.ctx.fillRect(x + 12, y + h - 18, 4, 11);
    this.ctx.fillRect(x + 10 + plantSway, y + h - 22, 6, 6);

    this.ctx.fillRect(x + 35, y + h - 16, 4, 9);
    this.ctx.fillRect(x + 33 - plantSway, y + h - 20, 6, 6);

    this.ctx.fillRect(x + w - 24, y + h - 19, 4, 12);
    this.ctx.fillRect(x + w - 26 + plantSway, y + h - 23, 6, 6);

    // 6. Animated Oxygen Bubbles Stream
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    for (let b = 0; b < 4; b++) {
      const bubbleY = (y + h - 8) - ((this.bubbleTick * 25 + (b * 9)) % (h - 10));
      const bubbleX = x + 25 + (Math.sin(bubbleY * 0.2) * 3);
      this.ctx.fillRect(bubbleX, bubbleY, 2, 2);
    }
    for (let b = 0; b < 3; b++) {
      const bubbleY = (y + h - 8) - ((this.bubbleTick * 20 + (b * 12)) % (h - 10));
      const bubbleX = x + w - 35 + (Math.sin(bubbleY * 0.2) * 2);
      this.ctx.fillRect(bubbleX, bubbleY, 2, 2);
    }

    // 7. Render Swimming Tropical Fishes
    this.fishes.forEach(f => {
      const waveY = Math.sin(this.tick * 6 + f.offset) * 1.5;
      const fishY = f.y + waveY;

      // Fish Body
      this.ctx.fillStyle = f.color;
      this.ctx.beginPath();
      this.ctx.ellipse(f.x, fishY, f.size, f.size / 2, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Fish Tail Fin (animated wiggle)
      const tailX = f.dir === 1 ? f.x - f.size : f.x + f.size;
      const tailWiggle = Math.sin(this.tick * 12 + f.offset) * 2;
      this.ctx.fillStyle = f.tailColor;
      this.ctx.beginPath();
      this.ctx.moveTo(tailX, fishY);
      this.ctx.lineTo(tailX - (f.dir * 4), fishY - 3 + tailWiggle);
      this.ctx.lineTo(tailX - (f.dir * 4), fishY + 3 + tailWiggle);
      this.ctx.closePath();
      this.ctx.fill();

      // Fish Eye
      const eyeX = f.dir === 1 ? f.x + f.size - 2 : f.x - f.size + 2;
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillRect(eyeX, fishY - 1, 1, 1);
    });

    // 8. Glass Highlights & Outer Frame
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(x + 6, y + 4);
    this.ctx.lineTo(x + w - 6, y + 4);
    this.ctx.stroke();

    this.ctx.strokeStyle = "#0284c7";
    this.ctx.lineWidth = 2;
    this._drawRoundedRect(x, y, w, h, 6, false, true);
    this.ctx.lineWidth = 1;
  }

  /**
   * Software House Ornaments:
   */
  // 1. CI/CD Build Light / Traffic Beacon Tower
  _drawCiCdBeaconTower(x, y) {
    this.ctx.fillStyle = "#0f172a";
    this.ctx.fillRect(x, y, 14, 38);
    this.ctx.strokeStyle = "#334155";
    this.ctx.strokeRect(x, y, 14, 38);

    // Green (Build Passing)
    const isPassing = Math.sin(this.tick * 3) > -0.7;
    this.ctx.fillStyle = isPassing ? "#10b981" : "#047857";
    this.ctx.beginPath();
    this.ctx.arc(x + 7, y + 8, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Blue / Amber (Staging / Testing)
    this.ctx.fillStyle = "#38bdf8";
    this.ctx.beginPath();
    this.ctx.arc(x + 7, y + 19, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Red (Alert)
    this.ctx.fillStyle = "#450a0a";
    this.ctx.beginPath();
    this.ctx.arc(x + 7, y + 30, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Beacon Pole
    this.ctx.fillStyle = "#64748b";
    this.ctx.fillRect(x + 5, y + 38, 4, 10);
  }

  // 2. Soundproof 1-Person Focus Booth (Acoustic Pod)
  _drawAcousticFocusBooth(x, y) {
    // Outer Acoustic Shell
    this.ctx.fillStyle = "#1e293b";
    this._drawRoundedRect(x, y, 32, 42, 6, true, false);
    this.ctx.strokeStyle = "#475569";
    this._drawRoundedRect(x, y, 32, 42, 6, false, true);

    // Glass Door
    this.ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
    this.ctx.fillRect(x + 4, y + 4, 24, 34);
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    this.ctx.strokeRect(x + 4, y + 4, 24, 34);

    // Interior Desk & Warm Focus Light
    this.ctx.fillStyle = "#dfb282";
    this.ctx.fillRect(x + 8, y + 24, 16, 6);
    this.ctx.fillStyle = "#fef08a";
    this.ctx.fillRect(x + 12, y + 6, 8, 3);
  }

  // 3. Glass Architecture Sprint Board with Flowcharts & Sticky Notes
  _drawStickyWhiteboard(x, y) {
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    this.ctx.fillRect(x, y, 48, 42);
    this.ctx.strokeStyle = "#cbd5e1";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, 48, 42);
    this.ctx.lineWidth = 1;

    // Architecture Flowchart Microservice Boxes (UI -> API -> DB)
    this.ctx.fillStyle = "#3b82f6";
    this.ctx.fillRect(x + 4, y + 6, 10, 6); // [UI]
    this.ctx.fillStyle = "#10b981";
    this.ctx.fillRect(x + 18, y + 6, 12, 6); // [API]
    this.ctx.fillStyle = "#8b5cf6";
    this.ctx.fillRect(x + 34, y + 6, 10, 6); // [DB]

    // Arrow links
    this.ctx.strokeStyle = "#64748b";
    this.ctx.beginPath();
    this.ctx.moveTo(x + 14, y + 9);
    this.ctx.lineTo(x + 18, y + 9);
    this.ctx.moveTo(x + 30, y + 9);
    this.ctx.lineTo(x + 34, y + 9);
    this.ctx.stroke();

    // Sticky Notes (Kanban Backlog)
    this.ctx.fillStyle = "#fef08a"; // yellow
    this.ctx.fillRect(x + 4, y + 16, 7, 7);
    this.ctx.fillRect(x + 14, y + 16, 7, 7);
    this.ctx.fillStyle = "#fbcfe8"; // pink
    this.ctx.fillRect(x + 24, y + 16, 7, 7);
    this.ctx.fillStyle = "#bbf7d0"; // green
    this.ctx.fillRect(x + 34, y + 16, 7, 7);

    this.ctx.fillStyle = "#fef08a";
    this.ctx.fillRect(x + 4, y + 26, 7, 7);
    this.ctx.fillStyle = "#bae6fd"; // cyan
    this.ctx.fillRect(x + 14, y + 26, 7, 7);
  }

  // 4. Fuel Station Coffee Bar with Cold Brew Tap & Mug Rack
  _drawCurvedOakCoffeeBar(x, y) {
    this.ctx.fillStyle = "#dfb282";
    this._drawRoundedRect(x, y, 62, 40, 8, true, false);
    this.ctx.strokeStyle = "#c6925e";
    this._drawRoundedRect(x, y, 62, 40, 8, false, true);

    // Espresso Machine
    this.ctx.fillStyle = "#0f172a";
    this.ctx.fillRect(x + 6, y + 8, 26, 24);
    this.ctx.fillStyle = "#f59e0b";
    this.ctx.font = "12px sans-serif";
    this.ctx.fillText("☕", x + 12, y + 24);

    // Cold Brew Tap Tower
    this.ctx.fillStyle = "#94a3b8";
    this.ctx.fillRect(x + 38, y + 10, 5, 18);
    this.ctx.fillStyle = "#475569";
    this.ctx.fillRect(x + 36, y + 8, 9, 3);
    this.ctx.fillStyle = "#1e293b";
    this.ctx.fillRect(x + 43, y + 12, 4, 2);

    // Ceramic Mug Rack
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(x + 48, y + 12, 4, 4);
    this.ctx.fillRect(x + 54, y + 12, 4, 4);
    this.ctx.fillRect(x + 48, y + 18, 4, 4);
    this.ctx.fillRect(x + 54, y + 18, 4, 4);

    // Steam
    const steamY1 = y - (Math.sin(this.coffeeSteamTick) * 6);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    this.ctx.fillRect(x + 18, steamY1, 3, 5);
  }

  _drawCalifornianOakDesk(x, y) {
    this.ctx.fillStyle = "#dfb282";
    this.ctx.fillRect(x - 26, y - 14, 52, 28);
    this.ctx.strokeStyle = "#c6925e";
    this.ctx.strokeRect(x - 26, y - 14, 52, 28);

    this.ctx.fillStyle = "#2d3748";
    this.ctx.fillRect(x - 16, y - 10, 32, 20);

    this.ctx.fillStyle = "#38bdf8";
    this.ctx.fillRect(x - 10, y - 8, 20, 12);
    this.ctx.fillStyle = "#cbd5e1";
    this.ctx.fillRect(x - 6, y + 4, 12, 3);
  }

  _drawModernAppleDevStation(x, y) {
    this.ctx.fillStyle = "#dfb282";
    this.ctx.fillRect(x - 30, y - 15, 60, 30);
    this.ctx.strokeStyle = "#c6925e";
    this.ctx.strokeRect(x - 30, y - 15, 60, 30);

    this.ctx.fillStyle = "#0f172a";
    this.ctx.fillRect(x - 24, y - 13, 20, 14);
    this.ctx.fillRect(x + 4, y - 13, 20, 14);

    this.ctx.fillStyle = "#10b981";
    this.ctx.fillRect(x - 22, y - 10, 16, 2);
    this.ctx.fillRect(x - 22, y - 6, 12, 2);

    this.ctx.fillStyle = "#38bdf8";
    this.ctx.fillRect(x + 6, y - 10, 16, 2);
    this.ctx.fillRect(x + 6, y - 6, 14, 2);

    this.ctx.fillStyle = "#94a3b8";
    this.ctx.fillRect(x - 16, y + 1, 4, 2);
    this.ctx.fillRect(x + 12, y + 1, 4, 2);
  }

  _drawOakBookshelf(x, y) {
    this.ctx.fillStyle = "#c6925e";
    this.ctx.fillRect(x, y, 44, 50);
    this.ctx.strokeStyle = "#a77140";
    this.ctx.strokeRect(x, y, 44, 50);

    const bookColors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
    for (let shelf = 0; shelf < 3; shelf++) {
      let bx = x + 4;
      for (let b = 0; b < 5; b++) {
        this.ctx.fillStyle = bookColors[(shelf + b) % bookColors.length];
        this.ctx.fillRect(bx, y + 6 + (shelf * 14), 6, 10);
        bx += 7;
      }
    }
  }

  _drawSnackCorner(x, y) {
    this.ctx.fillStyle = "#dfb282";
    this._drawRoundedRect(x, y, 60, 32, 6, true, false);
    this.ctx.strokeStyle = "#c6925e";
    this._drawRoundedRect(x, y, 60, 32, 6, false, true);

    this.ctx.font = "12px sans-serif";
    this.ctx.fillText("🍩 🍎", x + 8, y + 22);
  }

  _drawWaterDispenser(x, y) {
    this.ctx.fillStyle = "#38bdf8";
    this.ctx.fillRect(x, y, 20, 24);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(x - 2, y + 24, 24, 18);
    this.ctx.strokeStyle = "#cbd5e1";
    this.ctx.strokeRect(x - 2, y + 24, 24, 18);
  }

  _drawSunkenLoungeSofa(x, y) {
    this.ctx.fillStyle = "#d8c7b5";
    this._drawRoundedRect(x, y, 86, 34, 8, true, false);
    this.ctx.fillStyle = "#ebe0d3";
    this._drawRoundedRect(x + 6, y + 4, 74, 24, 6, true, false);

    this.ctx.fillStyle = "#ea580c";
    this.ctx.fillRect(x + 8, y + 8, 12, 12);
    this.ctx.fillStyle = "#10b981";
    this.ctx.fillRect(x + 66, y + 8, 12, 12);
  }

  _drawCozyBeanbag(x, y) {
    this.ctx.fillStyle = "#c28054";
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 22, 16, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }

  _drawLofiVinylPlayer(x, y) {
    this.ctx.fillStyle = "#c6925e";
    this.ctx.fillRect(x, y, 32, 28);
    this.ctx.fillStyle = "#0f172a";
    this.ctx.beginPath();
    this.ctx.arc(x + 16, y + 14, 10, 0, Math.PI * 2);
    this.ctx.fill();

    const noteY = y - (Math.sin(this.musicNoteTick) * 8);
    this.ctx.fillStyle = "#f43f5e";
    this.ctx.font = "11px sans-serif";
    this.ctx.fillText("♪", x + 24, noteY);
  }

  _drawMonsteraPlant(x, y) {
    this.ctx.fillStyle = "#c2410c";
    this.ctx.fillRect(x - 8, y - 6, 16, 14);
    this.ctx.fillStyle = "#9a3412";
    this.ctx.fillRect(x - 10, y - 8, 20, 4);

    this.ctx.fillStyle = "#059669";
    this.ctx.beginPath();
    this.ctx.arc(x, y - 14, 12, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = "#10b981";
    this.ctx.beginPath();
    this.ctx.arc(x - 6, y - 18, 8, 0, Math.PI * 2);
    this.ctx.arc(x + 6, y - 18, 8, 0, Math.PI * 2);
    this.ctx.fill();
  }

  _drawDeskLamp(x, y) {
    this.ctx.fillStyle = "#f59e0b";
    this.ctx.fillRect(x, y, 8, 14);
    this.ctx.fillStyle = "rgba(251, 191, 36, 0.12)";
    this.ctx.beginPath();
    this.ctx.moveTo(x + 4, y);
    this.ctx.lineTo(x - 20, y + 40);
    this.ctx.lineTo(x + 28, y + 40);
    this.ctx.closePath();
    this.ctx.fill();
  }

  _drawProjectorBigScreen(x, y) {
    this.ctx.fillStyle = "#030712";
    this.ctx.fillRect(x, y, 210, 46);
    this.ctx.strokeStyle = "#38bdf8";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, 210, 46);
    this.ctx.lineWidth = 1;

    this.ctx.fillStyle = "#38bdf8";
    this.ctx.font = "bold 9px monospace, sans-serif";
    this.ctx.fillText("📊 [WAR ROOM ARCHITECTURE PROJECTION]", x + 8, y + 26);
  }

  _drawOvalBoardroomTable(x, y) {
    this.ctx.fillStyle = "#dfb282";
    this._drawRoundedRect(x, y, 220, 80, 20, true, false);
    this.ctx.strokeStyle = "#c6925e";
    this.ctx.lineWidth = 2;
    this._drawRoundedRect(x, y, 220, 80, 20, false, true);
    this.ctx.lineWidth = 1;

    this.ctx.fillStyle = "#38bdf8";
    this.ctx.fillRect(x + 35, y + 34, 18, 12);
    this.ctx.fillStyle = "#a855f7";
    this.ctx.fillRect(x + 100, y + 34, 18, 12);
    this.ctx.fillStyle = "#10b981";
    this.ctx.fillRect(x + 165, y + 34, 18, 12);
  }

  _drawServerRackTowers(x, y) {
    this.ctx.fillStyle = "#020617";
    this.ctx.fillRect(x, y, 38, 56);
    this.ctx.strokeStyle = "#1e293b";
    this.ctx.strokeRect(x, y, 38, 56);

    const isLit = Math.sin(this.serverLightTick + x) > 0;
    this.ctx.fillStyle = isLit ? "#10b981" : "#047857";
    this.ctx.fillRect(x + 6, y + 8, 6, 6);
    this.ctx.fillStyle = !isLit ? "#38bdf8" : "#0284c7";
    this.ctx.fillRect(x + 16, y + 8, 6, 6);
    this.ctx.fillStyle = isLit ? "#ef4444" : "#991b1b";
    this.ctx.fillRect(x + 26, y + 8, 6, 6);

    this.ctx.fillStyle = "#334155";
    this.ctx.fillRect(x + 5, y + 22, 28, 4);
    this.ctx.fillRect(x + 5, y + 32, 28, 4);
    this.ctx.fillRect(x + 5, y + 42, 28, 4);
  }

  _drawCatMascot() {
    const { x, y, state, facing, animFrame, heartTimer, tailTick } = this.cat;
    const bobY = state === "walking" ? Math.sin(animFrame) * 2 : 0;

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    this.ctx.beginPath();
    this.ctx.ellipse(x, y + 7, 11, 4, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = "#ea580c";
    this.ctx.beginPath();
    this.ctx.ellipse(x, y + bobY, 10, 7, 0, 0, Math.PI * 2);
    this.ctx.fill();

    const headX = facing === "right" ? x + 7 : x - 7;
    this.ctx.fillStyle = "#f97316";
    this.ctx.beginPath();
    this.ctx.arc(headX, y - 2 + bobY, 6, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = "#c2410c";
    this.ctx.fillRect(headX - 4, y - 8 + bobY, 3, 3);
    this.ctx.fillRect(headX + 1, y - 8 + bobY, 3, 3);

    const tailX = facing === "right" ? x - 8 : x + 8;
    const tailWiggle = Math.sin(tailTick) * 4;
    this.ctx.strokeStyle = "#c2410c";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(tailX, y + bobY);
    this.ctx.quadraticCurveTo(tailX - (facing === "right" ? 6 : -6), y - 6 + tailWiggle + bobY, tailX - (facing === "right" ? 10 : -10), y - 2 + bobY);
    this.ctx.stroke();
    this.ctx.lineWidth = 1;

    if (state === "walking") {
      this.ctx.fillStyle = "#c2410c";
      this.ctx.fillRect(x - 5, y + 5 + Math.sin(animFrame) * 2, 3, 4);
      this.ctx.fillRect(x + 2, y + 5 - Math.sin(animFrame) * 2, 3, 4);
    }

    if (state === "being_pet" || heartTimer > 0) {
      const heartY = y - 18 - (Math.sin(this.tick * 4) * 4);
      this.ctx.fillStyle = "#ec4899";
      this.ctx.font = "12px sans-serif";
      this.ctx.fillText("💖", x - 6, heartY);
    } else if (state === "sleeping") {
      const zY = y - 14 - (Math.sin(this.tick * 3) * 3);
      this.ctx.fillStyle = "#fde047";
      this.ctx.font = "8px 'Press Start 2P', monospace";
      this.ctx.fillText("zZ", x + 4, zY);
    }
  }

  _drawAgents() {
    this.agents.forEach(agent => {
      const { x, y, shirtColor, pantsColor, hairColor, hairStyle, animFrame, state, hasCoffee, emote, name } = agent;
      const bobY = state === "walking" ? Math.sin(animFrame) * 2.5 : (state === "sitting" ? Math.sin(this.tick * 2 + x) * 0.8 : 0);

      this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      this.ctx.beginPath();
      this.ctx.ellipse(x, y + 11, 11, 4, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = pantsColor;
      this.ctx.fillRect(x - 5, y + 4 + bobY, 4, 7);
      this.ctx.fillRect(x + 1, y + 4 + bobY, 4, 7);

      this.ctx.fillStyle = shirtColor;
      this.ctx.fillRect(x - 7, y - 6 + bobY, 14, 11);

      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillRect(x - 2, y - 6 + bobY, 4, 3);

      this.ctx.fillStyle = "#fde047";
      this.ctx.fillRect(x - 6, y - 16 + bobY, 12, 11);

      this.ctx.fillStyle = hairColor;
      this.ctx.fillRect(x - 7, y - 19 + bobY, 14, 5);
      if (hairStyle === "ponytail" || hairStyle === "bun") {
        this.ctx.fillRect(x + 5, y - 18 + bobY, 4, 6);
      } else if (hairStyle === "curly" || hairStyle === "bob") {
        this.ctx.fillRect(x - 8, y - 16 + bobY, 3, 8);
        this.ctx.fillRect(x + 5, y - 16 + bobY, 3, 8);
      } else if (hairStyle === "spiky") {
        this.ctx.fillRect(x - 4, y - 22 + bobY, 4, 4);
        this.ctx.fillRect(x + 2, y - 21 + bobY, 4, 3);
      }

      const isBlinking = Math.sin(this.tick * 1.5 + x) > 0.96;
      this.ctx.fillStyle = "#0f172a";
      if (!isBlinking) {
        this.ctx.fillRect(x - 4, y - 12 + bobY, 2, 2);
        this.ctx.fillRect(x + 2, y - 12 + bobY, 2, 2);
      } else {
        this.ctx.fillRect(x - 4, y - 11 + bobY, 2, 1);
        this.ctx.fillRect(x + 2, y - 11 + bobY, 2, 1);
      }

      if (hasCoffee) {
        this.ctx.font = "10px sans-serif";
        this.ctx.fillText("☕", x + 7, y + bobY);
      }

      if (emote) {
        const emoteY = y - 24 + bobY;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.beginPath();
        this.ctx.arc(x, emoteY, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = "#0f172a";
        this.ctx.stroke();

        this.ctx.font = "9px sans-serif";
        this.ctx.textAlign = "center";
        const emoteIcon = emote === "idea" ? "💡" : (emote === "music" ? "🎵" : (emote === "coffee" ? "☕" : (emote === "heart" ? "💖" : "💬")));
        this.ctx.fillText(emoteIcon, x, emoteY + 3);
        this.ctx.textAlign = "start";
      }

      const displayName = agent.id === "optimizer" ? "Elena" : name.split(' ')[0];
      this.ctx.fillStyle = "#1e293b";
      this.ctx.font = "bold 8px 'Press Start 2P', monospace, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText(displayName, x, y + 23);
      this.ctx.textAlign = "start";
    });
  }

  _drawAtmosphereLighting() {
    const grad = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, 250,
      this.width / 2, this.height / 2, 750
    );
    grad.addColorStop(0, "rgba(255, 255, 255, 0.03)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.08)");
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
}
