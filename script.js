/* Round 31.7 · small, accessible interaction layer over the 31.6.4 design. */
(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const body = document.body;
  const locale = () => window.PortfolioI18n?.current || 'en';
  const translate = (english) => window.PortfolioI18n?.translate(english) || english;
  const page = document.documentElement;

  // Light / dark mode is persistent across both pages.
  const themeButtons = $$('[data-theme-toggle]');
  const setTheme = theme => {
    page.dataset.theme = theme;
    try { localStorage.setItem('portfolio-theme', theme); } catch (_) {}
    themeButtons.forEach(btn => {
      btn.textContent = translate(theme === 'dark' ? 'Light' : 'Dark');
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  };
  try { setTheme(localStorage.getItem('portfolio-theme') || 'light'); } catch (_) { setTheme('light'); }
  themeButtons.forEach(btn => btn.addEventListener('click', () => setTheme(page.dataset.theme === 'dark' ? 'light' : 'dark')));
  window.addEventListener('portfolio:language', () => setTheme(page.dataset.theme));

  // Mobile navigation with real expanded state.
  const menu = $('.menu-button');
  const mobileNav = $('#mobileNav');
  if (menu && mobileNav) {
    const mobileWidth = matchMedia('(max-width: 1180px)');
    const setMenu = open => {
      menu.setAttribute('aria-expanded', String(open));
      mobileNav.hidden = !open;
      mobileNav.classList.toggle('is-open', open);
    };
    setMenu(false);
    menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
    $$('a', mobileNav).forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menu.focus();
      }
    });
    mobileWidth.addEventListener('change', () => {
      const hadFocus = mobileNav.contains(document.activeElement);
      setMenu(false);
      if (hadFocus) (mobileWidth.matches ? menu : $('.site-nav a'))?.focus();
    });
  }

  // Reveal is disabled for reduced-motion and if IntersectionObserver is unavailable.
  if (reduced.matches || !('IntersectionObserver' in window)) {
    $$('[data-reveal]').forEach(el => el.classList.add('is-visible'));
  } else {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
    }), {threshold: .08});
    $$('[data-reveal]').forEach(el => reveal.observe(el));
  }

  // Progressive workflow: highlight the current step as the visitor scrolls.
  // Native <details> remain freely clickable; scrolling does not mutate open state.
  const tabs = $$('.workflow-tab');
  const lines = $$('.workflow-code-lines li');
  let currentStep = 1;
  const setCurrent = n => {
    if (n === currentStep && tabs[n-1]?.classList.contains('is-current')) return;
    currentStep = n;
    tabs.forEach((el,i) => el.classList.toggle('is-current',i === n-1));
    lines.forEach((el,i) => el.classList.toggle('is-current',i === n-1));
  };
  tabs.forEach((tab,i) => tab.addEventListener('toggle',() => {if(tab.open) setCurrent(i+1)}));
  const highlightOnScroll = () => {
    if (!tabs.length || reduced.matches) return;
    const y = window.innerHeight * .51;
    let nearest = 0;
    let distance = Infinity;
    tabs.forEach((tab,i) => {
      const box = tab.getBoundingClientRect();
      const d = Math.abs(box.top + Math.min(box.height,150) / 2 - y);
      if (d < distance) {distance=d;nearest=i;}
    });
    const section=$('.engineering-workflow');
    if(section){const rect=section.getBoundingClientRect(); if(rect.bottom > 0 && rect.top < innerHeight) setCurrent(nearest+1);}
  };
  let scheduled=false;
  window.addEventListener('scroll',() => {
    if(scheduled)return; scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;highlightOnScroll();updateParallax();});
  },{passive:true});
  if(tabs.length) highlightOnScroll();

  // Very mild portrait depth; leaves headline fixed and never changes layout.
  const hero = $('.apple-hero');
  const portrait = $('[data-hero-parallax]');
  const updateParallax = () => {
    if(!hero || !portrait || reduced.matches || innerWidth < 820)return;
    const rect=hero.getBoundingClientRect();
    const t=Math.max(-1,Math.min(1,(-rect.top)/(rect.height||1)));
    portrait.style.setProperty('--hero-shift',`${(t*19).toFixed(1)}px`);
  };

  // Keep old filters and project card display and order untouched.
  const filterButtons = $$('.filter');
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(b => {b.classList.toggle('active',b===button); b.setAttribute('aria-pressed',String(b===button));});
    $$('.project-card').forEach(card=>card.classList.toggle('is-hidden', button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter));
  }));

  const projects = {
    twoday: {
      title: '2DAY Apps Journey', label: 'Product Engineering · AI-assisted app build',
      intro:'A meal-planning and daily follow-through app with revisable goals, browser-local progress, Google and Outlook calendar handoff, and on-device Share / QR. Optional provider-backed messaging needs a separately hosted server.',
      role:'Product Engineer / Designer',status:'Working build',focus:'Meal planning, daily follow-through, calendar handoff',
      points:['Turn the selected wellness goal into a clear daily meal routine.','Preserve journey progress when revising the plan; review program guidance before accepting it.','Open calendar events for review and saving in Google or Outlook; share the public app using an on-device QR code.'],
      pictures:['assets/2day/2day-home-v12-1.png','assets/2day/2day-current-day.png','assets/2day/2day-current-calendar.png','assets/2day/2day-current-guidance.png'],
      links:[['Try live 2DAY app','https://adoblake.github.io/2DAY-APP/']]
    },
    phalinx: {
      title:'Phalinx', label:'Web Strategy · Brand + Web Studio',
      intro:"The website for Phalinx, a brand identity and web design studio. It turns a creative service into something a small business can understand, price, and start on its own.",
      role:'Designer / Front-end builder',status:'Live site',focus:'Service packaging, pricing clarity, inquiry flow',
      points:["Define the offer first: three fixed-scope packages with starting prices, so the page can sell something specific.", "Order every section around the buyer’s questions: what you do, proof, cost, how to pay, and what happens next.", "Lower the barrier to starting: milestone payments, a returning-client credit, and an inquiry form that asks for budget and timing up front."],
      pictures:['assets/phalinx/phalinx-home.png'],links:[['Visit Phalinx','https://phalinx.space/']]
    },
    bucketlist: {
      title:'Bucketlist',label:'Product Engineering · Basketball Community',
      intro:'A mobile-first basketball prototype connecting Arizona court discovery, scheduled games, team setup, and personal progress. Shared groups and chat run through a separate authenticated community service.',
      role:'Product Engineer / Designer',status:'Live prototype',focus:'Court discovery, game coordination, mobile UX',
      points:['Find courts and explore scheduled games across Arizona.','Join a local-demo roster, choose a team, and track self-reported sessions.','Coordinate in shared groups and chat; game reservations and stats remain browser-local.'],
      pictures:['assets/bucketlist/game-plan-light.png','assets/bucketlist/game-plan-dark.png','assets/bucketlist/phoenix-courts.png','assets/bucketlist/mobile-teams.png','assets/bucketlist/showcase-stats.png'],
      links:[['Try BUCKETLIST','https://adoblake.github.io/bucketlist/'],['View source','https://github.com/adoblake/bucketlist']]
    },
    neighbors: {
      title:'Neighbors Bar',label:'Brand Identity · Environmental Graphics',
      intro:'A neighborhood bar identity carried from expressive typography into signage, murals, and real-world use.',
      role:'Visual / Brand Designer',status:'Real-world application',focus:'Wordmark, environmental graphics, brand system',
      points:['Develop an expressive wordmark and supporting marks.','Explore visual directions in real brand environments.','Apply the identity at different scales, including a painted exterior.'],
      pictures:['assets/neighbors/neighbors-wordmark.png','assets/neighbors/neighbors-wall-close.jpg','assets/neighbors/neighbors-building.jpg','assets/neighbors/neighbors-mood-orange.png'],
      links:[['Live site','https://neighborsgso.com/']]
    }
  };

  // Central modal management preserves focus, Escape and scroll locking.
  let activeDialog=null, focusBefore=null, activeProjectKey=null;
  const backgroundState = new Map();
  const openDialog = element => {
    if (!element || activeDialog === element) return;
    if (activeDialog) closeDialog(activeDialog, false);
    focusBefore = document.activeElement;
    element.hidden = false;
    element.inert = false;
    element.classList.add('is-open');
    element.setAttribute('aria-hidden', 'false');
    activeDialog = element;
    body.classList.add('modal-open');
    // Focus a real control, never the non-focusable backdrop.
    element.querySelector('button[data-modal-close],button[data-image-close],button[data-inquiry-close]')?.focus();
    for (const sibling of body.children) {
      if (sibling === element) continue;
      backgroundState.set(sibling, sibling.inert);
      sibling.inert = true;
    }
  };
  const closeDialog = (element, restore = true) => {
    if (!element) return;
    if (activeDialog === element) {
      for (const [sibling, inert] of backgroundState) sibling.inert = inert;
      backgroundState.clear();
      activeDialog = null;
      body.classList.remove('modal-open');
      if (restore) focusBefore?.focus?.();
    }
    element.classList.remove('is-open');
    element.setAttribute('aria-hidden', 'true');
    element.inert = true;
    element.hidden = true;
  };
  document.addEventListener('keydown',event => {
    if(event.key==='Escape' && activeDialog){closeDialog(activeDialog);return;}
    if(event.key!=='Tab'||!activeDialog)return;
    const controls=$$('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex="0"]',activeDialog).filter(n => n.getClientRects().length);
    if(!controls.length)return;
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  $$('[data-modal-close]').forEach(el=>el.addEventListener('click',()=>closeDialog($('#projectModal'))));
  $$('[data-image-close]').forEach(el=>el.addEventListener('click',()=>closeDialog($('#imageModal'))));
  $$('[data-inquiry-close]').forEach(el=>el.addEventListener('click',()=>closeDialog($('#inquiryModal'))));
  $$('[data-inquiry-open]').forEach(el=>el.addEventListener('click',()=>openDialog($('#inquiryModal'))));

  const imageDialog = $('#imageModal');
  $$('[data-image]').forEach(el=>el.addEventListener('click',()=>{
    if(!imageDialog)return;
    $('#imageModalImg').src=el.dataset.image;
    $('#imageModalImg').alt=el.querySelector('img')?.alt || translate('Project image');
    $('#imageModalCaption').textContent=translate(el.dataset.caption || '');
    openDialog(imageDialog);
  }));

  const renderProject = key => {
    const data=projects[key], dialog=$('#projectModal');
    if(!data||!dialog)return;
    activeProjectKey=key;
    $('#projectModalKicker').textContent=translate(data.label);
    $('#projectModalTitle').textContent=translate(data.title);
    $('#projectModalIntro').textContent=translate(data.intro);
    $('#projectModalMeta').replaceChildren();
    for(const [label, value] of [['Role',data.role],['Focus',data.focus],['Status',data.status]]){
      const box=document.createElement('div');const head=document.createElement('strong');const text=document.createElement('span');
      head.textContent=translate(label);text.textContent=translate(value);box.append(head,text);$('#projectModalMeta').append(box);
    }
    $('#projectModalBody').replaceChildren();
    const heading=document.createElement('h3');heading.textContent=translate('How the work comes together');
    const list=document.createElement('ol'); data.points.forEach(point=>{const li=document.createElement('li');li.textContent=translate(point);list.append(li);});
    $('#projectModalBody').append(heading,list);
    const examples=$('#projectModalExamples');examples.replaceChildren();
    data.pictures.forEach(src=>{const img=document.createElement('img');img.src=src;img.alt=translate(data.title);img.loading='lazy';examples.append(img);});
    $('#modalExamplesShell').hidden=data.pictures.length===0;
    examples.classList.remove('is-open');examples.setAttribute('aria-hidden','true');
    $('#modalExamplesToggle').setAttribute('aria-expanded','false');
    $('#modalExamplesToggle').textContent=translate('More');
    const actions=$('#projectModalActions');actions.replaceChildren();
    data.links.forEach(([label,url])=>{const a=document.createElement('a');a.className='button button-ghost';a.textContent=translate(label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';actions.append(a);});
    openDialog(dialog);
  };
  $$('[data-modal-open]').forEach(el=>el.addEventListener('click',()=>renderProject(el.dataset.modalOpen)));
  $('#modalExamplesToggle')?.addEventListener('click',()=>{
    const list=$('#projectModalExamples'), now=!list.classList.contains('is-open');
    list.classList.toggle('is-open',now);list.setAttribute('aria-hidden',String(!now));
    $('#modalExamplesToggle').setAttribute('aria-expanded',String(now));
    $('#modalExamplesToggle').textContent=translate(now?'Less':'More');
  });
  window.addEventListener('portfolio:language',()=>{if(activeProjectKey && $('#projectModal')?.classList.contains('is-open')){renderProject(activeProjectKey);}});

  const form=$('#inquiryForm');
  form?.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const fields=new FormData(form);
    const text=[
      `${translate('Name')}: ${fields.get('name')||''}`,`${translate('Email')}: ${fields.get('email')||''}`,
      `${translate('Project type')}: ${fields.get('type')||''}`,`${translate('Timeline')}: ${fields.get('timeline')||''}`,
      `${translate('Budget / scope')}: ${fields.get('budget')||''}`,`${translate('Message')}: ${fields.get('message')||''}`
    ].join('\n');
    window.location.href=`mailto:adoblake@gmail.com?subject=${encodeURIComponent('Project inquiry — portfolio')}&body=${encodeURIComponent(text)}`;
  });
})();
