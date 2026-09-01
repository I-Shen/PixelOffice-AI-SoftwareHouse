/**
 * PixelOffice AI Software House - 2.5D Symmetrical Isometric Office Engine (v5.0)
 * Hybrid Visual Engine: Combines studio-grade ultra-high detail 2.5D interior artwork
 * with real-time smooth human micro-motion animations, roaming mascot AI, interactive
 * aquarium life, and 7-season synchronized panoramic weather windows.
 */

export class PixelOfficeCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 1200;
    this.height = 560;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Preload Ultra-Detail 2.5D Interior Master Artworks
    this.images = {
      day: this._loadImage('assets/interior_day.jpg'),
      night: this._loadImage('assets/interior_night.jpg')
    };

    // 10 AI Senior Agent Personas stationed at 10 Symmetrical 2.5D Workstations
    this.agents = [
      // Left Wing (5 Workstations)
      { id: "alex", name: "Alex", role: "CEO & Lead Architect", badge: "LEAD", color: "#a855f7", deskX: 320, deskY: 440, x: 320, y: 440, targetX: 320, targetY: 440, state: "sitting", facing: "up", animFrame: 0, emote: null, emoteTimer: 0, isTaskLocked: false, hasCoffee: false, screenTheme: "#a855f7" },
      { id: "budi", name: "Budi", role: "Tech Lead", badge: "LEAD", color: "#38bdf8", deskX: 340, deskY: 360, x: 340, y: 360, targetX: 340, targetY: 360, state: "sitting", facing: "up", animFrame: 0, emote: null, emoteTimer: 0, isTaskLocked: false, hasCoffee: false, screenTheme: "#38bdf8" },
      { id: "citra", name: "Citra", role: "Backend Specialist", badge: "DEV", color: "#10b981", deskX: 105, deskY: 390, x: 105, y: 390, targetX: 105, targetY: 390, state: "sitting", facing: "up-right", animFrame: 0, emote: null, emoteTimer: 0, isTaskLocked: false, hasCoffee: false, screenTheme: "#10b981" },
      { id: "dewi", name: "Dewi", role: "Frontend Artisan", badge: "DEV", color: "#ec4899", deskX: 155, deskY: 320, x: 155, y: 320, targetX: 155, targetY: 320, state: "sitting", facing: "up-right", animFrame: 0, emote: null, emoteTimer: 0, isTaskLocked: false, hasCoffee: false, screenTheme: "#ec4899" },
      { id: "eko", name: "Eko", role: "Mobile Engineer", badge: "DEV", color: "#f59e0b", deskX: 235, deskY: 200, x: 235, y: 200, targetX: 235, targetY: 200, state: "sitting", facing: "up-right", animFrame: 0, emote: null, emoteTimer: 0, isTaskLocked: false, hasCoffee: false, screenTheme: "#f59e0b" },

      // Right Wing (5 Workstations)
      { id: "fajar", name: "Fajar", role: "AI & Data Scientist", badge: "AI", color: "#6366f1", deskX: 880, deskY: 440, x: 880, y: 440, targetX: 880, targetY: 440, state: "sitting", facing: "up", animFrame: 0, emote: null, emoteTimer: 0, isTaskLocked: false, hasCoffee: false, screenTheme: "#6366f1" },
      { id: "gita", name: "Gita", role: "DevOps & Cloud SRE", badge: "OPS", color: "#06b6d4", deskX: 850, deskY: 360, x: 850, y: 360, targetX: 850, targetY: 360, state: "sitting", facing: "up", animFrame: 0, emote: null, emoteTimer: 0, isTaskLocked: false, hasCoffee: false, screenTheme: "#06b6d4" },
      { id: "hadi", name: "Hadi", role: "QA & Test Engineer", badge: "QA", color: "#84cc16", deskX: 1090, deskY: 390, x: 1090, y: 390, targetX: 1090, targetY: 390, state: "sitting", facing: "up-left", animFrame: 0, emote: null, emoteTimer: 0, isTaskLocked: false, hasCoffee: false, screenTheme: "#84cc16" },
      { id: "indah", name: "Indah", role: "UI/UX Product Designer", badge: "DES", color: "#f43f5e", deskX: 1045, deskY: 320, x: 1045, y: 320, targetX: 1045, targetY: 320, state: "sitting", facing: "up-left", animFrame: 0, emote: null, emoteTimer: 0, isTaskLocked: false, hasCoffee: false, screenTheme: "#f43f5e" },
      { id: "joko", name: "Joko", role: "Security Officer", badge: "SEC", color: "#e11d48", deskX: 965, deskY: 200, x: 965, y: 200, targetX: 965, targetY: 200, state: "sitting", facing: "up-left", animFrame: 0, emote: null, emoteTimer: 0, isTaskLocked: false, hasCoffee: false, screenTheme: "#e11d48" }
    ];

    // Centerpiece Glass Aquascape Aquarium
    this.aquarium = {
      x: 508,
      y: 250,
      w: 184,
      h: 105
    };

    this.fishes = [
      { x: 535, y: 285, speed: 0.7, color: "#38bdf8", tailColor: "#ef4444", size: 6, dir: 1, offset: 0 },
      { x: 640, y: 300, speed: 0.5, color: "#f59e0b", tailColor: "#fde047", size: 7, dir: -1, offset: 2 },
      { x: 580, y: 290, speed: 0.9, color: "#ec4899", tailColor: "#a855f7", size: 5, dir: 1, offset: 4 },
      { x: 660, y: 280, speed: 0.6, color: "#34d399", tailColor: "#10b981", size: 6, dir: -1, offset: 1 },
      { x: 550, y: 310, speed: 0.8, color: "#60a5fa", tailColor: "#3b82f6", size: 5, dir: 1, offset: 3 }
    ];
    this.fishFood = [];

    // Autonomous Roaming Mascot Cat "Pixel"
    this.cat = {
      x: 600,
      y: 505,
      targetX: 600,
      targetY: 505,
      state: "sleeping",
      facing: "right",
      animFrame: 0,
      tailTick: 0,
      heartTimer: 0,
      emote: null
    };

    // Dynamic Weather & Seasonal Simulation Engine (7 Modes)
    this.weathers = [
      { id: "sunny", name: "Cerah Berawan", icon: "☀️" },
      { id: "rain", name: "Musim Hujan & Badai", icon: "🌧️" },
      { id: "snow", name: "Musim Salju", icon: "❄️" },
      { id: "autumn", name: "Musim Gugur", icon: "🍂" },
      { id: "starnight", name: "Malam Penuh Bintang", icon: "🌌" },
      { id: "fireworks", name: "Malam Tahun Baru", icon: "🎆" },
      { id: "windy", name: "Musim Layangan & Angin", icon: "🪁" }
    ];
    this.currentWeatherIndex = 0;
    this.currentWeather = "sunny";
    this.lightningTimer = 0;
    this.lightningAlpha = 0;
    this.fireworkSparks = [];
    this.fireworkTimer = 0;
    this.weatherParticles = [];
    this.shootingStars = [];
    this.kiteSway = 0;
    this.initWeatherParticles();

    // Clocks & Ticks
    this.tick = 0;
    this.cloudOffset = 0;
    this.screenCodeTick = 0;

    this.initCanvasInteractions();
    this.startRenderLoop();
    this.startAutonomousRoutines();
    this.startCatRoamingAI();
    this.startWeatherAutoCycle();
  }

  _loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  initCanvasInteractions() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      // 1. Click on cat
      const distToCat = Math.hypot(clickX - this.cat.x, clickY - this.cat.y);
      if (distToCat < 50) {
        this.petCat("User (Bos @I-Shen)");
        return;
      }

      // 2. Click on aquarium to feed fish
      if (clickX >= this.aquarium.x && clickX <= this.aquarium.x + this.aquarium.w &&
          clickY >= this.aquarium.y && clickY <= this.aquarium.y + this.aquarium.h) {
        this.feedFish(clickX, clickY);
        return;
      }

      // 3. Click on agent to trigger salute / status
      for (const a of this.agents) {
        const dist = Math.hypot(clickX - a.x, clickY - (a.y - 20));
        if (dist < 40) {
          this.triggerAgentGreeting(a);
          return;
        }
      }

      // 4. Click upper window in starnight mode to make shooting star!
      if (this.currentWeather === "starnight" && clickY < 140) {
        this.spawnShootingStar(clickX, clickY);
      }
    });
  }

  feedFish(x = null, y = null) {
    const dropX = x || (this.aquarium.x + 30 + Math.random() * (this.aquarium.w - 60));
    const dropY = this.aquarium.y + 15;
    for (let i = 0; i < 6; i++) {
      this.fishFood.push({
        x: dropX + (Math.random() * 20 - 10),
        y: dropY + Math.random() * 8,
        vy: 0.35 + Math.random() * 0.35
      });
    }
    this.fishes.forEach(f => {
      f.speed = 1.6;
      f.dir = f.x < dropX ? 1 : -1;
    });
    if (window.pixelOfficeApp) {
      window.pixelOfficeApp.appendTerminalLog("system", "🐠 [Aquascape PxO] Anda memberi makan ikan neon tetra! Ikan berenang antusias ✨");
    }
  }

  petCat(userName = "User") {
    this.cat.state = "being_pet";
    this.cat.heartTimer = 180;
    this.cat.emote = "heart";
    if (window.pixelOfficeApp) {
      window.pixelOfficeApp.appendTerminalLog("system", `🐱 [Maskot Pixel] ${userName} mengelus si Pixel! Kucing mendengkur manja (Purrrr! 🐾)`);
    }
    setTimeout(() => {
      this.cat.state = "sleeping";
      this.cat.emote = "zzz";
    }, 4500);
  }

  triggerAgentGreeting(agent) {
    agent.emote = "idea";
    agent.emoteTimer = 120;
    const quotes = [
      `👋 Halo Bos! Saya ${agent.name} (${agent.role}), sistem berjalan 100% optimal!`,
      `⚡ Kode arsitektur siap di-deploy, performa stabil!`,
      `☕ Kopi hangat + koding AI = produktivitas maksimal!`
    ];
    this.showSpeechBubble(agent.id, quotes[Math.floor(Math.random() * quotes.length)]);
  }

  showSpeechBubble(agentId, text) {
    const agent = this.agents.find(a => a.id === agentId);
    if (!agent) return;

    let container = document.getElementById('canvasSpeechLayer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'canvasSpeechLayer';
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      container.style.overflow = 'hidden';
      this.canvas.parentElement.style.position = 'relative';
      this.canvas.parentElement.appendChild(container);
    }

    const old = document.getElementById(`bubble-${agentId}`);
    if (old) old.remove();

    const bubble = document.createElement('div');
    bubble.id = `bubble-${agentId}`;
    bubble.className = 'pixel-speech-bubble';
    bubble.innerHTML = `<strong>${agent.name}:</strong> ${text}`;

    const rect = this.canvas.getBoundingClientRect();
    const leftPercent = (agent.x / this.width) * 100;
    const topPercent = ((agent.y - 48) / this.height) * 100;

    bubble.style.position = 'absolute';
    bubble.style.left = `${leftPercent}%`;
    bubble.style.top = `${topPercent}%`;
    bubble.style.transform = 'translate(-50%, -100%)';
    bubble.style.zIndex = '50';

    container.appendChild(bubble);

    setTimeout(() => {
      if (bubble.parentNode) bubble.remove();
    }, 4500);
  }

  dispatchAgentToAction(agentId, targetZoneName, actionState = "coding") {
    const agent = this.agents.find(a => a.id === agentId);
    if (!agent) return;

    agent.isTaskLocked = true;
    agent.hasCoffee = false;
    agent.emote = "idea";
    agent.emoteTimer = 100;

    let targetX = agent.deskX;
    let targetY = agent.deskY;

    if (targetZoneName === "meeting") {
      targetX = 350 + Math.floor(Math.random() * 40);
      targetY = 260 + Math.floor(Math.random() * 30);
    } else if (targetZoneName === "pantry") {
      targetX = 800 + Math.floor(Math.random() * 40);
      targetY = 250 + Math.floor(Math.random() * 30);
    } else if (targetZoneName === "aquarium") {
      targetX = 510 + Math.floor(Math.random() * 180);
      targetY = 365;
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
      { x: 600, y: 505, state: "sleeping" },
      { x: 600, y: 375, state: "sitting" }, // Watching aquarium!
      { x: 450, y: 490, state: "sitting" },
      { x: 750, y: 490, state: "sitting" },
      { x: 380, y: 300, state: "sitting" }
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
    }, 12000);
  }

  startAutonomousRoutines() {
    const coffeeQuotes = [
      "☕ Seduh espresso dobel hangat...",
      "☕ Aroma kopi latte bikin fokus!",
      "☕ Refill cappuccino creamy..."
    ];

    const aquariumQuotes = [
      "🐠 Melihat ikan berenang bikin mata rileks...",
      "🐠 Aquascape kantor bikin pikiran jernih untuk koding!",
      "🐠 Stress hilang setelah lihat neon tetra berenang 🫧"
    ];

    setInterval(() => {
      const idleAgents = this.agents.filter(a => !a.isTaskLocked && a.state === "sitting");
      if (idleAgents.length === 0) return;

      const agent = idleAgents[Math.floor(Math.random() * idleAgents.length)];
      const actionType = Math.floor(Math.random() * 3);

      if (actionType === 0) {
        // Grab Coffee in Pantry
        agent.targetX = 810 + Math.floor(Math.random() * 30);
        agent.targetY = 250;
        agent.state = "walking";
        agent.emote = "coffee";
        agent.emoteTimer = 120;
        this.showSpeechBubble(agent.id, coffeeQuotes[Math.floor(Math.random() * coffeeQuotes.length)]);

        setTimeout(() => {
          if (!agent.isTaskLocked) {
            agent.hasCoffee = true;
            agent.state = "idle";
            setTimeout(() => {
              if (!agent.isTaskLocked) {
                agent.targetX = agent.deskX;
                agent.targetY = agent.deskY;
                agent.state = "walking";
              }
            }, 4000);
          }
        }, 3000);
      } else if (actionType === 1) {
        // Visit Aquarium
        agent.targetX = 540 + Math.floor(Math.random() * 120);
        agent.targetY = 365;
        agent.state = "walking";
        agent.emote = "idea";
        agent.emoteTimer = 120;
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
            }, 4000);
          }
        }, 3000);
      }
    }, 10000);
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
    this.screenCodeTick += delta * 0.006;
    this.updateWeather(delta);

    // Update Fishes swimming inside aquarium
    const aqLeft = this.aquarium.x + 12;
    const aqRight = this.aquarium.x + this.aquarium.w - 16;
    this.fishes.forEach(f => {
      f.x += f.speed * f.dir;
      if (f.x > aqRight) {
        f.x = aqRight;
        f.dir = -1;
      } else if (f.x < aqLeft) {
        f.x = aqLeft;
        f.dir = 1;
      }
      f.speed = Math.max(0.6, f.speed - 0.005);
    });

    // Update Fish Food falling
    for (let i = this.fishFood.length - 1; i >= 0; i--) {
      const food = this.fishFood[i];
      food.y += food.vy;
      if (food.y > this.aquarium.y + this.aquarium.h - 12) {
        this.fishFood.splice(i, 1);
      }
    }

    // Update cat mascot
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

    // Update 10 Agents smooth movement
    this.agents.forEach(agent => {
      if (agent.emoteTimer > 0) agent.emoteTimer -= 1;
      else agent.emote = null;

      const dx = agent.targetX - agent.x;
      const dy = agent.targetY - agent.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 2) {
        agent.x += (dx / dist) * Math.min(dist, 2.2);
        agent.y += (dy / dist) * Math.min(dist, 2.2);
        agent.state = "walking";
        agent.facing = dx > 0 ? "right" : "left";
        agent.animFrame += 0.2;
      } else {
        agent.x = agent.targetX;
        agent.y = agent.targetY;
        if (agent.state === "walking") {
          agent.state = (agent.x === agent.deskX && agent.y === agent.deskY) ? "sitting" : "idle";
        }
      }
    });
  }

  initWeatherParticles() {
    this.weatherParticles = [];
    this.fireworkSparks = [];
    this.shootingStars = [];
    this.lightningAlpha = 0;

    if (this.currentWeather === "starnight") {
      this.spawnShootingStar();
    } else if (this.currentWeather === "rain") {
      for (let i = 0; i < 50; i++) {
        this.weatherParticles.push({
          x: Math.random() * 1200,
          y: 4 + Math.random() * 110,
          speed: 4.0 + Math.random() * 3.0,
          length: 6 + Math.random() * 6
        });
      }
    } else if (this.currentWeather === "snow") {
      for (let i = 0; i < 40; i++) {
        this.weatherParticles.push({
          x: Math.random() * 1200,
          y: 4 + Math.random() * 110,
          speed: 0.6 + Math.random() * 0.8,
          sway: Math.random() * Math.PI * 2,
          size: Math.random() > 0.6 ? 2.5 : 1.5
        });
      }
    } else if (this.currentWeather === "autumn") {
      const leafColors = ["#ea580c", "#d97706", "#dc2626", "#ca8a04", "#b45309"];
      for (let i = 0; i < 30; i++) {
        this.weatherParticles.push({
          x: Math.random() * 1200,
          y: 4 + Math.random() * 110,
          speed: 0.6 + Math.random() * 0.8,
          sway: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI,
          color: leafColors[i % leafColors.length],
          size: 3 + Math.floor(Math.random() * 2)
        });
      }
    } else if (this.currentWeather === "windy") {
      for (let i = 0; i < 22; i++) {
        this.weatherParticles.push({
          x: Math.random() * 1200,
          y: 8 + Math.random() * 100,
          speed: 3.5 + Math.random() * 3.5,
          length: 16 + Math.random() * 24
        });
      }
    }
  }

  setWeather(weatherId) {
    const found = this.weathers.find(w => w.id === weatherId);
    if (!found) return;
    this.currentWeather = weatherId;
    this.currentWeatherIndex = this.weathers.findIndex(w => w.id === weatherId);
    this.initWeatherParticles();

    const iconElem = document.getElementById('weatherIconDisplay');
    const nameElem = document.getElementById('weatherNameDisplay');
    if (iconElem) iconElem.textContent = found.icon;
    if (nameElem) nameElem.textContent = found.name;

    if (window.pixelOfficeApp && window.pixelOfficeApp.buildingEngine) {
      window.pixelOfficeApp.buildingEngine.setWeather(weatherId);
    }
  }

  startWeatherAutoCycle() {
    if (this.weatherTimer) clearInterval(this.weatherTimer);
    this.weatherTimer = setInterval(() => {
      this.cycleNextWeather(true);
    }, 45000);
  }

  cycleNextWeather(isAuto = false) {
    this.currentWeatherIndex = (this.currentWeatherIndex + 1) % this.weathers.length;
    const next = this.weathers[this.currentWeatherIndex];
    this.setWeather(next.id);
    if (isAuto && window.pixelOfficeApp) {
      window.pixelOfficeApp.appendTerminalLog("system", `🌤️ [Cuaca Berganti Otomatis] Suasana kantor berganti menjadi: ${next.icon} ${next.name}`);
    }
    return next;
  }

  updateWeather(delta) {
    this.cloudOffset = (this.cloudOffset + delta * 0.02) % 1200;

    if (this.currentWeather === "rain") {
      if (this.lightningTimer > 0) {
        this.lightningTimer -= delta;
        this.lightningAlpha = Math.max(0, this.lightningTimer / 120);
      } else if (Math.random() < 0.003) {
        this.lightningTimer = 120;
        this.lightningAlpha = 0.85;
      }
      this.weatherParticles.forEach(p => {
        p.y += p.speed * (delta / 16);
        p.x -= (p.speed * 0.25) * (delta / 16);
        if (p.y > 130) {
          p.y = 4;
          p.x = Math.random() * 1200;
        }
      });
    } else if (this.currentWeather === "snow") {
      this.weatherParticles.forEach(p => {
        p.y += p.speed * 0.4 * (delta / 16);
        p.sway += 0.03;
        p.x += Math.sin(p.sway) * 0.5;
        if (p.y > 130) {
          p.y = 4;
          p.x = Math.random() * 1200;
        }
      });
    } else if (this.currentWeather === "autumn") {
      this.weatherParticles.forEach(p => {
        p.y += p.speed * 0.45 * (delta / 16);
        p.sway += 0.025;
        p.x += (Math.cos(p.sway) * 0.8 + 0.5) * (delta / 16);
        p.rot = (p.rot || 0) + 0.03;
        if (p.y > 130) {
          p.y = 4;
          p.x = Math.random() * 1200;
        }
      });
    } else if (this.currentWeather === "fireworks") {
      for (let i = this.fireworkSparks.length - 1; i >= 0; i--) {
        const s = this.fireworkSparks[i];
        s.x += s.vx * (delta / 16);
        s.y += s.vy * (delta / 16);
        s.vy += 0.02;
        s.alpha -= 0.015 * (delta / 16);
        if (s.alpha <= 0) {
          this.fireworkSparks.splice(i, 1);
        }
      }
      this.fireworkTimer = (this.fireworkTimer || 0) + delta;
      if (this.fireworkTimer > 750) {
        this.fireworkTimer = 0;
        const targetWx = 150 + Math.random() * 900;
        const targetWy = 20 + Math.random() * 60;
        const colors = ["#38bdf8", "#f43f5e", "#fbbf24", "#34d399", "#a855f7", "#fb923c"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let a = 0; a < 16; a++) {
          const angle = (a / 16) * Math.PI * 2;
          const spd = 0.8 + Math.random() * 1.4;
          this.fireworkSparks.push({
            x: targetWx,
            y: targetWy,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            color: color,
            alpha: 1.0,
            size: Math.random() > 0.5 ? 2.5 : 1.5
          });
        }
      }
    } else if (this.currentWeather === "windy") {
      this.weatherParticles.forEach(p => {
        p.x += p.speed * 1.8 * (delta / 16);
        if (p.x > 1200) {
          p.x = -60;
          p.y = 8 + Math.random() * 100;
        }
      });
      this.kiteSway = (this.kiteSway || 0) + delta * 0.003;
    } else if (this.currentWeather === "starnight") {
      if (!this.shootingStars) this.shootingStars = [];
      if (Math.random() < 0.018 && this.shootingStars.length < 4) {
        this.spawnShootingStar();
      }
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const st = this.shootingStars[i];
        st.x += st.vx * (delta / 16);
        st.y += st.vy * (delta / 16);
        st.alpha -= 0.02 * (delta / 16);
        if (st.alpha <= 0 || st.y > 140) {
          this.shootingStars.splice(i, 1);
        }
      }
    }
  }

  spawnShootingStar(startX = null, startY = null) {
    if (!this.shootingStars) this.shootingStars = [];
    const x = startX !== null ? startX : (100 + Math.random() * 1000);
    const y = startY !== null ? startY : (10 + Math.random() * 50);
    const speed = 4.5 + Math.random() * 3.0;
    this.shootingStars.push({
      x: x,
      y: y,
      vx: speed * 0.88,
      vy: speed * 0.48,
      len: 25 + Math.random() * 25,
      alpha: 1.0
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Layer 1: Master 2.5D Isometric Base Environment Artwork
    this._drawBaseInteriorArtwork();

    // 2. Layer 2: Synchronized Upper Panoramic Bay Windows
    this._drawPanoramicWindowWeather();

    // 3. Layer 3: Centerpiece Living Aquascape Aquarium
    this._drawAquariumLife();

    // 4. Layer 4: Mascot Cat "Pixel" Animations
    this._drawCatMascot();

    // 5. Layer 5: 10 AI Agents Smooth 2.5D Micro-Animations & Status Badges
    this._drawAgents25D();

    // 6. Layer 6: Ambient Lighting & Screen Glow
    this._drawAmbientAtmosphere();
  }

  _drawBaseInteriorArtwork() {
    const isNight = (this.currentWeather === 'starnight' || this.currentWeather === 'fireworks');
    const baseImg = isNight ? this.images.night : this.images.day;

    if (baseImg && baseImg.complete && baseImg.naturalWidth > 0) {
      this.ctx.drawImage(baseImg, 0, 0, this.width, this.height);
    } else {
      // Warm architectural fallback
      this.ctx.fillStyle = '#26211c';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Stormy rain subtle interior tint
    if (this.currentWeather === 'rain') {
      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  _drawPanoramicWindowWeather() {
    // Upper Bay Windows area: Y: 0 to 140, X: 160 to 1040
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(140, 0, 920, 138);
    this.ctx.clip();

    if (this.currentWeather === "sunny") {
      // Soft moving clouds across panoramic window sky
      const cloudX = (this.cloudOffset * 0.6) % 1100 - 100;
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      this.ctx.beginPath();
      this.ctx.arc(250 + cloudX, 50, 26, 0, Math.PI * 2);
      this.ctx.arc(280 + cloudX, 45, 32, 0, Math.PI * 2);
      this.ctx.arc(310 + cloudX, 50, 24, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (this.currentWeather === "rain") {
      this.ctx.strokeStyle = "rgba(186, 230, 253, 0.75)";
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.weatherParticles.forEach(p => {
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x - 3, p.y + p.length);
      });
      this.ctx.stroke();

      if (this.lightningAlpha > 0.05) {
        this.ctx.fillStyle = `rgba(240, 249, 255, ${this.lightningAlpha * 0.45})`;
        this.ctx.fillRect(140, 0, 920, 138);
      }
    } else if (this.currentWeather === "snow") {
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      this.weatherParticles.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
    } else if (this.currentWeather === "autumn") {
      this.weatherParticles.forEach(p => {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rot);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-2, -1.5, 4, 3);
        this.ctx.restore();
      });
    } else if (this.currentWeather === "fireworks") {
      this.fireworkSparks.forEach(sp => {
        this.ctx.fillStyle = sp.color;
        this.ctx.globalAlpha = Math.max(0, sp.alpha);
        this.ctx.beginPath();
        this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
      this.ctx.globalAlpha = 1.0;
    } else if (this.currentWeather === "windy") {
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.weatherParticles.forEach(p => {
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.length, p.y);
      });
      this.ctx.stroke();
    } else if (this.currentWeather === "starnight") {
      // Shooting stars streaking through the panoramic night sky
      if (this.shootingStars) {
        this.shootingStars.forEach(st => {
          this.ctx.save();
          const grad = this.ctx.createLinearGradient(st.x, st.y, st.x - st.len, st.y - st.len * 0.5);
          grad.addColorStop(0, `rgba(255, 255, 255, ${st.alpha})`);
          grad.addColorStop(0.3, `rgba(56, 189, 248, ${st.alpha * 0.8})`);
          grad.addColorStop(1, "rgba(56, 189, 248, 0)");
          this.ctx.strokeStyle = grad;
          this.ctx.lineWidth = 2.0;
          this.ctx.beginPath();
          this.ctx.moveTo(st.x, st.y);
          this.ctx.lineTo(st.x - st.len, st.y - st.len * 0.5);
          this.ctx.stroke();

          this.ctx.fillStyle = "#ffffff";
          this.ctx.beginPath();
          this.ctx.arc(st.x, st.y, 2, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        });
      }
    }

    this.ctx.restore();
  }

  _drawAquariumLife() {
    const aq = this.aquarium;

    // Glowing clean aquarium water box
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(aq.x + 8, aq.y + 12, aq.w - 16, aq.h - 22);
    this.ctx.clip();

    // Water Caustic light ray animation
    const wave = Math.sin(this.tick * 3) * 6;
    const waterGrad = this.ctx.createLinearGradient(aq.x, aq.y, aq.x, aq.y + aq.h);
    waterGrad.addColorStop(0, "rgba(56, 189, 248, 0.22)");
    waterGrad.addColorStop(1, "rgba(14, 165, 233, 0.12)");
    this.ctx.fillStyle = waterGrad;
    this.ctx.fillRect(aq.x + 8, aq.y + 12, aq.w - 16, aq.h - 22);

    // Falling Fish Food
    this.ctx.fillStyle = "#f59e0b";
    this.fishFood.forEach(f => {
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, 1.8, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Swimming Fishes
    this.fishes.forEach(f => {
      const fy = f.y + Math.sin(this.tick * 4 + f.offset) * 3;
      
      // Fish Body
      this.ctx.fillStyle = f.color;
      this.ctx.beginPath();
      this.ctx.ellipse(f.x, fy, f.size, f.size * 0.45, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Fish Tail Fin with wiggle
      const tailX = f.x - (f.dir * (f.size + 2));
      const tailY = fy + Math.sin(this.tick * 10 + f.offset) * 2;
      this.ctx.fillStyle = f.tailColor;
      this.ctx.beginPath();
      this.ctx.moveTo(f.x - (f.dir * f.size * 0.5), fy);
      this.ctx.lineTo(tailX, tailY - 3);
      this.ctx.lineTo(tailX, tailY + 3);
      this.ctx.closePath();
      this.ctx.fill();

      // Fish Eye
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillRect(f.x + (f.dir * f.size * 0.5), fy - 1, 1.5, 1.5);
    });

    this.ctx.restore();
  }

  _drawCatMascot() {
    const cat = this.cat;
    const cx = cat.x;
    const cy = cat.y;

    this.ctx.save();
    // Drop shadow
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy + 8, 16, 6, 0, 0, Math.PI * 2);
    this.ctx.fill();

    if (cat.state === "sleeping" || cat.state === "being_pet") {
      // Sleeping Orange Cat in Ball Shape
      const breathe = Math.sin(this.tick * 3) * 0.8;
      
      // Fur Body
      this.ctx.fillStyle = "#ea580c";
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy - 2, 13, 9 + breathe, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Fur Stripes
      this.ctx.fillStyle = "#c2410c";
      this.ctx.fillRect(cx - 6, cy - 8, 3, 4);
      this.ctx.fillRect(cx, cy - 9, 3, 4);
      this.ctx.fillRect(cx + 4, cy - 8, 3, 4);

      // Cute Ears
      this.ctx.fillStyle = "#ea580c";
      this.ctx.beginPath();
      this.ctx.moveTo(cx - 10, cy - 8);
      this.ctx.lineTo(cx - 6, cy - 14);
      this.ctx.lineTo(cx - 3, cy - 8);
      this.ctx.closePath();
      this.ctx.fill();

      // Tail with gentle wag
      const tailAngle = Math.sin(cat.tailTick) * 0.3;
      this.ctx.strokeStyle = "#ea580c";
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(cx + 10, cy, 6, Math.PI * 0.5, Math.PI * 1.5);
      this.ctx.stroke();

      // Love Heart Emote
      if (cat.heartTimer > 0) {
        this.ctx.fillStyle = "#ef4444";
        this.ctx.font = "bold 14px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText("❤️", cx, cy - 20 - (180 - cat.heartTimer) * 0.1);
      }
    } else {
      // Walking / Sitting Cat
      const walkBounce = (cat.state === "walking") ? Math.abs(Math.sin(cat.animFrame)) * 2 : 0;
      
      this.ctx.fillStyle = "#ea580c";
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy - 6 - walkBounce, 10, 7, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Cat Head
      const headX = (cat.facing === "right") ? cx + 7 : cx - 7;
      this.ctx.beginPath();
      this.ctx.arc(headX, cy - 12 - walkBounce, 5.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Cat Ears
      this.ctx.beginPath();
      this.ctx.moveTo(headX - 4, cy - 16 - walkBounce);
      this.ctx.lineTo(headX - 1, cy - 21 - walkBounce);
      this.ctx.lineTo(headX + 2, cy - 16 - walkBounce);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  _drawAgents25D() {
    this.agents.forEach(agent => {
      const ax = agent.x;
      const ay = agent.y;

      this.ctx.save();

      // 1. Soft Character Floor Drop Shadow
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      this.ctx.beginPath();
      this.ctx.ellipse(ax, ay + 2, 14, 6, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // 2. Dual Monitor Active Code Glow at Desk
      if (agent.state === "sitting") {
        const glowTick = Math.sin(this.screenCodeTick + agent.deskX) * 0.3 + 0.7;
        this.ctx.fillStyle = agent.screenTheme;
        this.ctx.globalAlpha = glowTick * 0.35;
        this.ctx.beginPath();
        this.ctx.ellipse(ax, ay - 24, 18, 12, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
      }

      // 3. Smooth Micro-Animation: Breathing & Typing Motion
      const isWalking = (agent.state === "walking");
      const walkBounce = isWalking ? Math.abs(Math.sin(agent.animFrame)) * 3 : 0;
      const breathe = (!isWalking) ? Math.sin(this.tick * 3 + agent.deskX) * 0.6 : 0;
      const typeHand = (!isWalking && agent.state === "sitting") ? Math.sin(this.tick * 8 + agent.deskY) * 1.0 : 0;

      const bodyY = ay - 14 - walkBounce + breathe;

      // Legs / Chair Base
      this.ctx.fillStyle = "#1e293b";
      this.ctx.fillRect(ax - 5, bodyY + 8, 4, 8);
      this.ctx.fillRect(ax + 1, bodyY + 8, 4, 8);

      // Torso / Outfit (Personalized color theme)
      this.ctx.fillStyle = agent.color;
      this.ctx.beginPath();
      this.ctx.roundRect(ax - 7, bodyY - 4, 14, 13, 3);
      this.ctx.fill();

      // Hands / Typing on keyboard
      this.ctx.fillStyle = "#fed7aa";
      if (!isWalking && agent.state === "sitting") {
        this.ctx.beginPath();
        this.ctx.arc(ax - 5, bodyY + 7 + typeHand, 2.5, 0, Math.PI * 2);
        this.ctx.arc(ax + 5, bodyY + 7 - typeHand, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (agent.hasCoffee) {
        // Holding steaming coffee mug!
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(ax + 6, bodyY + 2, 5, 6);
        this.ctx.fillStyle = "#78350f";
        this.ctx.fillRect(ax + 7, bodyY + 3, 3, 2);
      }

      // Head & Hair
      this.ctx.fillStyle = "#fed7aa";
      this.ctx.beginPath();
      this.ctx.arc(ax, bodyY - 10, 6, 0, Math.PI * 2);
      this.ctx.fill();

      // Hair (Neat styling)
      this.ctx.fillStyle = (agent.id === "dewi" || agent.id === "indah" || agent.id === "citra") ? "#7c2d12" : "#1e293b";
      this.ctx.beginPath();
      this.ctx.arc(ax, bodyY - 12, 6.5, Math.PI, Math.PI * 2);
      this.ctx.fill();

      // 4. Floating Elegant Role Pill / Badge above Agent
      const badgeY = bodyY - 24;
      this.ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      this.ctx.strokeStyle = agent.color;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.roundRect(ax - 28, badgeY - 7, 56, 14, 7);
      this.ctx.fill();
      this.ctx.stroke();

      // Status Live Pulsing Dot
      this.ctx.fillStyle = (agent.state === "walking" || agent.isTaskLocked) ? "#f59e0b" : "#22c55e";
      this.ctx.beginPath();
      this.ctx.arc(ax - 20, badgeY, 2.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Agent Name Text
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "bold 8px Inter, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText(agent.name, ax + 4, badgeY + 3);

      // 5. Emote Icons (💡, ☕, ❤️)
      if (agent.emote) {
        let emoteChar = "💡";
        if (agent.emote === "coffee") emoteChar = "☕";
        else if (agent.emote === "heart") emoteChar = "❤️";
        else if (agent.emote === "zzz") emoteChar = "💤";

        this.ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        this.ctx.beginPath();
        this.ctx.arc(ax + 20, badgeY - 8, 8, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.font = "10px sans-serif";
        this.ctx.fillText(emoteChar, ax + 20, badgeY - 5);
      }

      this.ctx.restore();
    });
  }

  _drawAmbientAtmosphere() {
    // Warm floor reflections from pendant lights
    this.ctx.save();
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, "rgba(254, 240, 138, 0.04)");
    grad.addColorStop(0.5, "rgba(251, 146, 60, 0.03)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.1)");
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }
}
