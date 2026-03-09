/* ═══════════════════════════════════════════
   Elite Center – Gimnasio Villa Mercedes
   JavaScript
═══════════════════════════════════════════ */
// ── PLAN TABS ──
function switchPlan(type){
  const isMensual = type === 'mensual';
  document.getElementById('planes-mensual').style.display = isMensual ? 'grid' : 'none';
  document.getElementById('planes-funcional').style.display = isMensual ? 'none' : 'grid';
  document.getElementById('tab-mensual').style.background = isMensual ? 'var(--red)' : 'var(--g2)';
  document.getElementById('tab-mensual').style.color = isMensual ? 'var(--w)' : 'var(--mut)';
  document.getElementById('tab-funcional').style.background = isMensual ? 'var(--g2)' : 'var(--red)';
  document.getElementById('tab-funcional').style.color = isMensual ? 'var(--mut)' : 'var(--w)';
}

// ── CURSOR ──
const cur = document.getElementById('cur');
const curR = document.getElementById('cur-r');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
  setTimeout(() => { curR.style.left = e.clientX + 'px'; curR.style.top = e.clientY + 'px'; }, 80);
});

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('on', scrollY > 60));

// ── MOBILE MENU ──
document.getElementById('burger').addEventListener('click', () => document.getElementById('mob-menu').classList.add('open'));
document.getElementById('menu-close').addEventListener('click', () => document.getElementById('mob-menu').classList.remove('open'));
function closeMenu(){ document.getElementById('mob-menu').classList.remove('open') }

// ── SCROLL REVEAL – manejado por GSAP (ver bloque GSAP ANIMACIONES GLOBALES) ──

// ── FAQ ──
function toggleFaq(btn){
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if(!isOpen) item.classList.add('open');
}

// ── FORMULARIO INSCRIPCIÓN ──
function submitForm(e){
  e.preventDefault();
  const fd  = new FormData(e.target);
  const d   = Object.fromEntries(fd);
  const btn = document.getElementById('form-btn');

  // Validación mínima
  if(!d.nombre || !d.edad || !d.telefono || !d.objetivo){
    return;
  }

  // Estado cargando
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  btn.style.opacity = '0.7';

  // Parámetros para EmailJS (deben coincidir con las variables del template)
  const params = {
    nombre:      d.nombre,
    edad:        d.edad,
    telefono:    d.telefono,
    objetivo:    d.objetivo,
    plan:        d.plan        || 'Sin especificar',
    horario:     d.horario     || 'Sin especificar',
    experiencia: d.experiencia || 'Sin especificar',
    mensaje:     d.mensaje     || 'Ninguno',
    reply_to:    d.email       || '',
    email:       d.email       || 'No proporcionado',
  };

  emailjs.send('service_frt4fkk', 'template_304nn5j', params)
    .then(() => {
      // Enviar auto-reply al usuario si dejó email
      if(d.email) {
        emailjs.send('service_frt4fkk', 'template_pa9k06a', params);
      }
      // Éxito — mostrar pantalla de confirmación
      document.getElementById('form-box').querySelector('form').style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    })
    .catch((err) => {
      // Error — restaurar botón y avisar
      console.error('EmailJS error:', err);
      btn.disabled = false;
      btn.textContent = 'Enviar inscripción ⚡';
      btn.style.opacity = '1';
      alert('Hubo un problema al enviar. Por favor intentá de nuevo o escribinos por WhatsApp.');
    });
}

// ── TURNOS ──
let turnoData = { dia: '', hora: '' };
let curStep = 1;

