/* ═══════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════ */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

navToggle.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  navToggle.classList.toggle('open', open);
});

function closeMenu() {
  navMobile.classList.remove('open');
  navToggle.classList.remove('open');
}

document.querySelectorAll('.nav-mobile a').forEach(a => a.addEventListener('click', closeMenu));

/* ═══════════════════════════════════════════════
   REVEAL ON SCROLL
═══════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ═══════════════════════════════════════════════
   CAROUSEL DE DEPOIMENTOS
═══════════════════════════════════════════════ */
const track        = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');

if (track) {
  const cards = Array.from(track.querySelectorAll('.dep-card'));
  let current = 0;

  function getVisible() {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function totalPages() {
    return Math.ceil(cards.length / getVisible());
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const n = totalPages();
    for (let i = 0; i < n; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Página ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(page) {
    const pages = totalPages();
    current = Math.max(0, Math.min(page, pages - 1));
    const vis   = getVisible();
    const gap   = 20;
    const cardW = cards[0].offsetWidth + gap;
    track.style.transform = `translateX(-${current * vis * cardW}px)`;
    cards.forEach((c, i) => {
      const inView = i >= current * vis && i < (current + 1) * vis;
      c.classList.toggle('active', inView);
    });
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  let autoInterval = setInterval(() => goTo((current + 1) % totalPages()), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoInterval));
  track.addEventListener('mouseleave', () => {
    autoInterval = setInterval(() => goTo((current + 1) % totalPages()), 5000);
  });

  /* Touch swipe */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? goTo(current + 1) : goTo(current - 1); }
  });

  buildDots();
  goTo(0);
  window.addEventListener('resize', () => { buildDots(); goTo(0); });
}

/* ═══════════════════════════════════════════════
   LIGHTBOX DA GALERIA
═══════════════════════════════════════════════ */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img').src;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
