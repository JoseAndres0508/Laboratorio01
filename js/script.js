/* =============================================
   DELIEMPANADAS — script.js
   ISW-521 Laboratorio #1 — UTN

   Funcionalidades:
   1. Web Storage — localStorage:
      a) Guardado y recuperación de datos del formulario de reserva
      b) Persistencia del estado abierto/cerrado de la carta completa
   2. Carta completa — toggle expandible
   3. Menú hamburguesa (móvil)
   4. Nav scroll effect
   5. Scroll reveal con IntersectionObserver
   ============================================= */

/* =============================================
   1a. FORMULARIO DE RESERVA — localStorage
   Guarda nombre, teléfono, fecha y personas
   mientras el usuario escribe; los recupera
   si recarga la página.
   ============================================= */

/* =============================================
   Web Storage — localStorage
   Guarda la última página visitada y el número
   de visitas del usuario para personalizar
   la experiencia en visitas futuras.
   ============================================= */
const VISIT_KEY = 'deliempanadas_visitas';

function registrarVisita() {
  const raw   = localStorage.getItem(VISIT_KEY);
  const datos = raw ? JSON.parse(raw) : { visitas: 0, ultima: null };
  datos.visitas++;
  datos.ultima = new Date().toISOString();
  localStorage.setItem(VISIT_KEY, JSON.stringify(datos));
}

registrarVisita();

/* =============================================
   1b. CARTA COMPLETA — localStorage
   Un solo botón que se mueve entre dos posiciones:
   - Cerrado: debajo de las 4 cartas, dice "Ver carta completa ↓"
   - Abierto:  al final de los 12 cortes, dice "Cerrar carta ↑"
   El estado se guarda en localStorage para persistir al recargar.
   ============================================= */

const CARTA_KEY  = 'deliempanadas_carta_abierta';
const menuFooter = document.getElementById('menuFooter');   // contenedor original
const cartaPanel = document.getElementById('carta-completa');
const btn        = document.getElementById('btnCarta');     // el único botón

function abrirCarta(scroll = false) {
  // 1. Mostrar los 8 cortes extra
  cartaPanel.hidden = false;

  // 2. Mover el botón al final del panel
  cartaPanel.appendChild(menuFooter);

  // 3. Cambiar texto y estilo del botón
  btn.innerHTML = 'Cerrar carta <span aria-hidden="true">↑</span>';
  btn.setAttribute('aria-expanded', 'true');
  btn.setAttribute('aria-label', 'Cerrar la carta completa');

  // 4. Añadir separador visual cuando está al fondo
  menuFooter.classList.add('carta-btn-bottom');

  // 5. Guardar estado
  localStorage.setItem(CARTA_KEY, 'true');

  // 6. Scroll suave hacia los nuevos cortes
  if (scroll) {
    setTimeout(() => {
      cartaPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}

function cerrarCarta() {
  // 1. Mover el botón de vuelta a su posición original (debajo de las 4 cartas)
  const menuSection = cartaPanel.parentElement;
  menuSection.insertBefore(menuFooter, cartaPanel);

  // 2. Ocultar los 8 cortes extra
  cartaPanel.hidden = true;

  // 3. Restaurar texto y estilo del botón
  btn.innerHTML = 'Ver carta completa <span class="btn-arrow" aria-hidden="true">↓</span>';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Ver los 12 cortes de la carta completa');

  // 4. Quitar separador visual
  menuFooter.classList.remove('carta-btn-bottom');

  // 5. Guardar estado
  localStorage.setItem(CARTA_KEY, 'false');

  // 6. Scroll suave de vuelta al botón
  setTimeout(() => {
    menuFooter.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 50);
}

// Restaurar estado al recargar la página
if (localStorage.getItem(CARTA_KEY) === 'true') {
  abrirCarta(false);
}

// Un solo listener — el botón siempre sabe en qué estado está
btn.addEventListener('click', () => {
  const abierta = btn.getAttribute('aria-expanded') === 'true';
  abierta ? cerrarCarta() : abrirCarta(true);
});

/* =============================================
   2. MENÚ HAMBURGUESA (móvil)
   ============================================= */

const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  navToggle.querySelector('span').textContent = isOpen ? '✕' : '☰';
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelector('span').textContent = '☰';
  });
});

