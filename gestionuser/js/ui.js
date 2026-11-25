// ===== Utilidades de interfaz =====
function esc(t) {
  return String(t == null ? '' : t).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function mostrarAviso(texto, tipo) {
  const c = document.getElementById('avisos');
  if (!c) return;
  c.innerHTML = '<div class="alerta ' + (tipo || 'ok') + '">' + esc(texto) + '</div>';
  clearTimeout(window._avisoTimer);
  window._avisoTimer = setTimeout(() => { c.innerHTML = ''; }, 4000);
}

function fechaLocal(iso) {
  return iso ? new Date(iso).toLocaleString('es-EC') : '-';
}

// Menu lateral: cada modulo del grupo agrega su enlace en este arreglo
function pintarMenu() {
  const s = sesion();
  const menu = document.getElementById('menu');
  if (!s || !menu) return;
  const enlaces = [
    ['dashboard.html', 'Inicio', null],
    ['usuarios.html', 'Usuarios', 'usuarios'],
    ['roles.html', 'Roles y permisos', 'roles'],
    ['bitacora.html', 'Bitacora', 'bitacora']
    // ['empresas.html', 'Empresas y convenios', 'empresas'],
    // ['estudiantes.html', 'Estudiantes', 'estudiantes'],
  ];
  const actual = location.pathname.split('/').pop() || 'index.html';
  menu.innerHTML = '<h2>Practicas</h2>' +
    enlaces.filter(e => !e[2] || can(e[2], 'ver'))
      .map(e => '<a href="' + e[0] + '"' + (e[0] === actual ? ' class="activo"' : '') + '>' + e[1] + '</a>').join('') +
    '<div class="menu-pie"><span>' + esc(s.nombre) + '</span><span>' + esc(s.rol) + '</span>' +
    '<a href="#" id="btn-salir">Cerrar sesion</a></div>';
  document.getElementById('btn-salir').addEventListener('click', e => { e.preventDefault(); logout(); });
}
