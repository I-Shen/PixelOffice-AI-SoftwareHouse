/**
 * PixelOffice AI Software House - Ultra High-Detail 2.5D Isometric Hilltop HQ Engine (v4.1)
 * Combines studio-grade ultra-detailed pixel art assets with real-time dynamic particle simulation,
 * multi-layer animated drifting clouds, shooting stars (bintang jatuh), rooftop beacon lighting,
 * and 7-season interactive weather synchronization.
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
    this.shootingStars = [];
    this.lightningAlpha = 0;
    this.lightningTimer = 0;
    this.kiteSway = 0;

    // Preload Ultra High-Detail Seasonal Images
    this.images = {
      sunny: this._loadImage('assets/hq_sunny.jpg'),
      winter: this._loadImage('assets/hq_winter.jpg'),
      autumn: this._loadImage('assets/hq_autumn.jpg'),
      night: this._loadImage('assets/hq_night.jpg'),
      starnight: this._loadImage('assets/hq_starnight.jpg')
    };

    // Multi-layer dynamic clouds (soaring across the sky)
    this.clouds = [
      { x: 15, y: 30, speed: 0.12, w: 110, h: 32 },
      { x: 150, y: 55, speed: 0.18, w: 90, h: 28 },
      { x: -30, y: 85, speed: 0.15, w: 120, h: 34 }
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

  _loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
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
    this.shootingStars = [];

    if (this.currentWeather === 'rain') {
      for (let i = 0; i < 45; i++) {
        this.particles.push({
          x: Math.random() * (this.width + 40),
          y: Math.random() * this.height,
          speed: 5.0 + Math.random() * 3.5,
          len: 8 + Math.random() * 8
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
    } else if (this.currentWeather === 'starnight') {
      // Pre-seed a shooting star
      this.spawnShootingStar();
    }
  }

  spawnShootingStar(startX = null, startY = null) {
    const x = startX !== null ? startX : (this.width * 0.2 + Math.random() * this.width * 0.7);
    const y = startY !== null ? startY : (20 + Math.random() * (this.height * 0.25));
    const speed = 4.5 + Math.random() * 3.0;
    const len = 35 + Math.random() * 30;
    this.shootingStars.push({
      x: x,
      y: y,
      vx: (speed * 0.85),
      vy: (speed * 0.52),
      len: len,
      alpha: 1.0,
      color: Math.random() > 0.4 ? '#38bdf8' : '#fde047'
    });
  }

  initInteraction() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      this.triggerBuildingPulse(clickX, clickY);
    });
  }

  triggerBuildingPulse(clickX, clickY) {
    this.beaconBlink = 1.0;
    if (this.currentWeather === 'starnight') {
      // Click anywhere to shoot a shooting star / make a wish!
      this.spawnShootingStar(clickX || this.width * 0.3, clickY || 40);
    } else if (this.currentWeather === 'fireworks' || this.currentWeather === 'sunny') {
      this.spawnFirework(clickX || this.width / 2, clickY || 70);
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

    // Update floating clouds
    this.clouds.forEach(c => {
      c.x += c.speed * (delta / 16);
      if (c.x > this.width + 80) {
        c.x = -c.w - 30;
      }
    });

    if (this.beaconBlink > 0) {
      this.beaconBlink -= delta * 0.002;
    }

    // Weather particle updates
    if (this.currentWeather === 'starnight') {
      // Spontaneous shooting stars in deep night sky
      if (Math.random() < 0.015 && this.shootingStars.length < 3) {
        this.spawnShootingStar();
      }

      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const s = this.shootingStars[i];
        s.x += s.vx * (delta / 16);
        s.y += s.vy * (delta / 16);
        s.alpha -= 0.018 * (delta / 16);
        if (s.alpha <= 0 || s.y > this.height * 0.5) {
          this.shootingStars.splice(i, 1);
        }
      }
    } else if (this.currentWeather === 'rain') {
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

    // 1. Determine active seasonal image asset
    let activeImg = this.images.sunny;
    if (this.currentWeather === 'snow') activeImg = this.images.winter;
    else if (this.currentWeather === 'autumn') activeImg = this.images.autumn;
    else if (this.currentWeather === 'fireworks') activeImg = this.images.night;
    else if (this.currentWeather === 'starnight') activeImg = this.images.starnight;
    else if (this.currentWeather === 'rain') activeImg = this.images.sunny;

    // 2. Draw Ultra High-Detail 2.5D Isometric Artwork
    if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
      // Calculate aspect ratio preserve & center
      const imgRatio = activeImg.naturalWidth / activeImg.naturalHeight;
      const canvasRatio = this.width / this.height;

      let drawW, drawH, drawX, drawY;

      if (canvasRatio > imgRatio) {
        drawW = this.width;
        drawH = this.width / imgRatio;
        drawX = 0;
        drawY = (this.height - drawH) / 2;
      } else {
        drawH = this.height;
        drawW = this.height * imgRatio;
        drawX = (this.width - drawW) / 2;
        drawY = 0;
      }

      this.ctx.drawImage(activeImg, drawX, drawY, drawW, drawH);

      // Rain / Storm darkening tint
      if (this.currentWeather === 'rain') {
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        this.ctx.fillRect(0, 0, this.width, this.height);
      }
    } else {
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // 3. Draw Real-time Floating Clouds in Upper Sky (except in deep clear starry night)
    if (this.currentWeather !== 'starnight') {
      this._drawClouds();
    }

    // 4. Draw Animated Rooftop Red Warning Beacon & Spire Glow
    this._drawSpireBeacon();

    // 5. Draw Starry Night Dynamic Shooting Stars (Bintang Jatuh)
    if (this.currentWeather === 'starnight') {
      this._drawShootingStars();
    }

    // 6. Draw Windy Season Floating Diamond Kites
    if (this.currentWeather === 'windy') {
      this._drawWindyKites();
    }

    // 7. Draw Real-time Weather Particles (Snowflakes, Rain, Autumn Leaves, Fireworks)
    this._drawWeatherParticles();

    // 8. Draw Lightning Flash
    if (this.lightningAlpha > 0.05) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha * 0.6})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  _drawClouds() {
    this.clouds.forEach(c => {
      let cloudBase = 'rgba(255, 255, 255, 0.85)';
      let cloudShade = 'rgba(226, 232, 240, 0.75)';

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

  _drawSpireBeacon() {
    const cx = this.width / 2;
    const spireY = Math.round(this.height * 0.08);

    // Blinking Aircraft Beacon & Antenna Spire Radiance
    const alpha = 0.4 + Math.sin(this.weatherTick * 5) * 0.5 + (this.beaconBlink * 0.5);
    this.ctx.fillStyle = `rgba(56, 189, 248, ${Math.min(1.0, alpha)})`;
    this.ctx.beginPath();
    this.ctx.arc(cx, spireY, 4, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = `rgba(239, 68, 68, ${Math.min(1.0, alpha * 0.9)})`;
    this.ctx.beginPath();
    this.ctx.arc(cx, spireY + 6, 2.5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  _drawShootingStars() {
    this.shootingStars.forEach(st => {
      this.ctx.save();
      const grad = this.ctx.createLinearGradient(st.x, st.y, st.x - st.len, st.y - st.len * 0.6);
      grad.addColorStop(0, `rgba(255, 255, 255, ${st.alpha})`);
      grad.addColorStop(0.3, `rgba(56, 189, 248, ${st.alpha * 0.8})`);
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 2.2;
      this.ctx.beginPath();
      this.ctx.moveTo(st.x, st.y);
      this.ctx.lineTo(st.x - st.len, st.y - st.len * 0.6);
      this.ctx.stroke();

      // Glowing bright head
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(st.x, st.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  _drawWindyKites() {
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
        this.ctx.fillRect(-2.5, -1.5, 5, 3);
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
