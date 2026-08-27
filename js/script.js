// ==================================================
// SIDEN - MOTOR DE CONFIGURACIÓN DEL CLIENTE
// ==================================================

(async function () {
    "use strict";

    try {
        const respuesta = await fetch("config.json", { cache: "no-cache" });
        if (!respuesta.ok) throw new Error("No se pudo cargar config.json");

        const negocioBase = await respuesta.json();
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
        setText("nav-logo", negocioBase.nombre);
        setText("nombre-negocio", negocioBase.nombre);
        setText("slogan-negocio", paginaActual?.slogan || negocioBase.slogan);
        setText("tipo-negocio", negocioBase.etiquetaTipo || "");
        setText("descripcion-negocio", negocio.descripcion);
        setText("nombre-footer", negocioBase.nombre);
        setText("anio-actual", new Date().getFullYear());
        setText("telefono-negocio", negocioBase.telefono);
        setText("ciudad-negocio", negocioBase.ciudad);
        setText("direccion-linea", negocioBase.direccionTexto || "");

        const navLogo = document.getElementById("nav-logo");
        if (navLogo) navLogo.href = esMulti ? "/" : "#inicio";

        const logo = document.getElementById("logo-negocio");
        if (logo && negocioBase.logo) {
            logo.src = "images/" + negocioBase.logo;
            logo.alt = "Logo de " + negocioBase.nombre;
        }

        // HERO / CABECERA INTERNA
        const hero = document.getElementById("inicio");
        const paginaCabecera = document.getElementById("pagina-cabecera");
        const nombreHero = negocio.heroImagen || negocioBase.heroImagen;
        const esPaginaInterna = esMulti && rutaActual !== "/" && !!paginaActual;

        if (hero) {
            if (esPaginaInterna) {
                hero.hidden = true;
                document.body.classList.add("multi-inner-page");
            } else if (nombreHero) {
                const rutaHero = "images/" + nombreHero;
                const imagenHero = new Image();
                imagenHero.onload = function () {
                    hero.style.backgroundImage = `url("${rutaHero}")`;
                    hero.style.backgroundSize = "cover";
                    hero.style.backgroundPosition = "center";
                    hero.classList.add("hero-has-image");
                };
                imagenHero.onerror = function () {
                    console.error("SIDEN: no se pudo cargar la imagen del Hero:", rutaHero);
                    hero.classList.remove("hero-has-image");
                };
                imagenHero.src = rutaHero;
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

        // ETIQUETAS
        setText("titulo-presentacion", etiquetas.presentacion || "¿Quiénes somos?");
        setText("titulo-perfil", etiquetas.perfil || "Perfil profesional");
        setText("titulo-beneficios", etiquetas.beneficios || "¿Por qué elegirnos?");
        setText("titulo-servicios", etiquetas.servicios || "Nuestros servicios");
        setText("titulo-productos", etiquetas.productos || "Productos destacados");
        setText("titulo-menu", etiquetas.menu || "Nuestro menú");
        setText("titulo-galeria", etiquetas.galeria || "Galería");
        setText("titulo-ubicacion", etiquetas.ubicacion || "Encuéntranos");
        setText("titulo-contacto", etiquetas.contacto || "¿Tienes alguna pregunta?");
        setText("texto-contacto", texto.contacto || "Estamos disponibles para atenderte.");

        // MÓDULOS
        ["presentacion", "perfil", "beneficios", "servicios", "productos", "menu", "galeria", "ubicacion", "contacto"].forEach(function (modulo) {
            showModule(modulo, modulos.includes(modulo));
        });

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
                modulos.forEach(function (modulo) {
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
        const enlaceWhatsApp = "https://wa.me/" + negocioBase.whatsapp;
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
        if (maps) { maps.href = negocioBase.maps || "#"; maps.hidden = !(negocioBase.maps && negocioBase.maps.startsWith("http")); }
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
                addCard(listaProductos, "product", `<img src="images/${escapeHtml(producto.imagen)}" alt="${escapeHtml(producto.nombre || "Producto")} - ${escapeHtml(negocioBase.nombre)}" loading="lazy"><div class="product-content"><h3>${escapeHtml(producto.nombre)}</h3><p>${escapeHtml(producto.descripcion)}</p>${producto.precio ? `<strong>${escapeHtml(producto.precio)}</strong>` : ""}<a class="product-whatsapp" href="${escapeHtml(enlaceProducto)}" target="_blank" rel="noopener noreferrer">💬 Consultar por WhatsApp</a></div>`);
            });
        }

        // MENÚ
        const listaMenu = document.getElementById("lista-menu");
        if (listaMenu && Array.isArray(negocio.menu)) {
            listaMenu.innerHTML = "";
            negocio.menu.forEach(function (item) {
                addCard(listaMenu, "menu-item", `${item.imagen ? `<img src="images/${escapeHtml(item.imagen)}" alt="${escapeHtml(item.nombre || "Plato")}" loading="lazy">` : ""}<div><small class="menu-category">${escapeHtml(item.categoria)}</small><h3>${escapeHtml(item.nombre)}</h3><p>${escapeHtml(item.descripcion)}</p>${item.precio ? `<strong>${escapeHtml(item.precio)}</strong>` : ""}</div>`);
            });
        }

        // BENEFICIOS
        const listaBeneficios = document.getElementById("lista-beneficios");
        if (listaBeneficios && Array.isArray(negocio.beneficios)) {
            listaBeneficios.innerHTML = "";
            negocio.beneficios.forEach(function (beneficio) {
                addCard(listaBeneficios, "benefit", `<div class="benefit-icon">✓</div><h3>${escapeHtml(beneficio.titulo)}</h3><p>${escapeHtml(beneficio.descripcion)}</p>`);
            });
        }

        // GALERÍA
        const listaGaleria = document.getElementById("lista-galeria");
        if (listaGaleria && Array.isArray(negocio.galeria)) {
            listaGaleria.innerHTML = "";
            negocio.galeria.forEach(function (imagen, indice) {
                const foto = document.createElement("img");
                foto.src = "images/" + imagen;
                foto.alt = negocioBase.nombre + " - Foto " + (indice + 1);
                foto.loading = "lazy";
                listaGaleria.appendChild(foto);
            });
        }

        // ACCIONES COMUNES
        const crearVCard = function () {
            const lineasVcard = [
                "BEGIN:VCARD",
                "VERSION:3.0",
                "FN:" + negocioBase.nombre,
                "ORG:" + negocioBase.nombre,
                "TEL;TYPE=CELL:" + negocioBase.whatsapp,
                "TEL;TYPE=WORK:" + negocioBase.telefono,
                "ADR;TYPE=WORK:;;" + negocioBase.ciudad + ";;;",
                email ? "EMAIL;TYPE=INTERNET:" + email : "",
                "URL:" + window.location.href,
                "END:VCARD"
            ].filter(Boolean);
            const archivo = new Blob([lineasVcard.join("\n")], { type: "text/vcard;charset=utf-8" });
            const url = URL.createObjectURL(archivo);
            const enlace = document.createElement("a");
            enlace.href = url;
            enlace.download = negocioBase.nombre + ".vcf";
            document.body.appendChild(enlace);
            enlace.click();
            document.body.removeChild(enlace);
            URL.revokeObjectURL(url);
        };

        const compartirNegocio = async function () {
            const datosCompartir = { title: negocioBase.nombre, text: "Te comparto " + negocioBase.nombre + ".", url: window.location.href };
            if (navigator.share) {
                try { await navigator.share(datosCompartir); } catch (error) { /* cancelado */ }
            } else {
                try { await navigator.clipboard.writeText("Te comparto " + negocioBase.nombre + ": " + window.location.href); alert("El enlace del negocio fue copiado."); }
                catch (error) { alert("Copia este enlace para compartir el negocio:\n\n" + window.location.href); }
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

        // MENÚ MÓVIL
        const menuButton = document.getElementById("menu-button");
        if (menuButton && navLinks) {
            menuButton.addEventListener("click", function () { navLinks.classList.toggle("active"); });
            navLinks.querySelectorAll("a").forEach(function (enlace) { enlace.addEventListener("click", function () { navLinks.classList.remove("active"); }); });
        }
    } catch (error) {
        console.error("Error al inicializar la página SIDEN:", error);
    }
})();
