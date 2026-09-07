/**
 * KLIC BUSINESS SOLUTION — MOTION DESIGN & ANIMATION ENGINE
 * Powered by GSAP, ScrollTrigger & Lenis Smooth Scroll.
 * Motion character: Calm, Premium, Cinematic, Intentional.
 */

(function () {
  'use strict';

  // Initialize smooth scroll with Lenis if loaded
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // Document Ready Animations
  document.addEventListener('DOMContentLoaded', () => {
    initGSAPAnimations();
    initMagneticButtons();
  });

  function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 01. Hero Headline & Content Reveal
    const heroElements = document.querySelectorAll('.hero-anim-item');
    if (heroElements.length > 0) {
      gsap.fromTo(
        heroElements,
        {
          opacity: 0,
          y: 36,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.15,
        }
      );
    }

    // 02. Scroll Reveals for Section Headlines
    const revealTitles = document.querySelectorAll('.reveal-on-scroll');
    revealTitles.forEach((el) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // 03. Intro Visual Progression Stagger (Brand -> Website -> Content -> Marketing -> Growth)
    const progressionSteps = document.querySelectorAll('.progression-step');
    if (progressionSteps.length > 0) {
      gsap.fromTo(
        progressionSteps,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.intro-progression-wrapper',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // 04. Service Rows Reveal
    const serviceRows = document.querySelectorAll('.service-row');
    if (serviceRows.length > 0) {
      gsap.fromTo(
        serviceRows,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.services-list-container',
            start: 'top 80%',
          },
        }
      );
    }

    // 05. Timeline Step Stagger
    const timelineSteps = document.querySelectorAll('.timeline-step');
    if (timelineSteps.length > 0) {
      gsap.fromTo(
        timelineSteps,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.timeline-process',
            start: 'top 80%',
          },
        }
      );
    }

    // 06. Global Market Map Arcs Pulse
    const marketArcs = document.querySelectorAll('.market-arc');
    if (marketArcs.length > 0) {
      gsap.fromTo(
        marketArcs,
        {
          strokeDashoffset: 100,
          opacity: 0.4,
        },
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }
      );
    }
  }

  // Subtle Magnetic Button physics on desktop
  function initMagneticButtons() {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const magneticBtns = document.querySelectorAll('.btn-klic-primary, .btn-klic-secondary');

    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        if (typeof gsap !== 'undefined') {
          gsap.to(btn, {
            x: x * 0.28,
            y: y * 0.28,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)',
          });
        }
      });
    });
  }
})();
