# Informe de auditoría SIDeN — Puntos 1, 2 y 3
**Repositorio:** `sysflow7/mi-primera-plantilla-web`  
**Rama revisada como baseline:** `siden-corporativo-v1.3`  
**Documentación preparada en:** `docs/fichas-arquitectura-instancias` (PR #52)  
**Alcance:** revisión estática del código/configuraciones y resultado de las pruebas manuales de Hero descritas abajo. No se fusionó ningún PR ni se desplegó producción.

## Resumen ejecutivo

| Punto | Resultado | Conclusión |
|---|---|---|
| 1. Aislamiento de instancias | **Aprobado a nivel de diseño; regresión global pendiente** | El Worker resuelve la configuración, imágenes y CSS por `instanceId`; bloquea acceso directo a `/sites/*`. Las personalizaciones visuales deben permanecer en `custom.css` de cada instancia. La inspección no sustituye una prueba visual de todas las instancias. |
| 2. Familias `commercial`, `corporate`, `mini` | **Lógica inspeccionada; validación funcional parcial** | `commercial` y `corporate` usan el motor compartido y se distinguen por `templateFamily` y `estadoComercial`; `mini` usa su propio HTML/CSS/JS y esquema. El comportamiento del Hero corporativo sí fue comprobado manualmente en Preview en estado visible y oculto. |
| 3. Multipágina | **Implementación presente; aceptación E2E pendiente** | El Worker y `js/script.js` admiten `modoSitio: "multi"`, rutas declaradas, navegación, metadatos SEO y sitemap. Las instancias consultadas están en modo `single`, así que aún no hay evidencia de una prueba completa sobre una configuración multipágina real. |

## Punto 1 — Aislamiento de instancias

### Evidencia inspeccionada
- El Worker obtiene el `instanceId` desde el host y/o `sites/registry.json`.
- Carga `sites/<instanceId>/config.json` y verifica que el `instanceId` declarado coincida.
- Las solicitudes `/images/*` se resuelven dentro de la instancia activa.
- El CSS personalizado se valida y se resuelve desde la carpeta de esa instancia.
- El Worker no permite servir directamente rutas `/sites/*`.
- La regla operativa documentada exige resolver primero con `config.json`, luego `custom.css`, y solo modificar motor compartido para capacidades genéricas.

### Conclusión
La separación de datos y recursos está reflejada en la implementación. No debe afirmarse que cualquier cambio CSS es incapaz de afectar otros sitios: una modificación a CSS compartido puede hacerlo. Por eso, el control es **aislar cambios de cliente** y ejecutar regresión cuando se toca un archivo compartido.

## Punto 2 — Familias de plantilla

### Evidencia inspeccionada
- `js/script.js` obtiene `templateFamily` desde `window.__SIDEN_CONFIG__.siden`.
- `commercial` puede mostrar planes y FAQ SIDeN.
- `corporate` muestra elementos comerciales de SIDeN cuando `estadoComercial === "demo"`; para clientes, las FAQ dependen de su configuración y contenido.
- El Worker entrega `/mini/index.html` a la familia `mini`; MINI tiene su propio `mini/script.js`, `mini/style.css` y esquema de configuración.
- `modoSitio` es independiente de `templateFamily`; una familia no implica por sí misma página única o multipágina.

### Prueba funcional ya realizada
El usuario verificó en Preview que la imagen visual Hero aparece cuando `mostrarHeroImagen: true` y queda oculta cuando `mostrarHeroImagen: false`, aunque exista un archivo configurado. El PR #53 contiene la corrección CSS que respeta `[hidden]`. **No está en producción** porque el PR no se ha fusionado.

### Conclusión
La separación lógica está implementada y el caso concreto del Hero quedó verificado en Preview. No se ha realizado una matriz visual completa de todos los estados de todas las familias; no se presenta como si se hubiera hecho.

## Punto 3 — Multipágina

### Evidencia inspeccionada
- El Worker admite la raíz y las rutas incluidas en `paginas` cuando `modoSitio === "multi"`.
- Valida rutas internas y filtra las que no cumplen las reglas.
- Selecciona metadatos por página, genera canonical y agrega las rutas válidas al sitemap.
- `js/script.js` combina la configuración global con la página activa, construye enlaces del menú y oculta el Hero principal en páginas internas.
- Los enlaces de Preview propagan `?site=<instanceId>`.

### Limitación detectada
Las configuraciones consultadas de SIDeN corporativo, FISIOKINESV y Dr. Carlos Leopoldo Reyes están en `modoSitio: "single"`. Por tanto, **la implementación está presente, pero la aceptación extremo a extremo multipágina no queda certificada en esta auditoría**. La siguiente prueba debe ejecutarse en Preview con una configuración `multi` real antes de construir/publicar el sitio definitivo multipágina del Dr. Carlos Reyes.

### Pruebas de aceptación pendientes para el Preview multipágina
1. Raíz y enlaces de menú.
2. Cada ruta muestra su contenido específico.
3. Logotipo regresa a la raíz.
4. Ruta no declarada no se presenta como página válida.
5. H1, título SEO, descripción y canonical por página.
6. Sitemap y robots según `indexable`.
7. Imágenes, CSS personalizado y enlaces de contacto en todas las rutas.
8. Navegación interna en Preview conserva `?site=`.
9. Revisión móvil/escritorio y consola del navegador.

## Documentos actualizados/preparados
1. `docs/ARQUITECTURA_MAESTRA_V1.5.md`: reglas de aislamiento, separación entre familias, distinción `estadoComercial`/`modoSitio`, especificación multipágina, pruebas de aceptación y estado de la corrección Hero.
2. `docs/AUDITORIA_CIERRE_PUNTOS_1_2_3_V1.md`: este informe con resultados, evidencia y pendientes reales.

## Estado de producción y PR
- No se fusionó el PR #52 (documentación).
- No se fusionó el PR #53 (corrección CSS Hero).
- No se desplegó producción.
- El PR temporal #54 se utilizó para probar el estado oculto del Hero; no se debe fusionar porque modifica temporalmente la configuración de demo y añade un alias de prueba.


## Addendum — hallazgo de auditoría y corrección aplicada (16-10-2026)

### Hallazgo adicional: sitemap de instancias no indexables
La inspección del Worker de la rama independiente detectó que `/sitemap.xml` incluía las rutas configuradas aunque `indexable: false`. El HTML ya aplicaba `noindex, nofollow`, pero el sitemap no respetaba el estado de indexación.

**Corrección aplicada en la rama de prueba:** commit `12b29dfd055fb000deca4fe09a19e09d3a48bd38`. El sitemap queda vacío cuando `indexable: false`; para sitios indexables conserva la raíz y las rutas multipágina válidas sin duplicados.

**Estado:** corrección de código aplicada; falta confirmar el comportamiento del endpoint en Preview. No se modificó ni desplegó producción.

### Aclaración de arquitectura
El documento histórico contiene secciones que describen el modelo anterior con `sites/<instanceId>/config.json` y `sites/registry.json`. Ese modelo no corresponde a la rama independiente V1.5 auditada aquí, que sirve el `config.json` raíz y usa un Worker por proyecto. Se añadió un addendum a `ARQUITECTURA_MAESTRA_V1.5.md` para marcar explícitamente esta diferencia; las secciones históricas deben reconciliarse en una revisión documental posterior antes de declarar el documento completamente unificado.
