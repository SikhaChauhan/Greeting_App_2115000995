// js/main.js

const apiBaseUrl = "https://localhost:7207";

// Utility: Get JWT token from localStorage
function getToken() {
    return localStorage.getItem('jwtToken');
}

// Utility: Handle API response errors
async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
    }
    return data;
}

// ==================
//     Login Page 
// ==================
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const loginError = document.getElementById('loginError');
            loginError.innerText = '';

            try {
                const response = await fetch(`${apiBaseUrl}/api/User/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await handleResponse(response);
                if (data) {
                    localStorage.setItem('jwtToken', data.data);
                    console.log("TOKEN: ", localStorage.getItem('jwtToken', data))
                    window.location.href = 'home.html';
                }
            } catch (err) {
                loginError.innerText = err.message;
            }
        });
    }
}

// ========================
//     Registration Page 
// ========================
function initRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('regEmail').value;
            const username = document.getElementById('regUserName').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const registerError = document.getElementById('registerError');
            registerError.innerText = '';

            if (password !== confirmPassword) {
                registerError.innerText = "Passwords do not match.";
                return;
            }

            try {
                const response = await fetch(`${apiBaseUrl}/api/User/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: 0, userName: username, email, PasswordHash: password })
                });
                await handleResponse(response);
                window.location.href = 'index.html';
            } catch (err) {
                registerError.innerText = err.message;
            }
        });
    }
}

// ==================
//      Home Page 
// ==================
function initHomePage() {
    // If not logged in, redirect to login page
    if (!getToken()) {
        window.location.href = 'index.html';
        return;
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
        });
    }

    // Fetch greetings
    async function fetchGreetings() {
        const homeError = document.getElementById('homeError');
        homeError.innerText = '';
        try {
            const response = await fetch(`${apiBaseUrl}/HelloGreeting/get-greetings`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') }
            });
            const data = await handleResponse(response);
            displayGreetings(data.data);
        } catch (err) {
            homeError.innerText = err.message;
        }
    }

    // Display greetings in the container
    function displayGreetings(greetings) {
        const container = document.getElementById('greetingsContainer');
        container.innerHTML = '';
        greetings.forEach(greeting => {
            const div = document.createElement('div');
            div.className = 'greeting-item';
            div.innerHTML = `
        <p><strong>${greeting.firstName} ${greeting.lastName}</strong>: ${greeting.message}</p>
        <button class="edit-btn" data-id="${greeting.id}">Edit</button>
        <button class="delete-btn" data-id="${greeting.id}">Delete</button>
      `;
            container.appendChild(div);
        });

        // Attach event listeners to Edit and Delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                editGreeting(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                deleteGreeting(id);
            });
        });
    }

    // Add new greeting
    const addGreetingForm = document.getElementById('addGreetingForm');
    if (addGreetingForm) {
        addGreetingForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const firstName = document.getElementById('greetingFirstName').value;
            const lastName = document.getElementById('greetingLastName').value;
            const message = document.getElementById('greetingMessage').value;
            const homeError = document.getElementById('homeError');
            homeError.innerText = '';

            try {
                const response = await fetch(`${apiBaseUrl}/HelloGreeting/save-greeting`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                    },
                    body: JSON.stringify({ firstName, lastName, message })
                });
                await handleResponse(response);
                addGreetingForm.reset();
                fetchGreetings();
            } catch (err) {
                homeError.innerText = err.message;
            }
        });
    }

    // Edit greeting
    async function editGreeting(id) {
        const newMessage = prompt("Enter new message:");
        if (!newMessage) return;
        try {
            const response = await fetch(`${apiBaseUrl}/HelloGreeting/update-greeting?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify(newMessage)
            });
            await handleResponse(response);
            fetchGreetings();
        } catch (err) {
            alert(err.message);
        }
    }

    // Delete greeting
    async function deleteGreeting(id) {
        if (!confirm("Are you sure you want to delete this greeting?")) return;
        try {
            const response = await fetch(`${apiBaseUrl}/HelloGreeting/delete-greeting?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            await handleResponse(response);
            fetchGreetings();
        } catch (err) {
            alert(err.message);
        }
    }

    // Initial fetch of greetings
    fetchGreetings();
}

// ==================
//   Initialization
// ==================
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on by ID of a known element
    if (document.getElementById('loginForm')) {
        initLoginPage();
    } else if (document.getElementById('registerForm')) {
        initRegisterPage();
    } else if (document.getElementById('greetingsContainer')) {
        initHomePage();
    }
});
