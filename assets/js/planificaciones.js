/**
 * ═══════════════════════════════════════════════════════
 *  ELITE CENTER – Base de datos de planificaciones
 *
 *  CÓMO AGREGAR UN ALUMNO:
 *  1. Subí el PDF a Google Drive
 *  2. Clic derecho → Compartir → "Cualquiera con el link" → Copiar link
 *  3. Agregá una entrada abajo con nombre, DNI (últimos 4 dígitos), tipo, fecha y link
 *
 *  PLANIFICACIÓN COMPARTIDA (varios alumnos mismo PDF):
 *  Usá el mismo link de Drive para múltiples alumnos.
 *
 *  DNI: solo se pide si hay dos alumnos con el mismo nombre.
 *  Si el nombre es único, el alumno descarga directo sin confirmación.
 * ═══════════════════════════════════════════════════════
 */

const PLANIFICACIONES = [

  // ── EJEMPLOS (reemplazar con datos reales) ──
  {
    nombre:     'Juan Pérez',
    dni:        '4521',   // últimos 4 dígitos del DNI
    tipo:       'Entrenamiento Funcional',
    entrenador: 'Elite Center',
    fecha:      'Marzo 2026',
    drive:      'https://drive.google.com/file/d/REEMPLAZAR_ID/view',
  },
  {
    nombre:     'Juan Pérez',
    dni:        '8834',   // otro Juan Pérez — se distingue por DNI
    tipo:       'Entrenamiento Deportivo',
    entrenador: 'Elite Center',
    fecha:      'Marzo 2026',
    drive:      'https://drive.google.com/file/d/REEMPLAZAR_ID/view',
  },
  {
    nombre:     'María González',
    dni:        '2277',
    tipo:       'Personalizado de Estética',
    entrenador: 'Elite Center',
    fecha:      'Marzo 2026',
    drive:      'https://drive.google.com/file/d/REEMPLAZAR_ID/view',
  },
  {
    nombre:     'Lucas Rodríguez',
    dni:        '9103',
    tipo:       'Personalizado de Salud',
    entrenador: 'Elite Center',
    fecha:      'Marzo 2026',
    drive:      'https://drive.google.com/file/d/REEMPLAZAR_ID/view',
  },

  // ── AGREGÁ ALUMNOS REALES ABAJO ──
  // {
  //   nombre:     'Nombre Apellido',
  //   dni:        '0000',  // últimos 4 dígitos del DNI
  //   tipo:       'Tipo de entrenamiento',
  //   entrenador: 'Elite Center',
  //   fecha:      'Mes Año',
  //   drive:      'https://drive.google.com/file/d/TU_FILE_ID/view',
  // },
];

// ════════════════════════════════════
// LÓGICA — no tocar
// ════════════════════════════════════

function normalizar(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ').trim();
}

const nombresUnicos = [...new Set(PLANIFICACIONES.map(a => a.nombre))];

// ── Autocompletado ──
document.addEventListener('DOMContentLoaded', () => {
  const input       = document.getElementById('planNombreInput');
  const suggestions = document.getElementById('planSuggestions');
  const dniWrap     = document.getElementById('planDniWrap');
  if (!input) return;

  input.addEventListener('input', () => {
    const val = input.value.trim();
    suggestions.innerHTML = '';
    suggestions.style.display = 'none';
    if (dniWrap) dniWrap.style.display = 'none';
    if (val.length < 2) return;

    const valNorm = normalizar(val);
    const matches = nombresUnicos.filter(n => normalizar(n).includes(valNorm));
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

  // DNI enter
  const dniInput = document.getElementById('planDniInput');
  if (dniInput) {
    dniInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') confirmarDni();
    });
    // Solo números
    dniInput.addEventListener('input', () => {
      dniInput.value = dniInput.value.replace(/\D/g, '').slice(0, 4);
    });
  }
});

