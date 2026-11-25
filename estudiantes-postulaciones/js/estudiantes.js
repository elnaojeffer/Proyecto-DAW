// Lógica del módulo Gestión de estudiantes y postulaciones

const state = {
    view: "students",
    editingId: null,
    students: [
        { id: 1, nombre: "María González", cedula: "V-30.845.221", carrera: "Ingeniería Informática", periodo: "2026-1", estado: "Activo" },
        { id: 2, nombre: "Carlos Pérez", cedula: "V-28.193.507", carrera: "Administración", periodo: "2026-1", estado: "Activo" },
        { id: 3, nombre: "Ana Rodríguez", cedula: "V-31.442.905", carrera: "Contaduría Pública", periodo: "2025-2", estado: "Inactivo" },
        { id: 4, nombre: "Luis Martínez", cedula: "V-27.630.184", carrera: "Ingeniería Civil", periodo: "2026-1", estado: "Activo" }
    ],
    applications: [
        { id: 101, estudiante: "María González", carrera: "Ingeniería Informática", practica: "Desarrollo de software", fecha: "20/11/2026", estado: "Aprobada" },
        { id: 102, estudiante: "Carlos Pérez", carrera: "Administración", practica: "Gestión empresarial", fecha: "22/11/2026", estado: "Pendiente" },
        { id: 103, estudiante: "Luis Martínez", carrera: "Ingeniería Civil", practica: "Inspección estructural", fecha: "24/11/2026", estado: "Pendiente" }
    ]
};

const modal = document.getElementById("modal");
const form = document.getElementById("entityForm");
const formFields = document.getElementById("formFields");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("search");
const newButton = document.getElementById("newButton");

