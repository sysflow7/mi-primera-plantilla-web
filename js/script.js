const negocio = {

    nombre: "Mi Negocio",

    slogan: "Calidad, confianza y servicio profesional",

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
            nombre: "Servicio 1",
            descripcion: "Descripción del primer servicio que ofrece el negocio."
        },

        {
            nombre: "Servicio 2",
            descripcion: "Descripción del segundo servicio que ofrece el negocio."
        },

        {
            nombre: "Servicio 3",
            descripcion: "Descripción del tercer servicio que ofrece el negocio."
        }

    ],

        productos: [

        {
            nombre: "Producto 1",
            precio: "$30.00",
            descripcion: "Descripción breve del producto.",
            imagen: "producto1.jpg"
        },

        {
            nombre: "Producto 2",
            precio: "$25.00",
            descripcion: "Descripción breve del producto.",
            imagen: "producto2.jpg"
        },

        {
            nombre: "Producto 3",
            precio: "$35.00",
            descripcion: "Descripción breve del producto.",
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
        titulo: "Atención personalizada",
        descripcion: "Te ayudamos a encontrar la solución adecuada para tus necesidades."
    },

    {
        titulo: "Productos de calidad",
        descripcion: "Seleccionamos productos confiables para nuestros clientes."
    },

    {
        titulo: "Servicio rápido",
        descripcion: "Atendemos tus consultas de forma rápida y eficiente."
    },

    {
        titulo: "Confianza",
        descripcion: "Trabajamos para brindar una atención responsable y profesional."
    }

]    

};

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

