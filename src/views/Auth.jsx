import { useState } from 'react'
import { useApp, tg } from '../context/AppContext'
import { GENEROS } from '../data/peliculas'

export default function Auth() {
  const { why, signup, login } = useApp()
  const [tab, setTab] = useState('new')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [lemail, setLemail] = useState('')
  const [gen, setGen] = useState([])
  const [err, setErr] = useState('')

  const cambiarTab = (t) => { setTab(t); setErr('') }
  const toggleGen = (g) => setGen((a) => { const n = [...a]; tg(n, g); return n })

  return (
    <section className="auth">
      <div>
        <h1>{why ? 'Primero, tu usuario' : 'Sumate a la membresía'}</h1>
        <p style={{ color: 'var(--mut)', fontSize: '1.1rem' }}>
          {why || 'Creá tu usuario para reservar, votar, guardar favoritas y armar tu perfil de espectador.'}
        </p>
        <ul>
          <li>Entradas y reservas a tu nombre</li>
          <li>Votos, favoritas y recomendaciones</li>
          <li>Filtro personal de películas</li>
        </ul>
      </div>
      <div className="box" style={{ marginTop: 0 }}>
        <div className="row" style={{ margin: '0 0 14px' }}>
          <button className="chip" onClick={() => cambiarTab('new')} aria-pressed={tab === 'new'}>Crear usuario</button>
          <button className="chip" onClick={() => cambiarTab('in')} aria-pressed={tab === 'in'}>Ya tengo usuario</button>
        </div>
        {tab === 'new' ? (
          <>
            <label>Nombre
              <input value={name} autoComplete="name" onChange={(e) => setName(e.target.value)} />
            </label>
            <label>Email
              <input type="email" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
            </label>
            <div className="meta">Géneros que más te gustan</div>
            <div className="row" style={{ margin: '6px 0 14px' }}>
              {GENEROS.map((g) => (
                <button key={g} className="chip" onClick={() => toggleGen(g)} aria-pressed={gen.includes(g)}>{g}</button>
              ))}
            </div>
            <button className="btn p" onClick={() => setErr(signup(name, email, gen))}>Crear mi usuario</button>
          </>
        ) : (
          <>
            <label>Email con el que te registraste
              <input type="email" value={lemail} onChange={(e) => setLemail(e.target.value)} />
            </label>
            <button className="btn p" onClick={() => setErr(login(lemail))}>Ingresar</button>
          </>
        )}
        {err && <p role="alert" style={{ color: 'var(--err)', fontWeight: 700 }}>{err}</p>}
        <p className="meta">Prototipo: tus datos se guardan en este navegador. En la versión real, Firebase Authentication (anónima) te identifica y tu perfil vive en Firestore.</p>
      </div>
    </section>
  )
}
