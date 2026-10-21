# SIDeN — Procedimiento de creación de proyecto de cliente V1.0

**Estado:** procedimiento operativo inicial.  
**Base:** arquitectura independiente; plantilla de referencia V1.5.  
**Producción:** requiere autorización explícita para cualquier publicación.

## 1. Propósito

Crear un sitio de cliente con aislamiento propio, sin modificar la plantilla maestra, otros clientes ni producción durante la preparación.

## 2. Datos que deben definirse antes de iniciar

- Nombre comercial/profesional y contacto responsable.
- Plan contratado: Esencial, Impulso o Profesional, o modalidad SIDeN MINI si aplica.
- Familia de plantilla y modalidad de sitio: una página o multipágina.
- Objetivos, público, servicios/productos y llamadas a la acción.
- Logo, fotografías y derechos de uso.
- Teléfono/WhatsApp, redes sociales, ubicación y catálogo, si aplica.
- Indexación: activada solo después de revisar el sitio y autorizar su publicación.
- Identificador del proyecto, dominio previsto y nombre del Worker.
- ID de GA4 propio del cliente, si se ha contratado/configurado analítica.

No inventar datos del cliente; los campos desconocidos deben permanecer pendientes o claramente marcados como datos de prueba.

## 3. Preparación del repositorio

1. Confirmar cuál es la rama de plantilla aprobada para nuevos proyectos.
2. Crear un repositorio independiente a partir de esa base aprobada.
3. No reutilizar el repositorio de otro cliente como destino de personalizaciones.
4. Verificar que el repositorio tenga la estructura necesaria: `index.html`, `config.json`, `worker.js`, `wrangler.jsonc`, `css/`, `js/`, exclusiones y documentación.
5. Confirmar que el Worker y los assets están configurados para este proyecto.
6. Registrar rama base, commit de origen y fecha.

## 4. Configuración inicial

- Configurar `config.json` con identidad y contenido del cliente.
- Definir `templateFamily`, `modoSitio`, páginas y módulos.
- Revisar que cada ruta multipágina sea única y empiece con `/`.
- Revisar los módulos permitidos por ruta.
- Validar enlaces externos: solo HTTPS para campos que lo requieran.
- Confirmar que no queden URLs, teléfonos, imágenes o textos ficticios.
- Mantener `indexable: false` durante la construcción y validación.
- No incluir secretos ni credenciales en la configuración pública.

## 5. Contenido y activos

- Usar nombres de archivo claros y rutas coherentes.
- Confirmar que todas las imágenes referenciadas existen y cargan.
- Si un elemento visual es opcional, debe ocultarse correctamente cuando no se proporciona.
- Revisar textos, tildes, teléfonos, enlaces de WhatsApp, redes y catálogo.
- En sitios multipágina, comprobar contenido y navegación de cada ruta.
- Las preguntas frecuentes de un sitio de cliente deben corresponder al cliente; no incluir preguntas o planes comerciales de SIDeN salvo que la página sea una demo comercial.

## 6. Revisión de componentes compartidos

Antes de cualquier modificación de HTML/CSS/JS/Worker:
1. identificar si afecta a todas las páginas o solo a una instancia;
2. revisar consumidores y dependencias;
3. evitar editar componentes globales para resolver una necesidad local;
4. si puede afectar a sitios existentes, detener el cambio y proponer una variante aislada o nueva versión;
5. dejar registro de la decisión.

## 7. Despliegue en Preview

1. Conectar el repositorio del cliente al Worker de pruebas correspondiente.
2. Confirmar explícitamente repositorio, rama y nombre del Worker.
3. No seleccionar ni alterar el Worker de producción de SIDeN ni el de otro cliente.
4. Ejecutar despliegue y revisar el log hasta confirmar éxito.
5. Probar en Preview las páginas, recursos y enlaces del proyecto.
6. Corregir errores en la rama del cliente y repetir solo las pruebas afectadas.

## 8. Lista de verificación de aceptación

- [ ] Home carga sin errores visibles.
- [ ] Navegación y menú funcionan.
- [ ] Cada ruta multipágina abre y se recarga directamente.
- [ ] Rutas inexistentes responden 404.
- [ ] Módulos aparecen solo en las páginas configuradas.
- [ ] Logo e imágenes cargan; las imágenes opcionales vacías no producen iconos rotos.
- [ ] WhatsApp, teléfono, redes, ubicación y catálogo corresponden al cliente.
- [ ] Enlaces inseguros no quedan activos.
- [ ] Formularios/botones visibles funcionan o se ocultan si no están configurados.
- [ ] No aparecen planes/FAQ comerciales de SIDeN en una web de cliente.
- [ ] SEO, canonical, robots y sitemap corresponden al host y a la indexabilidad elegida.
- [ ] GA4 no registra tráfico de Preview.
- [ ] No hay datos ficticios ni referencias a otro cliente.
- [ ] Se revisa el log del despliegue.
- [ ] Cliente/representante aprueba contenido y presentación, cuando corresponda.

## 9. Paso a producción

La publicación no es automática al aprobar Preview. Antes de producción:
1. registrar aprobación interna y, cuando corresponda, del cliente;
2. fijar la versión/commit que se va a publicar;
3. configurar dominio y TLS;
4. decidir cuándo activar indexación;
5. publicar únicamente en el Worker del cliente;
6. hacer comprobación posterior al despliegue;
7. registrar versión, fecha, responsable y resultado.

No migrar ni modificar `sidenred.com` como parte de la creación de un cliente.

## 10. Entrega y mantenimiento

- Documentar URLs, repositorio, rama de producción y Worker.
- Guardar lista de módulos, integraciones, dominio e indexación.
- Registrar qué incluye el plan y qué queda fuera.
- Los cambios futuros se realizan en rama de trabajo, con revisión de impacto y pruebas de regresión.
- Las solicitudes que afectan elementos compartidos se escalan antes de editar.

## 11. Límites

Este procedimiento no sustituye el contrato comercial, el formulario de alta ni una auditoría de seguridad. Los requisitos específicos de cada plan deben contrastarse con la ficha comercial vigente antes de prometer funcionalidades.
