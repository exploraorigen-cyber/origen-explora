const root = document.querySelector('#experience-root');
const params = new URLSearchParams(window.location.search);
const slug = params.get('experiencia');
const experience = window.ORIGEN_EXPERIENCES?.[slug];
const vectorThemeBySlug = {
  'travesia-cascadas': 'water',
  'san-cayetano': 'cave',
  'cerro-comadres-rancho': 'ridge',
  'cerro-comadres-cabana': 'ridge',
  'conca-rio-vino': 'water',
  'escalada-peaje': 'climb',
  'boulder-sunset': 'climb',
  'gruta-candelas': 'cave',
  'canon-chivo-guacamayas': 'water',
  'canon-chivo-rappel': 'canyon',
  'gruta-puente': 'cave',
  'tres-joyas': 'ridge',
  'poza-pinturas': 'water',
  'canon-ahogado': 'canyon',
  'conca-arcos': 'water',
  'cerro-comadres-camp': 'ridge',
  'bosque-camp': 'ridge',
  'cruce-chivo': 'canyon',
  'travesia-sierra-san-miguelito': 'ridge',
  'huasteca-medida': 'water'
};

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

function bindDepartureGallery(){
  const form = root.querySelector('#departure-gallery-search');
  if(!form) return;
  const input = form.querySelector('input[name="date"]');
  const result = root.querySelector('#departure-gallery-result');
  const galleries = Array.isArray(experience.departureGalleries) ? experience.departureGalleries : [];

  const showGallery = date => {
    const departure = galleries.find(item => item.date === date);
    if(!departure){
      result.innerHTML = `<p>${galleries.length ? 'No encontramos una galería para esa fecha. Revisa la fecha o elige una de las salidas disponibles.' : 'Esta experiencia todavía no tiene galerías por fecha. Cuando agreguemos una salida con fotos, aparecerá aquí.'}</p>`;
      return;
    }
    const photos = Array.isArray(departure.photos) ? departure.photos : [];
    if(!photos.length){
      result.innerHTML = '<p>La salida está registrada, pero sus fotografías todavía no están cargadas.</p>';
      return;
    }
    const dateLabel = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${departure.date}T12:00:00`));
    const photoCards = photos.map((photo, index) => {
      const file = typeof photo === 'string' ? photo : photo.file;
      if(!file || !/^[a-zA-Z0-9_-]+\.(png|jpe?g|webp)$/i.test(file)) return '';
      const alt = typeof photo === 'string' ? `${experience.title}, salida ${dateLabel}, foto ${index + 1}` : (photo.alt || `${experience.title}, salida ${dateLabel}, foto ${index + 1}`);
      const caption = typeof photo === 'string' ? '' : (photo.caption || '');
      return `<figure><img src="/assets/images/experiencias/${encodeURIComponent(slug)}/salidas/${encodeURIComponent(departure.date)}/${encodeURIComponent(file)}" alt="${esc(alt)}" loading="lazy" onerror="this.closest('figure').remove()">${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;
    }).join('');
    result.innerHTML = `<div class="departure-gallery-open"><p class="departure-gallery-date">${esc(dateLabel)}${departure.title ? ` · ${esc(departure.title)}` : ''}</p><div class="departure-photo-grid">${photoCards}</div></div>`;
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    if(input.value) showGallery(input.value);
  });
  root.querySelectorAll('[data-departure-date]').forEach(button => {
    button.addEventListener('click', () => {
      input.value = button.dataset.departureDate;
      form.requestSubmit();
    });
  });
}

