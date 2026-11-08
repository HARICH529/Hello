/**
 * VENNELA'S BIRTHDAY EXPERIENCE — CORE INTERACTION CONTROLLER
 * Light Baby Pink Edition
 * Features:
 * - On-screen numeric keypad for birthday PIN (0811)
 * - Sweet water-drop & kalimba audio feedback
 * - GSAP-powered playful button dodging
 * - Interactive cake candle blowing & aerial fireworks show
 * - 3D polaroid tilt & memory lightbox
 * - Word-by-word heartfelt message reveal
 * - 3D baby-pink & gold gift box unboxing
 */

import './audio.js';
import './particles.js';

const startApp = () => {
  // ------------------------------------------------------------------------
  // 1. STATE & REFERENCES
  // ------------------------------------------------------------------------
  const state = {
    currentStage: 'stage-password',
    isUnlocked: false,
    dodgeCount: 0,
    maxDodges: 6,
    isButtonSurrendered: false,
    isCandleBlown: false,
    isGiftOpened: false,
    isLetterDelivered: false,
    activeLightboxIndex: 0
  };

  // Gallery items data for polaroids and lightbox
  const galleryItems = [
    {
      id: 1,
      title: "Radiant Sunshine",
      subtitle: "Her smile that brightens any room",
      date: "Timeless Memory",
      caption: "In your smile, the whole world finds a reason to be happier. Never stop shining, Vennela!"
    },
    {
      id: 2,
      title: "Grace & Elegance",
      subtitle: "Poise that captures hearts",
      date: "Pure Magic",
      caption: "A presence as gentle as moonlight and as warm as the morning sun."
    },
    {
      id: 3,
      title: "Endless Laughter",
      subtitle: "Unfiltered joy and silly moments",
      date: "Pure Starlight",
      caption: "The kind of laughter that echoes in memories long after the day ends."
    },
    {
      id: 4,
      title: "Unstoppable Spirit",
      subtitle: "Chasing dreams with fierce passion",
      date: "Inspiring Always",
      caption: "To someone whose strength and kindness make everyone around her believe in miracles."
    },
    {
      id: 5,
      title: "Sweet Serenity",
      subtitle: "Quiet peaceful moments of reflection",
      date: "Gentle Wonder",
      caption: "May your heart always be filled with the calm peace you bring to others."
    },
    {
      id: 6,
      title: "The Birthday Queen",
      subtitle: "Celebrating another glorious year",
      date: "Today & Always",
      caption: "Here’s to celebrating the wonderful, one-of-a-kind human being you are!"
    }
  ];

  // ------------------------------------------------------------------------
  // 2. CUSTOM CURSOR WITH MAGNETIC HOVER (DESKTOP)
  // ------------------------------------------------------------------------
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  if (cursorDot && cursorRing) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    const interactiveEls = document.querySelectorAll('button, a, input, .keypad-btn, .polaroid-card, .jump-card, .interactive-cake-box, .gift-3d-box-container');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
    });

    window.addEventListener('mousedown', () => cursorRing.classList.add('cursor-click'));
    window.addEventListener('mouseup', () => cursorRing.classList.remove('cursor-click'));
  }

  // ------------------------------------------------------------------------
  // 3. CINEMATIC STAGE TRANSITIONS & NAVIGATION
  // ------------------------------------------------------------------------
  const portalTransition = document.querySelector('.portal-transition');
  const dockBtns = document.querySelectorAll('.dock-btn');
  const floatingDock = document.querySelector('.floating-dock');

  const goToStage = (targetStageId) => {
    if (state.currentStage === targetStageId) return;

    window.soundEngine.playSparkle();

    if (portalTransition) {
      portalTransition.classList.add('active');

      setTimeout(() => {
        const currEl = document.getElementById(state.currentStage);
        if (currEl) {
          currEl.classList.add('hidden-stage');
          currEl.classList.remove('fade-in');
        }

        const targetEl = document.getElementById(targetStageId);
        if (targetEl) {
          targetEl.classList.remove('hidden-stage');
          targetEl.classList.add('fade-in');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }

        state.currentStage = targetStageId;
        updateDock(targetStageId);

        if (targetStageId === 'stage-message') {
          if (!state.isLetterDelivered) {
            resetCartoonDelivery();
          } else {
            playWordRevealAnimation();
          }
        } else if (targetStageId === 'stage-celebration') {
          window.particleEngine.explodeConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 80);
        }

        setTimeout(() => {
          portalTransition.classList.remove('active');
        }, 150);
      }, 550);
    } else {
      document.getElementById(state.currentStage)?.classList.add('hidden-stage');
      const targetEl = document.getElementById(targetStageId);
      targetEl?.classList.remove('hidden-stage');
      state.currentStage = targetStageId;
      updateDock(targetStageId);
    }
  };

  const updateDock = (stageId) => {
    dockBtns.forEach(btn => {
      if (btn.getAttribute('data-stage') === stageId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (floatingDock) {
      if (stageId === 'stage-password' || stageId === 'stage-moving-button') {
        floatingDock.style.display = 'none';
      } else {
        floatingDock.style.display = 'flex';
      }
    }
  };

  dockBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-stage');
      if (target) goToStage(target);
    });
  });

  document.querySelectorAll('.jump-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-stage');
      if (target) goToStage(target);
    });
  });

  // ------------------------------------------------------------------------
  // 4. STAGE 1: ON-SCREEN NUMERIC KEYPAD (0811 BIRTHDAY PIN)
  // ------------------------------------------------------------------------
  let enteredPin = '';
  const pinDots = [
    document.getElementById('dot-0'),
    document.getElementById('dot-1'),
    document.getElementById('dot-2'),
    document.getElementById('dot-3')
  ];
  const lockCard = document.querySelector('.lock-card');
  const errorMessage = document.querySelector('.error-message');
  const hintDob = document.getElementById('hint-dob');
  const keypadBtns = document.querySelectorAll('.keypad-btn[data-key]');
  const btnDelete = document.getElementById('key-delete');
  const btnEnter = document.getElementById('key-enter');

  const updatePinDots = () => {
    pinDots.forEach((dot, index) => {
      if (dot) {
        if (index < enteredPin.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      }
    });
  };

  const validatePin = () => {
    if (enteredPin === '0811' || enteredPin === '811') {
      // SUCCESS!
      state.isUnlocked = true;
      if (errorMessage) errorMessage.classList.remove('active');
      lockCard.classList.add('success-glow');
      window.soundEngine.playSparkle();
      window.particleEngine.explodeConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);

      setTimeout(() => {
        goToStage('stage-moving-button');
      }, 900);
    } else {
      // ERROR SHAKE
      window.soundEngine.playError();
      if (lockCard) {
        lockCard.classList.remove('shake-card');
        void lockCard.offsetWidth;
        lockCard.classList.add('shake-card');
      }
      if (errorMessage) {
        errorMessage.classList.add('active');
      }
      setTimeout(() => {
        enteredPin = '';
        updatePinDots();
      }, 600);
    }
  };

  const handleKeyPress = (digit) => {
    if (state.isUnlocked || enteredPin.length >= 4) return;
    enteredPin += digit;
    window.soundEngine.playKeypadBeep(digit);
    updatePinDots();

    if (errorMessage) errorMessage.classList.remove('active');

    // Automatically check when 4 digits entered
    if (enteredPin.length === 4) {
      setTimeout(validatePin, 200);
    }
  };

  const handleDelete = () => {
    if (state.isUnlocked || enteredPin.length === 0) return;
    enteredPin = enteredPin.slice(0, -1);
    window.soundEngine.playClick();
    updatePinDots();
    if (errorMessage) errorMessage.classList.remove('active');
  };

  keypadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      if (key !== null) handleKeyPress(key);
    });
  });

  if (btnDelete) btnDelete.addEventListener('click', handleDelete);
  if (btnEnter) btnEnter.addEventListener('click', () => {
    if (enteredPin.length > 0) validatePin();
  });

  // Physical keyboard support mirroring on-screen keypad
  window.addEventListener('keydown', (e) => {
    if (state.currentStage !== 'stage-password') return;
    if (e.key >= '0' && e.key <= '9') {
      handleKeyPress(e.key);
      const matchingBtn = document.querySelector(`.keypad-btn[data-key="${e.key}"]`);
      if (matchingBtn) {
        matchingBtn.classList.add('pressed');
        setTimeout(() => matchingBtn.classList.remove('pressed'), 150);
      }
    } else if (e.key === 'Backspace') {
      handleDelete();
    } else if (e.key === 'Enter') {
      if (enteredPin.length > 0) validatePin();
    }
  });

  // Clickable hint auto-types 0811 with cute sequential chimes
  if (hintDob) {
    hintDob.addEventListener('click', () => {
      enteredPin = '';
      updatePinDots();
      const target = ['0', '8', '1', '1'];
      target.forEach((digit, idx) => {
        setTimeout(() => {
          handleKeyPress(digit);
        }, idx * 180);
      });
    });
  }

  // ------------------------------------------------------------------------
  // 5. STAGE 2: PLAYFUL MOVING BUTTON (INTERACTIVE DODGE)
  // ------------------------------------------------------------------------
  const dodgeArena = document.querySelector('.dodge-arena');
  const movingBtn = document.getElementById('elusive-btn');
  const speechBubble = document.getElementById('button-speech-bubble');
  const attemptDisplay = document.getElementById('dodge-attempts-left');
  let isDodging = false;
  let lastDodgeTimestamp = 0;

  const dodgeMessages = [
    "Catch me if you can! 😜",          // Shift 1
    "Too slow! Try again! 🏃‍♀️",         // Shift 2
    "Almost got me! 💨",                 // Shift 3
    "You're very persistent! 🤭",        // Shift 4
    "Phew, I'm getting dizzy! 💫",       // Shift 5
    "Okay, I surrender! Click me, Vennela! 💖" // Shift 6 (Steady)
  ];

  const dodgeButton = (cursorX, cursorY) => {
    // If surrendered or in the middle of shifting, ignore!
    if (state.isButtonSurrendered || isDodging || !movingBtn || !dodgeArena) return;

    // Cooldown check: at least 550ms between shifts so each dodge is deliberate
    const now = Date.now();
    if (now - lastDodgeTimestamp < 550) return;
    lastDodgeTimestamp = now;

    isDodging = true;
    state.dodgeCount++;
    window.soundEngine.playClick();

    const remaining = Math.max(0, state.maxDodges - state.dodgeCount);
    if (attemptDisplay) {
      attemptDisplay.textContent = remaining > 0 ? `${remaining} dodges left` : `Surrendered! Click me now ✨`;
    }

    const msg = dodgeMessages[Math.min(state.dodgeCount - 1, dodgeMessages.length - 1)];
    if (speechBubble) {
      speechBubble.textContent = msg;
      speechBubble.classList.add('visible');
    }

    // On the 6th shift: glide to center and lock permanently steady!
    if (state.dodgeCount >= state.maxDodges) {
      state.isButtonSurrendered = true;

      if (typeof gsap !== 'undefined') {
        gsap.to(movingBtn, {
          left: '50%',
          top: '50%',
          xPercent: -50,
          yPercent: -50,
          rotation: 0,
          duration: 0.65,
          ease: 'elastic.out(1, 0.4)',
          onComplete: () => {
            movingBtn.classList.add('surrendered');
            movingBtn.innerHTML = `<span>✨ Open Your Birthday World ✨</span><svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            isDodging = false;
          }
        });
      } else {
        movingBtn.style.left = '50%';
        movingBtn.style.top = '50%';
        movingBtn.style.transform = 'translate(-50%, -50%)';
        movingBtn.classList.add('surrendered');
        movingBtn.innerHTML = `<span>✨ Open Your Birthday World ✨</span><svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
        isDodging = false;
      }
      return;
    }

    // Shifts 1 to 5: Pick a safe position far from the cursor across opposite quadrants
    const arenaRect = dodgeArena.getBoundingClientRect();
    const btnW = movingBtn.offsetWidth || 180;
    const btnH = movingBtn.offsetHeight || 44;
    const pad = 35;

    const minX = pad;
    const maxX = Math.max(pad, arenaRect.width - btnW - pad);
    const minY = pad;
    const maxY = Math.max(pad, arenaRect.height - btnH - pad);
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    // 8 Strategic zones across the arena
    const candidateZones = [
      { x: minX, y: minY },                     // Top-Left
      { x: maxX, y: minY },                     // Top-Right
      { x: minX, y: maxY },                     // Bottom-Left
      { x: maxX, y: maxY },                     // Bottom-Right
      { x: midX, y: minY },                     // Top-Center
      { x: midX, y: maxY },                     // Bottom-Center
      { x: minX, y: midY },                     // Center-Left
      { x: maxX, y: midY }                      // Center-Right
    ];

    const relCurX = (cursorX !== undefined) ? (cursorX - arenaRect.left) : (arenaRect.width / 2);
    const relCurY = (cursorY !== undefined) ? (cursorY - arenaRect.top) : (arenaRect.height / 2);

    // Compute distance to each candidate zone and sort descending by distance from cursor
    const scoredZones = candidateZones.map(zone => {
      const dist = Math.hypot((zone.x + btnW / 2) - relCurX, (zone.y + btnH / 2) - relCurY);
      return { ...zone, dist };
    });

    scoredZones.sort((a, b) => b.dist - a.dist);

    // Pick randomly from the top 3 furthest zones to stay far away while remaining unpredictable
    const topPicks = scoredZones.slice(0, 3);
    const selected = topPicks[Math.floor(Math.random() * topPicks.length)];

    // Slight organic jitter (±15px) so movement doesn't feel robotic
    const jitterX = (Math.random() - 0.5) * 30;
    const jitterY = (Math.random() - 0.5) * 20;
    const finalX = Math.max(minX, Math.min(maxX, selected.x + jitterX));
    const finalY = Math.max(minY, Math.min(maxY, selected.y + jitterY));
    const randomRot = (Math.random() - 0.5) * 14;

    if (typeof gsap !== 'undefined') {
      gsap.to(movingBtn, {
        left: finalX,
        top: finalY,
        xPercent: 0,
        yPercent: 0,
        rotation: randomRot,
        duration: 0.45,
        ease: 'power2.out',
        onComplete: () => {
          setTimeout(() => {
            isDodging = false;
          }, 450);
        }
      });
    } else {
      movingBtn.style.left = `${finalX}px`;
      movingBtn.style.top = `${finalY}px`;
      movingBtn.style.transform = `rotate(${randomRot}deg)`;
      setTimeout(() => {
        isDodging = false;
      }, 500);
    }
  };

  if (movingBtn && dodgeArena) {
    dodgeArena.addEventListener('mousemove', (e) => {
      if (state.isButtonSurrendered || isDodging) return;

      const btnRect = movingBtn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      if (dist < 80) {
        dodgeButton(e.clientX, e.clientY);
      }
    });

    movingBtn.addEventListener('mouseenter', (e) => {
      if (!state.isButtonSurrendered && !isDodging) {
        dodgeButton(e.clientX, e.clientY);
      }
    });

    movingBtn.addEventListener('touchstart', (e) => {
      if (!state.isButtonSurrendered && !isDodging) {
        e.preventDefault();
        const touch = e.touches[0];
        dodgeButton(touch.clientX, touch.clientY);
      }
    });

    movingBtn.addEventListener('click', (e) => {
      if (!state.isButtonSurrendered) {
        e.preventDefault();
        if (!isDodging) dodgeButton(e.clientX, e.clientY);
        return;
      }

      window.soundEngine.playFanfare();
      window.particleEngine.explodeConfetti(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 140);
      
      if (typeof gsap !== 'undefined') {
        gsap.to(movingBtn, {
          scale: 1.2,
          duration: 0.35,
          ease: 'back.out(2)',
          onComplete: () => {
            goToStage('stage-celebration');
          }
        });
      } else {
        goToStage('stage-celebration');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 6. STAGE 3: BIRTHDAY CAKE & CANDLE BLOWING & FIREWORKS
  // ------------------------------------------------------------------------
  const cakeContainer = document.querySelector('.interactive-cake-box');
  const btnBlowCandles = document.getElementById('btn-blow-candles');
  const wishGrantedBadge = document.querySelector('.wish-granted-badge');
  const btnFireworks = document.getElementById('btn-fireworks');

  const blowCandles = () => {
    if (state.isCandleBlown) return;
    state.isCandleBlown = true;

    if (cakeContainer) {
      cakeContainer.classList.add('cake-blown');
    }

    window.soundEngine.playCandleBlow();
    window.particleEngine.doubleCannonFire(160);

    if (wishGrantedBadge) {
      wishGrantedBadge.style.display = 'inline-block';
    }

    if (btnBlowCandles) {
      btnBlowCandles.innerHTML = `<span>✨ Wish Made! ✨</span>`;
      btnBlowCandles.style.pointerEvents = 'none';
      btnBlowCandles.style.opacity = '0.7';
    }
  };

  if (btnBlowCandles) btnBlowCandles.addEventListener('click', blowCandles);
  if (cakeContainer) cakeContainer.addEventListener('click', blowCandles);

  if (btnFireworks) {
    btnFireworks.addEventListener('click', () => {
      window.soundEngine.playFanfare();
      window.particleEngine.doubleCannonFire(160);
    });
  }

  // ------------------------------------------------------------------------
  // 7. STAGE 4: 3D POLAROIDS & LIGHTBOX
  // ------------------------------------------------------------------------
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');
  const lightboxPrevBtn = document.querySelector('.lightbox-prev');
  const lightboxNextBtn = document.querySelector('.lightbox-next');

  polaroidCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
    });

    card.addEventListener('click', () => {
      const id = parseInt(card.getAttribute('data-id'), 10) || 1;
      openLightbox(id - 1);
    });
  });

  const openLightbox = (index) => {
    state.activeLightboxIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[state.activeLightboxIndex];

    if (!lightboxModal) return;

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;

    const matchingCard = document.querySelector(`.polaroid-card[data-id="${item.id}"] img`);
    if (matchingCard && matchingCard.src && !matchingCard.src.includes('placeholder')) {
      if (lightboxImg) {
        lightboxImg.src = matchingCard.src;
        lightboxImg.style.display = 'block';
      }
    } else {
      if (lightboxImg) lightboxImg.style.display = 'none';
    }

    lightboxModal.classList.add('active');
    window.soundEngine.playClick();
  };

  const closeLightbox = () => {
    if (lightboxModal) lightboxModal.classList.remove('active');
    window.soundEngine.playClick();
  };

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(state.activeLightboxIndex - 1);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(state.activeLightboxIndex + 1);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(state.activeLightboxIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(state.activeLightboxIndex + 1);
  });

  // ------------------------------------------------------------------------
  // 8. STAGE 5: CARTOON DELIVERY & HEARTFELT MESSAGE
  // ------------------------------------------------------------------------
  const cartoonDeliveryStage = document.getElementById('cartoon-delivery-stage');
  const cartoonCharacter = document.getElementById('cartoon-character');
  const cartoonSpeech = document.getElementById('cartoon-speech');
  const flyingEnvelope = document.getElementById('flying-envelope');
  const btnThrowLetter = document.getElementById('btn-throw-letter');
  const bunnyArms = document.getElementById('bunny-arms');
  const letterCardContainer = document.getElementById('letter-card-container');
  const mascotCorner = document.getElementById('mascot-corner');
  const letterBody = document.querySelector('.letter-body');
  const btnReplayLetter = document.getElementById('btn-replay-letter');
  const btnReplayDelivery = document.getElementById('btn-replay-delivery');
  let wordRevealTimeline = null;
  let isThrowingLetter = false;

  const prepareWordSpans = () => {
    if (!letterBody) return;
    const rawText = letterBody.innerText.trim();
    const words = rawText.split(/\s+/);
    const highlightedWords = ['Vennela,', 'Vennela', 'radiance,', 'kindness,', 'beautiful', 'magical', 'extraordinary', 'laughter,', 'wonder', 'happiness'];

    letterBody.innerHTML = words.map(word => {
      const clean = word.replace(/[.,!]/g, '');
      const isGold = highlightedWords.includes(clean);
      const isRose = clean === 'Vennela' || clean === 'magical';
      const highlightClass = isRose ? 'highlight-rose' : (isGold ? 'highlight-gold' : '');
      return `<span class="word ${highlightClass}">${word}</span>`;
    }).join(' ');
  };

  prepareWordSpans();

  const playWordRevealAnimation = () => {
    const wordSpans = document.querySelectorAll('.letter-body .word');
    if (!wordSpans || wordSpans.length === 0) return;

    if (wordRevealTimeline) wordRevealTimeline.kill();

    window.soundEngine.playSparkle();

    if (typeof gsap !== 'undefined') {
      wordRevealTimeline = gsap.timeline();

      wordRevealTimeline.set(wordSpans, {
        opacity: 0,
        y: 20,
        filter: 'blur(8px)',
        scale: 0.85
      });

      wordRevealTimeline.to(wordSpans, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.45,
        stagger: 0.07,
        ease: 'power2.out'
      });
    } else {
      wordSpans.forEach((w, i) => {
        setTimeout(() => {
          w.style.opacity = '1';
          w.style.transform = 'translateY(0) scale(1)';
          w.style.filter = 'blur(0px)';
        }, i * 65);
      });
    }
  };

  const triggerCartoonDelivery = () => {
    if (isThrowingLetter || state.isLetterDelivered) return;
    isThrowingLetter = true;

    if (btnThrowLetter) btnThrowLetter.style.pointerEvents = 'none';

    if (cartoonSpeech) {
      cartoonSpeech.innerHTML = `<span>Catch it, Vennela! Here it comes! 💌</span>`;
    }

    window.soundEngine.playSparkle();

    if (typeof gsap !== 'undefined') {
      const throwTl = gsap.timeline({
        onComplete: () => {
          state.isLetterDelivered = true;
          isThrowingLetter = false;

          // Sound effects & confetti burst
          window.soundEngine.playFanfare();
          window.soundEngine.playSparkle();
          window.particleEngine.explodeConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 140);
          window.particleEngine.doubleCannonFire(80);

          // Hide delivery stage
          if (cartoonDeliveryStage) {
            cartoonDeliveryStage.style.display = 'none';
          }

          // Unfurl letter card with grand entrance
          if (letterCardContainer) {
            letterCardContainer.style.display = 'block';
            gsap.fromTo(letterCardContainer,
              { opacity: 0, scale: 0.8, y: 40 },
              { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: 'back.out(1.4)' }
            );
          }

          // Show mascot cheer badge in corner
          if (mascotCorner) {
            mascotCorner.classList.add('active');
            mascotCorner.style.display = 'flex';
          }

          // Trigger word-by-word reveal
          setTimeout(playWordRevealAnimation, 450);
        }
      });

      // Step 1: Character wind-up (bunny pulls arms back and squashes back)
      throwTl.to(cartoonCharacter, {
        rotation: -10,
        y: 12,
        duration: 0.35,
        ease: 'power1.inOut'
      })
      .to(bunnyArms, {
        rotation: -35,
        transformOrigin: '50% 50%',
        duration: 0.35,
        ease: 'power1.inOut'
      }, '<')
      .to(flyingEnvelope, {
        scale: 0.9,
        y: -10,
        duration: 0.35
      }, '<')

      // Step 2: Spring forward & throw!
      .to(cartoonCharacter, {
        rotation: 12,
        y: -15,
        duration: 0.22,
        ease: 'power2.out'
      })
      .to(bunnyArms, {
        rotation: 45,
        transformOrigin: '50% 50%',
        duration: 0.22,
        ease: 'power2.out'
      }, '<')

      // Step 3: Envelope launches forward towards the camera with 3D scaling & rotation
      .to(flyingEnvelope, {
        y: -220,
        scale: 3.5,
        rotation: 720,
        duration: 0.9,
        ease: 'power2.inOut'
      }, '-=0.1')

      // Step 4: Flash zoom right before dissolving into confetti
      .to(flyingEnvelope, {
        scale: 4.5,
        opacity: 0,
        duration: 0.25,
        ease: 'power1.in'
      }, '-=0.2');

    } else {
      if (cartoonDeliveryStage) cartoonDeliveryStage.style.display = 'none';
      if (letterCardContainer) {
        letterCardContainer.style.display = 'block';
        letterCardContainer.style.opacity = '1';
      }
      state.isLetterDelivered = true;
      isThrowingLetter = false;
      playWordRevealAnimation();
    }
  };

  const resetCartoonDelivery = () => {
    state.isLetterDelivered = false;
    isThrowingLetter = false;

    if (letterCardContainer) {
      letterCardContainer.style.display = 'none';
      letterCardContainer.style.opacity = '0';
    }
    if (mascotCorner) {
      mascotCorner.classList.remove('active');
      mascotCorner.style.display = 'none';
    }

    if (cartoonDeliveryStage) {
      cartoonDeliveryStage.style.display = 'flex';
      cartoonDeliveryStage.style.opacity = '1';
      cartoonDeliveryStage.style.transform = 'none';
    }

    if (btnThrowLetter) btnThrowLetter.style.pointerEvents = 'auto';

    if (typeof gsap !== 'undefined') {
      if (flyingEnvelope) gsap.set(flyingEnvelope, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
      if (bunnyArms) gsap.set(bunnyArms, { rotation: 0 });
      if (cartoonCharacter) gsap.set(cartoonCharacter, { rotation: 0, y: 0 });
    }

    if (cartoonSpeech) {
      cartoonSpeech.innerHTML = `<span>Special Delivery for Vennela! 💌</span>`;
    }
  };

  if (btnThrowLetter) {
    btnThrowLetter.addEventListener('mouseenter', () => {
      triggerCartoonDelivery();
    });
    btnThrowLetter.addEventListener('click', (e) => {
      e.preventDefault();
      triggerCartoonDelivery();
    });
  }
  if (flyingEnvelope) {
    flyingEnvelope.addEventListener('mouseenter', () => {
      triggerCartoonDelivery();
    });
    flyingEnvelope.addEventListener('click', (e) => {
      e.preventDefault();
      triggerCartoonDelivery();
    });
  }
  if (cartoonCharacter) {
    cartoonCharacter.addEventListener('click', (e) => {
      e.preventDefault();
      triggerCartoonDelivery();
    });
  }

  if (btnReplayDelivery) {
    btnReplayDelivery.addEventListener('click', () => {
      resetCartoonDelivery();
      setTimeout(triggerCartoonDelivery, 350);
    });
  }

  if (btnReplayLetter) {
    btnReplayLetter.addEventListener('click', playWordRevealAnimation);
  }

  const btnOpenGift = document.querySelector('.btn-open-gift');
  if (btnOpenGift) {
    btnOpenGift.addEventListener('click', (e) => {
      e.preventDefault();
      goToStage('stage-gift');
    });
  }

  // ------------------------------------------------------------------------
  // 9. STAGE 6: 3D GIFT BOX UNBOXING
  // ------------------------------------------------------------------------
  const gift3DContainer = document.querySelector('.gift-3d-box-container');
  const keepsakeCard = document.querySelector('.keepsake-card');
  const btnDownloadWish = document.getElementById('btn-download-wish');

  const openGiftBox = () => {
    if (state.isGiftOpened || !gift3DContainer) return;
    state.isGiftOpened = true;

    gift3DContainer.classList.add('gift-opened');
    window.soundEngine.playBoxOpen();

    const rect = gift3DContainer.getBoundingClientRect();
    window.particleEngine.explodeConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 180);

    setTimeout(() => {
      if (keepsakeCard) {
        keepsakeCard.style.display = 'block';
        window.particleEngine.doubleCannonFire(120);
      }
    }, 600);
  };

  if (gift3DContainer) {
    gift3DContainer.addEventListener('click', openGiftBox);
  }

  if (btnDownloadWish) {
    btnDownloadWish.addEventListener('click', () => {
      window.soundEngine.playSparkle();
      window.particleEngine.explodeConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);
      
      const wishText = `═══════════════════════════════════════════════════════════════
        ✨ OFFICIAL BIRTHDAY KEEPSAKE FOR VENNELA ✨
═══════════════════════════════════════════════════════════════

To Dearest Vennela,

On this wonderfully special day, celebrating another glorious year
of your extraordinary life!

🌟 FOUR GOLDEN WISHES FOR YOU:
• Infinite Joy: May your days be filled with endless reasons to smile.
• Boundless Success: May every dream and ambition flourish beyond measure.
• Lifelong Health & Magic: Cherished health, good energy, and true friendships always.
• Unshakable Love: May you always remember how deeply appreciated you are.

"Some people bring a gentle light wherever they walk, and you are 
truly one of them. The world is so much brighter simply because you are in it."

With all the love in the universe, ✨
═══════════════════════════════════════════════════════════════`;

      // 1. Copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(wishText).catch(() => {});
      }

      // 2. Trigger real file download
      try {
        const blob = new Blob([wishText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Happy-Birthday-Vennela-Keepsake.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {}

      btnDownloadWish.innerHTML = `<span>Downloaded & Copied! 💖</span>`;
      setTimeout(() => {
        btnDownloadWish.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg><span>Download Birthday Keepsake ✨</span>`;
      }, 3500);
    });
  }

  // ------------------------------------------------------------------------
  // 10. AUDIO CONTROLS & EQUALIZER
  // ------------------------------------------------------------------------
  const discBtn = document.getElementById('disc-btn');
  const volumeSlider = document.getElementById('volume-slider');
  const btnMuteFx = document.getElementById('btn-mute-fx');
  const audioEqualizer = document.querySelector('.audio-equalizer');

  if (discBtn) {
    discBtn.addEventListener('click', () => {
      const isPlaying = window.soundEngine.toggleMusic();
      if (isPlaying) {
        discBtn.classList.add('playing');
        if (audioEqualizer) audioEqualizer.classList.add('active');
      } else {
        discBtn.classList.remove('playing');
        if (audioEqualizer) audioEqualizer.classList.remove('active');
      }
    });
  }

  if (window.soundEngine) {
    window.soundEngine.onVisualizerTick((intensity) => {
      if (audioEqualizer) {
        if (window.soundEngine.isPlayingMusic) {
          audioEqualizer.classList.add('active');
        } else {
          audioEqualizer.classList.remove('active');
        }
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      window.soundEngine.setVolume(e.target.value);
    });
  }

  if (btnMuteFx) {
    btnMuteFx.addEventListener('click', () => {
      const active = window.soundEngine.toggleSfx();
      btnMuteFx.style.opacity = active ? '1' : '0.4';
      window.soundEngine.playClick();
    });
  }

  document.body.addEventListener('click', () => {
    window.soundEngine.resumeContext();
  }, { once: true });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
