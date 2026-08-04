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
    const toggleMenu = function () {
      const isOpen = navLinks.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };
    menuToggle.addEventListener('click', toggleMenu);
    menuToggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggleMenu();
      }
    });
    // Close the menu after a link is tapped (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
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
  const CONTACT_EMAIL = 'angel.med1@outlook.com';
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

  // ---- Stat detail modals (Publications / Presentations / Honors) ----
  const statModalOpeners = document.querySelectorAll('[data-modal]');
  const openStatModal = function (modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.stat-modal-close');
    if (closeBtn) closeBtn.focus();
  };
  const closeStatModal = function (modal) {
    modal.hidden = true;
    document.body.style.overflow = '';
  };
  statModalOpeners.forEach(function (opener) {
    const modal = document.getElementById(opener.getAttribute('data-modal'));
    opener.addEventListener('click', function () { openStatModal(modal); });
    opener.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        openStatModal(modal);
      }
    });
  });
  document.querySelectorAll('.stat-modal-overlay').forEach(function (overlay) {
    const closeBtn = overlay.querySelector('.stat-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', function () { closeStatModal(overlay); });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeStatModal(overlay);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.stat-modal-overlay').forEach(function (overlay) {
      if (!overlay.hidden) closeStatModal(overlay);
    });
  });

  // ---- Reading progress bar + back-to-top button ----
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  document.body.appendChild(progressBar);

  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  let scrollTicking = false;
  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    progressBar.style.width = progress + '%';
    backToTop.classList.toggle('visible', scrollTop > 500);
    scrollTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollUI);
      scrollTicking = true;
    }
  }, { passive: true });
  updateScrollUI();

  // ---- Copy citation buttons ----
  document.querySelectorAll('.copy-citation-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const citation = btn.getAttribute('data-citation') || '';
      const showCopied = function () {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.innerHTML = original;
          btn.classList.remove('copied');
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(citation).then(showCopied).catch(function () {});
      } else {
        // Fallback for browsers without the Clipboard API
        const temp = document.createElement('textarea');
        temp.value = citation;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        try { document.execCommand('copy'); showCopied(); } catch (err) {}
        document.body.removeChild(temp);
      }
    });
  });

  // ---- Photo lightbox for media card thumbnails ----
  const lightboxTriggers = document.querySelectorAll('.media-thumb[data-lightbox-img]');
  if (lightboxTriggers.length) {
    const lbOverlay = document.createElement('div');
    lbOverlay.className = 'photo-lightbox-overlay';
    lbOverlay.hidden = true;
    lbOverlay.innerHTML =
      '<div class="photo-lightbox" role="dialog" aria-modal="true" aria-label="Photo preview">' +
        '<button type="button" class="photo-lightbox-close" aria-label="Close">&times;</button>' +
        '<img src="" alt="">' +
        '<div class="photo-lightbox-content">' +
          '<span class="media-outlet"></span>' +
          '<h3></h3>' +
          '<a href="#" target="_blank" class="media-link">Read the source <i class="fas fa-arrow-right"></i></a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(lbOverlay);

    const lbImg = lbOverlay.querySelector('img');
    const lbOutlet = lbOverlay.querySelector('.media-outlet');
    const lbTitle = lbOverlay.querySelector('h3');
    const lbLink = lbOverlay.querySelector('.media-link');
    const lbClose = lbOverlay.querySelector('.photo-lightbox-close');

    const openLightbox = function (trigger) {
      lbImg.src = trigger.getAttribute('data-lightbox-img');
      lbImg.alt = trigger.getAttribute('data-lightbox-title') || '';
      lbOutlet.textContent = trigger.getAttribute('data-lightbox-outlet') || '';
      lbTitle.textContent = trigger.getAttribute('data-lightbox-title') || '';
      lbLink.href = trigger.getAttribute('data-lightbox-link') || '#';
      lbOverlay.hidden = false;
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    };
    const closeLightbox = function () {
      lbOverlay.hidden = true;
      document.body.style.overflow = '';
    };

    lightboxTriggers.forEach(function (trigger) {
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', 'View larger photo: ' + (trigger.getAttribute('data-lightbox-title') || ''));
      trigger.addEventListener('click', function () { openLightbox(trigger); });
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(trigger); }
      });
    });
    lbClose.addEventListener('click', closeLightbox);
    lbOverlay.addEventListener('click', function (e) { if (e.target === lbOverlay) closeLightbox(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lbOverlay.hidden) closeLightbox(); });
  }

  // ---- Dark mode toggle ----
  const THEME_KEY = 'angelsheu-theme';
  const root = document.documentElement;
  const getStoredTheme = function () {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  };
  const setStoredTheme = function (theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  };
  const applyTheme = function (theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      const nextAction = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      btn.setAttribute('aria-label', nextAction);
      btn.setAttribute('title', nextAction);
    });
  };

  const stored = getStoredTheme();
  // Light mode is always the default unless the visitor has explicitly chosen dark before.
  applyTheme(stored === 'dark' ? 'dark' : 'light');

  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      setStoredTheme(next);
    });
  });
});
