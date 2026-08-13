const negocio = {

    nombre: "Mi Negocio",

    slogan: "Calidad, confianza y servicio profesional",

    whatsapp: "50300000000",

    telefono: "+503 0000-0000",

    ciudad: "San Salvador, El Salvador",

    facebook: "#",

    instagram: "#",

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
            precio: "$15.00",
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

    ]

};

// =========================
// DATOS GENERALES
// =========================

document.getElementById("nombre-negocio").textContent =
    negocio.nombre;

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
