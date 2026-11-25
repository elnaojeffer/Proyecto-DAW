(async function () {
  await initDB();
  if (!requierePermiso('bitacora', 'ver')) return;
  pintarMenu();

  const cuerpo = document.getElementById('tabla-cuerpo');
  const selAccion = document.getElementById('f-accion');
  const txt = document.getElementById('f-texto');

  const acciones = Array.from(new Set(leerDB().bitacora.map(b => b.accion))).sort();
  selAccion.innerHTML += acciones.map(a => '<option value="' + esc(a) + '">' + esc(a) + '</option>').join('');

  function pintar() {
    const q = txt.value.trim().toLowerCase();
    const filas = leerDB().bitacora
      .filter(b => !selAccion.value || b.accion === selAccion.value)
      .filter(b => !q || (b.usuario + ' ' + b.detalle).toLowerCase().includes(q))
      .slice(0, 300);
    cuerpo.innerHTML = filas.map(b =>
      '<tr><td>' + fechaLocal(b.fecha) + '</td><td>' + esc(b.usuario) + '</td><td>' + esc(b.accion) +
      '</td><td>' + esc(b.detalle) + '</td></tr>').join('') || '<tr><td colspan="4">Sin registros.</td></tr>';
  }

  selAccion.addEventListener('change', pintar);
  txt.addEventListener('input', pintar);
  pintar();
})();
