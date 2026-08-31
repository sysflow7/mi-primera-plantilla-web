// ==================================================
// SIDEN - AJUSTES COMPLEMENTARIOS SEO LOCAL
// ==================================================

(function () {
    "use strict";

    const aplicarAltGaleria = async function () {
        try {
            const respuesta = await fetch("config.json", { cache: "no-cache" });
            if (!respuesta.ok) return;

            const config = await respuesta.json();
            const alts = Array.isArray(config.galeriaAlt) ? config.galeriaAlt : [];
            if (!alts.length) return;

            const galeria = document.getElementById("lista-galeria");
            if (!galeria) return;

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
        } catch (error) {
            console.warn("SIDEN SEO local: no se pudieron aplicar ALT personalizados.", error);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", aplicarAltGaleria);
    } else {
        aplicarAltGaleria();
    }
})();
