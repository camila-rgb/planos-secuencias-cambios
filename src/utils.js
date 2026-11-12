import { BASE, CAP, PELICULAS } from './data/peliculas'
import { PRICE, DESC } from './data/peliculas'

export const dt = (i) => new Date(BASE[0], BASE[1], BASE[2] + i, 19, 0)

export const fd = (i, o) =>
  dt(i).toLocaleDateString('es-AR', o || { weekday: 'long', day: 'numeric', month: 'long' })

export const fdCorta = (i) => fd(i, { weekday: 'short', day: 'numeric', month: 'short' })

export const money = (n) => '$' + n.toLocaleString('es-AR')

export const past = (i) => dt(i) < new Date()

export const today = () =>
  Math.min(PELICULAS.length - 1, Math.max(0, Math.floor((new Date() - new Date(BASE[0], BASE[1], BASE[2])) / 864e5)))

// Nivel de socio según funciones vistas: [nombre, funciones que faltan para el siguiente]
export const lvl = (v) => (v >= 10 ? ['Palco', 0] : v >= 5 ? ['Platea', 10 - v] : ['Butaca', 5 - v])

export const planDe = (u) => (u && u.plan) || 'Básico'
export const descuento = (u) => DESC[planDe(u)] || 0
export const total = (q, u) => Math.round(q * PRICE * (1 - descuento(u)))
export const maxEntradas = (u) => (planDe(u) === 'Básico' ? 4 : 6)

// Lugares libres de una función (cupo − ocupados − reservas confirmadas del usuario actual)
export const lugares = (i, u) =>
  CAP - PELICULAS[i].taken -
  (u ? u.res : []).filter((r) => r.i === i && r.st === 'Confirmada').reduce((a, r) => a + r.q, 0)

export const promedio = (i, u) => {
  const m = u && u.votes[i]
  const f = PELICULAS[i]
  return m ? ((f.r * f.v + m) / (f.v + 1)).toFixed(1) : f.r.toFixed(1)
}

export const emailOk = (s) => /^\S+@\S+\.\S+$/.test(s)

// Ruta de un archivo de /public respetando la base de Vite (útil si se publica en una subcarpeta).
export const asset = (p) => ((import.meta.env && import.meta.env.BASE_URL) || '/') + p
