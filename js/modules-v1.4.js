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
            if (Array.isArray(identidad.detalles)) identidad.detalles.forEach(function (detalle) {
                const p = document.createElement("p");
                p.style.marginTop = "15px";
                p.textContent = typeof detalle === "string" ? detalle : (detalle.texto || "");
                if (p.textContent) contenidoIdentidad.appendChild(p);
            });
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
            const posicion = objetivo.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: Math.max(0, posicion), behavior: "smooth" });
            const menuMovil = document.getElementById("nav-links");
            if (menuMovil) menuMovil.classList.remove("active");
        });
    } catch (error) {
        console.error("SIDEN v1.4: error en módulos opcionales", error);
    }
})();

/* SIDeN MEDIA / LIGHTBOX v1.6 */
(function () {
    "use strict";
    const css = document.createElement("style");
    css.textContent = `
      #servicios .service::before,#servicios .service::after{display:none!important}
      #servicios .service{padding:0!important;text-align:left!important;cursor:default}
      #servicios .service-image{display:block;width:100%;height:220px;object-fit:cover;cursor:zoom-in}
      #servicios .service-content{padding:22px 25px 25px}
      #servicios .service h3,#servicios .service p{max-width:none!important}
      #lista-productos .product img,#lista-galeria img,#lista-menu .menu-item img{cursor:zoom-in}
      .siden-lightbox{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:28px;background:rgba(3,10,25,.88);backdrop-filter:blur(5px);opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s ease}
      .siden-lightbox.active{opacity:1;visibility:visible}
      .siden-lightbox img{display:block;max-width:min(94vw,1400px);max-height:88vh;width:auto;height:auto;object-fit:contain;border-radius:10px;box-shadow:0 25px 80px rgba(0,0,0,.5);cursor:zoom-out}
      .siden-lightbox button{position:absolute;right:22px;top:16px;width:46px;height:46px;border:1px solid rgba(255,255,255,.35);border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:32px;line-height:1;cursor:pointer}
      @media(max-width:640px){.siden-lightbox{padding:16px}.siden-lightbox img{max-width:96vw;max-height:82vh}.siden-lightbox button{right:12px;top:10px}}
      @media(min-width:901px){
        body.siden-corporate-hero .hero-overlay{background:linear-gradient(90deg,rgba(3,28,92,.97) 0%,rgba(7,54,135,.92) 42%,rgba(25,99,205,.68) 67%,rgba(37,99,235,.20) 100%)!important}
      }
      /* SIDeN CORPORATE VISUAL FIXES */
      body.siden-corporate-hero .hero-brand{display:none!important}
      body.siden-corporate-hero .siden-nav-logo-image{display:block!important;width:150px!important;height:44px!important;min-height:44px!important;background-repeat:no-repeat!important;background-position:center!important;background-size:contain!important;font-size:0!important;line-height:0!important}
      body.siden-corporate-hero .siden-nav-logo-image img{display:none!important}
      body.siden-corporate-hero .conversion-contact{width:100%!important;max-width:1180px!important;margin-left:auto!important;margin-right:auto!important}
      body.siden-corporate-hero .conversion-contact .cta-panel{margin-left:auto!important;margin-right:auto!important}
      @media(max-width:700px){
        body.siden-corporate-hero .siden-nav-logo-image{width:128px!important;height:40px!important;min-height:40px!important}
        body.siden-corporate-hero .hero{background-color:#0b1220!important}
      }
    `;
    document.head.appendChild(css);

    const getConfig = async function () {
        if (window.__SIDEN_CONFIG__ && window.__SIDEN_CONFIG__.siden) return window.__SIDEN_CONFIG__;
        try { const r = await fetch("config.json", { cache: "no-cache" }); return r.ok ? await r.json() : null; } catch (e) { return null; }
    };
    const asset = function (cfg, file) {
        const prefix = String(cfg?.siden?.assetPrefix || "").replace(/\/+$/, "");
        return new URL((prefix ? prefix + "/" : "/") + String(file || "").replace(/^\/+/, ""), location.origin).href;
    };
    let box = null;
    const openLightbox = function (src, alt) {
        if (!box) {
            box = document.createElement("div");
            box.className = "siden-lightbox";
            box.setAttribute("role", "dialog");
            box.setAttribute("aria-modal", "true");
            box.innerHTML = '<button type="button" aria-label="Cerrar">×</button><img alt="">';
            document.body.appendChild(box);
            box.addEventListener("click", function (e) { if (e.target === box || e.target.tagName === "BUTTON" || e.target.tagName === "IMG") box.classList.remove("active"); });
            document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box) box.classList.remove("active"); });
        }
        const imagen = box.querySelector("img");
        imagen.src = src;
        imagen.alt = alt || "";
        box.classList.add("active");
    };
    const bindImages = function () {
        document.querySelectorAll("#lista-servicios img.service-image,#lista-productos .product img,#lista-galeria img,#lista-menu .menu-item img").forEach(function (img) {
            if (img.dataset.sidenLightbox === "1") return;
            img.dataset.sidenLightbox = "1";
            img.addEventListener("click", function () { openLightbox(img.currentSrc || img.src, img.alt); });
        });
    };
    const enhanceServices = async function () {
        const cfg = await getConfig();
        const services = document.getElementById("lista-servicios");
        if (services) {
            const data = Array.isArray(cfg?.servicios) ? cfg.servicios : [];
            Array.from(services.querySelectorAll(":scope > .service")).forEach(function (card, index) {
                if (!card.querySelector("img.service-image")) {
                    const item = data[index] || {};
                    const file = item.imagen || ["foto1.jpg", "foto2.jpg", "foto3.jpg"][index % 3];
                    const img = document.createElement("img");
                    img.className = "service-image";
                    img.src = asset(cfg || {}, "images/" + file);
                    img.alt = (item.nombre || card.querySelector("h3")?.textContent || "Servicio") + " - " + (cfg?.nombre || "");
                    img.loading = "lazy";
                    const content = document.createElement("div");
                    content.className = "service-content";
                    while (card.firstChild) content.appendChild(card.firstChild);
                    card.append(img, content);
                }
            });
        }
        bindImages();
    };
    const setupMenu = function () {
        const btn = document.getElementById("menu-button"), links = document.getElementById("nav-links");
        if (!btn || !links || btn.dataset.sidenBound === "1") return;
        btn.dataset.sidenBound = "1";
        btn.addEventListener("click", function () { const active = links.classList.toggle("active"); btn.setAttribute("aria-expanded", String(active)); btn.textContent = active ? "×" : "☰"; });
        links.addEventListener("click", function (e) { if (e.target.closest("a")) { links.classList.remove("active"); btn.setAttribute("aria-expanded", "false"); btn.textContent = "☰"; } });
    };
    const start = async function () {
        setupMenu();
        const cfg = await getConfig();
        if (cfg?.nombre === "SIDeN") {
            document.body.classList.add("siden-corporate-hero");
            const navLogo = document.getElementById("nav-logo");
            if (navLogo && cfg.logo) {
                navLogo.textContent = "";
                navLogo.classList.add("siden-nav-logo-image");
                navLogo.style.backgroundImage = `url("${asset(cfg, "images/" + cfg.logo)}")`;
                navLogo.setAttribute("aria-label", "SIDeN");
            }
        }
        await enhanceServices();
        setTimeout(enhanceServices, 900);
        setTimeout(bindImages, 1400);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
