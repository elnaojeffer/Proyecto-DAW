# Gestión de Prácticas Preprofesionales (GPP)

Proyecto de la materia Desarrollo de Aplicaciones Web — **Grupo G05**.

Plataforma para administrar convenios, asignación de estudiantes, seguimiento de horas prácticas, reportes y validación institucional.

## Módulos e integrantes

| N.º | Módulo | Responsable | Carpeta |
|----|--------|-------------|---------|
| 1 | Gestión de usuarios y seguridad | Mathew Alexis Ruiz Veliz | — |
| 2 | Gestión de empresas y convenios | Angela Mayerly Yagual Pintado | — |
| 3 | Gestión de estudiantes y postulaciones | Ederson Steward Franco Carvajal | — |
| 4 | Asignación de prácticas y tutores | Fabian Johnny Gomez Beltran | — |
| 5 | Seguimiento de horas prácticas | Christian Jesus Tovar Burgos | — |
| 6 | Reportes y validación institucional | Jefferson Rolando Palma Coloma | `reportes-validacion/` |

## Estructura

```
Proyecto-DAW/
├── index.html              ← página de inicio
├── css/style.css           ← estilos compartidos por todos los módulos
├── assets/                 ← imágenes y recursos
└── reportes-validacion/    ← un módulo por carpeta
    ├── index.html
    ├── css/reportes.css
    └── js/app.js
```

## Cómo trabajar un módulo

1. Crear una rama con el nombre del módulo: `git checkout -b nombre-modulo`
2. Crear la carpeta del módulo con su `index.html`, `css/` y `js/`.
3. Enlazar los estilos compartidos con `../css/style.css` y los propios del módulo con `css/<modulo>.css`.
4. Agregar el enlace del módulo en el menú (`nav`) del `index.html` principal.

## Cómo ejecutarlo

Abrir `index.html` en el navegador (o con la extensión Live Server de VS Code).

## Tecnologías

HTML, CSS y JavaScript. Backend en PHP (próximamente).
