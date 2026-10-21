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

El archivo `wrangler.jsonc` heredado todavía contiene el nombre del Worker de certificación `siden-prueba-cliente-multipagina-v15`. La actualización de ese archivo no se pudo realizar mediante la operación automatizada actual. **No iniciar el Preview de la candidata ni ejecutar `npx wrangler deploy` hasta resolver el nombre de Worker y confirmar el comportamiento de las compilaciones de Preview.**

La captura confirma que los builds de Preview están habilitados en el proyecto del Worker de certificación, pero no demuestra que un Preview de una nueva rama sea completamente independiente del Worker existente. No asumir aislamiento mientras `wrangler.jsonc` conserve ese nombre. No cambiar la rama de producción del Worker de pruebas para intentar resolverlo.

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
- [ ] Actualizar `wrangler.jsonc` con un nombre de Worker exclusivo y aprobado para la candidata.
- [ ] Confirmar en Cloudflare que el Preview de esta rama no altera el Worker de certificación ni producción.
- [ ] Validar la página genérica en Preview; no repetir pruebas de certificación previas salvo si el cambio afecta su comportamiento.
- [ ] Revisar assets publicados y comportamiento sin imágenes/logotipo.
- [ ] Consolidar la documentación Word final.
- [ ] Obtener aprobación explícita antes de designar la rama oficial o modificar producción.

## Seguridad de publicación

No modificar ni desplegar a `siden-corporativo-v1.3`, Worker `siden-corporativo` ni dominio `sidenred.com` como parte de esta candidata. La creación de esta rama no autoriza una migración ni un cambio de rama predeterminada de GitHub.
