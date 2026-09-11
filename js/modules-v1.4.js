// SIDEN v1.4 - módulos opcionales de proceso e identidad
(async function () {
    "use strict";
    try {
        const runtime = window.__SIDEN_CONFIG__;
        const respuesta = runtime && runtime.siden ? null : await fetch("config.json", { cache: "no-cache" });
        if (respuesta && !respuesta.ok) return;
        const config = runtime && runtime.siden ? runtime : await respuesta.json();
        const modulos = Array.isArray(config.modulos) ? config.modulos : [];
        const etiquetas = config.etiquetas || {};
        const proceso = Array.isArray(config.proceso) ? config.proceso : [];
        const identidad = config.identidad || {};
        const mostrar = function (id, visible) {
            const elemento = document.querySelector(`[data-module="${id}"]`);
            if (elemento) elemento.hidden = !visible;
        };
        const titulo = function (id, valor) {
            const elemento = document.getElementById(id);
            if (elemento && valor) elemento.textContent = valor;
        };
        const procesoActivo = modulos.includes("proceso") && proceso.length > 0;
        const identidadActiva = modulos.includes("identidad") && Object.keys(identidad).length > 0;
        mostrar("proceso", procesoActivo);
        mostrar("identidad", identidadActiva);
        titulo("titulo-proceso", etiquetas.proceso || "Cómo trabajamos");
        titulo("titulo-identidad", etiquetas.identidad || "Quiénes somos");

        const listaProceso = document.getElementById("lista-proceso");
        if (listaProceso && procesoActivo) {
            listaProceso.innerHTML = "";
            proceso.forEach(function (paso, indice) {
                const tarjeta = document.createElement("div");
                tarjeta.className = "service";
                const h3 = document.createElement("h3");
                h3.textContent = paso.titulo || paso.nombre || `Paso ${indice + 1}`;
                const p = document.createElement("p");
                p.textContent = paso.descripcion || "";
                tarjeta.append(h3, p);
                listaProceso.appendChild(tarjeta);
            });
        }

        const contenidoIdentidad = document.getElementById("contenido-identidad");
        if (contenidoIdentidad && identidadActiva) {
            contenidoIdentidad.innerHTML = "";
            if (identidad.descripcion) {
                const p = document.createElement("p");
                p.textContent = identidad.descripcion;
                contenidoIdentidad.appendChild(p);
            }
            if (Array.isArray(identidad.detalles)) {
                identidad.detalles.forEach(function (detalle) {
                    const p = document.createElement("p");
                    p.style.marginTop = "15px";
                    p.textContent = typeof detalle === "string" ? detalle : (detalle.texto || "");
                    if (p.textContent) contenidoIdentidad.appendChild(p);
                });
            }
        }

        const navLinks = document.getElementById("nav-links");
        if (navLinks && !document.body.classList.contains("multi-inner-page")) {
            const existentes = Array.from(navLinks.querySelectorAll("a")).map(function (enlace) { return enlace.getAttribute("href"); });
            [["proceso", etiquetas.procesoMenu || etiquetas.proceso || "Cómo trabajamos", procesoActivo], ["identidad", etiquetas.identidadMenu || etiquetas.identidad || "Quiénes somos", identidadActiva]].forEach(function (item) {
                if (!item[2] || existentes.includes("#" + item[0])) return;
                const enlace = document.createElement("a");
                enlace.href = "#" + item[0];
                enlace.textContent = item[1];
                navLinks.appendChild(enlace);
            });
        }

        // NAVEGACIÓN INTERNA SEGURA PARA ARQUITECTURA MULTISITE
        // Evita que un ancla interna pueda provocar una navegación fuera de la instancia actual.
        document.addEventListener("click", function (evento) {
            const enlace = evento.target.closest("a[href^='#']");
            if (!enlace) return;
            const hash = enlace.getAttribute("href");
            if (!hash || hash === "#") return;
            const objetivo = document.getElementById(hash.substring(1));
            if (!objetivo) return;
            evento.preventDefault();
            const urlActual = new URL(window.location.href);
            urlActual.hash = hash.substring(1);
            window.history.pushState({}, "", urlActual.href);
            const offset = 80;
            const posicion = objetivo.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: Math.max(0, posicion), behavior: "smooth" });
            const menuMovil = document.getElementById("nav-links");
            if (menuMovil) menuMovil.classList.remove("active");
        });
    } catch (error) {
        console.error("SIDEN v1.4: error en módulos opcionales", error);
    }
})();
