import { useEffect, useState } from 'react'

// Pronóstico diario de Buenos Aires (Open-Meteo: gratis y sin clave). Se guarda 3 h para no repetir pedidos.
const URL = 'https://api.open-meteo.com/v1/forecast?latitude=-34.61&longitude=-58.38&timezone=America%2FArgentina%2FBuenos_Aires&forecast_days=16&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max'
const KEY = 'ps_clima'
const TTL = 3 * 36e5
let mem = null

export const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const icono = (c) => (c === 0 ? '☀️' : c <= 2 ? '🌤️' : c === 3 ? '☁️' : c <= 48 ? '🌫️' : c <= 57 ? '🌦️' : c <= 67 ? '🌧️' : c <= 77 ? '❄️' : c <= 82 ? '🌧️' : '⛈️')

async function cargar() {
  try {
    const c = JSON.parse(localStorage.getItem(KEY))
    if (c && Date.now() - c.t < TTL) return c.d
  } catch (e) { /* sin caché */ }
  const j = (await (await fetch(URL)).json()).daily
  const d = {}
  j.time.forEach((t, k) => {
    d[t] = { c: j.weather_code[k], max: Math.round(j.temperature_2m_max[k]), min: Math.round(j.temperature_2m_min[k]), p: j.precipitation_probability_max[k] }
  })
  try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d })) } catch (e) { /* sin almacenamiento */ }
  return d
}

// Devuelve { 'AAAA-MM-DD': { c: código, min, max, p: % de lluvia } }. Si falla, queda vacío y la app sigue igual.
export function useClima() {
  const [d, setD] = useState(mem || {})
  useEffect(() => {
    if (mem) return
    cargar().then((x) => { mem = x; setD(x) }).catch(() => {})
  }, [])
  return d
}
