/* =============================================
   EL RESCOLDO — script.js
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

const FORM_KEY = 'rescoldo_form_data';

const inputNombre    = document.getElementById('nombre');
const inputTelefono  = document.getElementById('telefono');
const inputFecha     = document.getElementById('fecha');
const selectPersonas = document.getElementById('personas');

function saveFormData() {
  const data = {
    nombre:   inputNombre.value,
    telefono: inputTelefono.value,
    fecha:    inputFecha.value,
    personas: selectPersonas.value,
  };
  localStorage.setItem(FORM_KEY, JSON.stringify(data));
}

function restoreFormData() {
  const raw = localStorage.getItem(FORM_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (data.nombre)   inputNombre.value    = data.nombre;
    if (data.telefono) inputTelefono.value  = data.telefono;
    if (data.fecha)    inputFecha.value     = data.fecha;
    if (data.personas) selectPersonas.value = data.personas;
  } catch (e) {
    localStorage.removeItem(FORM_KEY);
  }
}

restoreFormData();

[inputNombre, inputTelefono, inputFecha, selectPersonas].forEach(el => {
  el.addEventListener('input', saveFormData);
  el.addEventListener('change', saveFormData);
});

const reservaForm = document.getElementById('reservaForm');
const confirmDiv  = document.getElementById('confirm');

reservaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  localStorage.removeItem(FORM_KEY);
  reservaForm.hidden = true;
  confirmDiv.hidden  = false;
});

/* =============================================
   1b. CARTA COMPLETA — localStorage
   Un solo botón que se mueve entre dos posiciones:
   - Cerrado: debajo de las 4 cartas, dice "Ver carta completa ↓"
   - Abierto:  al final de los 12 cortes, dice "Cerrar carta ↑"
   El estado se guarda en localStorage para persistir al recargar.
   ============================================= */

const CARTA_KEY  = 'rescoldo_carta_abierta';
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
    nav.style.background     = 'rgba(13,11,9,0.97)';
    nav.style.backdropFilter = 'blur(12px)';
    nav.style.borderBottom   = '1px solid rgba(201,151,58,0.1)';
  } else {
    nav.style.background     = 'linear-gradient(to bottom, rgba(13,11,9,0.95), transparent)';
    nav.style.backdropFilter = 'blur(2px)';
    nav.style.borderBottom   = 'none';
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