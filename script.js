/**
 * Omar Al-Amir Portfolio — Interactive Behaviors
 * Cinematic dark theme with smooth animations
 */

(function () {
  'use strict';

  // ========== NAVBAR SCROLL EFFECT ==========
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleNavScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ========== MOBILE MENU ==========
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  function openMobileMenu() {
    mobileMenu.classList.add('mobile-menu--open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('mobile-menu--open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMobileMenu);
  mobileClose.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
      closeMobileMenu();
    }
  });

  // ========== SCROLL REVEAL ==========
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ========== CURSOR GLOW EFFECT ==========
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;
  let isMouseMoving = false;

  // Only enable on non-touch devices
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouch && cursorGlow) {
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMouseMoving) {
        isMouseMoving = true;
        cursorGlow.classList.add('cursor-glow--active');
        requestAnimationFrame(animateGlow);
      }
    });

    document.addEventListener('mouseleave', function () {
      isMouseMoving = false;
      cursorGlow.classList.remove('cursor-glow--active');
    });

    function animateGlow() {
      if (!isMouseMoving) return;
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
  }

  // ========== SMOOTH SCROLL FOR NAV LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });

  // ========== ANIMATED STAT COUNTERS ==========
  function animateCounter(element, target, suffix) {
    suffix = suffix || '';
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * target);
      element.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // Observe stats section
  var statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var statProjects = document.getElementById('stat-projects');
          var statExperience = document.getElementById('stat-experience');
          var statSkills = document.getElementById('stat-skills');

          if (statProjects) animateCounter(statProjects, 3, '+');
          if (statExperience) animateCounter(statExperience, 2, '+');
          if (statSkills) animateCounter(statSkills, 10, '+');

          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  var heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }

  // ========== CONTACT FORM HANDLER ==========
  window.handleFormSubmit = function (e) {
    e.preventDefault();
    var form = e.target;
    var btn = form.querySelector('#contact-submit');
    var originalText = btn.innerHTML;

    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Message Sent!';
    btn.style.background = '#00C9A7';
    btn.style.boxShadow = '0 0 20px rgba(0, 201, 167, 0.3)';
    btn.disabled = true;

    setTimeout(function () {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.style.boxShadow = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  };

  // ========== ACTIVE NAV LINK ON SCROLL ==========
  var sections = document.querySelectorAll('.section, .hero');
  var navLinks = document.querySelectorAll('.navbar__link');

  var activeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + id) {
              link.style.color = 'var(--foreground)';
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px',
    }
  );

  sections.forEach(function (section) {
    activeObserver.observe(section);
  });

  // ========== TILT EFFECT ON PROJECT CARDS ==========
  var projectCards = document.querySelectorAll('.project-card');

  if (!isTouch) {
    projectCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -3;
        var rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform =
          'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // ========== TYPING EFFECT ON HERO BADGE ==========
  // Subtle glow pulse on the badge
  var heroBadge = document.querySelector('.hero__badge');
  if (heroBadge) {
    setInterval(function () {
      heroBadge.style.boxShadow = '0 0 15px rgba(94, 106, 210, 0.3)';
      setTimeout(function () {
        heroBadge.style.boxShadow = 'none';
      }, 1000);
    }, 3000);
  }
})();
