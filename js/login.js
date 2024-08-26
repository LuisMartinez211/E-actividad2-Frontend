document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {  // Ajusta la URL si es necesario
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar el token en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user.role); // Guardar el rol del usuario en localStorage

            // Redirigir al dashboard o página principal según el rol
            if (data.user.role === 'admin') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            alert(data.msg);  // Mostrar mensaje de error del servidor
        }
    } catch (err) {
        console.error('Error en la autenticación:', err);
        alert('Error al intentar iniciar sesión.');
    }
});
