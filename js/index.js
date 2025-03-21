document.addEventListener('DOMContentLoaded', function() {
    const btnCrearTarea = document.getElementById('btnCrearTarea');
    const titulo = document.getElementById('tituloTarea');
    const descripcion = document.getElementById('descripcionTarea');
    const fecha = document.getElementById('fechaTarea');
    const hora = document.getElementById('horaTarea');
    const buscadorTareas = document.getElementById('buscadorTareas');
    const selectFiltrarTareas  = document.getElementById('filtrarTareas');
   

    function actualizarUI() {
        const estaLogueado = localStorage.getItem('emailLogueado') !== null;
        const liUsuario = document.getElementById('liUsuario');
        const liLogout = document.getElementById('liLogout');
        const botonesAccion = document.querySelectorAll('.btnConfirmar, .btnCancelar, .btnEditar, .btnEliminar');

        if (estaLogueado) {
            liUsuario.style.display = 'block'; // Mostrar liUsuario
            liUsuario.textContent = `Hola ${localStorage.getItem('emailLogueado')}`;
            liLogout.textContent = 'Logout';
            liLogout.href = '#';
    
            botonesAccion.forEach(boton => {
                boton.disabled = false;
            });
        } else {
            liUsuario.style.display = 'none'; // Ocultar liUsuario
            liLogout.textContent = 'Iniciar sesión';
            liLogout.href = 'login.html';
    
            botonesAccion.forEach(boton => {
                boton.disabled = true;
            });
        }
    }
    liLogout.addEventListener('click', function() {

        event.preventDefault();
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('emailLogueado');
                window.location.href = "login.html";
            }
        });
        actualizarUI();
    });

    btnCrearTarea.disabled = true;

    function validarCampos(){
        if (titulo.value && descripcion.value && fecha.value && hora.value) {
            btnCrearTarea.disabled = false;
        }else{
            btnCrearTarea.disabled = true;
        }
    }
    titulo.addEventListener('input', validarCampos);
    descripcion.addEventListener('input', validarCampos);
    fecha.addEventListener('change', validarCampos);
    hora.addEventListener('change', validarCampos);

    validarCampos();

    document.getElementById('btnCrearTarea').addEventListener('click', function(){
         event.preventDefault();

       const tituloTarea= titulo.value; 
        const descripcionTarea = descripcion.value;
        const fechaTarea = fecha.value;
        const horaTarea = hora.value


        const index = this.dataset.index;
        let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

        if(!isNaN(index)){
            tareas[index] ={ 
                titulo: tituloTarea,
                descripcion: descripcionTarea,
                fecha: fechaTarea,
                hora: horaTarea,
                estado: 'Pendiente'
            };
            localStorage.setItem('tareas', JSON.stringify(tareas));
            Swal.fire({
                title: 'Tarea Actualizada',
                text: 'La tarea ha sido actualizada correctamente.',
                icon: 'success',
                timer: 3000
            });

            this.textContent = 'Crear Tarea';
            this.removeAttribute('data-index');
            btnCrearTarea.disabled=true;

        }else{
            const tarea = {
                titulo: tituloTarea,
                descripcion: descripcionTarea,
                fecha: fechaTarea,
                hora: horaTarea,
                estado: 'Pendiente'
            };
            Swal.fire({
                title: 'Registro de Tarea',
                text: 'La tarea ha sido registrada correctamente.',
                icon: 'success',
                timer: 3000
            });
            tareas.push(tarea);
            localStorage.setItem('tareas', JSON.stringify(tareas));
        }        


        titulo.value = '';
        descripcion.value = '';
        fecha.value = '';
        hora.value ='';

        showTareas();
     });

     buscadorTareas.addEventListener('input',function(){
        const textoBuscador = this.value.toLowerCase();
        filtrarTareas(textoBuscador);
    });

    selectFiltrarTareas.addEventListener('change', function() {
      const filtroSelect = this.value.toLowerCase();

      if(filtroSelect === 'todos'){
        showTareas();
      }else{
        filtrarTareasEstado(filtroSelect);
      }
    });

    function filtrarTareasEstado(estado){
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        const tareasFiltradas = tareas.filter(tarea => 
            tarea.estado.toLowerCase() === estado);
        showTareas(tareasFiltradas);
    }

    function filtrarTareas(textoBuscador){ // FUNCION PARA FILTRAR LAS TAREAS MIENTRAS UNO ESCRIBE EN EL CAMPO DE TEXTO
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        const tareasFiltradas = tareas.filter(tarea =>{
            return tarea.titulo.toLowerCase().includes(textoBuscador) ||
            tarea.descripcion.toLowerCase().includes(textoBuscador) ||
            tarea.fecha.toLowerCase().includes(textoBuscador) ||
            tarea.hora.toLowerCase().includes(textoBuscador) ||
            tarea.estado.toLowerCase().includes(textoBuscador);

        });
        showTareas(tareasFiltradas);
    }
   

    function showTareas(tareasMostrar= null){
        const tablaTareas = document.getElementById('tablaTareas');

        tablaTareas.innerHTML ='';

        const tareas = tareasMostrar || JSON.parse(localStorage.getItem('tareas')) || [];

        tareas.forEach((tarea, index) =>{
            const fila = document.createElement('tr');
            let colorFondo; // Variable para almacenar el color de fondo
            let colorTexto;

            if (tarea.estado === 'Cancelada') {
                colorFondo = 'bg-danger'; // Fondo Rojo
                colorTexto = 'text-light';
            } else if (tarea.estado === 'Completada') {
                colorFondo = 'bg-success'; // Fondo Verde
                colorTexto = 'text-light';
            } else {
                colorFondo = 'bg-warning'; // Fondo Naranja
                colorTexto = 'text-dark';
            }
            fila.innerHTML = `
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${tarea.titulo}</td>
                <td class="text-center">${tarea.descripcion}</td>
                <td class="text-center">${tarea.fecha} ${tarea.hora}</td>
                <td class="text-center"><span class="p-2 badge ${colorFondo} ${colorTexto} ">${tarea.estado}</span></td>
                <td class="text-center d-flex">
                    <button class="btn btn-sm btn-success btnConfirmar" data-index="${index}" ${tarea.estado === 'Cancelada' ? 'disabled' : ''}><i class="bi bi-check-circle"></i></button>
                    <button class="btn btn-sm btn-danger btnCancelar" data-index="${index}" ${tarea.estado === 'Cancelada' ? 'disabled' : ''}><i class="bi bi-x-circle"></i></button>
                    <button class="btn btn-sm btn-primary btnEditar" data-index="${index}" ${tarea.estado === 'Cancelada' ? 'disabled' : ''}><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-secondary btnEliminar" data-index="${index}"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tablaTareas.appendChild(fila);
        });

        actualizarUI();

        const eliminar = document.querySelectorAll('.btnEliminar');
        const editar = document.querySelectorAll('.btnEditar');
        const confirmar = document.querySelectorAll('.btnConfirmar');
        const cancelar = document.querySelectorAll('.btnCancelar');

        editar.forEach(boton => {
            boton.addEventListener('click', function(){
                const index = parseInt(this.dataset.index);
                const tarea = tareas[index];
                
                titulo.value = tarea.titulo;
                descripcion.value = tarea.descripcion;
                fecha.value = tarea.fecha;
                hora.value = tarea.hora;

                btnCrearTarea.disabled = false;

                btnCrearTarea.textContent = 'Actualizar';

                btnCrearTarea.dataset.index = index;
            })
        });



        eliminar.forEach(boton => {
            boton.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);

                Swal.fire({
                    title: '¿Estás seguro?',
                    text: '¿Deseas eliminar esta tarea?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        tareas.splice(index, 1);
                        localStorage.setItem('tareas', JSON.stringify(tareas));
                        showTareas();
                    }
                });
            });
        });

        confirmar.forEach(boton =>{
            boton.addEventListener('click',function(){
                const index = parseInt(this.dataset.index);
                const tarea = tareas[index];
                
                if(tarea.estado ==='Pendiente'){
                    tarea.estado = 'Completada';
                    localStorage.setItem('tareas',JSON.stringify(tareas));
                    
                    Swal.fire({
                        title: 'Tarea Completada',
                        text: 'El estado de la tarea ha sido completada.',
                        icon: 'success',
                        showConfirmButton: true
                    });
                    showTareas(); //Refresco la tabla con la tarea actualizada.
                }
            });
        });

        //Boton Cancelar - Para cancelar las tareas 
        cancelar.forEach(boton =>{
            boton.addEventListener('click',function(){
                const index = parseInt(this.dataset.index);
                const tarea = tareas[index];

                    Swal.fire({
                        title: "Estás seguro?",
                        text: "Estás intentando cancelar la tarea...",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Sí, Cancelar!"
                      }).then((result) => {
                        if (result.isConfirmed) {
                            tarea.estado = 'Cancelada';
                            localStorage.setItem('tareas',JSON.stringify(tareas));
                            showTareas();
                          Swal.fire({
                            title: "Cancelada!",
                            text: "Su tarea ha sido cancelada.",
                            icon: "success"
                          });
                        }
                      });
                    showTareas(); //Refresco la tabla con la tarea actualizada.
            });
        })
    }

    showTareas();
    actualizarUI();
});