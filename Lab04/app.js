//ESTADO GLOBAL
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
let filtroActual = 'todas';

//REFERENCIAS AL DOM
const formulario = document.querySelector('#formulario-tarea');
const divAlertas = document.querySelector('#div-alertas');
const listaTareasDOM = document.querySelector('#lista-tareas');

//EVENTO DEL FORMULARIO (CAPTURA Y VALIDACIÓN)
formulario.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita recargar la página

  const titulo = document.querySelector('#titulo').value.trim();
  const curso = document.querySelector('#curso').value.trim();
  const fechaEntrega = document.querySelector('#fecha').value;

  // Validación: campos vacíos
  if (!titulo || !curso || !fechaEntrega) {
    divAlertas.innerHTML = '<p class="alerta-error">Todos los campos son obligatorios.</p>';
    return;
  }

  // Validación: fecha posterior a la actual
  const fechaIngresada = new Date(fechaEntrega);
  const fechaHoy = new Date();
  fechaHoy.setHours(0, 0, 0, 0);

  if (fechaIngresada < fechaHoy) {
    divAlertas.innerHTML = '<p class="alerta-error">La fecha debe ser igual o posterior a hoy.</p>';
    return;
  }

  // Si todo está bien, limpiar alertas y crear tarea
  divAlertas.innerHTML = '';

  const nuevaTarea = {
    id: Date.now(),
    titulo,
    curso,
    fechaEntrega,
    completada: false
  };

  tareas.push(nuevaTarea);
  guardarYRenderizar();
  formulario.reset();
});

