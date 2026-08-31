export default {

    async fetch(request, env) {

        const url = new URL(request.url);

        // ================================================
        // CONFIGURACIÓN DEL NEGOCIO
        // ================================================

        const respuestaConfig = await env.ASSETS.fetch(
            new Request(new URL("/config.json", request.url))
        );

        if (!respuestaConfig.ok) {
            return new Response("No se pudo cargar la configuración del negocio.", {
                status: 500,
                headers: { "Content-Type": "text/plain; charset=UTF-8" }
            });
        }

        const negocio = await respuestaConfig.json();

        // ================================================
        // HELPERS
        // ================================================

        const rutaNormalizada = function (ruta) {
            const valor = String(ruta || "/");
            if (valor === "/") return "/";
            return "/" + valor.replace(/^\/+|\/+$/g, "");
        };

        const rutasMultipagina =
            negocio.modoSitio === "multi" && Array.isArray(negocio.paginas)
                ? negocio.paginas.map(function (pagina) {
                    return rutaNormalizada(pagina.ruta);
                })
                : [];

        const esRutaPagina =
            url.pathname === "/" || rutasMultipagina.includes(rutaNormalizada(url.pathname));

        // ================================================
        // ROBOTS.TXT
        // ================================================

        if (url.pathname === "/robots.txt") {
            const contenido =
                "User-agent: *\n" +
                "Allow: /\n" +
                "Sitemap: " + url.origin + "/sitemap.xml\n";

            return new Response(contenido, {
                headers: {
                    "Content-Type": "text/plain; charset=UTF-8",
                    "Cache-Control": "public, max-age=3600"
                }
            });
        }

        // ================================================
        // SITEMAP.XML
        // ================================================

        if (url.pathname === "/sitemap.xml") {
            const rutas = ["/"];

            if (negocio.modoSitio === "multi" && Array.isArray(negocio.paginas)) {
                negocio.paginas.forEach(function (pagina) {
                    const ruta = rutaNormalizada(pagina.ruta);
                    if (ruta !== "/" && !rutas.includes(ruta)) rutas.push(ruta);
                });
            }

            const contenido =
                '<?xml version="1.0" encoding="UTF-8"?>' +
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
                rutas.map(function (ruta) {
                    return '<url><loc>' + url.origin + ruta + '</loc></url>';
                }).join("") +
                '</urlset>';

            return new Response(contenido, {
                headers: {
                    "Content-Type": "application/xml; charset=UTF-8",
                    "Cache-Control": "public, max-age=3600"
                }
            });
        }

        // ================================================
        // PÁGINA PRINCIPAL Y RUTAS MULTIPÁGINA
        // ================================================

        if (request.method === "GET" && esRutaPagina) {

            const respuestaHTML = await env.ASSETS.fetch(
                new Request(new URL("/index.html", request.url))
            );

            if (!respuestaHTML.ok) return respuestaHTML;

            let html = await respuestaHTML.text();

            const paginaActual =
                negocio.modoSitio === "multi" && Array.isArray(negocio.paginas)
                    ? negocio.paginas.find(function (pagina) {
                        return rutaNormalizada(pagina.ruta) === rutaNormalizada(url.pathname);
                    })
                    : null;

            const tituloSEO =
                paginaActual?.tituloSEO ||
                negocio.tituloSEO ||
                negocio.seo?.titulo ||
                (paginaActual?.nombre ? paginaActual.nombre + " | " + negocio.nombre : negocio.nombre + " | " + negocio.ciudad);

            const descripcionSEO =
                paginaActual?.descripcionSEO ||
                negocio.descripcionSEO ||
                negocio.seo?.descripcion ||
                paginaActual?.descripcion ||
                negocio.descripcion ||
                negocio.slogan ||
                negocio.nombre;

            // Contenido SEO esencial disponible en el HTML inicial.
            const h1Title = paginaActual?.nombre || negocio.nombre;
            const h1Description =
                paginaActual?.descripcion ||
                paginaActual?.descripcionSEO ||
                negocio.descripcion ||
                negocio.slogan ||
                negocio.nombre;

            const canonical = url.origin + rutaNormalizada(url.pathname);
            // Identificador estable de la entidad: todas las páginas describen al mismo negocio.
            const negocioId = url.origin + "/#negocio";

            // Las imágenes son opcionales. No generar /images/ cuando no existe archivo.
            const construirImagenURL = function (archivo) {
                if (!archivo) return "";
                return new URL("images/" + String(archivo).replace(/^\/+/, ""), url.origin + "/").href;
            };

            const logoURL = construirImagenURL(negocio.logo);
            const imagenSocialURL = construirImagenURL(negocio.imagenSocial || negocio.logo);

            const indexable = negocio.indexable !== false;
            const direccion = negocio.direccion || {};
            const modeloAtencion = String(negocio.modeloAtencion || "local").toLowerCase();
            const esAreaServicio = modeloAtencion === "areaservicio" || modeloAtencion === "area-servicio";

            // Mapea los nombres comerciales de SIDEN a tipos válidos de Schema.org.
            const schemaTypes = {
                comercio: "Store",
                hardwarestore: "HardwareStore",
                tienda: "Store",
                profesional: "ProfessionalService",
                abogado: "LegalService",
                medico: "Physician",
                médico: "Physician",
                contador: "ProfessionalService",
                arquitecto: "ProfessionalService",
                electricista: "Electrician",
                fotografo: "ProfessionalService",
                fotógrafo: "ProfessionalService",
                consultor: "ProfessionalService",
                psicologo: "Psychologist",
                psicólogo: "Psychologist",
                dentista: "Dentist",
                restaurante: "Restaurant",
                restaurant: "Restaurant"
            };

            const tipoClave = String(
                paginaActual?.tipoNegocio || negocio.tipoNegocio || "LocalBusiness"
            ).toLowerCase();

            const tipoSchema = schemaTypes[tipoClave] || "LocalBusiness";

            const datosNegocio = {
                "@context": "https://schema.org",
                "@type": tipoSchema,
                "@id": negocioId,
                "name": negocio.nombre,
                "description": descripcionSEO,
                "url": canonical,
                "telephone": negocio.telefono
            };

            if (logoURL) datosNegocio.logo = logoURL;
            if (imagenSocialURL) datosNegocio.image = [imagenSocialURL];
            if (negocio.email) datosNegocio.email = negocio.email;

            const postalAddress = {};

            if (direccion.calle) postalAddress.streetAddress = direccion.calle;
            if (direccion.ciudad || negocio.ciudad) {
                postalAddress.addressLocality = direccion.ciudad || negocio.ciudad;
            }
            if (direccion.departamento) postalAddress.addressRegion = direccion.departamento;
            if (direccion.codigoPostal) postalAddress.postalCode = direccion.codigoPostal;
            if (direccion.pais) postalAddress.addressCountry = direccion.pais;

            // Un negocio de área de servicio sin local público no debe publicar address/geo.
            if (Object.keys(postalAddress).length > 0 && !esAreaServicio) {
                datosNegocio.address = {
                    "@type": "PostalAddress",
                    ...postalAddress
                };
            }

            if (negocio.rangoPrecios) datosNegocio.priceRange = negocio.rangoPrecios;

            if (negocio.maps && negocio.maps.startsWith("http")) {
                datosNegocio.hasMap = negocio.maps;
            }

            const redes = [];
            if (negocio.facebook && negocio.facebook.startsWith("http")) redes.push(negocio.facebook);
            if (negocio.instagram && negocio.instagram.startsWith("http")) redes.push(negocio.instagram);
            if (redes.length > 0) datosNegocio.sameAs = redes;

            if (
                !esAreaServicio &&
                direccion.latitud !== "" && direccion.latitud !== undefined &&
                direccion.longitud !== "" && direccion.longitud !== undefined
            ) {
                datosNegocio.geo = {
                    "@type": "GeoCoordinates",
                    "latitude": Number(direccion.latitud),
                    "longitude": Number(direccion.longitud)
                };
            }

            if (Array.isArray(negocio.areasServicio) && negocio.areasServicio.length > 0) {
                const areas = negocio.areasServicio.map(function (area) {
                    const nombreArea = typeof area === "string" ? area : area?.nombre;
                    return nombreArea ? { "@type": "Place", "name": nombreArea } : null;
                }).filter(Boolean);
                if (areas.length > 0) datosNegocio.areaServed = areas;
            }

            if (Array.isArray(negocio.horarios) && negocio.horarios.length > 0) {
                datosNegocio.openingHoursSpecification = negocio.horarios.flatMap(function (horario) {
                    return (horario.dias || []).map(function (dia) {
                        return {
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": dia,
                            "opens": horario.abre,
                            "closes": horario.cierra
                        };
                    });
                });
            }

            const escHtml = function (valor) {
                return String(valor ?? "")
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");
            };

            const escJson = function (valor) {
                return JSON.stringify(valor)
                    .replace(/</g, "\\u003c")
                    .replace(/>/g, "\\u003e")
                    .replace(/&/g, "\\u0026")
                    .replace(/\u2028/g, "\\u2028")
                    .replace(/\u2029/g, "\\u2029");
            };

            const ciudad = direccion.ciudad || negocio.ciudad || "";
            const direccionTexto = negocio.direccionTexto || direccion.calle || ciudad || "";

            const reemplazos = {
                "__SEO_TITLE__": escHtml(tituloSEO),
                "__SEO_DESCRIPTION__": escHtml(descripcionSEO),
                "__ROBOTS__": indexable ? "index, follow" : "noindex, nofollow",
                "__BUSINESS_NAME__": escHtml(negocio.nombre),
                "__BUSINESS_TYPE__": escHtml(negocio.etiquetaTipo || ""),
                "__H1_TITLE__": escHtml(h1Title),
                "__H1_DESCRIPTION__": escHtml(h1Description),
                "__BUSINESS_DESCRIPTION__": escHtml(negocio.descripcion || descripcionSEO),
                "__CITY__": escHtml(ciudad),
                "__ADDRESS__": escHtml(direccionTexto),
                "__PHONE__": escHtml(negocio.telefono || ""),
                "__CANONICAL_URL__": escHtml(canonical),
                "__FAVICON_URL__": escHtml(logoURL),
                "__SOCIAL_IMAGE_URL__": escHtml(imagenSocialURL),
                "__STRUCTURED_DATA__": escJson(datosNegocio)
            };

            Object.entries(reemplazos).forEach(function ([marcador, valor]) {
                html = html.split(marcador).join(valor);
            });

            // En páginas internas multi, el H1 de la cabecera interna es el encabezado principal.
            // El hero queda oculto por JS; convertir su H1 en H2 evita dos H1 en el documento.
            if (paginaActual && rutaNormalizada(url.pathname) !== "/") {
                html = html.replace(
                    '<h1 id="nombre-negocio">' + escHtml(h1Title) + '</h1>',
                    '<h2 id="nombre-negocio">' + escHtml(h1Title) + '</h2>'
                );
            }

            return new Response(html, {
                status: respuestaHTML.status,
                headers: {
                    "Content-Type": "text/html; charset=UTF-8",
                    "Cache-Control": "public, max-age=300"
                }
            });
        }

        // ================================================
        // RESTO DE LOS RECURSOS
        // ================================================

        return env.ASSETS.fetch(request);
    }
};
