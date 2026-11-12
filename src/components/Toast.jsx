import { useApp } from '../context/AppContext'

export default function Toast() {
  const { msg } = useApp()
  return <div id="toast" role="status" aria-live="polite" hidden={!msg}>{msg}</div>
}
