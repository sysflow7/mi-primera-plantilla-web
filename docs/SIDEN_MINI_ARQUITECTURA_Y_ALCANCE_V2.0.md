# SIDeN MINI — Arquitectura y alcance V2.0

**Rama de referencia:** `siden-template-candidate-2026-10`. Registrar el commit aprobado que se utilice.  
**Estado:** definición técnica de alcance; este documento no certifica por sí solo una implementación lista para producción.

## 1. Objetivo

SIDeN MINI es una presencia digital compacta para presentar un negocio y facilitar el contacto. No incluye automáticamente todas las funciones de SIDeN WEB y debe desplegarse como proyecto independiente.

## 2. Relación con la plantilla maestra

- La referencia técnica actual es el repositorio `sysflow7/mi-primera-plantilla-web`, rama `siden-template-candidate-2026-10`.
- MINI debe reconocerse mediante una variante/configuración explícita; no se debe crear borrando manualmente secciones de una página compartida.
- Cada cliente necesita proyecto/repositorio, `config.json`, Worker y dominio/configuración propios.
- Reutilizar código no significa compartir Worker o configuración entre clientes.
- No cambiar componentes compartidos de WEB para una necesidad exclusiva de MINI sin analizar impacto.

## 3. Componentes previstos

Nombre y logo si están disponibles; presentación breve; servicios acordados; teléfono/WhatsApp; enlaces a redes; llamada a la acción; pie de página; diseño adaptable; SEO básico, hosting y SSL conforme al plan contratado.

## 4. Exclusiones por defecto

- Mapa embebido.
- Catálogo de productos.
- Galería extensa.
- Sitio multipágina.
- Formularios avanzados.
- Módulos especiales de WEB no incluidos expresamente en el alcance.

Una dirección escrita o un enlace externo para llegar no equivale a un mapa embebido. Las inclusiones finales se rigen por la ficha comercial vigente.

## 5. Reglas técnicas

- Usar variante/configuración explícita para reconocer MINI.
- Mantener datos y recursos del cliente dentro de su proyecto.
- Validar enlaces externos y ocultar destinos inválidos.
- Los elementos opcionales sin imagen o destino no deben dejar huecos ni controles rotos.
- Mantener `indexable: false` durante pruebas; activar indexación tras aprobación.
- Si se modifica código compartido, probar la función afectada y una instancia WEB representativa.

## 6. Flujo

1. Confirmar ficha comercial y límites exactos.
2. Confirmar versión de plantilla aprobada y registrar commit.
3. Crear/configurar proyecto y Worker independientes.
4. Implementar variante sin eliminar manualmente secciones compartidas.
5. Probar presentación, enlaces, responsive, recursos opcionales, SEO y exclusiones.
6. Registrar resultados y aprobar antes de producción.

## 7. Decisiones comerciales por confirmar

Cantidad máxima de servicios/fotografías; guardar o compartir contacto; límites de cambios y mantenimiento; dominio, duración y renovación; relación comercial con SIDeN LOCAL y SIDeN WEB.

## 8. Limitación

Antes de ofrecer MINI como producto activo, verificar variante implementada, versión técnica aprobada, ficha comercial y pruebas correspondientes.
