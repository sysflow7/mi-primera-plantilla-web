# SIDeN MINI — Arquitectura y alcance V1.0

**Estado:** definición funcional inicial, no certificada ni confirmada como implementación en la arquitectura independiente SIDeN V1.5. Requiere contrastar con la oferta comercial vigente antes de usar como contrato.  
**Principio:** SIDeN MINI es una variante de alcance reducido y controlado, no una copia improvisada de una web completa con secciones borradas manualmente.

## 1. Objetivo

Ofrecer una presencia digital compacta para negocios pequeños, conservando identidad, información esencial y contacto directo sin cargar funcionalidades propias de SIDeN WEB.

## 2. Componentes previstos

- Encabezado con nombre/logo.
- Presentación breve del negocio.
- Lista breve de servicios: objetivo de 3–4 como máximo.
- Información básica de contacto.
- Botón de WhatsApp.
- Enlaces a redes sociales configuradas.
- Llamada final a la acción y pie de página.
- Diseño adaptable a móvil y escritorio.
- Metadatos SEO básicos y SSL/hosting según el paquete contratado.

Estos componentes constituyen la propuesta de alcance MINI; antes de codificar debe comprobarse cuáles existen ya en la base de plantilla y cuáles requieren un modo explícito.

## 3. Exclusiones iniciales

Salvo aprobación explícita como ampliación de alcance, MINI no incluye:
- mapa embebido;
- catálogo de productos;
- galería extensa;
- testimonios o reseñas avanzadas;
- menú complejo;
- múltiples páginas;
- formularios avanzados;
- personalización profunda de módulos;
- componentes adicionales propios de SIDeN WEB.

La ubicación textual o un enlace externo de cómo llegar no equivalen a un mapa embebido. El mapa embebido no forma parte de SIDeN MINI.

## 4. Relación con SIDeN WEB

- SIDeN WEB puede incluir componentes más amplios y modalidades multipágina según plan.
- MINI debe mantener un conjunto explícito de módulos habilitados y límites cuantitativos.
- No agregar componentes de WEB a MINI solo porque estén disponibles en la plantilla compartida.
- Si se reutiliza código común, la activación debe depender de una variante/configuración definida, no de borrar HTML o CSS manualmente por cliente.

## 5. Regla de aislamiento y cambios

No modificar un componente compartido para satisfacer una necesidad exclusiva de un cliente MINI si ello puede alterar sitios WEB u otros MINI. Antes de tocar código:
1. localizar el componente y sus consumidores;
2. determinar si el comportamiento es común o específico de MINI;
3. preferir un modo/flag explícito o módulo separado;
4. si el cambio no puede aislarse con seguridad, proponer una versión controlada y no alterar la plantilla compartida;
5. probar una instancia MINI y una instancia WEB representativa cuando se cambie lógica compartida.

## 6. Datos de configuración

La configuración de MINI debe identificar claramente la variante y sus módulos. Los campos no usados deben permanecer ausentes o vacíos de forma consistente; la interfaz no debe mostrar espacios, iconos rotos ni botones sin destino. URLs externas deben validarse antes de crear enlaces activos.

## 7. Pruebas mínimas antes de entregar

- presentación en móvil y escritorio;
- nombre/logo y textos;
- botón de WhatsApp;
- redes sociales válidas y ocultamiento de enlaces inválidos;
- ausencia de mapa embebido, catálogo y secciones excluidas;
- comportamiento cuando no hay logo, imagen o enlace opcional;
- metadatos, canonical, robots y sitemap según el dominio;
- ausencia de contenido de demo o de otro cliente;
- revisión de que el cambio no alteró una instancia WEB de referencia si se modificó código compartido.

## 8. Estado de implementación

Este documento define el alcance esperado; no afirma que exista ya una implementación MINI certificada en la arquitectura independiente actual. Antes de vender o desplegar una versión MINI basada en el nuevo modelo, identificar la rama/código aprobado y ejecutar las pruebas de esta lista.

## 9. Decisiones que deben quedar congeladas antes de la implementación

- número máximo definitivo de servicios;
- presencia exacta de teléfono, email y redes;
- si se incluye guardado/compartido de contacto;
- límites de imágenes;
- dominios incluidos y política de renovación;
- límites de cambios y mantenimiento;
- relación entre MINI y SIDeN LOCAL;
- modo técnico que activa MINI y mecanismo de certificación.

No resolver estas decisiones por inferencia durante la programación; reflejarlas en la ficha comercial y en la configuración de la variante.


## 10. Vigencia y relación con la arquitectura independiente — 21-10-2026

Este documento define alcance propuesto y controles, pero no demuestra que exista una instancia MINI funcional en el modelo independiente V1.5. No ofrecer ni desplegar MINI desde la arquitectura nueva hasta que se confirme el diseño técnico de activación, se compare el alcance con la oferta comercial vigente y se ejecute una prueba en Preview. Las reglas generales de aislamiento y cambios compartidos de `ARQUITECTURA_MAESTRA_V1.5.md` y `PROCEDIMIENTO_CREACION_PROYECTO_CLIENTE_V1.1.md` siguen aplicando.
