// Datos estáticos de la cartelera. En la etapa con Firestore esto pasa a ser la colección "movies".
// Campos: i=índice/día, t=título, y=año, d=director, g=género, h=tono (hue) del póster,
// s=sinopsis, r=promedio de la comunidad, v=cantidad de votos, taken=lugares ya ocupados.

export const CAP = 50 // cupo por función
export const BASE = [2026, 9, 12] // primer día de la cartelera (año, mes 0-11, día)

export const GENEROS = ['Ciencia ficción', 'Drama', 'Suspenso', 'Comedia', 'Romance', 'Aventura', 'Crimen', 'Animación', 'Thriller']

const RAW = [
  ['Casablanca', 1942, 'Michael Curtiz', 'Romance', 210, 'Un bar en Marruecos, un amor imposible y una decisión que cuesta todo.', 4.8, 312],
  ['Metrópolis', 1927, 'Fritz Lang', 'Ciencia ficción', 35, 'Una ciudad del futuro dividida entre quienes mandan y quienes la sostienen.', 4.5, 148],
  ['Psicosis', 1960, 'Alfred Hitchcock', 'Suspenso', 0, 'Una huida, un motel al costado de la ruta y un secreto familiar.', 4.7, 270],
  ['Los siete samuráis', 1954, 'Akira Kurosawa', 'Aventura', 30, 'Una aldea contrata a siete guerreros para defenderse de los bandidos.', 4.9, 201],
  ['2001: Odisea del espacio', 1968, 'Stanley Kubrick', 'Ciencia ficción', 250, 'Un viaje a Júpiter y una computadora que empieza a dudar.', 4.4, 260],
  ['El padrino', 1972, 'Francis Ford Coppola', 'Drama', 15, 'El heredero reticente de una familia mafiosa asume el poder.', 4.9, 355],
  ['Taxi Driver', 1976, 'Martin Scorsese', 'Drama', 45, 'Un taxista insomne recorre una Nueva York cada vez más oscura.', 4.5, 190],
  ['Blade Runner', 1982, 'Ridley Scott', 'Ciencia ficción', 190, 'Un cazador de androides persigue réplicas que quieren más tiempo de vida.', 4.6, 244],
  ['Volver al futuro', 1985, 'Robert Zemeckis', 'Comedia', 25, 'Un adolescente viaja a 1955 y arriesga el noviazgo de sus propios padres.', 4.8, 330],
  ['Pulp Fiction', 1994, 'Quentin Tarantino', 'Crimen', 50, 'Historias cruzadas de gánsters, un boxeador y una maleta misteriosa.', 4.7, 298],
  ['Cinema Paradiso', 1988, 'Giuseppe Tornatore', 'Drama', 20, 'Un director recuerda al proyeccionista que le enseñó a amar el cine.', 4.8, 176],
  ['Nueve reinas', 2000, 'Fabián Bielinsky', 'Thriller', 160, 'Dos estafadores se asocian por un día en Buenos Aires. Nada es lo que parece.', 4.6, 221],
  ['El viaje de Chihiro', 2001, 'Hayao Miyazaki', 'Animación', 340, 'Una niña queda atrapada en un mundo de espíritus y casas de baños.', 4.8, 239],
  ['El secreto de sus ojos', 2009, 'Juan José Campanella', 'Thriller', 5, 'Un exsecretario judicial revisa un crimen que nunca pudo cerrar.', 4.7, 205],
]

export const CATALOGO = RAW.map((a, k) => ({ k, t: a[0], y: a[1], d: a[2], g: a[3], h: a[4], s: a[5], r: a[6], v: a[7] }))

// PELICULAS, BASE y GENEROS_CARTEL son listas "vivas": aplicarCartelera las reemplaza en el lugar,
// así toda la app usa la cartelera del mes sin cambiar sus imports.
export const PELICULAS = []
export const GENEROS_CARTEL = []
export function aplicarCartelera(lista, base) {
  PELICULAS.splice(0, PELICULAS.length, ...lista.map((f, i) => ({ ...f, i, taken: 8 + ((i * 7) % 24) })))
  BASE.splice(0, 3, ...base)
  GENEROS_CARTEL.splice(0, GENEROS_CARTEL.length, ...new Set(PELICULAS.map((f) => f.g)))
}
// Cartelera de respaldo: el catálogo propio rota cada mes para cubrir todos los días.
export function carteleraMensual(y, m) {
  const n = new Date(y, m + 1, 0).getDate(), o = (y * 12 + m) % CATALOGO.length
  return [...Array(n)].map((_, j) => { const c = CATALOGO[(o + j) % CATALOGO.length]; return { ...c, p: IMG[c.k], mo: c.k } })
}

export const IMG = [
  '01-casablanca', '02-metropolis', '03-psicosis', '04-siete-samurais', '05-2001', '06-el-padrino', '07-taxi-driver',
  '08-blade-runner', '09-volver-al-futuro', '10-pulp-fiction', '11-cinema-paradiso', '12-nueve-reinas', '13-chihiro',
  '14-secreto-de-sus-ojos',
].map((n) => `img/${n}.jpg`)

