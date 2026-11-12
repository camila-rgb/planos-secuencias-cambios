import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

// La configuración web de Firebase llega por variables VITE_ (ver .env.example).
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Si faltan las variables, la app sigue funcionando solo con localStorage.
export const firebaseOk = Boolean(config.apiKey && config.projectId && config.appId)

const app = firebaseOk ? initializeApp(config) : null
export const auth = app ? getAuth(app) : null
export const fdb = app ? getFirestore(app) : null

// Analytics solo si el navegador lo soporta (puede fallar con bloqueadores).
if (app && config.measurementId) {
  isSupported().then((ok) => ok && getAnalytics(app)).catch(() => {})
}

// Devuelve el usuario de Firebase, iniciando sesión anónima si todavía no hay una.
export function ensureUser() {
  return new Promise((resolve, reject) => {
    const off = onAuthStateChanged(auth, (u) => {
      if (u) { off(); resolve(u) } else signInAnonymously(auth).catch(reject)
    }, reject)
  })
}
