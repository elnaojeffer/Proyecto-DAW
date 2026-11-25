(async function () {
  await initDB();
  if (sesion()) { location.href = 'dashboard.html'; return; }

  const flash = sessionStorage.getItem('flash');
  if (flash) { mostrarAviso(flash, 'ok'); sessionStorage.removeItem('flash'); }

  document.getElementById('btn-demo').addEventListener('click', () => {
    document.getElementById('email').value = 'admin@practicas.local';
    document.getElementById('clave').value = 'Admin12345';
  });

  document.getElementById('form-login').addEventListener('submit', async e => {
    e.preventDefault();
    const ok = await login(document.getElementById('email').value, document.getElementById('clave').value);
    if (ok) location.href = 'dashboard.html';
    else mostrarAviso('Correo o contrasena incorrectos, o usuario inactivo.', 'error');
  });
})();
