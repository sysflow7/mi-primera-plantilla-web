# SIDeN — Plantilla de Ficha de Arquitectura Particular de Instancia

**Tipo de documento:** registro técnico por instancia  
**Estado:** plantilla operativa  
**Responsable:** mantenimiento técnico SIDeN  
**Regla:** completar y revisar antes de aprobar una instancia con personalización de Nivel 2 o superior. Las instancias estándar de Nivel 1 pueden utilizar una ficha abreviada; SIDeN corporativo (`sidenred.com`) se conserva como ficha de referencia base.

> La ficha documenta dependencias conocidas; no sustituye la inspección del código, las pruebas en Preview ni la verificación en producción. Un dato no documentado no debe interpretarse como ausencia de dependencia.

## 1. Identificación y estado
- Nombre público:
- Dominio(s) / host(s):
- `instanceId`:
- Ruta de instancia:
- Familia técnica (`templateFamily`):
- Estado comercial:
- Modo de sitio (`single` / `multi`):
- Nivel de personalización (1 / 2 / 3):
- Estado de publicación (demo / Preview / producción):
- Fecha de creación de la ficha:
- Fecha de última revisión:
- Responsable técnico:
- Rama y commit de referencia:
- Fecha/versión de último despliegue verificado:

## 2. Clasificación del nivel de personalización
**Nivel 1 — Configuración estándar:** se limita a `config.json`, contenido, imágenes y capacidades ya soportadas. No introduce CSS funcional exclusivo, JS propio, componentes estructurales ni rutas nuevas.

**Nivel 2 — Personalización particular relevante (ficha detallada obligatoria):** incorpora CSS particular con selectores relevantes, composición visual específica, combinación de módulos no estándar, navegación multipágina, video u otro recurso/flujo opcional, reglas de visibilidad específicas o dependencias que exigen pruebas propias.

**Nivel 3 — Personalización estructural o integración:** requiere código/JS particular, nuevo componente, integración externa, cambio de comportamiento del Worker/motor o una arquitectura que podría no coexistir con otras instancias. Antes de implementarla, evaluar si corresponde crear una nueva familia/plantilla en lugar de seguir aumentando excepciones.

Registrar la justificación del nivel y los criterios que lo activaron:
- Justificación:
- Capacidades especiales:
- ¿Requiere revisión de plantilla/familia?:
- Decisión y aprobación:

## 3. Inventario de archivos y recursos
Registrar ruta, propósito, propiedad, dependencia y SHA/commit cuando sea útil.

| Recurso/ruta | Uso | Compartido o exclusivo | Dependencias/consumidores | Riesgo al cambiar | Prueba requerida |
|---|---|---|---|---|---|
| `sites/<instanceId>/config.json` | Configuración y contenido | Exclusivo | Worker y motor de configuración | Alto si cambia esquema | Validar JSON y renderizado |
| `sites/<instanceId>/custom.css` | Ajustes visuales particulares | Exclusivo por instancia | HTML/marcador de CSS de instancia | Medio/alto | Visual, responsive, aislamiento |
| `sites/<instanceId>/images/*` | Imágenes y medios | Exclusivo | Configuración y rutas de assets | Medio | Carga, MIME, ausencia de 404 |
| `index.html` | Estructura compartida | Compartido | Todas las instancias servidas por el motor | Alto | Matriz de instancias/familias |
| `worker.js` | Resolución, rutas, HTML/SEO/assets | Compartido | Todas las instancias y dominios | Crítico | Routing, seguridad, SEO, assets, aislamiento |
| `js/*` | Lógica común | Compartido salvo excepción documentada | Módulos/configuración de instancias | Alto | Consola, eventos, módulos, navegación |
| `css/*` | Estilos globales | Compartido | Todas las familias/instancias que carguen la hoja | Alto | Regresión visual en matriz |
| `sites/registry.json` | Mapeo de host a instancia | Compartido | Resolución de hosts configurados | Crítico | Resolver host → instanceId |
| `wrangler.jsonc` | Infraestructura/despliegue | Compartido | Worker, assets y bindings | Crítico | Build/deploy y smoke tests |

Añadir filas para cada archivo, módulo, integración, ruta, fuente de datos, dominio o servicio externo que sea relevante para esta instancia.

## 4. Configuración efectiva
- Archivo `config.json` y SHA:
- `siden.instanceId`:
- `siden.templateFamily`:
- `siden.customCss`:
- `estadoComercial`:
- `modoSitio`:
- `paginas` / rutas:
- `modulos`:
- `ordenSecciones`:
- SEO/indexación/canonical:
- GA4/analítica:
- WhatsApp/contacto:
- Mapas/ubicación:
- Recursos audiovisuales:
- Otras opciones configurables relevantes:

