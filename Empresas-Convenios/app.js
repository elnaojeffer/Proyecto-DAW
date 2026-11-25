// Formulario de Empresas
var formEmpresa = document.getElementById("form-empresa");
if (formEmpresa) {
  formEmpresa.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var ruc = document.getElementById("ruc").value;
    var nombre = document.getElementById("nombreEmpresa").value;
    var sector = document.getElementById("sector").value;
    var direccion = document.getElementById("direccion").value;

    var tabla = document.getElementById("tabla-empresas");
    var fila = tabla.insertRow();
    fila.insertCell(0).textContent = ruc;
    fila.insertCell(1).textContent = nombre;
    fila.insertCell(2).textContent = sector;
    fila.insertCell(3).textContent = direccion;

    // Agregar la nueva empresa al select de representantes
    var selectRep = document.getElementById("empresaRep");
    var opcion = document.createElement("option");
    opcion.value = nombre;
    opcion.textContent = nombre;
    selectRep.appendChild(opcion);

    formEmpresa.reset();
    alert("Empresa registrada correctamente.");
  });
}

// Formulario de Representantes
var formRepresentante = document.getElementById("form-representante");
if (formRepresentante) {
  formRepresentante.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var empresa = document.getElementById("empresaRep").value;
    var nombre = document.getElementById("nombreRep").value;
    var cargo = document.getElementById("cargoRep").value;
    var correo = document.getElementById("correoRep").value;

    var tabla = document.getElementById("tabla-representantes");
    var fila = tabla.insertRow();
    fila.insertCell(0).textContent = empresa;
    fila.insertCell(1).textContent = nombre;
    fila.insertCell(2).textContent = cargo;
    fila.insertCell(3).textContent = correo;

    formRepresentante.reset();
    alert("Representante registrado correctamente.");
  });
}

// Formulario de Convenios
var formConvenio = document.getElementById("form-convenio");
if (formConvenio) {
  formConvenio.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var codigo = document.getElementById("codigoConv").value;
    var empresa = document.getElementById("empresaConv").value;
    var inicio = document.getElementById("fechaInicio").value;
    var fin = document.getElementById("fechaFin").value;
    var estado = document.getElementById("estadoConv").value;

    var tabla = document.getElementById("tabla-convenios");
    var fila = tabla.insertRow();
    fila.insertCell(0).textContent = codigo;
    fila.insertCell(1).textContent = empresa;
    fila.insertCell(2).textContent = inicio;
    fila.insertCell(3).textContent = fin;
    fila.insertCell(4).textContent = estado;

    formConvenio.reset();
    alert("Convenio registrado correctamente.");
  });
}

// Formulario de Vacantes
var formVacante = document.getElementById("form-vacante");
if (formVacante) {
  formVacante.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var empresa = document.getElementById("empresaVac").value;
    var puesto = document.getElementById("puestoVac").value;
    var cupos = document.getElementById("cuposVac").value;
    var modalidad = document.getElementById("modalidadVac").value;

    var tabla = document.getElementById("tabla-vacantes");
    var fila = tabla.insertRow();
    fila.insertCell(0).textContent = empresa;
    fila.insertCell(1).textContent = puesto;
    fila.insertCell(2).textContent = cupos;
    fila.insertCell(3).textContent = modalidad;

    formVacante.reset();
    alert("Vacante registrada correctamente.");
  });
}