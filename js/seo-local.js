// ==================================================
// SIDEN - AJUSTES COMPLEMENTARIOS SEO LOCAL
// ==================================================

(async function () {
    "use strict";

    const aplicarConfiguracionSEO = async function () {
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

            // El H1 es configurable y se mantiene separado del nombre de la marca.
            const h1 = paginaActual?.h1 || config.h1 || paginaActual?.nombre || config.nombre || "";
            const h1Elemento = document.getElementById("nombre-negocio");
            if (h1Elemento) h1Elemento.textContent = h1;

            // Negocios por área de servicio: no mostrar una ubicación física inexistente.
            const modelo = String(config.modeloAtencion || "local").toLowerCase();
            const esAreaServicio = modelo === "areaservicio" || modelo === "area-servicio";
            const ciudadElemento = document.getElementById("ciudad-negocio");
            const direccionElemento = document.getElementById("direccion-linea");
            const tituloUbicacion = document.getElementById("titulo-ubicacion");

            if (esAreaServicio) {
                const areas = Array.isArray(config.areasServicio)
                    ? config.areasServicio.map(function (area) {
                        return typeof area === "string" ? area : area?.nombre;
                    }).filter(Boolean)
                    : [];

                if (ciudadElemento) {
                    ciudadElemento.textContent = areas.join(", ") || config.pais || "Área de servicio";
                }
                if (direccionElemento) {
                    direccionElemento.textContent = "";
                    direccionElemento.hidden = true;
                }
                if (tituloUbicacion) {
                    tituloUbicacion.textContent =
                        (config.etiquetas && config.etiquetas.ubicacion) || "Área de servicio";
                }
            }

            // ALT personalizados de la galería.
            const alts = Array.isArray(config.galeriaAlt) ? config.galeriaAlt : [];
            if (alts.length) {
                const galeria = document.getElementById("lista-galeria");
                if (galeria) {
                    const aplicar = function () {
                        galeria.querySelectorAll("img").forEach(function (imagen, indice) {
                            const alt = String(alts[indice] || "").trim();
                            if (alt) imagen.alt = alt;
                        });
                    };
                    aplicar();
                    const observador = new MutationObserver(aplicar);
                    observador.observe(galeria, { childList: true });
                    window.setTimeout(function () {
                        observador.disconnect();
                    }, 10000);
                }
            }
        } catch (error) {
            console.warn("SIDEN SEO local: no se pudieron aplicar los ajustes configurables.", error);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", aplicarConfiguracionSEO);
    } else {
        aplicarConfiguracionSEO();
    }
})();
