import { PELICULAS } from '../data/peliculas'

export default function Nosotros() {
  return (
    <>
      <h2>Quiénes somos</h2>
      <p style={{ maxWidth: '60ch', fontSize: '1.1rem' }}>
        Planos Secuencias es un cine independiente al aire libre. Cada noche, a las 19:00, proyectamos una película icónica y la vemos juntos bajo el cielo. Creemos que el cine se disfruta más en comunidad: por eso los socios votan la programación, recomiendan y comentan.
      </p>
      <div className="stats">
        <div><b>1</b>película por noche</div>
        <div><b>50</b>lugares por función</div>
        <div><b>19:00</b>todas las funciones</div>
        <div><b>{PELICULAS.length}</b>títulos en cartel</div>
      </div>
    </>
  )
}
