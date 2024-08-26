document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    const viewProductsBtn = document.getElementById('viewProductsBtn');
    const manageProductsBtn = document.getElementById('manageProductsBtn');
    const manageUsersBtn = document.getElementById('manageUsersBtn');
    const favoritesBtn = document.getElementById('favoritesBtn');
    const profileBtn = document.getElementById('profileBtn');

    const viewProductsSection = document.getElementById('viewProductsSection');
    const manageProductsSection = document.getElementById('manageProductsSection');
    const manageUsersSection = document.getElementById('manageUsersSection');
    const favoritesSection = document.getElementById('favoritesSection');
    const profileSection = document.getElementById('profileSection');

    const role = localStorage.getItem('role');
    console.log('User role:', role);  // Verificar el rol

    // Mostrar el menú según el rol del usuario
    if (role === 'admin') {
        console.log('Role is admin');
        document.getElementById('adminMenu').classList.remove('hidden');
        showSection(viewProductsSection);
        loadProducts();
    } else if (role === 'buyer') {
        console.log('Role is buyer');
        document.getElementById('userMenu').classList.remove('hidden');
        showSection(favoritesSection);
        loadFavorites();
    } else {
        console.log('No valid role found, redirecting to index');
        window.location.href = 'index.html';
    }

    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = 'login.html';
    });

    viewProductsBtn.addEventListener('click', function() {
        showSection(viewProductsSection);
        loadProducts();
    });

    manageProductsBtn.addEventListener('click', function() {
        showSection(manageProductsSection);
    });

    manageUsersBtn.addEventListener('click', function() {
        showSection(manageUsersSection);
        loadUsers();
    });

    favoritesBtn.addEventListener('click', function() {
        showSection(favoritesSection);
        loadFavorites();
    });

    profileBtn.addEventListener('click', function() {
        showSection(profileSection);
        loadProfile();
    });

    function showSection(section) {
        console.log('Showing section:', section.id);
        viewProductsSection.classList.add('hidden');
        manageProductsSection.classList.add('hidden');
        manageUsersSection.classList.add('hidden');
        favoritesSection.classList.add('hidden');
        profileSection.classList.add('hidden');
        
        section.classList.remove('hidden');
    }

    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

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
                `;

                productsContainer.appendChild(productCard);
            });

        } catch (err) {
            console.error('Error al cargar los productos:', err);
            const productsContainer = document.getElementById('productsContainer');
            productsContainer.innerHTML = '<p class="text-red-500">Error al cargar los productos.</p>';
        }
    }

    async function loadUsers() {
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const users = await response.json();
            const usersContainer = document.getElementById('usersContainer');
            usersContainer.innerHTML = '';  // Limpiar contenedor

            users.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'bg-white p-4 rounded shadow';

                userCard.innerHTML = `
                    <h3 class="text-xl font-bold mb-2">${user.name}</h3>
                    <p class="text-gray-700 mb-2">${user.email}</p>
                    <p class="text-green-500 font-bold mb-4">${user.role}</p>
                    <button class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 edit-user" data-id="${user._id}">Editar</button>
                    <button class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 delete-user" data-id="${user._id}">Eliminar</button>
                `;

                usersContainer.appendChild(userCard);
            });

        } catch (err) {
            console.error('Error al cargar los usuarios:', err);
            const usersContainer = document.getElementById('usersContainer');
            usersContainer.innerHTML = '<p class="text-red-500">Error al cargar los usuarios.</p>';
        }
    }

    async function loadFavorites() {
        try {
            const response = await fetch('http://localhost:3000/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const favorites = await response.json();
            const favoritesContainer = document.getElementById('favoritesContainer');
            favoritesContainer.innerHTML = '';  // Limpiar contenedor

            if (favorites.length === 0) {
                favoritesContainer.innerHTML = '<p class="text-gray-500">No tienes productos favoritos.</p>';
                return;
            }

            favorites.forEach(favorite => {
                const favoriteCard = document.createElement('div');
                favoriteCard.className = 'bg-white p-4 rounded shadow';

                favoriteCard.innerHTML = `
                    <img class="w-full h-48 object-cover mb-4" src="http://localhost:3000/uploads/${favorite.product.image}" alt="${favorite.product.name}">
                    <h3 class="text-xl font-bold mb-2">${favorite.product.name}</h3>
                    <p class="text-gray-700 mb-2">${favorite.product.description}</p>
                    <p class="text-green-500 font-bold mb-4">$${favorite.product.price}</p>
                `;

                favoritesContainer.appendChild(favoriteCard);
            });

        } catch (err) {
            console.error('Error al cargar los favoritos:', err);
            const favoritesContainer = document.getElementById('favoritesContainer');
            favoritesContainer.innerHTML = '<p class="text-red-500">Error al cargar los favoritos.</p>';
        }
    }

    async function loadProfile() {
        try {
            const response = await fetch('http://localhost:3000/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const profile = await response.json();
            document.getElementById('profileName').value = profile.name;
            document.getElementById('profileEmail').value = profile.email;

        } catch (err) {
            console.error('Error al cargar el perfil:', err);
        }
    }

    // Cargar la sección de productos al iniciar
    showSection(viewProductsSection);
    loadProducts();
});
