// ==================================================
// CONFIGURACIÓN DEL NEGOCIO
// ==================================================
//
// ⚠️ ESTA ES LA ÚNICA SECCIÓN QUE DEBES MODIFICAR
// CUANDO CREES UNA PÁGINA PARA UN NUEVO CLIENTE.
//
// ==================================================

const negocio = {

    nombre: "Ferretería El Constructor",

    slogan: "Todo para construir tus proyectos",

    whatsapp: "50300000000",

    telefono: "+503 0000-0000",

    ciudad: "San Salvador, El Salvador",

    facebook: "#",

    instagram: "#",

    maps: "https://www.google.com/maps",

    catalogo: "https://wa.me/c/50300000000",

    logo: "logo.png",

    servicios: [

        {
            nombre: "Herramientas",
            descripcion: "Encuentra herramientas para tus proyectos de construcción y reparación."
        },

        {
            nombre: "Materiales de construcción",
            descripcion: "Productos y materiales para tus proyectos de construcción."
        },

        {
            nombre: "Accesorios para el hogar",
            descripcion: "Soluciones prácticas para mantenimiento y reparación del hogar."
        }

    ],

        productos: [

        {
            nombre: "Taladro Profesional",
            precio: "$49.99",
            descripcion: "Taladro profesional para trabajos del hogar y construcción.",
            imagen: "producto1.jpg"
        },

        {
            nombre: "Juego de Herramientas",
            precio: "$35.00",
            descripcion: "Kit de herramientas para reparaciones y mantenimiento.",
            imagen: "producto2.jpg"
        },

        {
            nombre: "Lámpara LED",
            precio: "$15.00",
            descripcion: "Lámpara LED para iluminación del hogar y espacios de trabajo.",
            imagen: "producto3.jpg"
        }

    ],

    galeria: [
        "foto1.jpg",
        "foto2.jpg",
        "foto3.jpg"
    ],    

beneficios: [

    {
        titulo: "Productos de calidad",
        descripcion: "Seleccionamos productos confiables para nuestros clientes."
    },

    {
        titulo: "Atención personalizada",
        descripcion: "Te ayudamos a encontrar lo que necesitas para tu proyecto."
    },

    {
        titulo: "Amplia variedad",
        descripcion: "Encuentra diferentes opciones de herramientas y materiales."
    },

    {
        titulo: "Experiencia",
        descripcion: "Estamos para ayudarte a encontrar la solución adecuada."
    }

]    

};

// ==================================================
// FIN DE CONFIGURACIÓN DEL NEGOCIO
// ==================================================
//
// ⚠️ A PARTIR DE AQUÍ NO MODIFICAR
// ==================================================

// =========================
// DATOS GENERALES
// =========================

document.getElementById("nombre-negocio").textContent =
    negocio.nombre;

document.getElementById("logo-negocio").src =
    "images/" + negocio.logo;

document.getElementById("slogan-negocio").textContent =
    negocio.slogan;

document.getElementById("telefono-negocio").textContent =
    negocio.telefono;

document.getElementById("ciudad-negocio").textContent =
    negocio.ciudad;


// =========================
// WHATSAPP
// =========================

    const enlaceWhatsApp =
    "https://wa.me/" + negocio.whatsapp;


document.getElementById("whatsapp-principal").href =
    enlaceWhatsApp;


document.getElementById("whatsapp-final").href =
    enlaceWhatsApp;

document.getElementById("whatsapp-flotante").href =
    enlaceWhatsApp;

// =========================
// REDES SOCIALES
// =========================

document.getElementById("facebook-negocio").href =
    negocio.facebook;


document.getElementById("instagram-negocio").href =
    negocio.instagram;

// =========================
// GOOGLE MAPS
// =========================

document.getElementById("maps-negocio").href =
    negocio.maps;

// =========================
// CATÁLOGO WHATSAPP
// =========================

document.getElementById("catalogo-negocio").href =
    negocio.catalogo;

// =========================
// SERVICIOS
// =========================

const listaServicios =
    document.getElementById("lista-servicios");


negocio.servicios.forEach(function(servicio) {

    const tarjeta = document.createElement("div");

    tarjeta.className = "service";


    tarjeta.innerHTML = `

        <h3>${servicio.nombre}</h3>

        <p>
            ${servicio.descripcion}
        </p>

    `;


    listaServicios.appendChild(tarjeta);

});

// =========================
// PRODUCTOS
// =========================

const listaProductos =
    document.getElementById("lista-productos");


negocio.productos.forEach(function(producto) {

    const tarjeta =
        document.createElement("div");

    tarjeta.className = "product";


    const mensaje =
        "Hola, estoy interesado en " +
        producto.nombre +
        " de " +
        producto.precio;


    const enlaceWhatsApp =
        "https://wa.me/" +
        negocio.whatsapp +
        "?text=" +
        encodeURIComponent(mensaje);


    tarjeta.innerHTML = `

        <img
            src="images/${producto.imagen}"
            alt="${producto.nombre}"
        >

        <div class="product-content">

            <h3>
                ${producto.nombre}
            </h3>

            <p>
                ${producto.descripcion}
            </p>

            <strong>
                ${producto.precio}
            </strong>

            <a
                class="product-whatsapp"
                href="${enlaceWhatsApp}"
                target="_blank"
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


menuButton.addEventListener("click", function() {

    navLinks.classList.toggle("active");

});


const enlacesMenu =
    navLinks.querySelectorAll("a");


enlacesMenu.forEach(function(enlace) {

    enlace.addEventListener("click", function() {

        navLinks.classList.remove("active");

    });

});


// =========================
// BENEFICIOS
// =========================

const listaBeneficios =
    document.getElementById("lista-beneficios");


negocio.beneficios.forEach(function(beneficio) {

    const tarjeta =
        document.createElement("div");

    tarjeta.className = "benefit";


    tarjeta.innerHTML = `

        <div class="benefit-icon">
            ✓
        </div>

        <h3>
            ${beneficio.titulo}
        </h3>

        <p>
            ${beneficio.descripcion}
        </p>

    `;


    listaBeneficios.appendChild(tarjeta);

});


// =========================
// GALERÍA
// =========================

const listaGaleria =
    document.getElementById("lista-galeria");


negocio.galeria.forEach(function(imagen, indice) {

    const foto =
        document.createElement("img");

    foto.src =
        "images/" + imagen;

    foto.alt =
        negocio.nombre + " - Foto " + (indice + 1);

    listaGaleria.appendChild(foto);

});

// =========================
// GUARDAR CONTACTO
// =========================

const botonGuardarContacto =
    document.getElementById("guardar-contacto");


botonGuardarContacto.addEventListener("click", function() {

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


    const archivo =
        new Blob(
            [vcard],
            { type: "text/vcard;charset=utf-8" }
        );


    const url =
        URL.createObjectURL(archivo);


    const enlace =
        document.createElement("a");


    enlace.href = url;

    enlace.download =
        negocio.nombre + ".vcf";


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


botonCompartirNegocio.addEventListener("click", async function() {

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
            // No hacemos nada.

        }

    } else {

        // Alternativa para navegadores
        // que no soportan compartir de forma nativa.

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

