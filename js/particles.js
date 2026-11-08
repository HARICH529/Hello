/**
 * VENNELA'S BIRTHDAY EXPERIENCE — PARTICLE, FIREWORKS & CONFETTI ENGINE
 * High-Performance Dual-Canvas Engine:
 * 1. Background Atmosphere: Rose petals, stardust, glowing embers, floating hearts, sparklers.
 * 2. Celebration Confetti & Aerial Fireworks: Physics-based 3D ribbons, sparkling stars, rocket fireworks!
 */

class ParticleEngine {
  constructor() {
    this.bgCanvas = document.getElementById('particles-canvas');
    this.bgCtx = this.bgCanvas ? this.bgCanvas.getContext('2d') : null;

    this.confettiCanvas = document.getElementById('confetti-canvas');
    this.confettiCtx = this.confettiCanvas ? this.confettiCanvas.getContext('2d') : null;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Atmospheric particles
    this.stars = [];
    this.petals = [];
    this.sparklers = [];

    // Confetti particles
    this.confetti = [];

    // Aerial Fireworks
    this.fireworks = [];

    // Mouse tracker
    this.mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
    this.lastMouse = { x: -1000, y: -1000 };

    this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.maxStars = this.isMobile ? 35 : 75;
    this.maxPetals = this.isMobile ? 12 : 24;

    this.init();
  }

