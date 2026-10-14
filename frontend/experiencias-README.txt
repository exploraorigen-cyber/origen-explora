ORIGEN — EXPERIENCIAS · V8 AUDITADA

La página experiencia.html sigue siendo una plantilla única.
Cada experiencia se carga desde data/experiences.js mediante:
experiencia.html?experiencia=SLUG

Esta versión fue revisada contra las Fichas Madre y el catálogo entregados para ORIGEN.

Cambios principales:
- Se corrigieron niveles y datos detectados en la auditoría.
- Se eliminaron mezclas entre Concá + Los Arcos y Río & Vino.
- Gruta de La Puente ahora separa sus dos modalidades dentro de la página.
- Se corrigieron los datos de Escalada Peaje/Potosino, Candelas, Chivo y Comadres Camp.
- Travesía de las Cascadas usa ahora sus datos propios y distingue 4 h de actividad de ~6 h totales.
- La plantilla ya no duplica Seguridad dentro de El Reto.
- Las secciones de aprendizaje, reto e itinerario son opcionales y dependen de los datos de cada experiencia.
- Las modalidades específicas se muestran como variantes, no como información mezclada.

No se inventaron precios, cupos ni servicios comerciales que las fichas no especifican.

Pendiente comercial para publicación:
- fechas
- cupos
- precios
- servicios incluidos por salida
- lista definitiva de equipo por salida
- fotografías y videos reales

GALERÍAS DE EXPERIENCIAS Y SALIDAS

Cada experiencia admite una galería resumen de hasta seis fotografías. Las imágenes se detectan automáticamente por nombre; si falta un archivo, el espacio no se muestra:
- assets/images/experiencias/<slug>/gallery-01.png — el lugar y el paisaje
- assets/images/experiencias/<slug>/gallery-02.png — el inicio del recorrido
- assets/images/experiencias/<slug>/gallery-03.png — la actividad en movimiento
- assets/images/experiencias/<slug>/gallery-04.png — detalles del recorrido o equipo
- assets/images/experiencias/<slug>/gallery-05.png — convivencia y participantes
- assets/images/experiencias/<slug>/gallery-06.png — cierre o vista final

La portada sigue usando hero.png. La galería resumen se limita a esas seis imágenes y puede tener menos hasta que se agregue material.

Las fotos de una salida específica van separadas por fecha:
- assets/images/experiencias/<slug>/salidas/AAAA-MM-DD/gallery-01.png
- assets/images/experiencias/<slug>/salidas/AAAA-MM-DD/gallery-02.png
- ...

Para publicar una galería por fecha, agrega en el objeto de esa experiencia de data/experiences.js una propiedad departureGalleries con esta estructura (la fecha es un ejemplo de formato, no una salida publicada):

"departureGalleries": [
  {
    "date": "AAAA-MM-DD",
    "title": "Nombre opcional de la salida",
    "photos": [
      { "file": "gallery-01.png", "alt": "Descripción de la fotografía", "caption": "Texto opcional" },
      { "file": "gallery-02.png", "alt": "Descripción de la fotografía" }
    ]
  }
]

La búsqueda dentro de cada experiencia abre solo las fotos asociadas a la fecha elegida. No se agregan fechas ficticias: la sección muestra un estado informativo hasta que se publiquen fechas reales y se carguen sus imágenes.
