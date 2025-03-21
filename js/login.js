document.addEventListener('DOMContentLoaded', function() {

	document.getElementById('btnLogin').addEventListener('click', function () {
		const email = document.getElementById("email").value;
		
		if (!email) {
		    Swal.fire({
		        title: 'Error',
		        text: 'Por favor, ingresa tu correo electrónico.',
		        icon: 'warning'
		    });
		    return;
		}

		let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
		 
		 if (usuarios.includes(email)) {

			localStorage.setItem('emailLogueado', email);
			setTimeout(() =>{
				window.location.href ="about.html" }, 1000);
		}else {
        
	        usuarios.push(email);
	        localStorage.setItem('usuarios', JSON.stringify(usuarios));
	        localStorage.setItem('emailLogueado', email);
	        window.location.href = 'index.html'; 
    	}
		
	});
});
