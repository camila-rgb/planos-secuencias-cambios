// Usuario de ejemplo con el que arranca cada perfil nuevo (igual que el prototipo original).
export function perfilInicial(name, email, gen) {
  return {
    name, email, since: 'marzo de 2026', gen, visits: 9,
    fav: [3, 5, 12], no: [6],
    votes: { 0: 5, 2: 4, 5: 5, 8: 4 },
    res: [{ id: 1, i: 0, q: 2, st: 'Asistió' }, { id: 2, i: 11, q: 2, st: 'Confirmada' }],
    recs: [
      { i: 3, txt: 'Para ver en pantalla grande y con silencio total.', d: '2 oct' },
      { i: 12, txt: 'Ideal para ir en familia.', d: '21 sep' },
    ],
    act: [
      { t: 'Votó 5 ★ a El padrino', w: 'hace 2 días' },
      { t: 'Reservó 2 entradas para Nueve reinas', w: 'hace 4 días' },
      { t: 'Recomendó Los siete samuráis', w: 'hace 2 semanas' },
      { t: 'Se unió a Planos Secuencias', w: 'marzo de 2026' },
    ],
    rid: 3,
  }
}
