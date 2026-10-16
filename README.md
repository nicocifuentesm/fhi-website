# FHI Ingeniería — Sitio web corporativo

Sitio multipágina bilingüe (ES/EN), responsive, listo para hosting compartido o estático.
Stack: HTML5 · CSS3 · JavaScript vanilla · imágenes WebP.

## Estructura

```
/
├── index.html              → Redirección inteligente a /es/ o /en/
├── .htaccess               → HTTPS, gzip, cache, seguridad
├── robots.txt
├── sitemap.xml
├── README.md
├── es/                     → Versión en español (12 páginas: core + empleo, sostenibilidad, portal, legal)
├── en/                     → Versión en inglés (12 páginas equivalentes)
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── img/                → Fotografías .webp
    └── logo/               → fhi-logo.svg, fhi-logo-white.svg, favicon.ico
```

## Despliegue paso a paso

### 1. Configurar el formulario (Formspree)

El sitio usa **Formspree** (sin backend propio).

1. Cree una cuenta en [https://formspree.io](https://formspree.io)
2. Cree un formulario nuevo y copie el endpoint (`https://formspree.io/f/xxxxxxxx`)
3. Reemplace `YOUR_FORM_ID` en todos los `action` de formularios:
   - `es/index.html`, `es/contacto.html`, `es/publicaciones.html`
   - `en/index.html`, `en/contact.html`, `en/insights.html`

```bash
# Desde la raíz del proyecto (macOS/Linux):
find es en -name "*.html" -exec sed -i '' 's/YOUR_FORM_ID/xxxxxxxx/g' {} +
```

### 2. Actualizar datos de contacto

Antes de publicar, reemplace en todo el sitio:

| Placeholder | Descripción |
|-------------|-------------|
| `contacto@fhi.cl` | Email corporativo |
| `+56 2 2345 6789` | Teléfono |
| `56912345678` | WhatsApp (sin + ni espacios, para wa.me) |
| `www.fhi.cl` | Dominio real (sitemap, canonical, OG) |
| Nombres del equipo | En `nosotros.html` / `about.html` |

### 3. Subir a hosting

**Hostinger / cPanel / Donweb (Apache)**

1. Comprima el contenido (no la carpeta padre) en un ZIP, o suba vía FTP.
2. Suba todos los archivos a `public_html/` (o la carpeta raíz del dominio).
3. Verifique que `.htaccess` se subió (archivos ocultos visibles en el cliente FTP).
4. Abra `https://sudominio.cl` — debe redirigir a `/es/` o `/en/`.

**Netlify**

1. Arrastre la carpeta del proyecto a Netlify Drop, o conecte el repositorio.
2. Publish directory: raíz del proyecto (donde está `index.html`).
3. Agregue un archivo `_redirects` si desea forzar HTTPS (Netlify lo hace por defecto).
4. El `.htaccess` no aplica en Netlify; la redirección raíz ya está en `index.html`.

**Vercel**

1. `vercel` desde la raíz, o importe el proyecto en el dashboard.
2. Framework preset: Other / Static.
3. Opcional: cree `vercel.json` con redirects si lo necesita.

### 4. DNS y SSL

1. Apunte el dominio (A / CNAME) al hosting.
2. Active SSL (Let's Encrypt en cPanel/Hostinger; automático en Netlify/Vercel).
3. Confirme que `https://www.fhi.cl/es/` y `/en/` cargan sin mixed content.

### 5. Post-lanzamiento

- [ ] Enviar `sitemap.xml` a Google Search Console
- [ ] Verificar hreflang ES/EN
- [ ] Probar formulario de contacto de extremo a extremo
- [ ] Probar menú móvil y filtros de proyectos
- [ ] Actualizar fotos y LinkedIn del equipo
- [ ] Reemplazar número de WhatsApp real

## Vista previa local

```bash
cd /ruta/a/FHI
python3 -m http.server 8080
# Abrir http://localhost:8080/es/
```

## Funcionalidades incluidas

- Header sticky con cambio de logo (blanco ↔ color) + enlace Portal
- Empleo / Careers (vacantes + postulación)
- Sostenibilidad / ESG (marcos GISTM–SEIA + solicitud de declaración)
- Portal de clientes (UI de login; conectar SharePoint/SSO en producción)
- Privacidad, Cookies y Accesibilidad (WCAG-oriented)
- Menú móvil, animaciones al scroll, contadores, filtros de proyectos
- Validación de formulario + envío Formspree
- Banner de cookies (aceptar todas / solo necesarias)
- SEO: meta, OG, hreflang, schema.org

## Paleta y tipografía

| Token | Valor |
|-------|-------|
| Negro | `#0A0A0A` |
| Naranja FHI | `#F58220` |
| Blanco | `#FFFFFF` |
| Gris claro | `#F5F5F5` |
| Gris medio | `#6B6B6B` |
| Gris línea | `#E0E0E0` |
| Títulos | Montserrat Bold/ExtraBold |
| Cuerpo | Inter Regular/Medium |

## Notas de contenido

- El copy técnico referencia estándares reales (GISTM, SERNAGEOMIN, SEIA, CDA, ICMM, Programa Tranque).
- Los proyectos se presentan como tipologías de trabajo sin nombrar clientes (confidencialidad).
- “Constructibilidad” reemplaza cualquier mención a EoR en este sitio.
- Actualice cifras de contadores si dispone de datos auditados distintos.

## Soporte

Para cambios de marca, hosting o Formspree, edite los archivos indicados arriba. No se requieren dependencias npm ni build step para producción.
