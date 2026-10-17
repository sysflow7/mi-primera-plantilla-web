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

## Validación pendiente
Probar apariencia V1.5, textos retirados anteriormente, planes y FAQ demo, imágenes, botones, navegación y después rutas multipágina y configuración de cliente.


## Prueba de aislamiento de contenido
Rama `prueba-aislamiento-contenido-v1.5`: despliegue de prueba para verificar que las páginas corporativas de clientes no entreguen en el HTML las secciones comerciales de SIDeN ni las preguntas frecuentes predeterminadas.
