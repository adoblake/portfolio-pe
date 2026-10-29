const body = document.body;
const cursor = document.querySelector('.cursor');
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobileNav');
const modal = document.querySelector('#projectModal');
const modalTitle = document.querySelector('#modalTitle');
const modalType = document.querySelector('#modalType');
const modalSummary = document.querySelector('#modalSummary');
const modalRole = document.querySelector('#modalRole');
const modalFocus = document.querySelector('#modalFocus');
const modalStatus = document.querySelector('#modalStatus');
const modalSteps = document.querySelector('#modalSteps');
const modalGallery = document.querySelector('#modalGallery');
const modalLink = document.querySelector('#modalLink');

const projectData = {
  basketball: {
    type: 'Product UX · Mobile App',
    title: 'Basketball Pickup App',
    summary: 'A mobile-first product concept for finding nearby courts, setting up games, joining teams, tracking lightweight stats, messaging players, and rating local court quality.',
    role: 'Product Designer',
    focus: 'Flows · Wireframes · MVP strategy',
    status: 'Prototype-ready',
    steps: ['Define the pickup-game problem and target player types.', 'Map the core loop: discover court → join/create game → build team → play → rate.', 'Create Figma wireframes for dashboard, map, court detail, game setup, and team view.', 'Add trust signals through player ratings, court ratings, and game status.']
  },
  schoolyard: {
    type: 'Marketplace UX · Student Tool',
    title: 'SchoolYard',
    summary: 'A student-only resale marketplace shaped around clarity, speed, and local trust — with .edu access and location-by-college browsing.',
    role: 'UX / Product Designer',
    focus: 'Marketplace structure · Mobile UI',
    status: 'Concept in progress',
    steps: ['Keep listings open and simple, inspired by classifieds.', 'Design the college/location layer so each campus feels like its own market.', 'Build listing cards that prioritize price, location, safety, and speed.', 'Plan moderation and .edu access as trust foundations.']
  },
  society: {
    type: 'Web Design · Interior Design',
    title: 'Society 5ive Rebuild',
    summary: 'A reimagined web presence for an interior design business, focused on elegant page pacing, service clarity, portfolio proof, and a warmer premium feel.',
    role: 'Web / Brand Designer',
    focus: 'Site structure · Visual direction',
    status: 'Build draft',
    steps: ['Mirror the existing site’s core page intent while upgrading the experience.', 'Keep the main focus on interior design, not a generic creative agency.', 'Use editorial spacing, large project moments, and confident service framing.', 'Prepare the system so logos and final imagery can be swapped in later.']
  },
  naples: {
    type: 'Brand System · Character Merch',
    title: 'Only In Naples',
    summary: 'A mascot and merch identity built around a relaxed manatee character that can carry multiple Naples scenarios without losing recognizability.',
    role: 'Character / Brand Designer',
    focus: 'Mascot system · Merchandise',
    status: 'Active design system',
    steps: ['Lock recognizable outfit pieces: khaki shorts, relaxed smile, human-style hands, and premium accessory variants.', 'Create repeatable scenario templates for beach, golf, captain, and patriotic versions.', 'Separate transparent PNG outputs for merch production and client review.', 'Keep the mascot consistent while allowing seasonal and local variants.']
  },
  nightskin: {
    type: 'Story World · Supernatural Novel',
    title: 'The NightSkin Folk',
    summary: 'A supernatural story world centered on HBCU guardians, African folklore, family legacy, and a magical system built for long-form expansion.',
    role: 'Creator / Worldbuilder',
    focus: 'Mythology · Characters · Visual narrative',
    status: 'Chapter development',
    steps: ['Anchor the world around Isadora Black, family history, and HBCU magic guardians.', 'Research and adapt African folklore influences with respect and purpose.', 'Build a story bible that tracks powers, locations, factions, and emotional arcs.', 'Develop visual direction for covers, characters, and key scenes.']
  },
  oko: {
    type: 'Manga Development · Character Arc',
    title: 'O.K.O.',
    summary: 'A seinen manga concept about Adé, a first-generation Jamaican-American teen whose fighting journey becomes a story about discipline, identity, and legacy.',
    role: 'Creator / Visual Storyteller',
    focus: 'Characters · Fight culture · Story structure',
    status: 'Series development',
    steps: ['Define Adé’s flaw: fighting to prove strength without understanding discipline.', 'Use Jamaica and family legacy as the turning point for his training.', 'Develop supporting cast: Nia, Abayomi, and the underground fighting world.', 'Frame battles as emotional tests, not just physical wins.']
  },
  leftovers: {
    type: 'Social Impact · Product Concept',
    title: 'Leftovers',
    summary: 'A product concept for reducing food waste by connecting Phoenix-area consumable facilities with people, organizations, and communities that can use excess food responsibly.',
    role: 'Product Strategist / Designer',
    focus: 'Service model · UX · Funding story',
    status: 'Early concept',
    steps: ['Define the social and business problem around excess consumables.', 'Map stakeholders: facilities, customers, nonprofits, delivery partners, and funders.', 'Create a product flow inspired by surplus marketplaces while staying locally useful.', 'Build a pitchable MVP story for grants, business loans, or pilot partnerships.']
  },
  neighbors: {
    type: 'Brand Identity · Environmental Graphics',
    title: 'Neighbors Bar',
    summary: 'A hospitality identity system for a Greensboro neighborhood bar: expressive wordmark, compact monogram, color direction, mood boards, bottle/signage mockups, and a large-scale mural application that makes the building instantly ownable.',
    role: 'Brand / Visual Designer',
    focus: 'Logo system · Color direction · Environmental application',
    status: 'Real-world brand application',
    link: 'https://neighborsgso.com/',
    steps: ['Define the feeling: fun, modern, approachable, and neighborhood-first.', 'Explore script wordmarks and compact marks that could read on menus, signs, bottles, social, and exterior walls.', 'Test palette routes — orange, purple, and deep blue — against hospitality photography and mock brand applications.', 'Carry the identity into physical space through the painted exterior mark, proving the system can scale beyond a screen.'],
    gallery: [
      { src: 'assets/neighbors/neighbors-building.jpg', alt: 'Neighbors building exterior with painted wall mark' },
      { src: 'assets/neighbors/neighbors-wall-close.jpg', alt: 'Close-up of painted Neighbors wall mark' },
      { src: 'assets/neighbors/neighbors-logo-exploration.png', alt: 'Neighbors logo exploration sheet' },
      { src: 'assets/neighbors/neighbors-mood-orange.png', alt: 'Orange Neighbors mood board' },
      { src: 'assets/neighbors/neighbors-mood-purple.png', alt: 'Purple Neighbors mood board' },
      { src: 'assets/neighbors/neighbors-mood-blue.png', alt: 'Blue Neighbors mood board' }
    ]
  }
};