function updateStats() {
    document.getElementById("activeCount").textContent = state.students.filter(s => s.estado === "Activo").length;
    document.getElementById("applicationCount").textContent = state.applications.length;
    document.getElementById("pendingCount").textContent = state.applications.filter(a => a.estado === "Pendiente").length;
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function render() {
    const query = searchInput.value.trim().toLowerCase();
    if (state.view === "students") {
        tableHead.innerHTML = "<tr><th>Estudiante</th><th>Cédula</th><th>Carrera</th><th>Periodo</th><th>Estado</th><th>Acciones</th></tr>";
        const rows = state.students.filter(s => Object.values(s).join(" ").toLowerCase().includes(query));
        tableBody.innerHTML = rows.length ? rows.map(s => `
            <tr>
                <td><strong>${escapeHtml(s.nombre)}</strong></td>
                <td>${escapeHtml(s.cedula)}</td>
                <td>${escapeHtml(s.carrera)}</td>
                <td>${escapeHtml(s.periodo)}</td>
                <td><span class="etiqueta ${s.estado.toLowerCase()}">${escapeHtml(s.estado)}</span></td>
                <td><div class="acciones-fila">
                    <button class="boton chico" title="Editar" onclick="editStudent(${s.id})">&#9998;</button>
                    <button class="boton chico peligro" title="Eliminar" onclick="deleteStudent(${s.id})">&#128465;</button>
                </div></td>
            </tr>`).join("") : '<tr><td colspan="6" class="vacio">No se encontraron estudiantes</td></tr>';
    } else {
        tableHead.innerHTML = "<tr><th>Estudiante</th><th>Carrera</th><th>Práctica</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr>";
        const rows = state.applications.filter(a => Object.values(a).join(" ").toLowerCase().includes(query));
        tableBody.innerHTML = rows.length ? rows.map(a => `
            <tr>
                <td><strong>${escapeHtml(a.estudiante)}</strong></td>
                <td>${escapeHtml(a.carrera)}</td>
                <td>${escapeHtml(a.practica)}</td>
                <td>${escapeHtml(a.fecha)}</td>
                <td><span class="etiqueta ${a.estado.toLowerCase()}">${escapeHtml(a.estado)}</span></td>
                <td><div class="acciones-fila">
                    ${a.estado === "Pendiente" ? `
                        <button class="boton chico" title="Aprobar" onclick="approveApplication(${a.id})">&#10003;</button>
                        <button class="boton chico peligro" title="Rechazar" onclick="rejectApplication(${a.id})">&#10005;</button>` : `
                        <button class="boton chico peligro" title="Eliminar" onclick="deleteApplication(${a.id})">&#128465;</button>`}
                </div></td>
            </tr>`).join("") : '<tr><td colspan="6" class="vacio">No se encontraron postulaciones</td></tr>';
    }
    updateStats();
}

function openModal(title, fields, values = {}) {
    document.getElementById("modalTitle").textContent = title;
    formFields.innerHTML = fields.map(field => `
        <div class="campo ${field.full ? "completo" : ""}">
            <label for="${field.name}">${field.label}</label>
            ${field.options ? `
                <select id="${field.name}" name="${field.name}" required>
                    ${field.options.map(option => `<option ${values[field.name] === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
                </select>` : `
                <input id="${field.name}" name="${field.name}" value="${escapeHtml(values[field.name] || "")}" required ${field.type ? `type="${field.type}"` : ""}>`}
        </div>`).join("");
    modal.showModal();
}

function closeModal() {
    modal.close();
    state.editingId = null;
    form.reset();
}

function openStudentModal(student = null) {
    state.editingId = student ? student.id : null;
    openModal(
        student ? "Modificar estudiante" : "Nuevo estudiante",
        [
            { name: "nombre", label: "Nombre completo", full: true },
            { name: "cedula", label: "Cédula" },
            { name: "carrera", label: "Carrera", options: ["Ingeniería Informática", "Ingeniería Civil", "Administración", "Contaduría Pública"] },
            { name: "periodo", label: "Periodo académico", options: ["2026-1", "2025-2"] },
            { name: "estado", label: "Estado", options: ["Activo", "Inactivo"] }
        ],
        student
    );
}

window.editStudent = function(id) {
    openStudentModal(state.students.find(s => s.id === id));
};

window.deleteStudent = function(id) {
    if (confirm("¿Eliminar este estudiante?")) {
        state.students = state.students.filter(s => s.id !== id);
        render();
    }
};

window.approveApplication = function(id) {
    state.applications.find(a => a.id === id).estado = "Aprobada";
    render();
};

window.rejectApplication = function(id) {
    state.applications.find(a => a.id === id).estado = "Rechazada";
    render();
};

window.deleteApplication = function(id) {
    if (confirm("¿Eliminar esta postulación?")) {
        state.applications = state.applications.filter(a => a.id !== id);
        render();
    }
};

document.querySelectorAll(".pestana").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".pestana").forEach(t => t.classList.remove("activo"));
        tab.classList.add("activo");
        state.view = tab.dataset.view;
        newButton.textContent = state.view === "students" ? "+ Nuevo estudiante" : "+ Nueva postulación";
        searchInput.value = "";
        render();
    });
});

newButton.addEventListener("click", () => {
    if (state.view === "students") {
        openStudentModal();
    } else {
        state.editingId = null;
        openModal(
            "Nueva postulación",
            [
                { name: "estudiante", label: "Estudiante", full: true },
                { name: "carrera", label: "Carrera", options: ["Ingeniería Informática", "Ingeniería Civil", "Administración", "Contaduría Pública"] },
                { name: "practica", label: "Práctica", full: true },
                { name: "fecha", label: "Fecha", type: "date" },
                { name: "estado", label: "Estado", options: ["Pendiente", "Aprobada", "Rechazada"] }
            ]
        );
    }
});

form.addEventListener("submit", event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (state.view === "students") {
        if (state.editingId) {
            Object.assign(state.students.find(s => s.id === state.editingId), data);
        } else {
            state.students.unshift({ id: Date.now(), cedula: data.cedula, nombre: data.nombre, carrera: data.carrera, periodo: data.periodo, estado: data.estado });
        }
    } else {
        data.fecha = data.fecha ? new Date(`${data.fecha}T00:00:00`).toLocaleDateString("es-VE") : "";
        state.applications.unshift({ id: Date.now(), ...data });
    }
    closeModal();
    render();
});

document.querySelectorAll(".close-cancel").forEach(button => button.addEventListener("click", closeModal));
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
searchInput.addEventListener("input", render);

render();
