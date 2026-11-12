import { useApp } from './context/AppContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Ficha from './components/Ficha'
import PayModal from './components/PayModal'
import TicketModal from './components/TicketModal'
import Home from './views/Home'
import Cartelera from './views/Cartelera'
import Votacion from './views/Votacion'
import Espacio from './views/Espacio'
import Faq from './views/Faq'
import Contacto from './views/Contacto'
import Nosotros from './views/Nosotros'
import Membresia from './views/Membresia'
import Perfil from './views/Perfil'
import Auth from './views/Auth'

const VISTAS = {
  home: Home, cart: Cartelera, vot: Votacion, esp: Espacio, faq: Faq,
  ctc: Contacto, nos: Nosotros, mem: Membresia, me: Perfil, auth: Auth,
}

export default function App() {
  const { view, user, openId, pay, ticketId } = useApp()
  const Vista = VISTAS[view] || Home
  return (
    <>
      <Header />
      <main className="wrap" id="app">
        <Vista />
      </main>
      <Footer />
      {openId != null && <Ficha key={openId} />}
      {pay && openId != null && user && <PayModal />}
      {ticketId != null && user && <TicketModal />}
      <Toast />
    </>
  )
}
