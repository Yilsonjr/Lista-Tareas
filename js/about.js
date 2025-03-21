document.addEventListener('DOMContentLoaded', function() {

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

    actualizarUI();
});