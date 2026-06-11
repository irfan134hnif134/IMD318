// Hanif Works — interactions
(function () {
  // Preloader
  window.addEventListener('load', () => {
    setTimeout(() => document.querySelector('.preloader')?.classList.add('hidden'), 700);
  });

  // Theme
  const root = document.documentElement;
  const saved = localStorage.getItem('hw-theme');
  if (saved === 'dark') root.classList.add('dark');
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-theme-toggle]');
    if (!t) return;
    root.classList.toggle('dark');
    localStorage.setItem('hw-theme', root.classList.contains('dark') ? 'dark' : 'light');
  });

  // Mobile menu
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu-open]')) document.querySelector('.mobile-menu')?.classList.add('open');
    if (e.target.closest('[data-menu-close]') || e.target.closest('.mobile-menu a')) document.querySelector('.mobile-menu')?.classList.remove('open');
  });

  // Active nav link
  const path = location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Parallax
  const parallaxEls = document.querySelectorAll('.parallax');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    parallaxEls.forEach(el => {
      const s = parseFloat(el.dataset.speed || '0.2');
      el.style.transform = `translate3d(0, ${y * s}px, 0)`;
    });
    // Back to top
    const t = document.querySelector('.to-top');
    if (t) t.classList.toggle('show', y > 400);
  }, { passive: true });

  // Back to top click
  document.addEventListener('click', (e) => {
    if (e.target.closest('.to-top')) window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Counters
  const counters = document.querySelectorAll('[data-counter]');
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.counter);
      const dur = 1600; const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = Number.isInteger(target) ? Math.round(val).toLocaleString() : val.toFixed(1);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cIO.observe(el));

  // Lightbox
  const lb = document.querySelector('.lightbox');
  if (lb) {
    const img = lb.querySelector('img');
    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => {
        img.src = el.dataset.lightbox || el.querySelector('img')?.src;
        lb.classList.add('open');
      });
    });
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.closest('.close')) lb.classList.remove('open');
    });
  }

  // Carousel
  document.querySelectorAll('.carousel').forEach(car => {
    const track = car.querySelector('.carousel-track');
    const slides = car.querySelectorAll('.carousel-slide');
    let i = 0; const n = slides.length;
    const go = (k) => { i = (k + n) % n; track.style.transform = `translateX(-${i * 100}%)`; updateDots(); };
    car.querySelector('[data-next]')?.addEventListener('click', () => go(i + 1));
    car.querySelector('[data-prev]')?.addEventListener('click', () => go(i - 1));
    const dots = car.querySelectorAll('[data-dot]');
    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
    function updateDots() { dots.forEach((d, k) => d.classList.toggle('bg-accent', k === i)); }
    updateDots();
    setInterval(() => go(i + 1), 6500);
  });

  // Smooth anchor (already CSS scroll-behavior); ensure offset for hash links if needed
})();

/* Persistent background music across pages */
(function(){
  const KEY='bgMusicState';
  const audio=new Audio('assets/luv-sic.mp3');
  audio.loop=true;audio.volume=0.4;
  const saved=JSON.parse(sessionStorage.getItem(KEY)||'{}');
  if(saved.time)audio.currentTime=saved.time;
  const playIcon='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const pauseIcon='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
  const btn=document.createElement('button');
  btn.id='bg-music-btn';btn.setAttribute('aria-label','Toggle music');
  btn.innerHTML=playIcon;
  document.body.appendChild(btn);
  function update(){btn.innerHTML=audio.paused?playIcon:pauseIcon}
  btn.addEventListener('click',()=>{audio.paused?audio.play():audio.pause();update()});
  if(saved.playing){audio.play().then(update).catch(()=>{})}
  setInterval(()=>{sessionStorage.setItem(KEY,JSON.stringify({playing:!audio.paused,time:audio.currentTime}))},500);
  audio.addEventListener('play',update);audio.addEventListener('pause',update);
})();
