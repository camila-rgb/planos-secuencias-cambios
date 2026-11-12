import { useApp } from '../context/AppContext'

export default function Footer() {
  const { go, nube } = useApp()
  return (
    <footer>
      <div className="wrap">
        <div className="row" style={{ margin: '0 0 12px' }}>
          <button className="chip" onClick={() => go('faq')}>Preguntas frecuentes</button>
          <button className="chip" onClick={() => go('ctc')}>Contacto</button>
          <button className="chip" onClick={() => go('nos')}>Quiénes somos</button>
        </div>
        Planos Secuencias · Cine al aire libre · Funciones a las 19:00 h · Cupo: 50 personas por función ·{' '}
        {nube === 'ok' ? 'Perfil sincronizado con Firebase.'
          : nube === 'conectando' ? 'Conectando con Firebase…'
          : nube === 'error' ? 'Sin conexión con Firebase: tus datos se guardan en este navegador.'
          : 'Datos guardados en este navegador.'}
      </div>
    </footer>
  )
}
