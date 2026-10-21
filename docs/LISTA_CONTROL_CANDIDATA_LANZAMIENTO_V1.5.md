# SIDeN V1.5 — Lista de control para candidata de lanzamiento

**Fecha:** 21 de octubre de 2026  
**Estado:** preparación pendiente; NO es autorización de despliegue.  
**Rama de referencia:** `prueba-aislamiento-contenido-v1.5`  
**Producción protegida:** `siden-corporativo-v1.3` / Worker `siden-corporativo` / dominio `sidenred.com`.

## Propósito

Definir los controles que deben cumplirse antes de declarar SIDeN V1.5 como plantilla maestra oficial para crear nuevos proyectos. La rama de certificación conserva una configuración ficticia usada en las pruebas y está vinculada al Worker de pruebas existente. Por tanto, no debe convertirse directamente en plantilla de lanzamiento ni cambiarse su configuración de prueba.

## Controles ya confirmados

- [x] Navegación multipágina y carga directa/actualización de rutas principales verificadas por el usuario en Preview.
- [x] Ruta inexistente devuelve HTTP 404.
- [x] Métodos HTTP no permitidos devuelven HTTP 405.
- [x] Sitemap XML válido cuando `indexable:false`.
- [x] Enlaces externos inválidos/no HTTPS excluidos de los datos estructurados y enlaces de prueba inválidos retirados.
- [x] Enlaces sociales/catálogo válidos comprobados en Preview.
- [x] Módulos `proceso`, `identidad` y `filosofia` renderizan contenido configurable.
- [x] Tarjetas de producto sin imagen no muestran imagen rota.
- [x] Marcadores de logo, hero y favicon no generan los errores previamente observados.
- [x] Familia corporativa de cliente: planes comerciales ocultos y FAQ condicionada por módulos/configuración.
- [x] Familia comercial: secciones comerciales, planes y FAQ visibles según configuración; comprobado por el usuario.
- [x] Configuración de prueba restaurada a familia corporativa, estado cliente e `indexable:false`.
- [x] Verificaciones estáticas de sintaxis reportadas como correctas para los archivos principales.

## Hallazgos de repositorio y transición

- La rama predeterminada actual de GitHub fue reportada como `siden-template-v1.3`. Esto es distinto de la rama de producción `siden-corporativo-v1.3`; no se deben tratar como equivalentes.
- Existe una solicitud de cambio #56 titulada **“Arquitectura híbrida SIDeN: proyectos independientes por cliente”**. Su descripción menciona el modelo independiente, pero conserva un historial y criterios de validación anteriores. Debe revisarse contra la implementación V1.5 actual antes de tomar decisiones de fusión o cierre. No se ha fusionado ni modificado esa solicitud.
- No se encontraron los archivos de workflow en las rutas comunes consultadas (`.github/workflows/cloudflare.yml`, `.github/workflows/deploy.yml`, `.github/workflows/deploy.yaml`). Esto no demuestra por sí solo que no haya despliegues automáticos: la asociación de ramas, los disparadores y los ajustes del Worker deben verificarse en Cloudflare.
- No se dispone desde esta revisión de una vista confirmada de los ajustes actuales de Cloudflare. Por ello, no se cambiará ni creará una rama candidata que pueda activar un despliegue hasta entender el vínculo de build.

## Controles pendientes antes de declarar una candidata oficial

### A. Preparación aislada de la candidata
- [x] Crear una rama candidata separada (siden-template-candidate-2026-10) sin sobrescribir la rama de certificación activa. La relación exacta entre todos los eventos de Cloudflare y cada Worker sigue siendo un control de transición independiente.
- [x] Preparar `config.json` genérico sin nombre de cliente, teléfono, catálogo, dominio de producción ni datos de contacto ficticios.
- [ ] Mantener `indexable:false` por defecto hasta aprobación explícita del cliente para indexación.
- [ ] Definir una política de nombres de Worker que no pueda confundirse con el Worker de producción ni con el Worker de certificación.
- [x] Revisar `.assetsignore`: excluye `sites/**`, `mini/**`, `docs/**`, Markdown y archivos internos. La candidata contiene una carpeta raíz `images/` con iconos de la plantilla y recursos visuales de ejemplo; estos no pertenecen a carpetas de clientes, pero se debe decidir antes de la publicación oficial cuáles se conservan como recursos compartidos y cuáles se retiran.
- [ ] Confirmar la política de aliases de Preview y documentar cuándo se agregan y retiran.