function updateYear() {
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
    observer.observe(el);
  });
}

function setupCursor() {
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;
  window.addEventListener('mousemove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  document.querySelectorAll('a, button, .project-card').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });
}

function setupMenu() {
  if (!menuButton || !mobileNav) return;
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.classList.toggle('is-open', !isOpen);
  });
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
    });
  });
}

function setupFilters() {
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.project-card');
  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;
      filters.forEach((button) => button.classList.remove('active'));
      filter.classList.add('active');
      cards.forEach((card) => {
        const shouldShow = category === 'all' || card.dataset.category === category;
        card.classList.toggle('is-hidden', !shouldShow);
      });
    });
  });
}

function openModal(key) {
  const data = projectData[key];
  if (!data) return;
  modalType.textContent = data.type;
  modalTitle.textContent = data.title;
  modalSummary.textContent = data.summary;
  modalRole.textContent = data.role;
  modalFocus.textContent = data.focus;
  modalStatus.textContent = data.status;
  modalSteps.innerHTML = data.steps.map((step) => `<li>${step}</li>`).join('');
  if (modalGallery) {
    const gallery = data.gallery || [];
    modalGallery.innerHTML = gallery.map((item) => `<img src="${item.src}" alt="${item.alt}" loading="lazy" />`).join('');
    modalGallery.classList.toggle('is-empty', gallery.length === 0);
  }
  if (modalLink) {
    if (data.link) {
      modalLink.href = data.link;
      modalLink.style.display = 'inline-flex';
    } else {
      modalLink.style.display = 'none';
    }
  }
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  body.classList.add('modal-open');
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  body.classList.remove('modal-open');
}

function setupModal() {
  if (!modal) return;
  document.querySelectorAll('[data-modal]').forEach((card) => {
    card.addEventListener('click', () => openModal(card.dataset.modal));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') openModal(card.dataset.modal);
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
  });
  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}

function setupTilt() {
  const tiltItems = document.querySelectorAll('[data-tilt]');
  tiltItems.forEach((item) => {
    item.addEventListener('mousemove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - .5) * -8;
      const ry = ((x / rect.width) - .5) * 8;
      item.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

updateYear();
setupReveal();
setupCursor();
setupMenu();
setupFilters();
setupModal();
setupTilt();