No copiar credenciales, tokens privados, claves API ni secretos en esta ficha.

## 5. Dependencias y puntos de acoplamiento
Para cada particularidad, registrar:
- Elemento de esta instancia:
- Archivo/configuración que lo activa:
- Selector CSS, módulo, función, ruta o contrato técnico implicado:
- Elemento compartido del que depende:
- Otras instancias/familias potencialmente afectadas:
- Comportamiento esperado:
- Qué se puede romper si cambia la dependencia:
- Compatibilidad hacia atrás:
- Alternativa si la dependencia se retira:
- Evidencia (ruta, fragmento, commit o prueba):

## 6. Matriz de impacto de cambios
| Elemento que se propone cambiar | ¿Afecta esta instancia? | Motivo/dependencia | Riesgo | Prueba de regresión obligatoria |
|---|---|---|---|---|
| `worker.js` | Por evaluar en cada cambio | Resolución/HTML/rutas/SEO/assets | Crítico | Host, instanceId, assets, SEO, rutas y aislamiento |
| `index.html` | Por evaluar en cada cambio | Marcadores y estructura compartida | Alto | Estructura y módulos visibles |
| `js/*` | Por evaluar en cada cambio | Configuración, módulos, eventos y navegación | Alto | Consola, interacción y multipágina |
| `css/*` | Por evaluar en cada cambio | Selectores globales y estilos heredados | Alto | Comparación visual y responsive |
| `config.json` / esquema de configuración | Por evaluar en cada cambio | Contratos de claves y valores | Alto | Configs válidas de varias familias |
| `custom.css` de esta instancia | Sí, particular | Estilos propios | Medio/alto | Esta instancia en desktop/móvil |
| `registry.json` | Si usa host registrado | Resolución host → instancia | Crítico | Dominio/subdominio y aislamiento |
| `wrangler.jsonc` | Por evaluar en cada cambio | Infraestructura de Worker/assets | Crítico | Preview, bindings, build/deploy |

Esta matriz es una guía inicial, no una lista exhaustiva. La revisión debe seguir las dependencias reales encontradas en el código.

## 7. Historial de decisiones y excepciones
| Fecha | Decisión/cambio | Motivo | Archivos afectados | Impacto evaluado | Pruebas | Commit/PR |
|---|---|---|---|---|---|---|

## 8. Checklist previo a modificar una dependencia compartida
- [ ] Leer esta ficha y confirmar que corresponde a la versión/commit vigente.
- [ ] Revisar código real y buscar referencias/consumidores, no confiar solo en esta ficha.
- [ ] Identificar instancias y familias que consumen la dependencia.
- [ ] Evaluar si la solución puede limitarse a configuración, assets o `custom.css`.
- [ ] Definir matriz de regresión y Preview para las instancias afectadas.
- [ ] Si no puede demostrarse compatibilidad, detener el cambio y rediseñar/aislar la solución.
- [ ] Ejecutar pruebas funcionales, visuales, responsive, SEO, rutas, consola, assets y aislamiento según aplique.
- [ ] Actualizar la ficha y el registro de cambios después de aprobar el cambio.

## 9. Certificación y estado de evidencia
- Pruebas estáticas realizadas:
- Preview probado (URL/fecha):
- Pruebas de navegador/operador:
- Producción comprobada (URL/fecha):
- Incidencias conocidas:
- Pruebas pendientes:
- Resultado: pendiente / aprobado / aprobado con observaciones.
- Evidencias y enlaces:

## 10. Regla de mantenimiento

Antes de cambiar un componente compartido, consultar primero el archivo central `SIDeN_Registro_Maestro_Instancias.xlsx`, filtrar las instancias y dependencias potencialmente afectadas y consultar solo las fichas detalladas pertinentes. Después, buscar consumidores y referencias en el código real; el registro y las fichas no sustituyen esa búsqueda ni las pruebas de regresión. Si una instancia relevante no tiene ficha, documentar lo necesario para evaluar el riesgo antes de implementar.

Al cerrar el cambio, actualizar el historial y las relaciones de dependencia del Registro Maestro, así como las fichas pertinentes. Un dato vacío o una dependencia no documentada no demuestra ausencia de impacto. Si no puede demostrarse compatibilidad, detener el cambio y aislar la solución o evaluar una familia/plantilla separada.
