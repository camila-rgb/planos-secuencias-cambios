import { useApp } from '../context/AppContext'
import { PELICULAS as F } from '../data/peliculas'
import { fd, today } from '../utils'
import Card from '../components/Card'
import Poster from '../components/Poster'

export default function Home() {
  const { go, openFicha } = useApp()
  const t = today()
  const proximas = [...Array(7)].map((_, k) => t + k).filter((i) => i < F.length)
  return (
    <>
      <section className="hero sky">
        <div>
          <div className="day">Hoy · {fd(t, { weekday: 'long', day: 'numeric', month: 'long' })} · 19:00 h</div>
          <h1 style={{ margin: '10px 0 14px' }}>Cine bajo <em>las estrellas</em>. Cada noche.</h1>
          <p>Una película por día, a las 19:00, al aire libre. Reservá tu lugar, votá lo que se proyecta y armá tu historia de espectador.</p>
          <div className="row">
            <button className="btn p" onClick={() => openFicha(t)}>Reservar “{F[t].t}”</button>
            <button className="btn" onClick={() => go('cart')}>Ver cartelera</button>
            <button className="btn" onClick={() => go('mem')}>Hacerme socio</button>
          </div>
        </div>
        <button className="hp" onClick={() => openFicha(t)} aria-label={`Ver ficha de ${F[t].t}`}>
          <Poster f={F[t]} />
        </button>
      </section>

      <h2>Próximas funciones</h2>
      <div className="strip">{proximas.map((i) => <Card key={i} f={F[i]} mini />)}</div>

      <div className="cta">
        <div>
          <h2 style={{ margin: '0 0 6px' }}>Sumate a la comunidad</h2>
          <div>Votá, recomendá y decidí las próximas funciones.</div>
        </div>
        <span className="row" style={{ margin: 0 }}>
          <button className="btn p" onClick={() => go('mem')}>Quiero ser socio</button>
          <button className="btn" onClick={() => go('vot')}>Votar la próxima función</button>
        </span>
      </div>
    </>
  )
}
