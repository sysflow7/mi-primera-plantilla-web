export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const host = url.hostname.toLowerCase();

        // Este Worker sirve un sitio estático de solo lectura mediante GET.
        if (request.method !== "GET") {
            return new Response("Método no permitido.", {
                status: 405,
                headers: { "Allow": "GET", "Cache-Control": "no-store", "Content-Type": "text/plain; charset=UTF-8" }
            });
        }

        const slugify = (value) => String(value || "").toLowerCase().trim()
            .replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

        // Bloqueo defensivo de rutas internas o de otros proyectos.
        // .assetsignore evita nuevas cargas; este filtro también protege frente a assets antiguos ya almacenados.
        let ruta;
        try {
            ruta = decodeURIComponent(url.pathname);
        } catch {
            return new Response("No encontrado", {
                status: 404,
                headers: { "Cache-Control": "no-store" }
            });
        }
        const rutasPrivadas = ["/sites", "/mini", "/docs", "/.git", "/.wrangler"];
        if (rutasPrivadas.some(prefijo => ruta === prefijo || ruta.startsWith(prefijo + "/")) ||
            ["/worker.js", "/wrangler.jsonc", "/README.md"].includes(ruta) ||
            ruta.toLowerCase().endsWith(".md")) {
            return new Response("No encontrado", { status: 404, headers: { "Cache-Control": "no-store" } });
        }

        // Arquitectura independiente: este Worker sirve exclusivamente este proyecto.
        const sitePrefix = "";
        const configPath = "/config.json";

        const loadAsset = async (pathname) => env.ASSETS.fetch(
            new Request(new URL(pathname, request.url), request)
        );

        const respuestaConfig = await loadAsset(configPath);
        if (!respuestaConfig.ok) return new Response("Sitio SIDeN no configurado.", { status: 404 });

        const negocio = await respuestaConfig.json();
        const configuredInstance = slugify(negocio.siden?.instanceId || "cliente-independiente");

        if (url.pathname === "/config.json") {
            return new Response(JSON.stringify(negocio), {
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    "Cache-Control": "public, max-age=300",
                    "Vary": "Host"
                }
            });
        }

        const rutaNormalizada = (ruta) => {
            const valor = String(ruta || "/");
            return valor === "/" ? "/" : "/" + valor.replace(/^\/+|\/+$/g, "");
        };

        // Rechazar configuraciones multipágina ambiguas antes de resolver rutas.
        const validarPaginas = (paginas) => {
            if (!Array.isArray(paginas) || paginas.length === 0) return null;
            const rutas = [];
            const vistas = new Set();
            for (const pagina of paginas) {
                if (!pagina || typeof pagina !== "object" || typeof pagina.ruta !== "string") return null;
                const original = pagina.ruta.trim();
                if (!original.startsWith("/") || original.startsWith("//") || original.includes("?") || original.includes("#") || original.includes("\\") || original.includes(" ")) return null;
                const segmentos = original.split("/");
                if (segmentos.some(segmento => segmento === "." || segmento === "..")) return null;
                const normalizada = rutaNormalizada(original);
                if (normalizada !== "/" && !normalizada.slice(1).split("/").every(segmento => /^[a-zA-Z0-9_-]+$/.test(segmento))) return null;
                if (vistas.has(normalizada)) return null;
                vistas.add(normalizada);
                rutas.push(normalizada);
            }
            return vistas.has("/") ? rutas : null;
        };

        const esModoMultipagina = negocio.modoSitio === "multi";
        const rutasValidadas = esModoMultipagina ? validarPaginas(negocio.paginas) : [];
        if (esModoMultipagina && !rutasValidadas) {
            return new Response("Configuración multipágina inválida.", {
                status: 500,
                headers: { "Content-Type": "text/plain; charset=UTF-8", "Cache-Control": "no-store" }
            });
        }
        const rutasMultipagina = rutasValidadas;
        const esRutaPagina = url.pathname === "/" || rutasMultipagina.includes(rutaNormalizada(url.pathname));

        // Aislamiento estricto de imágenes por instancia.
        if (request.method === "GET" && url.pathname.startsWith("/images/")) {
            return loadAsset(`${sitePrefix}${url.pathname}`);
        }

        if (url.pathname === "/robots.txt") {
            const contenido = "User-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: " + url.origin + "/sitemap.xml\n";
            return new Response(contenido, { headers: { "Content-Type": "text/plain; charset=UTF-8", "Cache-Control": "no-store", "Vary": "Host" } });
        }

        if (url.pathname === "/sitemap.xml") {
            // No incluir páginas marcadas como no indexables en el sitemap.
            const rutas = [];
            if (negocio.indexable !== false) {
                rutas.push("/");
                if (negocio.modoSitio === "multi" && Array.isArray(negocio.paginas)) {
                    negocio.paginas.forEach(pagina => {
                        const ruta = rutaNormalizada(pagina.ruta);
                        if (ruta !== "/" && !rutas.includes(ruta)) rutas.push(ruta);
                    });
                }
            }
            const contenido = '<?xml version="1.0" encoding="UTF-8"?>' +
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
                rutas.map(ruta => `<url><loc>${url.origin}${ruta}</loc></url>`).join("") + '</urlset>';
            return new Response(contenido, { headers: { "Content-Type": "application/xml; charset=UTF-8", "Cache-Control": "public, max-age=3600", "Vary": "Host" } });
        }

        if (request.method !== "GET" || !esRutaPagina) return env.ASSETS.fetch(request);

        const respuestaHTML = await loadAsset("/index.html");
        if (!respuestaHTML.ok) return respuestaHTML;
        let html = await respuestaHTML.text();

        // Aislamiento de contenido comercial: no entregar secciones de venta SIDeN a clientes corporativos.
        // Las demos corporativas y la plantilla comercial conservan estas secciones.
        const templateFamily = String(negocio.siden?.templateFamily || "corporate").toLowerCase();
        const estadoComercial = String(negocio.estadoComercial || "").trim().toLowerCase();
        const esClienteCorporativo = templateFamily === "corporate" && estadoComercial !== "demo";

        if (esClienteCorporativo) {
            html = html.replace(/<section\b(?=[^>]*\bid="(?:proyectos|problema|solucion|soluciones)")(?:"[^"]*"|'[^']*'|[^'">])*?>[\s\S]*?<\/section>/gi, "");
        }

        // Las preguntas se generan desde config.json por script.js; no dejar FAQ predeterminadas en el HTML.
        html = html.replace(/(<div\s+id="lista-faq"[^>]*>)[\s\S]*?(<\/div>)/i, "$1$2");

        if (esClienteCorporativo) {
            // Retirar marcas y textos promocionales de SIDeN del HTML entregado al cliente.
            html = html.replace(/<div class="hero-brand">[\s\S]*?<\/div>/i, "");
            html = html.replace(/<footer><div class="footer-inner"><div>[\s\S]*?<\/div><span>/i, '<footer><div class="footer-inner"><span>');
            html = html.replace("Da el siguiente paso", "Contáctanos");
            html = html.replace("¿Listo para mejorar la presencia digital de tu negocio?", "¿Cómo podemos ayudarte?");
            html = html.replace("Conoce cómo SIDeN puede ayudarte a presentar tu negocio de forma profesional, visible y fácil de contactar.", "Comunícate con nosotros para recibir más información.");
            html = html.replace("💬 Quiero hablar sobre mi página", "💬 Contáctanos por WhatsApp");
        }

        const paginaActual = negocio.modoSitio === "multi" && Array.isArray(negocio.paginas)
            ? negocio.paginas.find(pagina => rutaNormalizada(pagina.ruta) === rutaNormalizada(url.pathname)) : null;

        // Renderizado inicial del contenido textual esencial: los buscadores reciben contenido
        // útil en el HTML sin depender de ejecutar JavaScript. script.js conserva el renderizado
        // interactivo y reconstruye estas mismas listas al iniciar.
        const contenidoPagina = paginaActual ? {
            ...negocio,
            ...paginaActual,
            etiquetas: { ...(negocio.etiquetas || {}), ...(paginaActual.etiquetas || {}) },
            textos: { ...(negocio.textos || {}), ...(paginaActual.textos || {}) }
        } : negocio;
        const modulosIniciales = Array.isArray(contenidoPagina.modulos) ? contenidoPagina.modulos : [];
        const escaparHTML = valor => String(valor ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        const reemplazarContenido = (id, contenido) => {
            const patron = new RegExp('(<(?:div|p|h1|h2|h3|span)\\b(?=[^>]*\\bid="' + id + '")[^>]*>)[\\s\\S]*?(<\\/(?:div|p|h1|h2|h3|span)>)', "i");
            html = html.replace(patron, (coincidencia, apertura, cierre) => apertura + contenido + cierre);
        };
        const renderizarTarjetas = (id, clase, elementos, construirContenido) => {
            if (!Array.isArray(elementos)) return;
            const contenido = elementos.map((elemento, indice) =>
                '<div class="' + clase + '">' + construirContenido(elemento || {}, indice) + '</div>'
            ).join("");
            reemplazarContenido(id, contenido);
        };
        const visibilidadModulo = (modulo, visible) => {
            const ids = { presentacion: "nosotros", perfil: "perfil", beneficios: "beneficios",
                servicios: "servicios", proceso: "proceso", identidad: "identidad", filosofia: "filosofia",
                productos: "productos", menu: "menu", galeria: "galeria", ubicacion: "ubicacion",
                contacto: "contacto", faq: "faq", "resenas-google": "resenas-google" };
            const id = ids[modulo];
            if (!id) return;
            const patron = new RegExp('<section\\b(?=[^>]*\\bid="' + id + '")([^>]*)>', "i");
            html = html.replace(patron, (apertura, atributos) => {
                const limpios = atributos.replace(/\\s+hidden(?:="[^"]*")?/gi, "");
                return "<section" + limpios + (visible ? "" : " hidden") + ">";
            });
        };

        const textoPresentacionInicial = contenidoPagina.presentacion?.texto || contenidoPagina.descripcion || "";
        reemplazarContenido("descripcion-negocio", escaparHTML(textoPresentacionInicial));
        reemplazarContenido("descripcion-perfil", escaparHTML(contenidoPagina.perfil?.descripcion || contenidoPagina.descripcion || ""));
        reemplazarContenido("contenido-identidad", escaparHTML(contenidoPagina.identidad?.texto || contenidoPagina.identidad?.descripcion || ""));
        reemplazarContenido("contenido-filosofia", escaparHTML(contenidoPagina.filosofia?.texto || contenidoPagina.filosofia?.descripcion || ""));
        renderizarTarjetas("lista-servicios", "service", contenidoPagina.servicios,
            item => "<h3>" + escaparHTML(item.nombre) + "</h3><p>" + escaparHTML(item.descripcion) + "</p>");
        renderizarTarjetas("lista-beneficios", "benefit", contenidoPagina.beneficios,
            item => "<h3>" + escaparHTML(item.titulo) + "</h3><p>" + escaparHTML(item.descripcion) + "</p>");
        renderizarTarjetas("lista-proceso", "service", contenidoPagina.proceso,
            (item, indice) => "<h3>" + escaparHTML(item.titulo || item.nombre || ("Paso " + (indice + 1))) +
                "</h3><p>" + escaparHTML(item.descripcion || item.detalle || "") + "</p>");
        renderizarTarjetas("lista-productos", "product", contenidoPagina.productos,
            item => "<div class=\"product-content\"><h3>" + escaparHTML(item.nombre) + "</h3><p>" +
                escaparHTML(item.descripcion) + "</p>" + (item.precio ? "<strong>" + escaparHTML(item.precio) + "</strong>" : "") + "</div>");
        renderizarTarjetas("lista-menu", "menu-item", contenidoPagina.menu,
            item => "<div><h3>" + escaparHTML(item.nombre) + "</h3><p>" + escaparHTML(item.descripcion) +
                "</p>" + (item.precio ? "<strong>" + escaparHTML(item.precio) + "</strong>" : "") + "</div>");

        const faqInicial = contenidoPagina.faq && typeof contenidoPagina.faq === "object" ? contenidoPagina.faq : {};
        const preguntasIniciales = Array.isArray(faqInicial.preguntas) ? faqInicial.preguntas.filter(item =>
            item && String(item.pregunta || "").trim() && String(item.respuesta || "").trim()) : [];
        const faqVisibleInicial = faqInicial.activo === true && preguntasIniciales.length > 0 &&
            (contenidoPagina.modoSitio !== "multi" || modulosIniciales.includes("faq"));
        if (faqVisibleInicial) {
            const faqHTML = preguntasIniciales.slice(0, 6).map(item =>
                "<details><summary>" + escaparHTML(item.pregunta) + "</summary><p>" +
                escaparHTML(item.respuesta) + "</p></details>").join("");
            reemplazarContenido("lista-faq", faqHTML);
        } else {
            reemplazarContenido("lista-faq", "");
        }

        ["presentacion", "perfil", "beneficios", "servicios", "proceso", "identidad", "filosofia",
            "productos", "menu", "galeria", "ubicacion", "contacto"].forEach(modulo => {
            const visible = modulosIniciales.includes(modulo) &&
                (modulo !== "galeria" || (Array.isArray(contenidoPagina.galeria) && contenidoPagina.galeria.length > 0));
            visibilidadModulo(modulo, visible);
        });
        visibilidadModulo("faq", faqVisibleInicial);
        // Las reseñas se renderizan con lógica interactiva en el navegador; mantener el bloque
        // oculto en el HTML inicial para no entregar una sección vacía a rastreadores sin JS.
        visibilidadModulo("resenas-google", false);

        if (paginaActual && rutaNormalizada(url.pathname) !== "/") {
            reemplazarContenido("pagina-tipo", escaparHTML(negocio.etiquetaTipo || ""));
            reemplazarContenido("pagina-titulo", escaparHTML(paginaActual.nombre || paginaActual.h1 || ""));
            reemplazarContenido("pagina-descripcion", escaparHTML(paginaActual.descripcion || paginaActual.descripcionSEO || ""));
            html = html.replace(/(<section\b(?=[^>]*\bid="pagina-cabecera")[^>]*)\s+hidden(?:="[^"]*")?/i, "$1");
        }

        const tituloSEO = paginaActual?.tituloSEO || negocio.tituloSEO || negocio.seo?.titulo ||
            (paginaActual?.nombre ? `${paginaActual.nombre} | ${negocio.nombre}` : `${negocio.nombre}${negocio.ciudad ? " | " + negocio.ciudad : ""}`);
        const descripcionSEO = paginaActual?.descripcionSEO || negocio.descripcionSEO || negocio.seo?.descripcion ||
            paginaActual?.descripcion || negocio.descripcion || negocio.slogan || negocio.nombre;
        const h1Title = paginaActual?.h1 || paginaActual?.nombre || negocio.h1 || negocio.nombre;
        const h1Description = paginaActual?.slogan || negocio.slogan || paginaActual?.descripcion ||
            paginaActual?.descripcionSEO || negocio.descripcion || negocio.nombre;
        const canonical = url.origin + rutaNormalizada(url.pathname);
        const negocioId = url.origin + "/#negocio";
        const construirImagenURL = (archivo) => archivo
            ? new URL(sitePrefix + "/images/" + String(archivo).replace(/^\/+/, ""), url.origin + "/").href : "";
        const logoURL = construirImagenURL(negocio.logo);
        const imagenSocialURL = construirImagenURL(negocio.imagenSocial || negocio.logo);
        const indexable = negocio.indexable !== false;
        const direccion = negocio.direccion || {};
        const modeloAtencion = String(negocio.modeloAtencion || "local").toLowerCase();
        const esAreaServicio = modeloAtencion === "areaservicio" || modeloAtencion === "area-servicio";

        const schemaTypes = {
            comercio: "Store", hardwarestore: "HardwareStore", tienda: "Store", organizacion: "Organization", organization: "Organization",
            profesional: "ProfessionalService", abogado: "LegalService", medico: "Physician", médico: "Physician", contador: "ProfessionalService",
            arquitecto: "ProfessionalService", electricista: "Electrician", fotografo: "ProfessionalService", fotógrafo: "ProfessionalService",
            consultor: "ProfessionalService", psicologo: "Psychologist", psicólogo: "Psychologist", dentista: "Dentist", restaurante: "Restaurant", restaurant: "Restaurant"
        };
        const tipoClave = String(paginaActual?.tipoNegocio || negocio.tipoNegocio || "LocalBusiness").toLowerCase();
        const datosNegocio = { "@context": "https://schema.org", "@type": schemaTypes[tipoClave] || "LocalBusiness", "@id": negocioId,
            name: negocio.nombre,
            description: negocio.descripcionSEO || negocio.seo?.descripcion || negocio.descripcion || negocio.slogan || negocio.nombre,
            url: url.origin + "/", telephone: negocio.telefono, mainEntityOfPage: canonical };
        if (logoURL) datosNegocio.logo = logoURL;
        if (imagenSocialURL) datosNegocio.image = [imagenSocialURL];
        if (negocio.email) datosNegocio.email = negocio.email;

        const postalAddress = {};
        if (direccion.calle) postalAddress.streetAddress = direccion.calle;
        if (direccion.ciudad || negocio.ciudad) postalAddress.addressLocality = direccion.ciudad || negocio.ciudad;
        if (direccion.departamento) postalAddress.addressRegion = direccion.departamento;
        if (direccion.codigoPostal) postalAddress.postalCode = direccion.codigoPostal;
        if (direccion.pais) postalAddress.addressCountry = direccion.pais;
        if (Object.keys(postalAddress).length > 0 && !esAreaServicio) datosNegocio.address = { "@type": "PostalAddress", ...postalAddress };
        if (negocio.rangoPrecios) datosNegocio.priceRange = negocio.rangoPrecios;
        // Los datos estructurados solo incluyen URLs externas absolutas HTTPS.
        const urlHttpsValida = (valor) => {
            if (typeof valor !== "string" || !valor.trim()) return "";
            try {
                const externa = new URL(valor.trim());
                return externa.protocol === "https:" && externa.hostname ? externa.href : "";
            } catch {
                return "";
            }
        };
        const mapaSeguro = urlHttpsValida(negocio.maps);
        if (mapaSeguro) datosNegocio.hasMap = mapaSeguro;
        // Identidad social estructurada: usa redesSociales y conserva compatibilidad heredada.
        const redesConfig = negocio.redesSociales && typeof negocio.redesSociales === "object" ? negocio.redesSociales : {};
        const redes = [...new Set([
            redesConfig.facebook, redesConfig.linkedin, redesConfig.instagram,
            redesConfig.youtube, redesConfig.tiktok, redesConfig.twitter,
            negocio.facebook, negocio.instagram
        ].map(urlHttpsValida).filter(Boolean))];
        if (redes.length) datosNegocio.sameAs = redes;
        if (!esAreaServicio && direccion.latitud !== "" && direccion.latitud !== undefined && direccion.longitud !== "" && direccion.longitud !== undefined) {
            datosNegocio.geo = { "@type": "GeoCoordinates", latitude: Number(direccion.latitud), longitude: Number(direccion.longitud) };
        }
        if (Array.isArray(negocio.areasServicio) && negocio.areasServicio.length) {
            const areas = negocio.areasServicio.map(area => { const nombreArea = typeof area === "string" ? area : area?.nombre; return nombreArea ? { "@type": "Place", name: nombreArea } : null; }).filter(Boolean);
            if (areas.length) datosNegocio.areaServed = areas;
        }
        if (Array.isArray(negocio.horarios) && negocio.horarios.length) {
            const diasValidosSchema = new Set(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
            const diasSchemaPorNombre = {
                monday: "Monday", lunes: "Monday",
                tuesday: "Tuesday", martes: "Tuesday",
                wednesday: "Wednesday", miercoles: "Wednesday",
                thursday: "Thursday", jueves: "Thursday",
                friday: "Friday", viernes: "Friday",
                saturday: "Saturday", sabado: "Saturday",
                sunday: "Sunday", domingo: "Sunday"
            };
            const normalizarDiaSchema = dia => {
                const clave = String(dia || "").trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
                return diasSchemaPorNombre[clave] || "";
            };
            const especificacionesHorario = [];
            negocio.horarios.forEach(horario => {
                if (!horario || typeof horario !== "object") return;
                // Formato nuevo: acepta nombres en español o inglés y normaliza para Schema.org.
                if (horario.dia) {
                    const diaSchema = normalizarDiaSchema(horario.dia);
                    if (!diasValidosSchema.has(diaSchema)) return;
                    (Array.isArray(horario.intervalos) ? horario.intervalos : []).forEach(intervalo => {
                        if (intervalo?.abre && intervalo?.cierra) especificacionesHorario.push({
                            "@type": "OpeningHoursSpecification", dayOfWeek: diaSchema, opens: intervalo.abre, closes: intervalo.cierra
                        });
                    });
                    return;
                }
                // Compatibilidad con el formato anterior; también normaliza los días localizados.
                (Array.isArray(horario.dias) ? horario.dias : []).forEach(dia => {
                    const diaSchema = normalizarDiaSchema(dia);
                    if (diasValidosSchema.has(diaSchema) && horario.abre && horario.cierra) especificacionesHorario.push({
                        "@type": "OpeningHoursSpecification", dayOfWeek: diaSchema, opens: horario.abre, closes: horario.cierra
                    });
                });
            });
            if (especificacionesHorario.length) datosNegocio.openingHoursSpecification = especificacionesHorario;
        }

        const escHtml = valor => String(valor ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        const escJson = valor => JSON.stringify(valor).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
        const ciudad = direccion.ciudad || negocio.ciudad || "";
        const ciudadVisible = esAreaServicio ? (Array.isArray(negocio.areasServicio) && negocio.areasServicio.length ? negocio.areasServicio.map(area => typeof area === "string" ? area : area?.nombre).filter(Boolean).join(", ") : negocio.pais || "Área de servicio") : ciudad;
        const direccionTexto = esAreaServicio ? "" : (negocio.direccionTexto || direccion.calle || ciudad || "");
        const tituloUbicacion = negocio.etiquetas?.ubicacion || (esAreaServicio ? "Área de servicio" : "Encuéntranos");

        const reemplazos = {
            "__SEO_TITLE__": escHtml(tituloSEO), "__SEO_DESCRIPTION__": escHtml(descripcionSEO), "__ROBOTS__": indexable ? "index, follow" : "noindex, nofollow",
            "__BUSINESS_NAME__": escHtml(negocio.nombre), "__BUSINESS_TYPE__": escHtml(negocio.etiquetaTipo || ""), "__H1_TITLE__": escHtml(h1Title),
            "__H1_DESCRIPTION__": escHtml(h1Description), "__BUSINESS_DESCRIPTION__": escHtml(negocio.descripcion || descripcionSEO), "__LOCATION_TITLE__": escHtml(tituloUbicacion),
            "__CITY__": escHtml(ciudadVisible), "__ADDRESS__": escHtml(direccionTexto), "__PHONE__": escHtml(negocio.telefono || ""), "__CANONICAL_URL__": escHtml(canonical),
            "__FAVICON_URL__": escHtml(logoURL), "__SOCIAL_IMAGE_URL__": escHtml(imagenSocialURL), "__STRUCTURED_DATA__": escJson(datosNegocio)
        };
        Object.entries(reemplazos).forEach(([marcador, valor]) => { html = html.split(marcador).join(valor); });

        // Evitar solicitudes 404 a marcadores de plantilla cuando la instancia no configura imágenes.
        if (!logoURL) {
            html = html.replace(/\s+src="__LOGO_IMAGE_URL__"/g, "");
        } else {
            html = html.replaceAll("__LOGO_IMAGE_URL__", escHtml(logoURL));
        }
        const heroBackgroundName = negocio.heroImagenFondo || negocio.heroImagen || "";
        if (heroBackgroundName) {
            const heroBackgroundURL = construirImagenURL(heroBackgroundName);
            html = html.replaceAll("__HERO_BACKGROUND_URL__", escHtml(heroBackgroundURL));
        } else {
            html = html.replace(/\s+style="--hero-image:url\('__HERO_BACKGROUND_URL__'\);"/, "");
        }
        // El iframe se configura exclusivamente desde mapEmbedUrl validado por script.js.
        html = html.replace(/\s+src="__MAP_EMBED_URL__"/, "");

        const runtimeConfig = { ...negocio, siden: { ...(negocio.siden || {}), instanceId: configuredInstance, host, canonicalOrigin: url.origin, assetPrefix: sitePrefix } };
        html = html.replace("</head>", `<script>window.__SIDEN_CONFIG__=${escJson(runtimeConfig)};</script></head>`);
        if (!logoURL) {
            // Favicon SVG integrado como alternativa; evita la solicitud automática a /favicon.ico.
            const faviconPredeterminado = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%232563eb'/%3E%3Ctext x='32' y='45' font-size='42' text-anchor='middle' fill='white' font-family='Arial,sans-serif'%3ES%3C/text%3E%3C/svg%3E";
            html = html.replace(/<link rel="icon" type="image\/png" href="">/i, '<link rel="icon" type="image/svg+xml" href="' + faviconPredeterminado + '">');
        }
        if (!imagenSocialURL) {
            html = html.replace(/\s*<meta property="og:image" content="">/i, "");
            html = html.replace(/\s*<meta property="og:image:alt" content="[^"]*">/i, "");
            html = html.replace(/\s*<meta name="twitter:image" content="">/i, "");
        }
        if (paginaActual && rutaNormalizada(url.pathname) !== "/") {
            html = html.replace('<h1 id="nombre-negocio">' + escHtml(h1Title) + '</h1>', '<h2 id="nombre-negocio">' + escHtml(h1Title) + '</h2>');
        }

        return new Response(html, { status: respuestaHTML.status, headers: { "Content-Type": "text/html; charset=UTF-8", "Cache-Control": "no-store", "Vary": "Host", "X-Frame-Options": "DENY", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()" } });
    }
};
