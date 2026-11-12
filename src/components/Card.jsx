import { useApp } from '../context/AppContext'
import { RAIN } from '../data/peliculas'
import { fd, past, dt } from '../utils'
import { icono, useClima, ymd } from '../clima'
import Poster from './Poster'

export default function Card({ f, mini }) {
  const { user, openFicha } = useApp()
  const clima = useClima()[ymd(dt(f.i))]
  const no = user && user.no.includes(f.i)
  return (
    <article className={`card ${mini ? 'mini' : ''} ${no ? 'off' : ''}`}>
      {mini && <div className="day">{fd(f.i, { weekday: 'short', day: 'numeric', month: 'short' })} · 19:00</div>}
      <Poster f={f} />
      <h3 style={{ fontSize: '1.1rem' }}>{f.t}</h3>
      <div className="meta">{f.y} · {f.g}</div>
      {mini && <p className="meta" style={{ margin: 0 }}>{f.s}</p>}
      {mini && clima && !past(f.i) && (
        <div className="meta">{icono(clima.c)} {clima.min}° / {clima.max}° · lluvia {clima.p}%{clima.p >= 60 ? ' ⚠️' : ''}</div>
      )}
      {no && <span className="tag">Descartada por vos</span>}
      {past(f.i) && <span className="tag">Función finalizada</span>}
      {RAIN.includes(f.i) && <span className="tag">Suspendida por lluvia</span>}
      <button className="btn p" onClick={() => openFicha(f.i)} style={{ marginTop: 'auto' }}>Ver ficha</button>
    </article>
  )
}
