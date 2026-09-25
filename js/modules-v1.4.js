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

/* SIDeN COMMERCIAL TEMPLATE */
(function () {
    "use strict";
    const initCommercial = function () {
        const runtime = window.__SIDEN_CONFIG__;
        if (runtime?.siden?.templateFamily !== "commercial") return;

        const heroCopy = document.querySelector("#inicio .hero-copy");
        if (heroCopy && !heroCopy.querySelector(".hero-eyebrow")) {
            const h1 = heroCopy.querySelector("#nombre-negocio");
            const slogan = heroCopy.querySelector("#slogan-negocio");
            if (h1) h1.insertAdjacentHTML("beforebegin", '<span class="hero-eyebrow">Presencia digital para negocios</span>');
            if (slogan) slogan.insertAdjacentHTML("afterend", '<p class="hero-description">Creamos páginas web profesionales que ayudan a tus clientes a encontrarte, conocer tus servicios y contactarte fácilmente.</p><div class="hero-actions"><a id="whatsapp-principal" class="hero-primary" target="_blank" rel="noopener noreferrer">Quiero mi página web <span>→</span></a><a href="#proyectos" class="hero-secondary">Ver ejemplos <span>↘</span></a></div><div class="hero-trust"><span>✓ Diseño profesional</span><span>✓ SEO básico</span><span>✓ Google + WhatsApp</span></div>');
        }

        const navContainer = document.querySelector(".nav-container");
        if (navContainer && !navContainer.querySelector(".nav-cta")) {
            const cta = document.createElement("a");
            cta.href = "#contacto";
            cta.className = "nav-cta";
            cta.textContent = "Cotizar mi página";
            navContainer.appendChild(cta);
        }

        const anchor = document.getElementById("nosotros");
        if (anchor) anchor.hidden = true;
        const main = document.querySelector("main");
        if (main && anchor && !document.getElementById("proyectos")) {
            anchor.insertAdjacentHTML("beforebegin", `
<section id="proyectos" class="showcase-section"><div class="section-heading"><span class="section-kicker">Así puede verse tu negocio</span><h2>Una página web pensada para causar una buena primera impresión.</h2><p>No importa si tienes una tienda, un restaurante, un servicio profesional o un negocio local: construimos una presencia que se adapta a tu identidad.</p></div><div class="showcase-grid"><article class="showcase-card showcase-commerce"><div class="showcase-preview"><span>COMERCIO</span><strong>Todo lo que tus clientes necesitan<br>antes de visitarte.</strong><i>Ver servicios →</i></div><h3>Negocios y comercios</h3><p>Información clara, productos, ubicación y contacto.</p></article><article class="showcase-card showcase-professional"><div class="showcase-preview"><span>SERVICIOS PROFESIONALES</span><strong>Presenta tu experiencia<br>con confianza.</strong><i>Conocer servicios →</i></div><h3>Profesionales</h3><p>Servicios, perfil, especialidades y formas de contacto.</p></article><article class="showcase-card showcase-local"><div class="showcase-preview"><span>NEGOCIO LOCAL</span><strong>Haz que sea fácil<br>encontrarte en Google.</strong><i>Cómo llegar →</i></div><h3>Presencia local</h3><p>Web, SEO local, Google Maps y WhatsApp conectados.</p></article></div></section>
<section id="problema" class="conversion-section"><div class="section-heading"><span class="section-kicker">El problema</span><h2>Si tu negocio no tiene una presencia clara, estás dejando oportunidades sobre la mesa.</h2><p>Hoy muchas personas buscan información antes de visitar o escribir a un negocio. Una presencia incompleta puede generar dudas, desconfianza o hacer que el cliente termine eligiendo otra opción.</p></div><div class="problem-grid"><article><span>01</span><h3>“¿Dónde encuentro información?”</h3><p>El cliente necesita saber qué haces, qué ofreces y cómo contactarte sin tener que buscar en varios lugares.</p></article><article><span>02</span><h3>“¿Será un negocio confiable?”</h3><p>Una presentación profesional ayuda a transmitir orden, claridad y confianza desde el primer contacto.</p></article><article><span>03</span><h3>“¿Cómo llego o les escribo?”</h3><p>La ubicación, Google y WhatsApp deben estar conectados para convertir el interés en una acción sencilla.</p></article></div></section>
<section id="solucion" class="solution-section"><div class="section-heading"><span class="section-kicker">La solución SIDeN</span><h2>No necesitas estar en todas partes. Necesitas estar bien conectado.</h2><p>Organizamos los principales puntos de contacto digital de tu negocio para que trabajen juntos y comuniquen la misma información.</p></div><div class="solution-grid"><article><div class="solution-number">01</div><h3>Página web profesional</h3><p>Un espacio propio para presentar tu negocio, servicios, información y formas de contacto.</p></article><article><div class="solution-number">02</div><h3>SEO básico</h3><p>Optimizamos la estructura y la información básica de tu página para facilitar su comprensión por buscadores.</p></article><article><div class="solution-number">03</div><h3>Google + Maps</h3><p>Podemos conectar tu presencia digital con los canales de Google cuando el alcance contratado lo contempla.</p></article><article><div class="solution-number">04</div><h3>WhatsApp</h3><p>Facilitamos el contacto directo para que una persona interesada pueda pasar rápidamente de visitar tu web a escribirte.</p></article></div></section>
<section id="soluciones" class="plans-section"><div class="section-heading"><span class="section-kicker">Soluciones SIDeN WEB</span><h2>Elige el nivel de presencia web que mejor se adapta a tu negocio.</h2><p>Tres soluciones claras para empezar con una base profesional y crecer cuando tu negocio lo necesite.</p></div><div class="plans-grid"><article class="plan-card"><span class="plan-label">SIDeN WEB</span><h3>ESENCIAL</h3><p>Tu negocio, presente en Internet de forma profesional.</p><ul></ul><a href="https://wa.me/50371887451?text=Hola%20SIDeN%2C%20estoy%20interesado%20en%20el%20plan%20SIDeN%20WEB%20ESENCIAL.%20Me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n." class="plan-link" target="_blank" rel="noopener noreferrer">Quiero mi SIDeN ESENCIAL →</a></article><article class="plan-card featured"><span class="plan-label">SIDeN WEB</span><div class="plan-badge">Recomendado</div><h3>IMPULSO ⭐</h3><p>Conecta tu negocio del mundo físico al mundo digital.</p><ul></ul><a href="https://wa.me/50371887451?text=Hola%20SIDeN%2C%20estoy%20interesado%20en%20el%20plan%20SIDeN%20WEB%20IMPULSO.%20Me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n." class="plan-link" target="_blank" rel="noopener noreferrer">Quiero mi SIDeN IMPULSO →</a></article><article class="plan-card"><span class="plan-label">SIDeN WEB</span><h3>PROFESIONAL</h3><p>Una presencia digital profesional para hacer crecer la imagen de tu negocio.</p><ul></ul><a href="https://wa.me/50371887451?text=Hola%20SIDeN%2C%20estoy%20interesado%20en%20el%20plan%20SIDeN%20WEB%20PROFESIONAL.%20Me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n." class="plan-link" target="_blank" rel="noopener noreferrer">Quiero mi SIDeN PROFESIONAL →</a></article></div><p class="plans-note">Los tres planes incluyen 12 meses de servicio. El dominio no está incluido en ESENCIAL ni IMPULSO y puede agregarse por separado. No incluyen gestión del Perfil de Empresa de Google, SEO avanzado, redes sociales, desarrollo personalizado ni comercio electrónico, salvo cotización adicional.</p></section>
<section id="faq" class="faq-section"><div class="section-heading"><span class="section-kicker">Preguntas frecuentes</span><h2>Lo que normalmente quieres saber antes de empezar.</h2></div><div class="faq-list"><details><summary>¿Necesito saber de tecnología para tener una página web?</summary><p>No. SIDeN se encarga de la parte técnica y organiza la información para que tu presencia sea clara y fácil de utilizar.</p></details><details><summary>¿La página funciona en celulares?</summary><p>Sí. El diseño se plantea para adaptarse a celulares, tablets y computadoras.</p></details><details><summary>¿El SEO incluido en los planes es SEO local?</summary><p>Los planes Web incluyen SEO básico. La gestión de Perfil de Empresa de Google y los servicios de SEO local forman parte de soluciones adicionales y no están incluidos en estos planes.</p></details><details><summary>¿Puedo conectar WhatsApp?</summary><p>Sí. Los planes Web incluyen un botón de WhatsApp para facilitar el contacto directo. Además, cada plan contempla un catálogo de WhatsApp Presencia con el límite indicado en su alcance.</p></details><details><summary>¿Puedo agregar más cosas después?</summary><p>Sí. La idea es construir una base que pueda crecer con las necesidades de tu negocio. Las funciones adicionales pueden cotizarse por separado.</p></details><details><summary>¿Cuánto tiempo dura el servicio?</summary><p>Los planes se contratan por 12 meses e incluyen hosting, SSL, mantenimiento básico, soporte básico y las condiciones de actualización indicadas en cada plan. La renovación anual se realiza para continuar con el servicio.</p></details></div></section>
            `);
        }

        const whatsapp = String(runtime.whatsapp || "").replace(/\D/g, "");
        const principal = document.getElementById("whatsapp-principal");
        if (principal) principal.href = whatsapp ? "https://wa.me/" + whatsapp : "#";
        document.body.classList.add("siden-commercial-hero");
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initCommercial); else initCommercial();
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
        body.siden-commercial-hero .hero-overlay{background:linear-gradient(90deg,rgba(3,28,92,.97) 0%,rgba(7,54,135,.92) 42%,rgba(25,99,205,.68) 67%,rgba(37,99,235,.20) 100%)!important}
      }
      /* SIDeN CORPORATE VISUAL FIXES */
      /* FAMILY ISOLATION: Corporate must not render Commercial-only content. */
      body.siden-template-corporate #proyectos,
      body.siden-template-corporate #problema,
      body.siden-template-corporate #solucion,
      body.siden-template-corporate #soluciones,
      body.siden-template-corporate #faq{display:none!important}
      body.siden-template-corporate .hero-eyebrow,
      body.siden-template-corporate .hero-description,
      body.siden-template-corporate .hero-actions,
      body.siden-template-corporate .hero-trust,
      body.siden-template-corporate .browser-window,
      body.siden-template-corporate .float-card{display:none!important}
      body.siden-template-corporate .hero-visual{display:flex;align-items:center;justify-content:center}
      body.siden-template-corporate .hero-visual #hero-imagen-negocio{display:block!important}
      
            body.siden-commercial-hero .hero-brand{display:none!important}
      body.siden-commercial-hero .conversion-contact{width:100%!important;max-width:1180px!important;margin-left:auto!important;margin-right:auto!important}
      body.siden-commercial-hero .conversion-contact .cta-panel{margin-left:auto!important;margin-right:auto!important}
      @media(max-width:700px){
        body.siden-commercial-hero .hero{background-color:#0b1220!important}
      }
    `;
    document.head.appendChild(css);

    const getConfig = async function () {
        if (window.__SIDEN_CONFIG__ && window.__SIDEN_CONFIG__.siden) return window.__SIDEN_CONFIG__;
        try { const r = await fetch("config.json", { cache: "no-cache" }); return r.ok ? await r.json() : null; } catch (e) { return null; }
    };
    const asset = function (cfg, file) {
        const limpio = String(file || "").replace(/^\/+/, "");
        const previewSite = new URLSearchParams(window.location.search).get("site");
        const query = previewSite ? "?site=" + encodeURIComponent(previewSite) : "";
        if (limpio.startsWith("images/")) {
            return new URL("/" + limpio + query, location.origin).href;
        }
        const prefix = String(cfg?.siden?.assetPrefix || "").replace(/\/+$/, "");
        return new URL((prefix ? prefix + "/" : "/") + limpio + query, location.origin).href;
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
                    const file = item.imagen;
                    if (!file) return;
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
        if (cfg?.siden?.templateFamily === "commercial") {
            document.body.classList.add("siden-commercial-hero");
            const navLogo = document.getElementById("nav-logo");
            if (navLogo) {
                navLogo.setAttribute("aria-label", "SIDeN");
            }
        }
        await enhanceServices();
        setTimeout(enhanceServices, 900);
        setTimeout(bindImages, 1400);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
