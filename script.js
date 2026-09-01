const header = document.querySelector('.header');
const progress = document.querySelector('.scroll-progress span');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const contactForm = document.querySelector('#contact-form');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroBackground = document.querySelector('.hero-bg');
const body = document.body;
const navLinks = document.querySelectorAll('a[href^="#"]');
const transitionDuration = 420;
let ticking = false;
let transitionTimer;
let menuCloseTimer;

function setMenuState(open) {
  if (!nav || !menuButton) return;

  window.clearTimeout(menuCloseTimer);

  if (open) {
    nav.classList.remove('is-closing');
    nav.classList.add('open');
    body.classList.remove('menu-closing');
    body.classList.add('menu-open');
  } else if (nav.classList.contains('open')) {
    nav.classList.add('is-closing');
    body.classList.add('menu-closing');
    menuCloseTimer = window.setTimeout(finishMenuClose, 480);
  }

  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}

function finishMenuClose() {
  nav.classList.remove('open', 'is-closing');
  body.classList.remove('menu-open', 'menu-closing');
}

function closeMenu() {
  setMenuState(false);
}

function revealPage() {
  requestAnimationFrame(() => {
    body.classList.add('is-ready');
    body.classList.remove('page-leaving');
  });
}

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  header.classList.toggle('scrolled', window.scrollY > 60);
  if (!reduceMotion && !ticking) {
    requestAnimationFrame(() => {
      const offset = Math.min(window.scrollY * 0.16, 110);
      heroBackground.style.transform = `scale(1.06) translate3d(0, ${offset}px, 0)`;
      ticking = false;
    });
    ticking = true;
  }
}

function getScrollTarget(target) {
  if (target.id === 'top') {
    return 0;
  }

  const headerOffset = header ? header.offsetHeight : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
  return Math.max(0, top);
}

function navigateToSection(link, target) {
  const hash = link.getAttribute('href');
  if (!hash || hash === '#') return;

  closeMenu();

  const scrollTarget = getScrollTarget(target);
  history.pushState(null, '', hash);

  if (reduceMotion) {
    window.scrollTo(0, scrollTarget);
    return;
  }

  body.classList.add('page-leaving');
  window.clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(() => {
    window.scrollTo({ top: scrollTarget, behavior: 'auto' });
    requestAnimationFrame(() => {
      body.classList.remove('page-leaving');
    });
  }, transitionDuration);
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', revealPage);
window.addEventListener('pageshow', revealPage);
revealPage();
onScroll();

menuButton.addEventListener('click', () => {
  setMenuState(!nav.classList.contains('open'));
});

document.addEventListener('click', event => {
  if (!nav.classList.contains('open')) return;
  if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

nav.addEventListener('animationend', event => {
  if (event.animationName === 'drawer-out') finishMenuClose();
});

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    navigateToSection(link, target);
  });
});

window.addEventListener('hashchange', () => {
  const target = document.querySelector(window.location.hash || '#top');
  if (!target || body.classList.contains('page-leaving')) return;
  if (reduceMotion) return;

  const scrollTarget = getScrollTarget(target);
  window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
const animatedItems = document.querySelectorAll('.reveal, .industry-card, .service-row, .advantages-grid article, .team-grid article, .certificate-grid button, .contacts-grid a, .partner-strip span');
animatedItems.forEach((el, index) => {
  el.classList.add('motion-item');
  el.style.setProperty('--delay', `${(index % 4) * 90}ms`);
  observer.observe(el);
});

if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.button, .presentation-download').forEach(element => {
    element.classList.add('magnetic');
    element.addEventListener('pointermove', event => {
      const box = element.getBoundingClientRect();
      const x = (event.clientX - box.left - box.width / 2) * 0.12;
      const y = (event.clientY - box.top - box.height / 2) * 0.16;
      element.style.setProperty('--mx', `${x}px`);
      element.style.setProperty('--my', `${y}px`);
    });
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--mx', '0px');
      element.style.setProperty('--my', '0px');
    });
  });
}

contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const status = event.currentTarget.querySelector('.form-status');
  status.textContent = 'Спасибо! Заявка принята. Мы свяжемся с вами в ближайшее время.';
  event.currentTarget.reset();
});
