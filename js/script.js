// ==================================================
// SIDEN - MOTOR DE CONFIGURACIÓN DEL CLIENTE
// ==================================================

(async function () {
    "use strict";

    try {
        const runtime = window.__SIDEN_CONFIG__;
        const respuesta = runtime && runtime.siden
            ? null
            : await fetch("config.json", { cache: "no-cache" });
        if (respuesta && !respuesta.ok) throw new Error("No se pudo cargar config.json");

        const negocioBase = runtime && runtime.siden
            ? runtime
            : await respuesta.json();
        const siden = negocioBase.siden || {};
        const templateFamily = String(siden.templateFamily || "corporate").toLowerCase();
        const previewSite = new URLSearchParams(window.location.search).get("site");
        // ==================================================
        // SIDEN - GOOGLE ANALYTICS 4
        // La medición es opcional y se configura por instancia.
        // No se cargan datos de GA4 en Preview por parámetro ?site=, workers.dev, pages.dev o localhost.
        // ==================================================
        const analyticsConfig = negocioBase.analytics && negocioBase.analytics.ga4
            ? negocioBase.analytics.ga4
            : {};
        const ga4MeasurementId = String(analyticsConfig.measurementId || "").trim();
        const ga4Enabled = analyticsConfig.enabled !== false && /^G-[A-Z0-9]+$/i.test(ga4MeasurementId);
        const hostActual = window.location.hostname.toLowerCase();
        const esHostPreview = hostActual.endsWith(".workers.dev") ||
            hostActual.endsWith(".pages.dev") ||
            hostActual === "localhost" ||
            hostActual === "127.0.0.1";
        const esCloudflarePreview = !!previewSite || esHostPreview;

        if (ga4Enabled && !esCloudflarePreview) {
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
            window.gtag("js", new Date());
            window.gtag("config", ga4MeasurementId, { send_page_view: true });

            if (!document.querySelector('script[data-siden-ga4="true"]')) {
                const gaScript = document.createElement("script");
                gaScript.async = true;
                gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4MeasurementId);
                gaScript.dataset.sidenGa4 = "true";
                document.head.appendChild(gaScript);
            }
        }

        const sidenAnalyticsEvent = function (eventName, params) {
            if (!ga4Enabled || esCloudflarePreview || typeof window.gtag !== "function") return;
            window.gtag("event", eventName, {
                instance_id: String(siden.instanceId || negocioBase.siden?.instanceId || ""),
                template_family: templateFamily,
                ...(params || {})
            });
        };
        document.body.dataset.templateFamily = templateFamily;
        document.body.classList.add("siden-template-" + templateFamily);
        const assetPrefix = String(siden.assetPrefix || "").replace(/\/+$/, "");
        const assetQuery = previewSite ? "?site=" + encodeURIComponent(previewSite) : "";
        const assetUrl = function (archivo) {
            const limpio = String(archivo || "").replace(/^\/+/, "");
            if (limpio.startsWith("images/")) {
                return new URL("/" + limpio + assetQuery, window.location.origin).href;
            }
            return new URL((assetPrefix ? assetPrefix + "/" : "/") + limpio + assetQuery, window.location.origin).href;
        };

        const tipo = String(negocioBase.tipoNegocio || "comercio").toLowerCase();
        const defaults = {
            comercio: ["presentacion", "beneficios", "servicios", "productos", "galeria", "ubicacion", "contacto"],
            profesional: ["presentacion", "perfil", "beneficios", "servicios", "galeria", "ubicacion", "contacto"],
            restaurante: ["presentacion", "beneficios", "servicios", "menu", "galeria", "ubicacion", "contacto"]
        };
        const aliases = {
            hardwarestore: "comercio", tienda: "comercio", comercio: "comercio",
            profesional: "profesional", abogado: "profesional", medico: "profesional", médico: "profesional",
            contador: "profesional", arquitecto: "profesional", electricista: "profesional",
            fotografo: "profesional", fotógrafo: "profesional", consultor: "profesional",
            psicologo: "profesional", psicólogo: "profesional", dentista: "profesional",
            restaurante: "restaurante", restaurant: "restaurante"
        };

        const tipoNormalizado = aliases[tipo] || "comercio";
        const rutaActual = window.location.pathname.replace(/\/+$/, "") || "/";
        const esMulti = negocioBase.modoSitio === "multi" && Array.isArray(negocioBase.paginas);
        let negocio = { ...negocioBase };
        let paginaActual = null;

        if (esMulti) {
            paginaActual = negocioBase.paginas.find(function (pagina) {
                const ruta = String(pagina.ruta || "/").replace(/\/+$/, "") || "/";
                return ruta === rutaActual;
            });
            if (paginaActual) {
                negocio = {
                    ...negocioBase,
                    ...paginaActual,
                    etiquetas: { ...(negocioBase.etiquetas || {}), ...(paginaActual.etiquetas || {}) },
                    textos: { ...(negocioBase.textos || {}), ...(paginaActual.textos || {}) }
                };
            }
        }

        const modulos = Array.isArray(negocio.modulos) ? negocio.modulos : (defaults[tipoNormalizado] || defaults.comercio);
        const etiquetas = negocio.etiquetas || {};
        const texto = negocio.textos || {};
        const presentacionConfig = negocio.presentacion && typeof negocio.presentacion === "object" ? negocio.presentacion : {};
        const faqConfig = negocio.faq && typeof negocio.faq === "object" ? negocio.faq : {};
        const estadoComercial = String(negocioBase.estadoComercial || "").trim().toLowerCase();
        const esPlantillaComercial = templateFamily === "commercial";
        const esDemoCorporativa = templateFamily === "corporate" && estadoComercial === "demo";
        const mostrarPlanesSiden = esPlantillaComercial || esDemoCorporativa;
        const preguntasFAQNegocio = Array.isArray(faqConfig.preguntas) ? faqConfig.preguntas.filter(item => item && String(item.pregunta || "").trim() && String(item.respuesta || "").trim()) : [];
        const mostrarFAQ = esPlantillaComercial ? faqConfig.activo !== false : esDemoCorporativa ? faqConfig.activo !== false : faqConfig.activo === true && preguntasFAQNegocio.length > 0;
        const escapeHtml = function (value) {
            return String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        };
        // Acepta únicamente URLs absolutas HTTPS para enlaces externos configurables.
        const urlHttpsValida = function (valor) {
            if (typeof valor !== "string" || !valor.trim()) return "";
            try {
                const url = new URL(valor.trim());
                return url.protocol === "https:" && url.hostname ? url.href : "";
            } catch (error) {
                return "";
            }
        };
        const setText = function (id, value) {
            const elemento = document.getElementById(id);
            if (elemento && value !== undefined && value !== null) elemento.textContent = value;
        };
        const showModule = function (id, visible) {
            const elemento = document.querySelector(`[data-module="${id}"]`);
            if (elemento) elemento.hidden = !visible;
        };
        const addCard = function (container, className, html) {
            if (!container) return;
            const tarjeta = document.createElement("div");
            tarjeta.className = className;
            tarjeta.innerHTML = html;
            container.appendChild(tarjeta);
        };

        // IDENTIDAD
        setText("nav-logo-text", negocioBase.nombre);
        setText("nombre-negocio", negocioBase.nombre);
        setText("slogan-negocio", paginaActual?.slogan || negocioBase.slogan);
        setText("tipo-negocio", negocioBase.etiquetaTipo || "");
        setText("descripcion-negocio", negocio.descripcion);
        setText("nombre-footer", negocioBase.nombre);
        setText("anio-actual", new Date().getFullYear());
        setText("telefono-negocio", negocioBase.telefono);
        setText("ciudad-negocio", negocioBase.ciudad);
        setText("direccion-linea", negocioBase.direccionTexto || "");
        setText("texto-ubicacion", texto.ubicacion || "Encuentra nuestro establecimiento y consulta cómo llegar.");

        const navLogo = document.getElementById("nav-logo");
        if (navLogo) navLogo.href = esMulti ? (previewSite ? "/?site=" + encodeURIComponent(previewSite) : "/") : "#inicio";

        const navLogoImage = document.getElementById("nav-logo-image");
        if (navLogoImage) {
            if (negocioBase.logo) {
                navLogoImage.src = assetUrl("images/" + negocioBase.logo);
                navLogoImage.alt = "Logo de " + negocioBase.nombre;
                navLogoImage.hidden = false;
            } else {
                navLogoImage.hidden = true;
            }
        }

        const logo = document.getElementById("logo-negocio");
        if (logo) {
            if (negocioBase.logo) {
                logo.src = assetUrl("images/" + negocioBase.logo);
                logo.alt = "Logo de " + negocioBase.nombre;
                logo.hidden = false;
            } else {
                logo.removeAttribute("src");
                logo.alt = "";
                logo.hidden = true;
            }
        }

        // HERO / CABECERA INTERNA
        const hero = document.getElementById("inicio");
        const paginaCabecera = document.getElementById("pagina-cabecera");
        const nombreHeroFondo = negocio.heroImagenFondo || negocioBase.heroImagenFondo || negocio.heroImagen || negocioBase.heroImagen;
        const nombreHeroVisual = negocio.heroImagenVisual || negocioBase.heroImagenVisual || "";
        const esPaginaInterna = esMulti && rutaActual !== "/" && !!paginaActual;

        if (hero) {
            if (esPaginaInterna) {
                hero.hidden = true;
                document.body.classList.add("multi-inner-page");
            } else if (nombreHeroFondo) {
                const rutaHero = assetUrl("images/" + nombreHeroFondo);
                const imagenHero = new Image();
                imagenHero.onload = function () {
                    hero.style.setProperty("--hero-image", `url("${rutaHero}")`);
                    hero.style.backgroundImage = `url("${rutaHero}")`;
                    hero.style.backgroundSize = "cover";
                    hero.style.backgroundPosition = "center";
                    hero.classList.add("hero-has-image");
                };
                imagenHero.onerror = function () {
                    console.error("SIDEN: no se pudo cargar la imagen de fondo del Hero:", rutaHero);
                    hero.classList.remove("hero-has-image");
                    hero.style.removeProperty("--hero-image");
                    hero.style.backgroundImage = "";
                };
                imagenHero.src = rutaHero;
            } else {
                hero.classList.remove("hero-has-image");
                hero.style.removeProperty("--hero-image");
                hero.style.backgroundImage = "";
            }
        }

        const heroImagenElemento = document.getElementById("hero-imagen-negocio");
        const mostrarHeroImagen = negocioBase.mostrarHeroImagen === true;
        if (heroImagenElemento) {
            if (mostrarHeroImagen && nombreHeroVisual) {
                heroImagenElemento.src = assetUrl("images/" + nombreHeroVisual);
                heroImagenElemento.alt = "Imagen visual del negocio " + negocioBase.nombre;
                heroImagenElemento.hidden = false;
            } else {
                heroImagenElemento.removeAttribute("src");
                heroImagenElemento.hidden = true;
            }
        }

        if (paginaCabecera) {
            if (esPaginaInterna) {
                paginaCabecera.hidden = false;
                setText("pagina-tipo", negocioBase.etiquetaTipo || "");
                setText("pagina-titulo", paginaActual.nombre || "");
                setText("pagina-descripcion", paginaActual.descripcion || paginaActual.descripcionSEO || "");
            } else {
                paginaCabecera.hidden = true;
            }
        }

        // CINTA INFORMATIVA
        const cintaConfig = negocioBase.cintaInformativa || negocioBase.cinta || {};
        const cinta = document.getElementById("cinta-informativa");
        const cintaTrack = document.getElementById("cinta-informativa-track");
        const cintaVisible = cintaConfig.mostrar === true || cintaConfig.enabled === true;
        const cintaItems = Array.isArray(cintaConfig.items)
            ? cintaConfig.items.map(function (item) { return String(item || "").trim(); }).filter(Boolean)
            : (cintaConfig.texto ? [String(cintaConfig.texto).trim()] : []);
        const cintaSeparador = String(cintaConfig.separador || "✦").trim() || "✦";
        const cintaVelocidad = Number(cintaConfig.velocidad);
        if (cinta && cintaTrack) {
            cinta.hidden = !(cintaVisible && cintaItems.length);
            if (!cinta.hidden) {
                const crearGrupoCinta = function () {
                    const grupo = document.createElement("div");
                    grupo.className = "siden-marquee-group";
                    cintaItems.forEach(function (item, indice) {
                        const textoItem = document.createElement("span");
                        textoItem.className = "siden-marquee-item";
                        textoItem.textContent = item;
                        grupo.appendChild(textoItem);
                        if (indice < cintaItems.length - 1 || cintaItems.length > 0) {
                            const separador = document.createElement("span");
                            separador.className = "siden-marquee-separator";
                            separador.setAttribute("aria-hidden", "true");
                            separador.textContent = cintaSeparador;
                            grupo.appendChild(separador);
                        }
                    });
                    return grupo;
                };
                cintaTrack.innerHTML = "";
                cintaTrack.appendChild(crearGrupoCinta());
                cintaTrack.appendChild(crearGrupoCinta());
                if (Number.isFinite(cintaVelocidad) && cintaVelocidad > 0) {
                    cintaTrack.style.animationDuration = Math.max(8, cintaVelocidad) + "s";
                }
            }
        }


        // ETIQUETAS Y PRESENTACIÓN CONFIGURABLE
        setText("titulo-presentacion", presentacionConfig.titulo || etiquetas.presentacion || "¿Quiénes somos?");
        setText("titulo-perfil", etiquetas.perfil || "Perfil profesional");
        setText("titulo-beneficios", etiquetas.beneficios || "¿Por qué elegirnos?");
        setText("titulo-servicios", etiquetas.servicios || "Nuestros servicios");
        setText("titulo-productos", etiquetas.productos || "Productos destacados");
        setText("titulo-menu", etiquetas.menu || "Nuestro menú");
        setText("titulo-galeria", etiquetas.galeria || "Galería");
        setText("titulo-ubicacion", etiquetas.ubicacion || "Encuéntranos");
        setText("titulo-contacto", etiquetas.contacto || "¿Tienes alguna pregunta?");
        setText("texto-contacto", texto.contacto || "Estamos disponibles para atenderte.");

        const textoPresentacion = presentacionConfig.texto || negocio.descripcion || negocioBase.descripcion || "";
        setText("descripcion-negocio", textoPresentacion);
        const imagenPresentacion = document.getElementById("imagen-presentacion");
        const seccionPresentacion = document.getElementById("nosotros");
        if (imagenPresentacion) {
            if (presentacionConfig.imagen) {
                imagenPresentacion.src = assetUrl("images/" + presentacionConfig.imagen);
                imagenPresentacion.alt = presentacionConfig.alt || (presentacionConfig.titulo || etiquetas.presentacion || "Especialidad") + " - " + negocioBase.nombre;
                imagenPresentacion.hidden = false;
                if (seccionPresentacion) seccionPresentacion.classList.remove("split-no-image");
            } else {
                imagenPresentacion.removeAttribute("src");
                imagenPresentacion.hidden = true;
                if (seccionPresentacion) seccionPresentacion.classList.add("split-no-image");
            }
        }

        // MÓDULOS
        const galeria = Array.isArray(negocio.galeria)
            ? negocio.galeria.map(function (imagen) { return String(imagen || "").trim(); }).filter(Boolean)
            : [];
        const galeriaActiva = modulos.includes("galeria") && galeria.length > 0;

        ["presentacion", "perfil", "beneficios", "servicios", "proceso", "identidad", "filosofia", "productos", "menu", "galeria", "ubicacion", "contacto"].forEach(function (modulo) {
            const visible = modulo === "galeria" ? galeriaActiva : modulos.includes(modulo);
            showModule(modulo, visible);
        });

        // MÓDULOS CORPORATIVOS: proceso e identidad
        const listaProceso = document.getElementById("lista-proceso");
        if (listaProceso) {
            listaProceso.innerHTML = "";
            const pasos = Array.isArray(negocio.proceso) ? negocio.proceso : [];
            pasos.forEach(function (paso, indice) {
                const titulo = paso.titulo || paso.nombre || ("Paso " + (indice + 1));
                addCard(listaProceso, "service", `<h3>${escapeHtml(titulo)}</h3><p>${escapeHtml(paso.descripcion || paso.detalle || "")}</p>`);
            });
            showModule("proceso", modulos.includes("proceso") && pasos.length > 0);
        }

        const identidadConfig = negocio.identidad && typeof negocio.identidad === "object" ? negocio.identidad : {};
        setText("titulo-identidad", identidadConfig.titulo || etiquetas.identidad || "Quiénes somos");
        const contenidoIdentidad = document.getElementById("contenido-identidad");
        if (contenidoIdentidad) contenidoIdentidad.textContent = identidadConfig.texto || identidadConfig.descripcion || "";
        const imagenIdentidad = document.getElementById("imagen-identidad");
        if (imagenIdentidad) {
            if (identidadConfig.imagen) {
                imagenIdentidad.src = assetUrl("images/" + identidadConfig.imagen);
                imagenIdentidad.alt = identidadConfig.alt || (identidadConfig.titulo || "Identidad de " + negocioBase.nombre);
                imagenIdentidad.hidden = false;
            } else {
                imagenIdentidad.removeAttribute("src");
                imagenIdentidad.alt = "";
                imagenIdentidad.hidden = true;
            }
        }
        showModule("identidad", modulos.includes("identidad") && !!String(identidadConfig.texto || identidadConfig.descripcion || "").trim());

        // FILOSOFÍA PROFESIONAL: contenido distinto de la biografía/presentación.
        const filosofiaConfig = negocio.filosofia && typeof negocio.filosofia === "object" ? negocio.filosofia : {};
        setText("titulo-filosofia", filosofiaConfig.titulo || etiquetas.filosofia || "Nuestra filosofía");
        const contenidoFilosofia = document.getElementById("contenido-filosofia");
        if (contenidoFilosofia) contenidoFilosofia.textContent = filosofiaConfig.texto || filosofiaConfig.descripcion || "";
        const imagenFilosofia = document.getElementById("imagen-filosofia");
        if (imagenFilosofia) {
            if (filosofiaConfig.imagen) {
                imagenFilosofia.src = assetUrl("images/" + filosofiaConfig.imagen);
                imagenFilosofia.alt = filosofiaConfig.alt || (filosofiaConfig.titulo || "Filosofía profesional de " + negocioBase.nombre);
                imagenFilosofia.hidden = false;
            } else {
                imagenFilosofia.removeAttribute("src");
                imagenFilosofia.alt = "";
                imagenFilosofia.hidden = true;
            }
        }
        showModule("filosofia", modulos.includes("filosofia") && !!String(filosofiaConfig.texto || filosofiaConfig.descripcion || "").trim());

        // Estas secciones explican la oferta comercial de SIDeN y no forman parte de webs corporativas.
        ["proyectos", "problema", "solucion"].forEach(function (id) {
            const seccion = document.getElementById(id);
            if (seccion) {
                const visibleComercial = templateFamily === "commercial";
                seccion.hidden = !visibleComercial;
                seccion.style.display = visibleComercial ? "" : "none";
            }
        });

        // ORDEN PERSONALIZADO DE SECCIONES
        // Una instancia puede definir ordenSecciones sin alterar la plantilla maestra.
        const ordenSecciones = Array.isArray(negocioBase.ordenSecciones)
            ? negocioBase.ordenSecciones.map(function (id) { return String(id || "").trim(); }).filter(Boolean)
            : [];
        if (ordenSecciones.length) {
            const main = document.querySelector("main");
            if (main) {
                ordenSecciones.forEach(function (id) {
                    const seccion = document.getElementById(id);
                    if (seccion && seccion.parentElement === main) main.appendChild(seccion);
                });
            }
        }

        // NAVEGACIÓN
        const navLinks = document.getElementById("nav-links");
        const navTargets = { presentacion: "nosotros", perfil: "perfil", beneficios: "beneficios", servicios: "servicios", proceso: "proceso", identidad: "identidad", filosofia: "filosofia", productos: "productos", menu: "menu", galeria: "galeria", ubicacion: "ubicacion", contacto: "contacto", soluciones: "soluciones", faq: "faq" };
        const navLabels = {
            presentacion: etiquetas.presentacionMenu || "Nosotros", perfil: etiquetas.perfilMenu || "Perfil",
            beneficios: etiquetas.beneficiosMenu || "¿Por qué elegirnos?", servicios: etiquetas.serviciosMenu || "Servicios",
            productos: etiquetas.productosMenu || "Productos", menu: etiquetas.menuMenu || "Menú",
            galeria: etiquetas.galeriaMenu || "Galería", ubicacion: etiquetas.ubicacionMenu || "Ubicación",
            contacto: etiquetas.contactoMenu || "Contacto", proceso: etiquetas.procesoMenu || "Cómo trabajamos", identidad: etiquetas.identidadMenu || "Identidad", filosofia: etiquetas.filosofiaMenu || "Nuestra filosofía",
            soluciones: etiquetas.solucionesMenu || "Planes SIDeN",
            faq: etiquetas.faqMenu || etiquetas.faq || "Preguntas frecuentes"
        };

        if (navLinks) {
            navLinks.innerHTML = "";
            if (esMulti && negocioBase.paginas.length > 0) {
                negocioBase.paginas.forEach(function (pagina) {
                    const enlace = document.createElement("a");
                    const rutaPagina = pagina.ruta || "/";
                    enlace.href = previewSite
                        ? rutaPagina + (rutaPagina.includes("?") ? "&" : "?") + "site=" + encodeURIComponent(previewSite)
                        : rutaPagina;
                    enlace.textContent = pagina.nombre || "Página";
                    navLinks.appendChild(enlace);
                });
            } else {
                const modulosNavegacion = modulos.filter(function (modulo) {
                    if (modulo === "galeria") return galeriaActiva;
                    if (modulo === "soluciones") return mostrarPlanesSiden;
                    if (modulo === "faq") return mostrarFAQ;
                    return true;
                });
                if (mostrarPlanesSiden && !modulosNavegacion.includes("soluciones")) modulosNavegacion.push("soluciones");
                if (mostrarFAQ && !modulosNavegacion.includes("faq")) modulosNavegacion.push("faq");
                modulosNavegacion.forEach(function (modulo) {
                    const target = navTargets[modulo];
                    if (!target) return;
                    const enlace = document.createElement("a");
                    enlace.href = "#" + target;
                    enlace.textContent = navLabels[modulo] || modulo;
                    navLinks.appendChild(enlace);
                });
            }
        }

        // Navegación robusta para enlaces internos: asegura que "Nosotros" lleve a la sección visible.
        if (navLinks && navLinks.dataset.sidenAnchorBound !== "1") {
            navLinks.dataset.sidenAnchorBound = "1";
            navLinks.addEventListener("click", function (event) {
                const enlace = event.target.closest('a[href^="#"]');
                if (!enlace) return;
                const id = decodeURIComponent(enlace.getAttribute("href").slice(1));
                const destino = document.getElementById(id);
                if (!destino) return;
                event.preventDefault();
                if (destino.hidden) destino.hidden = false;
                destino.scrollIntoView({ behavior: "smooth", block: "start" });
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, "", "#" + encodeURIComponent(id));
                }
            });
        }

        // CONTACTO Y ENLACES
        const whatsapp = String(negocioBase.whatsapp || "").replace(/\D/g, "");
        const enlaceWhatsApp = whatsapp ? "https://wa.me/" + whatsapp : "";
        ["whatsapp-principal", "whatsapp-final", "whatsapp-flotante", "pagina-whatsapp"].forEach(function (id) {
            const elemento = document.getElementById(id);
            if (!elemento) return;
            elemento.hidden = false;
            elemento.style.display = "";
            elemento.removeAttribute("aria-hidden");
            elemento.href = enlaceWhatsApp || "#whatsapp-no-configurado";
            if (!enlaceWhatsApp) {
                elemento.setAttribute("data-whatsapp-pendiente", "true");
                elemento.setAttribute("aria-label", "WhatsApp pendiente de configuración");
            } else {
                elemento.removeAttribute("data-whatsapp-pendiente");
                elemento.setAttribute("aria-label", id === "whatsapp-flotante" ? "Contactar por WhatsApp" : "Contactar por WhatsApp");
            }
        });
        const email = String(negocioBase.email || "").trim();
        const emailElemento = document.getElementById("email-negocio");
        if (emailElemento) {
            if (email) {
                emailElemento.textContent = "✉️ " + email;
                emailElemento.href = "mailto:" + email;
                emailElemento.hidden = false;
            } else {
                emailElemento.textContent = "";
                emailElemento.removeAttribute("href");
                emailElemento.hidden = true;
            }
        }
        const facebook = document.getElementById("facebook-negocio");
        if (facebook) {
            const urlFacebook = urlHttpsValida(negocioBase.facebook);
            facebook.href = urlFacebook || "#";
            facebook.hidden = !urlFacebook;
            if (urlFacebook) { facebook.target = "_blank"; facebook.rel = "noopener noreferrer"; }
        }
        const instagram = document.getElementById("instagram-negocio");
        if (instagram) {
            const urlInstagram = urlHttpsValida(negocioBase.instagram);
            instagram.href = urlInstagram || "#";
            instagram.hidden = !urlInstagram;
            if (urlInstagram) { instagram.target = "_blank"; instagram.rel = "noopener noreferrer"; }
        }
        const maps = document.getElementById("maps-negocio");
        if (maps) {
            const mapsUrl = String(negocioBase.maps || "").trim();
            const direccion = negocioBase.direccion || {};
            const lat = String(direccion.latitud ?? "").trim();
            const lng = String(direccion.longitud ?? "").trim();
            const destino = lat && lng
                ? lat + "," + lng
                : String(negocioBase.direccionTexto || negocioBase.ciudad || "").trim();
            const directionsUrl = destino
                ? "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(destino)
                : mapsUrl;

            maps.href = directionsUrl || "#";
            maps.target = "_blank";
            maps.rel = "noopener noreferrer";
            maps.hidden = !(directionsUrl && /^https?:\/\//i.test(directionsUrl));
        }

        // UBICACIÓN / MAPA EMBEBIDO
        // El proveedor del mapa se define en mapEmbedUrl.
        // Se aceptan Google Maps y OpenStreetMap sin API key.
        const mapaWrap = document.getElementById("mapa-google");
        const mapaIframe = document.getElementById("mapa-google-iframe");
        const mapEmbedUrl = String(negocioBase.mapEmbedUrl || "").trim();
        let mapaValido = false;

        if (mapEmbedUrl) {
            try {
                const urlMapa = new URL(mapEmbedUrl);
                const hostMapa = urlMapa.hostname.toLowerCase();
                const esGoogleMaps = hostMapa === "google.com" ||
                    hostMapa === "www.google.com" ||
                    hostMapa === "maps.google.com";
                const esOpenStreetMap = hostMapa === "openstreetmap.org" ||
                    hostMapa === "www.openstreetmap.org";
                const esRutaGoogle = /^\/maps(?:\/|$)/i.test(urlMapa.pathname);
                const esRutaOsm = /^\/export\/embed\.html$/i.test(urlMapa.pathname);

                mapaValido = urlMapa.protocol === "https:" &&
                    ((esGoogleMaps && esRutaGoogle) || (esOpenStreetMap && esRutaOsm));
            } catch (error) {
                mapaValido = false;
            }
        }

        const tarjetaUbicacion = document.querySelector("#ubicacion .location");
        if (mapaWrap && mapaIframe) {
            if (mapaValido) {
                mapaIframe.src = mapEmbedUrl;
                mapaWrap.hidden = false;
                mapaWrap.style.display = "block";
                if (tarjetaUbicacion) tarjetaUbicacion.classList.remove("location-no-map");
            } else {
                mapaIframe.removeAttribute("src");
                mapaWrap.hidden = true;
                mapaWrap.style.display = "none";
                // Sin mapa, la tarjeta pasa a una sola columna y evita reservar espacio vacío.
                if (tarjetaUbicacion) tarjetaUbicacion.classList.add("location-no-map");
            }
        }
        const horarioUbicacion = document.getElementById("horario-ubicacion");
        if (horarioUbicacion) {
            const horarios = Array.isArray(negocioBase.horarios) ? negocioBase.horarios : [];
            const configHorarios = negocioBase.horariosConfig && typeof negocioBase.horariosConfig === "object" ? negocioBase.horariosConfig : {};
            // Si el campo de visibilidad no existe, se conserva el comportamiento histórico.
            const mostrarHorarios = typeof configHorarios.mostrar === "boolean" ? configHorarios.mostrar : horarios.length > 0;
            const dias = { Monday:"Lunes", Tuesday:"Martes", Wednesday:"Miércoles", Thursday:"Jueves", Friday:"Viernes", Saturday:"Sábado", Sunday:"Domingo" };
            const clavesDiaEspanol = { Lunes:"Monday", Martes:"Tuesday", "Miércoles":"Wednesday", Jueves:"Thursday", Viernes:"Friday", "Sábado":"Saturday", "Domingo":"Sunday" };
            horarioUbicacion.replaceChildren();
            horarioUbicacion.classList.add("location-hours");
            const crearTexto = (tag, texto, clase) => {
                const elemento = document.createElement(tag);
                if (clase) elemento.className = clase;
                elemento.textContent = texto;
                return elemento;
            };
            if (mostrarHorarios && horarios.length) {
                const usaFormatoNuevo = horarios.some(h => h && typeof h === "object" && h.dia);
                if (usaFormatoNuevo) {
                    const ordenDias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                    const horariosPorDia = new Map();
                    horarios.forEach(h => {
                        if (!h || !h.dia) return;
                        // La configuración suele guardar los días en español; internamente se ordenan con claves inglesas.
                        const nombreDiaNormalizado = String(h.dia).trim().toLocaleLowerCase("es");
                        const diasEspanolNormalizados = {
                            lunes: "Monday",
                            martes: "Tuesday",
                            miercoles: "Wednesday",
                            miércoles: "Wednesday",
                            jueves: "Thursday",
                            viernes: "Friday",
                            sabado: "Saturday",
                            sábado: "Saturday",
                            domingo: "Sunday"
                        };
                        const claveDia = dias[h.dia] || diasEspanolNormalizados[nombreDiaNormalizado] || clavesDiaEspanol[h.dia];
                        if (claveDia) horariosPorDia.set(claveDia, h);
                    });
                    const formatearHora = valor => {
                        const coincidencia = String(valor || "").match(/^(\d{1,2}):(\d{2})$/);
                        if (!coincidencia) return String(valor || "");
                        const hora24 = Number(coincidencia[1]);
                        const minutos = coincidencia[2];
                        if (hora24 > 23 || Number(minutos) > 59) return String(valor);
                        const sufijo = hora24 >= 12 ? "pm" : "am";
                        const hora12 = hora24 % 12 || 12;
                        return hora12 + ":" + minutos + " " + sufijo;
                    };
                    const prepararHorario = horario => {
                        const intervalos = Array.isArray(horario?.intervalos) ? horario.intervalos.filter(i => i && i.abre && i.cierra) : [];
                        const cerrado = Boolean(horario?.cerrado) || intervalos.length === 0;
                        const texto = cerrado ? "Cerrado" : intervalos.map(i => formatearHora(i.abre) + "–" + formatearHora(i.cierra)).join(" y ");
                        return { cerrado, texto, clave: cerrado ? "cerrado" : intervalos.map(i => String(i.abre) + "-" + String(i.cierra)).join("|") };
                    };
                    const diasConfigurados = ordenDias.map((dia, indice) => {
                        const horario = horariosPorDia.get(dia);
                        return horario ? { dia, indice, ...prepararHorario(horario) } : null;
                    });
                    let grupo = null;
                    const agregarGrupo = item => {
                        if (!item) return;
                        const fila = crearTexto("div", "", "location-hours-row");
                        fila.appendChild(crearTexto("span", item.etiqueta || nombreGrupo(item.dias), "location-hours-day"));
                        fila.appendChild(crearTexto("span", item.texto, "location-hours-times"));
                        horarioUbicacion.appendChild(fila);
                    };
                    const nombreGrupo = grupoDias => {
                        if (grupoDias.length === 1) return dias[grupoDias[0]];
                        return dias[grupoDias[0]] + " a " + dias[grupoDias[grupoDias.length - 1]].toLowerCase();
                    };
                    diasConfigurados.forEach((item, indice) => {
                        if (!item) {
                            if (grupo) { grupo.etiqueta = nombreGrupo(grupo.dias); agregarGrupo(grupo); grupo = null; }
                            return;
                        }
                        if (grupo && grupo.clave === item.clave && grupo.ultimoIndice === indice - 1) {
                            grupo.dias.push(item.dia);
                            grupo.ultimoIndice = indice;
                        } else {
                            if (grupo) agregarGrupo(grupo);
                            grupo = { etiqueta: "", dias: [item.dia], texto: item.texto, clave: item.clave, ultimoIndice: indice };
                        }
                    });
                    if (grupo) agregarGrupo(grupo);

                } else {
                    // Renderizado legado conservado para no cambiar sitios ya configurados.
                    const bloques = horarios.map(h => {
                        const nombres = Array.isArray(h?.dias) ? h.dias.map(d => dias[d] || d).join(", ") : "";
                        return [nombres, h?.abre && h?.cierra ? h.abre + "–" + h.cierra : ""].filter(Boolean).join(": ");
                    }).filter(Boolean);
                    if (bloques.length) horarioUbicacion.appendChild(crearTexto("p", bloques.join(" · "), "location-hours-legacy"));
                }
            }
            horarioUbicacion.hidden = !mostrarHorarios || horarioUbicacion.childElementCount === 0;
        }
        const telefonoUbicacion = document.getElementById("telefono-ubicacion");
        if (telefonoUbicacion) telefonoUbicacion.hidden = !String(negocioBase.telefono || "").trim();
        const paginaUbicacion = document.getElementById("pagina-ubicacion");
        if (paginaUbicacion) {
            const urlUbicacion = urlHttpsValida(negocioBase.maps);
            paginaUbicacion.href = urlUbicacion || "#";
            paginaUbicacion.hidden = !urlUbicacion;
            if (urlUbicacion) { paginaUbicacion.target = "_blank"; paginaUbicacion.rel = "noopener noreferrer"; }
        }
        const catalogo = document.getElementById("catalogo-negocio");
        if (catalogo) {
            const urlCatalogo = urlHttpsValida(negocioBase.catalogo);
            catalogo.href = urlCatalogo || "#";
            catalogo.hidden = !urlCatalogo;
            if (urlCatalogo) { catalogo.target = "_blank"; catalogo.rel = "noopener noreferrer"; }
        }

        // PERFIL
        const perfil = negocio.perfil || {};
        setText("descripcion-perfil", perfil.descripcion || negocio.descripcion || "");
        const datosPerfil = document.getElementById("datos-perfil");
        if (datosPerfil && Array.isArray(perfil.datos)) perfil.datos.forEach(function (dato) {
            addCard(datosPerfil, "profile-item", `<strong>${escapeHtml(dato.titulo)}</strong><span>${escapeHtml(dato.valor)}</span>`);
        });

        // SERVICIOS
        const listaServicios = document.getElementById("lista-servicios");
        if (listaServicios && Array.isArray(negocio.servicios)) {
            listaServicios.innerHTML = "";
            negocio.servicios.forEach(function (servicio) {
                addCard(listaServicios, "service", `<h3>${escapeHtml(servicio.nombre)}</h3><p>${escapeHtml(servicio.descripcion)}</p>`);
            });
        }

        // RESEÑAS DE GOOGLE (administradas manualmente en config.json)
        const resenasConfig = negocioBase.resenasGoogle && typeof negocioBase.resenasGoogle === "object"
            ? negocioBase.resenasGoogle : {};
        const itemsResenas = Array.isArray(resenasConfig.items)
            ? resenasConfig.items.filter(item => item && String(item.autor || "").trim() && String(item.texto || "").trim())
            : [];
        const listaResenasGoogle = document.getElementById("lista-resenas-google");
        const mostrarResenasGoogle = resenasConfig.mostrar === true && itemsResenas.length > 0 && (!esMulti || modulos.includes("resenas-google"));
        showModule("resenas-google", mostrarResenasGoogle);
        if (mostrarResenasGoogle && listaResenasGoogle) {
            setText("titulo-resenas-google", resenasConfig.titulo || "Lo que dicen nuestros clientes");
            setText("subtitulo-resenas-google", resenasConfig.subtitulo || "");
            const enlaceResenas = document.getElementById("enlace-resenas-google");
            const urlResenasGoogle = urlHttpsValida(resenasConfig.url);
            if (enlaceResenas) {
                enlaceResenas.href = urlResenasGoogle;
                enlaceResenas.hidden = !urlResenasGoogle;
            }
            listaResenasGoogle.replaceChildren();
            itemsResenas.forEach(function (resena) {
                const tarjeta = document.createElement("article");
                tarjeta.className = "google-review-card";
                const puntuacion = Math.max(1, Math.min(5, Math.round(Number(resena.estrellas) || 5)));
                const estrellas = document.createElement("div");
                estrellas.className = "google-review-stars";
                estrellas.setAttribute("role", "img");
                estrellas.setAttribute("aria-label", puntuacion + " de 5 estrellas");
                estrellas.textContent = "★".repeat(puntuacion) + "☆".repeat(5 - puntuacion);
                const textoResena = document.createElement("blockquote");
                textoResena.textContent = String(resena.texto).trim();
                const autor = document.createElement("p");
                autor.className = "google-review-author";
                autor.textContent = String(resena.autor).trim();
                const fuente = document.createElement("span");
                fuente.className = "google-review-source";
                fuente.textContent = "Reseña de Google";
                tarjeta.append(estrellas, textoResena, autor, fuente);
                listaResenasGoogle.appendChild(tarjeta);
            });

            // Carrusel responsive: 3 reseñas en escritorio, 2 en tableta y 1 en móvil.
            const botonResenaAnterior = document.getElementById("resenas-anterior");
            const botonResenaSiguiente = document.getElementById("resenas-siguiente");
            const actualizarCarruselResenas = function () {
                if (!listaResenasGoogle || !botonResenaAnterior || !botonResenaSiguiente) return;
                const tarjeta = listaResenasGoogle.querySelector(".google-review-card");
                if (!tarjeta) {
                    botonResenaAnterior.hidden = true;
                    botonResenaSiguiente.hidden = true;
                    return;
                }
                const anchoTarjeta = tarjeta.getBoundingClientRect().width;
                const estilosLista = window.getComputedStyle(listaResenasGoogle);
                const espacio = parseFloat(estilosLista.columnGap || estilosLista.gap) || 0;
                const visibles = Math.max(1, Math.round((listaResenasGoogle.clientWidth + espacio) / (anchoTarjeta + espacio)));
                const hayMas = itemsResenas.length > visibles;
                botonResenaAnterior.hidden = !hayMas;
                botonResenaSiguiente.hidden = !hayMas;
                botonResenaAnterior.disabled = listaResenasGoogle.scrollLeft <= 2;
                botonResenaSiguiente.disabled = listaResenasGoogle.scrollLeft + listaResenasGoogle.clientWidth >= listaResenasGoogle.scrollWidth - 2;
            };
            const moverCarruselResenas = function (direccion) {
                const tarjeta = listaResenasGoogle.querySelector(".google-review-card");
                if (!tarjeta) return;
                const espacio = parseFloat(window.getComputedStyle(listaResenasGoogle).columnGap) || 0;
                listaResenasGoogle.scrollBy({ left: direccion * (tarjeta.getBoundingClientRect().width + espacio), behavior: "smooth" });
                window.setTimeout(actualizarCarruselResenas, 350);
            };
            if (botonResenaAnterior && botonResenaSiguiente) {
                botonResenaAnterior.addEventListener("click", function () { moverCarruselResenas(-1); });
                botonResenaSiguiente.addEventListener("click", function () { moverCarruselResenas(1); });
                listaResenasGoogle.addEventListener("scroll", actualizarCarruselResenas, { passive: true });
                window.addEventListener("resize", actualizarCarruselResenas);
                window.requestAnimationFrame(actualizarCarruselResenas);
            }
        }

        // PRODUCTOS
        const listaProductos = document.getElementById("lista-productos");
        if (listaProductos && Array.isArray(negocio.productos)) {
            listaProductos.innerHTML = "";
            negocio.productos.forEach(function (producto) {
                const mensaje = "Hola, estoy interesado en " + String(producto.nombre || "") + (producto.precio ? " de " + String(producto.precio) : "");
                const enlaceProducto = enlaceWhatsApp ? enlaceWhatsApp + "?text=" + encodeURIComponent(mensaje) : "";
                const imagen = producto.imagen ? assetUrl("images/" + producto.imagen) : "";
                const imagenHTML = imagen
                    ? `<img src="${escapeHtml(imagen)}" alt="${escapeHtml(producto.nombre || "Producto")} - ${escapeHtml(negocioBase.nombre)}" loading="lazy">`
                    : "";
                addCard(listaProductos, "product", `${imagenHTML}<div class="product-content"><h3>${escapeHtml(producto.nombre)}</h3><p>${escapeHtml(producto.descripcion)}</p>${producto.precio ? `<strong>${escapeHtml(producto.precio)}</strong>` : ""}<a class="product-whatsapp" href="${escapeHtml(enlaceProducto || "#whatsapp-no-configurado")}" ${enlaceProducto ? "" : 'data-whatsapp-pendiente="true"'} target="_blank" rel="noopener noreferrer">💬 Consultar por WhatsApp</a></div>`);
            });
        }

        // MENÚ
        const listaMenu = document.getElementById("lista-menu");
        if (listaMenu && Array.isArray(negocio.menu)) {
            listaMenu.innerHTML = "";
            negocio.menu.forEach(function (item) {
                const imagen = item.imagen ? assetUrl("images/" + item.imagen) : "";
                addCard(listaMenu, "menu-item", `${imagen ? `<img src="${escapeHtml(imagen)}" alt="${escapeHtml(item.nombre || "Plato")}" loading="lazy">` : ""}<div><small class="menu-category">${escapeHtml(item.categoria)}</small><h3>${escapeHtml(item.nombre)}</h3><p>${escapeHtml(item.descripcion)}</p>${item.precio ? `<strong>${escapeHtml(item.precio)}</strong>` : ""}</div>`);
            });
        }

        // BENEFICIOS
        const listaBeneficios = document.getElementById("lista-beneficios");
        if (listaBeneficios && Array.isArray(negocio.beneficios)) {
            listaBeneficios.innerHTML = "";
            negocio.beneficios.forEach(function (beneficio) {
                const iconoBeneficio = beneficio.imagen ? `<img src="${escapeHtml(assetUrl("images/" + beneficio.imagen))}" alt="" loading="lazy">` : "✓";
                addCard(listaBeneficios, "benefit", `<div class="benefit-icon">${iconoBeneficio}</div><h3>${escapeHtml(beneficio.titulo)}</h3><p>${escapeHtml(beneficio.descripcion)}</p>`);
            });
        }

        // GALERÍA
        const listaGaleria = document.getElementById("lista-galeria");
        if (listaGaleria) {
            listaGaleria.innerHTML = "";
            listaGaleria.style.setProperty("--gallery-count", String(galeria.length));
            if (galeriaActiva) {
                galeria.forEach(function (imagen, indice) {
                    const foto = document.createElement("img");
                    foto.src = assetUrl("images/" + imagen);
                    foto.alt = negocioBase.nombre + " - Foto " + (indice + 1);
                    foto.loading = "lazy";
                    listaGaleria.appendChild(foto);
                });
            }
        }

        // SOLUCIONES SIDeN WEB Y FAQ
        showModule("soluciones", mostrarPlanesSiden);

        const faqSidenDefault = [
            ["¿Necesito saber de tecnología para tener una página web?", "No. SIDeN se encarga de la parte técnica y organiza la información para que tu presencia sea clara y fácil de utilizar."],
            ["¿La página funciona en celulares?", "Sí. El diseño se plantea para adaptarse a celulares, tablets y computadoras."],
            ["¿El SEO incluido en los planes es SEO local?", "Los planes Web incluyen SEO básico. La gestión de Perfil de Empresa de Google y los servicios de SEO local forman parte de soluciones adicionales y no están incluidos en estos planes."],
            ["¿Puedo conectar WhatsApp?", "Sí. Los planes Web incluyen un botón de WhatsApp para facilitar el contacto directo. Además, cada plan contempla un catálogo de WhatsApp Presencia con el límite indicado en su alcance."],
            ["¿Puedo agregar más cosas después?", "Sí. La idea es construir una base que pueda crecer con las necesidades de tu negocio. Las funciones adicionales pueden cotizarse por separado."],
            ["¿Cuánto tiempo dura el servicio?", "Los planes se contratan por 12 meses e incluyen hosting, SSL, mantenimiento básico, soporte básico y las condiciones de actualización indicadas en cada plan. La renovación anual se realiza para continuar con el servicio."]
        ];
        // En sitios multipágina, las FAQ solo se muestran si la ruta actual incluye el módulo "faq".
        // En sitios de una sola página se conserva el comportamiento existente.
        const mostrarFAQEnPagina = mostrarFAQ && (!esMulti || modulos.includes("faq"));
        showModule("faq", mostrarFAQEnPagina);
        if (mostrarFAQEnPagina) {
            const faqTitulo = faqConfig.titulo || etiquetas.faq || "Preguntas frecuentes";
            setText("titulo-faq", faqTitulo);
            const faqLista = document.getElementById("lista-faq");
            if (faqLista) {
                const preguntas = preguntasFAQNegocio.length
                    ? preguntasFAQNegocio
                    : (esPlantillaComercial || esDemoCorporativa)
                        ? faqSidenDefault.map(function (item) { return { pregunta: item[0], respuesta: item[1] }; })
                        : [];
                faqLista.innerHTML = "";
                preguntas.slice(0, 6).forEach(function (item) {
                    const detalle = document.createElement("details");
                    const resumen = document.createElement("summary");
                    const respuesta = document.createElement("p");
                    resumen.textContent = String(item.pregunta || "").trim();
                    respuesta.textContent = String(item.respuesta || "").trim();
                    detalle.append(resumen, respuesta);
                    faqLista.appendChild(detalle);
                });
            }
        }

        // ACCIONES COMUNES
        const crearVCard = function () {
            const lineasVcard = [
                "BEGIN:VCARD",
                "VERSION:3.0",
                "FN:" + negocioBase.nombre,
                "ORG:" + negocioBase.nombre,
                whatsapp ? "TEL;TYPE=CELL:" + whatsapp : "",
                negocioBase.telefono ? "TEL;TYPE=WORK:" + negocioBase.telefono : "",
                "ADR;TYPE=WORK:;;" + (negocioBase.ciudad || "") + ";;;",
                email ? "EMAIL;TYPE=INTERNET:" + email : "",
                "URL:" + window.location.href,
                "END:VCARD"
            ].filter(Boolean);
            const archivo = new Blob([lineasVcard.join("\n")], { type: "text/vcard;charset=utf-8" });
            const url = URL.createObjectURL(archivo);
            const enlace = document.createElement("a");
            enlace.href = url;
            enlace.download = (negocioBase.nombre || "contacto") + ".vcf";
            document.body.appendChild(enlace);
            enlace.click();
            document.body.removeChild(enlace);
            URL.revokeObjectURL(url);
        };

        const compartirNegocio = async function () {
            const datosCompartir = { title: negocioBase.nombre || "", text: "Te comparto " + (negocioBase.nombre || "este negocio") + ".", url: window.location.href };
            if (navigator.share) {
                try { await navigator.share(datosCompartir); } catch (error) { if (error?.name === "AbortError") return; }
            } else {
                try { await navigator.clipboard.writeText(window.location.href); alert("El enlace del negocio fue copiado."); }
                catch (error) { window.prompt("Copia este enlace:", window.location.href); }
            }
        };

        ["guardar-contacto", "pagina-guardar-contacto"].forEach(function (id) {
            const boton = document.getElementById(id);
            if (boton) boton.addEventListener("click", crearVCard);
        });
        ["compartir-negocio", "pagina-compartir-negocio"].forEach(function (id) {
            const boton = document.getElementById(id);
            if (boton) boton.addEventListener("click", compartirNegocio);
        });

        // VISIBILIDAD CONFIGURABLE DE ACCIONES DE CONTACTO.
        // Si los campos no existen, se conserva el comportamiento anterior.
        const mostrarGuardarContacto = negocioBase.mostrarBotonGuardarContacto !== false;
        const mostrarCompartirNegocio = negocioBase.mostrarBotonCompartirNegocio !== false;
        ["guardar-contacto", "pagina-guardar-contacto"].forEach(function (id) {
            const boton = document.getElementById(id);
            if (boton) boton.hidden = !mostrarGuardarContacto;
        });
        ["compartir-negocio", "pagina-compartir-negocio"].forEach(function (id) {
            const boton = document.getElementById(id);
            if (boton) boton.hidden = !mostrarCompartirNegocio;
        });
        // Ocultar el contenedor solo si ambas acciones están deshabilitadas.
        document.querySelectorAll(".contact-actions-siden").forEach(function (contenedor) {
            const tieneAccionVisible = Array.from(contenedor.querySelectorAll(
                "#guardar-contacto, #pagina-guardar-contacto, #compartir-negocio, #pagina-compartir-negocio"
            )).some(function (boton) { return !boton.hidden; });
            contenedor.hidden = !tieneAccionVisible;
        });

        // Mantener visibles los CTA de WhatsApp en la plantilla genérica, pero impedir
        // que un enlace sin número navegue al inicio de la misma página.
        document.addEventListener("click", function (event) {
            const enlace = event.target && event.target.closest ? event.target.closest("[data-whatsapp-pendiente=\"true\"]") : null;
            if (!enlace) return;
            event.preventDefault();
            alert("WhatsApp estará disponible cuando se configure el número del negocio.");
        });

        // ANALÍTICA DE INTERACCIONES SIDEN
        // Los eventos personalizados se mantienen genéricos y funcionan por instancia.
        document.addEventListener("click", function (event) {
            const elemento = event.target && event.target.closest ? event.target.closest("a, button") : null;
            if (!elemento) return;

            const id = elemento.id || "";
            const href = String(elemento.getAttribute("href") || "").trim();

            if (/^https:\/\/wa\.me\//i.test(href)) {
                sidenAnalyticsEvent("whatsapp_click", { button_id: id || "whatsapp_link" });
                return;
            }

            if (/^tel:/i.test(href)) {
                sidenAnalyticsEvent("phone_click", { button_id: id || "phone_link" });
                return;
            }

            if (id === "guardar-contacto" || id === "pagina-guardar-contacto") {
                sidenAnalyticsEvent("contact_save", { button_id: id });
                return;
            }

            if (id === "compartir-negocio" || id === "pagina-compartir-negocio") {
                sidenAnalyticsEvent("share", { content_type: "business", button_id: id });
                return;
            }

            if (id === "maps-negocio" && /^https?:\/\//i.test(href)) {
                sidenAnalyticsEvent("directions_click", { button_id: id });
            }
        });

        // SCROLL REVEAL — aparición suave de módulos y tarjetas al entrar en pantalla.
        // Se ejecuta una sola vez por elemento y respeta las preferencias de movimiento reducido.
        const inicializarScrollReveal = function () {
            const selectoresReveal = [
                "main [data-module]:not([hidden])",
                ".service-card", ".benefit-card", ".product-card",
                ".gallery-item", ".process-step", ".google-review-card"
            ].join(",");
            const elementosReveal = Array.from(document.querySelectorAll(selectoresReveal))
                .filter(function (elemento) {
                    return !elemento.closest("[hidden]") &&
                        !elemento.classList.contains("siden-reveal") &&
                        elemento.getClientRects().length > 0;
                });

            if (!elementosReveal.length) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
                !("IntersectionObserver" in window)) {
                elementosReveal.forEach(function (elemento) { elemento.classList.add("siden-reveal-visible"); });
                return;
            }

            const observadorReveal = new IntersectionObserver(function (entradas, observador) {
                entradas.forEach(function (entrada) {
                    if (!entrada.isIntersecting) return;
                    entrada.target.classList.add("siden-reveal-visible");
                    observador.unobserve(entrada.target);
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

            elementosReveal.forEach(function (elemento, indice) {
                elemento.classList.add("siden-reveal");
                // Desfase corto y limitado para evitar que muchos elementos aparezcan a la vez.
                elemento.style.setProperty("--siden-reveal-delay", Math.min(indice % 4, 3) * 65 + "ms");
                observadorReveal.observe(elemento);
            });
        };
        inicializarScrollReveal();

        // El menú móvil se inicializa una sola vez desde el módulo común de navegación.
        // Evitamos registrar aquí un segundo click handler que pueda alternar dos veces el estado.
    } catch (error) {
        console.error("Error al inicializar la página SIDEN:", error);
    }
})();
