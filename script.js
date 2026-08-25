const header = document.querySelector('.header');
const progress = document.querySelector('.scroll-progress span');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroBackground = document.querySelector('.hero-bg');
let ticking = false;

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
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

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

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const status = event.currentTarget.querySelector('.form-status');
  status.textContent = 'Спасибо! Заявка принята. Мы свяжемся с вами в ближайшее время.';
  event.currentTarget.reset();
});
