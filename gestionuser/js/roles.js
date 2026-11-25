(async function () {
  await initDB();
  if (!requierePermiso('roles', 'ver')) return;
  pintarMenu();

  const cuerpo = document.getElementById('tabla-cuerpo');
  const dlg = document.getElementById('dlg-rol');
  const form = document.getElementById('form-rol');
  const errores = document.getElementById('form-errores');
  const campo = id => document.getElementById(id);

  if (!can('roles', 'crear')) campo('btn-nuevo').hidden = true;

  function pintar() {
    const db = leerDB();
    cuerpo.innerHTML = db.roles.map(r => {
      const n = db.usuarios.filter(u => u.rolId === r.id).length;
      let acc = '';
      if (can('roles', 'editar')) acc += '<button class="btn chico" data-accion="editar" data-id="' + r.id + '">Permisos</button> ';
      if (can('roles', 'eliminar') && r.id !== 1) acc += '<button class="btn chico rojo" data-accion="eliminar" data-id="' + r.id + '">Eliminar</button>';
      return '<tr><td>' + esc(r.nombre) + '</td><td>' + esc(r.descripcion) + '</td><td>' + n + '</td><td>' + acc + '</td></tr>';
    }).join('');
  }

  function abrir(id) {
    const db = leerDB();
    const r = id ? db.roles.find(x => x.id === id) : null;
    const bloqueado = !!r && r.id === 1; // el Administrador siempre tiene todo
    errores.innerHTML = '';
    campo('dlg-titulo').textContent = r ? 'Editar rol: ' + r.nombre : 'Nuevo rol';
    campo('f-id').value = r ? r.id : '';
    campo('f-nombre').value = r ? r.nombre : '';
    campo('f-desc').value = r ? r.descripcion : '';
    campo('f-nombre').disabled = bloqueado;

    const marcados = r ? r.permisos : [];
    let html = '<tr><th>Modulo</th>' + ACCIONES.map(a => '<th>' + esc(a.charAt(0).toUpperCase() + a.slice(1)) + '</th>').join('') + '</tr>';
    Object.keys(MODULOS).forEach(m => {
      html += '<tr><td>' + esc(MODULOS[m]) + '</td>' + ACCIONES.map(a => {
        const p = m + '.' + a;
        return '<td><input type="checkbox" value="' + p + '"' + (marcados.includes(p) ? ' checked' : '') + (bloqueado ? ' disabled' : '') + '></td>';
      }).join('') + '</tr>';
    });
    campo('matriz').innerHTML = html;
    dlg.showModal();
  }

  function guardar(e) {
    e.preventDefault();
    const db = leerDB();
    const id = Number(campo('f-id').value) || 0;
    if (!can('roles', id ? 'editar' : 'crear')) return;

    const nombre = campo('f-nombre').value.trim();
    const descripcion = campo('f-desc').value.trim();
    const permisos = Array.from(campo('matriz').querySelectorAll('input:checked')).map(i => i.value);
    const errs = [];

    if (!nombre) errs.push('El nombre del rol es obligatorio.');
    if (db.roles.some(r => r.id !== id && r.nombre.toLowerCase() === nombre.toLowerCase())) errs.push('Ya existe un rol con ese nombre.');
    if (errs.length) {
      errores.innerHTML = errs.map(x => '<div class="alerta error">' + esc(x) + '</div>').join('');
      return;
    }

    if (id) {
      const r = db.roles.find(x => x.id === id);
      if (id !== 1) { r.nombre = nombre; r.permisos = permisos; }
      r.descripcion = descripcion;
    } else {
      db.roles.push({ id: nuevoId(db, 'rol'), nombre: nombre, descripcion: descripcion, permisos: permisos });
    }
    guardarDB(db);
    registrarBitacora('GUARDAR_ROL', 'Rol guardado: ' + nombre);

    // Si cambie mi propio rol, refresco mis permisos en la sesion
    const s = sesion();
    if (id && s.rolId === id) {
      const yo = leerDB().usuarios.find(u => u.id === s.id);
      abrirSesion(yo, leerDB());
    }
    mostrarAviso('Rol guardado.');
    dlg.close();
    pintar();
  }

  function eliminar(id) {
    if (!can('roles', 'eliminar')) return;
    const db = leerDB();
    const r = db.roles.find(x => x.id === id);
    if (!r) return;
    if (id === 1) return mostrarAviso('El rol Administrador no se puede eliminar.', 'error');
    if (db.usuarios.some(u => u.rolId === id)) return mostrarAviso('No se puede eliminar: hay usuarios con este rol.', 'error');
    if (!confirm('Eliminar el rol ' + r.nombre + '?')) return;
    db.roles = db.roles.filter(x => x.id !== id);
    guardarDB(db);
    registrarBitacora('ELIMINAR_ROL', 'Rol eliminado: ' + r.nombre);
    mostrarAviso('Rol eliminado.');
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
  pintar();
})();
