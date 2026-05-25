/* =============================================
   app.js — GSAP + tsParticles + canvas-confetti
   Angie 💙 Date Proposal
============================================= */

'use strict';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let currentMonth = 4;   // 0-indexed: 4 = May
let currentYear  = 2026;
const MIN_MONTH  = 4;   // May
const MAX_MONTH  = 5;   // June
let selectedDate = null;
let selectedTime = null;

const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];
const DAYS_ES_FULL = [
  'domingo','lunes','martes','miércoles','jueves','viernes','sábado'
];
const MONTHS_ES_FULL = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre'
];

const TIME_SLOTS_WEEKDAY = [
  '5:00 PM','5:30 PM','6:00 PM','6:30 PM',
  '7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM',
];
const TIME_SLOTS_WEEKEND = [
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM',
  '5:00 PM','5:30 PM','6:00 PM','6:30 PM',
  '7:00 PM','7:30 PM','8:00 PM',
];

function getTimeSlotsForDate(date) {
  const dow = date.getDay(); // 0=Sun, 6=Sat
  return (dow === 0 || dow === 6) ? TIME_SLOTS_WEEKEND : TIME_SLOTS_WEEKDAY;
}

// GSAP CustomEase
CustomEase.create('bounce', 'M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,1.002 0.818,0.968 0.886,0.984 0.954,1 1,1 1,1');

// ─────────────────────────────────────────────
// tsParticles — Starfield + Hearts Background
// ─────────────────────────────────────────────
async function initParticles() {
  await tsParticles.load('tsparticles', {
    fullScreen: { enable: false },
    background: {
      color: { value: '#060c20' },
    },
    backgroundMask: { enable: false },
    detectRetina: true,
    fpsLimit: 60,
    particles: {
      number: { value: 160, density: { enable: true, area: 800 } },
      color: {
        value: ['#ffffff', '#4a9eff', '#ff6b9d', '#a855f7'],
      },
      shape: {
        type: ['circle', 'char'],
        character: [
          { value: '💙', font: 'Verdana', style: '', weight: '400' },
          { value: '✨', font: 'Verdana', style: '', weight: '400' },
          { value: '🌸', font: 'Verdana', style: '', weight: '400' },
        ],
      },
      opacity: {
        value: { min: 0.1, max: 0.7 },
        animation: { enable: true, speed: 0.8, minimumValue: 0.1, sync: false },
      },
      size: {
        value: { min: 1, max: 3 },
        animation: { enable: true, speed: 1.5, minimumValue: 0.5, sync: false },
      },
      links: { enable: false },
      move: {
        enable: true,
        speed: { min: 0.2, max: 0.8 },
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
        attract: { enable: false },
      },
      twinkle: {
        particles: { enable: true, frequency: 0.05, opacity: 1 },
      },
    },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
        resize: true,
      },
    },
  });
}

