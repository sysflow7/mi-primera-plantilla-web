# SIDeN — Índice maestro de documentación V1.0

**Objetivo:** identificar qué documento manda para cada tipo de trabajo y reducir instrucciones contradictorias.

## 1. Documentos normativos principales

1. **Arquitectura nueva:** `ARQUITECTURA_NUEVA_SIDEN_V1.0.md` — definición general de estructura, aislamiento, seguridad y cambios compartidos; consultar junto con la arquitectura independiente V1.5 para la implementación vigente.
2. **Arquitectura maestra de implementación:** `ARQUITECTURA_MAESTRA_V1.5.md` — referencia de la plantilla V1.5 en la rama de certificación.
3. **Arquitectura independiente operativa:** `ARQUITECTURA_INDEPENDIENTE_V1.5.md` — configuración y funcionamiento concreto del modelo independiente V1.5.
4. **Creación de proyectos de clientes — VIGENTE:** `PROCEDIMIENTO_CREACION_PROYECTO_CLIENTE_V1.1.md` — procedimiento operativo para crear, configurar, probar y entregar proyectos independientes.
5. **Lista de control de candidata de lanzamiento — VIGENTE PARA EL CIERRE:** `LISTA_CONTROL_CANDIDATA_LANZAMIENTO_V1.5.md` — gates pendientes antes de aprobar una rama oficial para nuevos proyectos; no autoriza despliegues.
6. **Procedimiento anterior:** `PROCEDIMIENTO_CREACION_PROYECTO_CLIENTE_V1.0.md` — versión inicial; conservar como historial, no usar si contradice V1.1.
7. **SIDeN MINI:** `SIDEN_MINI_ARQUITECTURA_Y_ALCANCE_V1.0.md` — propuesta de alcance y exclusiones; no acredita que MINI esté implementado o certificado en la arquitectura independiente V1.5.
8. **Auditoría histórica:** `AUDITORIA_CIERRE_PUNTOS_1_2_3_V1.md` — solo referencia histórica del modelo anterior; sus pendientes y conclusiones antiguas no prevalecen sobre los registros de certificación V1.5.
9. **Catálogo de módulos:** `CATALOGO_MODULOS_CONFIGURACION_V1.5.md` — módulos y configuración de la plantilla V1.5.

## 2. Orden de precedencia

- La arquitectura independiente describe el modelo objetivo y las reglas de aislamiento.
- La documentación V1.5 describe el código de referencia y no debe renombrarse como si el código fuese V1.0.
- El procedimiento de creación V1.1 aplica la arquitectura a un proyecto nuevo.
- La lista de control de candidata de lanzamiento define los controles de salida antes de declarar una rama oficial.
- La definición MINI restringe el alcance funcional de esa variante; no autoriza cambios en componentes compartidos.
- Si dos documentos se contradicen, no adivinar: registrar la contradicción, identificar el comportamiento real del código y actualizar la documentación coherentemente antes de una implementación sensible.
- Los documentos históricos no deben utilizarse como instrucciones operativas cuando exista una versión posterior vigente.

## 3. Documentos de control recomendados

Mantener, conforme se necesiten:
- Registro de decisiones/cambios: motivo, impacto, commit, pruebas y autorización.
- Matriz de regresión para componentes compartidos y familias WEB/MINI.
- Ficha de entrega por cliente: repositorio, rama, Worker, dominio, versión, indexación, analítica y módulos.
- Guía de despliegue y recuperación.
- Matriz comercial de planes y límites, separada de la arquitectura técnica.

## 4. Control de vigencia

Cada documento debe indicar versión, estado (vigente, borrador o histórico) y rama/código al que aplica. Al cambiar código compartido, actualizar el documento afectado en el mismo trabajo. Los documentos históricos deben etiquetarse como tales y no utilizarse como instrucciones de implementación.

## 5. Estado de la documentación

La arquitectura independiente V1.5, la arquitectura maestra V1.5 y el catálogo V1.5 describen el modelo de referencia de la rama de certificación. El procedimiento V1.1 es el flujo operativo vigente para preparación y pruebas de nuevos proyectos independientes, pero no define por sí solo la rama oficial. Antes de una publicación, confirmar que la rama base esté aprobada y que las instrucciones coincidan con la configuración real de GitHub y Cloudflare.

## 6. Estado del cierre de V1.5 (21-10-2026)

- **Comprobación visual de familia comercial:** completada en Preview; se confirmaron secciones comerciales, planes SIDeN y FAQ.
- **Configuración del fixture:** restaurada a `templateFamily: corporate` y `estadoComercial: cliente` en la rama de certificación.
- **Producción:** sin cambios ni despliegues autorizados.
- **Documentación Word:** al terminar el alcance acordado, entregar los documentos operativos actualizados en `.docx`; no considerar los borradores Word previos como la edición final hasta esa consolidación.
- **Siguiente etapa:** preparar una candidata aislada con configuración genérica; confirmar los disparadores de GitHub/Cloudflare; completar las verificaciones pendientes y la reconciliación documental antes de promover la arquitectura a nuevos proyectos.
