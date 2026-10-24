# SIDeN — Índice maestro de documentación

**Objetivo:** identificar el documento operativo vigente para cada tipo de trabajo y evitar instrucciones contradictorias.

## 1. Documentos operativos vigentes en esta revisión

1. **Arquitectura SIDeN V2.0:** `ARQUITECTURA_SIDEN_V2.0.md` — modelo de plantilla maestra, proyectos independientes, seguridad, Preview y cambios compartidos.
2. **Procedimiento de creación de proyectos V2.0:** `PROCEDIMIENTO_CREACION_PROYECTOS_SIDEN_V2.0.md` — alta, configuración, validación y publicación de proyectos.
3. **SIDeN MINI V2.0:** `SIDEN_MINI_ARQUITECTURA_Y_ALCANCE_V2.0.md` — alcance técnico previsto y condiciones de validación.
4. **Catálogo de módulos V2.0:** `CATALOGO_MODULOS_CONFIGURACION_SIDEN_V2.0.md` — configuración, módulos, familias y pruebas.

La referencia de código utilizada para esta actualización es la rama `siden-template-candidate-2026-10`, commit `592528ebae9fd7ad658e5b6d96ae43380fefd19e`. La candidata sigue sujeta a controles y aprobación formal.

## 2. Orden de precedencia

- Para decisiones generales de arquitectura, seguir Arquitectura SIDeN V2.0.
- Para crear y publicar un sitio, seguir el Procedimiento V2.0.
- Para una instancia MINI, aplicar además su alcance V2.0 y la ficha comercial vigente.
- Para campos y módulos, consultar el Catálogo V2.0 y comprobar el comportamiento en el código de la versión desplegada.
- Los documentos de versiones anteriores se conservan como historial; no deben usarse como instrucciones operativas cuando contradigan V2.0.
- Si hay una contradicción, no adivinar: identificar el comportamiento real del código, documentar la diferencia y corregir los documentos antes de un cambio sensible.

## 3. Reglas de control

Cada documento debe identificar versión, estado y rama/commit al que aplica. Cuando cambie código compartido, revisar y actualizar la documentación afectada en el mismo trabajo. La aprobación de Preview no equivale a autorización de producción ni garantiza indexación.

Mantener también, según corresponda, un registro de decisiones y cambios, una matriz de regresión, una ficha de entrega por cliente y una guía de despliegue/recuperación.

## 4. Estado de la revisión documental

Los cuatro documentos V2.0 se incorporan como referencia operativa coherente. La documentación no sustituye las pruebas técnicas pendientes ni la autorización explícita para publicar. La producción comercial de SIDeN permanece separada de la plantilla maestra.
