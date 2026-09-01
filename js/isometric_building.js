/**
 * PixelOffice AI Software House - 2.5D Isometric HQ Tower Engine
 * Renders an animated 2.5D Isometric Skyscraper with full seasonal weather synchronization.
 */

export class IsometricBuildingCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 400;
    this.height = 420;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Weather state
    this.currentWeather = 'sunny';
    this.weatherTick = 0;
    this.particles = [];
    this.fireworks = [];
    this.lightningAlpha = 0;
    this.lightningTimer = 0;
    this.kiteSway = 0;

    // Building animation state
    this.elevatorY = 0;
    this.elevatorDir = 1;
    this.beaconBlink = 0;
    this.windowGlowTick = 0;
    this.lastTime = performance.now();

    this.initWeatherParticles();
    this.initInteraction();
    this.startLoop();
  }

  setWeather(weatherId) {
    this.currentWeather = weatherId;
    this.initWeatherParticles();
  }

  initWeatherParticles() {
    this.particles = [];
    this.fireworks = [];

    if (this.currentWeather === 'rain') {
      for (let i = 0; i < 45; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: 4 + Math.random() * 3,
          len: 6 + Math.random() * 6
        });
      }
    } else if (this.currentWeather === 'snow') {
      for (let i = 0; i < 35; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: 0.6 + Math.random() * 0.8,
          sway: Math.random() * Math.PI * 2,
          size: Math.random() > 0.6 ? 2 : 1.5
        });
      }
    } else if (this.currentWeather === 'autumn') {
      const colors = ['#ea580c', '#d97706', '#dc2626', '#b45309', '#ca8a04'];
      for (let i = 0; i < 25; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: 0.7 + Math.random() * 0.9,
          sway: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI,
          color: colors[i % colors.length]
        });
      }
    } else if (this.currentWeather === 'windy') {
      for (let i = 0; i < 18; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * (this.height - 80),
          speed: 3.5 + Math.random() * 3.5,
          len: 15 + Math.random() * 25
        });
      }
    }
  }

  initInteraction() {
    this.canvas.addEventListener('click', () => {
      this.triggerBuildingPulse();
    });
  }

  triggerBuildingPulse() {
    this.beaconBlink = 1.0;
    if (this.currentWeather === 'fireworks') {
      this.spawnFirework(this.width / 2, 80);
    }
  }

  spawnFirework(x, y) {
    const colors = ['#38bdf8', '#f59e0b', '#ec4899', '#10b981', '#a855f7', '#f43f5e'];
    const chosen = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const speed = 1.0 + Math.random() * 2.0;
      this.fireworks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: chosen,
        alpha: 1.0,
        size: Math.random() > 0.5 ? 2.5 : 1.5
      });
    }
  }

  startLoop() {
    const loop = (time) => {
      const delta = time - this.lastTime;
      this.lastTime = time;

      this.update(delta);
      this.draw();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(delta) {
    this.weatherTick += delta * 0.002;
    this.windowGlowTick += delta * 0.003;

    // Elevator animation
    this.elevatorY += this.elevatorDir * (delta * 0.04);
    if (this.elevatorY > 160) {
      this.elevatorY = 160;
      this.elevatorDir = -1;
    } else if (this.elevatorY < 0) {
      this.elevatorY = 0;
      this.elevatorDir = 1;
    }

    // Beacon pulse decay
    if (this.beaconBlink > 0) {
      this.beaconBlink -= delta * 0.002;
    }

    // Weather particle updates
    if (this.currentWeather === 'rain') {
      if (this.lightningTimer > 0) {
        this.lightningTimer -= delta;
        this.lightningAlpha = Math.max(0, this.lightningTimer / 100);
      } else if (Math.random() < 0.004) {
        this.lightningTimer = 100;
        this.lightningAlpha = 0.8;
      }

      this.particles.forEach(p => {
        p.y += p.speed * (delta / 16);
        p.x -= (p.speed * 0.3) * (delta / 16);
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * (this.width + 50);
        }
      });
    } else if (this.currentWeather === 'snow') {
      this.particles.forEach(p => {
        p.y += p.speed * 0.5 * (delta / 16);
        p.sway += 0.03;
        p.x += Math.sin(p.sway) * 0.5;
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }
      });
    } else if (this.currentWeather === 'autumn') {
      this.particles.forEach(p => {
        p.y += p.speed * 0.45 * (delta / 16);
        p.sway += 0.025;
        p.x += (Math.cos(p.sway) * 0.8 + 0.6) * (delta / 16);
        p.rot += 0.04;
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }
      });
    } else if (this.currentWeather === 'fireworks') {
      if (Math.random() < 0.025) {
        this.spawnFirework(60 + Math.random() * (this.width - 120), 40 + Math.random() * 90);
      }
      this.fireworks.forEach(f => {
        f.x += f.vx * (delta / 16);
        f.y += f.vy * (delta / 16);
        f.vy += 0.03; // gravity
        f.alpha -= 0.015 * (delta / 16);
      });
      this.fireworks = this.fireworks.filter(f => f.alpha > 0);
    } else if (this.currentWeather === 'windy') {
      this.kiteSway += delta * 0.003;
      this.particles.forEach(p => {
        p.x += p.speed * (delta / 16);
        if (p.x > this.width + 40) {
          p.x = -40;
          p.y = Math.random() * (this.height - 80);
        }
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Sky Backdrop according to weather
    this._drawSky();

    // 2. Draw Weather Distant Background Elements (Fireworks, Kites, Clouds)
    this._drawWeatherBackground();

    // 3. Draw 2.5D Isometric Plaza / Ground Terrace
    this._drawIsometricPlaza();

    // 4. Draw 2.5D Isometric HQ Tower (PxO AI Soft Skyscraper)
    this._drawIsometricTower();

    // 5. Draw Seasonal Terrace Elements (Snowman, Autumn Leaves, Puddles)
    this._drawSeasonalTerraceEnvironment();

    // 6. Draw Weather Particles (Rain, Snow, Leaves, Wind)
    this._drawWeatherParticles();

    // 7. Draw Lightning Flash
    if (this.lightningAlpha > 0.05) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha * 0.5})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  _drawSky() {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    if (this.currentWeather === 'sunny') {
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(0.6, '#38bdf8');
      grad.addColorStop(1, '#bae6fd');
    } else if (this.currentWeather === 'rain') {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.7, '#1e293b');
      grad.addColorStop(1, '#334155');
    } else if (this.currentWeather === 'snow') {
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.6, '#312e81');
      grad.addColorStop(1, '#e0e7ff');
    } else if (this.currentWeather === 'autumn') {
      grad.addColorStop(0, '#7c2d12');
      grad.addColorStop(0.5, '#ea580c');
      grad.addColorStop(1, '#fed7aa');
    } else if (this.currentWeather === 'fireworks') {
      grad.addColorStop(0, '#030712');
      grad.addColorStop(0.7, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
    } else if (this.currentWeather === 'windy') {
      grad.addColorStop(0, '#0369a1');
      grad.addColorStop(0.6, '#0ea5e9');
      grad.addColorStop(1, '#e0f2fe');
    }
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Distant soft pixel skyline silhouettes
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    this.ctx.fillRect(15, 200, 35, 120);
    this.ctx.fillRect(60, 230, 45, 90);
    this.ctx.fillRect(300, 190, 50, 130);
    this.ctx.fillRect(355, 220, 30, 100);
  }

  _drawWeatherBackground() {
    // Distant clouds
    if (this.currentWeather === 'sunny' || this.currentWeather === 'windy') {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      const cx = (this.weatherTick * 15) % (this.width + 100) - 50;
      this.ctx.fillRect(cx, 30, 60, 16);
      this.ctx.fillRect(cx + 10, 22, 40, 12);
      this.ctx.fillRect(cx + 80, 50, 45, 12);
    }

    // Kites in windy season
    if (this.currentWeather === 'windy') {
      const kx = 65 + Math.sin(this.kiteSway) * 15;
      const ky = 55 + Math.cos(this.kiteSway * 1.5) * 8;

      // Diamond kite
      this.ctx.fillStyle = '#ef4444';
      this.ctx.beginPath();
      this.ctx.moveTo(kx, ky - 10);
      this.ctx.lineTo(kx + 9, ky);
      this.ctx.lineTo(kx, ky + 10);
      this.ctx.lineTo(kx - 9, ky);
      this.ctx.closePath();
      this.ctx.fill();

      // Tail
      this.ctx.strokeStyle = '#f59e0b';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(kx, ky + 10);
      this.ctx.quadraticCurveTo(kx - 8 + Math.sin(this.kiteSway * 2) * 6, ky + 22, kx - 12, ky + 34);
      this.ctx.stroke();
    }
  }

  _drawIsometricPlaza() {
    const cx = this.width / 2;
    const cy = 345;

    // Isometric Ground Base (Terrace Island)
    // Diamond isometric shape
    const hw = 175; // half width
    const hh = 70;  // half height

    // Shadow below terrace island
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - hh + 12);
    this.ctx.lineTo(cx + hw + 10, cy + 12);
    this.ctx.lineTo(cx, cy + hh + 12);
    this.ctx.lineTo(cx - hw - 10, cy + 12);
    this.ctx.closePath();
    this.ctx.fill();

    // Terrace Base Slab Sides (Thickness 14px)
    this.ctx.fillStyle = '#334155'; // Dark slate side left
    this.ctx.beginPath();
    this.ctx.moveTo(cx - hw, cy);
    this.ctx.lineTo(cx, cy + hh);
    this.ctx.lineTo(cx, cy + hh + 12);
    this.ctx.lineTo(cx - hw, cy + 12);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = '#1e293b'; // Darker slate side right
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy + hh);
    this.ctx.lineTo(cx + hw, cy);
    this.ctx.lineTo(cx + hw, cy + 12);
    this.ctx.lineTo(cx, cy + hh + 12);
    this.ctx.closePath();
    this.ctx.fill();

    // Terrace Top Face (Paved Stone / Grass)
    this.ctx.fillStyle = this.currentWeather === 'snow' ? '#e2e8f0' : '#cbd5e1';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - hh);
    this.ctx.lineTo(cx + hw, cy);
    this.ctx.lineTo(cx, cy + hh);
    this.ctx.lineTo(cx - hw, cy);
    this.ctx.closePath();
    this.ctx.fill();

    // Terrace Grid Lines (Pavement Tiles)
    this.ctx.strokeStyle = this.currentWeather === 'snow' ? '#cbd5e1' : '#94a3b8';
    this.ctx.lineWidth = 1;
    for (let step = -3; step <= 3; step++) {
      const ox = step * 25;
      const oy = step * 10;
      this.ctx.beginPath();
      this.ctx.moveTo(cx - 100 + ox, cy - 40 + oy);
      this.ctx.lineTo(cx + 50 + ox, cy + 20 + oy);
      this.ctx.stroke();
    }

    // Terrace Green Garden Lawn Patches
    const lawnColor = this.currentWeather === 'autumn' ? '#b45309' : (this.currentWeather === 'snow' ? '#f1f5f9' : '#4ade80');
    // Left Garden Patch
    this.ctx.fillStyle = lawnColor;
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 130, cy - 10);
    this.ctx.lineTo(cx - 80, cy + 10);
    this.ctx.lineTo(cx - 110, cy + 22);
    this.ctx.lineTo(cx - 150, cy + 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Right Garden Patch
    this.ctx.fillStyle = lawnColor;
    this.ctx.beginPath();
    this.ctx.moveTo(cx + 80, cy + 10);
    this.ctx.lineTo(cx + 130, cy - 10);
    this.ctx.lineTo(cx + 150, cy + 2);
    this.ctx.lineTo(cx + 110, cy + 22);
    this.ctx.closePath();
    this.ctx.fill();

    // Terrace Modern Minimalist Trees (2 Isometric Trees)
    this._drawIsometricTree(cx - 115, cy - 2);
    this._drawIsometricTree(cx + 115, cy - 2);
  }

  _drawIsometricTree(tx, ty) {
    // Tree trunk
    this.ctx.fillStyle = '#78350f';
    this.ctx.fillRect(tx - 2, ty - 22, 4, 22);

    // Tree Foliage (Spherical Pixel Isometric Layers)
    let fColor1 = '#15803d';
    let fColor2 = '#16a34a';
    let fColor3 = '#22c55e';

    if (this.currentWeather === 'autumn') {
      fColor1 = '#9a3412';
      fColor2 = '#c2410c';
      fColor3 = '#ea580c';
    } else if (this.currentWeather === 'snow') {
      fColor1 = '#0f766e';
      fColor2 = '#e0f2fe';
      fColor3 = '#f8fafc';
    }

    // Shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.beginPath();
    this.ctx.ellipse(tx, ty + 2, 10, 5, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Foliage tiers
    this.ctx.fillStyle = fColor1;
    this.ctx.beginPath();
    this.ctx.arc(tx, ty - 24, 12, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = fColor2;
    this.ctx.beginPath();
    this.ctx.arc(tx - 2, ty - 27, 9, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = fColor3;
    this.ctx.beginPath();
    this.ctx.arc(tx - 4, ty - 30, 6, 0, Math.PI * 2);
    this.ctx.fill();
  }

  _drawIsometricTower() {
    const cx = this.width / 2;
    const baseCy = 320;
    const towerW = 68;  // half width
    const towerH = 27;  // isometric depth
    const towerHeight = 220; // 220px tall skyscraper

    const topCy = baseCy - towerHeight;

    // 1. Tower Cast Shadow on Ground
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, baseCy + towerH);
    this.ctx.lineTo(cx + towerW + 40, baseCy + 5);
    this.ctx.lineTo(cx + towerW + 70, baseCy - 60);
    this.ctx.lineTo(cx, baseCy);
    this.ctx.closePath();
    this.ctx.fill();

    // 2. Left Facade (Light Side - Warm/Cool Slate & Cyber Tint)
    const leftGrad = this.ctx.createLinearGradient(cx - towerW, topCy, cx, baseCy + towerH);
    leftGrad.addColorStop(0, '#f1f5f9');
    leftGrad.addColorStop(1, '#cbd5e1');

    this.ctx.fillStyle = leftGrad;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy + towerH);
    this.ctx.lineTo(cx - towerW, topCy);
    this.ctx.lineTo(cx - towerW, baseCy);
    this.ctx.lineTo(cx, baseCy + towerH);
    this.ctx.closePath();
    this.ctx.fill();

    // 3. Right Facade (Darker Isometric Side)
    const rightGrad = this.ctx.createLinearGradient(cx, topCy, cx + towerW, baseCy);
    rightGrad.addColorStop(0, '#94a3b8');
    rightGrad.addColorStop(1, '#64748b');

    this.ctx.fillStyle = rightGrad;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy + towerH);
    this.ctx.lineTo(cx + towerW, topCy);
    this.ctx.lineTo(cx + towerW, baseCy);
    this.ctx.lineTo(cx, baseCy + towerH);
    this.ctx.closePath();
    this.ctx.fill();

    // 4. Rooftop (Top Isometric Face)
    this.ctx.fillStyle = this.currentWeather === 'snow' ? '#f8fafc' : '#e2e8f0';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy - towerH);
    this.ctx.lineTo(cx + towerW, topCy);
    this.ctx.lineTo(cx, topCy + towerH);
    this.ctx.lineTo(cx - towerW, topCy);
    this.ctx.closePath();
    this.ctx.fill();

    // Rooftop Inner Rim & HVAC / Helipad Detail
    this.ctx.fillStyle = '#475569';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy - towerH + 8);
    this.ctx.lineTo(cx + towerW - 14, topCy + 3);
    this.ctx.lineTo(cx, topCy + towerH - 8);
    this.ctx.lineTo(cx - towerW + 14, topCy + 3);
    this.ctx.closePath();
    this.ctx.fill();

    // Rooftop Spire / Antenna with Blinking Beacon
    this.ctx.strokeStyle = '#94a3b8';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy);
    this.ctx.lineTo(cx, topCy - 38);
    this.ctx.stroke();

    // Aircraft Warning Red Beacon on Spire
    const beaconAlpha = 0.4 + Math.sin(this.weatherTick * 5) * 0.4;
    this.ctx.fillStyle = `rgba(239, 68, 68, ${beaconAlpha})`;
    this.ctx.beginPath();
    this.ctx.arc(cx, topCy - 39, 3.5, 0, Math.PI * 2);
    this.ctx.fill();

    // 5. Windows on Left Facade (9 Floors)
    const numFloors = 9;
    const floorStep = 21;

    for (let f = 0; f < numFloors; f++) {
      const fy = topCy + 28 + f * floorStep;
      
      // 3 windows per floor on left facade
      for (let w = 0; w < 3; w++) {
        const wx = cx - 54 + w * 17;
        const wy = fy - (3 - w) * 6;

        // Window Glass Styling (Warm / Cyan Glow or Night)
        let winColor = '#38bdf8';
        if (this.currentWeather === 'fireworks') {
          winColor = ((f + w) % 2 === 0) ? '#fde047' : '#38bdf8';
        } else if (this.currentWeather === 'rain') {
          winColor = '#0284c7';
        }

        // Window Frame & Glass
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(wx - 1, wy - 1, 12, 14);

        this.ctx.fillStyle = winColor;
        this.ctx.fillRect(wx, wy, 10, 12);

        // Reflection sheen
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        this.ctx.fillRect(wx + 1, wy + 1, 3, 10);
      }
    }

    // 6. Windows on Right Facade (Darker Glass)
    for (let f = 0; f < numFloors; f++) {
      const fy = topCy + 28 + f * floorStep;
      for (let w = 0; w < 3; w++) {
        const wx = cx + 8 + w * 17;
        const wy = fy + w * 6;

        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(wx - 1, wy - 1, 12, 14);

        this.ctx.fillStyle = '#0369a1';
        this.ctx.fillRect(wx, wy, 10, 12);
      }
    }

    // 7. Glass Canopy Entrance on Ground Floor
    const gy = baseCy - 6;
    this.ctx.fillStyle = '#0f172a'; // entrance door frame
    this.ctx.fillRect(cx - 18, gy + 4, 20, 22);

    this.ctx.fillStyle = '#38bdf8'; // entrance glass revolving door
    this.ctx.fillRect(cx - 16, gy + 7, 16, 18);

    // Glass Canopy Roof
    this.ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 24, gy);
    this.ctx.lineTo(cx + 4, gy + 11);
    this.ctx.lineTo(cx - 10, gy + 17);
    this.ctx.lineTo(cx - 38, gy + 6);
    this.ctx.closePath();
    this.ctx.fill();

    // 8. Cyber Glowing Neon Sign at Top Facade: "PxO AI SOFT"
    this.ctx.save();
    this.ctx.font = 'bold 9px monospace';
    this.ctx.textAlign = 'center';
    
    // Neon glow halo
    this.ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    this.ctx.fillText('PxO AI SOFT', cx - 24, topCy + 22);

    this.ctx.fillStyle = '#38bdf8';
    this.ctx.fillText('PxO AI SOFT', cx - 25, topCy + 21);
    this.ctx.restore();
  }

  _drawSeasonalTerraceEnvironment() {
    const cx = this.width / 2;
    const cy = 345;

    if (this.currentWeather === 'snow') {
      // Draw Pixel Snowman (Boneka Salju) beside the entrance!
      const smX = cx + 55;
      const smY = cy + 22;

      // Snowman Shadow
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.beginPath();
      this.ctx.ellipse(smX, smY + 4, 9, 4, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Bottom snowball
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(smX, smY, 8, 0, Math.PI * 2);
      this.ctx.fill();

      // Middle snowball
      this.ctx.beginPath();
      this.ctx.arc(smX, smY - 9, 6, 0, Math.PI * 2);
      this.ctx.fill();

      // Head snowball
      this.ctx.beginPath();
      this.ctx.arc(smX, smY - 17, 4.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Eyes (coal)
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(smX - 2, smY - 18, 1.5, 1.5);
      this.ctx.fillRect(smX + 1, smY - 18, 1.5, 1.5);

      // Carrot Nose
      this.ctx.fillStyle = '#ea580c';
      this.ctx.fillRect(smX - 1, smY - 16, 3, 1.5);

      // Red Winter Scarf
      this.ctx.fillStyle = '#ef4444';
      this.ctx.fillRect(smX - 5, smY - 13, 10, 2.5);
      this.ctx.fillRect(smX + 1, smY - 11, 2.5, 6);

      // Top Hat (Black/Blue Top Hat)
      this.ctx.fillStyle = '#1e293b';
      this.ctx.fillRect(smX - 5, smY - 22, 10, 2);
      this.ctx.fillRect(smX - 3, smY - 27, 6, 5);

    } else if (this.currentWeather === 'autumn') {
      // Piles of fallen leaves on terrace pavement
      const leafColors = ['#ea580c', '#d97706', '#dc2626', '#b45309'];
      for (let i = 0; i < 18; i++) {
        const lx = cx - 70 + (i * 11) % 140;
        const ly = cy + 5 + (i * 7) % 35;
        this.ctx.fillStyle = leafColors[i % leafColors.length];
        this.ctx.fillRect(lx, ly, 3, 2);
        this.ctx.fillRect(lx + 1, ly + 1, 2, 2);
      }
    } else if (this.currentWeather === 'rain') {
      // Water puddles with ripple animation on terrace
      for (let i = 0; i < 3; i++) {
        const px = cx - 50 + i * 45;
        const py = cy + 12 + i * 8;
        const ripple = (this.weatherTick * 8 + i * 2) % 12;

        this.ctx.fillStyle = 'rgba(186, 230, 253, 0.4)';
        this.ctx.beginPath();
        this.ctx.ellipse(px, py, 12, 5, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - ripple / 12)})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.ellipse(px, py, ripple, ripple * 0.4, 0, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    }
  }

  _drawWeatherParticles() {
    if (this.currentWeather === 'rain') {
      this.ctx.strokeStyle = 'rgba(186, 230, 253, 0.8)';
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.particles.forEach(p => {
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x - 3, p.y + p.len);
      });
      this.ctx.stroke();
    } else if (this.currentWeather === 'snow') {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.particles.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
    } else if (this.currentWeather === 'autumn') {
      this.particles.forEach(p => {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rot);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-2, -1.5, 4, 3);
        this.ctx.restore();
      });
    } else if (this.currentWeather === 'fireworks') {
      this.fireworks.forEach(f => {
        this.ctx.fillStyle = f.color;
        this.ctx.globalAlpha = f.alpha;
        this.ctx.beginPath();
        this.ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
      this.ctx.globalAlpha = 1.0;
    } else if (this.currentWeather === 'windy') {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.particles.forEach(p => {
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.len, p.y);
      });
      this.ctx.stroke();
    }
  }
}
