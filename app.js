// Initial food items data
const foodItems = [
    {
        id: 1,
        name: 'Margherita Pizza',
        price: 12.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500'
    },
    {
        id: 2,
        name: 'Classic Burger',
        price: 9.99,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
    },
    {
        id: 3,
        name: 'California Roll',
        price: 14.99,
        category: 'Sushi',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500'
    },
    {
        id: 4,
        name: 'Chocolate Cake',
        price: 6.99,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
    },
    {
        id: 5,
        name: 'Pepperoni Pizza',
        price: 13.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500'
    },
    {
        id: 6,
        name: 'Cheese Burger',
        price: 10.99,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500'
    },
    {
        id: 7,
        name: 'Dragon Roll',
        price: 16.99,
        category: 'Sushi',
        image: 'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=500'
    },
    {
        id: 8,
        name: 'Tiramisu',
        price: 7.99,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500'
    },
    {
        id: 9,
        name: 'BBQ Chicken Pizza',
        price: 14.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'
    },
    {
        id: 10,
        name: 'Bacon Burger',
        price: 11.99,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500'
    }
];

// DOM Elements
const authForm = document.getElementById('auth-form');
const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');
const foodGrid = document.getElementById('food-grid');
const searchInput = document.getElementById('search-input');
const ordersContainer = document.getElementById('orders-container');

// Initialize data
function initializeApp() {
    if (!localStorage.getItem('foods')) {
        localStorage.setItem('foods', JSON.stringify(foodItems));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    displayFoodItems();
    displayOrders();
    updateProfileInfo();
}

// Authentication handler
function handleAuth(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    const userData = { name, email, phone };
    localStorage.setItem('userData', JSON.stringify(userData));
    
    authScreen.classList.remove('active');
    mainApp.classList.add('active');
    updateProfileInfo();
}

// Update profile information
function updateProfileInfo() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    document.getElementById('profile-name').textContent = userData.name || '';
    document.getElementById('profile-email').textContent = userData.email || '';
    document.getElementById('profile-phone').textContent = userData.phone || '';
}

// Create food card element
function createFoodCard(food) {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.innerHTML = `
        <div class="food-image">
            <img src="${food.image}" alt="${food.name}">
            <span class="category-tag">${food.category}</span>
        </div>
        <div class="food-info">
            <h3>${food.name}</h3>
            <p class="price">$${food.price.toFixed(2)}</p>
            <button class="button button-primary" onclick="showOrderModal(${food.id})">
                <span class="material-icons-round">shopping_cart</span>
                Order Now
            </button>
        </div>
    `;
    return card;
}

// Display food items
function displayFoodItems(category = 'all') {
    const foods = JSON.parse(localStorage.getItem('foods'));
    foodGrid.innerHTML = '';
    
    const filteredFoods = category === 'all' 
        ? foods 
        : foods.filter(food => food.category === category);
    
    filteredFoods.forEach(food => {
        foodGrid.appendChild(createFoodCard(food));
    });
}

// Filter by category
function filterByCategory(category) {
    document.querySelectorAll('.chip').forEach(chip => {
        chip.classList.remove('active');
    });
    document.querySelector(`.chip[onclick*="${category}"]`).classList.add('active');
    displayFoodItems(category);
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const foods = JSON.parse(localStorage.getItem('foods'));
    const searchResults = document.getElementById('search-results');
    
    searchResults.innerHTML = '';
    
    if (searchTerm === '') {
        document.getElementById('no-results').style.display = 'none';
        return;
    }
    
    const filteredFoods = foods.filter(food => 
        food.name.toLowerCase().includes(searchTerm) || 
        food.category.toLowerCase().includes(searchTerm)
    );
    
    if (filteredFoods.length === 0) {
        document.getElementById('no-results').style.display = 'block';
    } else {
        document.getElementById('no-results').style.display = 'none';
        filteredFoods.forEach(food => {
            searchResults.appendChild(createFoodCard(food));
        });
    }
}

