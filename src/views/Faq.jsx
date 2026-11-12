import { FAQ } from '../data/peliculas'

export default function Faq() {
  return (
    <>
      <h2>Preguntas frecuentes</h2>
      {FAQ.map((q) => (
        <details key={q[0]} className="box">
          <summary>{q[0]}</summary>
          <p style={{ margin: '8px 0 0' }}>{q[1]}</p>
        </details>
      ))}
    </>
  )
}
