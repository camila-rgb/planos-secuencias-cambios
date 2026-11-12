import { useEffect, useRef, useState } from 'react'
import { act, useApp } from '../context/AppContext'
import { PELICULAS, PRICE } from '../data/peliculas'
import { descuento, fd, money, total } from '../utils'

export default function PayModal() {
  const { user, openId, pay, closePay, editUser, finishPay } = useApp()
  const f = PELICULAS[openId]
  const q = pay.q
  const [cc, setCc] = useState('')
  const [ex, setEx] = useState('')
  const [cv, setCv] = useState('')
  const [pn, setPn] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const alive = useRef(true)
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])

  const sub = q * PRICE
  const t = total(q, user)
  const d = descuento(user)

  const pagar = () => {
    const n = cc.replace(/\s/g, '')
    const m = /^(\d\d)\/(\d\d)$/.exec(ex)
    if (!/^\d{16}$/.test(n)) return setErr('Ingresá los 16 dígitos de la tarjeta.')
    if (!m || +m[1] < 1 || +m[1] > 12 || new Date(2000 + +m[2], +m[1], 0, 23, 59) < new Date())
      return setErr('Vencimiento inválido o vencido (formato MM/AA).')
    if (!/^\d{3}$/.test(cv)) return setErr('El CVC tiene 3 dígitos.')
    if (pn.trim().length < 3) return setErr('Ingresá el nombre que figura en la tarjeta.')
    if (n !== '4242424242424242' && n !== '4000000000000002')
      return setErr('Modo prueba: usá 4242 4242 4242 4242 (aprobada) o 4000 0000 0000 0002 (rechazada).')

    setErr(''); setBusy(true)
    const id = user.rid
    const ref = 'PAY-' + String(Date.now()).slice(-6)
    setTimeout(() => {
      if (n === '4000000000000002') {
        if (alive.current) { setBusy(false); setErr('Pago rechazado por el banco (simulación). Probá con otra tarjeta.') }
        return
      }
      editUser((u) => {
        u.res.push({ id, i: openId, q, st: 'Confirmada', total: t, pay: 'Pagado (prueba)', ref })
        u.rid = id + 1
        act(u, `Pagó ${money(t)} y reservó ${q} entrada${q > 1 ? 's' : ''} para ${f.t}`)
      })
      finishPay(id)
    }, 1200)
  }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) closePay() }}>
      <div className="sheet" style={{ display: 'block', maxWidth: 460 }} role="dialog" aria-modal="true" aria-label="Pago">
        <button className="btn" onClick={closePay} style={{ float: 'right' }} aria-label="Cerrar">✕</button>
        <h2 style={{ margin: '0 0 8px' }}>Pagar</h2>
        <span className="tag">Modo prueba · no se cobra dinero real</span>
        <div className="box">
          <b>{f.t}</b>
          <div className="meta">{fd(openId)} · 19:00 h</div>
          <div className="meta">{q} × {money(PRICE)} = {money(sub)}</div>
          {d ? <div className="meta">Descuento plan {user.plan} ({d * 100}%): −{money(sub - t)}</div> : null}
          <div style={{ fontSize: '1.3rem', marginTop: 6 }}><b>Total: {money(t)}</b></div>
        </div>
        <label style={{ marginTop: 12 }}>Número de tarjeta
          <input inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" maxLength={19} value={cc} onChange={(e) => setCc(e.target.value)} />
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label>Vencimiento
            <input placeholder="MM/AA" maxLength={5} autoComplete="off" value={ex} onChange={(e) => setEx(e.target.value)} />
          </label>
          <label>CVC
            <input inputMode="numeric" placeholder="123" maxLength={3} autoComplete="off" value={cv} onChange={(e) => setCv(e.target.value)} />
          </label>
        </div>
        <label>Nombre en la tarjeta
          <input autoComplete="off" value={pn} onChange={(e) => setPn(e.target.value)} />
        </label>
        <p className="meta">Tarjeta de prueba: 4242 4242 4242 4242, cualquier vencimiento futuro y CVC 123. Para probar un rechazo: 4000 0000 0000 0002. No ingreses datos reales: no se guardan.</p>
        {err && <p role="alert" style={{ color: 'var(--err)', fontWeight: 700 }}>{err}</p>}
        <button className="btn p" onClick={pagar} disabled={busy}>{busy ? 'Procesando pago…' : 'Pagar ' + money(t)}</button>
      </div>
    </div>
  )
}
