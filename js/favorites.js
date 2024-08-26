document.addEventListener('DOMContentLoaded', async function() {
    const favoritesContainer = document.getElementById('favoritesContainer');

    async function loadFavorites() {
        try {
            const response = await fetch('http://localhost:3000/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const favorites = await response.json();

            favoritesContainer.innerHTML = '';  // Limpiar contenedor

            if (!Array.isArray(favorites)) {
                throw new TypeError('La respuesta no es un arreglo de favoritos.');
            }

            favorites.forEach(favorite => {
                const product = favorite.product; // Asumiendo que el objeto favorite contiene un campo 'product'
                const productCard = document.createElement('div');
                productCard.className = 'bg-white p-4 rounded shadow';

                productCard.innerHTML = `
                    <img class="w-full h-48 object-cover mb-4" src="http://localhost:3000/uploads/${product.image}" alt="${product.name}">
                    <h3 class="text-xl font-bold mb-2">${product.name}</h3>
                    <p class="text-gray-700 mb-2">${product.description}</p>
                    <p class="text-green-500 font-bold mb-4">$${product.price}</p>
                    <button class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 remove-from-favorites" data-id="${favorite._id}">Eliminar de Favoritos</button>
                `;

                favoritesContainer.appendChild(productCard);
            });

            // Añadir event listeners a los botones "Eliminar de Favoritos"
            document.querySelectorAll('.remove-from-favorites').forEach(button => {
                button.addEventListener('click', handleRemoveFromFavorites);
            });

        } catch (err) {
            console.error('Error al cargar los favoritos:', err);
            favoritesContainer.innerHTML = '<p class="text-red-500">Error al cargar los favoritos.</p>';
        }
    }

    // Manejar la eliminación de productos de favoritos
    async function handleRemoveFromFavorites(e) {
        const favoriteId = e.target.dataset.id;

        try {
            const response = await fetch(`http://localhost:3000/api/favorites/${favoriteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                alert('Producto eliminado de favoritos');
                loadFavorites();  // Recargar favoritos
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar de favoritos:', errorData);
                alert('Error al eliminar de favoritos');
            }
        } catch (err) {
            console.error('Error en la solicitud de eliminar de favoritos:', err);
            alert('Error al eliminar de favoritos');
        }
    }

    // Cargar favoritos al iniciar
    loadFavorites();
});