  init() {
    if (!this.bgCanvas || !this.confettiCanvas) return;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Track mouse on desktop
    window.addEventListener('mousemove', (e) => {
      this.mouse.vx = e.clientX - this.lastMouse.x;
      this.mouse.vy = e.clientY - this.lastMouse.y;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.lastMouse.x = e.clientX;
      this.lastMouse.y = e.clientY;

      // Add golden sparkler particles on mouse move
      const speed = Math.hypot(this.mouse.vx, this.mouse.vy);
      if (speed > 4 && !this.isMobile) {
        this.addSparkler(e.clientX, e.clientY, speed);
      }
    });

    this.initBackgroundParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.bgCanvas) {
      this.bgCanvas.width = this.width;
      this.bgCanvas.height = this.height;
    }
    if (this.confettiCanvas) {
      this.confettiCanvas.width = this.width;
      this.confettiCanvas.height = this.height;
    }
  }

  initBackgroundParticles() {
    // 1. Stars & Stardust
    this.stars = [];
    for (let i = 0; i < this.maxStars; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? '#fef08a' : '#f472b6'
      });
    }

    // 2. Rose Petals
    this.petals = [];
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }
  }

  createPetal(initial = false) {
    return {
      x: Math.random() * this.width,
      y: initial ? Math.random() * this.height : -30,
      size: Math.random() * 12 + 10,
      speedY: Math.random() * 1.2 + 0.8,
      speedX: Math.random() * 0.8 - 0.4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.5,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.5 ? '#fb7185' : '#f43f5e',
      opacity: Math.random() * 0.4 + 0.5
    };
  }

  addSparkler(x, y, speed) {
    const count = Math.min(4, Math.floor(speed / 8) + 1);
    for (let i = 0; i < count; i++) {
      if (this.sparklers.length > 50) this.sparklers.shift();
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 2.5 + 0.5;
      this.sparklers.push({
        x,
        y,
        size: Math.random() * 3 + 1.5,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity + 0.5,
        color: Math.random() > 0.6 ? '#fde047' : (Math.random() > 0.3 ? '#f472b6' : '#ffffff')
      });
    }
  }

  /* ------------------------------------------------------------------------
     AERIAL FIREWORKS ENGINE
     ------------------------------------------------------------------------ */

  /**
   * Launch a glorious aerial firework rocket that explodes into sparks
   */
  launchFirework(targetX = null, targetY = null) {
    const startX = Math.random() * (this.width - 200) + 100;
    const destX = targetX !== null ? targetX : Math.random() * (this.width - 300) + 150;
    const destY = targetY !== null ? targetY : Math.random() * (this.height * 0.45) + 80;

    const colors = ['#f43f5e', '#facc15', '#a855f7', '#38bdf8', '#fb7185', '#ffffff'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    this.fireworks.push({
      x: startX,
      y: this.height,
      destX,
      destY,
      vx: (destX - startX) / 38,
      vy: (destY - this.height) / 38,
      color: chosenColor,
      trail: [],
      exploded: false
    });
  }

  explodeFireworkRocket(fw) {
    const sparkCount = this.isMobile ? 40 : 70;
    const colors = [fw.color, '#fde047', '#ffffff', '#ec4899'];

    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6.5 + 1.5;
      this.confetti.push({
        x: fw.x,
        y: fw.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.12,
        friction: 0.96,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: 'spark',
        rotation: 0,
        rotSpeed: 0,
        flip: 0,
        flipSpeed: 0,
        alpha: 1,
        life: 1.2
      });
    }
  }

  /* ------------------------------------------------------------------------
     BACKGROUND RENDERING LOOP
     ------------------------------------------------------------------------ */
  renderBackground() {
    if (!this.bgCtx) return;
    this.bgCtx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Starlight Dust
    for (let star of this.stars) {
      star.phase += star.speed;
      const opacity = 0.3 + 0.7 * (Math.sin(star.phase) * 0.5 + 0.5);

      this.bgCtx.save();
      this.bgCtx.beginPath();
      this.bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.bgCtx.fillStyle = star.color;
      this.bgCtx.globalAlpha = opacity;
      this.bgCtx.shadowBlur = 8;
      this.bgCtx.shadowColor = star.color;
      this.bgCtx.fill();
      this.bgCtx.restore();
    }

    // 2. Draw Falling Rose Petals
    for (let i = 0; i < this.petals.length; i++) {
      let p = this.petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.flip) * 0.9 + p.speedX;
      p.rotation += p.rotSpeed;
      p.flip += p.flipSpeed;

      // Mouse deflection
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.x += (dx / dist) * force * 4;
        p.y += (dy / dist) * force * 2;
      }

      if (p.y > this.height + 40 || p.x < -40 || p.x > this.width + 40) {
        this.petals[i] = this.createPetal(false);
        p = this.petals[i];
      }

      this.bgCtx.save();
      this.bgCtx.translate(p.x, p.y);
      this.bgCtx.rotate((p.rotation * Math.PI) / 180);
      this.bgCtx.scale(Math.cos(p.flip), 1);

      this.bgCtx.beginPath();
      this.bgCtx.moveTo(0, 0);
      this.bgCtx.bezierCurveTo(p.size, -p.size * 0.6, p.size * 1.5, p.size * 0.8, 0, p.size * 1.6);
      this.bgCtx.bezierCurveTo(-p.size * 1.5, p.size * 0.8, -p.size, -p.size * 0.6, 0, 0);
      this.bgCtx.fillStyle = p.color;
      this.bgCtx.globalAlpha = p.opacity;
      this.bgCtx.shadowBlur = 10;
      this.bgCtx.shadowColor = 'rgba(244, 63, 94, 0.4)';
      this.bgCtx.fill();
      this.bgCtx.restore();
    }

    // 3. Draw Sparklers
    for (let i = this.sparklers.length - 1; i >= 0; i--) {
      let s = this.sparklers[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= s.decay;

      if (s.alpha <= 0) {
        this.sparklers.splice(i, 1);
        continue;
      }

      this.bgCtx.save();
      this.bgCtx.beginPath();
      this.bgCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.bgCtx.fillStyle = s.color;
      this.bgCtx.globalAlpha = s.alpha;
      this.bgCtx.shadowBlur = 12;
      this.bgCtx.shadowColor = s.color;
      this.bgCtx.fill();
      this.bgCtx.restore();
    }
  }

  /* ------------------------------------------------------------------------
     CELEBRATION CONFETTI & EXPLOSIONS
     ------------------------------------------------------------------------ */

  explodeConfetti(x = this.width / 2, y = this.height / 2, count = 120) {
    const colors = ['#f43f5e', '#ec4899', '#c084fc', '#facc15', '#38bdf8', '#ffffff'];
    const shapes = ['ribbon', 'star', 'heart', 'circle'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.confetti.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        gravity: 0.28,
        friction: 0.96,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.15 + 0.05,
        alpha: 1,
        life: 1
      });
    }
  }

  doubleCannonFire(count = 140) {
    const colors = ['#facc15', '#f43f5e', '#a855f7', '#fb7185', '#38bdf8', '#fef08a'];

    // Left Cannon
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 18 + 10;
      this.confetti.push({
        x: 20,
        y: this.height - 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.32,
        friction: 0.98,
        size: Math.random() * 11 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.3 ? 'ribbon' : 'heart',
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.1,
        alpha: 1,
        life: 1
      });
    }

    // Right Cannon
    for (let i = 0; i < count; i++) {
      const angle = (-3 * Math.PI) / 4 + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 18 + 10;
      this.confetti.push({
        x: this.width - 20,
        y: this.height - 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.32,
        friction: 0.98,
        size: Math.random() * 11 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.3 ? 'ribbon' : 'heart',
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.1,
        alpha: 1,
        life: 1
      });
    }

    // Also launch 3 aerial rockets
    this.launchFirework(this.width * 0.3, this.height * 0.25);
    setTimeout(() => this.launchFirework(this.width * 0.7, this.height * 0.22), 300);
    setTimeout(() => this.launchFirework(this.width * 0.5, this.height * 0.18), 650);
  }

  renderConfetti() {
    if (!this.confettiCtx) return;
    this.confettiCtx.clearRect(0, 0, this.width, this.height);

    // 1. Render Aerial Firework Rockets
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      let fw = this.fireworks[i];
      fw.x += fw.vx;
      fw.y += fw.vy;

      // Draw rocket trail
      this.confettiCtx.save();
      this.confettiCtx.beginPath();
      this.confettiCtx.arc(fw.x, fw.y, 3.5, 0, Math.PI * 2);
      this.confettiCtx.fillStyle = '#ffffff';
      this.confettiCtx.shadowBlur = 14;
      this.confettiCtx.shadowColor = fw.color;
      this.confettiCtx.fill();
      this.confettiCtx.restore();

      // Check if rocket reached altitude
      if (fw.y <= fw.destY) {
        this.explodeFireworkRocket(fw);
        if (window.soundEngine) window.soundEngine.playSparkle();
        this.fireworks.splice(i, 1);
      }
    }

    // 2. Render Confetti & Sparks
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      let c = this.confetti[i];
      c.vx *= c.friction;
      c.vy = c.vy * c.friction + c.gravity;
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotSpeed;
      c.flip += c.flipSpeed;
      c.life -= 0.007;
      c.alpha = Math.max(0, c.life);

      if (c.y > this.height + 50 || c.alpha <= 0) {
        this.confetti.splice(i, 1);
        continue;
      }

      this.confettiCtx.save();
      this.confettiCtx.translate(c.x, c.y);
      this.confettiCtx.rotate((c.rotation * Math.PI) / 180);
      this.confettiCtx.scale(Math.cos(c.flip), 1);
      this.confettiCtx.globalAlpha = c.alpha;
      this.confettiCtx.fillStyle = c.color;

      if (c.shape === 'spark') {
        // Glowing Firework Spark
        this.confettiCtx.beginPath();
        this.confettiCtx.arc(0, 0, c.size, 0, Math.PI * 2);
        this.confettiCtx.shadowBlur = 10;
        this.confettiCtx.shadowColor = c.color;
        this.confettiCtx.fill();
      } else if (c.shape === 'heart') {
        const s = c.size * 0.6;
        this.confettiCtx.beginPath();
        this.confettiCtx.moveTo(0, s * 0.3);
        this.confettiCtx.bezierCurveTo(-s, -s * 0.7, -s * 1.5, s * 0.3, 0, s * 1.4);
        this.confettiCtx.bezierCurveTo(s * 1.5, s * 0.3, s, -s * 0.7, 0, s * 0.3);
        this.confettiCtx.fill();
      } else if (c.shape === 'star') {
        this.drawStar(this.confettiCtx, 0, 0, 5, c.size * 0.7, c.size * 0.35);
      } else if (c.shape === 'circle') {
        this.confettiCtx.beginPath();
        this.confettiCtx.arc(0, 0, c.size * 0.5, 0, Math.PI * 2);
        this.confettiCtx.fill();
      } else {
        this.confettiCtx.fillRect(-c.size / 2, -c.size * 0.3, c.size, c.size * 0.6);
      }

      this.confettiCtx.restore();
    }
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  animate() {
    this.renderBackground();
    this.renderConfetti();
    requestAnimationFrame(() => this.animate());
  }
}

// Global singleton instance
window.particleEngine = new ParticleEngine();
