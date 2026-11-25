(async function () {
  await initDB();
  if (!requierePermiso('usuarios', 'ver')) return;
  pintarMenu();

  const cuerpo = document.getElementById('tabla-cuerpo');
  const buscador = document.getElementById('buscar');
  const dlg = document.getElementById('dlg-usuario');
  const form = document.getElementById('form-usuario');
  const errores = document.getElementById('form-errores');
  const campo = id => document.getElementById(id);

  if (!can('usuarios', 'crear')) campo('btn-nuevo').hidden = true;

  function pintar() {
    const db = leerDB();
    const q = buscador.value.trim().toLowerCase();
    const filas = db.usuarios
      .filter(u => !q || [u.nombres, u.apellidos, u.email, u.cedula].join(' ').toLowerCase().includes(q))
      .sort((a, b) => (a.apellidos + a.nombres).localeCompare(b.apellidos + b.nombres));

    cuerpo.innerHTML = filas.map(u => {
      const rol = db.roles.find(r => r.id === u.rolId);
      let acc = '';
      if (can('usuarios', 'editar')) acc += '<button class="btn chico" data-accion="editar" data-id="' + u.id + '">Editar</button> ';
      if (can('usuarios', 'eliminar')) acc += '<button class="btn chico rojo" data-accion="eliminar" data-id="' + u.id + '">Eliminar</button>';
      return '<tr>' +
        '<td>' + esc(u.apellidos + ' ' + u.nombres) + '</td>' +
        '<td>' + esc(u.email) + '</td>' +
        '<td>' + esc(u.cedula) + '</td>' +
        '<td>' + esc(rol ? rol.nombre : '-') + '</td>' +
        '<td><span class="etiqueta ' + esc(u.estado) + '">' + esc(u.estado) + '</span></td>' +
        '<td>' + fechaLocal(u.ultimoAcceso) + '</td>' +
        '<td>' + acc + '</td></tr>';
    }).join('') || '<tr><td colspan="7">Sin resultados.</td></tr>';
  }

  function abrir(id) {
    const db = leerDB();
    errores.innerHTML = '';
    campo('f-rol').innerHTML = db.roles.map(r => '<option value="' + r.id + '">' + esc(r.nombre) + '</option>').join('');
    const u = id ? db.usuarios.find(x => x.id === id) : null;

    campo('dlg-titulo').textContent = u ? 'Editar usuario' : 'Nuevo usuario';
    campo('lbl-clave').textContent = u ? 'Contrasena (dejar vacio para no cambiarla)' : 'Contrasena';
    campo('f-id').value = u ? u.id : '';
    campo('f-nombres').value = u ? u.nombres : '';
    campo('f-apellidos').value = u ? u.apellidos : '';
    campo('f-cedula').value = u ? u.cedula : '';
    campo('f-email').value = u ? u.email : '';
    campo('f-clave').value = '';
    campo('f-rol').value = u ? u.rolId : 5;
    campo('f-estado').value = u ? u.estado : 'activo';
    dlg.showModal();
  }

  async function guardar(e) {
    e.preventDefault();
    const db = leerDB();
    const id = Number(campo('f-id').value) || 0;
    if (!can('usuarios', id ? 'editar' : 'crear')) return;

    const d = {
      nombres: campo('f-nombres').value.trim(),
      apellidos: campo('f-apellidos').value.trim(),
      cedula: campo('f-cedula').value.trim(),
      email: campo('f-email').value.trim(),
      rolId: Number(campo('f-rol').value),
      estado: campo('f-estado').value
    };
    const clave = campo('f-clave').value;
    const errs = [];

    if (!d.nombres || !d.apellidos) errs.push('Nombres y apellidos son obligatorios.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errs.push('Correo no valido.');
    if (d.cedula && !/^\d{10}$/.test(d.cedula)) errs.push('La cedula debe tener 10 digitos.');
    if (!db.roles.some(r => r.id === d.rolId)) errs.push('Selecciona un rol.');
    if (!id && clave.length < 8) errs.push('La contrasena debe tener al menos 8 caracteres.');
    if (id && clave && clave.length < 8) errs.push('La nueva contrasena debe tener al menos 8 caracteres.');
    if (id && id === sesion().id && d.estado === 'inactivo') errs.push('No puedes desactivar tu propio usuario.');
    if (db.usuarios.some(u => u.id !== id && u.email.toLowerCase() === d.email.toLowerCase())) errs.push('Ya existe un usuario con ese correo.');
    if (d.cedula && db.usuarios.some(u => u.id !== id && u.cedula === d.cedula)) errs.push('Ya existe un usuario con esa cedula.');

    if (errs.length) {
      errores.innerHTML = errs.map(x => '<div class="alerta error">' + esc(x) + '</div>').join('');
      return;
    }

    if (id) {
      const u = db.usuarios.find(x => x.id === id);
      Object.assign(u, d);
      if (clave) u.passwordHash = await hashClave(clave);
      guardarDB(db);
      registrarBitacora('EDITAR_USUARIO', 'Usuario editado: ' + d.email);
      mostrarAviso('Usuario actualizado.');
    } else {
      db.usuarios.push(Object.assign({
        id: nuevoId(db, 'usuario'),
        passwordHash: await hashClave(clave),
        creadoEn: new Date().toISOString(),
        ultimoAcceso: null
      }, d));
      guardarDB(db);
      registrarBitacora('CREAR_USUARIO', 'Usuario creado: ' + d.email);
      mostrarAviso('Usuario creado.');
    }
    dlg.close();
    pintar();
  }

  function eliminar(id) {
    if (!can('usuarios', 'eliminar')) return;
    const db = leerDB();
    const u = db.usuarios.find(x => x.id === id);
    if (!u) return;
    if (id === sesion().id) return mostrarAviso('No puedes eliminar tu propio usuario.', 'error');
    if (!confirm('Eliminar al usuario ' + u.email + '?')) return;
    db.usuarios = db.usuarios.filter(x => x.id !== id);
    guardarDB(db);
    registrarBitacora('ELIMINAR_USUARIO', 'Usuario eliminado: ' + u.email);
    mostrarAviso('Usuario eliminado.');
    pintar();
  }

  cuerpo.addEventListener('click', e => {
    const b = e.target.closest('button[data-accion]');
    if (!b) return;
    const id = Number(b.dataset.id);
    if (b.dataset.accion === 'editar') abrir(id); else eliminar(id);
  });
  campo('btn-nuevo').addEventListener('click', () => abrir(0));
  campo('btn-cancelar').addEventListener('click', () => dlg.close());
  form.addEventListener('submit', guardar);
  buscador.addEventListener('input', pintar);
  pintar();
})();
