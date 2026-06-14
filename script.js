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
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // ========== THREE.JS HERO SCENE ==========
  function initHeroScene() {
    var canvas = document.getElementById('heroScene');
    var hero = document.getElementById('hero');
    var THREE = window.THREE;

    if (!canvas || !hero || !THREE) {
      if (hero) hero.classList.add('hero--scene-fallback');
      return;
    }

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    var system = new THREE.Group();
    scene.add(system);

    var particleCount = isTouch ? 95 : 170;
    var particlePositions = new Float32Array(particleCount * 3);
    var particleColors = new Float32Array(particleCount * 3);
    var colorA = new THREE.Color(0x7b85e0);
    var colorB = new THREE.Color(0x00c9a7);
    var colorC = new THREE.Color(0xf5c16c);

    for (var i = 0; i < particleCount; i += 1) {
      var radius = 1.25 + Math.random() * 2.45;
      var angle = Math.random() * Math.PI * 2;
      var height = (Math.random() - 0.5) * 2.25;
      var spiral = angle + height * 0.85;
      var index = i * 3;
      particlePositions[index] = Math.cos(spiral) * radius;
      particlePositions[index + 1] = height;
      particlePositions[index + 2] = Math.sin(spiral) * radius - 0.35;

      var mixed = colorA.clone().lerp(i % 3 === 0 ? colorC : colorB, Math.random() * 0.9);
      particleColors[index] = mixed.r;
      particleColors[index + 1] = mixed.g;
      particleColors[index + 2] = mixed.b;
    }

    var particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    var particleMaterial = new THREE.PointsMaterial({
      size: 0.026,
      vertexColors: true,
      transparent: true,
      opacity: 0.86,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    var particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.position.set(1.15, 0.1, 0);
    system.add(particles);

    var linePositions = [];
    var linkCount = isTouch ? 52 : 96;
    for (var j = 0; j < linkCount; j += 1) {
      var start = Math.floor(Math.random() * particleCount) * 3;
      var end = Math.floor(Math.random() * particleCount) * 3;
      linePositions.push(
        particlePositions[start],
        particlePositions[start + 1],
        particlePositions[start + 2],
        particlePositions[end],
        particlePositions[end + 1],
        particlePositions[end + 2]
      );
    }

    var lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    var lineMaterial = new THREE.LineBasicMaterial({
      color: 0x50e3d8,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    var networkLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    networkLines.position.copy(particles.position);
    system.add(networkLines);

    var ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xbfc7d5,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    var ringOne = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.006, 8, 150), ringMaterial);
    ringOne.position.set(1.18, 0.02, -0.18);
    ringOne.rotation.set(1.18, 0.18, -0.42);
    system.add(ringOne);

    var ringTwo = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.004, 8, 170), ringMaterial.clone());
    ringTwo.material.opacity = 0.11;
    ringTwo.position.set(1.1, -0.02, -0.28);
    ringTwo.rotation.set(1.34, -0.32, 0.3);
    system.add(ringTwo);

    var pointer = { x: 0, y: 0 };
    if (!isTouch) {
      hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      });
      hero.addEventListener('mouseleave', function () {
        pointer.x = 0;
        pointer.y = 0;
      });
    }

    function resizeHeroScene() {
      var width = canvas.clientWidth || window.innerWidth;
      var height = canvas.clientHeight || Math.max(window.innerHeight, 640);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resizeHeroScene();
    window.addEventListener('resize', resizeHeroScene, { passive: true });

    var clock = new THREE.Clock();

    function renderHeroScene() {
      var elapsed = clock.getElapsedTime();
      system.rotation.y = elapsed * 0.045 + pointer.x * 0.08;
      system.rotation.x = pointer.y * -0.035;
      particles.rotation.z = elapsed * 0.028;
      networkLines.rotation.z = particles.rotation.z;
      ringOne.rotation.z = -elapsed * 0.11;
      ringTwo.rotation.z = elapsed * 0.075;
      renderer.render(scene, camera);

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderHeroScene);
      }
    }

    renderHeroScene();
  }

  initHeroScene();

  // ========== HERO PORTRAIT DEPTH ==========
  var heroVisual = document.getElementById('heroVisual');
  var heroSection = document.getElementById('hero');

  if (!isTouch && heroVisual && heroSection && !prefersReducedMotion) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.setProperty('--portrait-rotate-x', y * -9 + 'deg');
      heroVisual.style.setProperty('--portrait-rotate-y', x * 11 + 'deg');
      heroSection.style.setProperty('--hero-parallax-x', x * 10 + 'px');
      heroSection.style.setProperty('--hero-parallax-y', y * 10 + 'px');
    });

    heroSection.addEventListener('mouseleave', function () {
      heroVisual.style.setProperty('--portrait-rotate-x', '0deg');
      heroVisual.style.setProperty('--portrait-rotate-y', '0deg');
      heroSection.style.setProperty('--hero-parallax-x', '0px');
      heroSection.style.setProperty('--hero-parallax-y', '0px');
    });
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
        var rotateX = ((y - centerY) / centerY) * -4;
        var rotateY = ((x - centerX) / centerX) * 4;

        card.style.setProperty('--card-rotate-x', rotateX + 'deg');
        card.style.setProperty('--card-rotate-y', rotateY + 'deg');
        card.style.setProperty('--spotlight-x', x + 'px');
        card.style.setProperty('--spotlight-y', y + 'px');
      });

      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--card-rotate-x', '0deg');
        card.style.setProperty('--card-rotate-y', '0deg');
        card.style.setProperty('--spotlight-x', '50%');
        card.style.setProperty('--spotlight-y', '0%');
      });
    });
  }

  // ========== TIMELINE SCROLL ENERGY ==========
  var timeline = document.querySelector('.timeline');
  var timelineTicking = false;

  function updateTimelineProgress() {
    if (!timeline) return;
    var rect = timeline.getBoundingClientRect();
    var viewportAnchor = window.innerHeight * 0.68;
    var progress = (viewportAnchor - rect.top) / Math.max(rect.height, 1);
    var clamped = Math.min(Math.max(progress, 0), 1) * 100;
    timeline.style.setProperty('--timeline-progress', clamped + '%');
    timelineTicking = false;
  }

  if (timeline) {
    updateTimelineProgress();
    window.addEventListener(
      'scroll',
      function () {
        if (!timelineTicking) {
          timelineTicking = true;
          requestAnimationFrame(updateTimelineProgress);
        }
      },
      { passive: true }
    );
    window.addEventListener('resize', updateTimelineProgress, { passive: true });
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
