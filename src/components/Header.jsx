import { useApp } from '../context/AppContext'

export default function Header() {
  const { view, go, user } = useApp()
  const items = [['cart', 'Cartelera'], ['vot', 'Votación'], ['esp', 'El espacio'], ['me', user ? 'Mi cuenta' : 'Ingresar']]
  const actual = (k) => view === k || ((view === 'auth' || view === 'mem') && k === 'me')
  return (
    <header>
      <div className="wrap bar">
        <button className="logo" onClick={() => go('home')} aria-label="Planos Secuencias, ir al inicio">
          <svg width="48" height="28" viewBox="0 0 48 28" aria-hidden="true">
            <rect x="1" y="3" width="13" height="22" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="18" y="3" width="13" height="22" rx="2.5" fill="currentColor" opacity=".4" />
            <rect x="35" y="3" width="13" height="22" rx="2.5" fill="#FFB020" />
          </svg>
          <span><b>Planos Secuencias</b><small>Cine al aire libre</small></span>
        </button>
        <nav aria-label="Principal" id="nav">
          {items.map(([k, n]) => (
            <button key={k} onClick={() => go(k)} aria-current={actual(k) ? 'page' : undefined}>{n}</button>
          ))}
        </nav>
      </div>
    </header>
  )
}
