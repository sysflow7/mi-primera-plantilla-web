// ==================================================
// SIDEN - AJUSTES SEO CONFIGURABLES DEL SITIO
// ==================================================

(async function () {
    "use strict";

    try {
        const respuesta = await fetch("config.json", { cache: "no-cache" });
        if (!respuesta.ok) return;

        const config = await respuesta.json();
        const rutaActual = window.location.pathname.replace(/\/$/, "") || "/";
        const esMulti = config.modoSitio === "multi" && Array.isArray(config.paginas);
        const paginaActual = esMulti
            ? config.paginas.find(function (pagina) {
                const ruta = String(pagina.ruta || "/").replace(/\/$/, "") || "/";
                return ruta === rutaActual;
            })
            : null;

        // H1 configurable: mantiene separada la marca del tema principal de cada página.
        const h1 = paginaActual?.h1 || config.h1 || config.nombre || "";
        const h1Elemento = document.getElementById("nombre-negocio");
        if (h1Elemento) h1Elemento.textContent = h1;

        // Negocios por área de servicio: no mostrar una ubicación física inexistente.
        const modelo = String(config.modeloAtencion || "local").toLowerCase();
        const esAreaServicio = modelo === "areaservicio" || modelo === "area-servicio";
        const ciudadElemento = document.getElementById("ciudad-negocio");
        const direccionElemento = document.getElementById("direccion-linea");
        const tituloUbicacion = document.getElementById("titulo-ubicacion");

        if (esAreaServicio) {
            const areas = Array.isArray(config.areasServicio) ? config.areasServicio : [];
            if (ciudadElemento) {
                ciudadElemento.textContent = areas.join(", ") || config.pais || "Área de servicio";
            }
            if (direccionElemento) {
                direccionElemento.textContent = "";
                direccionElemento.hidden = true;
            }
            if (tituloUbicacion) {
                tituloUbicacion.textContent = (config.etiquetas && config.etiquetas.ubicacion) || "Área de servicio";
            }
        }
    } catch (error) {
        console.error("Error al aplicar ajustes SEO configurables:", error);
    }
})();
