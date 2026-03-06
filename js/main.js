/* ============================================================
   OLLIE'S STRATEGIC GROUP — Main JavaScript
   Handles: Navbar, Scroll Reveal, Particles, Lightbox,
            Mobile Menu, Form, Back-to-Top
   ============================================================ */

// ---- PAGE LOADER ----
(function () {
  const loaderHTML = `
    <div id="page-loader">
      <div class="loader-logo">Ollie's Strategic Group</div>
      <div class="loader-bar"><div class="loader-bar-fill"></div></div>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', loaderHTML);
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('page-loader');
      if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 700); }
    }, 900);
  });
})();

// ---- NAVBAR ----
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const navLinkEls = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
  handleBackToTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- ACTIVE NAV LINK on scroll ----
function updateActiveLink () {
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    const el = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!el) return;
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      navLinkEls.forEach(l => l.classList.remove('active'));
      el.classList.add('active');
    }
  });
}

// ---- SCROLL REVEAL ----
function setupScrollReveal () {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', setupScrollReveal);

// ---- HERO PARTICLES ----
function createParticles () {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size      = Math.random() * 4 + 1;
    const left      = Math.random() * 100;
    const duration  = Math.random() * 20 + 15;
    const delay     = Math.random() * 15;
    const opacity   = Math.random() * 0.25 + 0.05;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      bottom:-10px;
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      opacity:0;
      --base-opacity:${opacity};
    `;
    container.appendChild(p);
  }
}
createParticles();

// ---- LIGHTBOX ----
function openLightbox (src, caption) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  img.src   = src;
  img.alt   = caption;
  cap.textContent = caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox () {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// make functions global
window.openLightbox  = openLightbox;
window.closeLightbox = closeLightbox;

// ---- BACK TO TOP ----
const backToTop = document.getElementById('back-to-top');
function handleBackToTop () {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

// ---- CONTACT FORM ----
function handleFormSubmit (e) {
  e.preventDefault();
  const btn     = document.getElementById('form-submit-btn');
  const success = document.getElementById('form-success');
  const form    = document.getElementById('contact-form');

  // Show loading state
  btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
  btn.disabled  = true;

  // Simulate submission (replace with real backend endpoint or Formspree)
  setTimeout(() => {
    btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
    success.style.display = 'flex';
    form.reset();
    setTimeout(() => {
      btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      btn.disabled  = false;
    }, 4000);
  }, 1800);
}
window.handleFormSubmit = handleFormSubmit;

// ---- SMOOTH SCROLL for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// ---- ANIMATED COUNTERS (stats) ----
function animateCounters () {
  const counters = document.querySelectorAll('.about-stat-num, .stat-number');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const rawText = el.textContent.trim();
      const numMatch = rawText.match(/(\d+)/);
      if (!numMatch) return;
      const target  = parseInt(numMatch[1]);
      const suffix  = rawText.replace(/\d+/, '');
      let current   = 0;
      const step    = Math.ceil(target / 40);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current + suffix;
      }, 40);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}
document.addEventListener('DOMContentLoaded', animateCounters);

// ---- NAVBAR scroll trigger on load ----
window.dispatchEvent(new Event('scroll'));
