# Laboratorio #1 — Landing Page Responsiva

**Curso:** ISW-521 — Programación en Ambiente Web I  
**Universidad:** Universidad Técnica Nacional (UTN) — Sede San Carlos  
**Docente:** Bryan Miguel Chaves Salas  
**Estudiante:** José Andrés Ortiz Marín  
**Cuatrimestre:** 2026 — II  

---

## Descripción

Landing page responsiva desarrollada para **DeliEmpanadas**, negocio de comida ubicado en Ciudad Quesada, San Carlos, Costa Rica. El sitio presenta la propuesta del negocio, su historia, menú completo de productos, galería fotográfica con carrusel y una sección de contacto con integración directa a WhatsApp y mapa de Google Maps.

El proyecto fue construido íntegramente con HTML5 semántico, CSS3 nativo y JavaScript vanilla, sin el uso de frameworks externos ni librerías de terceros.

---

## Tecnologías utilizadas

- **HTML5 semántico** — uso de `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<address>`, `<footer>` y atributos ARIA
- **CSS3 nativo** — Flexbox, CSS Grid, Media Queries, variables CSS, animaciones
- **JavaScript vanilla** — Web Storage API, IntersectionObserver, manipulación del DOM

---

## Requerimientos técnicos implementados

### HTML5 Semántico
Estructura construida exclusivamente con etiquetas semánticas. Se evitó el uso de `<div>` innecesarios y se aplicaron atributos ARIA en todos los elementos interactivos.

### CSS Grid y Flexbox
- **Flexbox:** navegación, hero actions, estadísticas, banda decorativa, testimonios, footer social y panel de accesibilidad
- **CSS Grid:** sección nosotros, grid del menú, formulario y footer

### Responsividad
Tres breakpoints definidos con `@media`:
- `1024px` — tablet
- `768px` — móvil
- `480px` — móvil pequeño

### Accesibilidad WCAG 2.1
- Atributos `aria-label`, `aria-expanded`, `aria-live`, `aria-pressed`, `aria-required`, `aria-describedby` en todos los elementos interactivos
- Skip-link para navegación por teclado
- Indicador `:focus-visible` visible en todos los elementos
- Contraste de texto sobre fondo cumple relación mínima 4.5:1
- Navegación completa por teclado (Tab, Enter, flechas en carrusel)
- Panel flotante con botones de tamaño de fuente (A- A A+) para usuarios con baja visión
- Soporte para `prefers-reduced-motion`

### Web Storage (localStorage)
Tres usos distintos de `localStorage`:
1. **Tema claro/oscuro** — guarda y restaura la preferencia del usuario al recargar
2. **Tamaño de fuente** — guarda el nivel de texto elegido (pequeño, normal, grande)
3. **Contador de visitas** — registra número de visitas y fecha de última visita

---

## Funcionalidades destacadas

- Carrusel de galería con loop infinito, autoplay y navegación por teclado
- Panel flotante de accesibilidad con control de tamaño de texto y modo claro/oscuro
- Botón flotante de WhatsApp para pedidos directos
- Botón flotante de regreso al inicio
- Menú hamburguesa en móvil
- Nav con efecto shrink proporcional al hacer scroll
- Mapa de Google Maps embebido con ubicación exacta del negocio
- Scroll reveal con `IntersectionObserver`

---

## Estructura del proyecto

```
lab01/
index.html
README.md
css/
  -- styles.css
js/
  -- script.js
```

---

## Instrucciones de ejecución

No requiere instalación ni servidor. Para visualizar el proyecto localmente:

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/joseandres0508/Laboratorio01.git
   ```
2. Abrir el archivo `index.html` directamente en el navegador

El proyecto también está disponible en línea vía GitHub Pages:  
🔗 **https://joseandres0508.github.io/Laboratorio01/**