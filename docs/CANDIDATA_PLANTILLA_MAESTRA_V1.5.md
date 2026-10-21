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

El nombre de Worker ya se aisló en la configuración de la candidata como `siden-template-candidate-2026-10`. La captura confirma que los builds de Preview están habilitados y usan `npx wrangler preview`, pero no demuestra por sí sola que el Preview de la candidata sea completamente independiente. Antes de considerarla certificada, verificar la implementación de Preview y su URL; no ejecutar `npx wrangler deploy` ni cambiar la rama de producción del Worker de pruebas.

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
- [ ] Confirmar en Cloudflare que el Preview de esta rama no altera el Worker de certificación ni producción; los builds de Preview están habilitados y usan `npx wrangler preview`, pero falta comprobar el resultado de la implementación de esta candidata.
- [ ] Validar la página genérica en Preview; no repetir pruebas de certificación previas salvo si el cambio afecta su comportamiento.
- [ ] Revisar assets publicados y comportamiento sin imágenes/logotipo.
- [ ] Consolidar la documentación Word final.
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

**Pendiente:** esperar la compilación automática de Cloudflare y verificar en la URL de candidata que los botones no aparecen cuando WhatsApp está vacío. Esta corrección es solo de la rama candidata; no se modificó la rama de certificación ni producción.


### Corrección posterior: conservar los CTA de WhatsApp visibles

El 21-10-2026, la primera corrección ocultó los botones cuando la configuración genérica no tenía número. El usuario indicó que esto eliminó toda referencia visible a WhatsApp y empeoró la página. Se corrigió esa decisión en la candidata:

- Los CTA flotante, de contacto y otros CTA de WhatsApp permanecen visibles aunque el número todavía no esté configurado.
- Cuando hay número, el botón abre el enlace `https://wa.me/<número>`.
- Cuando no hay número, el clic se intercepta y muestra un aviso de que WhatsApp estará disponible al configurar el número; no debe navegar a la misma página.
- Los CTA de consulta por WhatsApp de las tarjetas de producto también se conservan y muestran el aviso mientras no exista número configurado.

Commit de corrección: `e0ac57a600976d2e004bef90f761333587509027`; conservación del CTA en tarjetas de productos: `909ea1b57779e99e96012bfc54f3d8bc04f73e0d`.

**Pendiente de verificación:** compilación automática de Cloudflare y comprobación visual/interactiva en la URL candidata. No se modificó producción.
