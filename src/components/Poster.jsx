import { useState } from 'react'
import { IMG, MO } from '../data/peliculas'
import { asset } from '../utils'

export default function Poster({ f }) {
  const [ok, setOk] = useState(true)
  return (
    <div className="po" style={{ '--h': f.h }} role="img" aria-label={`Póster de ${f.t}`}>
      {ok && <img src={f.p ? (/^https?:/.test(f.p) ? f.p : asset(f.p)) : asset(IMG[f.i])} alt="" onError={() => setOk(false)} />}
      <small>{f.y}</small>
      <svg className="mo" viewBox="0 0 60 60" aria-hidden="true" dangerouslySetInnerHTML={{ __html: MO[f.mo ?? f.i] }} />
      <b>{f.t}</b>
      <i>{f.g}</i>
    </div>
  )
}
