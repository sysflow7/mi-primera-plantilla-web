# HISTÓRICO — Plantilla Maestra SIDeN V1.5: origen de la arquitectura independiente

**Estado:** documento de contexto histórico; no usar como instrucción operativa para desplegar o seleccionar la rama oficial. La información de origen que sigue describe la decisión inicial y no la candidata actual.


## Evidencia de origen
La rama `siden-corporativo-v1.3` es la fuente de la plantilla maestra más reciente. Su configuración raíz declara `siden.template: siden-template-v1.5` y `version: 1.5`; también contiene `sites/drcarlosreyes/config.json` con `templateFamily: corporate` y `estadoComercial: demo`.

## Decisión
Se parte de esa rama y se conserva su interfaz, estilos, scripts y recursos. Se sustituye el enrutamiento multisite del Worker por un Worker independiente que sirve la configuración y los recursos de este proyecto.

## Aislamiento
- Configuración genérica en `/config.json`.
- Recursos en `/images/`.
- Sin registro central ni `/sites/{instanceId}/` para resolver el sitio.
- No desplegar ni modificar el Worker `siden-corporativo`.
- Mantener `indexable: false` hasta aprobación.

La forma de los campos se basa en la configuración de Dr. Carlos Reyes, pero sus datos profesionales e imágenes personales no se reutilizan.


## Vigencia actual — 21-10-2026

La candidata actual se mantiene en `siden-template-candidate-2026-10`, con configuración genérica y Worker independiente del mismo nombre. Este documento explica el origen de la arquitectura y no sustituye a `CANDIDATA_PLANTILLA_MAESTRA_V1.5.md`, `LISTA_CONTROL_CANDIDATA_LANZAMIENTO_V1.5.md` ni al procedimiento operativo V1.1. No seleccionar `siden-corporativo-v1.3` como rama de despliegue para clientes: es la rama de producción del sitio público y no la rama candidata actual.
