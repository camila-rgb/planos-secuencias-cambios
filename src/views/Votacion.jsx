import { act, useApp } from '../context/AppContext'
import { POLL } from '../data/peliculas'

export default function Votacion() {
  const { user: u, requireUser, editUser, toast } = useApp()
  const mine = u ? u.pv : undefined
  const tot = POLL.reduce((a, p, k) => a + p[3] + (mine === k ? 1 : 0), 0)
  const votar = (k) => {
    if (!requireUser('Para votar la próxima función necesitás tu usuario: hay un voto por socio.')) return
    editUser((x) => { x.pv = k; act(x, 'Votó ' + POLL[k][0] + ' en la votación comunitaria') })
    toast('Voto registrado')
  }
  return (
    <>
      <h2>Votación comunitaria</h2>
      <p className="meta">Elegí qué película se proyecta el lunes 26/10. La votación cierra el domingo 25/10 a las 19:00. Un voto por socio: podés cambiarlo hasta el cierre.</p>
      {POLL.map((p, k) => {
        const n = p[3] + (mine === k ? 1 : 0)
        const pc = Math.round((n * 100) / tot)
        return (
          <div key={p[0]} className="res" style={{ display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <div><b>{p[0]}</b><div className="meta">{p[1]} · {p[2]}</div></div>
              <button className={`btn ${mine === k ? '' : 'p'}`} onClick={() => votar(k)}>{mine === k ? '✓ Tu voto' : 'Votar'}</button>
            </div>
            <div className="bar2" role="img" aria-label={`${pc}% de los votos`}><i style={{ width: `${pc}%` }} /></div>
            <div className="meta">{n} votos · {pc}%</div>
          </div>
        )
      })}
      <p className="meta">Total: {tot} votos{u ? '' : '. Para votar necesitás tu usuario.'}</p>
    </>
  )
}
