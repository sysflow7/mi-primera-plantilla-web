# SIDeN — Índice maestro de documentación V1.0

**Objetivo:** identificar qué documento manda para cada tipo de trabajo y reducir instrucciones contradictorias.

## 1. Documentos normativos principales

1. **Arquitectura nueva:** `ARQUITECTURA_NUEVA_SIDEN_V1.0.md` — estructura, flujo, aislamiento, seguridad y regla de cambios compartidos.
2. **Arquitectura maestra de implementación:** `ARQUITECTURA_MAESTRA_V1.5.md` — referencia operativa de la plantilla V1.5 en la rama de certificación.
3. **Arquitectura independiente operativa:** `ARQUITECTURA_INDEPENDIENTE_V1.5.md` — configuración y funcionamiento concreto del modelo independiente V1.5.
4. **Creación de proyectos de clientes:** `PROCEDIMIENTO_CREACION_PROYECTO_CLIENTE_V1.0.md` — alta, configuración, Preview, aceptación y publicación.
5. **SIDeN MINI:** `SIDEN_MINI_ARQUITECTURA_Y_ALCANCE_V1.0.md` — alcance, exclusiones y reglas de variante.
6. **Auditoría histórica:** `AUDITORIA_CIERRE_PUNTOS_1_2_3_V1.md` — evidencia histórica y limitaciones de las pruebas.

## 2. Orden de precedencia

- La arquitectura independiente describe el modelo objetivo y las reglas de aislamiento.
- La documentación V1.5 describe el código de referencia y no debe renombrarse como si el código fuese V1.0.
- El procedimiento de clientes aplica la arquitectura a un proyecto nuevo.
- La definición MINI restringe el alcance funcional de esa variante; no autoriza cambios en componentes compartidos.
- Si dos documentos se contradicen, no adivinar: registrar la contradicción, identificar el comportamiento real del código y actualizar ambos documentos de forma coherente antes de una implementación sensible.

## 3. Documentos adicionales recomendados

Para que el sistema de trabajo sea completo, se recomienda mantener también:
- **Registro de cambios y decisiones de arquitectura:** qué cambió, por qué, impacto, commit, pruebas y aprobación.
- **Matriz de pruebas de regresión:** por componente compartido y familia WEB/MINI.
- **Ficha de entrega por cliente:** repositorio, rama, Worker, dominio, versión, indexación, analítica y módulos.
- **Guía de despliegue y recuperación:** cómo publicar en Preview/producción y cómo volver a una versión conocida.
- **Catálogo de módulos y configuración:** campos de `config.json`, valores permitidos, dependencias y páginas que pueden activarlos.
- **Matriz comercial de planes:** funcionalidades y límites por Esencial, Impulso, Profesional, MINI y LOCAL; mantenerla separada de la arquitectura técnica.

## 4. Regla para evitar documentación obsoleta

Cada documento debe mostrar versión, fecha de revisión, estado (borrador, vigente, histórico) y rama/código al que aplica. Al cambiar código compartido, actualizar el documento afectado en el mismo trabajo. Los documentos históricos deben etiquetarse como tales y no deben utilizarse como instrucciones de implementación.

## 5. Estado actual

Los documentos V1.0 de arquitectura nueva, procedimiento de clientes, SIDeN MINI e índice maestro son definiciones iniciales. Deben contrastarse con la estructura real del repositorio y con la oferta comercial vigente antes de considerarse documentación final de producción.
