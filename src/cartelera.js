import { aplicarCartelera } from './data/peliculas'

// Renovación mensual de la cartelera. Con VITE_TMDB_KEY toma clásicos de TMDB (una película por día del mes);
// sin clave usa la rotación del catálogo propio (ya aplicada al cargar peliculas.js).
// El resultado se guarda por mes en localStorage: al cambiar de mes se pide uno nuevo.
const KEY = import.meta.env.VITE_TMDB_KEY
const get = (ruta, extra = '') =>
  fetch(`https://api.themoviedb.org/3${ruta}?api_key=${KEY}&language=es-AR${extra}`)
    .then((r) => { if (!r.ok) throw new Error('TMDB ' + r.status); return r.json() })

export async function renovarCartelera(hoy = new Date()) {
  const y = hoy.getFullYear(), m = hoy.getMonth()
  const ck = `ps_cart_${y}-${String(m + 1).padStart(2, '0')}`
  try {
    const c = JSON.parse(localStorage.getItem(ck))
    if (c && c.length) { aplicarCartelera(c, [y, m, 1]); return }
  } catch (e) { /* sin caché */ }
  if (!KEY) return

  const dias = new Date(y, m + 1, 0).getDate()
  const p = 2 * ((y * 12 + m) % 4) + 1 // cada mes toma otro par de páginas del ranking
  const q = '&sort_by=vote_average.desc&vote_count.gte=3000&primary_release_date.lte=2005-12-31'
  const pags = await Promise.all([p, p + 1].map((n) => get('/discover/movie', `${q}&page=${n}`)))
  const base = pags.flatMap((r) => r.results).slice(0, dias)
  const det = await Promise.all(base.map((b) => get(`/movie/${b.id}`, '&append_to_response=credits')))
  const lista = det.map((x) => ({
    t: x.title,
    y: +(x.release_date || '0').slice(0, 4),
    d: ((x.credits.crew || []).find((c) => c.job === 'Director') || {}).name || '—',
    g: (x.genres[0] || {}).name || 'Drama',
    h: (x.id * 37) % 360,
    s: x.overview || 'Sinopsis no disponible.',
    r: +(x.vote_average / 2).toFixed(1),
    v: x.vote_count,
    p: x.poster_path ? `https://image.tmdb.org/t/p/w342${x.poster_path}` : null,
    mo: x.id % 14,
  }))
  if (!lista.length) return
  aplicarCartelera(lista, [y, m, 1])
  try { localStorage.setItem(ck, JSON.stringify(lista)) } catch (e) { /* sin almacenamiento */ }
}
