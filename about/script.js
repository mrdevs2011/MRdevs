'use strict';

/* ── DOM REFS ── */
const progressBar = document.getElementById('progressBar');
const backToTop   = document.getElementById('backToTop');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileMenuClose');

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function updateProgress() {
  const scroll = window.scrollY;
  const total  = document.documentElement.scrollHeight - window.innerHeight;
  const pct    = total > 0 ? (scroll / total) * 100 : 0;
  progressBar.style.width = pct + '%';
}

/* ============================================================
   BACK TO TOP VISIBILITY
   ============================================================ */
function updateBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  function update() {
    start += step;
    if (start >= target) { el.textContent = target + (el.dataset.suffix || ''); return; }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
let countersDone = false;
const counterObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !countersDone) {
      countersDone = true;
      document.querySelectorAll('[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target, 10), 1800);
      });
    }
  },
  { threshold: 0.3 }
);
const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObserver.observe(statsEl);

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item   = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ============================================================
   MOBILE MENU
   ============================================================ */
function openMobileMenu()  { mobileMenu.classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeMobileMenu() { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; }

hamburger.addEventListener('click', openMobileMenu);
hamburger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openMobileMenu(); });
mobileClose.addEventListener('click', closeMobileMenu);
mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) closeMobileMenu(); });

/* ============================================================
   TOOLS FILTER
   ============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const toolCards  = document.querySelectorAll('.tool-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    toolCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 200);
      }
    });
  });
});

/* ============================================================
   COPY CARD NUMBER
   ============================================================ */
function copyCard() {
  const num  = '8600123456789012';
  const btn  = document.getElementById('copyCardBtn');
  const text = document.getElementById('copyCardText');
  const write = () => showCopied(btn, text);
  if (navigator.clipboard) navigator.clipboard.writeText(num).then(write);
  else {
    const ta = document.createElement('textarea');
    ta.value = num; ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy');
    document.body.removeChild(ta); write();
  }
}
function showCopied(btn, text) {
  text.textContent = 'Nusxalandi!';
  btn.style.borderColor = '#85e89d';
  btn.style.color       = '#85e89d';
  setTimeout(() => {
    text.textContent  = 'Karta raqamini nusxalash';
    btn.style.borderColor = ''; btn.style.color = '';
  }, 2400);
}
const cardNumEl = document.getElementById('cardNumber');
if (cardNumEl) cardNumEl.addEventListener('click', copyCard);

/* ============================================================
   ACTIVE NAV LINK ON SCROLL
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) link.classList.add('active');
    }
  });
}

/* ============================================================
   MAIN SCROLL HANDLER
   ============================================================ */
window.addEventListener('scroll', () => {
  updateProgress();
  updateBackToTop();
  updateActiveNav();
}, { passive: true });

/* ============================================================
   STAGGER TOOL CARDS
   ============================================================ */
document.querySelectorAll('.tool-card').forEach((card, i) => {
  card.style.transitionDelay = (i % 4 * 0.06) + 's';
});

/* ============================================================
   SMOOTH HASH NAVIGATION
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   OTP DEMO ANIMATION (MRDEV ID bo'limi)
   ============================================================ */
function runOtpDemo() {
  const boxes = document.querySelectorAll('.otp-box-demo');
  if (!boxes.length) return;

  const codes = ['4', '2', '8', '', '', ''];
  let idx = 0;
  boxes.forEach(b => { b.classList.remove('filled', 'active'); b.textContent = ''; });

  function fillNext() {
    if (idx > 0) {
      boxes[idx - 1].classList.remove('active');
      boxes[idx - 1].classList.add('filled');
    }
    if (idx < codes.filter(c => c).length) {
      boxes[idx].textContent = '';
      boxes[idx].classList.add('active');
      setTimeout(() => {
        boxes[idx].textContent = codes[idx];
        idx++;
        setTimeout(fillNext, 380);
      }, 320);
    } else {
      // Show filled state briefly, then clear
      setTimeout(() => {
        boxes.forEach(b => { b.classList.remove('filled', 'active'); b.textContent = ''; });
        idx = 0;
        setTimeout(fillNext, 600);
      }, 2200);
    }
  }
  fillNext();
}

// Start OTP demo when section is visible
const otpObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      runOtpDemo();
      otpObserver.disconnect();
    }
  },
  { threshold: 0.3 }
);
const otpSection = document.querySelector('.mrdev-id-section');
if (otpSection) otpObserver.observe(otpSection);

/* ============================================================
   HASH ON PAGE LOAD (for direct linking like about/#mrdev-id)
   ============================================================ */
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      setTimeout(() => {
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 400);
    }
  }
});

/* ============================================================
   INIT
   ============================================================ */
updateProgress();
updateBackToTop();
