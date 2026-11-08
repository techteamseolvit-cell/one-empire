# ONE EMPIRE · sitio web (ES / EN)

Sitio estático negro y dorado. Español en `/`, inglés en `/en/`.

- Contenido: `tools/content.mjs` (ES + EN) · Ficha SEO: `tools/seo.mjs`
- Regenerar HTML: `node tools/build.mjs` (también crea `seo/ficha-seo.html` y `seo/ficha-seo.md`)
- Calendario de Lorena: pegar el enlace de Google Calendar (Programación de citas) en `assets/js/config.js` → `CALENDAR_URL`
- Imágenes: `assets/img/` con los nombres de la ficha SEO. Videos: `assets/video/` (`hugo-potros.mp4`, `vsl.mp4`, `bienvenida.mp4` y los testimonios).
- Pendiente: dominio en `tools/seo.mjs` (`SITE`), redes/WhatsApp/correo en `tools/build.mjs`, textos `[entre corchetes]`.
