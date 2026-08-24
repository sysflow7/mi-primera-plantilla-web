// ==================================================
// SIDEN - MOTOR DE CONFIGURACIÓN DEL CLIENTE
// ==================================================
// El cliente se configura desde config.json.
// La plantilla decide qué módulos mostrar según tipoNegocio
// y/o modulos. El mismo motor funciona para modo single o multi.
// ==================================================

(async function () {
    "use strict";

    try {
        const respuesta = await fetch("config.json", { cache: "no-cache" });
        if (!respuesta.ok) throw new Error("No se pudo cargar config.json");

        const negocio = await respuesta.json();
        const tipo = String(negocio.tipoNegocio || "comercio").toLowerCase();

        const defaults = {
            comercio: ["presentacion", "beneficios", "servicios", "productos", "galeria", "ubicacion", "contacto"],
            profesional: ["presentacion", "perfil", "beneficios", "servicios", "galeria", "ubicacion", "contacto"],
            restaurante: ["presentacion", "beneficios", "servicios", "menu", "galeria", "ubicacion", "contacto"]
        };

        const aliases = {
            hardwarestore: "comercio",
            tienda: "comercio",
            comercio: "comercio",
            profesional: "profesional",
            abogado: "profesional",
            medico: "profesional",
            médico: "profesional",
            contador: "profesional",
            arquitecto: "profesional",
            electricista: "profesional",
            fotografo: "profesional",
            fotógrafo: "profesional",
            consultor: "profesional",
            psicologo: "profesional",
            psicólogo: "profesional",
            dentista: "profesional",
            restaurante: "restaurante",
            restaurant: "restaurante"
        };

        const tipoNormalizado = aliases[tipo] || "comercio";
        const modulos = Array.isArray(negocio.modulos)
            ? negocio.modulos
            : (defaults[tipoNormalizado] || defaults.comercio);

        const etiquetas = negocio.etiquetas || {};
        const texto = negocio.textos || {};

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

        // =========================
        // IDENTIDAD Y HERO
        // =========================
        setText("nav-logo", negocio.nombre);
        setText("nombre-negocio", negocio.nombre);
        setText("slogan-negocio", negocio.slogan);
        setText("tipo-negocio", negocio.etiquetaTipo || "");
        setText("descripcion-negocio", negocio.descripcion);
        setText("nombre-footer", negocio.nombre);
        setText("anio-actual", new Date().getFullYear());
        setText("telefono-negocio", negocio.telefono);
        setText("ciudad-negocio", negocio.ciudad);
        setText("direccion-linea", negocio.direccionTexto || "");

        const logo = document.getElementById("logo-negocio");
        if (logo && negocio.logo) {
            logo.src = "images/" + negocio.logo;
            logo.alt = "Logo de " + negocio.nombre;
        }

        const hero = document.getElementById("inicio");
        if (hero && negocio.heroImagen) {
            hero.style.setProperty("--hero-image", `url("images/${negocio.heroImagen}")`);
            hero.classList.add("hero-has-image");
        }

        // =========================
        // ETIQUETAS PERSONALIZABLES
        // =========================
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

        // =========================
        // MOSTRAR / OCULTAR MÓDULOS
        // =========================
        ["presentacion", "perfil", "beneficios", "servicios", "productos", "menu", "galeria", "ubicacion", "contacto"]
            .forEach(function (modulo) {
                showModule(modulo, modulos.includes(modulo));
            });

        // =========================
        // NAVEGACIÓN DINÁMICA
        // =========================
        const navLinks = document.getElementById("nav-links");
        const navLabels = {
            presentacion: etiquetas.presentacionMenu || "Nosotros",
            perfil: etiquetas.perfilMenu || "Perfil",
            beneficios: etiquetas.beneficiosMenu || "¿Por qué elegirnos?",
            servicios: etiquetas.serviciosMenu || "Servicios",
            productos: etiquetas.productosMenu || "Productos",
            menu: etiquetas.menuMenu || "Menú",
            galeria: etiquetas.galeriaMenu || "Galería",
            ubicacion: etiquetas.ubicacionMenu || "Ubicación",
            contacto: etiquetas.contactoMenu || "Contacto"
        };

        if (navLinks) {
            modulos.forEach(function (modulo) {
                if (modulo === "contacto" || document.getElementById(modulo)) {
                    const enlace = document.createElement("a");
                    enlace.href = "#" + modulo;
                    enlace.textContent = navLabels[modulo] || modulo;
                    navLinks.appendChild(enlace);
                }
            });
        }

        // =========================
        // WHATSAPP / REDES / MAPS
        // =========================
        const enlaceWhatsApp = "https://wa.me/" + negocio.whatsapp;
        ["whatsapp-principal", "whatsapp-final", "whatsapp-flotante"].forEach(function (id) {
            const elemento = document.getElementById(id);
            if (elemento) elemento.href = enlaceWhatsApp;
        });

        const facebook = document.getElementById("facebook-negocio");
        if (facebook) {
            facebook.href = negocio.facebook || "#";
            facebook.hidden = !(negocio.facebook && negocio.facebook.startsWith("http"));
        }

        const instagram = document.getElementById("instagram-negocio");
        if (instagram) {
            instagram.href = negocio.instagram || "#";
            instagram.hidden = !(negocio.instagram && negocio.instagram.startsWith("http"));
        }

        const maps = document.getElementById("maps-negocio");
        if (maps) {
            maps.href = negocio.maps || "#";
            maps.hidden = !(negocio.maps && negocio.maps.startsWith("http"));
        }

        const catalogo = document.getElementById("catalogo-negocio");
        if (catalogo) {
            catalogo.href = negocio.catalogo || "#";
            catalogo.hidden = !(negocio.catalogo && negocio.catalogo.startsWith("http"));
        }

        // =========================
        // PERFIL PROFESIONAL
        // =========================
        const perfil = negocio.perfil || {};
        setText("descripcion-perfil", perfil.descripcion || negocio.descripcion || "");
        const datosPerfil = document.getElementById("datos-perfil");
        if (datosPerfil && Array.isArray(perfil.datos)) {
            perfil.datos.forEach(function (dato) {
                addCard(datosPerfil, "profile-item", `<strong>${dato.titulo || ""}</strong><span>${dato.valor || ""}</span>`);
            });
        }

        // =========================
        // SERVICIOS
        // =========================
        const listaServicios = document.getElementById("lista-servicios");
        if (listaServicios && Array.isArray(negocio.servicios)) {
            negocio.servicios.forEach(function (servicio) {
                addCard(listaServicios, "service", `<h3>${servicio.nombre || ""}</h3><p>${servicio.descripcion || ""}</p>`);
            });
        }

        // =========================
        // PRODUCTOS
        // =========================
        const listaProductos = document.getElementById("lista-productos");
        if (listaProductos && Array.isArray(negocio.productos)) {
            negocio.productos.forEach(function (producto) {
                const mensaje = "Hola, estoy interesado en " + producto.nombre + (producto.precio ? " de " + producto.precio : "");
                const enlaceProducto = enlaceWhatsApp + "?text=" + encodeURIComponent(mensaje);
                addCard(listaProductos, "product", `
                    <img src="images/${producto.imagen}" alt="${producto.nombre || "Producto"} - ${negocio.nombre}" loading="lazy">
                    <div class="product-content">
                        <h3>${producto.nombre || ""}</h3>
                        <p>${producto.descripcion || ""}</p>
                        ${producto.precio ? `<strong>${producto.precio}</strong>` : ""}
                        <a class="product-whatsapp" href="${enlaceProducto}" target="_blank" rel="noopener noreferrer">💬 Consultar por WhatsApp</a>
                    </div>`);
            });
        }

        // =========================
        // MENÚ DE RESTAURANTE
        // =========================
        const listaMenu = document.getElementById("lista-menu");
        if (listaMenu && Array.isArray(negocio.menu)) {
            negocio.menu.forEach(function (item) {
                addCard(listaMenu, "menu-item", `
                    ${item.imagen ? `<img src="images/${item.imagen}" alt="${item.nombre || "Plato"}" loading="lazy">` : ""}
                    <div><h3>${item.nombre || ""}</h3><p>${item.descripcion || ""}</p>${item.precio ? `<strong>${item.precio}</strong>` : ""}</div>`);
            });
        }

        // =========================
        // BENEFICIOS
        // =========================
        const listaBeneficios = document.getElementById("lista-beneficios");
        if (listaBeneficios && Array.isArray(negocio.beneficios)) {
            negocio.beneficios.forEach(function (beneficio) {
                addCard(listaBeneficios, "benefit", `<div class="benefit-icon">✓</div><h3>${beneficio.titulo || ""}</h3><p>${beneficio.descripcion || ""}</p>`);
            });
        }

        // =========================
        // GALERÍA
        // =========================
        const listaGaleria = document.getElementById("lista-galeria");
        if (listaGaleria && Array.isArray(negocio.galeria)) {
            negocio.galeria.forEach(function (imagen, indice) {
                const foto = document.createElement("img");
                foto.src = "images/" + imagen;
                foto.alt = negocio.nombre + " - Foto " + (indice + 1);
                foto.loading = "lazy";
                listaGaleria.appendChild(foto);
            });
        }

        // =========================
        // CONTACTO: SIEMPRE DISPONIBLE
        // =========================
        const botonGuardarContacto = document.getElementById("guardar-contacto");
        if (botonGuardarContacto) {
            botonGuardarContacto.addEventListener("click", function () {
                const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${negocio.nombre}\nORG:${negocio.nombre}\nTEL;TYPE=CELL:${negocio.whatsapp}\nTEL;TYPE=WORK:${negocio.telefono}\nADR;TYPE=WORK:;;${negocio.ciudad};;;\nURL:${window.location.href}\nEND:VCARD`;
                const archivo = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
                const url = URL.createObjectURL(archivo);
                const enlace = document.createElement("a");
                enlace.href = url;
                enlace.download = negocio.nombre + ".vcf";
                document.body.appendChild(enlace);
                enlace.click();
                document.body.removeChild(enlace);
                URL.revokeObjectURL(url);
            });
        }

        const botonCompartirNegocio = document.getElementById("compartir-negocio");
        if (botonCompartirNegocio) {
            botonCompartirNegocio.addEventListener("click", async function () {
                const datosCompartir = { title: negocio.nombre, text: "Te comparto " + negocio.nombre + ".", url: window.location.href };
                if (navigator.share) {
                    try { await navigator.share(datosCompartir); } catch (error) { /* cancelado */ }
                } else {
                    try {
                        await navigator.clipboard.writeText("Te comparto " + negocio.nombre + ": " + window.location.href);
                        alert("El enlace del negocio fue copiado.");
                    } catch (error) {
                        alert("Copia este enlace para compartir el negocio:\n\n" + window.location.href);
                    }
                }
            });
        }

        // =========================
        // MENÚ MÓVIL
        // =========================
        const menuButton = document.getElementById("menu-button");
        if (menuButton && navLinks) {
            menuButton.addEventListener("click", function () { navLinks.classList.toggle("active"); });
            navLinks.querySelectorAll("a").forEach(function (enlace) {
                enlace.addEventListener("click", function () { navLinks.classList.remove("active"); });
            });
        }

        // =========================
        // PREPARACIÓN PARA MULTIPÁGINA
        // =========================
        // Si modoSitio === "multi", cada objeto de paginas puede definir
        // nombre, ruta y módulos. El menú queda listo para enlazar esas rutas.
        if (negocio.modoSitio === "multi" && Array.isArray(negocio.paginas) && navLinks) {
            navLinks.innerHTML = "";
            negocio.paginas.forEach(function (pagina) {
                const enlace = document.createElement("a");
                enlace.href = pagina.ruta || "#";
                enlace.textContent = pagina.nombre || "Página";
                navLinks.appendChild(enlace);
            });
        }

    } catch (error) {
        console.error("Error al inicializar la página SIDEN:", error);
    }
})();
