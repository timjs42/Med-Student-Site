// ==========================================================================
// Angel Sheu — Medical Student Portfolio
// Single shared script for every page. Each block checks that its elements
// exist before wiring anything up, so this file is safe to include on every
// page regardless of which components that page actually has.
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mobile navigation toggle ----
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
    });
    // Close the menu after a link is tapped (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
      });
    });
  }

  // ---- Nav shadow once the page is scrolled ----
  const siteNav = document.querySelector('nav');
  if (siteNav) {
    const toggleNavShadow = function () {
      siteNav.style.boxShadow = window.scrollY > 8 ? '0 4px 20px rgba(31,23,41,0.08)' : 'none';
    };
    toggleNavShadow();
    window.addEventListener('scroll', toggleNavShadow, { passive: true });
  }

  // ---- Contact form (index.html) ----
  // This site has no backend, so this opens the visitor's email client with
  // the message pre-filled. Update CONTACT_EMAIL to the real address.
  // For a form that submits without opening email, wire this to a service
  // like Formspree or Netlify Forms instead.
  const CONTACT_EMAIL = 'temp placeholder';
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
  }

  // ---- FAQ accordion (contact.html) ----
  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      const faqItem = question.parentElement;
      const isOpen = faqItem.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function (item) {
        item.classList.remove('active');
        const icon = item.querySelector('.faq-question i');
        if (icon) icon.className = 'fas fa-plus';
      });
      if (!isOpen) {
        faqItem.classList.add('active');
        const icon = question.querySelector('i');
        if (icon) icon.className = 'fas fa-minus';
      }
    });
  });

  // ---- Scroll-reveal for cards, timeline items, and media cards ----
  const revealTargets = document.querySelectorAll('.card, .contact-cta, .media-card');
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    // No IntersectionObserver support, or the visitor prefers reduced motion:
    // just show everything immediately.
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }
});