// ─────────────────────────────────────────────
// STAGE 1 ENTRANCE — GSAP Timeline
// ─────────────────────────────────────────────
function initStage1() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Stitch hero bounce in
  tl.from('#stitch-hero', {
    scale: 0,
    rotation: -15,
    duration: 0.8,
    ease: 'bounce',
  })

  // Sparkles fan out
  .from('.sp', {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'back.out(2)',
  }, '-=0.3')

  // Title slide down
  .to('#s1-title', {
    opacity: 1,
    y: 0,
    duration: 0.55,
  }, '-=0.1')

  // Subtitle
  .to('#s1-sub', {
    opacity: 1,
    y: 0,
    duration: 0.45,
  }, '-=0.25')

  // Question bubble
  .to('#question-bubble', {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: 'back.out(1.4)',
  }, '-=0.15')

  // Buttons
  .to('#s1-buttons', {
    opacity: 1,
    y: 0,
    duration: 0.45,
  }, '-=0.1')

  // Hint
  .to('#hint', {
    opacity: 1,
    duration: 0.4,
  }, '-=0.1');

  // Set initial hidden states for GSAP targets
  gsap.set('#s1-title', { y: -20 });
  gsap.set('#s1-sub', { y: -15 });
  gsap.set('#question-bubble', { scale: 0.8 });
  gsap.set('#s1-buttons', { y: 20 });

  // Continuous floating on Stitch
  gsap.to('#stitch-hero', {
    y: -10,
    rotation: 2,
    duration: 2.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  // Sparkles orbit
  const sparks = document.querySelectorAll('.sp');
  sparks.forEach((sp, i) => {
    const angle = (i / sparks.length) * Math.PI * 2;
    gsap.to(sp, {
      x: Math.cos(angle + i) * 5,
      y: Math.sin(angle + i) * 8,
      duration: 1.8 + i * 0.3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  });

  // Angry Stitch shake animation
  gsap.to('#stitch-angry', {
    rotation: 8,
    duration: 0.18,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  // Heartbeat on YES button
  gsap.to('#btn-yes', {
    scale: 1.03,
    duration: 0.6,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  initNoButtonEscape();
}

// ─────────────────────────────────────────────
// NO BUTTON — GSAP Escape Logic (transform-based)
// ─────────────────────────────────────────────
const ESCAPE_THRESHOLD = 85;   // px — how close before it runs
const MAX_ESCAPE       = 60;   // px — max distance it moves (visible but escapable)
let   noEscapeTimer   = null;  // timeout to drift back
let   noCurrentX      = 0;
let   noCurrentY      = 0;

function tryEscapeNoBtn(pointerX, pointerY) {
  const btn  = document.getElementById('btn-no');
  if (!btn || document.getElementById('stage-1').classList.contains('hidden')) return;

  const rect    = btn.getBoundingClientRect();
  const centerX = rect.left + rect.width  / 2;
  const centerY = rect.top  + rect.height / 2;
  const dist    = Math.hypot(pointerX - centerX, pointerY - centerY);

  if (dist < ESCAPE_THRESHOLD) {
    // Direction AWAY from pointer
    const angle  = Math.atan2(centerY - pointerY, centerX - pointerX);
    // Escape proportional to how close the pointer is
    const force  = (1 - dist / ESCAPE_THRESHOLD) * MAX_ESCAPE;

    const targetX = noCurrentX + Math.cos(angle) * force;
    const targetY = noCurrentY + Math.sin(angle) * force;

    // Clamp so it never goes off screen (max MAX_ESCAPE from origin)
    const clampedX = Math.max(-MAX_ESCAPE, Math.min(MAX_ESCAPE, targetX));
    const clampedY = Math.max(-MAX_ESCAPE, Math.min(MAX_ESCAPE, targetY));

    noCurrentX = clampedX;
    noCurrentY = clampedY;

    gsap.to(btn, {
      x: clampedX,
      y: clampedY,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: true,
    });

    // Shake angry Stitch
    gsap.fromTo('#stitch-angry',
      { rotation: -10 },
      { rotation: 10, duration: 0.1, yoyo: true, repeat: 3, ease: 'none', overwrite: true }
    );

    // After 1.8s of no interaction, drift back to origin
    clearTimeout(noEscapeTimer);
    noEscapeTimer = setTimeout(() => {
      noCurrentX = 0;
      noCurrentY = 0;
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        overwrite: true,
      });
    }, 1800);
  }
}

function initNoButtonEscape() {
  // Mouse
  document.addEventListener('mousemove', (e) => {
    tryEscapeNoBtn(e.clientX, e.clientY);
  });

  // Touch move
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    tryEscapeNoBtn(t.clientX, t.clientY);
  }, { passive: true });

  // Direct tap on NO — escape immediately before they can tap it
  document.getElementById('btn-no').addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    tryEscapeNoBtn(t.clientX, t.clientY);
  }, { passive: false });
}

// ─────────────────────────────────────────────
// YES BUTTON — Go to Stage 2
// ─────────────────────────────────────────────
document.getElementById('btn-yes').addEventListener('click', () => {
  // Celebration burst
  launchMiniConfetti();

  // GSAP exit animation for Stage 1
  const tl = gsap.timeline({
    onComplete: showStage2,
  });

  tl.to('#stitch-hero', {
    scale: 1.3,
    duration: 0.3,
    ease: 'back.out(2)',
  })
  .to('#stage-1', {
    opacity: 0,
    scale: 1.05,
    duration: 0.45,
    ease: 'power2.in',
  });
});

function launchMiniConfetti() {
  const colors = ['#4a9eff','#ff6b9d','#a855f7','#ffd700','#7bbcff','#ffaecb'];
  confetti({
    particleCount: 80,
    spread: 80,
    origin: { y: 0.5 },
    colors,
    scalar: 1.1,
    shapes: ['circle', 'square'],
  });
}

// ─────────────────────────────────────────────
// STAGE 2 — Calendar
// ─────────────────────────────────────────────
function showStage2() {
  const s1 = document.getElementById('stage-1');
  const s2 = document.getElementById('stage-2');

  s1.classList.add('hidden');
  s2.classList.remove('hidden');

  renderCalendar();

  // Entrance animation
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  gsap.set(s2, { opacity: 0 });

  tl.to(s2, { opacity: 1, duration: 0.4 })
    .from('.cal-stitch-img', {
      scale: 0,
      rotation: 20,
      duration: 0.6,
      ease: 'back.out(2)',
    }, '-=0.2')
    .from('.s2-title', {
      y: -20,
      opacity: 0,
      duration: 0.45,
    }, '-=0.3')
    .from('.s2-sub', {
      y: -10,
      opacity: 0,
      duration: 0.35,
    }, '-=0.2')
    .from('.month-switcher', {
      y: 20,
      opacity: 0,
      duration: 0.4,
    }, '-=0.15')
    .from('.calendar-card', {
      y: 30,
      opacity: 0,
      duration: 0.45,
    }, '-=0.2');

  // Stitch float
  gsap.to('.cal-stitch-img', {
    y: -6,
    duration: 2.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

// ─── Calendar Rendering ───
function renderCalendar() {
  const grid  = document.getElementById('cal-grid');
  const label = document.getElementById('month-label');

  label.textContent = `${MONTHS_ES[currentMonth]} ${currentYear}`;

  const firstDay  = new Date(currentYear, currentMonth, 1).getDay();
  const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Enable/disable nav buttons
  document.getElementById('btn-prev').disabled = currentMonth <= MIN_MONTH;
  document.getElementById('btn-next').disabled = currentMonth >= MAX_MONTH;

  // Build cells
  let html = '';
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  for (let d = 1; d <= daysCount; d++) {
    const isSelec = selectedDate &&
                    selectedDate.getDate()  === d &&
                    selectedDate.getMonth() === currentMonth;

    // Cutoff logic: Dates before May 26, 2026 are past
    const isPast = currentYear === 2026 && currentMonth === 4 && d < 26;

    let cls = 'cal-day';
    if (isSelec) cls += ' selected';
    if (isPast) cls += ' past';

    const click = isPast ? '' : `onclick="selectDay(${d})"`;
    html += `<div class="${cls}" ${click}>${d}</div>`;
  }

  grid.innerHTML = html;
}

function prevMonth() {
  if (currentMonth <= MIN_MONTH) return;
  currentMonth--;
  selectedDate = null;
  selectedTime = null;
  hideTimePicker();
  hideConfirmBtn();
  renderCalendar();
  gsap.fromTo('.calendar-card', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
}

function nextMonth() {
  if (currentMonth >= MAX_MONTH) return;
  currentMonth++;
  selectedDate = null;
  selectedTime = null;
  hideTimePicker();
  hideConfirmBtn();
  renderCalendar();
  gsap.fromTo('.calendar-card', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
}

function selectDay(day) {
  selectedDate = new Date(currentYear, currentMonth, day);
  selectedTime = null;
  renderCalendar();
  showTimePicker();
  hideConfirmBtn();

  // Micro bounce on selected cell
  const cells = document.querySelectorAll('.cal-day.selected');
  cells.forEach(cell => {
    gsap.fromTo(cell,
      { scale: 1.25 },
      { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' }
    );
  });
}

// ─── Time Picker ───
function showTimePicker() {
  const tp    = document.getElementById('time-picker');
  const slots = document.getElementById('time-slots');
  tp.style.display = 'block';

  // Dynamic slots based on weekday vs weekend
  const times = getTimeSlotsForDate(selectedDate);
  const dow   = selectedDate.getDay();
  const typeLabel = (dow === 0 || dow === 6) ? '(fin de semana 🎉)' : '(entre semana 💼)';

  document.querySelector('.time-label').textContent = `¿A qué hora? ⏰ ${typeLabel}`;

  slots.innerHTML = times.map(t => `
    <button class="time-slot" onclick="selectTime('${t}')">${t}</button>
  `).join('');

  // We use CSS animation instead of GSAP stagger for reliability on mobile
  
  gsap.from('#time-picker', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out',
  });
}

function hideTimePicker() {
  document.getElementById('time-picker').style.display = 'none';
}

function selectTime(time) {
  selectedTime = time;

  document.querySelectorAll('.time-slot').forEach(el => {
    el.classList.toggle('selected', el.textContent.trim() === time);
  });

  const selected = document.querySelector('.time-slot.selected');
  if (selected) {
    gsap.fromTo(selected,
      { scale: 1.15 },
      { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.4)' }
    );
  }

  showConfirmBtn();
}

function showConfirmBtn() {
  const btn = document.getElementById('btn-confirm');
  btn.style.display = 'block';
  gsap.fromTo(btn,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' }
  );
}

function hideConfirmBtn() {
  document.getElementById('btn-confirm').style.display = 'none';
}

// ─────────────────────────────────────────────
// STAGE 3 — Confirmation
// ─────────────────────────────────────────────
function goToStage3() {
  if (!selectedDate || !selectedTime) return;

  // Big celebration
  launchFullConfetti();

  const tl = gsap.timeline({ onComplete: showStage3 });
  tl.to('#btn-confirm', { scale: 1.15, duration: 0.2, ease: 'power2.out' })
    .to('#stage-2', { opacity: 0, duration: 0.4, ease: 'power2.in' });
}

function showStage3() {
  document.getElementById('stage-2').classList.add('hidden');
  const s3 = document.getElementById('stage-3');
  s3.classList.remove('hidden');

  // Fill confirmation data
  const dow   = DAYS_ES_FULL[selectedDate.getDay()];
  const day   = selectedDate.getDate();
  const month = MONTHS_ES_FULL[selectedDate.getMonth()];
  const year  = selectedDate.getFullYear();

  document.getElementById('cc-date').textContent = `${dow} ${day} de ${month} de ${year}`;
  document.getElementById('cc-time').textContent  = selectedTime;

  // Build WhatsApp link
  const msg = encodeURIComponent(
    `💙 ¡Hola! Soy Angie 🌸\n\n` +
    `Acepto tu invitación 😊🎉\n` +
    `Nos vemos el ${dow} ${day} de ${month} a las ${selectedTime}.\n\n` +
    `(Stitch también está feliz 💙)`
  );
  document.getElementById('btn-whatsapp').href = `https://api.whatsapp.com/send?phone=50684349442&text=${msg}`;

  // Entrance animation
  gsap.set(s3, { opacity: 0 });
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to(s3, { opacity: 1, duration: 0.4 })
    .from('.s3-stitch-img', {
      scale: 0,
      rotation: 15,
      duration: 0.7,
      ease: 'back.out(2)',
    }, '-=0.2')
    .from('.s3-title', {
      y: -20,
      opacity: 0,
      duration: 0.5,
    }, '-=0.3')
    .from('.confirm-card', {
      y: 30,
      opacity: 0,
      duration: 0.45,
    }, '-=0.25')
    .from('#btn-whatsapp', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(2)',
      onComplete: () => {
        // Continuous pulsating heartbeat effect on the WhatsApp button
        gsap.to('#btn-whatsapp', {
          scale: 1.05,
          duration: 1.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, '-=0.1')
    .from('.final-msg', {
      y: 20,
      opacity: 0,
      duration: 0.4,
    }, '-=0.1');

  // Stitch float
  gsap.to('.s3-stitch-img', {
    y: -8,
    duration: 2.4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  // Heartbeat
  gsap.to('.heartbeat', {
    scale: 1.35,
    duration: 0.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  // Continuous confetti trickle
  scheduleConfettiTrickle();
}

// ─────────────────────────────────────────────
// CONFETTI — canvas-confetti
// ─────────────────────────────────────────────
function launchFullConfetti() {
  const colors = ['#4a9eff','#ff6b9d','#a855f7','#ffd700','#7bbcff','#ffaecb','#22c55e'];

  // Left cannon
  confetti({
    particleCount: 100,
    angle: 60,
    spread: 60,
    origin: { x: 0, y: 0.65 },
    colors,
    scalar: 1.2,
  });

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.65 },
      colors,
      scalar: 1.2,
    });
  }, 200);

  // Center burst
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.45 },
      colors,
      scalar: 1.0,
      shapes: ['circle'],
    });
  }, 400);
}

let confettiTrickleInterval = null;

function scheduleConfettiTrickle() {
  const colors = ['#4a9eff','#ff6b9d','#a855f7','#ffd700'];
  confettiTrickleInterval = setInterval(() => {
    confetti({
      particleCount: 6,
      spread: 55,
      origin: { y: 0, x: Math.random() },
      colors,
      gravity: 0.6,
      scalar: 0.8,
      drift: Math.random() - 0.5,
    });
  }, 1200);
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  // Init particle background
  await initParticles();

  // Animate particle bg gradient overlay
  gsap.to('#tsparticles', {
    opacity: 1,
    duration: 1.2,
    ease: 'power2.out',
  });

  // Start Stage 1
  initStage1();
});

// Expose calendar nav to HTML onclick
window.prevMonth  = prevMonth;
window.nextMonth  = nextMonth;
window.goToStage3 = goToStage3;

