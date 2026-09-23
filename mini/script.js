(function(){
"use strict";
const runtime=window.__SIDEN_CONFIG__||{};
const siden=runtime.siden||{};
const previewSite=new URLSearchParams(window.location.search).get("site");
const assetQuery=previewSite?"?site="+encodeURIComponent(previewSite):"";
const assetUrl=(file)=>{
 const clean=String(file||"").replace(/^\/+/,"");
 return new URL("/images/"+clean+assetQuery,window.location.origin).href;
};
const q=(id)=>document.getElementById(id);
const show=(el,visible)=>{if(el)el.hidden=!visible};
const text=(id,value)=>{const el=q(id);if(el)el.textContent=value||""};
const wa=(phone,message)=>{
 const digits=String(phone||"").replace(/\D/g,"");
 return digits?"https://wa.me/"+digits+"?text="+encodeURIComponent(message||"Hola, quiero información sobre "+(runtime.nombre||"el negocio")):"";
};

document.body.style.setProperty("--mini-primary",runtime.apariencia?.colorPrimario||"#2563eb");
document.body.style.setProperty("--mini-secondary",runtime.apariencia?.colorSecundario||"#0f172a");
document.body.style.setProperty("--mini-bg",runtime.apariencia?.colorFondo||"#f8fafc");
document.body.style.setProperty("--mini-text",runtime.apariencia?.colorTexto||"#172033");
document.body.style.setProperty("--mini-button",runtime.apariencia?.colorBoton||runtime.apariencia?.colorPrimario||"#2563eb");
document.body.style.setProperty("--mini-button-text",runtime.apariencia?.colorTextoBoton||"#fff");

text("mini-business-name",runtime.identidad?.nombre||runtime.nombre);
text("mini-footer-name",runtime.identidad?.nombre||runtime.nombre);
text("mini-year",new Date().getFullYear());

const logo=runtime.identidad?.logo||runtime.logo;
if(logo)q("mini-logo").src=assetUrl(logo);

const hero=runtime.hero||{};
text("mini-slogan",hero.slogan||runtime.slogan);
text("mini-title",hero.titulo||runtime.nombre);
text("mini-hero-text",hero.subtitulo||runtime.descripcion||runtime.descripcionSEO);
const heroWa=wa(runtime.contacto?.whatsapp||runtime.whatsapp,hero.whatsappMensaje);
const heroButton=q("mini-whatsapp-hero"); show(heroButton,!!heroWa&&hero.mostrarWhatsapp!==false); if(heroWa)heroButton.href=heroWa;
if(hero.mostrar!==false&&hero.imagen){
 q("mini-hero-image").src=assetUrl(hero.imagen);
 q("mini-hero-image").alt=hero.titulo||runtime.nombre||"Imagen del negocio";
 show(q("mini-hero-media"),true);
}

const pres=runtime.presentacion||{};
show(q("mini-presentacion"),pres.mostrar!==false&&!!pres.texto);
text("mini-presentacion-title",pres.titulo||"Sobre nosotros");
text("mini-presentacion-text",pres.texto);

const items=Array.isArray(runtime.productosServicios?.items)?runtime.productosServicios.items.slice(0,4):[];
const productSection=q("mini-productos");
show(productSection,runtime.productosServicios?.mostrar!==false&&items.length>0);
text("mini-productos-title",runtime.productosServicios?.titulo||"Productos y servicios");
const list=q("mini-productos-list");
items.forEach(item=>{
 const card=document.createElement("article"); card.className="mini-card";
 if(item.imagen){const img=document.createElement("img");img.src=assetUrl(item.imagen);img.alt=item.nombre||"";card.appendChild(img)}
 const body=document.createElement("div");body.className="mini-card-body";
 const h=document.createElement("h3");h.textContent=item.nombre||"";body.appendChild(h);
 const p=document.createElement("p");p.textContent=item.descripcion||"";body.appendChild(p);
 card.appendChild(body);list.appendChild(card);
});

const contacto=runtime.contacto||{};
const whats=wa(contacto.whatsapp||runtime.whatsapp,contacto.mensaje);
const phone=contacto.telefono||runtime.telefono;
const email=contacto.email||runtime.email;
show(q("mini-contacto"),!!(whats||phone||email));
if(whats){q("mini-whatsapp").href=whats;q("mini-whatsapp").textContent="WhatsApp";}
if(phone){const el=q("mini-telefono");el.href="tel:"+String(phone).replace(/[^+\d]/g,"");el.textContent=phone;show(el,true)}
if(email){const el=q("mini-email");el.href="mailto:"+email;el.textContent=email;show(el,true)}
text("mini-contacto-title",contacto.titulo||"Contáctanos");

const loc=runtime.ubicacionAtencion||{};
const hasLoc=!!(loc.direccion||loc.zona||loc.areaAtencion||loc.comoLlegarUrl||runtime.direccionTexto||runtime.ciudad);
show(q("mini-ubicacion"),loc.mostrar!==false&&hasLoc);
text("mini-ubicacion-title",loc.titulo||"Ubicación y atención");
text("mini-direccion",loc.direccion||runtime.direccionTexto||"");
text("mini-zona",loc.zona||runtime.ciudad||"");
text("mini-area",loc.areaAtencion||"");
const hours=runtime.horarios?.texto||loc.horarios||"";
text("mini-horarios",hours);
if(loc.comoLlegarUrl){q("mini-como-llegar").href=loc.comoLlegarUrl;show(q("mini-como-llegar"),true)}

const redes=runtime.redes||{};
const redesList=q("mini-redes-list");
[["Facebook",redes.facebook||runtime.facebook],["Instagram",redes.instagram||runtime.instagram],["TikTok",redes.tiktok||runtime.tiktok]].forEach(([label,url])=>{
 if(typeof url==="string"&&/^https?:\/\//i.test(url)){const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=label;redesList.appendChild(a)}
});
show(q("mini-redes"),redesList.children.length>0);

const share=runtime.compartir||{};
show(q("mini-compartir"),share.mostrar!==false);
q("mini-share-button")?.addEventListener("click",async()=>{
 const data={title:runtime.identidad?.nombre||runtime.nombre||document.title,text:runtime.slogan||"",url:window.location.href};
 if(navigator.share){try{await navigator.share(data)}catch(e){}}
 else if(navigator.clipboard){try{await navigator.clipboard.writeText(window.location.href);q("mini-share-button").textContent="✓ Enlace copiado";setTimeout(()=>q("mini-share-button").textContent="↗ Compartir negocio",1800)}catch(e){}}
});

if(!logo){q("mini-logo").hidden=true}
})();