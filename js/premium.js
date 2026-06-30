// ============================================================
// Lind Home Remodeling — Premium interactions
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const pre = document.querySelector('.preloader');
  window.addEventListener('load', () => {
    setTimeout(() => pre && pre.classList.add('done'), 400);
  });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backToTop');

  function onScroll(){
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    backTop.classList.toggle('show', y > 700);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
  backTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------- Mobile nav ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeMobile = document.getElementById('closeMobile');
  menuToggle.addEventListener('click', () => mobileNav.classList.add('open'));
  closeMobile.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

  /* ---------- Cursor glow (desktop) ---------- */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches){
    const glow = document.querySelector('.cursor-glow');
    const dot = document.querySelector('.cursor-dot');
    let gx=0, gy=0, mx=0, my=0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; });
    function loop(){
      gx += (mx-gx)*.08; gy += (my-gy)*.08;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll('a, button, .service-card, .gallery a').forEach(el => {
      el.addEventListener('mouseenter', () => dot.classList.add('grow'));
      el.addEventListener('mouseleave', () => dot.classList.remove('grow'));
    });
  }

  /* ---------- Ripple effect on buttons ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size/2) + 'px';
      r.style.top = (e.clientY - rect.top - size/2) + 'px';
      this.appendChild(r);
      setTimeout(() => r.remove(), 650);
    });
  });

  /* ---------- Scroll reveal (with stagger) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const parent = entry.target.closest('.stagger');
        if (parent){
          const idx = Array.from(parent.children).indexOf(entry.target);
          entry.target.style.setProperty('--i', idx);
        }
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  reveals.forEach(el => io.observe(el));

  /* ---------- Split line text reveal ---------- */
  document.querySelectorAll('.split-line').forEach(el => {
    const text = el.textContent;
    el.innerHTML = '<span>' + text + '</span>';
  });
  const lineIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); lineIO.unobserve(e.target); } });
  }, { threshold:.4 });
  document.querySelectorAll('.split-line').forEach(el => lineIO.observe(el));

  /* ---------- Animated counters ---------- */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          let start = 0;
          const duration = 1700;
          const startTime = performance.now();
          function tick(now){
            const p = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
          }
          requestAnimationFrame(tick);
          counterIO.unobserve(el);
        }
      });
    }, { threshold:.6 });
    counterIO.observe(el);
  });

  /* ---------- Hero parallax ---------- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg){
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight){
        heroBg.style.transform = `translateY(${y * 0.28}px) scale(1.06)`;
      }
    }, { passive:true });
  }

  /* ---------- Tilt effect on service cards ---------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width/2, cy = rect.height/2;
      const rx = ((y - cy) / cy) * -5;
      const ry = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      card.style.setProperty('--mx', (x/rect.width*100) + '%');
      card.style.setProperty('--my', (y/rect.height*100) + '%');
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------- Floating blobs parallax on mouse ---------- */
  const blobs = document.querySelectorAll('.float-blob');
  window.addEventListener('mousemove', (e) => {
    const cx = (e.clientX / window.innerWidth) - 0.5;
    const cy = (e.clientY / window.innerHeight) - 0.5;
    blobs.forEach((b, i) => {
      const depth = (i+1) * 10;
      b.style.marginLeft = (cx * depth) + 'px';
      b.style.marginTop = (cy * depth) + 'px';
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item){
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Testimonial carousel ---------- */
  const cards = document.querySelectorAll('.review-card');
  const dotsWrap = document.getElementById('reviewDots');
  let activeIdx = 0, reviewTimer;
  if (cards.length){
    cards.forEach((c, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => showReview(i));
      dotsWrap.appendChild(dot);
    });
    function showReview(idx){
      cards[activeIdx].classList.remove('active');
      dotsWrap.children[activeIdx].classList.remove('active');
      activeIdx = idx;
      cards[activeIdx].classList.add('active');
      dotsWrap.children[activeIdx].classList.add('active');
      resetTimer();
    }
    function resetTimer(){
      clearInterval(reviewTimer);
      reviewTimer = setInterval(() => showReview((activeIdx + 1) % cards.length), 5500);
    }
    resetTimer();
  }

  /* ---------- Smooth in-page nav scroll offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1){
        const target = document.querySelector(id);
        if (target){
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior:'smooth' });
        }
      }
    });
  });

  /* ---------- Contact form (AJAX submit, unchanged behavior) ---------- */
  const form = document.getElementById('contactForm');
  if (form){
    form.addEventListener('submit', function(event){
      event.preventDefault();
      const formData = new FormData(form);
      fetch('https://formsubmit.co/ajax/lindihome.remodeling@gmail.com', { method:'POST', body: formData })
        .then(r => r.json())
        .then(() => { form.reset(); document.getElementById('successMessage').style.display = 'block'; })
        .catch(err => { console.error(err); alert('Something went wrong. Please try again later.'); });
    });
  }
});
