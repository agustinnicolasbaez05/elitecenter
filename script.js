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

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) e.target.classList.add('vis') }), {threshold:.08});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

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
  const fd = new FormData(e.target);
  const d = Object.fromEntries(fd);
  const msg = encodeURIComponent(
    `🏋️ NUEVA INSCRIPCIÓN – Elite Center\n\n` +
    `👤 Nombre: ${d.nombre}\n` +
    `🎂 Edad: ${d.edad} años\n` +
    `📱 Teléfono: ${d.telefono}\n` +
    `🎯 Objetivo: ${d.objetivo}\n` +
    `📅 Plan de interés: ${d.plan||'Sin especificar'}\n` +
    `⏰ Horario preferido: ${d.horario||'Sin especificar'}\n` +
    `💪 Experiencia: ${d.experiencia||'Sin especificar'}\n` +
    `💬 Mensaje: ${d.mensaje||'Ninguno'}`
  );
  window.open(`https://wa.me/5492657315090?text=${msg}`, '_blank');
  document.getElementById('form-box').querySelector('form').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
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
