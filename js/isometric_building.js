/**
 * PixelOffice AI Software House - 2.5D Isometric Hilltop HQ Engine (v3.0)
 * Renders a wide, solid, modern Headquarters building situated atop lush, rolling green hills
 * surrounded by volumetric drifting pixel clouds and seasonal weather synchronization.
 * Dynamically resizes to match the container perfectly with zero distortion/squishing.
 */

export class IsometricBuildingCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Dynamic dimensions
    this.width = 300;
    this.height = 500;

    // Weather state
    this.currentWeather = 'sunny';
    this.weatherTick = 0;
    this.cloudTick = 0;
    this.particles = [];
    this.fireworks = [];
    this.lightningAlpha = 0;
    this.lightningTimer = 0;
    this.kiteSway = 0;

    // Multi-layer dynamic clouds
    this.clouds = [
      { x: 20, y: 35, speed: 0.15, w: 120, h: 36, type: 'high' },
      { x: 170, y: 60, speed: 0.2, w: 100, h: 32, type: 'high' },
      { x: -30, y: 95, speed: 0.18, w: 130, h: 38, type: 'mid' },
      { x: 130, y: 130, speed: 0.22, w: 110, h: 34, type: 'mid' },
      { x: -20, y: 380, speed: 0.25, w: 140, h: 48, type: 'low' },
      { x: 140, y: 420, speed: 0.3, w: 160, h: 52, type: 'low' }
    ];

    // Beacon and visual ticks
    this.beaconBlink = 0;
    this.windowGlowTick = 0;
    this.lastTime = performance.now();

    this.initResizeHandling();
    this.initWeatherParticles();
    this.initInteraction();
    this.startLoop();
  }

  initResizeHandling() {
    const updateSize = () => {
      const rect = this.canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        this.width = Math.round(rect.width);
        this.height = Math.round(rect.height);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => updateSize());
      this.resizeObserver.observe(this.canvas);
    }
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
          x: Math.random() * (this.width + 40),
          y: Math.random() * this.height,
          speed: 4.5 + Math.random() * 3.5,
          len: 8 + Math.random() * 7
        });
      }
    } else if (this.currentWeather === 'snow') {
      for (let i = 0; i < 35; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: 0.6 + Math.random() * 0.8,
          sway: Math.random() * Math.PI * 2,
          size: Math.random() > 0.6 ? 2.5 : 1.5
        });
      }
    } else if (this.currentWeather === 'autumn') {
      const colors = ['#ea580c', '#d97706', '#dc2626', '#b45309', '#ca8a04'];
      for (let i = 0; i < 28; i++) {
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
          y: Math.random() * this.height,
          speed: 4.0 + Math.random() * 3.5,
          len: 20 + Math.random() * 25
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
      const speed = 1.2 + Math.random() * 2.0;
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

    // Update clouds
    this.clouds.forEach(c => {
      c.x += c.speed * (delta / 16);
      if (c.x > this.width + 100) {
        c.x = -c.w - 40;
      }
    });

    if (this.beaconBlink > 0) {
      this.beaconBlink -= delta * 0.002;
    }

    if (this.currentWeather === 'rain') {
      if (this.lightningTimer > 0) {
        this.lightningTimer -= delta;
        this.lightningAlpha = Math.max(0, this.lightningTimer / 100);
      } else if (Math.random() < 0.004) {
        this.lightningTimer = 110;
        this.lightningAlpha = 0.8;
      }

      this.particles.forEach(p => {
        p.y += p.speed * (delta / 16);
        p.x -= (p.speed * 0.25) * (delta / 16);
        if (p.y > this.height) {
          p.y = -15;
          p.x = Math.random() * (this.width + 40);
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
        p.x += (Math.cos(p.sway) * 0.8 + 0.5) * (delta / 16);
        p.rot += 0.04;
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }
      });
    } else if (this.currentWeather === 'fireworks') {
      if (Math.random() < 0.03) {
        this.spawnFirework(30 + Math.random() * (this.width - 60), 30 + Math.random() * 80);
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
        if (p.x > this.width + 40) {
          p.x = -40;
          p.y = Math.random() * this.height;
        }
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Atmospheric Sky Gradient
    this._drawSky();

    // 2. High & Mid Altitude Moving Clouds
    this._drawClouds('high');
    this._drawClouds('mid');

    // 3. Distant Mountain Slopes & Weather Kites
    this._drawDistantHills();

    // 4. Lush Rolling Green Hills (Bebukitan Hijau Megah)
    this._drawRollingGreenHills();

    // 5. Solid 2.5D Isometric Headquarters Building (Proporsional & Tidak Gepeng)
    this._drawIsometricBuilding();

    // 6. Seasonal Hill Elements (Snowman, Autumn Leaves, Hillside Trees)
    this._drawSeasonalHillEnvironment();

    // 7. Low Altitude Clouds & Fog
    this._drawClouds('low');

    // 8. Weather Particles (Rain, Snow, Falling Leaves, Wind)
    this._drawWeatherParticles();

    // 9. Lightning Flash
    if (this.lightningAlpha > 0.05) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha * 0.55})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  _drawSky() {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    if (this.currentWeather === 'sunny') {
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(0.35, '#38bdf8');
      grad.addColorStop(0.7, '#7dd3fc');
      grad.addColorStop(1, '#bae6fd');
    } else if (this.currentWeather === 'rain') {
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(0.4, '#0f172a');
      grad.addColorStop(0.75, '#1e293b');
      grad.addColorStop(1, '#334155');
    } else if (this.currentWeather === 'snow') {
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.4, '#312e81');
      grad.addColorStop(0.75, '#4338ca');
      grad.addColorStop(1, '#e0e7ff');
    } else if (this.currentWeather === 'autumn') {
      grad.addColorStop(0, '#7c2d12');
      grad.addColorStop(0.35, '#c2410c');
      grad.addColorStop(0.7, '#ea580c');
      grad.addColorStop(1, '#fed7aa');
    } else if (this.currentWeather === 'fireworks') {
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.45, '#0b0f19');
      grad.addColorStop(0.8, '#1e1b4b');
      grad.addColorStop(1, '#172554');
    } else if (this.currentWeather === 'windy') {
      grad.addColorStop(0, '#0369a1');
      grad.addColorStop(0.35, '#0ea5e9');
      grad.addColorStop(0.7, '#38bdf8');
      grad.addColorStop(1, '#e0f2fe');
    }
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  _drawClouds(targetType) {
    const filtered = this.clouds.filter(c => c.type === targetType);
    filtered.forEach(c => {
      let cloudBase = 'rgba(255, 255, 255, 0.9)';
      let cloudShade = 'rgba(226, 232, 240, 0.8)';

      if (this.currentWeather === 'rain') {
        cloudBase = 'rgba(71, 85, 105, 0.85)';
        cloudShade = 'rgba(51, 65, 85, 0.9)';
      } else if (this.currentWeather === 'autumn') {
        cloudBase = 'rgba(254, 215, 170, 0.9)';
        cloudShade = 'rgba(251, 146, 60, 0.75)';
      } else if (this.currentWeather === 'fireworks') {
        cloudBase = 'rgba(30, 41, 59, 0.8)';
        cloudShade = 'rgba(15, 23, 42, 0.9)';
      }

      this.ctx.save();
      // Volumetric cloud rounded puff clusters
      this.ctx.fillStyle = cloudShade;
      this.ctx.beginPath();
      this.ctx.arc(c.x + c.w * 0.25, c.y + c.h * 0.6, c.h * 0.45, 0, Math.PI * 2);
      this.ctx.arc(c.x + c.w * 0.5, c.y + c.h * 0.5, c.h * 0.55, 0, Math.PI * 2);
      this.ctx.arc(c.x + c.w * 0.75, c.y + c.h * 0.6, c.h * 0.45, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = cloudBase;
      this.ctx.beginPath();
      this.ctx.arc(c.x + c.w * 0.25, c.y + c.h * 0.5, c.h * 0.4, 0, Math.PI * 2);
      this.ctx.arc(c.x + c.w * 0.5, c.y + c.h * 0.35, c.h * 0.5, 0, Math.PI * 2);
      this.ctx.arc(c.x + c.w * 0.75, c.y + c.h * 0.5, c.h * 0.4, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  _drawDistantHills() {
    // Distant soft mountain silhouette
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
    this.ctx.beginPath();
    this.ctx.arc(this.width * 0.8, this.height * 0.45, this.width * 0.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Distant kite in windy weather
    if (this.currentWeather === 'windy') {
      const kx = this.width * 0.22 + Math.sin(this.kiteSway) * 14;
      const ky = 65 + Math.cos(this.kiteSway * 1.5) * 8;

      this.ctx.fillStyle = '#ef4444';
      this.ctx.beginPath();
      this.ctx.moveTo(kx, ky - 9);
      this.ctx.lineTo(kx + 8, ky);
      this.ctx.lineTo(kx, ky + 9);
      this.ctx.lineTo(kx - 8, ky);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.strokeStyle = '#f59e0b';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(kx, ky + 9);
      this.ctx.quadraticCurveTo(kx - 6 + Math.sin(this.kiteSway * 2) * 5, ky + 22, kx - 10, ky + 32);
      this.ctx.stroke();
    }
  }

  _drawRollingGreenHills() {
    const cx = this.width / 2;
    const hillTopY = this.height * 0.52; // Golden ratio hilltop center

    // Season color palettes for hills
    let hillGrass1 = '#4ade80'; // Bright top grass
    let hillGrass2 = '#22c55e'; // Mid meadow
    let hillGrass3 = '#16a34a'; // Deep slope
    let hillShadow = '#15803d'; // Shadow hill

    if (this.currentWeather === 'autumn') {
      hillGrass1 = '#fbbf24';
      hillGrass2 = '#f59e0b';
      hillGrass3 = '#d97706';
      hillShadow = '#92400e';
    } else if (this.currentWeather === 'snow') {
      hillGrass1 = '#f8fafc';
      hillGrass2 = '#f1f5f9';
      hillGrass3 = '#e2e8f0';
      hillShadow = '#94a3b8';
    }

    // 1. Background Hill (Left / Lower)
    this.ctx.fillStyle = hillShadow;
    this.ctx.beginPath();
    this.ctx.ellipse(cx - this.width * 0.25, this.height * 0.82, this.width * 0.65, this.height * 0.32, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. Background Hill (Right / Lower)
    this.ctx.fillStyle = hillGrass3;
    this.ctx.beginPath();
    this.ctx.ellipse(cx + this.width * 0.3, this.height * 0.78, this.width * 0.7, this.height * 0.35, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 3. Main Central Rolling Hill Mound (Lush, round, expansive)
    this.ctx.fillStyle = hillGrass2;
    this.ctx.beginPath();
    this.ctx.ellipse(cx, hillTopY + this.height * 0.22, this.width * 0.58, this.height * 0.36, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 4. Hilltop Plateau Crown (Soft Sunlit Grass on the Top)
    this.ctx.fillStyle = hillGrass1;
    this.ctx.beginPath();
    this.ctx.ellipse(cx, hillTopY + 25, this.width * 0.44, this.height * 0.16, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 5. Winding Cobblestone Pathway going down the hill
    this.ctx.fillStyle = this.currentWeather === 'snow' ? '#cbd5e1' : '#e2e8f0';
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 14, hillTopY + 20);
    this.ctx.quadraticCurveTo(cx - 30, hillTopY + 70, cx - 10, hillTopY + 120);
    this.ctx.lineTo(cx + 12, hillTopY + 120);
    this.ctx.quadraticCurveTo(cx - 10, hillTopY + 70, cx + 14, hillTopY + 20);
    this.ctx.closePath();
    this.ctx.fill();

    // 6. Natural Hillside Trees (3-4 Cute Round Pixel Trees on slopes)
    this._drawHillsideTree(cx - this.width * 0.32, hillTopY + 45, 1.1);
    this._drawHillsideTree(cx + this.width * 0.34, hillTopY + 40, 1.1);
    this._drawHillsideTree(cx - this.width * 0.22, hillTopY + 110, 1.3);
    this._drawHillsideTree(cx + this.width * 0.25, hillTopY + 115, 1.3);
  }

  _drawHillsideTree(tx, ty, scale = 1.0) {
    // Trunk
    this.ctx.fillStyle = '#78350f';
    this.ctx.fillRect(tx - 2 * scale, ty - 14 * scale, 4 * scale, 14 * scale);

    // Tree Shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    this.ctx.beginPath();
    this.ctx.ellipse(tx, ty + 1, 9 * scale, 4 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Foliage
    let f1 = '#15803d';
    let f2 = '#16a34a';
    let f3 = '#4ade80';

    if (this.currentWeather === 'autumn') {
      f1 = '#9a3412';
      f2 = '#c2410c';
      f3 = '#ea580c';
    } else if (this.currentWeather === 'snow') {
      f1 = '#0f766e';
      f2 = '#cbd5e1';
      f3 = '#f8fafc';
    }

    this.ctx.fillStyle = f1;
    this.ctx.beginPath();
    this.ctx.arc(tx, ty - 16 * scale, 10 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = f2;
    this.ctx.beginPath();
    this.ctx.arc(tx - 2 * scale, ty - 19 * scale, 7.5 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = f3;
    this.ctx.beginPath();
    this.ctx.arc(tx - 3 * scale, ty - 22 * scale, 5 * scale, 0, Math.PI * 2);
    this.ctx.fill();
  }

  _drawIsometricBuilding() {
    const cx = this.width / 2;
    const baseCy = this.height * 0.52; // Perfectly seated on the hilltop plateau

    // Solid, well-proportioned dimensions (NOT thin, NOT gepeng)
    // Scale adapts harmoniously to canvas width
    const buildingScale = Math.min(1.0, this.width / 260);
    const towerW = Math.round(56 * buildingScale);  // Wide solid width
    const towerH = Math.round(22 * buildingScale);  // Isometric depth
    const towerHeight = Math.round(135 * buildingScale); // 135px tall (perfect 5-story solid proportions)
    const topCy = baseCy - towerHeight;

    // 1. Terrace Foundation Platform on Hilltop
    const hw = towerW + 18;
    const hh = towerH + 8;

    // Platform Shadow on Grass
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, baseCy + hh + 6);
    this.ctx.lineTo(cx + hw + 20, baseCy + 10);
    this.ctx.lineTo(cx + hw + 35, baseCy - 20);
    this.ctx.lineTo(cx, baseCy);
    this.ctx.closePath();
    this.ctx.fill();

    // Paved Stone Terrace Base Top
    this.ctx.fillStyle = this.currentWeather === 'snow' ? '#f1f5f9' : '#e2e8f0';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, baseCy - hh);
    this.ctx.lineTo(cx + hw, baseCy);
    this.ctx.lineTo(cx, baseCy + hh);
    this.ctx.lineTo(cx - hw, baseCy);
    this.ctx.closePath();
    this.ctx.fill();

    // Terrace Base Edge Slab
    this.ctx.fillStyle = '#334155';
    this.ctx.beginPath();
    this.ctx.moveTo(cx - hw, baseCy);
    this.ctx.lineTo(cx, baseCy + hh);
    this.ctx.lineTo(cx, baseCy + hh + 5);
    this.ctx.lineTo(cx - hw, baseCy + 5);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = '#1e293b';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, baseCy + hh);
    this.ctx.lineTo(cx + hw, baseCy);
    this.ctx.lineTo(cx + hw, baseCy + 5);
    this.ctx.lineTo(cx, baseCy + hh + 5);
    this.ctx.closePath();
    this.ctx.fill();

    // 2. Building Left Facade (Light Tint Glass & Architectural Steel)
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

    // 3. Building Right Facade (Darker Isometric Side)
    const rightGrad = this.ctx.createLinearGradient(cx, topCy, cx + towerW, baseCy);
    rightGrad.addColorStop(0, '#94a3b8');
    rightGrad.addColorStop(1, '#475569');

    this.ctx.fillStyle = rightGrad;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy + towerH);
    this.ctx.lineTo(cx + towerW, topCy);
    this.ctx.lineTo(cx + towerW, baseCy);
    this.ctx.lineTo(cx, baseCy + towerH);
    this.ctx.closePath();
    this.ctx.fill();

    // 4. Rooftop (Top Isometric Face)
    this.ctx.fillStyle = this.currentWeather === 'snow' ? '#ffffff' : '#f1f5f9';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy - towerH);
    this.ctx.lineTo(cx + towerW, topCy);
    this.ctx.lineTo(cx, topCy + towerH);
    this.ctx.lineTo(cx - towerW, topCy);
    this.ctx.closePath();
    this.ctx.fill();

    // Rooftop Inner Helipad / Solar Panel Frame
    this.ctx.fillStyle = '#475569';
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy - towerH + 6);
    this.ctx.lineTo(cx + towerW - 10, topCy + 2);
    this.ctx.lineTo(cx, topCy + towerH - 6);
    this.ctx.lineTo(cx - towerW + 10, topCy + 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Rooftop Spire & Beacon
    this.ctx.strokeStyle = '#94a3b8';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, topCy);
    this.ctx.lineTo(cx, topCy - 28);
    this.ctx.stroke();

    const beaconAlpha = 0.4 + Math.sin(this.weatherTick * 5) * 0.5;
    this.ctx.fillStyle = `rgba(239, 68, 68, ${beaconAlpha})`;
    this.ctx.beginPath();
    this.ctx.arc(cx, topCy - 29, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // 5. Windows on Left Facade (5 Floors, 3 Windows per floor)
    const numFloors = 5;
    const floorStep = Math.round(20 * buildingScale);
    const winW = Math.round(10 * buildingScale);
    const winH = Math.round(12 * buildingScale);

    for (let f = 0; f < numFloors; f++) {
      const fy = topCy + 24 + f * floorStep;
      for (let w = 0; w < 3; w++) {
        const wx = cx - Math.round(44 * buildingScale) + w * Math.round(14 * buildingScale);
        const wy = fy - (3 - w) * Math.round(5 * buildingScale);

        let winColor = '#38bdf8';
        if (this.currentWeather === 'fireworks') {
          winColor = ((f + w) % 2 === 0) ? '#fde047' : '#38bdf8';
        } else if (this.currentWeather === 'rain') {
          winColor = '#0284c7';
        }

        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(wx - 1, wy - 1, winW + 2, winH + 2);

        this.ctx.fillStyle = winColor;
        this.ctx.fillRect(wx, wy, winW, winH);

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        this.ctx.fillRect(wx + 1, wy + 1, Math.max(1, winW * 0.3), winH - 2);
      }
    }

    // 6. Windows on Right Facade
    for (let f = 0; f < numFloors; f++) {
      const fy = topCy + 24 + f * floorStep;
      for (let w = 0; w < 3; w++) {
        const wx = cx + Math.round(10 * buildingScale) + w * Math.round(14 * buildingScale);
        const wy = fy + w * Math.round(5 * buildingScale);

        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(wx - 1, wy - 1, winW + 2, winH + 2);

        this.ctx.fillStyle = '#0369a1';
        this.ctx.fillRect(wx, wy, winW, winH);
      }
    }

    // 7. Glass Entrance Canopy on Ground Floor
    const gy = baseCy - 2;
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(cx - 14, gy + 2, 16, 18);

    this.ctx.fillStyle = '#38bdf8';
    this.ctx.fillRect(cx - 12, gy + 4, 12, 14);

    this.ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 18, gy - 2);
    this.ctx.lineTo(cx + 4, gy + 7);
    this.ctx.lineTo(cx - 8, gy + 12);
    this.ctx.lineTo(cx - 30, gy + 3);
    this.ctx.closePath();
    this.ctx.fill();

    // 8. Cyber Glowing Neon Sign at Top Facade: "PxO AI SOFT"
    this.ctx.save();
    this.ctx.font = `bold ${Math.round(8 * buildingScale)}px monospace`;
    this.ctx.textAlign = 'center';
    
    this.ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    this.ctx.fillText('PxO AI SOFT', cx - 20 * buildingScale, topCy + 18);

    this.ctx.fillStyle = '#38bdf8';
    this.ctx.fillText('PxO AI SOFT', cx - 21 * buildingScale, topCy + 17);
    this.ctx.restore();
  }

  _drawSeasonalHillEnvironment() {
    const cx = this.width / 2;
    const peakY = this.height * 0.52;

    if (this.currentWeather === 'snow') {
      // Draw Pixel Snowman on the hill terrace!
      const smX = cx + 45;
      const smY = peakY + 10;

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.beginPath();
      this.ctx.ellipse(smX, smY + 3, 7, 3, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(smX, smY, 6.5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(smX, smY - 7, 5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(smX, smY - 14, 3.5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(smX - 1.5, smY - 15, 1, 1);
      this.ctx.fillRect(smX + 1, smY - 15, 1, 1);

      this.ctx.fillStyle = '#ea580c';
      this.ctx.fillRect(smX - 1, smY - 13.5, 2.5, 1);

      this.ctx.fillStyle = '#ef4444';
      this.ctx.fillRect(smX - 4, smY - 11, 8, 2);
      this.ctx.fillRect(smX + 1, smY - 9, 2, 5);

      this.ctx.fillStyle = '#1e293b';
      this.ctx.fillRect(smX - 4, smY - 18, 8, 1.5);
      this.ctx.fillRect(smX - 2.5, smY - 22, 5, 4);

    } else if (this.currentWeather === 'autumn') {
      // Piles of fallen leaves on grassy hilltop
      const leafColors = ['#ea580c', '#d97706', '#dc2626', '#b45309'];
      for (let i = 0; i < 22; i++) {
        const lx = cx - 60 + (i * 11) % 120;
        const ly = peakY + 6 + (i * 7) % 35;
        this.ctx.fillStyle = leafColors[i % leafColors.length];
        this.ctx.fillRect(lx, ly, 3, 2);
      }
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
