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



## Estado de transición — 22-10-2026

La rama `prueba-aislamiento-contenido-v1.5` es una **rama de certificación**, no la rama oficial aprobada para crear nuevos proyectos. Contiene configuración de prueba y no debe convertirse directamente en plantilla de lanzamiento.

**Plantilla maestra candidata:** `siden-template-candidate-2026-10`. Sigue pendiente de aprobación formal hasta completar las comprobaciones y reconciliar la documentación.

**Sitio comercial de SIDeN:** el usuario confirma que la rama `sidenred-comercial-PROD` corresponde a la producción de `sidenred.com` y que el Worker de producción es `hola`. Estos son recursos distintos de la plantilla maestra. No modificar ni desplegar en ellos durante el trabajo de la candidata sin autorización explícita.

La candidata se desplegó en su Worker independiente del mismo nombre. El usuario confirmó visualmente contenido genérico, sin datos de clientes ni planes comerciales de SIDeN, y confirmó que los CTA de WhatsApp permanecen visibles y muestran un aviso cuando falta el número. Siguen pendientes pruebas con número de WhatsApp de prueba, revisión final de assets, comprobación de configuración Cloudflare y aprobación de la rama oficial. Esta revisión no equivale a una auditoría de seguridad integral.
