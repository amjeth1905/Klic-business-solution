/**
 * KLIC BUSINESS SOLUTION — CORE APPLICATION LOGIC
 * Navigation, Portfolio Filtering, Modal Deep Dives, and Contact Flow.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeaderScroll();
    initMobileNav();
    initActiveNavLinks();
    initPortfolioFiltering();
    initProjectModal();
    initContactForm();
  });

  // --------------------------------------------------------------------------
  // 00. Light & Dark Theme Manager
  // --------------------------------------------------------------------------
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('klic-theme', theme);

    const toggleBtns = document.querySelectorAll('.theme-toggle');
    toggleBtns.forEach((btn) => {
      const label = btn.querySelector('.theme-label');
      if (label) {
        label.textContent = theme === 'light' ? 'DARK' : 'LIGHT';
      }
      btn.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    });
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('klic-theme');
    const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme ? savedTheme : (systemPrefersLight ? 'light' : 'dark');

    applyTheme(initialTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 01. Header Scroll Behavior
  // --------------------------------------------------------------------------
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 02. Mobile Navigation Toggle
  // --------------------------------------------------------------------------
  function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const overlay = document.querySelector('.mobile-overlay');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 03. Active Navigation Links
  // --------------------------------------------------------------------------
  function initActiveNavLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links .mobile-nav-link');

    const updateLink = (link) => {
      const href = link.getAttribute('href');
      if (
        href === currentPath ||
        (currentPath === '' && href === 'index.html') ||
        (currentPath === 'index.html' && href === './')
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    };

    desktopLinks.forEach(updateLink);
    mobileLinks.forEach(updateLink);
  }

  // --------------------------------------------------------------------------
  // 04. Portfolio Filtering Logic
  // --------------------------------------------------------------------------
  function initPortfolioFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length === 0 || projectCards.length === 0) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });

        // Trigger custom cursor refresh if available
        if (window.refreshCustomCursor) {
          window.refreshCustomCursor();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 05. Case Study Modal Data & Drawer
  // --------------------------------------------------------------------------
  const caseStudiesData = {
    'arc-structure': {
      title: 'Arc Structure Architectural Platform',
      client: 'Arc Structure Studio',
      industry: 'Architecture & Built Environment',
      services: 'Website Design & Development, UI/UX, Custom CMS',
      challenge: 'The client needed a digital flagship to represent high-profile architectural monographs with seamless editorial typography and instant image responsiveness across global devices.',
      approach: 'We developed an ultra-minimal, high-contrast digital experience prioritizing whitespace, architectural typography, and sub-100ms asset loading.',
      solution: 'Custom lightweight headless architecture with high-precision grid layouts, client project portfolios, and responsive viewing filters.',
      outcome: 'A modern, award-grade digital home recognized for its clarity, speed, and immersive architectural curation.'
    },
    'aurora-co': {
      title: 'Aurora & Co. Brand Identity',
      client: 'Aurora & Co. Strategic Advisory',
      industry: 'Executive Advisory & Luxury Services',
      services: 'Brand Identity, Typography System, Corporate Stationery',
      challenge: 'Establishing an undeniable luxury identity for an international executive consultancy without falling into generic corporate tropes.',
      approach: 'Crafted a bespoke typography hierarchy, tactile matte black stationery systems, and a cohesive digital asset suite.',
      solution: 'Comprehensive brand guidelines, custom logotype mark, tactile physical collateral specifications, and multi-market presentation templates.',
      outcome: 'A distinguished, authoritative brand presence trusted by family offices and institutional leaders across Europe and the US.'
    },
    'vortex-performance': {
      title: 'Vortex Global Lead Generation Engine',
      client: 'Vortex Technology Partners',
      industry: 'Enterprise B2B Software',
      services: 'Digital Marketing, Meta Advertising, Search Engine Marketing, SEO',
      challenge: 'Fragmented marketing channels resulted in high cost per acquisition and inconsistent pipeline quality across UK and North American markets.',
      approach: 'Consolidated performance marketing architecture with intent-targeted paid search, strategic LinkedIn retargeting, and high-conversion landing page variants.',
      solution: 'Multi-touch attribution tracking, weekly creative refreshes, and granular search query sculpting.',
      outcome: 'Substantial improvement in pipeline velocity, consistent ROAS multiplier, and higher qualification rates for the global sales team.'
    },
    'capital-folio': {
      title: 'Capital Partners Executive Profile',
      client: 'Apex Capital Consortium',
      industry: 'Private Equity & Venture',
      services: 'Company Profile, Monograph Design, Investor Pitch Decks',
      challenge: 'Presenting multi-sector portfolio performance and governance frameworks in a clear, compelling, and prestigious visual monograph.',
      approach: 'Engineered a Swiss-grid editorial layout combining bespoke data visualization, elegant typography, and structured investment thesis spreads.',
      solution: 'Digital and print-ready executive monograph featuring interactive financial tables and executive leadership breakdowns.',
      outcome: 'Decks praised by institutional LPs for visual discipline, clarity, and authoritative presentation.'
    },
    'zenith-video': {
      title: 'Zenith Global Campaign Production',
      client: 'Zenith Innovations',
      industry: 'Consumer Technology',
      services: 'Video & Content Creation, Motion Graphics, Short-Form Reels',
      challenge: 'Capturing product differentiation in rapid 15–30 second formats while preserving premium cinematic caliber.',
      approach: 'Storyboards structured around dramatic lighting, macro product reveals, and high-tempo editorial cuts.',
      solution: 'Full suite of 4K cinematic launch films, localized social cutdowns for India, UK, US, and UAE markets, and motion graphic title sequences.',
      outcome: 'Enhanced engagement rates across organic and paid channels, establishing strong brand recall.'
    },
    'nexus-ai': {
      title: 'Nexus Autonomous CRM Pipeline',
      client: 'Nexus Global Logistics',
      industry: 'Supply Chain & Operations',
      services: 'AI Solutions, Lead Automation, Workflow Optimization',
      challenge: 'Manual lead sorting and response latency were hurting inbound deal conversions across time zones.',
      approach: 'Designed an autonomous AI triage workflow parsing inbound company data, scoring purchase intent, and routing immediately into CRM pipelines.',
      solution: 'Custom LLM-powered lead enrichment with automated calendar scheduling and webhook integration.',
      outcome: 'Drastic reduction in lead response latency from hours to under 60 seconds, with zero dropped opportunities.'
    }
  };

  function initProjectModal() {
    const modal = document.querySelector('.modal-backdrop');
    if (!modal) return;

    const modalTitle = modal.querySelector('.modal-title');
    const modalClient = modal.querySelector('.modal-client');
    const modalIndustry = modal.querySelector('.modal-industry');
    const modalServices = modal.querySelector('.modal-services');
    const modalChallenge = modal.querySelector('.modal-challenge');
    const modalApproach = modal.querySelector('.modal-approach');
    const modalSolution = modal.querySelector('.modal-solution');
    const modalOutcome = modal.querySelector('.modal-outcome');
    const closeBtn = modal.querySelector('.modal-close-btn');

    const projectCards = document.querySelectorAll('.project-card[data-project-id]');

    const openModal = (projectId) => {
      const data = caseStudiesData[projectId];
      if (!data) return;

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalClient) modalClient.textContent = data.client;
      if (modalIndustry) modalIndustry.textContent = data.industry;
      if (modalServices) modalServices.textContent = data.services;
      if (modalChallenge) modalChallenge.textContent = data.challenge;
      if (modalApproach) modalApproach.textContent = data.approach;
      if (modalSolution) modalSolution.textContent = data.solution;
      if (modalOutcome) modalOutcome.textContent = data.outcome;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    projectCards.forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-project-id');
        openModal(id);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 06. Interactive Contact Form
  // --------------------------------------------------------------------------
  function initContactForm() {
    const form = document.getElementById('klicContactForm');
    if (!form) return;

    const statusEl = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#userName').value.trim();
      const email = form.querySelector('#userEmail').value.trim();
      const message = form.querySelector('#userMessage').value.trim();

      if (!name || !email || !message) {
        if (statusEl) {
          statusEl.className = 'form-status error';
          statusEl.textContent = 'Please fill in all required fields (Name, Email, and Message).';
        }
        return;
      }

      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (statusEl) {
          statusEl.className = 'form-status error';
          statusEl.textContent = 'Please enter a valid email address.';
        }
        return;
      }

      // Simulate submission feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING ENQUIRY...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'ENQUIRY SENT';
        }
        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.textContent = 'Thank you for reaching out. We have received your project details and our strategy team will connect with you within 24 hours.';
        }
        form.reset();
      }, 750);
    });
  }
})();
