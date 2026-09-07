// ==================================================
// SIDEN - AJUSTES COMPLEMENTARIOS SEO LOCAL
// ==================================================

(async function () {
    "use strict";

    const cargarConfig = async function () {
        const runtime = window.__SIDEN_CONFIG__;
        if (runtime && runtime.siden) return runtime;
        const respuesta = await fetch("config.json", { cache: "no-cache" });
        if (!respuesta.ok) throw new Error("No se pudo cargar config.json");
        return await respuesta.json();
    };

    const crearVCard = function (config) {
        const email = String(config.email || "").trim();
        const lineas = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            "FN:" + (config.nombre || ""),
            "ORG:" + (config.nombre || ""),
            "TEL;TYPE=CELL:" + (config.whatsapp || ""),
            "TEL;TYPE=WORK:" + (config.telefono || ""),
            "ADR;TYPE=WORK:;;" + (config.ciudad || "") + ";;;",
            email ? "EMAIL;TYPE=INTERNET:" + email : "",
            "URL:" + window.location.href,
            "END:VCARD"
        ].filter(Boolean);
        const archivo = new Blob([lineas.join("\n")], { type: "text/vcard;charset=utf-8" });
        const url = URL.createObjectURL(archivo);
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = (config.nombre || "contacto") + ".vcf";
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        URL.revokeObjectURL(url);
    };

    const compartir = async function (config) {
        const datos = { title: config.nombre || "", text: config.slogan || "", url: window.location.href };
        if (navigator.share) {
            try { await navigator.share(datos); return; } catch (error) { if (error?.name === "AbortError") return; }
        }
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("Enlace copiado al portapapeles.");
        } catch {
            window.prompt("Copia este enlace:", window.location.href);
        }
    };

    const aplicar = async function () {
        try {
            const config = await cargarConfig();
            const rutaActual = window.location.pathname.replace(/\/$/, "") || "/";
            const esMulti = config.modoSitio === "multi" && Array.isArray(config.paginas);
            const paginaActual = esMulti ? config.paginas.find(function (pagina) {
                const ruta = String(pagina.ruta || "/").replace(/\/$/, "") || "/";
                return ruta === rutaActual;
            }) : null;

            const h1 = paginaActual?.h1 || config.h1 || paginaActual?.nombre || config.nombre || "";
            const h1Elemento = document.getElementById("nombre-negocio");
            if (h1Elemento) h1Elemento.textContent = h1;

            const modelo = String(config.modeloAtencion || "local").toLowerCase();
            const esAreaServicio = modelo === "areaservicio" || modelo === "area-servicio";
            const ciudadElemento = document.getElementById("ciudad-negocio");
            const direccionElemento = document.getElementById("direccion-linea");
            const tituloUbicacion = document.getElementById("titulo-ubicacion");
            if (esAreaServicio) {
                const areas = Array.isArray(config.areasServicio) ? config.areasServicio.map(function (area) {
                    return typeof area === "string" ? area : area?.nombre;
                }).filter(Boolean) : [];
                if (ciudadElemento) ciudadElemento.textContent = areas.join(", ") || config.pais || "Área de servicio";
                if (direccionElemento) { direccionElemento.textContent = ""; direccionElemento.hidden = true; }
                if (tituloUbicacion) tituloUbicacion.textContent = (config.etiquetas && config.etiquetas.ubicacion) || "Área de servicio";
            }

            const whatsapp = String(config.whatsapp || "").replace(/\D/g, "");
            const whatsappURL = whatsapp ? "https://wa.me/" + whatsapp : "";
            ["whatsapp-principal", "whatsapp-final", "whatsapp-flotante", "pagina-whatsapp"].forEach(function (id) {
                const elemento = document.getElementById(id);
                if (elemento && whatsappURL) elemento.href = whatsappURL;
            });

            const email = String(config.email || "").trim();
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

            ["guardar-contacto", "pagina-guardar-contacto"].forEach(function (id) {
                const elemento = document.getElementById(id);
                if (elemento) elemento.onclick = function () { crearVCard(config); };
            });
            ["compartir-negocio", "pagina-compartir-negocio"].forEach(function (id) {
                const elemento = document.getElementById(id);
                if (elemento) elemento.onclick = function () { compartir(config); };
            });

            const hero = document.getElementById("inicio");
            if (hero && config.heroImagen && !document.body.classList.contains("multi-inner-page")) {
                const rutaHero = new URL("/images/" + String(config.heroImagen).replace(/^\/+/, ""), window.location.origin).href;
                hero.classList.add("hero-has-image");
                hero.style.setProperty("--hero-image", 'url("' + rutaHero + '")');
                hero.style.backgroundImage = 'url("' + rutaHero + '")';
                hero.style.backgroundSize = "cover";
                hero.style.backgroundPosition = "center";
            }

            const alts = Array.isArray(config.galeriaAlt) ? config.galeriaAlt : [];
            const galeria = document.getElementById("lista-galeria");
            if (galeria && alts.length) {
                const aplicarAlt = function () {
                    galeria.querySelectorAll("img").forEach(function (imagen, indice) {
                        const alt = String(alts[indice] || "").trim();
                        if (alt) imagen.alt = alt;
                    });
                };
                aplicarAlt();
                const observador = new MutationObserver(aplicarAlt);
                observador.observe(galeria, { childList: true });
                window.setTimeout(function () { observador.disconnect(); }, 10000);
            }
        } catch (error) {
            console.warn("SIDEN SEO local: no se pudieron aplicar los ajustes configurables.", error);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", aplicar);
    } else {
        aplicar();
    }
})();
