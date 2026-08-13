const negocio = {

    nombre: "Ferretería El Constructor",

    slogan: "Todo para tus proyectos",

    whatsapp: "50371234567",

    telefono: "+503 7123-4567",

    ciudad: "San Salvador, El Salvador",

    facebook: "https://facebook.com/...",

    instagram: "https://instagram.com/..."

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