function render(){
  if(!experience){
    root.innerHTML=`<section class="experience-not-found"><span class="eyebrow">ORIGEN · EXPERIENCIAS</span><h1>EL CAMINO<br>NO TERMINA AQUÍ.</h1><p>La experiencia que buscas todavía no está disponible.</p><a class="btn-primary" href="index.html#experiencias">VOLVER A EXPERIENCIAS ↗</a></section>`;
    return;
  }

  document.body.dataset.experienceSlug = slug;
  document.body.dataset.vectorTheme = vectorThemeBySlug[slug] || 'ridge';
  document.title=`ORIGEN | ${experience.title}`;
  const image = `/assets/images/experiencias/${slug}/hero.png`;
  const galleryRoles = [
    'EL LUGAR',
    'EL PRIMER PASO',
    'EN MOVIMIENTO',
    'DETALLES DEL RECORRIDO',
    'LA EXPERIENCIA COMPARTIDA',
    'EL CIERRE'
  ];
  const galleryImage = (index, role, featured=false) => {
    const number = String(index + 1).padStart(2, '0');
    const file = `gallery-${number}.png`;
    const cardClass = featured ? 'photo-slot gallery-main' : 'photo-slot';
    return `<figure class="${cardClass}">
      <img src="/assets/images/experiencias/${encodeURIComponent(slug)}/${file}" alt="${esc(experience.title)} — ${esc(role.toLowerCase())}" loading="eager" onload="this.closest('.photo-slot').classList.add('is-loaded');this.closest('.experience-gallery').hidden=false" onerror="this.closest('.photo-slot').remove()">
      <figcaption><span>${number}</span>${esc(role)}</figcaption>
    </figure>`;
  };
  const galleryMarkup = `
  <section class="experience-gallery" id="galeria" aria-label="Galería destacada de ${esc(experience.title)}" hidden>
    <header class="experience-gallery-heading">
      <p class="section-number">GALERÍA DESTACADA</p>
      <h2>LA EXPERIENCIA<br>EN IMÁGENES.</h2>
      <p>Una selección para descubrir lo que hace especial esta experiencia.</p>
    </header>
    ${galleryImage(0, galleryRoles[0], true)}
    <div class="gallery-grid">${galleryRoles.slice(1).map((role, i) => galleryImage(i + 1, role)).join('')}</div>
  </section>`;
  const departureGalleries = Array.isArray(experience.departureGalleries) ? experience.departureGalleries : [];
  const formatDepartureDate = value => {
    const parsed = new Date(`${value}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsed);
  };
  const departureDateButtons = departureGalleries.map(departure => `
    <button class="departure-date-chip" type="button" data-departure-date="${esc(departure.date)}">${esc(formatDepartureDate(departure.date))}</button>`).join('');
  const departureGalleryMarkup = `
  <section class="departure-gallery" id="galerias-por-fecha">
    <div class="departure-gallery-heading">
      <p class="section-number">GALERÍA POR FECHA</p>
      <h2>REVIVE TU<br>RECORRIDO.</h2>
      <p>Busca la fecha de tu salida para abrir las fotografías de ese día.</p>
    </div>
    <form class="departure-gallery-search" id="departure-gallery-search">
      <label for="departure-gallery-date">FECHA DE TU RECORRIDO</label>
      <div class="departure-gallery-search-controls">
        <input id="departure-gallery-date" name="date" type="date" required>
        <button class="btn-primary" type="submit">BUSCAR FOTOS <span aria-hidden="true">↗</span></button>
      </div>
    </form>
    ${departureDateButtons ? `<div class="departure-date-list" aria-label="Fechas con galería">${departureDateButtons}</div>` : ''}
    <div class="departure-gallery-result" id="departure-gallery-result" aria-live="polite">
      <p>${departureGalleries.length ? 'Elige una fecha disponible o escribe la fecha de tu recorrido.' : 'Cuando una salida tenga fecha y fotografías cargadas, podrás encontrar su galería aquí.'}</p>
    </div>
  </section>`;

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
    <div class="experience-media-placeholder"><img src="${esc(image)}" alt="${esc(experience.title)}"></div>
    <div class="experience-copy"><p class="section-number">03 — ¿QUÉ VAS A VIVIR?</p><p class="experience-big">${esc(experience.lived)}</p></div>
  </section>

  ${learning}
  ${challenge}
  ${itinerary}

  ${galleryMarkup}
  ${departureGalleryMarkup}

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
  bindDepartureGallery();
}

render();
const progress=document.querySelector('.scroll-progress span');
window.addEventListener('scroll',()=>{
  const total=document.documentElement.scrollHeight-innerHeight;
  if(progress) progress.style.width=total>0?`${scrollY/total*100}%`:'0%';
},{passive:true});
