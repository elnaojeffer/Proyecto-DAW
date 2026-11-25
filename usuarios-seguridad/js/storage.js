// ===== Capa de datos del Modulo 1 (localStorage) =====
// Simula la base de datos. Cuando el grupo tenga backend, solo hay que
// reemplazar las funciones de este archivo (leerDB / guardarDB / initDB).

const DB_KEY = 'practicas_db_v1';

const MODULOS = {
  usuarios: 'Usuarios',
  roles: 'Roles y permisos',
  bitacora: 'Bitacora',
  empresas: 'Empresas y convenios',
  estudiantes: 'Estudiantes y postulaciones',
  asignaciones: 'Asignaciones y tutores',
  horas: 'Seguimiento de horas',
  reportes: 'Reportes y validacion'
};
const ACCIONES = ['ver', 'crear', 'editar', 'eliminar'];

function todosLosPermisos() {
  const lista = [];
  Object.keys(MODULOS).forEach(m => ACCIONES.forEach(a => lista.push(m + '.' + a)));
  return lista;
}

// Hash SHA-256 (solo para demo; en el backend real se usa bcrypt/argon2)
async function hashClave(texto) {
  if (window.crypto && window.crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 5381;
  for (let i = 0; i < texto.length; i++) h = ((h << 5) + h) + texto.charCodeAt(i);
  return 'x' + (h >>> 0).toString(16);
}

function leerDB() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)); } catch (e) { return null; }
}

function guardarDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function nuevoId(db, tipo) {
  const id = db.siguienteId[tipo];
  db.siguienteId[tipo] = id + 1;
  return id;
}

// Crea la base con datos iniciales la primera vez
async function initDB() {
  let db = leerDB();
  if (db && db.usuarios && db.roles) return db;

  db = {
    siguienteId: { usuario: 2, rol: 6, bitacora: 1 },
    roles: [
      { id: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema', permisos: todosLosPermisos() },
      { id: 2, nombre: 'Coordinador', descripcion: 'Gestion institucional de practicas',
        permisos: ['usuarios.ver'].concat(
          ['empresas', 'estudiantes', 'asignaciones', 'reportes'].flatMap(m => ACCIONES.map(a => m + '.' + a))) },
      { id: 3, nombre: 'Tutor academico', descripcion: 'Seguimiento academico de estudiantes',
        permisos: ['estudiantes.ver', 'horas.ver', 'reportes.ver'] },
      { id: 4, nombre: 'Tutor empresarial', descripcion: 'Aprobacion de horas en la empresa',
        permisos: ['horas.ver', 'horas.editar'] },
      { id: 5, nombre: 'Estudiante', descripcion: 'Postulacion y registro de horas',
        permisos: ['horas.ver', 'horas.crear'] }
    ],
    usuarios: [
      { id: 1, nombres: 'Administrador', apellidos: 'Sistema', cedula: '', email: 'admin@practicas.local',
        passwordHash: await hashClave('Admin12345'), rolId: 1, estado: 'activo',
        creadoEn: new Date().toISOString(), ultimoAcceso: null }
    ],
    bitacora: [],
    recuperaciones: []
  };
  guardarDB(db);
  return db;
}
