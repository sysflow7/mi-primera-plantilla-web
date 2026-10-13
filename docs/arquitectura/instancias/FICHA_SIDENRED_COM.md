# SIDeN — Ficha de Arquitectura Particular de Instancia: sidenred.com

**Estado del registro:** inicial — pendiente de certificación de runtime en la auditoría actual  
**Fecha de elaboración:** 2026-10-13  
**Fuente de referencia de código:** rama `siden-corporativo-v1.3` del repositorio `sysflow7/mi-primera-plantilla-web`  
**Dominio:** `https://sidenred.com`  
**Worker central:** `siden-corporativo`

> Esta ficha se elaboró a partir de inspección estática de archivos de la rama indicada y documentación SIDeN V1.6. No certifica por sí sola que cada comportamiento esté funcionando en el runtime actual. Los puntos no comprobados en navegador/Cloudflare se indican como pendientes.

## 1. Identificación y estado
- **Nombre público:** SIDeN.
- **Dominio base:** `sidenred.com` (el código de Worker normaliza `www.` para el dominio base).
- **Ruta de instancia:** `sites/corporativo/`.
- **instanceId:** `corporativo`.
- **Familia técnica:** `commercial` (valor de `siden.templateFamily`).
- **Estado comercial:** no se observa una propiedad `estadoComercial` en la configuración revisada; esta distinción está documentada para instancias CORPORATE y no debe inferirse aquí.
- **Modo de sitio:** `single`.
- **Nivel de personalización:** **Nivel 1 — instancia de referencia estándar**, con ficha inicial ampliada por ser la instancia corporativa de producción y servir de línea base comparativa.
- **Publicación:** producción declarada en la documentación maestra; la verificación runtime específica de esta revisión queda pendiente.
- **Rama de referencia:** `siden-corporativo-v1.3`.
- **Worker:** `siden-corporativo`.
- **Última revisión estática:** 2026-10-13.
- **Estado de certificación de esta ficha:** inicial; no sustituye la auditoría runtime.

## 2. Fuentes y huellas inspeccionadas
| Archivo | SHA del blob observado | Función |
|---|---|---|
| `worker.js` | `d03fafccc123bd34a61d5f078afa6a09bfcc10a3` | Enrutamiento y respuesta multisite |
| `index.html` | `ee520ac17274a5fcc32c5dc070fa432c9520bb12` | Plantilla HTML compartida |
| `js/script.js` | `56f13323a67721b4b6a4a2d695a09f06d47d985b` | Motor de configuración de navegador |
| `sites/corporativo/config.json` | `49440452d21e39630eeeed9b9fe38380aa4cc687` | Configuración SIDeN |
| `sites/corporativo/custom.css` | `76b788da939b6b778bfa2fd5b995e33e0f769f76` | CSS particular; actualmente contiene comentario y no reglas visuales propias |
| `sites/registry.json` | `1435b86410f836edd11719b1320103d0365a6c37` | Mapeo de instancias/hosts configurados |
| `wrangler.jsonc` | `6ba60e1061397e7689941b20246f1cd0695f12c2` | Configuración de Worker/assets |

Los SHA identifican los blobs consultados, no el SHA de un único commit de despliegue. Deben actualizarse al revisar nuevos cambios.

