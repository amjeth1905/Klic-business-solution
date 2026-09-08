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

    const closeNav = () => {
      toggle.classList.remove('active');
      overlay.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    const openNav = () => {
      toggle.classList.add('active');
      overlay.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.contains('active');
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    // Close mobile nav on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeNav();
      }
    });

    // Close on window resize back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && overlay.classList.contains('active')) {
        closeNav();
      }
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
    'anvaya-reality': {
      title: 'Anvaya Reality Digital Flagship',
      client: 'Anvaya Reality',
      industry: 'Luxury Living & Real Estate Development',
      services: 'Website Design & Development, UI/UX Architecture, Property Showcase',
      challenge: 'Anvaya Reality required an immersive, high-performance digital presence to showcase premium residential developments and capture high-intent property investor inquiries.',
      approach: 'Designed an architectural editorial UI with smooth property galleries, micro-interactions, responsive floor plans, and streamlined consultation lead capture.',
      solution: 'High-speed custom responsive platform with mobile-first property viewing, virtual walk-through links, and optimized lead triage pipelines.',
      outcome: 'Substantial increase in qualified property investor inquiries, sub-second page loads, and elevated brand positioning in competitive luxury real estate.'
    },
    'true-north': {
      title: 'True North Marketers Growth Engine',
      client: 'True North Marketers',
      industry: 'Performance Marketing & Digital Agency',
      services: 'Paid Search, Meta Ads Strategy, High-Intent Acquisition Funnels',
      challenge: 'Scaling targeted acquisition campaigns while driving down Cost Per Lead (CPL) across saturated agency and digital marketing sectors.',
      approach: 'Engineered high-intent search ad structures, audience segment retargeting, dynamic creative ad variants, and automated lead validation.',
      solution: 'Cross-platform acquisition engine with end-to-end attribution tracking, CRM webhooks, and conversion-optimized landing pages.',
      outcome: 'Delivered consistent ROAS expansion, reduced acquisition costs by over 40%, and established a predictable pipeline.'
    },
    'kal-constructions': {
      title: 'KAL Constructions Corporate Monograph',
      client: 'KAL Constructions',
      industry: 'Civil Engineering & Commercial Infrastructure',
      services: 'Company Profile Design, Executive Tender Decks, Brand Monograph',
      challenge: 'KAL Constructions needed an institutional-grade corporate profile and capability deck to present to enterprise developers, government tenders, and institutional partners.',
      approach: 'Architected a Swiss-grid editorial publication highlighting landmark infrastructure projects, engineering capabilities, safety standards, and project milestone timelines.',
      solution: 'Produced a bespoke corporate monograph and interactive digital deck with custom infographic project breakdowns.',
      outcome: 'Directly supported major commercial infrastructure tender qualifications and established immediate authority with enterprise stakeholders.'
    },
    'greymark-agency': {
      title: 'Greymark Agency Brand Identity System',
      client: 'Greymark Agency',
      industry: 'Creative Strategy & Commercial Consultancy',
      services: 'Brand Identity Design, Typographic Systems, Visual Guidelines, Stationery',
      challenge: 'Greymark Agency needed a bold, authoritative visual identity that differentiated them in the creative advisory space and positioned them for international clientele.',
      approach: 'Created a minimalist typographic logo system, high-contrast monochrome aesthetic with purposeful accent highlights, and comprehensive brand usage guidelines.',
      solution: 'Holistic brand identity suite including digital guidelines, business stationery, client pitch decks, and social media design language.',
      outcome: 'A unified, distinguished brand presence that justified premium retainer pricing and expanded brand recognition across international markets.'
    },
    'atampara': {
      title: 'Atampara Commercial Campaign & Visual Content',
      client: 'Atampara',
      industry: 'Heritage Lifestyle, Retail & Hospitality',
      services: 'Commercial Video Production, Social Reels, Creative Direction, Product Showcase',
      challenge: 'Communicating the craftsmanship, experiential depth, and authentic appeal of Atampara to modern digital audiences across social media and digital channels.',
      approach: 'Directed high-tempo commercial reels, atmospheric cinematic video shorts, and curated lifestyle photography highlighting authentic details.',
      solution: 'Delivered a full asset library of short-form vertical video reels, promotional launch teasers, and high-retention algorithmic cutdowns.',
      outcome: 'Over 500,000 organic views across social channels, major surge in engagement, and heightened consumer demand.'
    },
    'rv-agarwal': {
      title: 'RV Agarwal Global Trade Automation',
      client: 'RV Agarwal Impex',
      industry: 'International Trade, Import-Export & Supply Chain',
      services: 'AI Solutions, Inbound Lead Triage, Multi-Market Automation',
      challenge: 'Managing hundreds of high-volume international trade enquiries across India, Middle East, Europe, and Asia with varying time zones and product specifications.',
      approach: 'Built an intelligent automated routing pipeline that parses incoming trade RFQs (Requests for Quotation), categorizes trade volume, and instantly sends tailored catalog packets.',
      solution: 'Autonomous multi-channel enquiry triage system with real-time WhatsApp Business API integration and CRM synchronisation.',
      outcome: 'Reduced inquiry response latency from 18 hours to under 90 seconds, leading to a substantial increase in verified trade order closures.'
    },
    'jss-realestate': {
      title: 'JSS Real Estate Commercial Platform',
      client: 'JSS Realestate',
      industry: 'Commercial & Residential Real Estate',
      services: 'Custom Web Platform, Listing Search Engine, Lead Generation System',
      challenge: 'Buyers and commercial tenants faced slow listing search times and cluttered navigation when exploring prime commercial and residential properties.',
      approach: 'Developed a sleek, high-speed property search interface with category filtering (commercial, retail, residential), instant inquiry buttons, and interactive maps.',
      solution: 'Responsive, mobile-optimized property catalog with quick enquiry triggers and localized search UX.',
      outcome: 'Doubled on-site inquiry rate, achieved 70% mobile visitor engagement, and streamlined broker lead assignment.'
    },
    // Aliases for backwards compatibility
    'arc-structure': {
      title: 'Anvaya Reality Digital Flagship',
      client: 'Anvaya Reality',
      industry: 'Luxury Living & Real Estate Development',
      services: 'Website Design & Development, UI/UX Architecture, Property Showcase',
      challenge: 'Anvaya Reality required an immersive, high-performance digital presence to showcase premium residential developments and capture high-intent property investor inquiries.',
      approach: 'Designed an architectural editorial UI with smooth property galleries, micro-interactions, responsive floor plans, and streamlined consultation lead capture.',
      solution: 'High-speed custom responsive platform with mobile-first property viewing, virtual walk-through links, and optimized lead triage pipelines.',
      outcome: 'Substantial increase in qualified property investor inquiries, sub-second page loads, and elevated brand positioning in competitive luxury real estate.'
    },
    'aurora-co': {
      title: 'Greymark Agency Brand Identity System',
      client: 'Greymark Agency',
      industry: 'Creative Strategy & Commercial Consultancy',
      services: 'Brand Identity Design, Typographic Systems, Visual Guidelines, Stationery',
      challenge: 'Greymark Agency needed a bold, authoritative visual identity that differentiated them in the creative advisory space and positioned them for international clientele.',
      approach: 'Created a minimalist typographic logo system, high-contrast monochrome aesthetic with purposeful accent highlights, and comprehensive brand usage guidelines.',
      solution: 'Holistic brand identity suite including digital guidelines, business stationery, client pitch decks, and social media design language.',
      outcome: 'A unified, distinguished brand presence that justified premium retainer pricing and expanded brand recognition across international markets.'
    },
    'vortex-performance': {
      title: 'True North Marketers Growth Engine',
      client: 'True North Marketers',
      industry: 'Performance Marketing & Digital Agency',
      services: 'Paid Search, Meta Ads Strategy, High-Intent Acquisition Funnels',
      challenge: 'Scaling targeted acquisition campaigns while driving down Cost Per Lead (CPL) across saturated agency and digital marketing sectors.',
      approach: 'Engineered high-intent search ad structures, audience segment retargeting, dynamic creative ad variants, and automated lead validation.',
      solution: 'Cross-platform acquisition engine with end-to-end attribution tracking, CRM webhooks, and conversion-optimized landing pages.',
      outcome: 'Delivered consistent ROAS expansion, reduced acquisition costs by over 40%, and established a predictable pipeline.'
    },
    'capital-folio': {
      title: 'KAL Constructions Corporate Monograph',
      client: 'KAL Constructions',
      industry: 'Civil Engineering & Commercial Infrastructure',
      services: 'Company Profile Design, Executive Tender Decks, Brand Monograph',
      challenge: 'KAL Constructions needed an institutional-grade corporate profile and capability deck to present to enterprise developers, government tenders, and institutional partners.',
      approach: 'Architected a Swiss-grid editorial publication highlighting landmark infrastructure projects, engineering capabilities, safety standards, and project milestone timelines.',
      solution: 'Produced a bespoke corporate monograph and interactive digital deck with custom infographic project breakdowns.',
      outcome: 'Directly supported major commercial infrastructure tender qualifications and established immediate authority with enterprise stakeholders.'
    },
    'zenith-video': {
      title: 'Atampara Commercial Campaign & Visual Content',
      client: 'Atampara',
      industry: 'Heritage Lifestyle, Retail & Hospitality',
      services: 'Commercial Video Production, Social Reels, Creative Direction, Product Showcase',
      challenge: 'Communicating the craftsmanship, experiential depth, and authentic appeal of Atampara to modern digital audiences across social media and digital channels.',
      approach: 'Directed high-tempo commercial reels, atmospheric cinematic video shorts, and curated lifestyle photography highlighting authentic details.',
      solution: 'Delivered a full asset library of short-form vertical video reels, promotional launch teasers, and high-retention algorithmic cutdowns.',
      outcome: 'Over 500,000 organic views across social channels, major surge in engagement, and heightened consumer demand.'
    },
    'nexus-ai': {
      title: 'RV Agarwal Global Trade Automation',
      client: 'RV Agarwal Impex',
      industry: 'International Trade, Import-Export & Supply Chain',
      services: 'AI Solutions, Inbound Lead Triage, Multi-Market Automation',
      challenge: 'Managing hundreds of high-volume international trade enquiries across India, Middle East, Europe, and Asia with varying time zones and product specifications.',
      approach: 'Built an intelligent automated routing pipeline that parses incoming trade RFQs (Requests for Quotation), categorizes trade volume, and instantly sends tailored catalog packets.',
      solution: 'Autonomous multi-channel enquiry triage system with real-time WhatsApp Business API integration and CRM synchronisation.',
      outcome: 'Reduced inquiry response latency from 18 hours to under 90 seconds, leading to a substantial increase in verified trade order closures.'
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
