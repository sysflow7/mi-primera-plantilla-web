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
    } catch (error) {
        console.error("SIDEN v1.4: error en módulos opcionales", error);
    }
})();

/* SIDeN UI enhancements v1.4 */
(function(){
  'use strict';
  const getConfig=async()=>{
    if(window.__SIDEN_CONFIG__&&window.__SIDEN_CONFIG__.siden) return window.__SIDEN_CONFIG__;
    try{const r=await fetch('config.json',{cache:'no-cache'});return r.ok?await r.json():null}catch(e){return null}
  };
  const asset=(cfg,file)=>{
    const prefix=String(cfg?.siden?.assetPrefix||'').replace(/\/+$/,'');
    return new URL((prefix?prefix+'/':'/')+String(file||'').replace(/^\/+/,''),location.origin).href;
  };
  const openLightbox=(src,alt)=>{
    let box=document.querySelector('.siden-lightbox');
    if(!box){
      box=document.createElement('div');box.className='siden-lightbox';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');
      box.innerHTML='<button type="button" aria-label="Cerrar">×</button><img alt="">';
      document.body.appendChild(box);
      box.addEventListener('click',e=>{if(e.target===box||e.target.tagName==='BUTTON'||e.target===box.querySelector('img')) box.classList.remove('active')});
      document.addEventListener('keydown',e=>{if(e.key==='Escape') box.classList.remove('active')});
    }
    const img=box.querySelector('img');img.src=src;img.alt=alt||'';box.classList.add('active');
  };
  const setupMenu=()=>{
    const btn=document.getElementById('menu-button'), links=document.getElementById('nav-links');
    if(!btn||!links||btn.dataset.sidenBound==='1') return;
    btn.dataset.sidenBound='1';
    btn.addEventListener('click',()=>{const active=links.classList.toggle('active');btn.setAttribute('aria-expanded',String(active));btn.textContent=active?'×':'☰'});
    links.addEventListener('click',e=>{if(e.target.closest('a')){links.classList.remove('active');btn.setAttribute('aria-expanded','false');btn.textContent='☰'}});
  };
  const setupMedia=async()=>{
    const cfg=await getConfig(); if(!cfg) return;
    const navLogo=document.getElementById('nav-logo');
    if(navLogo&&cfg.logo){navLogo.innerHTML='';const img=document.createElement('img');img.src=asset(cfg,'images/'+cfg.logo);img.alt='Logo de '+(cfg.nombre||'negocio');navLogo.appendChild(img)}
    const heroBrand=document.querySelector('.hero-brand');
    if(heroBrand) heroBrand.remove();
    const services=document.getElementById('lista-servicios');
    if(services&&Array.isArray(cfg.servicios)){
      services.innerHTML='';
      cfg.servicios.forEach((s)=>{
        const card=document.createElement('article');card.className='service';
        if(s.imagen){const img=document.createElement('img');img.className='service-image';img.src=asset(cfg,'images/'+s.imagen);img.alt=(s.nombre||'Servicio')+' - '+(cfg.nombre||'');img.loading='lazy';card.appendChild(img)}
        const content=document.createElement('div');content.className='service-content';
        const h=document.createElement('h3');h.textContent=s.nombre||'';const p=document.createElement('p');p.textContent=s.descripcion||'';content.append(h,p);card.appendChild(content);services.appendChild(card);
      });
    }
    document.querySelectorAll('#lista-servicios img.service-image,#lista-productos .product img,.gallery img,#lista-menu .menu-item img').forEach(img=>{
      if(img.dataset.sidenLightbox==='1') return;img.dataset.sidenLightbox='1';img.addEventListener('click',()=>openLightbox(img.src,img.alt));
    });
  };
  const start=()=>{setupMenu();window.addEventListener('load',()=>setTimeout(setupMedia,150),{once:true});setTimeout(setupMedia,900)};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
