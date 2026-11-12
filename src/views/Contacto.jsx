import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { emailOk } from '../utils'

export default function Contacto() {
  const { enviarMensaje, toast } = useApp()
  const [n, setN] = useState('')
  const [m, setM] = useState('')
  const [t, setT] = useState('')
  const [err, setErr] = useState('')

  const enviar = () => {
    const nombre = n.trim(), mail = m.trim(), texto = t.trim()
    if (nombre.length < 2) return setErr('Ingresá tu nombre.')
    if (!emailOk(mail)) return setErr('Ingresá un email válido.')
    if (texto.length < 10) return setErr('Escribí un mensaje de al menos 10 caracteres.')
    enviarMensaje({ n: nombre, m: mail, t: texto })
    setN(''); setM(''); setT(''); setErr('')
    toast('Mensaje enviado. ¡Gracias!')
  }

  return (
    <>
      <h2>Contacto</h2>
      <p className="meta">Consultas, grupos o propuestas de películas. También: contacto@planossecuencias.example</p>
      <div className="box">
        <label>Nombre<input value={n} onChange={(e) => setN(e.target.value)} /></label>
        <label>Email<input type="email" value={m} onChange={(e) => setM(e.target.value)} /></label>
        <label>Mensaje<textarea rows="4" maxLength={500} value={t} onChange={(e) => setT(e.target.value)} /></label>
        {err && <p role="alert" style={{ color: 'var(--err)', fontWeight: 700, margin: '0 0 8px' }}>{err}</p>}
        <button className="btn p" onClick={enviar}>Enviar mensaje</button>
      </div>
    </>
  )
}