### B. GitHub y Cloudflare
- [x] Consultar la rama predeterminada reportada por GitHub: `siden-template-v1.3`.
- [ ] Verificar en Cloudflare qué rama está conectada a cada Worker y qué eventos disparan despliegues.
- [ ] Revisar la solicitud #56 y resolver si es histórica, sigue siendo necesaria o contradice la ruta V1.5 actual.
- [ ] No cambiar la rama predeterminada del repositorio, rama de producción de Cloudflare, bindings, Worker ni dominio sin autorización explícita.
- [x] Desplegar la candidata en el Worker separado `siden-template-candidate-2026-10`; el usuario confirmó que la URL muestra la configuración genérica. La revisión de aislamiento entre todos los Workers y sus eventos de despliegue sigue pendiente.
- [x] Registrar rama `siden-template-candidate-2026-10`, Worker `siden-template-candidate-2026-10` y URL `https://siden-template-candidate-2026-10.darvincanal2025.workers.dev`. Los commits y pruebas concretos quedan documentados en `CANDIDATA_PLANTILLA_MAESTRA_V1.5.md`.

### C. Certificación final
- [ ] Revisar que la configuración genérica no incluya credenciales ni datos de clientes.
- [ ] Probar una instancia corporativa y una comercial con configuraciones separadas; no repetir las pruebas funcionales ya marcadas como confirmadas salvo que cambie el código relevante.
- [ ] Confirmar comportamiento con recursos reales (imágenes/logotipo) en al menos una instancia de prueba.
- [x] Confirmar que GA4 no carga scripts ni envía eventos cuando no hay Measurement ID configurado, en la sesión de prueba reportada anteriormente. La prueba con Measurement ID válido sigue pendiente.
- [ ] Verificar SEO/indexación con `indexable:false` y el proceso explícito para habilitar indexación.
- [ ] Revisar el alcance comercial y técnico de SIDeN MINI antes de certificarlo o venderlo como implementación verificada.
- [ ] Actualizar documentación Markdown y entregar el paquete final de documentos Word.
- [ ] Obtener aprobación explícita antes de convertir la candidata en rama oficial o hacer cambios de producción.

## Criterio de salida

La candidata solo puede declararse **lista para nuevos proyectos** cuando los controles aplicables estén completados, la documentación corresponda al código certificado y se haya confirmado la conexión de GitHub/Cloudflare sin afectar producción. La certificación funcional actual no equivale a una auditoría de seguridad completa ni autoriza publicación en producción.

## Estado de producción

No se ha autorizado ni realizado como parte de esta lista ningún merge o despliegue a `siden-corporativo-v1.3`, al Worker `siden-corporativo` o al dominio `sidenred.com`.


## Enfoque de cierre acordado

La revisión de `siden-template-v1.3` y `siden-corporativo-v1.3` no se usa para volver a comparar funcionalmente la arquitectura antigua con V1.5. Esas referencias solo se mantienen para identificar el estado previo y proteger la producción durante la transición.

El cierre se organiza en tres entregables distintos:
1. **V1.5 certificada:** código y documentación reconciliados con las pruebas ya realizadas.
2. **Candidata oficial para nuevos proyectos:** configuración genérica y Worker nombrado según una política definida, aislados de los fixtures de certificación.
3. **Migración de `sidenred.com`:** plan separado, con inspección de la configuración real del Worker de producción, aprobación expresa y pruebas de aceptación propias.

La captura de Cloudflare revisada el 21-10-2026 confirma que el Worker de pruebas `siden-prueba-cliente-multipagina-v15` está conectado al repositorio `sysflow7/mi-primera-plantilla-web`, usa `prueba-aislamiento-contenido-v1.5` como rama de producción de ese Worker y tiene builds habilitados con el comando `npx wrangler deploy`. Esta configuración es del Worker de pruebas, no del Worker `siden-corporativo`; no extrapolarla a producción.


## Política de nombres para evitar confusión de versiones — propuesta de transición

**Problema histórico que se debe evitar:** una rama llamada V1.4 parecía más reciente por su número aunque la producción real estuviera en V1.3. Por ello, el nombre operativo de la rama oficial no debe depender del número de versión.