/* =============================================
   3. EFECTO NAV AL HACER SCROLL
   ============================================= */

const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.background     = '#B71C1C';
    nav.style.backdropFilter = 'blur(12px)';
    nav.style.borderBottom   = '3px solid #F9A825';
  } else {
    nav.style.background     = '#D32F2F';
    nav.style.backdropFilter = 'blur(2px)';
    nav.style.borderBottom   = '3px solid #F9A825';
  }
}, { passive: true });

/* =============================================
   4. SCROLL REVEAL — IntersectionObserver
   ============================================= */

function observeReveal(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = (index % 4) * 100;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

observeReveal('.menu-card, .nosotros-text, .nosotros-img, .test-card, .g-item');

btn.addEventListener('click', () => {
  if (btn.getAttribute('aria-expanded') === 'true') {
    setTimeout(() => observeReveal('.carta-grid .menu-card'), 100);
  }
});

/* =============================================
   5. BOTÓN FLOTANTE — Volver al inicio
   Aparece cuando el usuario baja más de 400px.
   Al hacer click sube suavemente al top.
   ============================================= */

const btnTop = document.getElementById('btnTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    btnTop.hidden = false;
    // Pequeño delay para que la transición opacity sea visible
    requestAnimationFrame(() => btnTop.classList.add('visible'));
  } else {
    btnTop.classList.remove('visible');
    // Esperar que termine la transición antes de ocultar
    btnTop.addEventListener('transitionend', () => {
      if (!btnTop.classList.contains('visible')) btnTop.hidden = true;
    }, { once: true });
  }
}, { passive: true });

btnTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
/* =============================================
   6. CARRUSEL DE GALERÍA — Loop infinito
   Técnica: clonar primer y último slide para
   transición continua sin saltos visibles.
   Accesible: aria-live, teclado, dots.
   ============================================= */

const track   = document.getElementById('carruselTrack');
const dots    = Array.from(document.querySelectorAll('.dot-btn'));
const btnPrev = document.getElementById('carruselPrev');
const btnNext = document.getElementById('carruselNext');
let autoTimer = null;
let isTransitioning = false;

if (track) {
  const realSlides = Array.from(track.querySelectorAll('.carrusel-slide'));
  const total      = realSlides.length;
  let current      = 1; // empieza en 1 porque el 0 es el clon del último

  // Clonar primer y último slide para loop infinito
  const firstClone = realSlides[0].cloneNode(true);
  const lastClone  = realSlides[total - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');
  firstClone.classList.remove('active');
  lastClone.classList.remove('active');

  track.appendChild(firstClone);      // clon del primero al final
  track.insertBefore(lastClone, realSlides[0]); // clon del último al inicio

  // Posicionar sin animación en el primer slide real
  track.style.transition = 'none';
  track.style.transform  = `translateX(-${current * 100}%)`;

  function updateDots(index) {
    // index real = current - 1 (descontamos el clon inicial)
    const realIndex = ((index - 1) + total) % total;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === realIndex);
      d.setAttribute('aria-selected', i === realIndex ? 'true' : 'false');
    });
  }

  function goTo(index, animate = true) {
    if (isTransitioning) return;
    isTransitioning = true;
    current = index;

    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform  = `translateX(-${current * 100}%)`;
    updateDots(current);
  }

  // Al terminar la transición, reposicionar sin animación si es un clon
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    const allSlides = track.querySelectorAll('.carrusel-slide');
    const totalWithClones = allSlides.length; // total + 2 clones

    if (current === 0) {
      // Estamos en el clon del último → saltar al último real
      current = totalWithClones - 2;
      track.style.transition = 'none';
      track.style.transform  = `translateX(-${current * 100}%)`;
      updateDots(current);
    } else if (current === totalWithClones - 1) {
      // Estamos en el clon del primero → saltar al primero real
      current = 1;
      track.style.transition = 'none';
      track.style.transform  = `translateX(-${current * 100}%)`;
      updateDots(current);
    }
  });

  function startAuto() {
    autoTimer = setInterval(() => {
      const allSlides = track.querySelectorAll('.carrusel-slide');
      goTo(current + 1);
    }, 5000);
  }

  function stopAuto() { clearInterval(autoTimer); }

  // Inicializar dots
  updateDots(current);

  // Botones
  btnPrev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  btnNext.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  // Dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i + 1); startAuto(); });
  });

  // Teclado
  document.querySelector('.carrusel').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { stopAuto(); goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
  });

  // Pausa en hover
  const carruselEl = document.querySelector('.carrusel');
  carruselEl.addEventListener('mouseenter', stopAuto);
  carruselEl.addEventListener('mouseleave', startAuto);

  // Autoplay (respeta prefers-reduced-motion)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    startAuto();
  }
}