function selDia(btn, dia){
  document.querySelectorAll('.dia-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  turnoData.dia = dia;
}
function selHora(btn, hora){
  document.querySelectorAll('.hora-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  turnoData.hora = hora;
}
function goStep(n){
  if(n === 2 && !turnoData.dia){ alert('Por favor, seleccioná un día.'); return; }
  if(n === 3 && !turnoData.hora){ alert('Por favor, seleccioná un horario.'); return; }
  if(n === 3){
    const s = document.getElementById('sel-summary');
    s.style.display = 'block';
    s.innerHTML = `<strong>Tu turno seleccionado:</strong> ${turnoData.dia} a las ${turnoData.hora} hs`;
  }
  [1,2,3].forEach(i => {
    document.getElementById('sp'+i).classList.toggle('show', i===n);
    const si = document.getElementById('si'+i);
    si.classList.remove('active','done');
    if(i===n) si.classList.add('active');
    else if(i<n) si.classList.add('done');
  });
  curStep = n;
}
function confirmarTurno(){
  const nombre = document.getElementById('t-nombre').value.trim();
  const tel    = document.getElementById('t-tel').value.trim();
  if(!nombre){ alert('Por favor, ingresá tu nombre.'); return; }
  if(!tel){ alert('Por favor, ingresá tu teléfono.'); return; }
  const msg = encodeURIComponent(
    `📅 SOLICITUD DE TURNO – Evaluación física\n\n` +
    `👤 Nombre: ${nombre}\n` +
    `📱 Teléfono: ${tel}\n` +
    `📆 Día: ${turnoData.dia}\n` +
    `⏰ Horario: ${turnoData.hora} hs\n\n` +
    `¡Hola Elite Center! Solicito un turno para evaluación física.`
  );
  const link = `https://wa.me/5492657315090?text=${msg}`;
  document.getElementById('turno-wa-link').href = link;
  document.getElementById('turno-ok-txt').textContent = `Turno solicitado: ${turnoData.dia} a las ${turnoData.hora} hs. Te confirman por WhatsApp a la brevedad.`;
  document.getElementById('turno-box').style.display = 'none';
  document.getElementById('turno-ok').style.display = 'block';
  window.open(link, '_blank');
}

// ── PRELOADER ──
(function(){
  const loader  = document.getElementById('preloader');
  const bar     = loader.querySelector('.pre-bar');
  const pct     = document.getElementById('pre-pct');
  const logo    = loader.querySelector('.pre-logo');
  let progress  = 0;
  let done      = false;

  // Animate progress bar
  const tick = setInterval(() => {
    // Speed up near end, slow at 90 waiting for window.load
    const step = progress < 70 ? (Math.random() * 4 + 2)
               : progress < 90 ? (Math.random() * 1.2 + 0.4)
               : 0;
    progress = Math.min(progress + step, 99);
    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
    if (progress >= 90) pct.style.color = 'var(--red)';
  }, 40);

  function finish() {
    if (done) return;
    done = true;
    clearInterval(tick);
    // Snap to 100
    progress = 100;
    bar.style.width = '100%';
    pct.textContent = '100%';
    pct.style.color = 'var(--red)';
    // Brief pause then exit
    setTimeout(() => {
      loader.classList.add('pre-exit');
      setTimeout(() => { loader.style.display = 'none'; }, 700);
    }, 320);
  }

  // Finish when page loads, or after max 3.5s
  window.addEventListener('load', finish);
  setTimeout(finish, 3500);
})();

// ── CONTADOR ANIMADO (hero stats + sección socios) ──
function animateCount(el, target, duration, suffix) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const em = el.querySelector('em');
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.childNodes[0].textContent = start;
    if (em) em.textContent = suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

// Hero stats — trigger when hero stats become visible
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.stat-n[data-target]').forEach(el => {
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          animateCount(el, target, 1800, suffix);
        });
        statsObs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  statsObs.observe(heroStats);
}

// Sección socios counter
const contadorEl = document.getElementById('contador-num');
if (contadorEl) {
  const contObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        let n = 0;
        const target = 300;
        const step = Math.ceil(target / (2200 / 16));
        const timer = setInterval(() => {
          n = Math.min(n + step, target);
          contadorEl.textContent = n + '+';
          if (n >= target) clearInterval(timer);
        }, 16);
        contObs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  contObs.observe(contadorEl);
}

// ── WHATSAPP INTELIGENTE POR HORARIO ──
(function(){
  // Horarios: Lun-Jue 7-11, 15-16, 18-21 (Argentina = UTC-3)
  const now = new Date();
  const utcH = now.getUTCHours();
  const utcM = now.getUTCMinutes();
  const argH = ((utcH - 3) + 24) % 24; // UTC-3
  const day  = now.getUTCDay(); // 0=Dom,1=Lun...4=Jue

  const isWeekday = day >= 1 && day <= 4;
  const inShift = isWeekday && (
    (argH >= 7  && argH < 11) ||
    (argH >= 15 && argH < 16) ||
    (argH >= 18 && argH < 21)
  );

  const lbl = document.getElementById('wa-lbl');
  const btn = document.getElementById('wa-btn');
  if (!lbl || !btn) return;

  if (inShift) {
    lbl.textContent = '¡Estamos online ahora!';
    lbl.style.color = '#25D366';
    btn.href = 'https://wa.me/5492657315090?text=Hola%20Elite%20Center!%20Ya%20vi%20los%20planes%20en%20la%20web%20y%20quiero%20empezar.%20%F0%9F%92%AA';
  } else {
    lbl.textContent = 'Dejanos tu consulta';
    btn.href = 'https://wa.me/5492657315090?text=Hola%20Elite%20Center!%20Vi%20la%20web%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n.%20Cuando%20puedan%20me%20contactan%20%F0%9F%92%AA';
  }
})();