### Convención propuesta

- **Rama oficial de plantilla:** `siden-template-maestra` — nombre estable, sin número de versión. Su contenido se identifica por el commit y por el documento de versión.
- **Rama candidata temporal:** `siden-template-candidate-2026-10` (o fecha equivalente al crearla), nunca llamada simplemente “producción”.
- **Ramas de certificación/pruebas:** conservar el prefijo `prueba-` o `certificacion-` y el propósito; no confundirlas con la rama oficial.
- **Worker de producción del sitio público de SIDeN:** nombre descriptivo del sitio, propuesto `siden-web-principal-prod`, si se decide renombrarlo tras verificar rutas, dominios y referencias.
- **Worker de prueba:** conservar nombre explícito de prueba, por ejemplo `siden-prueba-cliente-multipagina-v15`; no utilizarlo como Worker oficial.
- **Versión:** registrarla en `README.md`, documentación de arquitectura, changelog y commit/tag de release, no usarla como único indicador de cuál rama está en producción.

### Distinción fundamental

La plantilla maestra es el código base para crear proyectos independientes; no necesita por sí misma un Worker de producción salvo que se despliegue un sitio que la utilice. El Worker `siden-corporativo` sirve el sitio actual `sidenred.com`; es un recurso de producción del sitio, no una prueba de cuál es la versión oficial de la plantilla.

### Condiciones para aplicar los nombres

Esta convención es una propuesta documental, no una acción ya ejecutada. Antes de renombrar ramas o Workers:
1. aprobar el nombre definitivo;
2. comprobar qué configuración de Cloudflare, dominios, rutas y procesos depende del nombre actual;
3. asegurar que el cambio no dispare despliegues inesperados;
4. registrar rama, commit, Worker y dominio resultantes;
5. ejecutar el cambio solo con autorización explícita y un plan de reversión.

No renombrar todavía la rama predeterminada, la rama de producción ni ningún Worker.


## Actualización de avance — 21 de octubre de 2026

- La candidata está desplegada en un Worker separado y el usuario verificó la página genérica en el navegador.
- Se corrigió el comportamiento de los CTA de WhatsApp para conservarlos visibles sin número configurado; el usuario confirmó que el aviso aparece y no se navega al inicio. La apertura de WhatsApp con un número de prueba sigue pendiente.
- La inspección de `.assetsignore` confirma que `sites/**` y `mini/**` quedan excluidos del conjunto de assets, pero los recursos de ejemplo ubicados en `images/` raíz sí se publican. No se detectaron rutas a imágenes de carpetas de clientes en la lista de recursos raíz; queda pendiente decidir la limpieza final de recursos de muestra antes de la designación oficial.
- No se ha autorizado ni ejecutado ningún cambio en producción.


## Revisión actual de la solicitud de cambio #56 — 21 de octubre de 2026

La solicitud `#56` continúa abierta, con base `siden-template-v1.4` y rama de origen `arquitectura-hibrida-independiente-v1.0-2026-10-15`. Su última actualización reportada por GitHub es del 16-10-2026. Es una propuesta anterior a la candidata V1.5 actual; no se ha fusionado ni actualizado durante este trabajo. No fusionarla ni usarla como ruta de publicación sin una revisión separada del diff y una decisión explícita sobre su destino. La candidata actual se compara directamente con `prueba-aislamiento-contenido-v1.5` y sus cambios se limitan a `config.json`, `js/script.js`, `wrangler.jsonc` y documentación.


### Resultado de inventario estático de imágenes raíz — 21-10-2026

Se inspeccionaron las referencias de `index.html`, `css/style.css`, `css/redesign-v3.css` y `js/script.js`. Las referencias directas de muestra localizadas en `css/redesign-v3.css` usan `foto1.jpg`, `foto2.jpg`, `foto3.jpg` y `ferreteria-constructor.jpg` para tarjetas y elementos visuales de la familia comercial. No se eliminaron recursos: borrar imágenes sin una prueba visual podría romper estilos de la demo comercial. Los nombres de archivos de la carpeta raíz no identifican clientes. Esta es una revisión estática de nombres/rutas y referencias; no constituye una inspección visual del contenido de cada imagen ni prueba con imágenes reales de cliente.