// Create order element
function createOrderElement(order) {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `
        <div class="order-header">
            <div class="order-title">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-status ${order.status.toLowerCase()}">
                    <span class="status-dot"></span>
                    ${order.status}
                </span>
            </div>
            <div class="timestamp">${new Date(order.timestamp).toLocaleString()}</div>
        </div>
        <div class="order-content">
            <div class="order-food-details">
                <img src="${order.foodImage}" alt="${order.foodName}">
                <div class="food-info">
                    <h4>${order.foodName}</h4>
                    <p>Quantity: ${order.quantity}</p>
                    <p class="price">Total: $${order.total.toFixed(2)}</p>
                </div>
            </div>
            <div class="delivery-details">
                <div class="detail-item">
                    <span class="material-icons-round">location_on</span>
                    <p>${order.address}</p>
                </div>
                ${order.notes ? `
                <div class="detail-item">
                    <span class="material-icons-round">note</span>
                    <p>${order.notes}</p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    return div;
}

// Display orders
function displayOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    ordersContainer.innerHTML = '';
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <span class="material-icons-round">receipt_long</span>
                <h3>No Orders Yet</h3>
                <p>Your order history will appear here</p>
            </div>
        `;
        return;
    }
    
    orders.reverse().forEach(order => {
        ordersContainer.appendChild(createOrderElement(order));
    });
}

// Show order modal
function showOrderModal(foodId) {
    const foods = JSON.parse(localStorage.getItem('foods'));
    const food = foods.find(f => f.id === foodId);
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    document.getElementById('order-food-image').src = food.image;
    document.getElementById('order-food-name').textContent = food.name;
    document.getElementById('order-food-price').textContent = `$${food.price.toFixed(2)}`;
    
    document.getElementById('order-name').value = userData.name || '';
    document.getElementById('order-phone').value = userData.phone || '';
    
    document.getElementById('order-modal').classList.add('active');
    updateOrderTotal();
}

// Update order total
function updateOrderTotal() {
    const quantity = parseInt(document.getElementById('order-quantity').value);
    const price = parseFloat(document.getElementById('order-food-price').textContent.slice(1));
    const total = quantity * price;
    document.getElementById('order-total-price').textContent = `$${total.toFixed(2)}`;
}

// Place order
function placeOrder() {
    const foodName = document.getElementById('order-food-name').textContent;
    const foodImage = document.getElementById('order-food-image').src;
    const quantity = parseInt(document.getElementById('order-quantity').value);
    const total = parseFloat(document.getElementById('order-total-price').textContent.slice(1));
    
    const order = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        foodName,
        foodImage,
        quantity,
        total,
        status: 'Pending',
        name: document.getElementById('order-name').value,
        phone: document.getElementById('order-phone').value,
        address: document.getElementById('order-address').value,
        notes: document.getElementById('order-notes').value
    };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    closeOrderModal();
    showOrderSuccessModal(order);
    displayOrders();
}

// Modal Management
function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
    document.getElementById('order-form').reset();
}

function showOrderSuccessModal(order) {
    document.getElementById('success-order-id').textContent = `Order #${order.id}`;
    document.getElementById('success-order-items').textContent = `${order.quantity}x ${order.foodName}`;
    document.getElementById('success-order-total').textContent = `Total: $${order.total.toFixed(2)}`;
    document.getElementById('success-order-name').textContent = order.name;
    document.getElementById('success-order-phone').textContent = order.phone;
    document.getElementById('success-order-address').textContent = order.address;
    
    document.getElementById('order-success-modal').classList.add('active');
}

function closeOrderSuccessModal() {
    document.getElementById('order-success-modal').classList.remove('active');
}

// Show screens
function showScreen(screenId) {
    document.querySelectorAll('.screen-content').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenId}-screen`).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-item[onclick*="${screenId}"]`).classList.add('active');
}

// Clear all data
function clearUserData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        localStorage.clear();
        location.reload();
    }
}

// Event listeners
if (authForm) {
    authForm.addEventListener('submit', handleAuth);
}

if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

document.getElementById('order-quantity').addEventListener('input', updateOrderTotal);

// Initialize app
initializeApp();
