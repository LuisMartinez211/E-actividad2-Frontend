document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const token = localStorage.getItem('token');

    if (token) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }

    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = 'index.html';
    });

    // Lógica para cargar los productos
    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/products/all');
            const products = await response.json();

            const productsContainer = document.getElementById('productsContainer');
            productsContainer.innerHTML = '';  // Limpiar contenedor

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'bg-white p-4 rounded shadow';

                productCard.innerHTML = `
                    <img class="w-full h-48 object-cover mb-4" src="http://localhost:3000/uploads/${product.image}" alt="${product.name}">
                    <h3 class="text-xl font-bold mb-2">${product.name}</h3>
                    <p class="text-gray-700 mb-2">${product.description}</p>
                    <p class="text-green-500 font-bold mb-4">$${product.price}</p>
                    <button class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 add-to-favorites" data-id="${product._id}">Añadir a Favoritos</button>
                `;

                productsContainer.appendChild(productCard);
            });

            document.querySelectorAll('.add-to-favorites').forEach(button => {
                button.addEventListener('click', handleAddToFavorites);
            });

        } catch (err) {
            console.error('Error al cargar los productos:', err);
            productsContainer.innerHTML = '<p class="text-red-500">Error al cargar los productos.</p>';
        }
    }

    async function handleAddToFavorites(e) {
        const productId = e.target.dataset.id;

        try {
            const response = await fetch('http://localhost:3000/api/favorites', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            });

            if (response.ok) {
                alert('Producto añadido a favoritos');
            } else {
                const errorData = await response.json();
                console.error('Error al añadir a favoritos:', errorData);
                alert('Error al añadir a favoritos');
            }
        } catch (err) {
            console.error('Error en la solicitud de añadir a favoritos:', err);
            alert('Error al añadir a favoritos');
        }
    }

    loadProducts();  // Cargar productos al iniciar
});
