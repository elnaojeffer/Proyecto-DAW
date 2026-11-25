(async function () {
  await initDB();
  document.getElementById('form-recuperar').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const db = leerDB();
    const u = db.usuarios.find(x => x.email.toLowerCase() === email && x.estado === 'activo');
    const caja = document.getElementById('enlace-dev');
    caja.innerHTML = '';

    if (u) {
      const bytes = new Uint8Array(24);
      crypto.getRandomValues(bytes);
      const token = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
      db.recuperaciones.push({ usuarioId: u.id, token: token, expira: Date.now() + 60 * 60 * 1000, usado: false });
      guardarDB(db);
      registrarBitacora('RECUPERAR_CLAVE', 'Solicitud de recuperacion', { id: u.id, nombre: u.email });
      // En un sistema real este enlace se enviaria por correo.
      // En la demo se muestra aqui mismo.
      const enlace = 'restablecer.html?token=' + token;
      caja.innerHTML = '<div class="alerta info">Modo demo: <a href="' + enlace + '">abrir enlace de recuperacion</a></div>';
    }
    mostrarAviso('Si el correo existe, se genero un enlace valido por 1 hora.', 'ok');
  });
})();
