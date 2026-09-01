/**
 * PixelOffice AI Software House - 2.5D Isometric Hilltop HQ Tower Engine
 * Renders an epic high-altitude mountain peak / rock cliff with our 2.5D Skyscraper,
 * surrounded by active moving volumetric pixel clouds and seasonal weather synchronization.
 */

export class IsometricBuildingCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 320;
    this.height = 560;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Weather state
    this.currentWeather = 'sunny';
    this.weatherTick = 0;
    this.cloudTick = 0;
    this.particles = [];
    this.fireworks = [];
    this.lightningAlpha = 0;
    this.lightningTimer = 0;
    this.kiteSway = 0;

    // Dynamic Multi-layer Clouds
    this.clouds = [
      { x: 30, y: 40, speed: 0.12, w: 140, h: 45, type: 'high' },
      { x: 190, y: 70, speed: 0.18, w: 120, h: 40, type: 'high' },
      { x: -50, y: 110, speed: 0.15, w: 160, h: 50, type: 'mid' },
      { x: 120, y: 140, speed: 0.22, w: 130, h: 45, type: 'mid' },
      { x: -30, y: 440, speed: 0.28, w: 180, h: 65, type: 'low' },
      { x: 160, y: 470, speed: 0.32, w: 200, h: 70, type: 'low' },
      { x: 50, y: 500, speed: 0.25, w: 160, h: 60, type: 'low' }
    ];

    // Building animation state
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
      for (let i = 0; i < 55; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: 4.5 + Math.random() * 3.5,
          len: 8 + Math.random() * 8
        });
      }
    } else if (this.currentWeather === 'snow') {
      for (let i = 0; i < 45; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: 0.7 + Math.random() * 0.9,
          sway: Math.random() * Math.PI * 2,
          size: Math.random() > 0.6 ? 2.5 : 1.5
        });
      }
    } else if (this.currentWeather === 'autumn') {
      const colors = ['#ea580c', '#d97706', '#dc2626', '#b45309', '#ca8a04'];
      for (let i = 0; i < 35; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: 0.8 + Math.random() * 1.0,
          sway: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI,
          color: colors[i % colors.length]
        });
      }
    } else if (this.currentWeather === 'windy') {
      for (let i = 0; i < 22; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: 4.0 + Math.random() * 4.0,
          len: 20 + Math.random() * 30
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
      this.spawnFirework(this.width / 2, 70);
    }
  }

  spawnFirework(x, y) {
    const colors = ['#38bdf8', '#f59e0b', '#ec4899', '#10b981', '#a855f7', '#f43f5e'];
    const chosen = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const speed = 1.2 + Math.random() * 2.2;
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
    this.cloudTick += delta * 0.001;
    this.windowGlowTick += delta * 0.003;

    // Update cloud positions
    this.clouds.forEach(c => {
      c.x += c.speed * (delta / 16);
      if (c.x > this.width + 100) {
        c.x = -c.w - 50;
      }
    });

    // Beacon pulse decay
    if (this.beaconBlink > 0) {
      this.beaconBlink -= delta * 0.002;
    }

    // Weather particle updates
    if (this.currentWeather === 'rain') {
      if (this.lightningTimer > 0) {
        this.lightningTimer -= delta;
        this.lightningAlpha = Math.max(0, this.lightningTimer / 100);
      } else if (Math.random() < 0.005) {
        this.lightningTimer = 110;
        this.lightningAlpha = 0.85;
      }

      this.particles.forEach(p => {
        p.y += p.speed * (delta / 16);
        p.x -= (p.speed * 0.25) * (delta / 16);
        if (p.y > this.height) {
          p.y = -15;
          p.x = Math.random() * (this.width + 50);
        }
      });
    } else if (this.currentWeather === 'snow') {
      this.particles.forEach(p => {
        p.y += p.speed * 0.5 * (delta / 16);
        p.sway += 0.03;
        p.x += Math.sin(p.sway) * 0.6;
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }
      });
    } else if (this.currentWeather === 'autumn') {
      this.particles.forEach(p => {
        p.y += p.speed * 0.5 * (delta / 16);
        p.sway += 0.025;
        p.x += (Math.cos(p.sway) * 0.9 + 0.6) * (delta / 16);
        p.rot += 0.04;
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }
      });
    } else if (this.currentWeather === 'fireworks') {
      if (Math.random() < 0.03) {
        this.spawnFirework(50 + Math.random() * (this.width - 100), 30 + Math.random() * 90);
      }
      this.fireworks.forEach(f => {
        f.x += f.vx * (delta / 16);
        f.y += f.vy * (delta / 16);
        f.vy += 0.03;
        f.alpha -= 0.015 * (delta / 16);
      });
      this.fireworks = this.fireworks.filter(f => f.alpha > 0);
    } else if (this.currentWeather === 'windy') {
      this.kiteSway += delta * 0.003;
      this.particles.forEach(p => {
        p.x += p.speed * (delta / 16);
        if (p.x > this.width + 50) {
          p.x = -50;
          p.y = Math.random() * this.height;
        }
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Atmospheric Sky Gradient
    this._drawSky();

    // 2. Draw Distant Moving Background Clouds
    this._drawClouds('high');
    this._drawClouds('mid');

    // 3. Draw Distant Mountain Silhouettes & Kites/Fireworks
    this._drawDistantElements();

    // 4. Draw Epic 2.5D Mountain Peak / Rock Cliff
    this._drawMountainCliff();

    // 5. Draw 2.5D Isometric HQ Tower (PxO AI Soft Skyscraper)
    this._drawIsometricTower();

    // 6. Draw Low Altitude Clouds Swirling Around Cliff Base
    this._drawClouds('low');

    // 7. Draw Seasonal Mountain Elements (Snowman, Waterfall, Autumn Leaves, Puddles)
    this._drawSeasonalMountainEnvironment();

    // 8. Draw Weather Particles (Rain, Snow, Leaves, Wind)
    this._drawWeatherParticles();

    // 9. Draw Lightning Flash Overlay
    if (this.lightningAlpha > 0.05) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha * 0.55})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  _drawSky() {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    if (this.currentWeather === 'sunny') {
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(0.4, '#38bdf8');
      grad.addColorStop(0.75, '#7dd3fc');
      grad.addColorStop(1, '#bae6fd');
    } else if (this.currentWeather === 'rain') {
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(0.45, '#0f172a');
      grad.addColorStop(0.8, '#1e293b');
      grad.addColorStop(1, '#334155');
    } else if (this.currentWeather === 'snow') {
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.45, '#312e81');
      grad.addColorStop(0.8, '#4338ca');
      grad.addColorStop(1, '#e0e7ff');
    } else if (this.currentWeather === 'autumn') {
      grad.addColorStop(0, '#7c2d12');
      grad.addColorStop(0.4, '#c2410c');
      grad.addColorStop(0.7, '#ea580c');
      grad.addColorStop(1, '#fed7aa');
    } else if (this.currentWeather === 'fireworks') {
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#0b0f19');
      grad.addColorStop(0.8, '#1e1b4b');
      grad.addColorStop(1, '#172554');
    } else if (this.currentWeather === 'windy') {
      grad.addColorStop(0, '#0369a1');
      grad.addColorStop(0.4, '#0ea5e9');
      grad.addColorStop(0.75, '#38bdf8');
      grad.addColorStop(1, '#e0f2fe');
    }
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  _drawClouds(targetType) {
    const filtered = this.clouds.filter(c => c.type === targetType);
    filtered.forEach(c => {
      let cloudBase = 'rgba(255, 255, 255, 0.85)';
      let cloudShade = 'rgba(226, 232, 240, 0.8)';

      if (this.currentWeather === 'rain') {
        cloudBase = 'rgba(71, 85, 105, 0.85)';
        cloudShade = 'rgba(51, 65, 85, 0.9)';
      } else if (this.currentWeather === 'autumn') {
        cloudBase = 'rgba(254, 215, 170, 0.85)';
        cloudShade = 'rgba(251, 146, 60, 0.75)';
      } else if (this.currentWeather === 'fireworks') {
        cloudBase = 'rgba(30, 41, 59, 0.75)';
        cloudShade = 'rgba(15, 23, 42, 0.85)';
      }

      this.ctx.save();
      // Draw organic rounded pixel cloud clusters
      this.ctx.fillStyle = cloudShade;
      this.ctx.beginPath();
      this.ctx.arc(c.x + c.w * 0.3, c.y + c.h * 0.6, c.h * 0.45, 0, Math.PI * 2);
      this.ctx.arc(c.x + c.w * 0.5, c.y + c.h * 0.5, c.h * 0.55, 0, Math.PI * 2);
      this.ctx.arc(c.x + c.w * 0.7, c.y + c.h * 0.6, c.h * 0.45, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = cloudBase;
      this.ctx.beginPath();
      this.ctx.arc(c.x + c.w * 0.3, c.y + c.h * 0.5, c.h * 0.4, 0, Math.PI * 2);
      this.ctx.arc(c.x + c.w * 0.5, c.y + c.h * 0.38, c.h * 0.5, 0, Math.PI * 2);
      this.ctx.arc(c.x + c.w * 0.7, c.y + c.h * 0.5, c.h * 0.4, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  _drawDistantElements() {
    // Distant floating island silhouette on side
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    this.ctx.beginPath();
    this.ctx.ellipse(265, 280, 45, 20, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Distant kite in windy weather
    if (this.currentWeather === 'windy') {
      const kx = 60 + Math.sin(this.kiteSway) * 16;
      const ky = 70 + Math.cos(this.kiteSway * 1.5) * 10;

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
      this.ctx.quadraticCurveTo(kx - 8 + Math.sin(this.kiteSway * 2) * 6, ky + 24, kx - 12, ky + 36);
      this.ctx.stroke();
    }
  }

  _drawMountainCliff() {
    const cx = this.width / 2;
    const peakY = 285; // Plateau where skyscraper sits

    // 1. Mountain Peak Plateau (Top Grass & Stone Platform)
    // Mountain Hilltop Dome Base (Green / Moss / Snow)
    let grassTop = '#65a30d';
    let grassMid = '#4d7c0f';
    let stoneLight = '#78716c';
    let stoneMid = '#57534e';
    let stoneDark = '#292524';

    if (this.currentWeather === 'autumn') {
      grassTop = '#ca8a04';
      grassMid = '#a16207';
      stoneLight = '#854d0e';
    } else if (this.currentWeather === 'snow') {
      grassTop = '#f8fafc';
      grassMid = '#cbd5e1';
      stoneLight = '#64748b';
    }

    // A. Main Mountain Body & Rock Strata (from Y: 285 to Y: 560)
    // Left Rock Face (Light)
    this.ctx.fillStyle = stoneMid;
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 100, peakY + 20);
    this.ctx.lineTo(cx, peakY + 45);
    this.ctx.lineTo(cx + 20, 560);
    this.ctx.lineTo(cx - 140, 560);
    this.ctx.lineTo(cx - 130, 420);
    this.ctx.closePath();
    this.ctx.fill();

    // Right Rock Face (Shadow)
    this.ctx.fillStyle = stoneDark;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, peakY + 45);
    this.ctx.lineTo(cx + 115, peakY + 15);
    this.ctx.lineTo(cx + 145, 410);
    this.ctx.lineTo(cx + 130, 560);
    this.ctx.lineTo(cx + 20, 560);
    this.ctx.closePath();
    this.ctx.fill();

    // B. Mountain Green Hill Dome (Mound under the plateau)
    this.ctx.fillStyle = grassMid;
    this.ctx.beginPath();
    this.ctx.ellipse(cx, peakY + 30, 115, 55, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = grassTop;
    this.ctx.beginPath();
    this.ctx.ellipse(cx, peakY + 20, 105, 45, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // C. Rock Strata & Crag Details (Pixelated Boulders on the Cliff)
    this._drawRockCrag(cx - 70, 360, 45, 30, stoneLight, stoneDark);
    this._drawRockCrag(cx + 40, 380, 55, 35, stoneLight, stoneDark);
    this._drawRockCrag(cx - 20, 430, 60, 40, stoneLight, stoneDark);
    this._drawRockCrag(cx + 60, 460, 45, 35, stoneLight, stoneDark);
    this._drawRockCrag(cx - 80, 480, 50, 40, stoneLight, stoneDark);

    // D. Hanging Ivy / Moss Foliage on Crags
    this.ctx.fillStyle = grassTop;
    this.ctx.fillRect(cx - 75, 390, 8, 12);
    this.ctx.fillRect(cx - 65, 390, 6, 8);
    this.ctx.fillRect(cx + 35, 415, 9, 14);
    this.ctx.fillRect(cx + 46, 415, 7, 10);
    this.ctx.fillRect(cx - 25, 470, 10, 15);

    // E. Skyscraper Paved Terrace Platform (Diamond Foundation at peakY)
    const hw = 95;
    const hh = 38;
    this.ctx.fillStyle = this.currentWeather === 'snow' ? '#e2e8f0' : '#cbd5e1';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, peakY - hh);
    this.ctx.lineTo(cx + hw, peakY);
    this.ctx.lineTo(cx, peakY + hh);
    this.ctx.lineTo(cx - hw, peakY);
    this.ctx.closePath();
    this.ctx.fill();

    // Terrace Border Slab
    this.ctx.strokeStyle = '#334155';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Terrace Trees on Hilltop (Left and Right of Tower)
    this._drawTerraceTree(cx - 65, peakY - 2);
    this._drawTerraceTree(cx + 65, peakY - 2);
  }

  _drawRockCrag(rx, ry, rw, rh, cLight, cDark) {
    this.ctx.fillStyle = cDark;
    this.ctx.beginPath();
    this.ctx.ellipse(rx + rw * 0.5, ry + rh * 0.5, rw * 0.5, rh * 0.5, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = cLight;
    this.ctx.beginPath();
    this.ctx.ellipse(rx + rw * 0.4, ry + rh * 0.35, rw * 0.35, rh * 0.35, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }

  _drawTerraceTree(tx, ty) {
    // Tree trunk
    this.ctx.fillStyle = '#78350f';
    this.ctx.fillRect(tx - 2, ty - 18, 4, 18);

    // Tree Foliage
    let fColor1 = '#15803d';
    let fColor2 = '#16a34a';
    let fColor3 = '#22c55e';

    if (this.currentWeather === 'autumn') {
      fColor1 = '#9a3412';
      fColor2 = '#c2410c';
      fColor3 = '#ea580c';
    } else if (this.currentWeather === 'snow') {
      fColor1 = '#0f766e';
      fColor2 = '#cbd5e1';
      fColor3 = '#f8fafc';
    }

    this.ctx.fillStyle = fColor1;
    this.ctx.beginPath();
    this.ctx.arc(tx, ty - 22, 11, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = fColor2;
    this.ctx.beginPath();
    this.ctx.arc(tx - 2, ty - 25, 8, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = fColor3;
    this.ctx.beginPath();
    this.ctx.arc(tx - 3, ty - 28, 5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  _drawIsometricTower() {
    const cx = this.width / 2;
    const baseCy = 270;
    const towerW = 52;  // half width
    const towerH = 22;  // isometric depth
    const towerHeight = 180; // 180px tall skyscraper
    const topCy = baseCy - towerHeight;

    // 1. Tower Cast Shadow on Ground
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, baseCy + towerH);
    this.ctx.lineTo(cx + towerW + 35, baseCy + 4);
    this.ctx.lineTo(cx + towerW + 55, baseCy - 45);
    this.ctx.lineTo(cx, baseCy);
    this.ctx.closePath();
    this.ctx.fill();

    // 2. Left Facade (Light Side)
    const leftGrad = this.ctx.createLinearGradient(cx - towerW, topCy, cx, baseCy + towerH);
    leftGrad.addColorStop(0, '#f8fafc');
    leftGrad.addColorStop(1, '#cbd5e1');

    this.ctx.fillStyle = leftGrad;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy + towerH);
    this.ctx.lineTo(cx - towerW, topCy);
    this.ctx.lineTo(cx - towerW, baseCy);
    this.ctx.lineTo(cx, baseCy + towerH);
    this.ctx.closePath();
    this.ctx.fill();

    // 3. Right Facade (Darker Side)
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

    // 4. Rooftop (Top Face)
    this.ctx.fillStyle = this.currentWeather === 'snow' ? '#f8fafc' : '#e2e8f0';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy - towerH);
    this.ctx.lineTo(cx + towerW, topCy);
    this.ctx.lineTo(cx, topCy + towerH);
    this.ctx.lineTo(cx - towerW, topCy);
    this.ctx.closePath();
    this.ctx.fill();

    // Rooftop Inner Rim
    this.ctx.fillStyle = '#475569';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy - towerH + 6);
    this.ctx.lineTo(cx + towerW - 10, topCy + 2);
    this.ctx.lineTo(cx, topCy + towerH - 6);
    this.ctx.lineTo(cx - towerW + 10, topCy + 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Rooftop Spire / Antenna
    this.ctx.strokeStyle = '#94a3b8';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy);
    this.ctx.lineTo(cx, topCy - 32);
    this.ctx.stroke();

    // Aircraft Warning Red Beacon
    const beaconAlpha = 0.4 + Math.sin(this.weatherTick * 5) * 0.5;
    this.ctx.fillStyle = `rgba(239, 68, 68, ${beaconAlpha})`;
    this.ctx.beginPath();
    this.ctx.arc(cx, topCy - 33, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // 5. Windows on Left Facade (8 Floors)
    const numFloors = 8;
    const floorStep = 18;

    for (let f = 0; f < numFloors; f++) {
      const fy = topCy + 24 + f * floorStep;
      for (let w = 0; w < 3; w++) {
        const wx = cx - 42 + w * 13;
        const wy = fy - (3 - w) * 5;

        let winColor = '#38bdf8';
        if (this.currentWeather === 'fireworks') {
          winColor = ((f + w) % 2 === 0) ? '#fde047' : '#38bdf8';
        } else if (this.currentWeather === 'rain') {
          winColor = '#0284c7';
        }

        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(wx - 1, wy - 1, 9, 11);

        this.ctx.fillStyle = winColor;
        this.ctx.fillRect(wx, wy, 7, 9);

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        this.ctx.fillRect(wx + 1, wy + 1, 2, 7);
      }
    }

    // 6. Windows on Right Facade
    for (let f = 0; f < numFloors; f++) {
      const fy = topCy + 24 + f * floorStep;
      for (let w = 0; w < 3; w++) {
        const wx = cx + 8 + w * 13;
        const wy = fy + w * 5;

        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(wx - 1, wy - 1, 9, 11);

        this.ctx.fillStyle = '#0369a1';
        this.ctx.fillRect(wx, wy, 7, 9);
      }
    }

    // 7. Glass Canopy Entrance on Ground Floor
    const gy = baseCy - 6;
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(cx - 14, gy + 3, 16, 18);

    this.ctx.fillStyle = '#38bdf8';
    this.ctx.fillRect(cx - 12, gy + 5, 12, 14);

    // Glass Canopy Roof
    this.ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 18, gy);
    this.ctx.lineTo(cx + 4, gy + 9);
    this.ctx.lineTo(cx - 8, gy + 14);
    this.ctx.lineTo(cx - 30, gy + 5);
    this.ctx.closePath();
    this.ctx.fill();

    // 8. Cyber Glowing Neon Sign at Top Facade: "PxO AI SOFT"
    this.ctx.save();
    this.ctx.font = 'bold 8px monospace';
    this.ctx.textAlign = 'center';
    
    this.ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    this.ctx.fillText('PxO AI SOFT', cx - 18, topCy + 18);

    this.ctx.fillStyle = '#38bdf8';
    this.ctx.fillText('PxO AI SOFT', cx - 19, topCy + 17);
    this.ctx.restore();
  }

  _drawSeasonalMountainEnvironment() {
    const cx = this.width / 2;
    const peakY = 285;

    if (this.currentWeather === 'snow') {
      // Draw Pixel Snowman (Boneka Salju) on the hilltop terrace!
      const smX = cx + 42;
      const smY = peakY + 14;

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.beginPath();
      this.ctx.ellipse(smX, smY + 3, 7, 3, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Bottom snowball
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(smX, smY, 6.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Middle snowball
      this.ctx.beginPath();
      this.ctx.arc(smX, smY - 7, 5, 0, Math.PI * 2);
      this.ctx.fill();

      // Head snowball
      this.ctx.beginPath();
      this.ctx.arc(smX, smY - 14, 3.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Eyes
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(smX - 1.5, smY - 15, 1, 1);
      this.ctx.fillRect(smX + 1, smY - 15, 1, 1);

      // Carrot Nose
      this.ctx.fillStyle = '#ea580c';
      this.ctx.fillRect(smX - 1, smY - 13.5, 2.5, 1);

      // Red Scarf
      this.ctx.fillStyle = '#ef4444';
      this.ctx.fillRect(smX - 4, smY - 11, 8, 2);
      this.ctx.fillRect(smX + 1, smY - 9, 2, 5);

      // Black Hat
      this.ctx.fillStyle = '#1e293b';
      this.ctx.fillRect(smX - 4, smY - 18, 8, 1.5);
      this.ctx.fillRect(smX - 2.5, smY - 22, 5, 4);

    } else if (this.currentWeather === 'autumn') {
      // Fallen leaves on hilltop terrace
      const leafColors = ['#ea580c', '#d97706', '#dc2626', '#b45309'];
      for (let i = 0; i < 20; i++) {
        const lx = cx - 55 + (i * 11) % 110;
        const ly = peakY + 4 + (i * 7) % 25;
        this.ctx.fillStyle = leafColors[i % leafColors.length];
        this.ctx.fillRect(lx, ly, 3, 2);
      }
    } else if (this.currentWeather === 'rain') {
      // Small waterfall trickling off the rock ledge
      this.ctx.strokeStyle = 'rgba(186, 230, 253, 0.7)';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(cx - 75, 400);
      this.ctx.lineTo(cx - 78, 480);
      this.ctx.moveTo(cx + 65, 420);
      this.ctx.lineTo(cx + 67, 510);
      this.ctx.stroke();
    }
  }

  _drawWeatherParticles() {
    if (this.currentWeather === 'rain') {
      this.ctx.strokeStyle = 'rgba(186, 230, 253, 0.85)';
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