## 3. Configuración efectiva observada
- `siden.instanceId = "corporativo"`.
- `siden.templateFamily = "commercial"`.
- `siden.customCss = "custom.css"`.
- `analytics.ga4.enabled = true`.
- Measurement ID configurado: `G-SM7N97YP38` (identificador de medición, no una credencial secreta).
- `modoSitio = "single"`; `paginas = []`.
- `indexable = true`.
- Atención: `modeloAtencion = "areaServicio"`; área configurada: El Salvador.
- Contacto configurado: WhatsApp/teléfono y correo corporativo.
- No se observan enlaces configurados para Facebook, Instagram ni Maps.
- `mostrarHeroImagen = true); imágenes de hero configuradas: `Presenta01.png`.
- Módulos configurados: `beneficios`, `servicios`, `proceso`, `identidad`, `contacto`.
- Cinta informativa activa.
- `custom.css` existe y está señalado en la configuración, pero el contenido inspeccionado es solo un comentario. No asumir que contiene personalizaciones activas.

## 4. Dependencias conocidas
| Dependencia | Relación con SIDeN | Riesgo al cambiar | Verificación requerida |
|---|---|---|---|
| `worker.js` | Resuelve host/instancia y entrega HTML, configuración y recursos | Crítico: podría afectar el dominio principal y otras instancias | Confirmar host base, `instanceId`, status/MIME, assets, SEO y aislamiento |
| `index.html` | Estructura compartida de la página | Alto: cambios de estructura pueden alterar secciones comerciales | Validar hero, módulos, encabezados, CTA, navegación y responsive |
| `js/script.js` | Lee configuración y renderiza módulos/orden de secciones | Alto: cambios de contrato o renderizado afectan contenido configurado | Verificar todos los módulos activados, botones, consola y eventos |
| CSS compartido (`css/*`) | Define presentación general y componentes | Alto: reglas globales pueden cambiar la identidad visual de SIDeN y otras familias | Comparar escritorio/móvil y al menos una instancia CORPORATE |
| `sites/corporativo/config.json` | Define contenido, contacto, SEO, analítica y módulos | Alto para el sitio corporativo; bajo aislamiento si se conserva su ruta | JSON válido, SEO, imágenes, CTA, GA4 y rutas |
| `sites/corporativo/custom.css` | Punto reservado para estilos propios de SIDeN | Medio; actualmente no se observan reglas activas | Confirmar carga HTTP y aislamiento por instancia |
| `sites/registry.json` | Contiene entradas para varias instancias de clientes | Crítico para hosts que dependan de esas entradas; no inferir que el dominio base dependa de cada entrada | Probar resolución del dominio base y de hosts de clientes |
| `wrangler.jsonc` | Define Worker, directorio de assets y ejecución del Worker antes de assets | Crítico: cambios pueden afectar publicación/entrega de archivos | Build, Preview, smoke test y verificación de despliegue |

## 5. Personalizaciones / particularidades observadas
- Sitio COMMERCIAL de SIDeN; no confundir con la familia CORPORATE usada para sitios de clientes.
- Sitio de una sola página en la configuración consultada.
- Módulos comerciales configurados mediante `config.json`, no mediante un nuevo componente exclusivo observado.
- GA4 activado con Measurement ID propio de SIDeN.
- Imagen visual del Hero habilitada.
- Cinta informativa activada.
- CSS particular presente como archivo, sin reglas activas en el contenido consultado.
- No se ha confirmado mediante esta inspección estática la configuración de eventos, exclusión de Preview ni el estado de la propiedad GA4 en producción; debe verificarse durante la auditoría.

## 6. Límites de impacto
1. No modificar la estructura de la instancia `corporativo` para resolver necesidades exclusivas de un cliente.
2. Cambios a Worker, HTML, JS, CSS compartido, esquema de `config.json`, routing o infraestructura deben evaluarse contra esta ficha y las fichas de instancias de clientes.
3. Los cambios exclusivamente visuales de SIDeN deben probarse primero en `sites/corporativo/custom.css` si la capacidad existente lo permite, evitando CSS global innecesario.
4. No retirar o renombrar claves de configuración sin buscar sus consumidores y revisar configuraciones de todas las familias.
5. Cambios a GA4 deben probar la separación de medición por instancia y la exclusión de Preview antes de producción.
6. Mantener `siden-corporativo-v1.3` como referencia de producción documentada; no usar ramas de Preview como producción sin aprobación y procedimiento de despliegue.

## 7. Checklist de regresión para cambios compartidos
- [ ] Dominio base `sidenred.com` carga y resuelve la instancia `corporativo`.
- [ ] Título, meta description, canonical, robots, sitemap y datos estructurados son coherentes con SIDeN.
- [ ] Hero, imagen, cinta informativa y módulos configurados se renderizan.
- [ ] WhatsApp/teléfono y correo se muestran y funcionan correctamente.
- [ ] GA4 no recibe tráfico de Preview; producción usa el Measurement ID de SIDeN.
- [ ] CSS/JS/imágenes responden con status y MIME adecuados; no hay 404.
- [ ] Consola del navegador sin errores nuevos.
- [ ] Responsive comprobado en móvil y escritorio.
- [ ] Una instancia CORPORATE y una segunda instancia representativa no sufren regresiones.
- [ ] Los recursos y contenidos de instancias permanecen aislados.

## 8. Pendientes de la auditoría
- [ ] Comprobar en Preview/runtime que `/custom.css` se carga para el host base y no filtra estilos entre instancias.
- [ ] Verificar los recursos de hero y servicios configurados frente al inventario real de imágenes.
- [ ] Validar HTML/SEO y navegación de producción.
- [ ] Confirmar la exclusión efectiva de GA4 en Preview y eventos de interacción.
- [ ] Establecer commit de despliegue y fecha de verificación runtime actuales.
- [ ] Ejecutar pruebas visuales desktop/móvil y de consola.
- [ ] Completar enlaces de evidencia y cerrar estado de certificación.

## 9. Historial
| Fecha | Acción | Resultado |
|---|---|---|
| 2026-10-13 | Primera ficha elaborada por inspección estática de `siden-corporativo-v1.3` | Registro inicial; certificación runtime pendiente |
