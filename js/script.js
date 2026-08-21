// ==================================================
// SIDEN - CONFIGURACIÓN DEL CLIENTE
// ==================================================
//
// La información personalizada vive en /config.json.
// Para crear un nuevo cliente, modifica solamente ese archivo.
// A partir de aquí, este archivo NO debe modificarse por cliente.
//
// ==================================================

(async function () {

    "use strict";

    try {

        const respuesta = await fetch("config.json", {
            cache: "no-cache"
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar config.json");
        }

        const negocio = await respuesta.json();

        // =========================
        // DATOS GENERALES
        // =========================

        document.title = negocio.nombre;

        const navLogo = document.getElementById("nav-logo");
        if (navLogo) navLogo.textContent = negocio.nombre;

        const logo = document.getElementById("logo-negocio");
        if (logo) {
            logo.src = "images/" + negocio.logo;
            logo.alt = "Logo de " + negocio.nombre;
        }

        const nombre = document.getElementById("nombre-negocio");
        if (nombre) nombre.textContent = negocio.nombre;

        const slogan = document.getElementById("slogan-negocio");
        if (slogan) slogan.textContent = negocio.slogan;

        const descripcion = document.getElementById("descripcion-negocio");
        if (descripcion) descripcion.textContent = negocio.descripcion;

        const telefono = document.getElementById("telefono-negocio");
        if (telefono) telefono.textContent = negocio.telefono;

        const ciudad = document.getElementById("ciudad-negocio");
        if (ciudad) ciudad.textContent = negocio.ciudad;

        const footer = document.getElementById("nombre-footer");
        if (footer) footer.textContent = negocio.nombre;

        const anio = document.getElementById("anio-actual");
        if (anio) anio.textContent = new Date().getFullYear();

        // =========================
        // WHATSAPP
        // =========================

        const enlaceWhatsApp =
            "https://wa.me/" + negocio.whatsapp;

        const whatsappPrincipal =
            document.getElementById("whatsapp-principal");
        if (whatsappPrincipal) whatsappPrincipal.href = enlaceWhatsApp;

        const whatsappFinal =
            document.getElementById("whatsapp-final");
        if (whatsappFinal) whatsappFinal.href = enlaceWhatsApp;

        const whatsappFlotante =
            document.getElementById("whatsapp-flotante");
        if (whatsappFlotante) whatsappFlotante.href = enlaceWhatsApp;

        // =========================
        // REDES SOCIALES
        // =========================

        const facebook =
            document.getElementById("facebook-negocio");
        if (facebook) facebook.href = negocio.facebook;

        const instagram =
            document.getElementById("instagram-negocio");
        if (instagram) instagram.href = negocio.instagram;

        // =========================
        // GOOGLE MAPS
        // =========================

        const maps =
            document.getElementById("maps-negocio");
        if (maps) maps.href = negocio.maps;

        // =========================
        // CATÁLOGO WHATSAPP
        // =========================

        const catalogo =
            document.getElementById("catalogo-negocio");
        if (catalogo) catalogo.href = negocio.catalogo;

        // =========================
        // SERVICIOS
        // =========================

        const listaServicios =
            document.getElementById("lista-servicios");

        negocio.servicios.forEach(function (servicio) {

            const tarjeta = document.createElement("div");
            tarjeta.className = "service";

            tarjeta.innerHTML = `
                <h3>${servicio.nombre}</h3>
                <p>${servicio.descripcion}</p>
            `;

            listaServicios.appendChild(tarjeta);

        });

        // =========================
        // PRODUCTOS
        // =========================

        const listaProductos =
            document.getElementById("lista-productos");

        negocio.productos.forEach(function (producto) {

            const tarjeta = document.createElement("div");
            tarjeta.className = "product";

            const mensaje =
                "Hola, estoy interesado en " +
                producto.nombre +
                " de " +
                producto.precio;

            const enlaceProducto =
                "https://wa.me/" +
                negocio.whatsapp +
                "?text=" +
                encodeURIComponent(mensaje);

            tarjeta.innerHTML = `
                <img
                    src="images/${producto.imagen}"
                    alt="${producto.nombre} - ${negocio.nombre}"
                    loading="lazy"
                >

                <div class="product-content">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <strong>${producto.precio}</strong>

                    <a
                        class="product-whatsapp"
                        href="${enlaceProducto}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        💬 Consultar por WhatsApp
                    </a>
                </div>
            `;

            listaProductos.appendChild(tarjeta);

        });

        // =========================
        // MENÚ MÓVIL
        // =========================

        const menuButton =
            document.getElementById("menu-button");

        const navLinks =
            document.getElementById("nav-links");

        menuButton.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });

        const enlacesMenu =
            navLinks.querySelectorAll("a");

        enlacesMenu.forEach(function (enlace) {
            enlace.addEventListener("click", function () {
                navLinks.classList.remove("active");
            });
        });

        // =========================
        // BENEFICIOS
        // =========================

        const listaBeneficios =
            document.getElementById("lista-beneficios");

        negocio.beneficios.forEach(function (beneficio) {

            const tarjeta = document.createElement("div");
            tarjeta.className = "benefit";

            tarjeta.innerHTML = `
                <div class="benefit-icon">✓</div>
                <h3>${beneficio.titulo}</h3>
                <p>${beneficio.descripcion}</p>
            `;

            listaBeneficios.appendChild(tarjeta);

        });

        // =========================
        // GALERÍA
        // =========================

        const listaGaleria =
            document.getElementById("lista-galeria");

        negocio.galeria.forEach(function (imagen, indice) {

            const foto = document.createElement("img");

            foto.src = "images/" + imagen;
            foto.alt = negocio.nombre + " - Foto " + (indice + 1);
            foto.loading = "lazy";

            listaGaleria.appendChild(foto);

        });

        // =========================
        // GUARDAR CONTACTO
        // =========================

        const botonGuardarContacto =
            document.getElementById("guardar-contacto");

        botonGuardarContacto.addEventListener("click", function () {

            const vcard =
`BEGIN:VCARD
VERSION:3.0
FN:${negocio.nombre}
ORG:${negocio.nombre}
TEL;TYPE=CELL:${negocio.whatsapp}
TEL;TYPE=WORK:${negocio.telefono}
ADR;TYPE=WORK:;;${negocio.ciudad};;;
URL:${window.location.href}
END:VCARD`;

            const archivo = new Blob(
                [vcard],
                { type: "text/vcard;charset=utf-8" }
            );

            const url = URL.createObjectURL(archivo);
            const enlace = document.createElement("a");

            enlace.href = url;
            enlace.download = negocio.nombre + ".vcf";

            document.body.appendChild(enlace);
            enlace.click();
            document.body.removeChild(enlace);

            URL.revokeObjectURL(url);

        });

        // =========================
        // COMPARTIR NEGOCIO
        // =========================

        const botonCompartirNegocio =
            document.getElementById("compartir-negocio");

        botonCompartirNegocio.addEventListener("click", async function () {

            const datosCompartir = {
                title: negocio.nombre,
                text:
                    "Te comparto " +
                    negocio.nombre +
                    ". Puedes contactarlos por WhatsApp:",
                url: window.location.href
            };

            if (navigator.share) {

                try {
                    await navigator.share(datosCompartir);
                } catch (error) {
                    // El usuario canceló el menú de compartir.
                }

            } else {

                const texto =
                    "Te comparto " +
                    negocio.nombre +
                    ": " +
                    window.location.href;

                try {

                    await navigator.clipboard.writeText(texto);

                    alert(
                        "El enlace del negocio fue copiado. " +
                        "Ahora puedes pegarlo y compartirlo."
                    );

                } catch (error) {

                    alert(
                        "Copia este enlace para compartir el negocio:\n\n" +
                        window.location.href
                    );

                }

            }

        });

    } catch (error) {

        console.error("Error al inicializar la página SIDEN:", error);

    }

})();
