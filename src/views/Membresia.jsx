import { act, useApp } from '../context/AppContext'
import { PLANS } from '../data/peliculas'
import { lvl, planDe } from '../utils'
import Auth from './Auth'

export default function Membresia() {
  const { user: u, editUser, toast, go } = useApp()
  if (!u) return <Auth />
  const [nivel, n] = lvl(u.visits)
  const plan = planDe(u)
  const elegir = (p) => {
    editUser((x) => { x.plan = p; act(x, 'Eligió el plan ' + p) })
    toast('Plan actualizado: ' + p)
  }
  return (
    <>
      <h2>Membresía</h2>
      <div className="carnet">
        <small>CARNET DE SOCIO</small>
        <h3 style={{ fontSize: '1.8rem', margin: '8px 0 2px' }}>{u.name}</h3>
        <div>Nivel <b>{nivel}</b> · {u.visits} funciones · Plan <b>{plan}</b></div>
        <div className="meta" style={{ color: '#B5B0A5' }}>Socio desde {u.since}</div>
      </div>
      <p>{n ? `Te ${n === 1 ? 'falta 1 función' : 'faltan ' + n + ' funciones'} para el próximo nivel.` : 'Llegaste al nivel máximo.'}</p>

      <h2 style={{ fontSize: '1.3rem' }}>Planes</h2>
      <div className="grid">
        {PLANS.map((p) => (
          <article key={p[0]} className="card">
            <h3 style={{ fontSize: '1.4rem' }}>{p[0]}</h3>
            <b>{p[1]}</b>
            <ul style={{ paddingLeft: 18, margin: 0 }}>{p[2].map((x) => <li key={x}>{x}</li>)}</ul>
            <button className={`btn ${plan === p[0] ? '' : 'p'}`} style={{ marginTop: 'auto' }} onClick={() => elegir(p[0])}>
              {plan === p[0] ? '✓ Tu plan' : 'Elegir plan'}
            </button>
          </article>
        ))}
      </div>
      <p className="meta">Simulación: no se realiza ningún cobro. Los precios son de ejemplo.</p>

      <h2 style={{ fontSize: '1.3rem' }}>Beneficios</h2>
      <ul>
        <li>Votar y calificar las películas que viste</li>
        <li>Recomendar películas con comentarios</li>
        <li>Filtro personal de “No me interesa”</li>
        <li>Reservas con historial y cancelación hasta 24 h antes</li>
      </ul>
      <button className="btn p" onClick={() => go('me')}>Ir a mi perfil</button>
    </>
  )
}
