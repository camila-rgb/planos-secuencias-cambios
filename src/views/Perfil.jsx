import { useState } from 'react'
import { act, tg, useApp } from '../context/AppContext'
import { GENEROS, PELICULAS as F, RAIN } from '../data/peliculas'
import { dt, fd, fdCorta, lugares, lvl, money, past } from '../utils'
import Auth from './Auth'
import Card from '../components/Card'

const H = ({ children }) => <h2 style={{ fontSize: '1.35rem' }}>{children}</h2>

// Funciones a las que se puede mover una reserva suspendida por lluvia
const alternativas = (r, user) => F.filter((f) => !RAIN.includes(f.i) && !past(f.i) && lugares(f.i, user) >= r.q)

function Reprogramar({ r }) {
  const { user, editUser, toast } = useApp()
  const o = alternativas(r, user)
  const [sel, setSel] = useState('')
  const tag = <span className="tag">Suspendida por lluvia · reprogramable</span>
  if (!o.length) return tag
  const reprogramar = () => {
    const i = +(sel || o[0].i)
    if (!o.some((f) => f.i === i)) return toast('No hay funciones disponibles para reprogramar')
    editUser((u) => {
      const x = u.res.find((z) => z.id === r.id)
      x.i = i
      act(u, 'Reprogramó su reserva a ' + F[i].t)
    })
    toast('Reserva reprogramada')
  }
  return (
    <span>
      {tag}
      <label style={{ margin: '6px 0' }}>Elegí otra función
        <select value={sel || o[0].i} onChange={(e) => setSel(e.target.value)}>
          {o.map((f) => <option key={f.i} value={f.i}>{fdCorta(f.i)} · {f.t}</option>)}
        </select>
      </label>
      <button className="btn p" onClick={reprogramar}>Reprogramar</button>
    </span>
  )
}

function Reserva({ r }) {
  const { editUser, toast, setTicketId } = useApp()
  const [confirmar, setConfirmar] = useState(false)
  const vigente = r.st === 'Confirmada' && !past(r.i)
  const cancelable = dt(r.i) - new Date() >= 864e5
  const cancelar = () => {
    editUser((u) => {
      const x = u.res.find((z) => z.id === r.id)
      x.st = 'Cancelada'
      act(u, 'Canceló la reserva de ' + F[r.i].t)
    })
    setConfirmar(false)
    toast('Reserva cancelada' + (r.total ? '. Se reembolsa ' + money(r.total) : ''))
  }
  return (
    <div className="res">
      <div>
        <b>{F[r.i].t}</b>
        <div className="meta">
          {fd(r.i)} · 19:00 · {r.q} entrada{r.q > 1 ? 's' : ''} ·{' '}
          <b style={{ color: r.st === 'Cancelada' ? 'var(--err)' : 'var(--ok)' }}>{r.st}</b>
          {r.pay ? ` · ${r.pay}: ${money(r.total)}` : ''}
        </div>
      </div>
      {vigente && RAIN.includes(r.i) && <Reprogramar r={r} />}
      {vigente && !RAIN.includes(r.i) && (
        <>
          <button className="btn p" onClick={() => setTicketId(r.id)}>Ver entrada</button>{' '}
          {cancelable
            ? (confirmar
              ? <span><button className="btn" onClick={cancelar}>Sí, cancelar</button> <button className="btn" onClick={() => setConfirmar(false)}>Volver</button></span>
              : <button className="btn" onClick={() => setConfirmar(true)}>Cancelar</button>)
            : <span className="meta">No cancelable (menos de 24 h)</span>}
        </>
      )}
    </div>
  )
}

