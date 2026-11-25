(async function () {
  await initDB();
  const token = new URLSearchParams(location.search).get('token') || '';
  const db = leerDB();
  const rec = db.recuperaciones.find(r => r.token === token && !r.usado && r.expira > Date.now());
  const form = document.getElementById('form-restablecer');

  if (!rec) { document.getElementById('invalido').hidden = false; return; }
  form.hidden = false;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const c1 = document.getElementById('clave1').value;
    const c2 = document.getElementById('clave2').value;
    if (c1.length < 8) return mostrarAviso('La contrasena debe tener al menos 8 caracteres.', 'error');
    if (c1 !== c2) return mostrarAviso('Las contrasenas no coinciden.', 'error');

    const db2 = leerDB();
    const r = db2.recuperaciones.find(x => x.token === token);
    const u = db2.usuarios.find(x => x.id === r.usuarioId);
    u.passwordHash = await hashClave(c1);
    r.usado = true;
    guardarDB(db2);
    registrarBitacora('CAMBIO_CLAVE', 'Contrasena restablecida', { id: u.id, nombre: u.email });
    sessionStorage.setItem('flash', 'Contrasena actualizada. Ya puedes iniciar sesion.');
    location.href = 'index.html';
  });
})();
