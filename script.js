// Tab switching functionality
function showTab(tabName) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Remove active class from all tabs and forms
    tabButtons.forEach(btn => btn.classList.remove('active'));
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    
    // Add active class to selected tab and form
    if (tabName === 'login') {
        loginForm.classList.add('active');
        tabButtons[0].classList.add('active');
    } else {
        registerForm.classList.add('active');
        tabButtons[1].classList.add('active');
    }
    
    // Clear any existing alerts
    clearAlerts();
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const rollNo = document.getElementById('login-rollno').value;
    const password = document.getElementById('login-password').value;
    
    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem('busSystemUsers')) || [];
    
    // Find user
    const user = users.find(u => u.rollNo === rollNo && u.password === password);
    
    if (user) {
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        showAlert('login-form', 'Login successful! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showAlert('login-form', 'Invalid roll number or password. Please try again.', 'error');
    }
}

// Handle registration form submission
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const rollNo = document.getElementById('reg-rollno').value;
    const email = document.getElementById('reg-email').value;
    const preferredRoute = document.getElementById('reg-route').value;
    const department = document.getElementById('reg-department').value;
    const year = document.getElementById('reg-year').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showAlert('register-form', 'Passwords do not match!', 'error');
        return;
    }
    
    // Validate password strength
    if (password.length < 6) {
        showAlert('register-form', 'Password must be at least 6 characters long!', 'error');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('busSystemUsers')) || [];
    
    // Check if user already exists
    if (users.some(u => u.rollNo === rollNo)) {
        showAlert('register-form', 'This roll number is already registered!', 'error');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        showAlert('register-form', 'This email is already registered!', 'error');
        return;
    }
    
    // Route catalog
    const routeCatalog = {
        'A': { name: 'Route A - Main Campus', distance: 15, busNumber: 'AP-28-TG-5401', destination: 'Main Campus Gate', stops: ['Miyapur', 'KPHB', 'Kukatpally', 'Balanagar', 'Erragadda', 'SR Nagar', 'Ameerpet', 'Main Campus'] },
        'B': { name: 'Route B - East Side', distance: 12, busNumber: 'AP-28-TG-5402', destination: 'East Campus', stops: ['Uppal', 'Habsiguda', 'Nacharam', 'Malakpet', 'Dilsukhnagar', 'East Campus'] },
        'C': { name: 'Route C - West Side', distance: 18, busNumber: 'AP-28-TG-5403', destination: 'West Campus', stops: ['Gachibowli', 'Madhapur', 'Hitec City', 'Kondapur', 'Manikonda', 'Mehdipatnam', 'Lakdikapul', 'Khairatabad', 'Begumpet', 'West Campus'] },
        'D': { name: 'Route D - North Campus', distance: 10, busNumber: 'AP-28-TG-5404', destination: 'North Campus', stops: ['Secunderabad', 'Trimulgherry', 'Alwal', 'Bollaram', 'North Campus'] }
    };

    // Pre-compute a tentative semester fee (same model as calculator) to show dues
    const fuelPrice = 100; // default
    const workingDays = 90; // default
    const efficiency = 6; // km/l
    const route = routeCatalog[preferredRoute];
    const dailyDistance = route.distance * 2;
    const fuelPerDay = dailyDistance / efficiency;
    const fuelCostPerDay = fuelPerDay * fuelPrice;
    const totalFuelCost = fuelCostPerDay * workingDays;
    const maintenance = totalFuelCost * 0.15;
    const driver = 300;
    const admin = 200;
    const fee = Math.round(totalFuelCost + maintenance + driver + admin);

    // Create new user object
    const newUser = {
        name,
        rollNo,
        email,
        department,
        year,
        password,
        registeredDate: new Date().toISOString(),
        attendance: [], // list of {date, present}
        notifications: [
            { id: Date.now(), type: 'info', title: 'Welcome!', message: 'Registration successful. Your route is set to '+ route.name +'.', read: false, date: new Date().toISOString() }
        ],
        payments: { due: fee, transactions: [] },
        issues: [],
        route: route.name,
        routeKey: preferredRoute,
        distanceKm: route.distance,
        busNumber: route.busNumber,
        destination: route.destination,
        stops: route.stops,
        semesterFee: fee,
        semester: 'Fall 2025'
    };
    
    // Add new user to array
    users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('busSystemUsers', JSON.stringify(users));
    
    // Show success message
    showAlert('register-form', 'Registration successful! You can now login.', 'success');
    
    // Clear form
    event.target.reset();
    
    // Switch to login tab after 2 seconds
    setTimeout(() => {
        showTab('login');
    }, 2000);
}

// Show alert message
function showAlert(formId, message, type) {
    clearAlerts();
    
    const form = document.getElementById(formId);
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    form.insertBefore(alert, form.firstChild);
}

// Clear all alerts
function clearAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => alert.remove());
}

// Initialize demo data on first load
function initializeDemoData() {
    const users = JSON.parse(localStorage.getItem('busSystemUsers')) || [];
    
    // Add demo user if no users exist
    if (users.length === 0) {
        const demoUser = {
            name: "Demo Student",
            rollNo: "21A91A6701",
            email: "demo@student.edu",
            department: "CSE(AIML)",
            year: "2",
            password: "demo123",
            registeredDate: new Date().toISOString(),
            attendance: [
                { date: new Date('2025-10-28').toISOString(), present: true },
                { date: new Date('2025-10-29').toISOString(), present: true },
                { date: new Date('2025-10-30').toISOString(), present: false },
                { date: new Date('2025-10-31').toISOString(), present: true },
                { date: new Date('2025-11-01').toISOString(), present: true }
            ],
            notifications: [
                { id: 1, type: 'update', title: 'Fare Model Update', message: 'Fuel price updated to ₹100/L. Your fare is recalculated.', read: false, date: new Date().toISOString() }
            ],
            payments: { due: 0, transactions: [ { id: 'TXN-DEMO', amount: 2500, method: 'UPI', date: new Date().toISOString(), status: 'success' } ] },
            issues: [],
            route: "Route A - Main Campus",
            routeKey: 'A',
            distanceKm: 15,
            busNumber: 'AP-28-TG-5401',
            destination: 'Main Campus Gate',
            stops: ['Miyapur', 'KPHB', 'Kukatpally', 'Balanagar', 'Erragadda', 'SR Nagar', 'Ameerpet', 'Main Campus'],
            semesterFee: 2500,
            semester: "Fall 2025"
        };
        
        users.push(demoUser);
        localStorage.setItem('busSystemUsers', JSON.stringify(users));
        
        console.log('Demo user created - Roll No: 21A91A6701, Password: demo123');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeDemoData();
});
