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
        document.body.dataset.templateFamily = templateFamily;
        document.body.classList.add("siden-template-" + templateFamily);
        const assetPrefix = String(siden.assetPrefix || "").replace(/\/+$/, "");
        const previewSite = new URLSearchParams(window.location.search).get("site");
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
        const rutaActual = window.location.pathname.replace(/\/$/, "") || "/";
        const esMulti = negocioBase.modoSitio === "multi" && Array.isArray(negocioBase.paginas);
        let negocio = { ...negocioBase };
        let paginaActual = null;

        if (esMulti) {
            paginaActual = negocioBase.paginas.find(function (pagina) {
                const ruta = String(pagina.ruta || "/").replace(/\/$/, "") || "/";
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
        const escapeHtml = function (value) {
            return String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
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
        if (navLogo) navLogo.href = esMulti ? "/" : "#inicio";

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
        if (logo && negocioBase.logo) {
            logo.src = assetUrl("images/" + negocioBase.logo);
            logo.alt = "Logo de " + negocioBase.nombre;
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
                };
                imagenHero.src = rutaHero;
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

        ["presentacion", "perfil", "beneficios", "servicios", "productos", "menu", "galeria", "ubicacion", "contacto"].forEach(function (modulo) {
            const visible = modulo === "galeria" ? galeriaActiva : modulos.includes(modulo);
            showModule(modulo, visible);
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
        const navTargets = { presentacion: "nosotros", perfil: "perfil", beneficios: "beneficios", servicios: "servicios", productos: "productos", menu: "menu", galeria: "galeria", ubicacion: "ubicacion", contacto: "contacto" };
        const navLabels = {
            presentacion: etiquetas.presentacionMenu || "Nosotros", perfil: etiquetas.perfilMenu || "Perfil",
            beneficios: etiquetas.beneficiosMenu || "¿Por qué elegirnos?", servicios: etiquetas.serviciosMenu || "Servicios",
            productos: etiquetas.productosMenu || "Productos", menu: etiquetas.menuMenu || "Menú",
            galeria: etiquetas.galeriaMenu || "Galería", ubicacion: etiquetas.ubicacionMenu || "Ubicación",
            contacto: etiquetas.contactoMenu || "Contacto"
        };

        if (navLinks) {
            navLinks.innerHTML = "";
            if (esMulti && negocioBase.paginas.length > 0) {
                negocioBase.paginas.forEach(function (pagina) {
                    const enlace = document.createElement("a");
                    enlace.href = pagina.ruta || "/";
                    enlace.textContent = pagina.nombre || "Página";
                    navLinks.appendChild(enlace);
                });
            } else {
                modulos.filter(function (modulo) {
                    return modulo !== "galeria" || galeriaActiva;
                }).forEach(function (modulo) {
                    const target = navTargets[modulo];
                    if (!target) return;
                    const enlace = document.createElement("a");
                    enlace.href = "#" + target;
                    enlace.textContent = navLabels[modulo] || modulo;
                    navLinks.appendChild(enlace);
                });
            }
        }

        // CONTACTO Y ENLACES
        const whatsapp = String(negocioBase.whatsapp || "").replace(/\D/g, "");
        const enlaceWhatsApp = whatsapp ? "https://wa.me/" + whatsapp : "#";
        ["whatsapp-principal", "whatsapp-final", "whatsapp-flotante", "pagina-whatsapp"].forEach(function (id) {
            const elemento = document.getElementById(id);
            if (elemento) elemento.href = enlaceWhatsApp;
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
        if (facebook) { facebook.href = negocioBase.facebook || "#"; facebook.hidden = !(negocioBase.facebook && negocioBase.facebook.startsWith("http")); }
        const instagram = document.getElementById("instagram-negocio");
        if (instagram) { instagram.href = negocioBase.instagram || "#"; instagram.hidden = !(negocioBase.instagram && negocioBase.instagram.startsWith("http")); }
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

        if (mapaWrap && mapaIframe) {
            if (mapaValido) {
                mapaIframe.src = mapEmbedUrl;
                mapaWrap.hidden = false;
                mapaWrap.style.display = "block";
            } else {
                mapaIframe.removeAttribute("src");
                mapaWrap.hidden = true;
                mapaWrap.style.display = "none";
            }
        }
        const horarioUbicacion = document.getElementById("horario-ubicacion");
        if (horarioUbicacion) {
            const horarios = Array.isArray(negocioBase.horarios) ? negocioBase.horarios : [];
            if (horarios.length) {
                const dias = {Monday:"Lunes",Tuesday:"Martes",Wednesday:"Miércoles",Thursday:"Jueves",Friday:"Viernes",Saturday:"Sábado",Sunday:"Domingo"};
                const bloques = horarios.map(function(h) {
                    const nombres = Array.isArray(h.dias) ? h.dias.map(function(d){ return dias[d] || d; }).join(", ") : "";
                    return [nombres, h.abre && h.cierra ? h.abre + "–" + h.cierra : ""].filter(Boolean).join(": ");
                }).filter(Boolean);
                horarioUbicacion.textContent = bloques.join(" · ");
                horarioUbicacion.hidden = !bloques.length;
            } else {
                horarioUbicacion.textContent = "";
                horarioUbicacion.hidden = true;
            }
        }
        const telefonoUbicacion = document.getElementById("telefono-ubicacion");
        if (telefonoUbicacion) telefonoUbicacion.hidden = !String(negocioBase.telefono || "").trim();
        const paginaUbicacion = document.getElementById("pagina-ubicacion");
        if (paginaUbicacion) { paginaUbicacion.href = negocioBase.maps || "#"; paginaUbicacion.hidden = !(negocioBase.maps && negocioBase.maps.startsWith("http")); }
        const catalogo = document.getElementById("catalogo-negocio");
        if (catalogo) { catalogo.href = negocioBase.catalogo || "#"; catalogo.hidden = !(negocioBase.catalogo && negocioBase.catalogo.startsWith("http")); }

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

        // PRODUCTOS
        const listaProductos = document.getElementById("lista-productos");
        if (listaProductos && Array.isArray(negocio.productos)) {
            listaProductos.innerHTML = "";
            negocio.productos.forEach(function (producto) {
                const mensaje = "Hola, estoy interesado en " + String(producto.nombre || "") + (producto.precio ? " de " + String(producto.precio) : "");
                const enlaceProducto = enlaceWhatsApp + "?text=" + encodeURIComponent(mensaje);
                const imagen = producto.imagen ? assetUrl("images/" + producto.imagen) : "";
                addCard(listaProductos, "product", `<img src="${escapeHtml(imagen)}" alt="${escapeHtml(producto.nombre || "Producto")} - ${escapeHtml(negocioBase.nombre)}" loading="lazy"><div class="product-content"><h3>${escapeHtml(producto.nombre)}</h3><p>${escapeHtml(producto.descripcion)}</p>${producto.precio ? `<strong>${escapeHtml(producto.precio)}</strong>` : ""}<a class="product-whatsapp" href="${escapeHtml(enlaceProducto)}" target="_blank" rel="noopener noreferrer">💬 Consultar por WhatsApp</a></div>`);
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
        const mostrarSolucionesSiden = negocio.mostrarSolucionesSiden !== false;
        showModule("soluciones", mostrarSolucionesSiden);

        const faqSidenDefault = [
            ["¿Necesito saber de tecnología para tener una página web?", "No. SIDeN se encarga de la parte técnica y organiza la información para que tu presencia sea clara y fácil de utilizar."],
            ["¿La página funciona en celulares?", "Sí. El diseño se plantea para adaptarse a celulares, tablets y computadoras."],
            ["¿El SEO incluido en los planes es SEO local?", "Los planes Web incluyen SEO básico. La gestión de Perfil de Empresa de Google y los servicios de SEO local forman parte de soluciones adicionales y no están incluidos en estos planes."],
            ["¿Puedo conectar WhatsApp?", "Sí. Los planes Web incluyen un botón de WhatsApp para facilitar el contacto directo. Además, cada plan contempla un catálogo de WhatsApp Presencia con el límite indicado en su alcance."],
            ["¿Puedo agregar más cosas después?", "Sí. La idea es construir una base que pueda crecer con las necesidades de tu negocio. Las funciones adicionales pueden cotizarse por separado."],
            ["¿Cuánto tiempo dura el servicio?", "Los planes se contratan por 12 meses e incluyen hosting, SSL, mantenimiento básico, soporte básico y las condiciones de actualización indicadas en cada plan. La renovación anual se realiza para continuar con el servicio."]
        ];
        const faqActivo = faqConfig.activo !== false;
        showModule("faq", faqActivo);
        if (faqActivo) {
            const faqTitulo = faqConfig.titulo || etiquetas.faq || "Preguntas frecuentes";
            setText("titulo-faq", faqTitulo);
            const faqLista = document.getElementById("lista-faq");
            if (faqLista) {
                const preguntasNegocio = Array.isArray(faqConfig.preguntas)
                    ? faqConfig.preguntas.filter(function (item) { return item && String(item.pregunta || "").trim() && String(item.respuesta || "").trim(); })
                    : [];
                const preguntas = preguntasNegocio.length ? preguntasNegocio : faqSidenDefault.map(function (item) { return { pregunta: item[0], respuesta: item[1] }; });
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

        // El menú móvil se inicializa una sola vez desde el módulo común de navegación.
        // Evitamos registrar aquí un segundo click handler que pueda alternar dos veces el estado.
    } catch (error) {
        console.error("Error al inicializar la página SIDEN:", error);
    }
})();
