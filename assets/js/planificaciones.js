/**
 * ═══════════════════════════════════════════════════════
 *  ELITE CENTER – Base de datos de planificaciones
 *
 *  CÓMO AGREGAR UN ALUMNO:
 *  1. Subí el PDF a Google Drive
 *  2. Clic derecho → Compartir → "Cualquiera con el link puede ver" → Copiar link
 *  3. Agregá una línea abajo con el formato:
 *     'Nombre Apellido': { tipo, entrenador, fecha, drive }
 *
 *  PLANIFICACIÓN COMPARTIDA (varios alumnos mismo PDF):
 *  Repetís el mismo link de Drive para múltiples alumnos.
 *  Si actualizás el PDF en Drive, todos ven el nuevo automáticamente.
 * ═══════════════════════════════════════════════════════
 */

const PLANIFICACIONES = {

  // ── EJEMPLOS DE MUESTRA (reemplazar con datos reales) ──
  'Valentina Baez': {
    tipo:       'Entrenamiento Funcional',
    entrenador: 'Elite Center',
    fecha:      'Marzo 2026',
    drive:      'https://drive.google.com/file/d/18abk-24h7wqDVrOE0BTnOczce7oLVd-a/view?usp=sharing',
  },
  'Maximiliano Ostellino': {
    tipo:       'Personalizado de Estética',
    entrenador: 'Elite Center',
    fecha:      'Marzo 2026',
    drive:      'https://drive.google.com/file/d/1cIbOLjSKa8EyXfvK23WMm9Tq4_9TjTeb/view?usp=sharing',
  },
  'Maria Miranda': {
    tipo:       'Entrenamiento Deportivo',
    entrenador: 'Elite Center',
    fecha:      'Marzo 2026',
    drive:      'https://drive.google.com/file/d/1R8FXVSAcgdkmujzqvADgB2-DSslr6zyM/view?usp=sharing',
  },

  // ── AGREGÁ ALUMNOS REALES ABAJO ──
  // 'Nombre Apellido': {
  //   tipo:       'Tipo de entrenamiento',
  //   entrenador: 'Elite Center',
  //   fecha:      'Mes Año',
  //   drive:      'https://drive.google.com/file/d/TU_FILE_ID/view',
  // },
};

// ════════════════════════════════════
// LÓGICA — no tocar
// ════════════════════════════════════

function normalizar(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ').trim();
}

const nombresDB = Object.keys(PLANIFICACIONES);

document.addEventListener('DOMContentLoaded', () => {
  const input       = document.getElementById('planNombreInput');
  const suggestions = document.getElementById('planSuggestions');
  if (!input || !suggestions) return;

  input.addEventListener('input', () => {
    const val = input.value.trim();
    suggestions.innerHTML = '';
    suggestions.style.display = 'none';
    if (val.length < 2) return;

    const valNorm = normalizar(val);
    const matches = nombresDB.filter(n => normalizar(n).includes(valNorm));
    if (!matches.length) return;

    matches.slice(0, 6).forEach(nombre => {
      const item = document.createElement('div');
      item.className = 'plan-suggestion-item';
      const normNombre = normalizar(nombre);
      const idx = normNombre.indexOf(valNorm);
      item.innerHTML =
        nombre.substring(0, idx) +
        '<strong>' + nombre.substring(idx, idx + val.length) + '</strong>' +
        nombre.substring(idx + val.length);
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        input.value = nombre;
        suggestions.style.display = 'none';
        buscarPlan();
      });
      suggestions.appendChild(item);
    });
    suggestions.style.display = 'block';
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { suggestions.style.display = 'none'; }, 150);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') buscarPlan();
    if (e.key === 'Escape') suggestions.style.display = 'none';
  });
});

function buscarPlan() {
  const input  = document.getElementById('planNombreInput');
  const query  = input.value.trim();
  const result = document.getElementById('planResult');
  const card   = document.getElementById('planCard');
  const error  = document.getElementById('planError');
  const sugg   = document.getElementById('planSuggestions');

  sugg.style.display = 'none';

  if (!query) {
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
    return;
  }

  const queryNorm = normalizar(query);
  const match = nombresDB.find(n => normalizar(n) === queryNorm);
  result.style.display = 'block';

  if (match) {
    const alumno = PLANIFICACIONES[match];
    error.style.display = 'none';
    card.style.display  = 'block';
    document.getElementById('planNombre').textContent     = match;
    document.getElementById('planTipo').textContent       = alumno.tipo;
    document.getElementById('planTipoRow').textContent    = alumno.tipo;
    document.getElementById('planEntrenador').textContent = alumno.entrenador;
    document.getElementById('planFecha').textContent      = alumno.fecha;
    document.getElementById('planDescarga').href          = alumno.drive;
    if (typeof gsap !== 'undefined') {
      gsap.from(card, { opacity:0, y:20, duration:.5, ease:'power3.out' });
    }
  } else {
    card.style.display  = 'none';
    error.style.display = 'block';
    if (typeof gsap !== 'undefined') {
      gsap.from(error, { opacity:0, y:16, duration:.4, ease:'power3.out' });
      gsap.to(input, { x:-8, duration:.07, repeat:5, yoyo:true, ease:'none',
        onComplete: () => gsap.set(input, { x:0 }) });
    }
  }
}

function resetPlan() {
  document.getElementById('planNombreInput').value          = '';
  document.getElementById('planResult').style.display      = 'none';
  document.getElementById('planCard').style.display        = 'none';
  document.getElementById('planError').style.display       = 'none';
  document.getElementById('planSuggestions').style.display = 'none';
  document.getElementById('planNombreInput').focus();
}
