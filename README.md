# SIDeN — Plantilla maestra y arquitectura independiente

## Referencia técnica actual
- **Repositorio:** `sysflow7/mi-primera-plantilla-web`
- **Rama de referencia:** `siden-template-candidate-2026-10`
- **Commit revisado para la documentación V2.0:** `592528ebae9fd7ad658e5b6d96ae43380fefd19e`
- **Estado:** candidata técnica; no declararla certificada hasta completar los controles pendientes y obtener aprobación explícita.

## Arquitectura
SIDeN utiliza una plantilla maestra reutilizable y proyectos independientes por sitio. Cada cliente debe tener su propio repositorio/proyecto, `config.json`, Worker y configuración de dominio. Las mejoras de la plantilla no se propagan automáticamente a sitios ya publicados.

## Documentos operativos V2.0
1. [Arquitectura SIDeN V2.0](docs/ARQUITECTURA_SIDEN_V2.0.md)
2. [Procedimiento de creación de proyectos V2.0](docs/PROCEDIMIENTO_CREACION_PROYECTOS_SIDEN_V2.0.md)
3. [SIDeN MINI: arquitectura y alcance V2.0](docs/SIDEN_MINI_ARQUITECTURA_Y_ALCANCE_V2.0.md)
4. [Catálogo de módulos y configuración V2.0](docs/CATALOGO_MODULOS_CONFIGURACION_SIDEN_V2.0.md)

El índice de documentación indica precedencia y estado de los documentos. Las versiones anteriores se conservan como historial y no deben utilizarse si contradicen los documentos V2.0.

## Producción comercial de SIDeN
La rama `sidenred-comercial-PROD`, el Worker `hola` y el dominio `sidenred.com` son recursos productivos independientes. No utilizarlos para pruebas ni modificarlos/desplegarlos durante el trabajo de la plantilla maestra sin autorización explícita.

## Estado de pruebas y límites
La candidata se despliega en un Worker independiente y el usuario confirmó visualmente que carga contenido genérico. Siguen siendo obligatorias las pruebas específicas del cambio que se realice, incluidas las regresiones pertinentes. La revisión documental no equivale a una auditoría de seguridad integral ni certifica todas las funciones.