// ── GSAP GALERÍA ──
(function(){
  if(typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const sec = document.getElementById('galeria');
  if(!sec) return;

  // Header elements entrance
  gsap.to('.gal-label', {
    opacity:1, y:0, duration:.7, ease:'power3.out',
    scrollTrigger:{trigger:sec, start:'top 80%'}
  });
  gsap.to('.gal-title', {
    opacity:1, y:0, duration:.8, delay:.1, ease:'power3.out',
    scrollTrigger:{trigger:sec, start:'top 80%'}
  });
  gsap.to('.gal-sub', {
    opacity:1, y:0, duration:.7, delay:.2, ease:'power3.out',
    scrollTrigger:{trigger:sec, start:'top 80%'}
  });

  // Staggered grid items
  gsap.to('.gal-item', {
    opacity:1, y:0, scale:1,
    duration:.75,
    ease:'power3.out',
    stagger:{amount:.55, from:'start'},
    scrollTrigger:{
      trigger:'#galeriaGrid',
      start:'top 85%',
    }
  });

  // Parallax subtle on each image
  document.querySelectorAll('.gal-item img').forEach(img => {
    gsap.to(img, {
      yPercent: -8,
      ease:'none',
      scrollTrigger:{
        trigger: img.closest('.gal-item'),
        start:'top bottom',
        end:'bottom top',
        scrub: true
      }
    });
  });

  // ── LIGHTBOX ──
  const items    = Array.from(document.querySelectorAll('.gal-item'));
  const lightbox = document.getElementById('galLightbox');
  const lbImg    = document.getElementById('galLbImg');
  const lbCap    = document.getElementById('galLbCaption');
  const btnClose = document.getElementById('galClose');
  const btnPrev  = document.getElementById('galPrev');
  const btnNext  = document.getElementById('galNext');
  let current    = 0;

  function openLb(idx){
    current = idx;
    const item = items[idx];
    lbImg.src     = item.querySelector('img').src;
    lbImg.alt     = item.dataset.label || '';
    lbCap.textContent = item.dataset.label || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function navigate(dir){
    current = (current + dir + items.length) % items.length;
    gsap.fromTo(lbImg, {opacity:0, x: dir*40},{opacity:1, x:0, duration:.3, ease:'power2.out'});
    lbImg.src = items[current].querySelector('img').src;
    lbCap.textContent = items[current].dataset.label || '';
  }

  items.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
  btnClose.addEventListener('click', closeLb);
  btnPrev.addEventListener('click',  () => navigate(-1));
  btnNext.addEventListener('click',  () => navigate(1));
  lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if(!lightbox.classList.contains('open')) return;
    if(e.key==='Escape')      closeLb();
    if(e.key==='ArrowLeft')   navigate(-1);
    if(e.key==='ArrowRight')  navigate(1);
  });
})();

