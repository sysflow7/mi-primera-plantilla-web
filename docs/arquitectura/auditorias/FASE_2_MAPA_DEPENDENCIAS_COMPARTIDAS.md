# SIDeN — Auditoría estática de dependencias compartidas (Fase 2)

Fecha: 2026-10-13. Base: rama siden-corporativo-v1.3. Tipo: inspección estática; no equivale a certificación runtime.

## Archivos revisados
- worker.js — SHA d03fafccc123bd34a61d5f078afa6a09bfcc10a3
- index.html — SHA ee520ac17274a5fcc32c5dc070fa432c9520bb12
- js/script.js — SHA 56f13323a67721b4b6a4a2d695a09f06d47d985b
- js/modules-v1.4.js — SHA 9b67379929dce3534c47ade5dcb93c02141ebed1
- css/redesign-v2.css — SHA a1ee7f38f68e9763582ee043113a5a9bf45eaaa1
- css/redesign-v3.css — SHA 3e9d3c00a89a98486481341aacaadad911489f76
- css/hero-speed.css — SHA b17e67c7c8962151dfff630a4c465feb530f0e45
- sites/corporativo/config.json y custom.css
- sites/drcarlosreyes/config.json y custom.css
- sites/fisiokinesv/config.json y custom.css

## Hallazgos por riesgo

### CRÍTICO — worker.js
El Worker resuelve la instancia, carga config.json, valida instanceId, sirve custom.css, procesa rutas multipágina, conserva el contexto ?site= para Preview e inyecta el enlace al CSS de instancia y la configuración runtime. Un cambio puede afectar routing, assets, SEO y aislamiento de todas las instancias.

### ALTO — index.html
La plantilla común carga css/style.css y css/redesign-v2.css. Esta última importa redesign-v3.css y hero-speed.css. El HTML define los IDs/clases que consumen el JS y los CSS particulares; renombrar o mover elementos puede romper varias instancias sin cambiar sus archivos.

### ALTO — CSS compartido
redesign-v2.css incluye selectores generales, reglas responsive y varias declaraciones !important que afectan hero, servicios, galería, acciones de contacto y grillas. Una corrección visual global puede propagarse a COMMERCIAL y CORPORATE. Los cambios exclusivos deben evaluarse primero para custom.css de la instancia o reglas acotadas por familia.

### ALTO — js/modules-v1.4.js
El archivo contiene lógica/estilos condicionados por templateFamily, pero también inserta estilos dinámicos generales para servicios, imágenes y lightbox. No se debe considerar todo el archivo aislado por familia; revisar regla por regla.

### ALTO — js/script.js
Gestiona GA4, la exclusión de Preview mediante ?site=, módulos visibles, clases de familia, ordenSecciones y navegación multipágina. Los cambios a contratos de configuración, módulos o rutas requieren regresión transversal.

### MEDIO/ALTO — custom.css por instancia
El mecanismo está implementado en el Worker. sites/corporativo/custom.css está referenciado pero contiene solo un comentario; Dr. Carlos Reyes tiene CSS particular amplio y FISIOKINESV tiene estilos propios más acotados. Estos estilos particulares dependen de IDs/clases del DOM compartido.

## Conclusiones de auditoría
1. El CSS por instancia existe, pero debe certificarse en Cloudflare Preview: carga, status/MIME, query ?site=, ausencia de 404 y aislamiento.
2. SIDeN es la línea base COMMERCIAL. Dr. Carlos Reyes y FISIOKINESV son candidatos útiles para regresión CORPORATE por sus estilos particulares.
3. La configuración inspeccionada de Dr. Carlos Reyes está en modo single y con indexable false; no debe tratarse como la configuración final de producción del cliente sin confirmar rama/commit actual.
4. La inspección estática no certifica el navegador ni el despliegue actual. La validación runtime permanece pendiente.

## Matriz mínima de regresión
- Cambios de Worker/routing/assets/Preview: SIDeN COMMERCIAL, al menos una instancia CORPORATE y una instancia multipágina cuando corresponda. Probar host, instanceId, config, CSS, imágenes, SEO, rutas y aislamiento.
- Cambios de CSS compartido o HTML: SIDeN, Dr. Carlos Reyes y FISIOKINESV. Probar desktop/móvil, módulos, navegación, overflow y consola.
- Cambios de JS/módulos: COMMERCIAL, CORPORATE demo/cliente, single y multi cuando aplique. Probar visibilidad, navegación, GA4/Preview y consola.

## Pendientes
- [ ] Certificar custom.css y assets en Preview con al menos dos instancias.
- [ ] Revisar CSS compartido y estilos dinámicos regla por regla.
- [ ] Verificar GA4 en Preview y eventos.
- [ ] Confirmar configuración multipágina final de Dr. Carlos Reyes antes de la prueba definitiva.
- [ ] Ejecutar regresión visual/funcional y registrar evidencia.
- [ ] Actualizar fichas con dependencias comprobadas y fecha de certificación.

No se recomienda modificar código de ejecución durante esta fase de documentación. Completar las pruebas pendientes y clasificar los hallazgos antes de decidir cambios.

## 7. Comparación preliminar COMMERCIAL vs CORPORATE

- COMMERCIAL se identifica mediante siden.templateFamily = commercial. js/modules-v1.4.js añade elementos comerciales al hero y navegación, oculta la sección de presentación y aplica la clase siden-commercial-hero. La lógica de planes y FAQ conserva el comportamiento comercial.
- CORPORATE se identifica mediante siden.templateFamily = corporate. Los estilos dinámicos ocultan contenido exclusivo de COMMERCIAL; js/script.js usa estadoComercial para controlar planes SIDeN y FAQ. Si estadoComercial falta o no es demo, el comportamiento conservador oculta planes y FAQ genérica; la FAQ de negocio exige activación explícita y contenido válido.
- templateFamily y estadoComercial son propiedades distintas. No se deben usar como sustitutos entre sí. La prueba de regresión debe incluir COMMERCIAL, CORPORATE demo, CORPORATE cliente con FAQ propia activa y CORPORATE cliente sin FAQ propia.

## 8. Hallazgo puntual para verificar — imagen Hero en CORPORATE

js/script.js establece hero-imagen-negocio.hidden = true y elimina src cuando mostrarHeroImagen no está activo o no existe nombreHeroVisual. Sin embargo, js/modules-v1.4.js inyecta la regla `body.siden-template-corporate .hero-visual #hero-imagen-negocio { display:block!important }`. css/style.css también define `[hidden] { display:none!important }`, pero el selector corporativo contiene un ID y mayor especificidad, por lo que podría imponerse en la cascada aunque la imagen tenga atributo hidden. Esto es un **riesgo potencial, no una falla runtime confirmada**.

Prueba requerida: en una instancia CORPORATE temporal de Preview, probar mostrarHeroImagen=true con imagen válida y mostrarHeroImagen=false/sin imagen; verificar que no aparezca imagen rota ni espacio residual. No cambiar código durante la auditoría; si se reproduce, corregirlo de forma acotada y certificar COMMERCIAL y CORPORATE antes de integrar.

## 9. Próxima fase

La siguiente fase es la certificación runtime en Cloudflare Preview: custom.css, assets, imagen Hero opcional, GA4/Preview, navegación y regresión visual/funcional. La inspección web pública directa no se pudo completar en esta ejecución, por lo que no se declara verificado el comportamiento live.