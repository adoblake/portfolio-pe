/* Round 31.11: additive scroll storytelling, designed to fail open.
   Native links, accordion controls, project filters and translations remain untouched. */
(() => {
  'use strict';

  if (!document.querySelector('.apple-hero') ||
      !document.querySelector('.work-section') ||
      !('IntersectionObserver' in window)) return;

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const items = new Set();
  const chapters = Array.from(document.querySelectorAll('main > section'));
  const progress = document.createElement('div');
  progress.className = 'story-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.hidden = true;
  document.body.append(progress);

  function mark(selector, interval = 85) {
    document.querySelectorAll(selector).forEach((node, i) => {
      if (items.has(node)) return;
      items.add(node);
      node.setAttribute('data-story-item', '');
      node.style.setProperty('--story-delay', `${Math.min(i * interval, 290)}ms`);
      // Do not hide anything the reader already sees while the script initializes.
      const rect = node.getBoundingClientRect();
      if (rect.top < innerHeight * .97 && rect.bottom > 0) {
        node.classList.add('story-visible');
      }
    });
  }

  // Each chapter keeps its original heading and translated eyebrow.
  chapters.forEach((section, i) => {
    section.classList.add('story-chapter');
    const eyebrow = section.querySelector(
      ':scope > .section-head .eyebrow, :scope > .hero-copy .eyebrow, ' +
      ':scope > .case-copy .eyebrow, :scope > .contact-card .eyebrow, ' +
      ':scope > .simple-case-copy .eyebrow'
    );
    if (eyebrow) eyebrow.dataset.storyIndex = String(i + 1).padStart(2, '0');
  });

  // Hero elements appear in reading order, followed by chapter content and artwork.
  mark('.apple-hero .hero-copy > .eyebrow, .apple-hero .hero-copy > h1, .apple-hero .hero-copy > .lead, .apple-hero .hero-actions', 115);
  mark('.apple-hero .hero-product', 120);
  mark('.quick-read .section-head > *, .skill-update .section-head > *, .work-section .section-head > *', 90);
  mark('.quick-lanes > article', 85);
  mark('.engineering-workflow .workflow-visual, .engineering-workflow .workflow-tab', 65);
  mark('.work-section .filter-row', 0);
  mark('.work-section .project-card', 90);
  mark('.twoday-real-case .case-copy > *, .twoday-real-case .twoday-actual-showcase', 80);
  mark('.simple-case > [data-reveal], .simple-case > .case-copy, .simple-case > .case-visual', 75);
  mark('.method-section .section-head > *, .method-list > article', 85);
  mark('.contact-section .contact-card', 0);

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('story-visible');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -7% 0px', threshold: .08 });

  for (const item of items) {
    if (!item.classList.contains('story-visible')) observer.observe(item);
  }

  const feature = document.querySelector('.twoday-real-case');
  const featureImg = feature?.querySelector('.twoday-proof > img');
  let frame = 0;

  function draw() {
    frame = 0;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const fraction = Math.min(1, Math.max(0, scrollY / max));
    progress.style.transform = `scaleX(${fraction.toFixed(4)})`;

    const guide = innerHeight * .42;
    let active = null;
    for (const section of chapters) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= guide && rect.bottom >= guide) { active = section; break; }
    }
    if (!active) {
      let nearest = Infinity;
      for (const section of chapters) {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - guide);
        if (distance < nearest) { nearest = distance; active = section; }
      }
    }
    for (const section of chapters) {
      section.classList.toggle('story-chapter-active', section === active);
    }

    // Gentle depth only within the existing featured-image frame on desktop.
    if (feature && featureImg && innerWidth > 780 && !reduceMotion.matches) {
      const rect = feature.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) {
        const t = Math.max(0, Math.min(1,
          (innerHeight - rect.top) / (innerHeight + rect.height)));
        featureImg.style.setProperty('--story-image-shift',
          `${((t - .5) * 26).toFixed(1)}px`);
      }
    } else if (featureImg) {
      featureImg.style.removeProperty('--story-image-shift');
    }
  }

  function requestDraw() {
    if (frame) return;
    frame = requestAnimationFrame(draw);
  }

  function onMotionChange() {
    if (reduceMotion.matches) {
      root.classList.remove('scroll-story-enabled');
      progress.hidden = true;
      for (const item of items) item.classList.add('story-visible');
      if (featureImg) featureImg.style.removeProperty('--story-image-shift');
    } else {
      root.classList.add('scroll-story-enabled');
      progress.hidden = false;
    }
    requestDraw();
  }

  // Delay no navigation, fetches or focusable controls for the choreography.
  onMotionChange();
  window.addEventListener('scroll', requestDraw, {passive:true});
  window.addEventListener('resize', requestDraw, {passive:true});
  window.addEventListener('pageshow', requestDraw);
  window.addEventListener('hashchange', requestDraw);
  document.addEventListener('focusin', event => {
    const item = event.target.closest?.('[data-story-item]');
    if (item) item.classList.add('story-visible');
  });
  document.addEventListener('click', event => {
    if (event.target.closest?.('[data-filter]')) requestAnimationFrame(requestDraw);
  });
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', onMotionChange);
  } else if (reduceMotion.addListener) {
    reduceMotion.addListener(onMotionChange);
  }
})();