function Recomendar() {
  const { editUser, toast } = useApp()
  const [rf, setRf] = useState(0)
  const [rt, setRt] = useState('')
  const [err, setErr] = useState('')
  const publicar = () => {
    const t = rt.trim()
    if (t.length < 10) return setErr('Escribí un comentario de al menos 10 caracteres.')
    editUser((u) => { u.recs.unshift({ i: +rf, txt: t, d: 'hoy' }); act(u, 'Recomendó ' + F[+rf].t) })
    setRt(''); setErr('')
    toast('Recomendación publicada')
  }
  return (
    <div className="box">
      <label>Recomendar una película
        <select value={rf} onChange={(e) => setRf(+e.target.value)}>
          {F.map((f) => <option key={f.i} value={f.i}>{f.t}</option>)}
        </select>
      </label>
      <label>Tu comentario
        <textarea rows="2" maxLength={140} value={rt} onChange={(e) => setRt(e.target.value)} />
      </label>
      {err && <p role="alert" style={{ color: 'var(--err)', fontWeight: 700, margin: '0 0 8px' }}>{err}</p>}
      <button className="btn p" onClick={publicar}>Publicar recomendación</button>
    </div>
  )
}

const Grilla = ({ ids, vacio }) =>
  ids.length ? <div className="grid">{ids.map((i) => <Card key={i} f={F[i]} />)}</div> : <div className="empty">{vacio}</div>

export default function Perfil() {
  const { user: u, go, logout, editUser, toast } = useApp()
  if (!u) return <Auth />
  const [nivel] = lvl(u.visits)
  const ini = u.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const proximas = u.res.filter((r) => r.st === 'Confirmada' && !past(r.i)).length
  const votos = Object.entries(u.votes)

  return (
    <>
      <section className="prof">
        <div className="av" aria-hidden="true">{ini}</div>
        <div>
          <h1>{u.name}</h1>
          <div className="meta">{u.email} · Socio desde {u.since}</div>
          <span className="tag">{nivel}</span>
        </div>
        <span className="row" style={{ margin: 0 }}>
          <button className="btn" onClick={() => go('mem')}>Carnet y planes</button>
          <button className="btn" onClick={logout}>Cerrar sesión</button>
        </span>
      </section>

      <div className="stats">
        <div><b>{u.visits}</b>funciones vistas</div>
        <div><b>{votos.length}</b>votos</div>
        <div><b>{u.fav.length}</b>favoritas</div>
        <div><b>{proximas}</b>reservas próximas</div>
      </div>

      <H>Mis preferencias</H>
      <div className="row" style={{ marginTop: 0 }}>
        {GENEROS.map((g) => (
          <button key={g} className="chip" aria-pressed={u.gen.includes(g)} onClick={() => editUser((x) => tg(x.gen, g))}>{g}</button>
        ))}
      </div>

      <H>Mis reservas</H>
      {u.res.length
        ? u.res.map((r) => <Reserva key={r.id} r={r} />)
        : <div className="empty">Todavía no reservaste. Elegí una función en la cartelera.</div>}

      <H>Favoritas</H>
      <Grilla ids={u.fav} vacio="Guardá películas con el botón ♥ de la ficha." />

      <H>Mis votos</H>
      {votos.length
        ? votos.map(([i, v]) => (
          <div key={i} className="res">
            <b>{F[i].t}</b>
            <span style={{ color: 'var(--btn)', fontSize: '1.2rem' }} aria-label={`${v} de 5`}>{'★'.repeat(v)}{'☆'.repeat(5 - v)}</span>
          </div>))
        : <div className="empty">Calificá las películas que ya viste.</div>}

      <H>Mis recomendaciones</H>
      {u.recs.map((r, x) => (
        <div key={x} className="res">
          <div><b>{F[r.i].t}</b><div className="meta">“{r.txt}” · {r.d}</div></div>
          <button className="btn" aria-label="Eliminar recomendación"
            onClick={() => { editUser((z) => { z.recs.splice(x, 1) }); toast('Recomendación eliminada') }}>Eliminar</button>
        </div>
      ))}
      <Recomendar />

      <H>Descartadas por mí</H>
      <Grilla ids={u.no} vacio="Las que marques como “No me interesa” aparecen acá. Solo vos las ves atenuadas." />

      <H>Mi actividad</H>
      <ul className="tl">
        {u.act.slice(0, 8).map((a, k) => <li key={k}><span>{a.t}</span><span className="meta">{a.w}</span></li>)}
      </ul>
    </>
  )
}
