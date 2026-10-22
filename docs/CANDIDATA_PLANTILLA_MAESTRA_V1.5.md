# SIDeN V1.5 — Candidata de plantilla maestra

**Rama:** `siden-template-candidate-2026-10`  
**Estado:** candidata técnica en preparación; NO aprobada para producción ni para nuevos proyectos.  
**Commit inicial de configuración genérica:** `3b8f5b880be1eb9edc7bde8c0594e205f96d0fbd`.

## Objetivo

Separar la configuración reutilizable de la plantilla de los datos ficticios que se usaron para certificar las familias corporativa/comercial y el sitio multipágina.

## Cambios incluidos en esta candidata

- `config.json` sustituido por una configuración genérica sin nombre, teléfono, WhatsApp, redes, catálogo, servicios, productos, FAQ ni datos ficticios de un cliente.
- Familia inicial `corporate`, estado `cliente`, modalidad inicial `single` e `indexable: false`.
- Conserva campos de configuración compatibles con la arquitectura independiente V1.5 y usa textos neutros de configuración pendiente.
- La rama de certificación `prueba-aislamiento-contenido-v1.5` no fue modificada por estos cambios.

## Estado de Cloudflare Preview — 21-10-2026

El usuario confirmó en la pantalla de Cloudflare que:
- Los builds para ramas de vista previa están habilitados.
- El comando de vista previa configurado es `npx wrangler preview`.
- El directorio raíz es `/`.
- La ruta de vigilancia incluye `*`.
- No hay variables ni secretos de compilación configurados.
- Hay un token de API seleccionado en la interfaz; su nombre no se replica en esta documentación.

## Bloqueo previo a Preview de la candidata

El nombre del Worker se aisló como `siden-template-candidate-2026-10` y el usuario confirmó que la URL pública de la candidata carga contenido genérico. La evidencia disponible confirma que la candidata se desplegó en su Worker separado; no confirma todavía todos los disparadores, aliases y relaciones de configuración entre candidata, Worker de certificación y producción. No ejecutar despliegues manuales ni cambiar la rama de producción del Worker público como parte de esta revisión.

## Política de nombres propuesta

- Rama oficial estable, una vez aprobada: `siden-template-maestra` (sin número de versión en el nombre).
- Rama candidata temporal: `siden-template-candidate-YYYY-MM`.
- Ramas de pruebas: prefijo `prueba-` o `certificacion-` con el propósito concreto.
- La versión se documenta en los archivos de release, commits/tags y changelog, no se deduce del nombre de la rama.
- El Worker de `sidenred.com` es el Worker del sitio público y no debe confundirse con el repositorio/branch de la plantilla maestra.
- El nombre definitivo del Worker del sitio público queda pendiente de evaluación de dependencias y aprobación; no renombrarlo ahora.

## Lista de salida

- [x] Rama candidata separada creada desde la rama de certificación.
- [x] Configuración genérica inicial preparada y JSON válido.
- [x] Actualizar `wrangler.jsonc` con un nombre exclusivo para la candidata: `siden-template-candidate-2026-10`.
- [ ] Confirmar documentalmente en Cloudflare la separación completa de disparadores, aliases y despliegues entre candidata, certificación y producción. El usuario ya confirmó que la página de la candidata se despliega en su Worker separado; eso no sustituye la revisión de todos los vínculos de configuración.
- [x] Validar la página genérica en Preview: el usuario confirmó contenido genérico, sin datos de clientes ni planes comerciales SIDeN.
- [ ] Terminar revisión de recursos de ejemplo publicados desde `images/` raíz y probar una imagen/logotipo configurados en una instancia de prueba.
- [ ] Consolidar la documentación Word final después de completar los controles pendientes y reconciliar los documentos Markdown.
- [ ] Obtener aprobación explícita antes de designar la rama oficial o modificar producción.

## Seguridad de publicación

No modificar ni desplegar a `siden-corporativo-v1.3`, Worker `siden-corporativo` ni dominio `sidenred.com` como parte de esta candidata. La creación de esta rama no autoriza una migración ni un cambio de rama predeterminada de GitHub.


## Configuración actual verificada en GitHub

- `wrangler.jsonc` declara `siden-template-candidate-2026-10`, distinto del Worker de certificación.
- `config.json` se parsea correctamente como JSON.
- `config.json` mantiene `templateFamily: corporate`, `estadoComercial: cliente`, `modoSitio: single` e `indexable: false`.
- Los datos de contacto, catálogo, redes, productos, servicios y FAQ están vacíos o desactivados para la plantilla genérica.
- El nombre de Worker se aisló en el archivo; esto no sustituye la comprobación de Cloudflare Preview ni la aprobación de la rama oficial.


