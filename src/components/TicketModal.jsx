import qrcode from 'qrcode-generator'
import { useApp } from '../context/AppContext'
import { PELICULAS } from '../data/peliculas'
import { fd, money } from '../utils'

export default function TicketModal() {
  const { user, ticketId, closeAll } = useApp()
  const r = user.res.find((x) => x.id === ticketId)
  if (!r) return null
  const f = PELICULAS[r.i]
  const code = `PS-${String(r.i + 1).padStart(2, '0')}${String(r.id).padStart(3, '0')}-${r.q}`
  let qr = ''
  try {
    const g = qrcode(0, 'M')
    g.addData(code)
    g.make()
    qr = g.createSvgTag(5, 0)
  } catch (e) { /* si falla el QR se muestra solo el código */ }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) closeAll() }}>
      <div className="sheet" style={{ display: 'block', maxWidth: 380, textAlign: 'center' }} role="dialog" aria-modal="true" aria-label="Entrada">
        <button className="btn" onClick={closeAll} style={{ float: 'right' }} aria-label="Cerrar">✕</button>
        <div className="day">Entrada digital</div>
        <h2 style={{ margin: '6px 0' }}>{f.t}</h2>
        <div className="meta">{fd(r.i)} · 19:00 h</div>
        <div className="meta">{r.q} entrada{r.q > 1 ? 's' : ''} · {user.name}</div>
        <div className="qr" role="img" aria-label="Código QR de la reserva">
          {qr ? <span dangerouslySetInnerHTML={{ __html: qr }} /> : <b>{code}</b>}
        </div>
        <b style={{ fontSize: '1.2rem', letterSpacing: '.08em' }}>{code}</b>
        {r.ref && <div className="meta">Pago de prueba {money(r.total)} · {r.ref}</div>}
        <p className="meta">Mostrá este código en la puerta. Abrimos a las 18:00.</p>
      </div>
    </div>
  )
}
