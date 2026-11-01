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
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      mobileNav.classList.toggle('is-open', open);
    });
    $$('a',mobileNav).forEach(link => link.addEventListener('click', () => {
      menu.setAttribute('aria-expanded','false');
      mobileNav.classList.remove('is-open');
    }));
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
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(b => {b.classList.toggle('active',b===button); b.setAttribute('aria-pressed',String(b===button));});
    $$('.project-card').forEach(card=>card.classList.toggle('is-hidden', button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter));
  }));

  const projects = {
    twoday: {
      title: '2DAY Apps Journey', label: 'Product Engineering · AI-assisted app build',
      intro:'A goal-first app built around practical daily action and measurable progress. The project connects interface decisions to product logic and live testing.',
      role:'Product Engineer / Designer',status:'Working build',focus:'Product logic, UI clarity, AI-assisted iteration',
      points:['Translate the user goal into a clear next action.','Use Claude to reason through flow and implementation decisions.','Test behavior in the working app rather than relying on static mockups.'],
      pictures:['assets/2day/2day-actual-home.png','assets/2day/2day-direction-board-real.png'],
      links:[['Latest working version','assets/2day/latest/index.html']]
    },
    society: {
      title:'Society 5ive Site Restructure', label:'Web Strategy · Interior Design',
      intro:'Restructuring an interior design website so services, work samples, and contact paths are easier to understand.',
      role:'Web / Product Designer',status:'Revamp exploration',focus:'Information architecture, service clarity, visual rhythm',
      points:['Study the current website before redesigning the experience.','Clarify the path from services to relevant work and inquiries.','Create a flexible multi-page revamp for review and iteration.'],
      pictures:[],links:[['Current site','https://society5ive.com/'],['Revamp','assets/society5ive/index.html']]
    },
    naples: {
      title:'Only In Naples',label:'Brand System · Character Merch',
      intro:'A repeatable manatee character and merchandise system with a recognizable style across multiple scenarios.',
      role:'Brand / Character Designer',status:'Identity exploration',focus:'Visual identity, illustration, merch applications',
      points:['Create one recognizable mascot across varied outfits and settings.','Test the character across product and promotional applications.','Keep the designs recognizable as a connected family.'],
      pictures:['assets/naples/naples-manatee-captain.png','assets/naples/naples-manatee-golf.png','assets/naples/naples-manatee-patriotic.png'],links:[]
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
  const openDialog = element => {
    if(!element)return;
    if(activeDialog)closeDialog(activeDialog,false);
    focusBefore=document.activeElement;
    element.classList.add('is-open');element.setAttribute('aria-hidden','false');
    activeDialog=element;body.classList.add('modal-open');
    (element.querySelector('[data-modal-close],[data-image-close],[data-inquiry-close]') || element.querySelector('button'))?.focus();
  };
  const closeDialog = (element,restore=true) => {
    if(!element)return;
    element.classList.remove('is-open');element.setAttribute('aria-hidden','true');
    if(activeDialog===element){activeDialog=null;body.classList.remove('modal-open');}
    if(restore)focusBefore?.focus?.();
  };
  document.addEventListener('keydown',event => {
    if(event.key==='Escape' && activeDialog){closeDialog(activeDialog);return;}
    if(event.key!=='Tab'||!activeDialog)return;
    const controls=$$('button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]',activeDialog).filter(n => n.getClientRects().length);
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
  window.addEventListener('portfolio:language',()=>{if(activeProjectKey && $('#projectModal')?.classList.contains('is-open')){closeDialog($('#projectModal'),false);renderProject(activeProjectKey);}});

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