/* =============================================
   7. MODO CLARO / OSCURO — localStorage
   Guarda la preferencia del usuario y la aplica
   al recargar la página automáticamente.
   ============================================= */

const THEME_KEY    = 'deliempanadas_tema';
const themeToggle  = document.getElementById('themeToggle');
const themeIcon    = document.querySelector('.theme-icon');

function applyTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
    themeToggle.setAttribute('aria-pressed', 'true');
    themeToggle.setAttribute('aria-label', 'Activar modo claro');
  } else {
    document.body.classList.remove('dark-mode');
    themeIcon.textContent = '🌙';
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.setAttribute('aria-label', 'Activar modo oscuro');
  }
}

// Restaurar tema guardado al cargar
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  // Respetar preferencia del sistema operativo
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  const newTheme = isDark ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem(THEME_KEY, newTheme); // PERSISTENCIA
});

/* =============================================
   8. TAMAÑO DE FUENTE — localStorage
   3 niveles: pequeño (14px), normal (16px),
   grande (19px). Escala todo el sitio via rem.
   ============================================= */

const FONT_KEY     = 'deliempanadas_fuente';
const FONT_SIZES   = [14, 16, 19]; // px — pequeño, normal, grande
const FONT_DEFAULT = 1;            // índice del tamaño normal
let fontIndex      = FONT_DEFAULT;

const btnDecrease = document.getElementById('fontDecrease');
const btnReset    = document.getElementById('fontReset');
const btnIncrease = document.getElementById('fontIncrease');

function applyFontSize(index) {
  fontIndex = Math.max(0, Math.min(2, index));
  document.documentElement.style.fontSize = FONT_SIZES[fontIndex] + 'px';

  // Actualizar estado de botones
  btnDecrease.disabled = fontIndex === 0;
  btnIncrease.disabled = fontIndex === 2;
  btnDecrease.style.opacity = fontIndex === 0 ? '0.4' : '1';
  btnIncrease.style.opacity = fontIndex === 2 ? '0.4' : '1';

  // Actualizar aria-pressed en botón activo
  [btnDecrease, btnReset, btnIncrease].forEach((btn, i) => {
    btn.setAttribute('aria-pressed', i === fontIndex ? 'true' : 'false');
  });

  localStorage.setItem(FONT_KEY, fontIndex); // PERSISTENCIA
}

// Restaurar tamaño guardado al cargar
const savedFont = localStorage.getItem(FONT_KEY);
applyFontSize(savedFont !== null ? parseInt(savedFont) : FONT_DEFAULT);

btnDecrease.addEventListener('click', () => applyFontSize(fontIndex - 1));
btnReset.addEventListener('click',    () => applyFontSize(FONT_DEFAULT));
btnIncrease.addEventListener('click', () => applyFontSize(fontIndex + 1));