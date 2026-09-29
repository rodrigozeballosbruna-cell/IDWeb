// 1. ESTADO GLOBAL
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
let filtroActual = 'todas';

// 2. REFERENCIAS AL DOM
const formulario = document.querySelector('#formulario-tarea');
const divAlertas = document.querySelector('#div-alertas');
const listaTareasDOM = document.querySelector('#lista-tareas');

// 3. EVENTO DEL FORMULARIO (CAPTURA Y VALIDACIÓN)
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

// 4. FUNCIONES DE MANIPULACIÓN DEL ARREGLO
function cambiarEstado(id) {
  // Uso de find para buscar la tarea
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
    guardarYRenderizar();
  }
}

function eliminarTarea(id) {
  // Uso de filter para remover la tarea
  tareas = tareas.filter(t => t.id !== id);
  guardarYRenderizar();
}

function filtrar(tipo) {
  filtroActual = tipo;
  renderizarTareas();
}

// 5. RENDERIZADO EN EL DOM
function renderizarTareas() {
  listaTareasDOM.innerHTML = '';

  // Uso de filter para filtrar según el botón seleccionado
  let tareasFiltradas = tareas;
  if (filtroActual === 'pendientes') {
    tareasFiltradas = tareas.filter(t => !t.completada);
  } else if (filtroActual === 'completadas') {
    tareasFiltradas = tareas.filter(t => t.completada);
  }

  if (tareasFiltradas.length === 0) {
    listaTareasDOM.innerHTML = '<li>No hay tareas para mostrar.</li>';
    return;
  }

  // Construcción dinámica de la lista
  tareasFiltradas.forEach(tarea => {
    const li = document.createElement('li');
    li.className = tarea.completada ? 'completada' : '';

    li.innerHTML = `
      <span class="texto">
        <strong>${tarea.titulo}</strong> - ${tarea.curso} (Entrega: ${tarea.fechaEntrega})
      </span>
      <button onclick="cambiarEstado(${tarea.id})">
        ${tarea.completada ? 'Desmarcar' : 'Completar'}
      </button>
      <button onclick="eliminarTarea(${tarea.id})">Eliminar</button>
    `;

    listaTareasDOM.appendChild(li);
  });
}

// 6. PERSISTENCIA (LOCALSTORAGE)
function guardarYRenderizar() {
  localStorage.setItem('tareas', JSON.stringify(tareas));
  renderizarTareas();
}

// Inicializar la app al cargar la página
renderizarTareas();