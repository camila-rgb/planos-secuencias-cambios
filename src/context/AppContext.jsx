import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { ensureUser, fdb, firebaseOk } from '../firebase'
import { perfilInicial } from '../data/usuario'
import { emailOk } from '../utils'
import { renovarCartelera } from '../cartelera'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

// Persistencia: localStorage (respaldo y arranque rápido) + Firestore (users/{uid}) cuando hay conexión.
const KEY = 'ps_db'

// Firestore no admite arrays anidados: la actividad se guarda como { t, w }.
// Esto también convierte los datos viejos del prototipo ([texto, cuándo]).
const normalizar = (u) => ({
  ...u,
  act: (u.act || []).map((a) => (Array.isArray(a) ? { t: a[0], w: a[1] } : a)),
})

function leer() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY))
    if (d && d.acc) {
      for (const k of Object.keys(d.acc)) d.acc[k] = normalizar(d.acc[k])
      return d
    }
  } catch (e) { /* sin datos o JSON inválido */ }
  return { acc: {}, ses: null }
}

export const tg = (arr, x) => {
  const k = arr.indexOf(x)
  if (k < 0) arr.push(x)
  else arr.splice(k, 1)
}
export const act = (u, texto) => u.act.unshift({ t: texto, w: 'ahora' })

export function AppProvider({ children }) {
  const [db, setDb] = useState(leer) // { acc: {email: perfil}, ses: email, out: true si cerró sesión, msgs }
  const [uid, setUid] = useState(null) // uid anónimo de Firebase Auth
  const [nube, setNube] = useState(firebaseOk ? 'conectando' : 'off') // off | conectando | ok | error
  const [view, setView] = useState('home')
  const [openId, setOpenId] = useState(null) // ficha abierta (índice de película)
  const [pay, setPay] = useState(null) // { q } cuando el modal de pago está abierto
  const [ticketId, setTicketId] = useState(null) // id de reserva con entrada abierta
  const [why, setWhy] = useState('') // motivo por el que se pide el usuario
  const [msg, setMsg] = useState('')
  const timer = useRef(null)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(db)) } catch (e) { /* almacenamiento no disponible */ }
  }, [db])

  const user = db.ses ? db.acc[db.ses] : null

  // 1) Al abrir: sesión anónima + lectura del perfil guardado en Firestore.
  useEffect(() => {
    if (!firebaseOk) return
    let cancelado = false
    ;(async () => {
      try {
        const fu = await ensureUser()
        const snap = await getDoc(doc(fdb, 'users', fu.uid))
        if (cancelado) return
        setUid(fu.uid)
        if (snap.exists()) {
          const remoto = normalizar(snap.data())
          // El perfil remoto siempre queda disponible; solo se inicia sesión si no se cerró antes.
          setDb((prev) => ({
            ...prev,
            acc: { ...prev.acc, [remoto.email]: remoto },
            ses: prev.out ? prev.ses : remoto.email,
          }))
        }
        setNube('ok')
      } catch (e) {
        console.warn('Firebase no disponible, se usa solo el almacenamiento local:', e)
        if (!cancelado) setNube('error')
      }
    })()
    return () => { cancelado = true }
  }, [])

  // 2) Cada cambio del perfil se guarda en Firestore (con una pequeña espera para agrupar cambios).
  useEffect(() => {
    if (nube !== 'ok' || !uid || !user) return
    const t = setTimeout(() => {
      // JSON elimina valores undefined, que Firestore no acepta.
      setDoc(doc(fdb, 'users', uid), JSON.parse(JSON.stringify(user))).catch((e) => {
        console.warn('No se pudo guardar el perfil en Firestore:', e)
        setNube('error')
      })
    }, 500)
    return () => clearTimeout(t)
  }, [user, uid, nube])

  // Cartelera del mes: se renueva sola al cambiar de mes (ver src/cartelera.js).
  const [, setCart] = useState(0)
  useEffect(() => {
    renovarCartelera().then(() => setCart((v) => v + 1)).catch((e) => console.warn('No se pudo renovar la cartelera:', e))
  }, [])

  const toast = useCallback((m) => {
    setMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(''), 2800)
  }, [])

  // Modifica una copia de la base y la guarda (fn recibe la copia).
  const mutate = useCallback((fn) => setDb((prev) => {
    const n = structuredClone(prev)
    fn(n)
    return n
  }), [])
  // Atajo: modifica el usuario con sesión iniciada.
  const editUser = useCallback((fn) => mutate((n) => {
    const u = n.ses && n.acc[n.ses]
    if (u) fn(u)
  }), [mutate])

  const go = (v) => {
    setView(v); setOpenId(null); setTicketId(null); setPay(null); setWhy('')
    window.scrollTo(0, 0)
  }
  const openFicha = (i) => { setPay(null); setOpenId(i) }
  const closeAll = () => { setOpenId(null); setTicketId(null); setPay(null) }

  // Si no hay usuario, manda a la pantalla de registro con el motivo y devuelve false.
  const requireUser = (motivo) => {
    if (user) return true
    setPay(null); setView('auth'); setWhy(motivo); setOpenId(null)
    return false
  }

  // Cuentas
  const signup = (name, email, gen) => {
    const n = name.trim(), m = email.trim().toLowerCase()
    if (n.length < 2) return 'Ingresá tu nombre (mínimo 2 letras).'
    if (!emailOk(m)) return 'Ingresá un email válido.'
    if (db.acc[m]) return 'Ese email ya tiene usuario. Probá con “Ya tengo usuario”.'
    mutate((d) => {
      d.acc[m] = perfilInicial(n, m, gen.length ? [...gen] : ['Drama', 'Ciencia ficción'])
      d.ses = m
      d.out = false
    })
    setWhy(''); setView('me')
    toast('¡Bienvenido/a, ' + n.split(' ')[0] + '! Tu perfil está listo.')
    return ''
  }
  const login = (email) => {
    const m = email.trim().toLowerCase()
    if (!db.acc[m]) return 'No encontramos ese email. ¿Querés crear tu usuario?'
    mutate((d) => { d.ses = m; d.out = false })
    setWhy(''); setView('me')
    toast('Sesión iniciada')
    return ''
  }
  const logout = () => {
    mutate((d) => { d.ses = null; d.out = true })
    setView('home')
    toast('Sesión cerrada')
  }

  // Mensajes de contacto: quedan en el navegador y, si hay conexión, en la colección "messages".
  const enviarMensaje = ({ n, m, t }) => {
    mutate((d) => { (d.msgs = d.msgs || []).push({ n, m, t, d: Date.now() }) })
    if (nube === 'ok' && uid) {
      addDoc(collection(fdb, 'messages'), { uid, name: n, email: m, text: t, createdAt: serverTimestamp() })
        .catch((e) => console.warn('No se pudo enviar el mensaje a Firestore:', e))
    }
  }

  const startPay = (q) => setPay({ q })
  const closePay = () => setPay(null)
  const finishPay = (id) => {
    setPay(null); setOpenId(null); setView('me'); setTicketId(id)
    toast('Pago aprobado ✓ Reserva confirmada')
  }

  // Escape cierra primero el pago y después la ficha / la entrada.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (pay) setPay(null)
      else if (openId != null || ticketId != null) { setOpenId(null); setTicketId(null) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [pay, openId, ticketId])

  const value = {
    db, user, nube, mutate, editUser, view, go, openId, openFicha, pay, startPay, closePay, finishPay,
    ticketId, setTicketId, closeAll, why, requireUser, signup, login, logout, enviarMensaje, toast, msg,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
