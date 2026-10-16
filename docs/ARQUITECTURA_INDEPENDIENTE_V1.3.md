# SIDeN — Arquitectura independiente basada en plantilla V1.3

## Decisión de base
Esta prueba parte de la rama `siden-template-v1.3`. Los archivos de presentación y comportamiento (`index.html`, `css/` y `js/`) se conservan desde esa base. No se usa V1.4 como origen.

## Principios
- Un repositorio/proyecto, un Worker y un despliegue por cliente.
- Cada proyecto tiene su propio `config.json`, `index.html`, `css/`, `js/` e `images/`.
- No se usan `/sites/{instanceId}/`, `SIDEN_REGISTRY` ni un KV central para resolver el sitio.
- Las mejoras a la plantilla maestra se trasladan selectivamente a proyectos existentes; no cambian automáticamente sus sitios desplegados.
- El sitio corporativo `sidenred.com` y su Worker de producción no se modifican en esta prueba.

## Worker independiente
El Worker de este proyecto lee solamente `/config.json` y sirve recursos desde las carpetas de este repositorio. El nombre configurado en `wrangler.jsonc` es `siden-arquitectura-independiente-pruebas`.

## Pruebas requeridas
1. Confirmar que carga la versión visual basada en V1.3.
2. Revisar textos y elementos que se habían retirado de V1.3.
3. Probar imágenes, enlaces, WhatsApp, navegación y recursos estáticos.
4. Validar las rutas de sitio multipágina sin afectar otros proyectos.
5. Confirmar que el modo de demo muestra los planes y preguntas frecuentes de SIDeN, mientras un sitio de cliente puede ocultar los planes SIDeN y configurar sus propias preguntas frecuentes.
6. Mantener `indexable: false` mientras sea un entorno de prueba.

## Cloudflare
Worker de pruebas: `siden-arquitectura-independiente-pruebas`.
Rama: `arquitectura-independiente-v1.3-2026-10-16`.
Comando de despliegue: `npx wrangler deploy`.
No cambiar ni desplegar `siden-corporativo`.
