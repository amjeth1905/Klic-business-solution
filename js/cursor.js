/**
 * KLIC BUSINESS SOLUTION — CUSTOM CONTEXTUAL CURSOR
 * Provides smooth inertia tracking and contextual cues for editorial agency interaction.
 */

(function () {
  'use strict';

  // Disable completely on touch devices or screens <= 1024px
  function isMobileOrTouch() {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth <= 1024;
  }

  if (isMobileOrTouch()) {
    return;
  }

  // Create cursor DOM elements
  const dot = document.createElement('div');
  dot.className = 'klic-cursor-dot';

  const follower = document.createElement('div');
  follower.className = 'klic-cursor-follower';
  follower.innerHTML = '<span class="cursor-text"></span>';

  document.body.appendChild(dot);
  document.body.appendChild(follower);

  const cursorText = follower.querySelector('.cursor-text');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX;
  let dotY = mouseY;
  let followerX = mouseX;
  let followerY = mouseY;

  let isVisible = false;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 1024) {
      if (isVisible) {
        dot.style.opacity = '0';
        follower.style.opacity = '0';
        isVisible = false;
      }
      return;
    }

    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dot.style.opacity = '1';
      follower.style.opacity = '1';
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 1024 && isVisible) {
      dot.style.opacity = '0';
      follower.style.opacity = '0';
      isVisible = false;
    }
  });

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    follower.style.opacity = '0';
    isVisible = false;
  });

  // RAF smooth interpolation
  function renderCursor() {
    // Sharp dot coordinates
    dotX += (mouseX - dotX) * 0.7;
    dotY += (mouseY - dotY) * 0.7;
    dot.style.transform = `translate(${dotX}px, ${dotY}px)`;

    // Fluid follower coordinates
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;

    requestAnimationFrame(renderCursor);
  }

  requestAnimationFrame(renderCursor);

  // Setup contextual hover listeners
  function initHoverListeners() {
    const hoverTargets = document.querySelectorAll('[data-cursor], a, button, .project-card, .service-row');

    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        const customText = target.getAttribute('data-cursor');

        if (customText) {
          cursorText.textContent = customText;
          follower.classList.add('has-text');
          follower.classList.remove('hovered');
          dot.style.opacity = '0';
        } else {
          follower.classList.add('hovered');
          follower.classList.remove('has-text');
        }
      });

      target.addEventListener('mouseleave', () => {
        follower.classList.remove('has-text', 'hovered');
        cursorText.textContent = '';
        dot.style.opacity = '1';
      });
    });
  }

  // Run on DOM load and export refresh function
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHoverListeners);
  } else {
    initHoverListeners();
  }

  window.refreshCustomCursor = initHoverListeners;
})();
