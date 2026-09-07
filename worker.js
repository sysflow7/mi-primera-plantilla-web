export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const host = url.hostname.toLowerCase();
        const baseDomain = "sidenred.com";
        const normalizedHost = host.replace(/^www\./, "");
        const isCorporateHost = normalizedHost === baseDomain;
        const hostParts = host.split(".");
        const isSidenSubdomain = host.endsWith("." + baseDomain) && hostParts.length === 3 && hostParts[0] !== "www";

        const slugify = (value) => String(value || "").toLowerCase().trim()
            .replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

        // Las peticiones al binding ASSETS se construyen con una URL interna
        // para no arrastrar el Host del dominio público.
        const loadAsset = async (pathname) => {
            const assetUrl = new URL(pathname, "https://siden-assets.internal");
            const headers = new Headers(request.headers);
            headers.delete("host");
            headers.delete("content-length");
            return env.ASSETS.fetch(new Request(assetUrl, {
                method: request.method,
                headers
            }));
        };

        let instanceId = "";
        if (isCorporateHost) {
            instanceId = "corporativo";
        } else if (isSidenSubdomain) {
            const hostSlug = slugify(hostParts[0]);
            instanceId = hostSlug;
            const respuestaRegistry = await loadAsset("/sites/registry.json");
            if (respuestaRegistry.ok) {
                try {
                    const registry = await respuestaRegistry.json();
                    instanceId = slugify(registry[hostSlug] || hostSlug);
                } catch {
                    instanceId = hostSlug;
                }
            }
        } else if (env.SIDEN_REGISTRY) {
            instanceId = slugify(await env.SIDEN_REGISTRY.get(normalizedHost));
        }

        if (!instanceId) return new Response("Sitio SIDeN no configurado.", { status: 404 });

        const isCorporate = instanceId === "corporativo";
        const sitePrefix = isCorporate ? "" : `/sites/${instanceId}`;
        const configPath = isCorporate ? "/config.json" : `${sitePrefix}/config.json`;

        const respuestaConfig = await loadAsset(configPath);
        if (!respuestaConfig.ok) return new Response("Sitio SIDeN no configurado.", { status: 404 });

        const negocio = await respuestaConfig.json();
        const configuredInstance = slugify(negocio.siden?.instanceId || instanceId);

        if (isCorporate) {
            if (configuredInstance !== "siden-corporativo") {
                return new Response("Configuración de sitio no válida.", { status: 500 });
            }
        } else if (configuredInstance !== instanceId) {
            return new Response("Configuración de sitio no válida.", { status: 500 });
        }

        if (url.pathname === "/config.json" && !isCorporate) {
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

        const rutasMultipagina = negocio.modoSitio === "multi" && Array.isArray(negocio.paginas)
            ? negocio.paginas.map(pagina => rutaNormalizada(pagina.ruta)) : [];
        const esRutaPagina = url.pathname === "/" || rutasMultipagina.includes(rutaNormalizada(url.pathname));

        if (request.method === "GET" && url.pathname.startsWith("/images/")) {
            return loadAsset(isCorporate ? url.pathname : `${sitePrefix}${url.pathname}`);
        }

        if (url.pathname === "/robots.txt") {
            const contenido = "User-agent: *\nAllow: /\nSitemap: " + url.origin + "/sitemap.xml\n";
            return new Response(contenido, { headers: { "Content-Type": "text/plain; charset=UTF-8", "Cache-Control": "public, max-age=3600", "Vary": "Host" } });
        }

        if (url.pathname === "/sitemap.xml") {
            const rutas = ["/"];
            if (negocio.modoSitio === "multi" && Array.isArray(negocio.paginas)) {
                negocio.paginas.forEach(pagina => {
                    const ruta = rutaNormalizada(pagina.ruta);
                    if (ruta !== "/" && !rutas.includes(ruta)) rutas.push(ruta);
                });
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

        const paginaActual = negocio.modoSitio === "multi" && Array.isArray(negocio.paginas)
            ? negocio.paginas.find(pagina => rutaNormalizada(pagina.ruta) === rutaNormalizada(url.pathname)) : null;

        const tituloSEO = paginaActual?.tituloSEO || negocio.tituloSEO || negocio.seo?.titulo ||
            (paginaActual?.nombre ? `${paginaActual.nombre} | ${negocio.nombre}` : `${negocio.nombre} | ${negocio.ciudad}`);
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
            name: negocio.nombre, description: descripcionSEO, url: canonical, telephone: negocio.telefono };
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
        if (negocio.maps?.startsWith("http")) datosNegocio.hasMap = negocio.maps;
        const redes = [negocio.facebook, negocio.instagram].filter(red => typeof red === "string" && red.startsWith("http"));
        if (redes.length) datosNegocio.sameAs = redes;
        if (!esAreaServicio && direccion.latitud !== "" && direccion.latitud !== undefined && direccion.longitud !== "" && direccion.longitud !== undefined) {
            datosNegocio.geo = { "@type": "GeoCoordinates", latitude: Number(direccion.latitud), longitude: Number(direccion.longitud) };
        }
        if (Array.isArray(negocio.areasServicio) && negocio.areasServicio.length) {
            const areas = negocio.areasServicio.map(area => { const nombreArea = typeof area === "string" ? area : area?.nombre; return nombreArea ? { "@type": "Place", name: nombreArea } : null; }).filter(Boolean);
            if (areas.length) datosNegocio.areaServed = areas;
        }
        if (Array.isArray(negocio.horarios) && negocio.horarios.length) {
            datosNegocio.openingHoursSpecification = negocio.horarios.flatMap(horario => (horario.dias || []).map(dia => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dia, opens: horario.abre, closes: horario.cierra })));
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

        const runtimeConfig = { ...negocio, siden: { ...(negocio.siden || {}), instanceId, host, canonicalOrigin: url.origin, assetPrefix: sitePrefix } };
        html = html.replace("</head>", `<script>window.__SIDEN_CONFIG__=${escJson(runtimeConfig)};</script></head>`);
        if (!logoURL) html = html.replace(/\s*<link rel="icon" type="image\/png" href="">/i, "");
        if (!imagenSocialURL) {
            html = html.replace(/\s*<meta property="og:image" content="">/i, "");
            html = html.replace(/\s*<meta property="og:image:alt" content="[^"]*">/i, "");
            html = html.replace(/\s*<meta name="twitter:image" content="">/i, "");
        }
        if (paginaActual && rutaNormalizada(url.pathname) !== "/") {
            html = html.replace('<h1 id="nombre-negocio">' + escHtml(h1Title) + '</h1>', '<h2 id="nombre-negocio">' + escHtml(h1Title) + '</h2>');
        }

        return new Response(html, { status: respuestaHTML.status, headers: { "Content-Type": "text/html; charset=UTF-8", "Cache-Control": "public, max-age=300", "Vary": "Host" } });
    }
};
