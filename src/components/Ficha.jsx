import { useState } from 'react'
import { act, tg, useApp } from '../context/AppContext'
import { COM, PELICULAS, CAP, RAIN } from '../data/peliculas'
import { descuento, fd, fdCorta, lugares, maxEntradas, money, past, promedio, total } from '../utils'
import Poster from './Poster'

export default function Ficha() {
  const { user, openId, closeAll, requireUser, editUser, toast, startPay } = useApp()
  const f = PELICULAS[openId]
  const i = f.i
  const mine = user && user.votes[i]
  const l = lugares(i, user)
  const pa = past(i)
  const fv = user && user.fav.includes(i)
  const no = user && user.no.includes(i)
  const [q, setQ] = useState(() => Math.min(2, Math.max(1, l)))
  const [com, setCom] = useState('')

  const comentarios = [...(COM[i] || []), ...(user ? user.recs.filter((r) => r.i === i).map((r) => ['Vos', r.txt]) : [])]
  const maxQ = Math.min(maxEntradas(user), l)
  const d = descuento(user)

  const votar = (n) => {
    if (!requireUser('Para votar necesitamos saber quién sos: tu voto queda guardado en tu perfil.')) return
    editUser((u) => { u.votes[i] = n; act(u, `Votó ${n} ★ a ${f.t}`) })
    toast('Voto guardado: ' + n + ' ★')
  }
  const favorita = () => {
    if (!requireUser('Para guardar favoritas necesitás tu usuario: así las ves en tu perfil.')) return
    editUser((u) => { tg(u.fav, i); act(u, (u.fav.includes(i) ? 'Guardó en favoritas ' : 'Quitó de favoritas ') + f.t) })
    toast(fv ? 'Quitada de favoritas' : 'Guardada en favoritas')
  }
  const descartar = () => {
    if (!requireUser('El filtro “No me interesa” es personal: necesitamos tu usuario para recordarlo.')) return
    editUser((u) => { tg(u.no, i) })
    toast(no ? 'Vuelve a mostrarse' : 'Descartada solo para vos')
  }
  const comentar = () => {
    if (!requireUser('Para comentar necesitás tu usuario: tu comentario queda asociado a tu perfil.')) return
    const t = com.trim()
    if (t.length < 10) { toast('Escribí un comentario de al menos 10 caracteres'); return }
    editUser((u) => { u.recs.unshift({ i, txt: t, d: 'hoy' }); act(u, 'Comentó ' + f.t) })
    setCom('')
    toast('Comentario publicado')
  }
  const reservar = () => {
    if (!requireUser('Para reservar y pagar necesitás tu usuario: así guardamos tus entradas y podés consultarlas o cancelarlas.')) return
    startPay(q)
  }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) closeAll() }}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={f.t}>
        <div><Poster f={f} /></div>
        <div>
          <button className="btn" onClick={closeAll} style={{ float: 'right' }} aria-label="Cerrar">✕</button>
          <h2 style={{ margin: 0 }}>{f.t}</h2>
          <div className="meta">{f.y} · {f.d} · {f.g}</div>
          <p>{f.s}</p>
          <div className="day">{fd(i)} · 19:00 h</div>
          <p style={{ margin: '6px 0' }}>
            <b style={{ fontSize: '1.3rem' }}>★ {promedio(i, user)}</b> <span className="meta">promedio de la comunidad</span>
          </p>
          <div className="stars" role="group" aria-label="Tu calificación">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => votar(n)} className={mine >= n ? 'on' : ''} aria-label={`${n} estrellas`}>★</button>
            ))}
          </div>
          <div className="row" style={{ marginTop: 4 }}>
            <button className="chip" onClick={favorita} aria-pressed={!!fv}>{fv ? '♥ En favoritas' : '♡ Guardar'}</button>
            <button className="chip" onClick={descartar} aria-pressed={!!no}>{no ? 'Volver a mostrar' : 'No me interesa'}</button>
          </div>

          <h3 style={{ fontSize: '1.2rem', margin: '16px 0 6px' }}>Comentarios de la comunidad</h3>
          {comentarios.length
            ? comentarios.map((c, k) => (
              <div key={k} className="meta" style={{ marginBottom: 6 }}>
                <b style={{ color: 'var(--fg)' }}>{c[0]}:</b> {c[1]}
              </div>))
            : <div className="meta">Todavía no hay comentarios. ¡Escribí el primero!</div>}
          <label style={{ marginTop: 8 }}>Dejá tu comentario
            <textarea rows="2" maxLength={140} value={com} onChange={(e) => setCom(e.target.value)} />
          </label>
          <button className="btn" onClick={comentar}>Publicar comentario</button>

          <div className="box">
            <b>Reservar entradas</b>
            {RAIN.includes(i) ? (
              <p className="meta">Función suspendida por lluvia. Si ya reservaste, reprogramá desde tu perfil.</p>
            ) : pa ? (
              <p className="meta">Esta función ya finalizó.</p>
            ) : l <= 0 ? (
              <p className="meta">Función agotada.</p>
            ) : (
              <>
                <div className="meta">Quedan {l} de {CAP} lugares</div>
                <div className="q">
                  <button onClick={() => setQ((x) => Math.max(1, Math.min(maxQ, x - 1)))} aria-label="Menos">−</button>
                  <b aria-live="polite">{q}</b>
                  <button onClick={() => setQ((x) => Math.max(1, Math.min(maxQ, x + 1)))} aria-label="Más">+</button>
                  <span className="meta">máx. {maxQ}</span>
                </div>
                <div className="meta">
                  Resumen: {q} × {f.t}, {fdCorta(i)}, 19:00. Total: {money(total(q, user))}
                  {d ? ` (con ${d * 100}% de descuento)` : ''}. El pago se hace en el paso siguiente. Cancelable hasta 24 h antes.
                </div>
                <button className="btn p" onClick={reservar} style={{ marginTop: 10 }}>Continuar al pago</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