// Ilustración SVG de respaldo (se ve si la imagen del póster no carga).
export const MO = [
  '<circle cx="40" cy="18" r="10"/><path d="M4 46q13-8 26 0t26 0M12 34l14-4 8-8 4 1-5 9"/>',
  '<path d="M6 54V30h10V18h10v36M26 54V8h12v46M38 54V24h10v30M48 54V34h8v20M4 54h52"/>',
  '<path d="M8 32L30 10l22 22M14 28v26h32V28M24 54V38h12v16"/><path class="f" d="M40 14h5v8h-5z"/>',
  '<circle cx="30" cy="30" r="14"/><path d="M8 8l44 44M52 8L8 52"/>',
  '<rect class="f" x="24" y="6" width="12" height="34"/><circle cx="30" cy="50" r="6"/><ellipse cx="30" cy="50" rx="22" ry="5"/>',
  '<circle cx="30" cy="20" r="12"/><path d="M30 20m-6 0a6 6 0 1 1 6 6M30 32v24M30 46l-10-6M30 42l10-6"/>',
  '<rect x="20" y="6" width="20" height="8" rx="2"/><path d="M6 44l6-14h36l6 14zM6 44v8h48v-8"/><circle class="f" cx="18" cy="52" r="4"/><circle class="f" cx="42" cy="52" r="4"/>',
  '<path d="M4 30C14 12 46 12 56 30 46 48 14 48 4 30z"/><circle cx="30" cy="30" r="9"/><circle class="f" cx="30" cy="30" r="3"/>',
  '<circle cx="30" cy="30" r="22"/><path d="M30 14v16l10 6"/>',
  '<rect x="8" y="20" width="44" height="30" rx="3"/><path d="M22 20v-6h16v6M8 32h44"/><rect class="f" x="27" y="29" width="6" height="6"/>',
  '<circle cx="30" cy="30" r="22"/><circle cx="30" cy="16" r="4"/><circle cx="30" cy="44" r="4"/><circle cx="16" cy="30" r="4"/><circle cx="44" cy="30" r="4"/><circle class="f" cx="30" cy="30" r="3"/>',
  '<path d="M8 46L12 18l12 14 6-18 6 18 12-14 4 28zM8 54h44"/>',
  '<ellipse cx="30" cy="30" rx="18" ry="24"/><circle class="f" cx="23" cy="26" r="2.5"/><circle class="f" cx="37" cy="26" r="2.5"/><path d="M22 40q8 6 16 0"/>',
  '<circle cx="26" cy="26" r="16"/><path d="M38 38l16 16"/>',
]

// Votación comunitaria: [título, año, género, votos]
export const POLL = [
  ['Alien, el octavo pasajero', 1979, 'Ciencia ficción', 34],
  ['Cantando bajo la lluvia', 1952, 'Musical', 27],
  ['Tiempos modernos', 1936, 'Comedia', 41],
  ['La naranja mecánica', 1971, 'Drama', 19],
]

// Comentarios de ejemplo por película (índice → [autor, texto])
export const COM = {
  0: [['Lucía', 'Una joya. Verla de noche al aire libre es otra cosa.'], ['Martín', 'El final sigue funcionando perfecto.']],
  3: [['Camila', 'Épica, y el silencio del público la hace mejor.']],
  5: [['Nicolás', 'Nunca la había visto en pantalla grande.']],
  8: [['Joaquín', 'Fui con mi familia y la disfrutamos todos.']],
  11: [['Sofía', 'Con el cielo de Buenos Aires de fondo, un plan ideal.']],
}

// Funciones suspendidas por lluvia (índices)
export const RAIN = [11]

export const PRICE = 5000
export const DESC = { Básico: 0, Cinéfilo: 0.1, Mecenas: 0.2 }
export const PLANS = [
  ['Básico', 'Gratis', ['Reservar hasta 4 entradas', 'Votar y comentar', 'Perfil de espectador']],
  ['Cinéfilo', '$4.500 / mes', ['Reservar hasta 6 entradas', '10% de descuento en entradas', '1 invitación por mes']],
  ['Mecenas', '$9.000 / mes', ['Todo lo de Cinéfilo', '20% de descuento en entradas', 'Lugar preferencial']],
]

export const FAQ = [
  ['¿Cuánto cuesta ir?', 'La entrada cuesta $5.000 y se paga online al reservar (en este prototipo, en modo prueba). Los planes Cinéfilo y Mecenas tienen 10% y 20% de descuento.'],
  ['¿Puedo cancelar una reserva?', 'Sí, hasta 24 horas antes de la función, desde tu perfil. El pago se reembolsa.'],
  ['¿Qué pasa si llueve?', 'Si hay lluvia fuerte, la función se suspende y tu reserva queda reprogramable a otra función, sin costo.'],
  ['¿Cuántas entradas puedo reservar?', 'Hasta 4 con el plan Básico y hasta 6 con Cinéfilo y Mecenas, según el cupo de 50 lugares.'],
  ['¿Cómo se elige la próxima película?', 'Los socios votan entre cuatro candidatas. Hay un voto por persona y se puede cambiar hasta el cierre.'],
  ['¿Dónde veo mis entradas?', 'En Mi perfil. Cada reserva confirmada tiene su entrada con código QR.'],
]

export const ESPACIO = [
  ['Puertas y horario', 'Abrimos a las 18:00. La película empieza a las 19:00, todos los días.'],
  ['Qué llevar', 'Abrigo, almohadón o reposera y, si querés, repelente. El piso es de césped.'],
  ['Comida y bebida', 'Hay buffet en el predio. También podés traer tu mate y tu termo.'],
  ['Accesibilidad', 'Acceso sin escalones y lugares reservados. Avisanos al reservar.'],
  ['Subtítulos y sonido', 'Todas las funciones tienen subtítulos en español y sonido pensado para el aire libre.'],
]

{
  const h = new Date()
  aplicarCartelera(carteleraMensual(h.getFullYear(), h.getMonth()), [h.getFullYear(), h.getMonth(), 1])
}