## Revisión estática de consistencia de configuración — 21-10-2026

Se compararon los campos de `config.json` con las lecturas del Worker y del motor de configuración:

- El Worker y el motor toman `siden.templateFamily`; la candidata usa `corporate`.
- El Worker decide las rutas multipágina con `modoSitio === "multi"`; la candidata usa `single` intencionalmente como punto de partida. Una instancia contratada como multipágina debe declarar `modoSitio: "multi"` y sus rutas en `paginas`.
- `indexable: false` está definido para evitar indexación mientras se prepara el sitio.
- El motor GA4 busca `analytics.ga4.measurementId`; como la configuración genérica no define un ID, la medición permanece desactivada por defecto. No se debe agregar un ID de cliente al fixture genérico.
- El Worker construye el canonical con el origen real de la solicitud, no con `siden.baseDomain`; ese campo por sí solo no configura el dominio ni DNS.
- El archivo `.assetsignore` excluye `worker.js`, `wrangler.jsonc`, Markdown/documentación y carpetas `sites/` y `mini/` del conjunto de assets estáticos. El comportamiento debe confirmarse en la implementación de Preview, no solo por lectura del archivo.
- La inspección estática no reemplaza el Preview, la prueba con recursos reales ni la revisión de seguridad completa.

## Regla de migración para evitar sorpresas tardías

Antes de migrar `sidenred.com`, cerrar y registrar en una única ficha:
1. commit exacto de la candidata aprobada;
2. rama oficial estable (nombre sin número de versión);
3. Worker y dominio de cada entorno, diferenciando plantilla, sitio público y pruebas;
4. configuración Cloudflare Build/Preview y rama de producción para el Worker del sitio público;
5. rutas, canonical, indexación y GA4 del sitio que se migra;
6. pruebas de aceptación y plan de reversión;
7. autorización expresa para el cambio de producción.

No declarar la arquitectura lista para migrar mientras siga sin confirmarse el Preview de la candidata y sin completar la revisión de recursos reales.


## Registro de activación de compilación — 21-10-2026

El usuario confirmó que la rama de producción del Worker independiente `siden-template-candidate-2026-10` se cambió en Cloudflare a la rama Git `siden-template-candidate-2026-10`. Se registra este cambio documental para generar un nuevo evento de compilación de la candidata y verificar que Cloudflare utilice la rama correcta.

Esta anotación no constituye certificación ni aprobación de producción. Tras finalizar la compilación, comprobar el commit/branch desplegado, que el Worker resultante sea `siden-template-candidate-2026-10`, y revisar el registro de Wrangler para descartar conflictos de nombre o archivos heredados inesperados.


## Primera implementación de la candidata — 21-10-2026

- La compilación `ea9946ab` terminó correctamente desde la rama `siden-template-candidate-2026-10`.
- Worker desplegado: `siden-template-candidate-2026-10`.
- URL de prueba de Workers: `https://siden-template-candidate-2026-10.darvincanal2025.workers.dev`.
- El registro no muestra la advertencia anterior de discrepancia entre el nombre de Worker de Wrangler y el nombre esperado por Cloudflare.
- Wrangler leyó 229 archivos del directorio de assets y reportó 28 archivos nuevos/modificados en esta implementación. Entre los archivos listados hay recursos visuales de SIDeN y de ejemplo; esto se registra para revisar que los recursos compartidos sean intencionales y no contengan datos de clientes antes de certificar la candidata.
- La revisión del registro detectó que `config.json` aún heredaba `siden.baseDomain: "sidenred.com"`, aunque esta candidata es genérica. Se corrigió el campo a cadena vacía en un commit posterior para evitar asociar la configuración genérica al dominio de producción. Cloudflare debe completar la nueva compilación automática antes de validar esta corrección.

Esta implementación confirma el despliegue aislado de la candidata, no la certificación funcional completa ni la autorización para migrar el sitio público.


## Hallazgo funcional de WhatsApp en plantilla genérica — 21-10-2026

El usuario confirmó que la página genérica cargaba correctamente, sin datos de cliente ni planes comerciales de SIDeN, pero que los botones flotante y de contacto abrían la misma página. La causa se identificó en `js/script.js`: cuando `whatsapp` está vacío, los enlaces recibían `href="#"`, que navega al inicio de la misma página.

Correcciones realizadas en la candidata:
- Si no hay número de WhatsApp configurado, los CTA `whatsapp-principal`, `whatsapp-final`, `whatsapp-flotante` y `pagina-whatsapp` quedan ocultos, sin atributo `href`.
- Si hay número configurado, se construye el enlace `https://wa.me/<número>` y el CTA queda visible.
- Las tarjetas de producto no generan un enlace de consulta por WhatsApp cuando no existe número configurado.

