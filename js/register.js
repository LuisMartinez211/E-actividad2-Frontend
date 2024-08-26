document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;  // Obtener el valor del rol seleccionado

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {  // Ajusta la URL si es necesario
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })  // Incluir el rol en la solicitud
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar el token en localStorage
            localStorage.setItem('token', data.token);
            // Redirigir al dashboard o página principal
            window.location.href = 'dashboard.html';  // Ajusta la URL según tu estructura
        } else {
            alert(data.msg);  // Mostrar mensaje de error del servidor
        }
    } catch (err) {
        console.error('Error en el registro:', err);
        alert('Error al intentar registrarse.');
    }
});