// ═══════════════════════════════════════════
// GSAP – ANIMACIONES GLOBALES
// ═══════════════════════════════════════════
(function(){
  if(typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // ── Utilidad: animación genérica por selector ──
  function fadeUp(selector, opts = {}){
    const els = document.querySelectorAll(selector);
    if(!els.length) return;
    gsap.set(els, { opacity:0, y: opts.y || 36, scale: opts.scale || 1 });
    els.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to(el, {
          opacity:1, y:0, scale:1,
          duration: opts.duration || .75,
          delay: (opts.stagger || 0) * i,
          ease: opts.ease || 'power3.out'
        })
      });
    });
  }

  // ── HERO ──
  const heroTl = gsap.timeline({ delay:.1 });
  heroTl
    .from('.hero-h',     { opacity:0, y:50, duration:.9, ease:'power4.out' })
    .from('.hero-loc',   { opacity:0, y:20, duration:.6, ease:'power3.out' }, '-=.5')
    .from('.hero-p',     { opacity:0, y:20, duration:.6, ease:'power3.out' }, '-=.4')
    .from('.hero-btns',  { opacity:0, y:20, duration:.6, ease:'power3.out' }, '-=.4')
    .from('.hero-stats .stat', {
      opacity:0, y:30, stagger:.15, duration:.6, ease:'power3.out'
    }, '-=.3');

  // ── ABOUT ──
  gsap.set('.about-img', { opacity:0, x:-50 });
  ScrollTrigger.create({
    trigger:'.about',
    start:'top 80%', once:true,
    onEnter: () => gsap.to('.about-img', { opacity:1, x:0, duration:.9, ease:'power3.out' })
  });
  gsap.set('.about .reveal', { opacity:0, x:40 });
  ScrollTrigger.create({
    trigger:'.about',
    start:'top 80%', once:true,
    onEnter: () => gsap.to('.about .reveal', {
      opacity:1, x:0, duration:.85, delay:.15, ease:'power3.out'
    })
  });

  // ── SECTION LABELS & TITLES (sec-lbl / sec-h) ──
  document.querySelectorAll('.sec-lbl, .sec-h').forEach(el => {
    // skip gallery ones (handled separately)
    if(el.classList.contains('gal-label') || el.classList.contains('gal-title')) return;
    gsap.set(el, { opacity:0, y:28 });
    ScrollTrigger.create({
      trigger: el, start:'top 88%', once:true,
      onEnter: () => gsap.to(el, { opacity:1, y:0, duration:.7, ease:'power3.out' })
    });
  });

  // ── VALUES ──
  gsap.set('.val-c', { opacity:0, y:40, scale:.96 });
  ScrollTrigger.create({
    trigger:'.vals-g', start:'top 82%', once:true,
    onEnter: () => gsap.to('.val-c', {
      opacity:1, y:0, scale:1,
      stagger:.12, duration:.7, ease:'back.out(1.4)'
    })
  });

  // ── PROGRAMS (cards con imagen) ──
  gsap.set('.prog', { opacity:0, y:50 });
  ScrollTrigger.create({
    trigger:'.progs-g', start:'top 82%', once:true,
    onEnter: () => gsap.to('.prog', {
      opacity:1, y:0,
      stagger:.1, duration:.8, ease:'power3.out'
    })
  });

  // ── PROCESS STEPS ──
  gsap.set('.step', { opacity:0, x:-30 });
  ScrollTrigger.create({
    trigger:'.steps-g', start:'top 82%', once:true,
    onEnter: () => gsap.to('.step', {
      opacity:1, x:0,
      stagger:.15, duration:.7, ease:'power3.out'
    })
  });

  // ── PLANES (plan cards) ──
  gsap.set('.plan', { opacity:0, y:45, scale:.97 });
  ScrollTrigger.create({
    trigger:'.plans-g', start:'top 82%', once:true,
    onEnter: () => gsap.to('.plan', {
      opacity:1, y:0, scale:1,
      stagger:.12, duration:.75, ease:'back.out(1.2)'
    })
  });

  // ── FORMULARIO ──
  gsap.set('.form-info', { opacity:0, x:-40 });
  gsap.set('#form-box',  { opacity:0, x: 40 });
  ScrollTrigger.create({
    trigger:'#inscripcion', start:'top 78%', once:true,
    onEnter: () => {
      gsap.to('.form-info', { opacity:1, x:0, duration:.8, ease:'power3.out' });
      gsap.to('#form-box',  { opacity:1, x:0, duration:.8, delay:.15, ease:'power3.out' });
    }
  });

  // ── TESTIMONIOS ──
  gsap.set('.testi', { opacity:0, y:40, scale:.97 });
  ScrollTrigger.create({
    trigger:'.testi-g', start:'top 82%', once:true,
    onEnter: () => gsap.to('.testi', {
      opacity:1, y:0, scale:1,
      stagger:.15, duration:.75, ease:'back.out(1.3)'
    })
  });

  // ── FAQ ──
  gsap.set('.faq-item', { opacity:0, x:-20 });
  ScrollTrigger.create({
    trigger:'.faq-list', start:'top 82%', once:true,
    onEnter: () => gsap.to('.faq-item', {
      opacity:1, x:0,
      stagger:.07, duration:.55, ease:'power3.out'
    })
  });

  // ── CONTADOR SOCIOS (sección roja) ──
  const contadorSec = document.getElementById('contador');
  if(contadorSec){
    const contadorInner = contadorSec.querySelector('div');
    if(contadorInner){
      gsap.set(contadorInner.children, { opacity:0, y:30 });
      ScrollTrigger.create({
        trigger: contadorSec, start:'top 80%', once:true,
        onEnter: () => gsap.to(contadorInner.children, {
          opacity:1, y:0,
          stagger:.15, duration:.7, ease:'back.out(1.3)'
        })
      });
    }
  }

  // ── CTA BANNER ──
  gsap.set('.cta-banner', { opacity:0, y:30 });
  ScrollTrigger.create({
    trigger:'.cta-banner', start:'top 85%', once:true,
    onEnter: () => gsap.to('.cta-banner', { opacity:1, y:0, duration:.8, ease:'power3.out' })
  });

  // ── FOOTER ──
  gsap.set('.foot-col', { opacity:0, y:25 });
  ScrollTrigger.create({
    trigger:'footer', start:'top 90%', once:true,
    onEnter: () => gsap.to('.foot-col', {
      opacity:1, y:0,
      stagger:.1, duration:.6, ease:'power3.out'
    })
  });

  // ── LÍNEA ROJA decorativa que crece en secciones ──
  document.querySelectorAll('.divl').forEach(line => {
    gsap.set(line, { scaleX:0, transformOrigin:'left center' });
    ScrollTrigger.create({
      trigger: line, start:'top 85%', once:true,
      onEnter: () => gsap.to(line, { scaleX:1, duration:.8, ease:'power3.inOut' })
    });
  });

})();

