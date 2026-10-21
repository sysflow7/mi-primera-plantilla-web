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

