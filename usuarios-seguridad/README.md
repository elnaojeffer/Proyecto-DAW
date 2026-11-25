# Modulo 1 - Gestion de usuarios y seguridad

Parte del Sistema de Gestion de Practicas Pre-profesionales (proyecto grupal).
Frontend con HTML, CSS y JavaScript puro. Los datos se guardan en el navegador (localStorage).

## Que incluye

- Inicio y cierre de sesion
- Recuperacion de contrasena (enlace con token de 1 hora; en la demo se muestra en pantalla)
- Usuarios: registrar, modificar, eliminar y consultar (con busqueda)
- Roles y permisos por modulo (ver / crear / editar / eliminar)
- Bitacora de acciones con filtros

Cuenta de prueba: `admin@practicas.local` / `Admin12345`

## Estructura

```
index.html            login
dashboard.html        inicio
usuarios.html         gestion de usuarios
roles.html            roles y permisos
bitacora.html         bitacora
recuperar.html        pedir enlace de recuperacion
restablecer.html      cambiar contrasena con el token
css/usuarios.css      estilos propios del modulo (el resto viene de ../css/style.css)
js/storage.js         "base de datos" (localStorage) y datos iniciales
js/auth.js            sesion, permisos y bitacora
js/ui.js              utilidades y submenu del modulo
js/<pagina>.js        logica de cada pagina
```

## Para los demas modulos

Cargar en este orden:

```html
<script src="../usuarios-seguridad/js/storage.js"></script>
<script src="../usuarios-seguridad/js/auth.js"></script>
<script src="../usuarios-seguridad/js/ui.js"></script>
```

Y en su JS:

```js
await initDB();
if (!requierePermiso('empresas', 'ver')) return;   // modulo, accion
if (can('empresas', 'crear')) { /* mostrar boton */ }
registrarBitacora('CREAR_EMPRESA', 'Empresa X creada');
```

Los permisos de todos los modulos ya existen: usuarios, roles, bitacora, empresas, estudiantes,
asignaciones, horas, reportes.

## Nota de seguridad

Al ser solo frontend, la seguridad es de demostracion. Con un backend, las validaciones y el
hash de contrasenas deben hacerse del lado del servidor.
