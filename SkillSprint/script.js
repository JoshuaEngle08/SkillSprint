// script.js - Interaction logic: mobile nav, form validation, success messages, sticky header

document.addEventListener('DOMContentLoaded', function(){
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  navToggle && navToggle.addEventListener('click', function(){
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    primaryNav.classList.toggle('open');
  });

  // Update footer year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header shadow on scroll
  const header = document.getElementById('header');
  const setHeaderShadow = () => {
    if(window.scrollY > 6) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  };
  setHeaderShadow();
  window.addEventListener('scroll', setHeaderShadow, {passive:true});

  // Smooth focus for in-page links (keyboard friendly)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        target.setAttribute('tabindex','-1');
        target.focus({preventScroll:true});
        // Remove tabindex after a short delay
        setTimeout(()=>{target.removeAttribute('tabindex')},1000);
      }
    });
  });

  // Contact form validation + enhancements
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  const confirmModal = document.getElementById('confirmModal');
  const portfolioModal = document.getElementById('portfolioModal');

  function showMessage(type, message){
    formMessage.hidden = false;
    formMessage.className = 'form-message '+(type === 'success' ? 'success' : 'error');
    formMessage.textContent = message;
  }

  function validateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Modal helpers
  function openModal(modal){
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    modal.classList.add('open');
    // Focus first focusable inside
    const btn = modal.querySelector('.modal-close, .modal-ok');
    btn && btn.focus();
  }
  function closeModal(modal){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    modal.classList.remove('open');
  }

  // Wire generic modal close handlers
  document.querySelectorAll('.modal .modal-close, .modal [data-dismiss="modal"], .modal .modal-ok').forEach(el => {
    el.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      closeModal(modal);
    });
  });

  // Portfolio modal open (uses card content)
  document.querySelectorAll('.portfolio-card').forEach(card => {
    // keep existing card click for modal details
    card.style.cursor = 'pointer';
  });

  // Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioGrid = document.getElementById('portfolioGrid');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.portfolio-card').forEach(card => {
        if(f === 'all' || card.dataset.category === f){
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Lightbox behavior for portfolio images
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  document.querySelectorAll('.portfolio-link').forEach(link => {
    link.addEventListener('click', (e) => {
      // if user intends to navigate to case study (ctrl/cmd/shift), allow it
      if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const img = link.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightboxCaption.textContent = link.dataset.title || '';
      openLightbox();
    });
  });

  function openLightbox(){
    if(!lightbox) return;
    lightbox.setAttribute('aria-hidden','false');
    lightbox.classList.add('open');
    const close = lightbox.querySelector('.lightbox-close');
    close && close.focus();
  }
  function closeLightbox(){
    if(!lightbox) return;
    lightbox.setAttribute('aria-hidden','true');
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }

  document.querySelectorAll('.lightbox-close, .lightbox [data-dismiss="lightbox"]').forEach(el => {
    el.addEventListener('click', (e) => { closeLightbox(); });
  });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeLightbox(); });
  (function runTestimonials(){
    const items = document.querySelectorAll('#testimonials .testimonial');
    if(!items.length) return;
    let idx = 0;
    items.forEach((it,i)=>it.classList.toggle('active', i===0));
    setInterval(()=>{
      items[idx].classList.remove('active');
      idx = (idx+1) % items.length;
      items[idx].classList.add('active');
    },4500);
  })();

  // Analytics consent logic
  const consentBanner = document.getElementById('consentBanner');
  const acceptBtn = document.getElementById('acceptAnalytics');
  const rejectBtn = document.getElementById('rejectAnalytics');

  function initGA(){
    if(!window.GA_ID || window.GA_ID === 'G-XXXXXXX') return;
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', window.GA_ID);
  }

  function setAnalyticsConsent(allow){
    try{localStorage.setItem('analyticsConsent', allow ? 'yes' : 'no');}catch(e){}
    if(allow){initGA();}
    if(consentBanner) consentBanner.hidden = true;
  }

  (function checkConsent(){
    try{
      const c = localStorage.getItem('analyticsConsent');
      if(c === null){ if(consentBanner) consentBanner.hidden = false; } else { if(c === 'yes') initGA(); }
    }catch(e){ if(consentBanner) consentBanner.hidden = false; }
  })();

  acceptBtn && acceptBtn.addEventListener('click', ()=> setAnalyticsConsent(true));
  rejectBtn && rejectBtn.addEventListener('click', ()=> setAnalyticsConsent(false));

  // Theme (dark mode) — persists user's choice and follows system preference by default
  const themeButtons = document.querySelectorAll('#themeToggle');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme, persist = false){
    document.documentElement.setAttribute('data-theme', theme);
    themeButtons.forEach(btn => {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if(metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#071028' : '#0b6dfd');
    if(persist){ try{ localStorage.setItem('theme', theme); }catch(e){} }
  }

  function initTheme(){
    const stored = (()=>{ try{return localStorage.getItem('theme')}catch(e){return null} })();
    if(stored === 'dark' || stored === 'light'){
      applyTheme(stored, false);
    } else {
      const useDark = prefersDark && prefersDark.matches;
      applyTheme(useDark ? 'dark' : 'light', false);
    }
  }

  initTheme();

  themeButtons.forEach(btn => btn.addEventListener('click', ()=>{
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  }));

  if(prefersDark){
    prefersDark.addEventListener('change', (e)=>{
      const stored = (()=>{ try{return localStorage.getItem('theme')}catch(e){return null} })();
      if(!stored){ applyTheme(e.matches ? 'dark' : 'light', false); }
    });
  }

  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      formMessage.hidden = true;

      // Read values
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const message = form.message.value.trim();
      const gotcha = (form._gotcha && form._gotcha.value) ? form._gotcha.value.trim() : '';

      // Basic validation
      if(!name || !email || !phone || !message){
        showMessage('error','Please fill in all required fields.');
        return;
      }
      if(!validateEmail(email)){
        showMessage('error','Please enter a valid email address.');
        return;
      }

      // Honeypot check: if filled, treat as spam and silently return a success to avoid giving bot feedback
      if(gotcha){
        form.reset();
        showMessage('success','Thanks! Your message has been sent. We will be in touch shortly.');
        return;
      }

      // UI loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const loader = submitBtn && submitBtn.querySelector('.btn-loader');
      submitBtn && submitBtn.setAttribute('disabled','true');
      loader && loader.classList.remove('hidden');

      // Populate hidden _replyto so Formspree receives the sender email
      const replyToInput = document.getElementById('replytoHidden');
      if(replyToInput) replyToInput.value = email;

      // Prepare to send to Formspree if endpoint is set
      const endpoint = form.dataset.formspreeEndpoint || form.getAttribute('action');

      if(endpoint && endpoint.includes('formspree.io')){
        try{
          const formData = new FormData(form);
          const res = await fetch(endpoint, {method:'POST', body: formData, headers: {'Accept':'application/json'}});
          const data = await res.json().catch(()=>null);
          if(res.ok){
            // show confirm modal for better UX
            openModal(confirmModal);
            form.reset();
          } else {
            const errMsg = data && data.error ? data.error : 'Sending failed. Please try again later.';
            showMessage('error', errMsg);
          }
        }catch(err){
          showMessage('error','Network error. Please try again later.');
        }
      } else {
        // Fallback: open user's email client via mailto with form contents
        const mailto = `mailto:joshuaengle08@gmail.com?subject=${encodeURIComponent('Website contact: ' + (form.service && form.service.value ? form.service.value : 'Contact'))}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nService: ' + (form.service && form.service.value ? form.service.value : '') + '\n\n' + message)}`;
        window.location.href = mailto;
        openModal(confirmModal);
        form.reset();
      }

      // restore UI
      submitBtn && submitBtn.removeAttribute('disabled');
      loader && loader.classList.add('hidden');

      // Optionally, close mobile nav after send
      if(primaryNav.classList.contains('open')){
        primaryNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded','false');
      }

      // For accessibility, move focus to the message or modal
      formMessage.focus && formMessage.focus();
    });
  }

  // Accessibility: allow closing nav with Escape key
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      if(primaryNav.classList.contains('open')){
        primaryNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded','false');
        navToggle.focus();
      }
      // Close chat panel if open
      const chatWidget = document.getElementById('chatWidget');
      if(chatWidget && chatWidget.getAttribute('aria-hidden') === 'false'){
        const closeBtn = chatWidget.querySelector('.chat-close');
        closeBtn && closeBtn.click();
      }
    }
  });

  // --- Chat widget ---
  (function initChat(){
    const chatWidget = document.getElementById('chatWidget');
    if(!chatWidget) return;
    const chatToggle = document.getElementById('chatToggle');
    const chatPanel = chatWidget.querySelector('.chat-panel');
    const chatClose = chatWidget.querySelector('.chat-close');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessagesEl = document.getElementById('chatMessages');
    const endpoint = chatWidget.dataset.chatEndpoint || chatWidget.getAttribute('data-chat-endpoint') || null;

    const STORAGE_KEY = 'skillsprint_chat_v1';
    let session = localStorage.getItem('skillsprint_chat_session');
    if(!session){ session = 's_' + Date.now() + '_' + Math.random().toString(36).slice(2,8); localStorage.setItem('skillsprint_chat_session', session); }

    function saveMessages(messages){ localStorage.setItem(STORAGE_KEY, JSON.stringify(messages || [])); }
    function loadMessages(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }catch(e){return [];} }

    function renderMessage(msg){
      const el = document.createElement('div');
      el.className = 'chat-message '+(msg.role === 'user' ? 'user' : 'bot');
      const content = document.createElement('div');
      content.className = 'chat-message-content';
      content.textContent = msg.text;
      el.appendChild(content);
      chatMessagesEl.appendChild(el);
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }

    function setTyping(on){
      const existing = chatMessagesEl.querySelector('.chat-message.typing');
      if(on){
        if(!existing){
          const t = document.createElement('div'); 
          t.className = 'chat-message bot typing'; 
          const content = document.createElement('div');
          content.className = 'chat-message-content';
          content.textContent = 'Typing...'; 
          t.appendChild(content);
          chatMessagesEl.appendChild(t); 
          chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        }
      } else { existing && existing.remove(); }
    }

    // Load older messages
    const history = loadMessages();
    history.forEach(renderMessage);

    function pushMessage(role, text, persist = true){
      const msg = {role, text, ts: Date.now()};
      renderMessage(msg);
      if(persist){ const h = loadMessages(); h.push(msg); saveMessages(h); }
    }

    async function queryAI(prompt){
      // If no server endpoint, fallback to canned responses
      if(!endpoint || endpoint === '/api/chat'){
        // Simulated response -- replace with server-side AI in production
        await new Promise(r => setTimeout(r, 700 + Math.random()*600));
        if(/price|cost|starter/i.test(prompt)) return 'Our Starter Website starts at R2,500 (approx. $150). We can customise features per your needs.';
        if(/maintenance|support/i.test(prompt)) return 'Monthly Maintenance is R250 / $15 and includes hosting, updates, backups and support.';
        return 'Thanks for your question! Please provide more details or use the contact form so we can follow up.';
      }

      try{
        const res = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({message:prompt, sessionId:session})});
        if(!res.ok) throw new Error('Network');
        const data = await res.json();
        // Expect {reply: '...'} or {message: '...'}
        return data.reply || data.message || data.answer || JSON.stringify(data);
      }catch(err){
        return 'Sorry, the chat service is unavailable right now. Please try again later or use the contact form.';
      }
    }

    async function handleSend(text){
      if(!text) return;
      pushMessage('user', text);
      chatInput.value = '';
      setTyping(true);
      const reply = await queryAI(text);
      setTyping(false);
      pushMessage('bot', reply);
    }

    // Open/close
    function openChat(){ 
      chatWidget.setAttribute('aria-hidden','false'); 
      chatInput.focus(); 
    }
    function closeChat(){ 
      chatWidget.setAttribute('aria-hidden','true'); 
      chatToggle.focus(); 
    }

    chatToggle && chatToggle.addEventListener('click', ()=>{ 
      const isOpen = chatWidget.getAttribute('aria-hidden') === 'false'; 
      isOpen ? closeChat() : openChat(); 
    });
    chatClose && chatClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeChat(); 
    });

    chatForm && chatForm.addEventListener('submit', function(e){ e.preventDefault(); const v = chatInput.value.trim(); if(v) handleSend(v); });

    // Enter to send (allow Shift+Enter to add newline)
    chatInput && chatInput.addEventListener('keydown', function(e){ if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); const v = chatInput.value.trim(); if(v) handleSend(v); } });

  })();

});
