# Plantilla Maestra SIDeN V1.5 — base independiente

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
