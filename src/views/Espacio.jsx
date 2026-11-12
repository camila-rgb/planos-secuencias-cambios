import { ESPACIO } from '../data/peliculas'

export default function Espacio() {
  return (
    <>
      <h2>El espacio</h2>
      <p className="meta">Todo lo que conviene saber antes de venir.</p>
      <div className="grid">
        {ESPACIO.map((c) => (
          <article key={c[0]} className="card">
            <h3 style={{ fontSize: '1.3rem' }}>{c[0]}</h3>
            <p style={{ margin: 0 }}>{c[1]}</p>
          </article>
        ))}
      </div>
      <div className="cta" style={{ marginTop: 28 }}>
        <div>
          <h2 style={{ margin: '0 0 6px' }}>Si llueve</h2>
          <div>Si a las 17:00 hay lluvia fuerte, la función se suspende y lo avisamos acá. Tu reserva queda reprogramable a otra función, sin costo.</div>
        </div>
      </div>
      <p className="meta">Dirección: a completar con los datos reales del predio.</p>
    </>
  )
}
