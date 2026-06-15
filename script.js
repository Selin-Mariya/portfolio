// script.js — Theme toggle, mobile menu, smooth scroll, active nav, contact form

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  // Set current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme persistence
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') body.classList.add('dark-mode');
  updateThemeIcon();

  function updateThemeIcon(){
    if (!themeToggle) return;
    themeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
  }

  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
  });

  // Mobile menu toggle
  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('nav-open');
  });

  // Close mobile menu when nav link clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      body.classList.remove('nav-open');
      menuToggle?.setAttribute('aria-expanded','false');
    });
  });

  // Active link highlighting using IntersectionObserver
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const anchor = document.querySelector(`.nav-link[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(n => n.classList.remove('active'));
        anchor?.classList.add('active');
      }
    });
  },{root: null,rootMargin: '-40% 0px -40% 0px',threshold:0});

  sections.forEach(s => sectionObserver.observe(s));

  // Smooth scrolling for anchors (enhanced)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        target.focus({preventScroll:true});
      }
    });
  });

  // Contact form basic handling
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get('name')||'').toString().trim();
    const email = (data.get('email')||'').toString().trim();
    const message = (data.get('message')||'').toString().trim();
    if (!name || !email || !message) {
      showFeedback('Please fill out all fields.', true);
      return;
    }
    // In production, send to server or Email API. Here we simulate success.
    showFeedback('Thanks! Your message has been received.', false);
    form.reset();
  });

  function showFeedback(text, isError){
    if(!formFeedback) return;
    formFeedback.textContent = text;
    formFeedback.style.color = isError ? '#ff6b6b' : 'var(--accent)';
    setTimeout(()=>{ formFeedback.textContent = ''; }, 5000);
  }
});
