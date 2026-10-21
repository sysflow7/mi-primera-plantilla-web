# SIDeN V1.5 — Lista de control para candidata de lanzamiento

**Fecha:** 21 de octubre de 2026  
**Estado:** preparación pendiente; NO es autorización de despliegue.  
**Rama de referencia:** `prueba-aislamiento-contenido-v1.5`  
**Producción protegida:** `siden-corporativo-v1.3` / Worker `siden-corporativo` / dominio `sidenred.com`.

## Propósito

Definir los controles que deben cumplirse antes de declarar SIDeN V1.5 como plantilla maestra oficial para crear nuevos proyectos. La rama de certificación conserva una configuración ficticia usada en las pruebas y está vinculada al Worker de pruebas existente. Por tanto, no debe convertirse directamente en plantilla de lanzamiento ni cambiarse su configuración de prueba.

## Controles ya confirmados

- [x] Navegación multipágina y carga directa/actualización de rutas principales verificadas por el usuario en Preview.
- [x] Ruta inexistente devuelve HTTP 404.
- [x] Métodos HTTP no permitidos devuelven HTTP 405.
- [x] Sitemap XML válido cuando `indexable:false`.
- [x] Enlaces externos inválidos/no HTTPS excluidos de los datos estructurados y enlaces de prueba inválidos retirados.
- [x] Enlaces sociales/catálogo válidos comprobados en Preview.
- [x] Módulos `proceso`, `identidad` y `filosofia` renderizan contenido configurable.
- [x] Tarjetas de producto sin imagen no muestran imagen rota.
- [x] Marcadores de logo, hero y favicon no generan los errores previamente observados.
- [x] Familia corporativa de cliente: planes comerciales ocultos y FAQ condicionada por módulos/configuración.
- [x] Familia comercial: secciones comerciales, planes y FAQ visibles según configuración; comprobado por el usuario.
- [x] Configuración de prueba restaurada a familia corporativa, estado cliente e `indexable:false`.
- [x] Verificaciones estáticas de sintaxis reportadas como correctas para los archivos principales.

## Controles pendientes antes de declarar una candidata oficial

### A. Preparación aislada de la candidata
- [ ] Crear una rama candidata separada; no sobrescribir la rama de certificación activa.
- [ ] Preparar `config.json` genérico sin nombre, teléfono, catálogo, dominio ni datos ficticios de prueba.
- [ ] Mantener `indexable:false` por defecto hasta aprobación explícita del cliente para indexación.
- [ ] Definir una política de nombres de Worker que no pueda confundirse con el Worker de producción ni con el Worker de certificación.
- [ ] Revisar `.assetsignore` y confirmar qué archivos se publican como assets.
- [ ] Confirmar la política de aliases de Preview y documentar cuándo se agregan y retiran.

### B. GitHub y Cloudflare
- [ ] Inspeccionar la rama predeterminada actual de GitHub y los disparadores de despliegue configurados en Cloudflare.
- [ ] Confirmar qué rama está conectada a cada Worker y qué eventos disparan despliegues.
- [ ] No cambiar la rama predeterminada del repositorio, rama de producción de Cloudflare, bindings, Worker ni dominio sin autorización explícita.
- [ ] Desplegar la candidata únicamente en un Worker de pruebas separado y con una rama de Preview identificada.
- [ ] Registrar commit, rama, Worker y URL de Preview usados para certificar la candidata.

### C. Certificación final
- [ ] Revisar que la configuración genérica no incluya credenciales ni datos de clientes.
- [ ] Probar una instancia corporativa y una comercial con configuraciones separadas; no repetir las pruebas funcionales ya marcadas como confirmadas salvo que cambie el código relevante.
- [ ] Confirmar comportamiento con recursos reales (imágenes/logotipo) en al menos una instancia de prueba.
- [ ] Validar GA4 solo con un Measurement ID de prueba válido y confirmar que no se envían eventos cuando no hay ID configurado.
- [ ] Verificar SEO/indexación con `indexable:false` y el proceso explícito para habilitar indexación.
- [ ] Revisar el alcance comercial y técnico de SIDeN MINI antes de certificarlo o venderlo como implementación verificada.
- [ ] Actualizar documentación Markdown y entregar el paquete final de documentos Word.
- [ ] Obtener aprobación explícita antes de convertir la candidata en rama oficial o hacer cambios de producción.

## Criterio de salida

La candidata solo puede declararse **lista para nuevos proyectos** cuando los controles aplicables estén completados, la documentación corresponda al código certificado y se haya confirmado la conexión de GitHub/Cloudflare sin afectar producción. La certificación funcional actual no equivale a una auditoría de seguridad completa ni autoriza publicación en producción.

## Estado de producción

No se ha autorizado ni realizado como parte de esta lista ningún merge o despliegue a `siden-corporativo-v1.3`, al Worker `siden-corporativo` o al dominio `sidenred.com`.