Cambios en `js/script.js`:
- `09182d9e666b31e4b33271fd0958070ca6b236a2`: ocultar CTA sin número.
- `56d7d085a9efd9ac3da5464ce1c8069ca3c912f8`: omitir enlaces WhatsApp en tarjetas de productos cuando no hay número.

**Corrección supersedida:** la primera versión ocultaba los CTA cuando WhatsApp estaba vacío. El usuario indicó que eso eliminó referencias visibles y se revirtió esa decisión. La sección siguiente documenta el comportamiento vigente. No se modificó producción.


### Corrección posterior: conservar los CTA de WhatsApp visibles

El 21-10-2026, la primera corrección ocultó los botones cuando la configuración genérica no tenía número. El usuario indicó que esto eliminó toda referencia visible a WhatsApp y empeoró la página. Se corrigió esa decisión en la candidata:

- Los CTA flotante, de contacto y otros CTA de WhatsApp permanecen visibles aunque el número todavía no esté configurado. Este es el comportamiento vigente y reemplaza la primera corrección que los ocultaba.
- Cuando hay número, el botón abre el enlace `https://wa.me/<número>`.
- Cuando no hay número, el clic se intercepta y muestra un aviso de que WhatsApp estará disponible al configurar el número; no debe navegar a la misma página.
- Los CTA de consulta por WhatsApp de las tarjetas de producto también se conservan y muestran el aviso mientras no exista número configurado.

Commit de corrección: `e0ac57a600976d2e004bef90f761333587509027`; conservación del CTA en tarjetas de productos: `909ea1b57779e99e96012bfc54f3d8bc04f73e0d`.

**Verificado por el usuario en la URL candidata:** los CTA permanecen visibles y el aviso de número pendiente aparece al pulsarlos. Sigue pendiente comprobar el enlace con un número de WhatsApp de prueba. No se modificó producción.


## Estado después de la comprobación visual de WhatsApp — 21-10-2026

El usuario confirmó que el aviso “WhatsApp estará disponible cuando se configure el número del negocio” aparece al pulsar el CTA y que los botones flotante y de contacto permanecen visibles. Esto valida el comportamiento sin número configurado. No valida todavía que el enlace abra WhatsApp con un número de prueba. El código de la candidata conserva los CTA y evita la navegación al inicio de la página mientras no haya número.

La página genérica se visualizó correctamente y no presentó datos de clientes ni los planes comerciales de SIDeN. La candidata sigue sin estar aprobada para producción o como rama oficial de nuevos proyectos.


## Incorporación de mejoras detectadas en producción — 22-10-2026

Por autorización del usuario, se incorporaron a esta rama candidata dos mejoras genéricas que ya estaban presentes en `sidenred-comercial-PROD`, sin copiar la configuración comercial del sitio ni modificar producción:

1. **Navegación interna robusta (`js/script.js`):** el menú de enlaces ancla intercepta el clic, comprueba que el destino exista, revela el destino si está oculto, desplaza suavemente hacia él y actualiza el fragmento de URL. El manejador se registra una sola vez mediante `data-siden-anchor-bound`.
2. **Presentación de imágenes y anclaje de secciones (`css/redesign-v2.css`):** las secciones `.content-split` reciben `scroll-margin-top: 100px`; las imágenes usan `display: block !important`, altura máxima de 420 px, altura automática, `object-fit: contain` y centrado. Se reemplazó el límite previo de 300 px y `object-fit: cover`.

**Commits de la candidata:**
- `js/script.js`: `324c2dcb39ad07a5a7847b8c95ea2eb2bf2a80c7`.
- `css/redesign-v2.css`: `ee115b3969759d4fb49112e8c0bf58b6c94dd334`.

Estos cambios pertenecen solo a la candidata. No se copiaron los datos de `config.json` de producción, no se modificó la rama `sidenred-comercial-PROD` ni el Worker `hola`, y los cambios todavía requieren validación en Preview y pruebas de regresión antes de certificar la candidata.

## Independencia de los proyectos derivados

La arquitectura independiente permite que cada proyecto derivado tenga su propio repositorio/proyecto, `config.json`, recursos, `wrangler.jsonc` y Worker. Una modificación posterior de la plantilla maestra **no se propaga automáticamente** a proyectos ya creados. Para incorporar una mejora a un proyecto existente se debe revisar su impacto, adaptar el cambio a su configuración propia y probarlo en su Preview. La plantilla maestra define la base de los nuevos proyectos, no limita la personalización independiente de cada instancia.
