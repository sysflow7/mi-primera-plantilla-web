# SIDeN — Catálogo de módulos y configuración V2.0

**Referencia de código:** rama `siden-template-candidate-2026-10`, commit `592528ebae9fd7ad658e5b6d96ae43380fefd19e`.  
**Alcance:** referencia de configuración; un campo documentado no demuestra por sí solo que todos sus comportamientos estén certificados.

## 1. Reglas generales

- `config.json` define identidad, contenido, familia, modalidad, módulos, SEO y opciones de la instancia.
- Nunca guardar contraseñas, tokens privados ni secretos en `config.json`.
- En modo multipágina, cada elemento de `paginas[]` puede definir `ruta`, `nombre`, `h1`, `slogan`, `descripcion`, `tituloSEO`, `descripcionSEO`, `modulos`, `etiquetas` y `textos`.
- Cuando una página define `modulos`, esa lista controla qué módulos se muestran en esa ruta.
- Los datos de contenido suelen vivir en la raíz de configuración; las páginas seleccionan dónde se muestran.
- No confundir módulos del cliente con secciones de marketing SIDeN.

## 2. Campos principales

| Campo | Uso y regla |
|---|---|
| `siden.instanceId` | Identificador único de instancia. |
| `siden.templateFamily` | `corporate` para cliente; `commercial` para presencia comercial SIDeN. |
| `siden.architecture` | Identifica el modelo independiente. |
| `siden.domainMode` | Modalidad declarada; DNS y despliegue se verifican aparte. |
| `siden.customCss` | CSS específico si la implementación lo soporta. |
| `siden.version`, `siden.template` | Identificadores declarativos; no sustituyen el commit real. |
| `estadoComercial` | Distingue demo y cliente. |
| `modoSitio` | `single` o `multi`. |
| `indexable` | Mantener `false` en pruebas; activar tras aprobación. |
| `paginas[]` | Rutas y módulos por página en modo multi. |
| `analytics.ga4.measurementId` | ID de medición, si la versión lo implementa; debe ser propio del cliente. |
| `horarios` | Horarios; validar renderizado antes de prometer funcionalidad. |
| `heroImagenFondo`, `heroImagenVisual`, `mostrarHeroImagen` | Opciones de imagen del hero; probar combinaciones. |
| `cintaInformativa` | Configuración de cinta informativa; validar en Preview. |

## 3. Módulos documentados

| Módulo | Configuración principal | Condición de validación |
|---|---|---|
| `presentacion` | `presentacion.titulo`, `texto`, `imagen`, `alt` | Debe estar incluido; imagen opcional. |
| `perfil` | `perfil.descripcion`, `perfil.datos[]` | Verificar datos y visualización. |
| `beneficios` | `beneficios[]`: título, descripción, imagen opcional | Evitar contenido vacío y huecos. |
| `servicios` | `servicios[]`: nombre y descripción | Verificar servicios válidos. |
| `proceso` | `proceso[]`: título/nombre, descripción/detalle | Requiere pasos válidos e inclusión en módulos. |
| `identidad` | `identidad.titulo`, texto/descripción, imagen/alt opcionales | Puede solaparse con presentación; no duplicar “Quiénes somos”. |
| `filosofia` | `filosofia.titulo`, texto/descripción, imagen/alt opcionales | Debe aportar contenido distinto de la biografía. |
| `productos` | `productos[]`: nombre, descripción, precio/imagen opcionales | Sin imágenes rotas. |
| `menu` | `menu[]`: nombre, descripción, categoría, precio e imagen opcionales | Validar cada elemento. |
| `galeria` | `galeria[]` con archivos de imagen | Requiere imágenes existentes y módulo incluido. |
| `ubicacion` | Dirección, `maps`, `mapEmbedUrl`, horarios y teléfono | Validar enlaces y datos. |
| `contacto` | WhatsApp, teléfono, email, catálogo y textos | No dejar botones con destinos inválidos. |
| `faq` | `faq.activo`, `faq.titulo`, `faq.preguntas[]` | En cliente, preguntas válidas, activo y módulo incluido. |
| `soluciones` | Sección comercial/planes SIDeN | No mostrar en corporate cliente. |

## 4. Familias y estado comercial

- `templateFamily: commercial` corresponde a la presencia comercial SIDeN y puede incluir proyectos, problema, solución y planes, según HTML y configuración.
- `templateFamily: corporate` corresponde al sitio de un cliente; no debe mostrar marketing de SIDeN cuando `estadoComercial: cliente`.
- Demo y cliente pueden tener reglas diferentes para FAQ y contenido de ejemplo. Revisar conjuntamente familia y estado.
- No declarar certificado un comportamiento solo porque haya código preparado; comprobarlo en Preview.

## 5. Navegación y multipágina

La navegación se genera a partir de módulos y etiquetas disponibles. Los módulos pueden no mostrarse si les faltan datos válidos. En modo `multi`, declarar rutas únicas e incluir `/`; probar cada ruta con acceso directo y recarga, además de un 404 para rutas no declaradas.

## 6. SEO y analítica

- Mantener `indexable: false` durante desarrollo/Preview.
- Verificar `robots.txt`, `sitemap.xml`, canonical, título, descripción, datos estructurados y ausencia de `noindex` contradictorio.
- `indexable: true` no garantiza indexación efectiva por Google.
- Usar Measurement ID propio de GA4 por cliente cuando aplique y excluir Preview de la analítica real.
- `baseDomain` no configura por sí solo DNS ni demuestra conexión correcta del dominio al Worker.

## 7. Pruebas y cambios

Al modificar un módulo, probar contenido presente, vacío y opcional; enlaces y navegación; ausencia de espacios vacíos/recursos rotos; aislamiento corporate/commercial y demo/cliente; rutas multipágina y regresiones pertinentes. Guardar evidencia y commit probado.

Si una necesidad es exclusiva de un cliente, preferir configuración o variante separada. Si el cambio puede afectar otros sitios, advertirlo antes de editar. No alterar producción sin autorización expresa.
