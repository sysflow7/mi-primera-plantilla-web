# Catálogo de módulos y configuración SIDeN V1.5

**Estado:** revisión técnica en rama de certificación `prueba-aislamiento-contenido-v1.5`.  
**Importante:** los cambios de este documento y del motor deben verificarse en Preview antes de considerarse certificados. No implica publicación en producción.

## 1. Regla general

- `config.json` define el contenido de la instancia y los módulos activos.
- En modo multipágina, cada objeto de `paginas[]` puede definir su propia lista `modulos`, además de `ruta`, `nombre`, `h1`, `slogan`, `descripcion`, `etiquetas` y `textos`.
- Si una página tiene `modulos`, esa lista determina los módulos que se muestran en esa ruta.
- Los campos de contenido —servicios, productos, perfil, proceso, identidad, galería y FAQ— se configuran en el nivel raíz; las páginas seleccionan dónde se muestran.
- No confundir un módulo del cliente con secciones de marketing propias de SIDeN.

## 2. Módulos

| Módulo | Configuración principal | Condición adicional |
|---|---|---|
| `presentacion` | `presentacion.titulo`, `presentacion.texto`, `presentacion.imagen`, `presentacion.alt` | Se muestra si está incluido en `modulos`. |
| `perfil` | `perfil.descripcion`, `perfil.datos[]` con `titulo` y `valor` | Se muestra si está incluido en `modulos`. |
| `beneficios` | `beneficios[]` con `titulo`, `descripcion`, opcional `imagen` | Se muestra si está incluido en `modulos`. |
| `servicios` | `servicios[]` con `nombre`, `descripcion` | Se muestra si está incluido en `modulos`. |
| `proceso` | `proceso[]` con `titulo` o `nombre`, y `descripcion` o `detalle` | Se muestra si está incluido y contiene al menos un paso. |
| `identidad` | `identidad.titulo`, `identidad.texto` o `identidad.descripcion`, opcional `imagen` y `alt` | Se muestra si está incluido y hay texto descriptivo. |
| `productos` | `productos[]` con `nombre`, `descripcion`, opcional `precio`, `imagen` | Se muestra si está incluido. Sin imagen, la tarjeta no genera una imagen rota. |
| `menu` | `menu[]` con `nombre`, `descripcion`, opcional `categoria`, `precio`, `imagen` | Se muestra si está incluido. |
| `galeria` | `galeria[]` con nombres de archivos de imagen | Requiere que el módulo esté incluido y que la lista tenga imágenes. |
| `ubicacion` | `direccion`, `direccionTexto`, `maps`, `mapEmbedUrl`, `horarios`, teléfono | Los enlaces externos deben ser HTTPS válido; el mapa embebido admite los proveedores y rutas permitidos por el motor. |
| `contacto` | `whatsapp`, `telefono`, `email`, `catalogo`, `textos.contacto` | Los enlaces externos configurables deben ser HTTPS válido; WhatsApp se construye a partir del número. |
| `faq` | `faq.activo`, `faq.titulo`, `faq.preguntas[]` con `pregunta` y `respuesta` | En web de cliente se requiere `activo: true`, preguntas válidas y módulo `faq` en la página. En demo/comercial se aplican valores predeterminados de SIDeN. |
| `soluciones` | Sección de planes SIDeN integrada en la plantilla | Visible en `templateFamily: commercial` y en demo corporativa (`estadoComercial: demo`); no debe aparecer en cliente corporativo. |

## 3. Secciones exclusivas de marketing SIDeN

Las secciones `proyectos`, `problema` y `solucion` describen la oferta comercial de SIDeN, no el negocio del cliente. El motor ahora las oculta en `templateFamily: corporate` y las conserva en `templateFamily: commercial`. Este comportamiento debe confirmarse en Preview en ambas familias antes de certificarlo.

## 4. Elementos complementarios

- **Cinta informativa:** `cintaInformativa.mostrar` o `cintaInformativa.enabled`; admite `items[]` o `texto`, `separador` y `velocidad`.
- **Orden de secciones:** `ordenSecciones[]` en la configuración raíz puede reorganizar secciones existentes dentro de `main`; solo debe usarse con IDs de secciones reales.
- **Analítica GA4:** `analytics.ga4.measurementId` y `analytics.ga4.enabled`; no se carga en dominios de Preview conocidos (`workers.dev`, `pages.dev`, localhost ni cuando se usa `?site=`).
- **SEO/indexación:** `indexable` controla las señales de indexación gestionadas por el Worker. Los sitios de prueba deben mantenerlo en `false`.

## 5. Navegación

La navegación se genera a partir de los módulos seleccionados y las etiquetas de menú disponibles. Los módulos `proceso` e `identidad` ahora tienen destino y etiqueta de navegación. Si un módulo requiere datos y estos faltan, puede no mostrarse aunque figure en la lista.

## 6. Riesgo de cambios

Los módulos y secciones pertenecen al HTML y JavaScript compartidos dentro de cada proyecto. Un cambio en la plantilla maestra puede afectar a múltiples instancias cuando se replique. Antes de alterar un elemento compartido, identificar si el requisito es general o exclusivo de un cliente; si es exclusivo, valorar una configuración existente o una plantilla separada en vez de introducir una excepción global.

## 7. Estado de la revisión

Cambios preparados en esta rama:
- Añadida lógica de renderizado para `proceso` e `identidad`.
- Añadidas etiquetas y destinos de navegación para esos módulos.
- Ocultadas en páginas corporativas las secciones comerciales `proyectos`, `problema` y `solucion`.

**Pendiente:** comprobar en Preview: activar/desactivar `proceso` e `identidad`, navegación a ambos, contenido vacío, aislamiento de las tres secciones en corporativo y conservación en comercial. No declarar la certificación cerrada hasta realizar esas comprobaciones.
