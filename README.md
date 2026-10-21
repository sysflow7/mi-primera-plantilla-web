# SIDeN — Plantilla Maestra V1.5 con arquitectura independiente

## Origen verificado
La base visual y funcional se toma de la rama `siden-corporativo-v1.3`, que contiene la plantilla maestra más reciente y la instancia de Dr. Carlos Reyes en `sites/drcarlosreyes/`. No se usa la V1.3 antigua ni la rama experimental basada en V1.4.

## Qué se conserva
Se conservan `index.html`, `css/`, `js/` e imágenes de la base de producción, incluyendo mejoras de presentación, módulos, planes/FAQ de demo y cambios validados. La estructura de configuración del Dr. Carlos Reyes se usa como referencia de campos, sin copiar su información profesional ni sus imágenes personales al demo genérico.

## Arquitectura
- Un proyecto y Worker independiente por cliente.
- El Worker lee únicamente `/config.json` y recursos de la raíz.
- Sin `SIDEN_REGISTRY`, `registry.json` ni rutas `/sites/{instanceId}/` para resolver el sitio.
- `indexable: false` durante pruebas.
- El sitio corporativo y los Workers existentes no se modifican.

## Estado de validación
El alcance funcional base de V1.5 y la presentación visual de las familias corporate/commercial se comprobaron en Preview. El usuario confirmó que en la familia comercial aparecen las FAQ (con el módulo `faq` habilitado), las secciones comerciales y los planes SIDeN. Resultados registrados en `docs/ARQUITECTURA_INDEPENDIENTE_V1.5.md`. No repetir pruebas confirmadas salvo que un cambio posterior afecte el comportamiento. La arquitectura no está desplegada en producción.


## Prueba de aislamiento de contenido
Rama `prueba-aislamiento-contenido-v1.5`: despliegue de prueba para verificar que las páginas corporativas de clientes no entreguen en el HTML las secciones comerciales de SIDeN ni las preguntas frecuentes predeterminadas.



## Estado de transición — 21-10-2026

La rama `prueba-aislamiento-contenido-v1.5` es una **rama de certificación**, no la rama oficial aprobada para crear nuevos proyectos. Contiene un `config.json` de prueba y un `wrangler.jsonc` con el nombre del Worker de pruebas; no se debe convertir directamente en plantilla de lanzamiento.

La rama predeterminada reportada por GitHub es `siden-template-v1.3`; la rama de producción existente es `siden-corporativo-v1.3`. Son referencias distintas y no deben cambiarse durante la preparación de V1.5 sin autorización expresa.

La comprobación funcional documentada en Preview está completada para los escenarios indicados en la arquitectura maestra. Aún falta preparar una candidata genérica aislada, confirmar la conexión y los disparadores de Cloudflare para la futura candidata y cerrar la reconciliación documental. La revisión funcional de Preview no equivale a una auditoría de seguridad integral.

**Producción:** no fusionar ni desplegar esta rama en `siden-corporativo-v1.3`, Worker `siden-corporativo` o `sidenred.com` sin autorización explícita.
