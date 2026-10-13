# SIDeN — Regla obligatoria de fichas de arquitectura por instancia

**Fecha de adopción:** 2026-10-13  
**Aplicación:** arquitectura maestra, instancias SIDeN WEB y cualquier instancia que consuma dependencias compartidas.

## 1. Clasificación de personalización

- **Nivel 1 — estándar:** configuración, contenido, imágenes y capacidades existentes. Puede usar ficha abreviada. La instancia SIDeN corporativa `sidenred.com` se documenta como línea base de referencia.
- **Nivel 2 — particular relevante:** CSS exclusivo con selectores significativos, composición visual propia, sitio multipágina, video/medios opcionales, reglas de módulos/visibilidad particulares o dependencias que exigen pruebas propias. **Ficha detallada obligatoria antes de aprobar/publicar.**
- **Nivel 3 — estructural/integración:** código particular, componente nuevo, integración externa o acoplamiento estructural con motor/Worker. **Ficha detallada obligatoria** y evaluación previa de una nueva familia/plantilla.

Si no es claro el nivel, clasificar provisionalmente en el nivel superior que razonablemente pueda aplicar y resolverlo en la evaluación de impacto antes de implementar.

## 2. Contenido mínimo obligatorio

La ficha debe documentar:
1. Identidad de instancia, dominio/host, instanceId, ruta, familia, estado comercial, modo, nivel de personalización, rama/commit y estado de publicación.
2. Inventario de archivos, recursos, servicios externos y rutas; distinguir recursos compartidos de exclusivos.
3. Configuración efectiva: módulos, orden, páginas/rutas, SEO/indexación, GA4, contacto, mapas, imágenes y medios.
4. Dependencias y puntos de acoplamiento: archivos, funciones, selectores CSS, módulos, contratos de configuración, rutas, servicios y otras instancias/familias potencialmente afectadas.
5. Matriz de impacto/riesgo, excepciones, decisiones históricas, pruebas de regresión, evidencias, incidencias y pendientes.
6. Historial de cambios y certificación de Preview/producción.

No registrar contraseñas, tokens privados ni claves secretas. Los identificadores públicos de medición pueden documentarse cuando sean necesarios para distinguir configuraciones.

## 3. Regla obligatoria antes de cambiar dependencias compartidas

**Antes de modificar** `worker.js`, `index.html`, CSS/JS compartidos, contratos/esquemas de configuración, routing, `sites/registry.json`, `wrangler.jsonc` u otro elemento transversal:

1. Consultar las fichas vigentes de las instancias y familias que podrían consumir el elemento.
2. Inspeccionar el código real y buscar referencias/consumidores; la ficha no es una fuente exhaustiva.
3. Determinar si el cambio puede resolverse con `config.json`, recursos propios, `custom.css` o capacidades existentes.
4. Identificar instancias/familias afectadas y definir pruebas de regresión y Preview antes de implementar.
5. Si no se puede demostrar compatibilidad, detener el cambio y rediseñar/aislar la solución; evaluar una nueva familia/plantilla cuando la diferencia sea estructural.
6. Tras aprobar el cambio, actualizar fichas, evidencias e historial.

**No tener ficha, ni encontrar una dependencia documentada, nunca prueba que una instancia no será afectada.** Si un cambio compartido puede alcanzar una instancia sin ficha, documentar primero lo necesario para evaluar el riesgo.

## 4. Entregable y ubicación

- La ficha detallada de Nivel 2/3 es un entregable obligatorio de la instancia y debe existir antes de su aprobación/publicación.
- Plantilla: `docs/arquitectura/PLANTILLA_FICHA_ARQUITECTURA_INSTANCIA.md`.
- Registro SIDeN corporativo de referencia: `docs/arquitectura/instancias/FICHA_SIDENRED_COM.md`.
- Cada PR que modifique dependencias compartidas debe declarar qué fichas consultó, qué instancias probó y si alguna ficha requiere actualización.