// ── Búsqueda principal ──
function buscarPlan() {
  const input    = document.getElementById('planNombreInput');
  const query    = input.value.trim();
  const result   = document.getElementById('planResult');
  const card     = document.getElementById('planCard');
  const error    = document.getElementById('planError');
  const dniWrap  = document.getElementById('planDniWrap');
  const sugg     = document.getElementById('planSuggestions');

  sugg.style.display = 'none';
  result.style.display = 'none';
  card.style.display   = 'none';
  error.style.display  = 'none';
  if (dniWrap) dniWrap.style.display = 'none';

  if (!query) {
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
    return;
  }

  const queryNorm = normalizar(query);
  const matches = PLANIFICACIONES.filter(a => normalizar(a.nombre) === queryNorm);

  if (matches.length === 0) {
    // No encontrado
    result.style.display = 'block';
    error.style.display  = 'block';
    if (typeof gsap !== 'undefined') {
      gsap.from(error, { opacity:0, y:16, duration:.4, ease:'power3.out' });
      gsap.to(input, { x:-8, duration:.07, repeat:5, yoyo:true, ease:'none',
        onComplete: () => gsap.set(input, { x:0 }) });
    }
  } else if (matches.length === 1) {
    // Nombre único — mostrar directo
    mostrarPlan(matches[0]);
  } else {
    // Nombre duplicado — pedir DNI
    result.style.display = 'block';
    dniWrap.style.display = 'block';
    document.getElementById('planDniInput').value = '';
    document.getElementById('planDniInput').focus();
    if (typeof gsap !== 'undefined') {
      gsap.from(dniWrap, { opacity:0, y:16, duration:.45, ease:'power3.out' });
    }
  }
}

// ── Confirmar DNI cuando hay duplicados ──
function confirmarDni() {
  const nombre   = document.getElementById('planNombreInput').value.trim();
  const dni      = document.getElementById('planDniInput').value.trim();
  const card     = document.getElementById('planCard');
  const error    = document.getElementById('planError');
  const dniWrap  = document.getElementById('planDniWrap');
  const dniInput = document.getElementById('planDniInput');

  if (dni.length < 4) {
    dniInput.classList.add('shake');
    setTimeout(() => dniInput.classList.remove('shake'), 500);
    return;
  }

  const queryNorm = normalizar(nombre);
  const match = PLANIFICACIONES.find(
    a => normalizar(a.nombre) === queryNorm && a.dni === dni
  );

  if (match) {
    dniWrap.style.display = 'none';
    mostrarPlan(match);
  } else {
    // DNI incorrecto
    error.style.display = 'block';
    document.getElementById('planErrorMsg').textContent =
      'DNI incorrecto. Verificá los últimos 4 dígitos o consultá a tu entrenador.';
    if (typeof gsap !== 'undefined') {
      gsap.from(error, { opacity:0, y:12, duration:.35, ease:'power3.out' });
      gsap.to(dniInput, { x:-8, duration:.07, repeat:5, yoyo:true, ease:'none',
        onComplete: () => gsap.set(dniInput, { x:0 }) });
    }
  }
}

// ── Mostrar tarjeta de planificación ──
function mostrarPlan(alumno) {
  const result = document.getElementById('planResult');
  const card   = document.getElementById('planCard');

  result.style.display = 'block';
  card.style.display   = 'block';

  document.getElementById('planNombre').textContent     = alumno.nombre;
  document.getElementById('planTipo').textContent       = alumno.tipo;
  document.getElementById('planTipoRow').textContent    = alumno.tipo;
  document.getElementById('planEntrenador').textContent = alumno.entrenador;
  document.getElementById('planFecha').textContent      = alumno.fecha;
  document.getElementById('planDescarga').href          = alumno.drive;

  if (typeof gsap !== 'undefined') {
    gsap.from(card, { opacity:0, y:20, duration:.5, ease:'power3.out' });
  }
}

function resetPlan() {
  document.getElementById('planNombreInput').value          = '';
  document.getElementById('planResult').style.display      = 'none';
  document.getElementById('planCard').style.display        = 'none';
  document.getElementById('planError').style.display       = 'none';
  document.getElementById('planDniWrap').style.display     = 'none';
  document.getElementById('planSuggestions').style.display = 'none';
  document.getElementById('planNombreInput').focus();
}
