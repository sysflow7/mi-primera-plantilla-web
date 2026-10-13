# SIDeN — Regla obligatoria de Registro Maestro y fichas de arquitectura por instancia

**Fecha de adopción:** 2026-10-13  
**Aplicación:** arquitectura maestra, instancias SIDeN WEB y cualquier instancia que consuma dependencias compartidas.

## 1. Punto de entrada obligatorio: Registro Maestro

El archivo **`SIDeN_Registro_Maestro_Instancias.xlsx`** es el resumen central de las instancias SIDeN y el primer documento que se consulta para evaluar cualquier cambio transversal. Contiene tres hojas:

- **Instancias:** resumen por sitio, familia, modo, nivel de personalización, funciones opcionales, riesgos, estado documental y ruta de ficha.
- **Dependencias:** relación conocida o por verificar entre instancias y componentes, con riesgos y pruebas mínimas.
- **Historial de cambios:** registro de decisiones, análisis de impacto, instancias evaluadas, pruebas, PR/commit y actualización documental.

El registro debe mantenerse en la ubicación documental oficial acordada para el proyecto. La copia inicial entregada por separado es un borrador operativo: los campos no verificados están marcados como pendientes y deben reconciliarse con el repositorio/commit vigente antes de usarlos como evidencia de certificación.

## 2. Clasificación de personalización

- **Nivel 1 — estándar:** configuración, contenido, imágenes y capacidades existentes. Puede usar ficha abreviada. La instancia SIDeN corporativa `sidenred.com` se documenta como línea base de referencia.
- **Nivel 2 — particular relevante:** CSS exclusivo con selectores significativos, composición visual propia, sitio multipágina, video/medios opcionales, reglas de módulos/visibilidad particulares o dependencias que exigen pruebas propias. **Ficha detallada obligatoria antes de aprobar/publicar.**
- **Nivel 3 — estructural/integración:** código particular, componente nuevo, integración externa o acoplamiento estructural con motor/Worker. **Ficha detallada obligatoria** y evaluación previa de una nueva familia/plantilla.

Si no es claro el nivel, clasificar provisionalmente en el nivel superior que razonablemente pueda aplicar y resolverlo en la evaluación de impacto antes de implementar.

## 3. Flujo obligatorio antes de modificar un componente compartido

Antes de modificar `worker.js`, `index.html`, CSS/JS compartidos, contratos/esquemas de configuración, routing, `sites/registry.json`, `wrangler.jsonc` u otro elemento transversal:

1. **Consultar el Registro Maestro** y filtrar las instancias que declaran o podrían depender del componente, función, selector, módulo, ruta o contrato que se propone cambiar.
2. **Revisar la hoja Dependencias** para identificar acoplamientos, riesgos, pruebas mínimas y puntos pendientes de confirmar.
3. **Consultar solo las fichas detalladas pertinentes** para las instancias potencialmente afectadas. No es necesario cargar las fichas de todas las instancias; se consultan según el análisis de impacto.
4. **Buscar en el código real** las referencias, consumidores, selectores y contratos afectados. El registro y las fichas son herramientas de trazabilidad, no sustituyen la búsqueda de código.
5. **Si falta una ficha relevante**, documentar lo necesario para evaluar el riesgo antes de implementar. No asumir que una instancia no se verá afectada por no tener ficha o por no aparecer una dependencia en el registro.
6. **Evaluar aislamiento:** determinar si la necesidad se puede resolver mediante `config.json`, contenido, imágenes, `custom.css` o capacidades existentes sin modificar código compartido.
7. **Definir matriz de regresión y Preview** con las instancias/familias representativas y todos los casos de uso alcanzables por el cambio.
8. **Detener y rediseñar** si no puede demostrarse compatibilidad o aislamiento. Si la diferencia es estructural, evaluar una familia/plantilla separada en lugar de añadir excepciones que afecten otras instancias.
9. **Cerrar la documentación junto con el cambio:** actualizar el historial del Registro Maestro, las dependencias afectadas y las fichas pertinentes; registrar rama/commit, pruebas, resultado y estado de certificación.

## 4. Contenido mínimo obligatorio de la ficha

La ficha debe documentar:
1. Identidad de instancia, dominio/host, instanceId, ruta, familia, estado comercial, modo, nivel de personalización, rama/commit y estado de publicación.
2. Inventario de archivos, recursos, servicios externos y rutas; distinguir recursos compartidos de exclusivos.
3. Configuración efectiva: módulos, orden, páginas/rutas, SEO/indexación, GA4, contacto, mapas, imágenes y medios.
4. Dependencias y puntos de acoplamiento: archivos, funciones, selectores CSS, módulos, contratos de configuración, rutas, servicios y otras instancias/familias potencialmente afectadas.
5. Matriz de impacto/riesgo, excepciones, decisiones históricas, pruebas de regresión, evidencias, incidencias y pendientes.
6. Historial de cambios y certificación de Preview/producción.

No registrar contraseñas, tokens privados ni claves secretas. Los identificadores públicos de medición pueden documentarse cuando sean necesarios para distinguir configuraciones.

## 5. Entregable y ubicación

- Registro central: `SIDeN_Registro_Maestro_Instancias.xlsx`.
- Plantilla de ficha: `docs/arquitectura/PLANTILLA_FICHA_ARQUITECTURA_INSTANCIA.md`.
- Ficha SIDeN corporativo de referencia: `docs/arquitectura/instancias/FICHA_SIDENRED_COM.md`.
- Ficha detallada de Nivel 2/3: entregable obligatorio antes de aprobar/publicar la instancia.
- Cada PR que modifique dependencias compartidas debe indicar el Registro Maestro consultado, las fichas consultadas/actualizadas, las instancias probadas y cualquier pendiente de auditoría.

## 6. Regla de integridad del registro

Un campo vacío, una dependencia no documentada o una ficha inexistente **nunca significa que una instancia no será afectada**. Los datos no verificados deben marcarse como pendientes, no completarse por suposición. El Registro Maestro facilita la selección de fichas relevantes, pero no sustituye la inspección del código, Preview ni pruebas de regresión.
