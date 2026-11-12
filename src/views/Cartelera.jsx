import { useState } from 'react'
import { PELICULAS as F, GENEROS_CARTEL } from '../data/peliculas'
import { fd, today } from '../utils'
import Card from '../components/Card'

const EPOCAS = [['', 'Todas'], ['a', 'Hasta 1959'], ['b', '1960–1989'], ['c', '1990 en adelante']]

export default function Cartelera() {
  const [wk, setWk] = useState(() => Math.floor(today() / 7))
  const [q, setQ] = useState('') // texto del campo
  const [fq, setFq] = useState('') // búsqueda aplicada (botón Buscar / Enter)
  const [fg, setFg] = useState('')
  const [fe, setFe] = useState('')

  const filtrando = fq || fg || fe
  const buscar = () => setFq(q.trim())
  const limpiar = () => { setQ(''); setFq(''); setFg(''); setFe('') }

  const barra = (
    <div className="box" style={{ margin: '12px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 10 }}>
        <label>Buscar título o director
          <input value={q} placeholder="Ej: Kubrick" onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') buscar() }} />
        </label>
        <label>Género
          <select value={fg} onChange={(e) => setFg(e.target.value)}>
            <option value="">Todos</option>
            {GENEROS_CARTEL.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <label>Época
          <select value={fe} onChange={(e) => setFe(e.target.value)}>
            {EPOCAS.map((o) => <option key={o[0]} value={o[0]}>{o[1]}</option>)}
          </select>
        </label>
      </div>
      <div className="row" style={{ margin: 0 }}>
        <button className="btn p" onClick={buscar}>Buscar</button>
        <button className="btn" onClick={limpiar}>Limpiar filtros</button>
      </div>
    </div>
  )

  if (filtrando) {
    const t = fq.toLowerCase()
    const r = F.filter((f) =>
      (!fg || f.g === fg) &&
      (!fe || (fe === 'a' ? f.y < 1960 : fe === 'b' ? f.y < 1990 : f.y >= 1990)) &&
      (!t || (f.t + ' ' + f.d).toLowerCase().includes(t)))
    return (
      <>
        <h2 style={{ marginBottom: 0 }}>Cartelera</h2>
        {barra}
        <p className="meta">{r.length} resultado{r.length === 1 ? '' : 's'}</p>
        {r.length
          ? <div className="grid">{r.map((f) => <Card key={f.i} f={f} mini />)}</div>
          : <div className="empty">No hay películas con esos filtros. Probá con otro género o época.</div>}
      </>
    )
  }

  const a = wk * 7
  const dias = [...Array(7)].map((_, k) => F[a + k]).filter(Boolean)
  return (
    <>
      <div className="wk">
        <h2 style={{ margin: 0 }}>Cartelera</h2>
        <div className="row" style={{ margin: 0 }}>
          <button className="btn" onClick={() => setWk(wk - 1)} disabled={wk === 0} aria-label="Semana anterior">←</button>
          <span style={{ alignSelf: 'center', fontWeight: 700 }}>
            {fd(a, { day: 'numeric', month: 'short' })} – {fd(Math.min(a + 6, F.length - 1), { day: 'numeric', month: 'short' })}
          </span>
          <button className="btn" onClick={() => setWk(wk + 1)} disabled={a + 7 >= F.length} aria-label="Semana siguiente">→</button>
        </div>
      </div>
      <p className="meta">Una película por día, todas a las 19:00. Las que descartes se atenúan solo para vos.</p>
      {barra}
      <div className="strip">{dias.map((f) => <Card key={f.i} f={f} mini />)}</div>
    </>
  )
}
