/**
 * PixelOffice AI Software House - Isometric Headquarters Tower Canvas Engine
 * Simulates the exterior high-rise headquarters of PxO AI Soft:
 * - 10-Floor Modern Isometric Tower with rooftop satellite, helipad, and neon company sign.
 * - Dynamic synchronized seasonal weather (Sunny, Rainy Storm, Snowy Winter, Autumn, New Year Fireworks, Windy Kites).
 * - Animated street traffic (pixel cars), streetlights, pedestrians, and seasonal environment props (Snowman, Autumn leaves, Puddles).
 */

export class PixelBuildingCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');

    this.width = 600;
    this.height = 560;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.currentWeather = "sunny";
    this.tick = 0;
    this.cloudOffset = 0;
    this.lightningTimer = 0;
    this.lightningAlpha = 0;
    this.fireworkSparks = [];
    this.fireworkTimer = 0;
    this.weatherParticles = [];
    this.kiteSway = 0;

    // Traffic simulation (isometric cars)
    this.cars = [
      { x: -50, y: 460, speed: 1.6, color: "#ef4444", dir: 1, type: "sports" },
      { x: 320, y: 490, speed: 1.2, color: "#eab308", dir: 1, type: "taxi" },
      { x: 650, y: 430, speed: 1.4, color: "#3b82f6", dir: -1, type: "sedan" },
      { x: 200, y: 520, speed: 1.0, color: "#10b981", dir: 1, type: "compact" }
    ];

    // Tree / Foliage sway
    this.foliageTick = 0;

    // Birds / Ambient
    this.birds = [
      { x: 100, y: 80, speed: 1.2 },
      { x: 140, y: 95, speed: 1.1 }
    ];

    this.initWeatherParticles();
    this.startRenderLoop();
  }

  setWeather(weatherId) {
    this.currentWeather = weatherId;
    this.initWeatherParticles();
  }

  initWeatherParticles() {
    this.weatherParticles = [];
    this.fireworkSparks = [];
    this.lightningAlpha = 0;

    if (this.currentWeather === "rain") {
      for (let i = 0; i < 70; i++) {
        this.weatherParticles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: 4.5 + Math.random() * 3.0,
          length: 6 + Math.random() * 6
        });
      }
    } else if (this.currentWeather === "snow") {
      for (let i = 0; i < 60; i++) {
        this.weatherParticles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: 0.6 + Math.random() * 0.8,
          sway: Math.random() * Math.PI * 2,
          size: Math.random() > 0.6 ? 2 : 1.2
        });
      }
    } else if (this.currentWeather === "autumn") {
      const leafColors = ["#ea580c", "#d97706", "#dc2626", "#ca8a04", "#b45309"];
      for (let i = 0; i < 45; i++) {
        this.weatherParticles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: 0.8 + Math.random() * 1.0,
          sway: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI,
          color: leafColors[i % leafColors.length],
          size: 3 + Math.floor(Math.random() * 2)
        });
      }
    } else if (this.currentWeather === "windy") {
      for (let i = 0; i < 30; i++) {
        this.weatherParticles.push({
          x: Math.random() * this.width,
          y: 20 + Math.random() * (this.height - 40),
          speed: 3.5 + Math.random() * 4.0,
          length: 20 + Math.random() * 30
        });
      }
    }
  }

  startRenderLoop() {
    let lastTime = performance.now();
    const loop = (currentTime) => {
      const delta = Math.min(currentTime - lastTime, 100);
      lastTime = currentTime;

      this.update(delta);
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(delta) {
    this.tick += delta * 0.002;
    this.foliageTick += delta * 0.003;
    this.cloudOffset = (this.cloudOffset + delta * 0.02) % (this.width + 200);

    // Update traffic
    this.cars.forEach(car => {
      car.x += car.speed * car.dir * (delta / 16);
      if (car.dir > 0 && car.x > this.width + 60) {
        car.x = -60;
      } else if (car.dir < 0 && car.x < -60) {
        car.x = this.width + 60;
      }
    });

    // Update Birds in Sunny weather
    if (this.currentWeather === "sunny") {
      this.birds.forEach(b => {
        b.x += b.speed * (delta / 16);
        if (b.x > this.width + 30) b.x = -30;
      });
    }

    // Update Weather Effects
    if (this.currentWeather === "rain") {
      if (this.lightningTimer > 0) {
        this.lightningTimer -= delta;
        this.lightningAlpha = Math.max(0, this.lightningTimer / 120);
      } else if (Math.random() < 0.004) {
        this.lightningTimer = 120;
        this.lightningAlpha = 0.85;
      }

      this.weatherParticles.forEach(p => {
        p.y += p.speed * (delta / 16);
        p.x -= (p.speed * 0.3) * (delta / 16);
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * (this.width + 100);
        }
      });
    } else if (this.currentWeather === "snow") {
      this.weatherParticles.forEach(p => {
        p.y += p.speed * 0.6 * (delta / 16);
        p.sway += 0.03;
        p.x += Math.sin(p.sway) * 0.5;
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }
      });
    } else if (this.currentWeather === "autumn") {
      this.weatherParticles.forEach(p => {
        p.y += p.speed * 0.6 * (delta / 16);
        p.sway += 0.03;
        p.x += (Math.cos(p.sway) * 1.2 + 0.8) * (delta / 16);
        p.rot = (p.rot || 0) + 0.03;
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }
      });
    } else if (this.currentWeather === "fireworks") {
      // Fireworks particles update
      for (let i = this.fireworkSparks.length - 1; i >= 0; i--) {
        const s = this.fireworkSparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.03; // gravity
        s.alpha -= 0.015;
        if (s.alpha <= 0) this.fireworkSparks.splice(i, 1);
      }

      this.fireworkTimer += delta;
      if (this.fireworkTimer > 800) {
        this.fireworkTimer = 0;
        const fx = 80 + Math.random() * (this.width - 160);
        const fy = 40 + Math.random() * 140;
        const colors = ["#38bdf8", "#f43f5e", "#fbbf24", "#10b981", "#c084fc", "#f472b6"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const count = 28 + Math.floor(Math.random() * 16);

        for (let a = 0; a < count; a++) {
          const angle = (a / count) * Math.PI * 2;
          const spd = 1.0 + Math.random() * 2.2;
          this.fireworkSparks.push({
            x: fx,
            y: fy,
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
        p.x += p.speed * 2.2 * (delta / 16);
        if (p.x > this.width + 40) {
          p.x = -60;
          p.y = 20 + Math.random() * (this.height - 40);
        }
      });
      this.kiteSway = (this.kiteSway || 0) + delta * 0.003;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this._drawSky();
    this._drawGroundAndStreets();
    this._drawTreesAndSeasonalProps();
    this._drawIsometricTower();
    this._drawTraffic();
    this._drawSeasonalOverlays();
  }

  _drawSky() {
    const w = this.width;
    const h = this.height;

    let skyGrad = this.ctx.createLinearGradient(0, 0, 0, h * 0.7);

    if (this.currentWeather === "sunny") {
      skyGrad.addColorStop(0, "#0284c7");
      skyGrad.addColorStop(0.6, "#38bdf8");
      skyGrad.addColorStop(1, "#bae6fd");
      this.ctx.fillStyle = skyGrad;
      this.ctx.fillRect(0, 0, w, h);

      // Sun
      this.ctx.fillStyle = "#fef08a";
      this.ctx.beginPath();
      this.ctx.arc(80, 70, 26, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = "rgba(254, 240, 138, 0.25)";
      this.ctx.beginPath();
      this.ctx.arc(80, 70, 42, 0, Math.PI * 2);
      this.ctx.fill();

      // Fluffy clouds
      this._drawClouds(w, "#ffffff");

      // Flying birds
      this.ctx.fillStyle = "#1e293b";
      this.birds.forEach(b => {
        this.ctx.fillRect(b.x, b.y, 4, 2);
        this.ctx.fillRect(b.x + 4, b.y - 2, 3, 2);
        this.ctx.fillRect(b.x + 7, b.y, 4, 2);
      });

    } else if (this.currentWeather === "rain") {
      skyGrad.addColorStop(0, "#0f172a");
      skyGrad.addColorStop(0.6, "#1e293b");
      skyGrad.addColorStop(1, "#334155");
      this.ctx.fillStyle = skyGrad;
      this.ctx.fillRect(0, 0, w, h);
      this._drawClouds(w, "#475569");

    } else if (this.currentWeather === "snow") {
      skyGrad.addColorStop(0, "#1e1b4b");
      skyGrad.addColorStop(0.6, "#312e81");
      skyGrad.addColorStop(1, "#6366f1");
      this.ctx.fillStyle = skyGrad;
      this.ctx.fillRect(0, 0, w, h);
      this._drawClouds(w, "#e0e7ff");

    } else if (this.currentWeather === "autumn") {
      skyGrad.addColorStop(0, "#7c2d12");
      skyGrad.addColorStop(0.5, "#c2410c");
      skyGrad.addColorStop(1, "#fde047");
      this.ctx.fillStyle = skyGrad;
      this.ctx.fillRect(0, 0, w, h);

      // Sunset Sun
      this.ctx.fillStyle = "#fb923c";
      this.ctx.beginPath();
      this.ctx.arc(w - 100, 110, 32, 0, Math.PI * 2);
      this.ctx.fill();

    } else if (this.currentWeather === "fireworks") {
      skyGrad.addColorStop(0, "#020617");
      skyGrad.addColorStop(0.7, "#0f172a");
      skyGrad.addColorStop(1, "#1e1b4b");
      this.ctx.fillStyle = skyGrad;
      this.ctx.fillRect(0, 0, w, h);

      // Twinkling stars
      this.ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 35; i++) {
        const sx = (i * 47) % w;
        const sy = (i * 29) % 220;
        const alpha = 0.4 + 0.6 * Math.sin(this.tick * 3 + i);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.fillRect(sx, sy, 2, 2);
      }

      // Moon
      this.ctx.fillStyle = "#fef08a";
      this.ctx.beginPath();
      this.ctx.arc(w - 70, 60, 18, 0, Math.PI * 2);
      this.ctx.fill();

    } else if (this.currentWeather === "windy") {
      skyGrad.addColorStop(0, "#0284c7");
      skyGrad.addColorStop(0.6, "#38bdf8");
      skyGrad.addColorStop(1, "#e0f2fe");
      this.ctx.fillStyle = skyGrad;
      this.ctx.fillRect(0, 0, w, h);
      this._drawClouds(w, "#f8fafc");
    }
  }

  _drawClouds(w, color) {
    const offset = this.cloudOffset;
    this.ctx.fillStyle = color;
    
    // Cloud 1
    const c1x = (offset * 0.8) % (w + 160) - 80;
    this.ctx.fillRect(c1x, 40, 55, 14);
    this.ctx.fillRect(c1x + 10, 32, 35, 12);
    this.ctx.fillRect(c1x + 18, 26, 20, 8);

    // Cloud 2
    const c2x = (offset * 0.5 + 240) % (w + 160) - 80;
    this.ctx.fillRect(c2x, 70, 48, 12);
    this.ctx.fillRect(c2x + 8, 64, 30, 10);

    // Cloud 3
    const c3x = (offset * 0.6 + 420) % (w + 160) - 80;
    this.ctx.fillRect(c3x, 50, 42, 11);
    this.ctx.fillRect(c3x + 6, 44, 26, 9);
  }

  _drawGroundAndStreets() {
    const w = this.width;
    const h = this.height;

    // Plaza / Base Ground
    this.ctx.fillStyle = (this.currentWeather === "snow") ? "#e2e8f0" : "#d6d3d1";
    this.ctx.fillRect(0, 320, w, h - 320);

    // Modern Pavers & Garden Base
    this.ctx.fillStyle = (this.currentWeather === "snow") ? "#cbd5e1" : "#a8a29e";
    this.ctx.fillRect(40, 330, w - 80, 100);

    // Green / Seasonal Lawns
    let lawnColor = "#4ade80";
    if (this.currentWeather === "autumn") lawnColor = "#b45309";
    else if (this.currentWeather === "snow") lawnColor = "#f1f5f9";
    else if (this.currentWeather === "rain") lawnColor = "#22c55e";

    this.ctx.fillStyle = lawnColor;
    this.ctx.fillRect(60, 345, 140, 75);
    this.ctx.fillRect(w - 200, 345, 140, 75);

    // Lower Asphalt Street
    this.ctx.fillStyle = "#1e293b";
    this.ctx.fillRect(0, 440, w, h - 440);

    // Curbs
    this.ctx.fillStyle = "#64748b";
    this.ctx.fillRect(0, 436, w, 4);

    // Dashed Lane Markings
    this.ctx.fillStyle = "#f8fafc";
    for (let x = 10; x < w; x += 45) {
      this.ctx.fillRect(x, 485, 24, 3);
    }

    // Pedestrian Crosswalk
    for (let y = 445; y < h - 10; y += 14) {
      this.ctx.fillRect(40, y, 22, 7);
      this.ctx.fillRect(w - 62, y, 22, 7);
    }
  }

  _drawIsometricTower() {
    // Headquarters High-Rise Building Center
    const bx = 220;
    const by = 80;
    const bw = 160;
    const bh = 280;

    // Building Drop Shadow
    this.ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
    this.ctx.beginPath();
    this.ctx.moveTo(bx + bw, by + 40);
    this.ctx.lineTo(bx + bw + 90, by + 120);
    this.ctx.lineTo(bx + bw + 90, by + bh + 40);
    this.ctx.lineTo(bx + bw, by + bh);
    this.ctx.fill();

    // Tower Main Body (Cream Modern Facade / Slate Accents)
    // Left Face
    this.ctx.fillStyle = "#e2e8f0";
    this.ctx.fillRect(bx, by, bw * 0.65, bh);

    // Right Perspective Face (Shaded)
    this.ctx.fillStyle = "#cbd5e1";
    this.ctx.fillRect(bx + bw * 0.65, by, bw * 0.35, bh);

    // Architectural Trim & Floor Dividers (10 Floors)
    const floors = 10;
    const floorH = (bh - 40) / floors;

    for (let f = 0; f <= floors; f++) {
      const fy = by + 30 + f * floorH;
      this.ctx.fillStyle = "#94a3b8";
      this.ctx.fillRect(bx, fy, bw, 2);
    }

    // Windows with Warm Glow & Monitor Flickers
    for (let f = 0; f < floors; f++) {
      const fy = by + 34 + f * floorH;
      // 3 windows on left face
      for (let col = 0; col < 3; col++) {
        const wx = bx + 12 + col * 28;
        const isLit = ((f * 3 + col + Math.floor(this.tick)) % 4 !== 0) || this.currentWeather === "rain" || this.currentWeather === "fireworks";
        
        this.ctx.fillStyle = isLit ? "#fef08a" : "#475569";
        this.ctx.fillRect(wx, fy, 18, 14);

        // Window Frame
        this.ctx.fillStyle = "#334155";
        this.ctx.fillRect(wx + 8, fy, 1, 14);
        this.ctx.fillRect(wx, fy + 7, 18, 1);

        // Monitor blue flicker inside some windows
        if (isLit && (f + col) % 2 === 0) {
          this.ctx.fillStyle = "#38bdf8";
          this.ctx.fillRect(wx + 2, fy + 8, 4, 3);
        }
      }

      // 2 windows on right shaded face
      for (let col = 0; col < 2; col++) {
        const wx = bx + bw * 0.65 + 8 + col * 22;
        const isLit = (f + col) % 3 !== 0 || this.currentWeather === "rain" || this.currentWeather === "fireworks";
        this.ctx.fillStyle = isLit ? "#fde047" : "#334155";
        this.ctx.fillRect(wx, fy, 14, 14);
      }
    }

    // Ground Floor Entrance Lobby
    this.ctx.fillStyle = "#1e293b";
    this.ctx.fillRect(bx + 20, by + bh - 32, 65, 32);

    // Warm Lobby Glass Light
    this.ctx.fillStyle = "rgba(254, 240, 138, 0.9)";
    this.ctx.fillRect(bx + 24, by + bh - 28, 57, 28);

    // Entrance Frame & Revolving Door
    this.ctx.fillStyle = "#0f172a";
    this.ctx.fillRect(bx + 48, by + bh - 26, 2, 26);
    this.ctx.fillRect(bx + 24, by + bh - 28, 57, 2);

    // Entrance Canopy
    this.ctx.fillStyle = "#2563eb";
    this.ctx.fillRect(bx + 16, by + bh - 34, 73, 5);

    // Company Entrance Plate
    this.ctx.fillStyle = "#0f172a";
    this.ctx.fillRect(bx + 30, by + bh - 42, 45, 7);
    this.ctx.fillStyle = "#38bdf8";
    this.ctx.font = "bold 5px sans-serif";
    this.ctx.fillText("PxO AI SOFT", bx + 32, by + bh - 37);

    // Rooftop Structure & Helipad / Antenna
    this.ctx.fillStyle = "#64748b";
    this.ctx.fillRect(bx + 15, by - 16, bw - 30, 16);
    this.ctx.fillStyle = "#475569";
    this.ctx.fillRect(bx + 30, by - 28, bw - 60, 12);

    // Helipad [H] on Roof
    this.ctx.fillStyle = "#e2e8f0";
    this.ctx.fillRect(bx + 25, by - 12, 28, 8);
    this.ctx.fillStyle = "#dc2626";
    this.ctx.font = "bold 6px monospace";
    this.ctx.fillText("H", bx + 36, by - 6);

    // Rooftop Satellite Dish & 5G Antenna
    this.ctx.fillStyle = "#94a3b8";
    this.ctx.fillRect(bx + bw - 45, by - 44, 2, 28);
    this.ctx.beginPath();
    this.ctx.arc(bx + bw - 44, by - 36, 7, 0, Math.PI);
    this.ctx.fillStyle = "#cbd5e1";
    this.ctx.fill();

    // Antenna Beacon (Blinking Red Light)
    const beaconBlink = Math.sin(this.tick * 6) > 0;
    this.ctx.fillStyle = beaconBlink ? "#ef4444" : "#7f1d1d";
    this.ctx.beginPath();
    this.ctx.arc(bx + bw - 44, by - 46, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Glowing Neon Rooftop Company Billboard
    this.ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    this.ctx.fillRect(bx + 40, by - 24, 75, 11);
    this.ctx.strokeStyle = "#38bdf8";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(bx + 40, by - 24, 75, 11);

    this.ctx.fillStyle = (Math.sin(this.tick * 4) > -0.7) ? "#38bdf8" : "#93c5fd";
    this.ctx.font = "bold 7px monospace";
    this.ctx.fillText("⚡ PxO AI SOFT", bx + 44, by - 16);

    // Snow caps on Rooftop & Ledges in Winter
    if (this.currentWeather === "snow") {
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillRect(bx - 2, by - 2, bw + 4, 4);
      this.ctx.fillRect(bx + 13, by - 18, bw - 26, 4);
      this.ctx.fillRect(bx + 28, by - 30, bw - 56, 4);
      this.ctx.fillRect(bx + 14, by + bh - 36, 77, 3);
    }
  }

  _drawTreesAndSeasonalProps() {
    const w = this.width;

    // Left Trees
    this._drawPixelTree(90, 350);
    this._drawPixelTree(155, 365);

    // Right Trees
    this._drawPixelTree(w - 160, 350);
    this._drawPixelTree(w - 100, 365);

    // Street Lamps
    this._drawStreetLamp(195, 436);
    this._drawStreetLamp(w - 85, 436);

    // Seasonal Specific Props:
    if (this.currentWeather === "snow") {
      // ⛄ PIXEL SNOWMAN in front garden!
      this._drawPixelSnowman(125, 385);
    } else if (this.currentWeather === "autumn") {
      // Piles of Autumn leaves on sidewalk
      this._drawAutumnLeafPiles();
    } else if (this.currentWeather === "rain") {
      // Reflective puddles
      this._drawRainPuddles();
    } else if (this.currentWeather === "windy") {
      // Flying Diamond Kites with ribbon tails
      this._drawFlyingKites();
    }
  }

  _drawPixelTree(tx, ty) {
    const sway = Math.sin(this.foliageTick + tx) * (this.currentWeather === "windy" ? 3.5 : 1.2);

    // Trunk
    this.ctx.fillStyle = "#78350f";
    this.ctx.fillRect(tx + 7, ty + 24, 6, 18);

    // Crown
    let crownColor = "#15803d";
    let crownHighlight = "#22c55e";

    if (this.currentWeather === "autumn") {
      crownColor = (tx % 2 === 0) ? "#c2410c" : "#b45309";
      crownHighlight = (tx % 2 === 0) ? "#ea580c" : "#f59e0b";
    } else if (this.currentWeather === "snow") {
      crownColor = "#166534";
      crownHighlight = "#ffffff"; // Snow frosted
    }

    this.ctx.fillStyle = crownColor;
    this.ctx.beginPath();
    this.ctx.arc(tx + 10 + sway, ty + 14, 18, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = crownHighlight;
    this.ctx.beginPath();
    this.ctx.arc(tx + 8 + sway, ty + 8, 12, 0, Math.PI * 2);
    this.ctx.fill();

    // Snow Cap on Top
    if (this.currentWeather === "snow") {
      this.ctx.fillStyle = "#ffffff";
      this.ctx.beginPath();
      this.ctx.arc(tx + 9 + sway, ty + 4, 10, Math.PI, 0);
      this.ctx.fill();
    }
  }

  _drawStreetLamp(lx, ly) {
    // Post
    this.ctx.fillStyle = "#334155";
    this.ctx.fillRect(lx, ly - 36, 3, 36);
    this.ctx.fillRect(lx - 4, ly - 36, 11, 2);

    // Light head
    const isLit = this.currentWeather === "rain" || this.currentWeather === "fireworks" || this.currentWeather === "snow";
    this.ctx.fillStyle = isLit ? "#fef08a" : "#94a3b8";
    this.ctx.fillRect(lx - 2, ly - 34, 7, 5);

    if (isLit) {
      this.ctx.fillStyle = "rgba(254, 240, 138, 0.25)";
      this.ctx.beginPath();
      this.ctx.arc(lx + 1, ly - 32, 14, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if (this.currentWeather === "snow") {
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillRect(lx - 5, ly - 38, 13, 2);
    }
  }

  _drawPixelSnowman(sx, sy) {
    // Bottom Snowball
    this.ctx.fillStyle = "#ffffff";
    this.ctx.beginPath();
    this.ctx.arc(sx, sy + 14, 12, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = "#e2e8f0";
    this.ctx.beginPath();
    this.ctx.arc(sx + 3, sy + 16, 10, 0, Math.PI * 2);
    this.ctx.fill();

    // Middle Snowball
    this.ctx.fillStyle = "#ffffff";
    this.ctx.beginPath();
    this.ctx.arc(sx, sy + 2, 9, 0, Math.PI * 2);
    this.ctx.fill();

    // Head
    this.ctx.fillStyle = "#ffffff";
    this.ctx.beginPath();
    this.ctx.arc(sx, sy - 8, 6.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Eyes & Charcoal Buttons
    this.ctx.fillStyle = "#0f172a";
    this.ctx.fillRect(sx - 3, sy - 10, 2, 2);
    this.ctx.fillRect(sx + 1, sy - 10, 2, 2);
    this.ctx.fillRect(sx - 1, sy, 2, 2);
    this.ctx.fillRect(sx - 1, sy + 5, 2, 2);

    // Carrot Nose
    this.ctx.fillStyle = "#ea580c";
    this.ctx.fillRect(sx - 1, sy - 8, 5, 2);

    // Red Scarf Fluttering
    this.ctx.fillStyle = "#dc2626";
    this.ctx.fillRect(sx - 7, sy - 3, 14, 3);
    const scarfFlutter = Math.sin(this.foliageTick * 2) * 2;
    this.ctx.fillRect(sx + 3, sy, 4, 7 + scarfFlutter);

    // Black Top Hat
    this.ctx.fillStyle = "#1e293b";
    this.ctx.fillRect(sx - 8, sy - 15, 16, 2);
    this.ctx.fillRect(sx - 5, sy - 22, 10, 7);
    this.ctx.fillStyle = "#38bdf8"; // Hat ribbon
    this.ctx.fillRect(sx - 5, sy - 17, 10, 2);

    // Wooden Stick Arms
    this.ctx.fillStyle = "#78350f";
    this.ctx.fillRect(sx - 16, sy - 2, 9, 2);
    this.ctx.fillRect(sx + 8, sy - 2, 9, 2);
  }

  _drawAutumnLeafPiles() {
    const leafColors = ["#ea580c", "#d97706", "#dc2626", "#ca8a04", "#b45309"];
    for (let i = 0; i < 35; i++) {
      const lx = 50 + (i * 37) % (this.width - 100);
      const ly = 390 + (i * 17) % 45;
      this.ctx.fillStyle = leafColors[i % leafColors.length];
      this.ctx.fillRect(lx, ly, 4, 3);
    }
  }

  _drawRainPuddles() {
    this.ctx.fillStyle = "rgba(147, 197, 253, 0.4)";
    this.ctx.beginPath();
    this.ctx.ellipse(130, 470, 22, 6, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.ellipse(this.width - 140, 500, 28, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Puddle ripple
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    this.ctx.lineWidth = 0.8;
    const ripple = (this.tick * 40) % 20;
    this.ctx.strokeRect(130 - ripple / 2, 470 - ripple / 4, ripple, ripple / 2);
  }

  _drawFlyingKites() {
    const sway = Math.sin(this.kiteSway);
    
    // Kite 1: Cyan/Magenta Diamond
    const k1x = 120 + sway * 25;
    const k1y = 90 + Math.cos(this.kiteSway * 1.2) * 15;

    this.ctx.fillStyle = "#06b6d4";
    this.ctx.beginPath();
    this.ctx.moveTo(k1x, k1y - 12);
    this.ctx.lineTo(k1x + 10, k1y);
    this.ctx.lineTo(k1x, k1y + 12);
    this.ctx.lineTo(k1x - 10, k1y);
    this.ctx.fill();

    this.ctx.fillStyle = "#ec4899";
    this.ctx.beginPath();
    this.ctx.moveTo(k1x, k1y - 12);
    this.ctx.lineTo(k1x, k1y + 12);
    this.ctx.lineTo(k1x + 10, k1y);
    this.ctx.fill();

    // Tail ribbons
    this.ctx.strokeStyle = "#facc15";
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    this.ctx.moveTo(k1x, k1y + 12);
    this.ctx.quadraticCurveTo(k1x + sway * 15, k1y + 25, k1x - sway * 10, k1y + 40);
    this.ctx.stroke();

    // Kite 2: Gold/Red Diamond on right
    const k2x = this.width - 110 - sway * 20;
    const k2y = 130 + Math.sin(this.kiteSway * 1.5) * 18;

    this.ctx.fillStyle = "#eab308";
    this.ctx.beginPath();
    this.ctx.moveTo(k2x, k2y - 10);
    this.ctx.lineTo(k2x + 8, k2y);
    this.ctx.lineTo(k2x, k2y + 10);
    this.ctx.lineTo(k2x - 8, k2y);
    this.ctx.fill();

    this.ctx.strokeStyle = "#ef4444";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(k2x, k2y + 10);
    this.ctx.quadraticCurveTo(k2x - sway * 12, k2y + 20, k2x + sway * 10, k2y + 35);
    this.ctx.stroke();
  }

  _drawTraffic() {
    this.cars.forEach(car => {
      const cx = car.x;
      const cy = car.y;

      // Car Body
      this.ctx.fillStyle = car.color;
      this.ctx.fillRect(cx, cy, 34, 12);
      this.ctx.fillRect(cx + 6, cy - 7, 20, 8);

      // Windows
      this.ctx.fillStyle = "#93c5fd";
      this.ctx.fillRect(cx + 8, cy - 5, 7, 6);
      this.ctx.fillRect(cx + 17, cy - 5, 7, 6);

      // Wheels
      this.ctx.fillStyle = "#0f172a";
      this.ctx.fillRect(cx + 4, cy + 10, 6, 4);
      this.ctx.fillRect(cx + 24, cy + 10, 6, 4);

      // Headlights / Taillights
      const isNight = this.currentWeather === "rain" || this.currentWeather === "fireworks" || this.currentWeather === "snow";
      
      if (car.dir > 0) {
        // Front right
        this.ctx.fillStyle = "#fef08a";
        this.ctx.fillRect(cx + 33, cy + 3, 2, 4);
        // Tail left
        this.ctx.fillStyle = "#dc2626";
        this.ctx.fillRect(cx, cy + 3, 2, 4);

        if (isNight) {
          this.ctx.fillStyle = "rgba(254, 240, 138, 0.35)";
          this.ctx.beginPath();
          this.ctx.moveTo(cx + 35, cy + 5);
          this.ctx.lineTo(cx + 65, cy - 2);
          this.ctx.lineTo(cx + 65, cy + 14);
          this.ctx.fill();
        }
      } else {
        // Front left
        this.ctx.fillStyle = "#fef08a";
        this.ctx.fillRect(cx, cy + 3, 2, 4);
        // Tail right
        this.ctx.fillStyle = "#dc2626";
        this.ctx.fillRect(cx + 33, cy + 3, 2, 4);

        if (isNight) {
          this.ctx.fillStyle = "rgba(254, 240, 138, 0.35)";
          this.ctx.beginPath();
          this.ctx.moveTo(cx, cy + 5);
          this.ctx.lineTo(cx - 30, cy - 2);
          this.ctx.lineTo(cx - 30, cy + 14);
          this.ctx.fill();
        }
      }
    });
  }

  _drawSeasonalOverlays() {
    // Rain Streaks
    if (this.currentWeather === "rain") {
      this.ctx.strokeStyle = "rgba(186, 230, 253, 0.75)";
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.weatherParticles.forEach(p => {
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x - 3, p.y + p.length);
      });
      this.ctx.stroke();

      if (this.lightningAlpha > 0.05) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha * 0.55})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }
    }

    // Falling Snowflakes
    if (this.currentWeather === "snow") {
      this.ctx.fillStyle = "#ffffff";
      this.weatherParticles.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }

    // Autumn Swirling Leaves
    if (this.currentWeather === "autumn") {
      this.weatherParticles.forEach(p => {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rot || 0);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        this.ctx.restore();
      });
    }

    // Fireworks Sparks
    if (this.currentWeather === "fireworks") {
      this.fireworkSparks.forEach(s => {
        this.ctx.fillStyle = s.color;
        this.ctx.globalAlpha = Math.max(0, s.alpha);
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
      this.ctx.globalAlpha = 1.0;
    }

    // Wind streaks
    if (this.currentWeather === "windy") {
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.weatherParticles.forEach(p => {
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.length, p.y);
      });
      this.ctx.stroke();
    }
  }
}
