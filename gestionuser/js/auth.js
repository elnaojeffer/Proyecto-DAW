// ===== Sesion, permisos y bitacora =====
// Los demas modulos del grupo pueden usar: requierePermiso(), can() y registrarBitacora()

const SESION_KEY = 'practicas_sesion';

function sesion() {
  try { return JSON.parse(sessionStorage.getItem(SESION_KEY)); } catch (e) { return null; }
}

function can(modulo, accion) {
  const s = sesion();
  return !!s && s.permisos.includes(modulo + '.' + accion);
}

function requiereLogin() {
  if (!sesion()) { location.href = 'index.html'; return false; }
  return true;
}

function requierePermiso(modulo, accion) {
  if (!requiereLogin()) return false;
  if (!can(modulo, accion)) {
    document.body.innerHTML =
      '<div class="centrado"><h1>Acceso denegado</h1>' +
      '<div class="alerta error">No tienes permiso para ver esta pagina.</div>' +
      '<a href="dashboard.html">Volver al inicio</a></div>';
    return false;
  }
  return true;
}

function registrarBitacora(accion, detalle, usuario) {
  const db = leerDB();
  if (!db) return;
  const u = usuario || sesion();
  db.bitacora.unshift({
    id: nuevoId(db, 'bitacora'),
    usuarioId: u ? u.id : null,
    usuario: u ? u.nombre : '-',
    accion: accion,
    detalle: detalle || '',
    fecha: new Date().toISOString()
  });
  db.bitacora = db.bitacora.slice(0, 1000);
  guardarDB(db);
}

function abrirSesion(u, db) {
  const rol = db.roles.find(r => r.id === u.rolId);
  sessionStorage.setItem(SESION_KEY, JSON.stringify({
    id: u.id,
    nombre: u.nombres + ' ' + u.apellidos,
    email: u.email,
    rolId: u.rolId,
    rol: rol ? rol.nombre : '',
    permisos: rol ? rol.permisos : []
  }));
}

async function login(email, clave) {
  const db = await initDB();
  const u = db.usuarios.find(x => x.email.toLowerCase() === email.trim().toLowerCase());
  const h = await hashClave(clave);
  if (u && u.estado === 'activo' && u.passwordHash === h) {
    abrirSesion(u, db);
    u.ultimoAcceso = new Date().toISOString();
    guardarDB(db);
    registrarBitacora('LOGIN', 'Inicio de sesion');
    return true;
  }
  registrarBitacora('LOGIN_FALLIDO', 'Intento con correo: ' + email, { id: u ? u.id : null, nombre: email });
  return false;
}

function logout() {
  registrarBitacora('LOGOUT', 'Cierre de sesion');
  sessionStorage.removeItem(SESION_KEY);
  location.href = 'index.html';
}
