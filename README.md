# Gestión de Prácticas Preprofesionales (GPP)

Proyecto de la materia Desarrollo de Aplicaciones Web — **Grupo G05**.

Plataforma para administrar convenios, asignación de estudiantes, seguimiento de horas prácticas, reportes y validación institucional.

## Módulos e integrantes

| N.º | Módulo | Responsable | Carpeta |
|----|--------|-------------|---------|
| 1 | Gestión de usuarios y seguridad | Mathew Alexis Ruiz Veliz | `usuarios-seguridad/` |
| 2 | Gestión de empresas y convenios | Angela Mayerly Yagual Pintado | `empresas-convenios/` |
| 3 | Gestión de estudiantes y postulaciones | Ederson Steward Franco Carvajal | `estudiantes-postulaciones/` |
| 4 | Asignación de prácticas y tutores | Fabian Johnny Gomez Beltran | `asignacion-tutores/` |
| 5 | Seguimiento de horas prácticas | Christian Jesus Tovar Burgos | `seguimiento-horas/` (pendiente) |
| 6 | Reportes y validación institucional | Jefferson Rolando Palma Coloma | `reportes-validacion/` |

## Estructura

```
Proyecto-DAW/
├── index.html                  ← página de inicio con los 6 módulos
├── css/style.css               ← estilos compartidos por todos los módulos
├── assets/                     ← imágenes y recursos
├── usuarios-seguridad/
├── empresas-convenios/
├── estudiantes-postulaciones/
├── asignacion-tutores/
└── reportes-validacion/
```

Cada módulo sigue la misma estructura:

```
nombre-modulo/
├── index.html          ← página de entrada del módulo
├── otra-pagina.html    ← (opcional) más páginas del módulo
├── css/<modulo>.css    ← solo los estilos propios del módulo
└── js/<modulo>.js      ← lógica del módulo
```

## Convenciones

- **Carpetas y archivos:** en minúsculas y con guiones (`seguimiento-horas/`, `js/horas.js`).
- **Entrada del módulo:** siempre `index.html`.
- **Estilos:** cargar primero `../css/style.css` y después `css/<modulo>.css`. No repetir en el módulo lo que ya está en el CSS compartido.
- **Sin CSS ni JS dentro del HTML:** nada de `<style>` ni `<script>` con código; todo va en su archivo.
- **Estructura de cada página:** `header.encabezado` → `nav.menu` (los 6 módulos) → `main.contenido` → `footer.pie`. Si el módulo tiene varias páginas o vistas, se agrega un `nav.pestanas` al inicio del `main`: las pestañas ocupan todo el ancho y se reparten en partes iguales.
- **Clases compartidas** (definidas en `css/style.css`):

| Uso | Clase |
|-----|-------|
| Contenedor de sección | `tarjeta` |
| Botones | `boton`, `boton secundario`, `boton peligro`, `boton chico` |
| Tabla con scroll | `tabla-contenedor` |
| Búsqueda y acciones sobre una tabla | `barra` |
| Mensajes | `alerta ok`, `alerta error`, `alerta info` |
| Estado | `etiqueta activo`, `etiqueta inactivo` |
| Pestañas internas del módulo | `nav.pestanas` con enlaces o botones; la actual lleva `activo` |
| Ventana modal | `<dialog>` con los botones dentro de `acciones` |

## Cómo trabajar un módulo

1. Crear una rama con el nombre del módulo: `git checkout -b nombre-modulo`
2. Copiar la estructura de otro módulo (por ejemplo `reportes-validacion/`) y renombrar sus archivos.
3. Agregar el enlace del módulo en el menú (`nav.menu`) de **todas** las páginas y su tarjeta en el `index.html` principal.

## Cómo ejecutarlo

Abrir `index.html` en el navegador (o con la extensión Live Server de VS Code).

## Tecnologías

HTML, CSS y JavaScript. Backend en PHP (próximamente).
