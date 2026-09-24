const root = document.querySelector('#experience-root');
const params = new URLSearchParams(window.location.search);
const slug = params.get('experiencia');
const experience = window.ORIGEN_EXPERIENCES?.[slug];

const esc = (v='') => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const arr = (a=[]) => a.map((x,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${esc(x)}</p></li>`).join('');
const chips = (a=[]) => a.map(x=>`<span>${esc(x)}</span>`).join('');

function variantsBlock(){
  if(!experience.variants?.length) return '';
  return `
  <section class="experience-options experience-variants">
    <p class="section-number">09 — FORMAS DE VIVIRLO</p>
    <h2>ELIGE LA<br>MODALIDAD.</h2>
    <div class="variant-list">
      ${experience.variants.map((v,i)=>`
        <article class="variant-card">
          <span class="variant-number">${String(i+1).padStart(2,'0')}</span>
          <h3>${esc(v.title)}</h3>
          <p>${esc(v.summary)}</p>
          ${v.details?.length ? `<div class="experience-details">${chips(v.details)}</div>` : ''}
        </article>`).join('')}
    </div>
  </section>`;
}

function optionsBlock(){
  if(!experience.options?.length || experience.variants?.length) return '';
  return `
  <section class="experience-options">
    <p class="section-number">09 — OPCIONES</p>
    <h2>FORMAS DE<br>VIVIRLO.</h2>
    <div class="options-grid">${chips(experience.options)}</div>
  </section>`;
}

function render(){
  if(!experience){
    root.innerHTML=`<section class="experience-not-found"><span class="eyebrow">ORIGEN · EXPERIENCIAS</span><h1>EL CAMINO<br>NO TERMINA AQUÍ.</h1><p>La experiencia que buscas todavía no está disponible.</p><a class="btn-primary" href="index.html#experiencias">VOLVER A EXPERIENCIAS ↗</a></section>`;
    return;
  }

  document.title=`ORIGEN | ${experience.title}`;
  const image=experience.image || `../assets/images/experiencias/${slug}/hero.jpg`;

  const learning = experience.learned?.length ? `
    <section class="experience-learning">
      <div><p class="section-number">04 — ¿QUÉ VAS A APRENDER?</p><h2>APRENDER<br>HACIENDO.</h2></div>
      <ol class="learning-list">${arr(experience.learned)}</ol>
    </section>` : '';

  const challenge = experience.challenge ? `
    <section class="experience-dark-block">
      <div><p class="section-number">05 — EL RETO</p><h2>PARTE DE<br>LA EXPERIENCIA.</h2></div>
      <div><p>${esc(experience.challenge)}</p></div>
    </section>` : '';

  const itinerary = experience.itinerary?.length ? `
    <section class="experience-itinerary">
      <p class="section-number">06 — ITINERARIO</p>
      <h2>ASÍ SE VIVE<br>LA JORNADA.</h2>
      <ol class="itinerary-list">${arr(experience.itinerary)}</ol>
    </section>` : '';

  root.innerHTML=`
  <section class="experience-hero" style="--hero:url('${esc(image)}')">
    <div class="experience-hero-content">
      <div class="experience-breadcrumb">${esc(experience.familyNumber)} · ${esc(experience.family)} · ${esc(experience.location)}</div>
      <p class="eyebrow">${esc(experience.eyebrow)}</p>
      <h1>${esc(experience.title)}</h1>
      <p class="experience-hero-line">${esc(experience.message)}</p>
      <div class="experience-profile">${esc(experience.profile)}</div>
    </div>
    <a href="#detalle" class="experience-scroll">DESCUBRIR ↓</a>
  </section>

  <section class="experience-intro" id="detalle">
    <div class="experience-intro-label">01 — LA EXPERIENCIA</div>
    <div class="experience-intro-content">
      <p class="eyebrow eyebrow-dark">${esc(experience.location)}</p>
      <h2>${esc(experience.message)}</h2>
      <p>${esc(experience.lived)}</p>
    </div>
  </section>

  <section class="experience-facts">
    <div class="section-label section-label-dark"><span>02</span><span>DATOS CLAVE</span></div>
    <div class="experience-facts-grid">${chips([experience.location,experience.duration,experience.difficulty,experience.activity,experience.profile])}</div>
    <div class="experience-details">${chips(experience.details)}</div>
  </section>

  <section class="experience-split">
    <div class="experience-media-placeholder"><span>IMAGEN DE LA EXPERIENCIA</span><small>${esc(image.replace('../',''))}</small></div>
    <div class="experience-copy"><p class="section-number">03 — ¿QUÉ VAS A VIVIR?</p><p class="experience-big">${esc(experience.lived)}</p></div>
  </section>

  ${learning}
  ${challenge}
  ${itinerary}

  <section class="experience-gallery">
    <div class="gallery-main"><span>GALERÍA PRINCIPAL</span><small>assets/images/experiencias/${esc(slug)}/gallery-01.jpg</small></div>
    <div class="gallery-grid"><div><span>IMAGEN 02</span></div><div><span>IMAGEN 03</span></div><div><span>IMAGEN 04</span></div><div><span>IMAGEN 05</span></div></div>
  </section>

  <section class="experience-video">
    <p class="section-number">07 — EN EL CAMINO</p>
    <h2>ANTES DE VIVIRLO,<br>QUIERO VERLO.</h2>
    <div class="video-placeholder"><span>VIDEO DE LA EXPERIENCIA</span><small>${experience.video ? 'Video configurado.' : 'Agregar ID de YouTube cuando exista.'}</small></div>
  </section>

  <section class="experience-info">
    <p class="section-number">08 — INFORMACIÓN</p>
    <div class="info-grid">
      <article><h3>¿QUÉ INCLUYE?</h3><p>${esc(experience.include)}</p></article>
      <article><h3>¿QUÉ DEBES LLEVAR?</h3><p>${esc(experience.bring)}</p></article>
      <article><h3>SEGURIDAD</h3><p>${esc(experience.safety)}</p></article>
      <article><h3>PRÓXIMAS FECHAS</h3><p>${esc(experience.dates)}</p></article>
    </div>
  </section>

  ${variantsBlock()}
  ${optionsBlock()}

  <section class="experience-closing">
    <p class="eyebrow">${esc(experience.title)}</p>
    <h2>${esc(experience.closing)}</h2>
  </section>

  <section class="experience-cta" id="reservar">
    <p class="eyebrow">TU PRÓXIMO PASO</p>
    <h2>¿QUIERES<br><span>VIVIRLO?</span></h2>
    <p>Cuando la salida esté publicada podrás consultar fecha, disponibilidad y precio para reservar.</p>
    <a class="btn-primary btn-light" href="mailto:contacto@origen.mx?subject=Quiero%20información%20sobre%20${encodeURIComponent(experience.title)}">QUIERO INFORMACIÓN <span class="btn-arrow">↗</span></a>
  </section>`;
}

render();
const progress=document.querySelector('.scroll-progress span');
window.addEventListener('scroll',()=>{
  const total=document.documentElement.scrollHeight-innerHeight;
  if(progress) progress.style.width=total>0?`${scrollY/total*100}%`:'0%';
},{passive:true});