// ── SMOOTH SCROLL – nativo del browser (behavior: smooth en CSS) ──

// ═══════════════════════════════════════════
// FAVICON ANIMADO
// ═══════════════════════════════════════════
(function(){
  const canvas  = document.createElement('canvas');
  canvas.width  = 32;
  canvas.height = 32;
  const ctx     = canvas.getContext('2d');
  const favicon = document.querySelector('link[rel="icon"]');
  if(!favicon) return;

  const img = new Image();
  img.src   = 'assets/img/logo-icon.png';

  let pulse  = 0;
  let hidden = false;
  let animId;

  // Detectar tab activa/inactiva
  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden;
    if(hidden){
      // Tab inactiva: mostrar "!" parpadeante
      cancelAnimationFrame(animId);
      blinkFavicon();
    } else {
      // Tab activa: volver al logo con pulso
      cancelAnimationFrame(animId);
      pulseFavicon();
    }
  });

  function pulseFavicon(){
    pulse += 0.04;
    const scale = 1 + Math.sin(pulse) * 0.06;
    const offset = (32 - 32 * scale) / 2;

    ctx.clearRect(0, 0, 32, 32);
    // Fondo negro redondeado
    ctx.fillStyle = '#0a0a0a';
    roundRect(ctx, 0, 0, 32, 32, 6);
    ctx.fill();
    // Logo escalado con pulso
    if(img.complete){
      ctx.save();
      ctx.translate(16, 16);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -16, -16, 32, 32);
      ctx.restore();
    }
    // Borde rojo sutil pulsante
    const alpha = 0.3 + Math.sin(pulse) * 0.2;
    ctx.strokeStyle = `rgba(204,0,0,${alpha})`;
    ctx.lineWidth = 1.5;
    roundRect(ctx, 1, 1, 30, 30, 5);
    ctx.stroke();

    favicon.href = canvas.toDataURL('image/png');
    animId = requestAnimationFrame(pulseFavicon);
  }

  let blinkOn = true;
  let blinkCount = 0;
  function blinkFavicon(){
    blinkCount++;
    if(blinkCount % 30 === 0) blinkOn = !blinkOn;

    ctx.clearRect(0, 0, 32, 32);
    ctx.fillStyle = blinkOn ? '#cc0000' : '#1a1a1a';
    roundRect(ctx, 0, 0, 32, 32, 6);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font      = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(blinkOn ? '!' : '⚡', 16, 17);

    favicon.href = canvas.toDataURL('image/png');
    animId = requestAnimationFrame(blinkFavicon);
  }

  function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  }

  img.onload = () => pulseFavicon();
  if(img.complete) pulseFavicon();
})();
