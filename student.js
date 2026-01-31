// Check if user is logged in
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return null;
    }
    return currentUser;
}

// Initialize dashboard
function initDashboard() {
    const user = checkAuth();
    if (!user) return;
    
    // Display user name
    document.getElementById('user-name').textContent = user.name;
    
    // Update overview stats
    updateOverviewStats(user);
    
    // Load all sections
    loadRoutesSection(user);
    loadMaintenanceSection();
    loadProfileSection(user);
    loadAttendance(user);
    renderPayments(user);
    renderNotifications(user);
    renderIssues(user);
}

// Update overview statistics
function updateOverviewStats(user) {
    if (!user.busPass) return;

    const pass = user.busPass;
    document.getElementById('pass-status').textContent = pass.status === 'active' ? 'Active' : pass.status === 'pending' ? 'Payment Pending' : 'Inactive';
    document.getElementById('current-fare').textContent = `₹${pass.fee}`;
    document.getElementById('route-info').textContent = pass.route;
    document.getElementById('semester-info').textContent = pass.semester;

    // Compute metrics
    const routeDistance = pass.distanceKm || 0;
    const fuelPrice = 100; // default used in registration/calculator
    const workingDays = 90;
    const efficiency = 6; // km per liter
    const dailyDistance = routeDistance * 2;
    const fuelPerDay = routeDistance ? (dailyDistance / efficiency) : 0;
    const totalFuelCost = fuelPerDay * fuelPrice * workingDays;
    const maintenance = totalFuelCost * 0.15;
    const driver = 300;
    const admin = 200;
    const fare = Math.round(totalFuelCost + maintenance + driver + admin);
    const totalKm = dailyDistance * workingDays;
    const costPerKm = totalKm ? (fare / totalKm) : 0;

    const due = (user.payments && user.payments.due) || 0;
    document.getElementById('due-status').textContent = due > 0 ? `Due: ₹${due}` : 'Paid';
    document.getElementById('current-fare').textContent = `₹${isNaN(fare)?0:fare}`;
    document.getElementById('route-info').textContent = pass.route || 'Not Assigned';
    document.getElementById('semester-info').textContent = pass.semester || 'Fall 2025';
    document.getElementById('fuel-cost').textContent = `₹${isNaN(totalFuelCost)?0:totalFuelCost.toFixed(0)}`;
    document.getElementById('cost-per-km').textContent = `₹${isNaN(costPerKm)?'0.00':costPerKm.toFixed(2)}/km`;
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.classList.add('active');
    }
    
    // Add active class to clicked nav item
    event.target.classList.add('active');
    
    // Update section title
    const titles = {
        'overview': 'Dashboard Overview',
        'routes': 'Bus Routes',
        'attendance': 'Attendance',
        'payments': 'Payments',
        'notifications': 'Notifications',
        'issues': 'Report Issue',
        'maintenance': 'Maintenance Logs',
        'profile': 'My Profile'
    };
    document.getElementById('section-title').textContent = titles[sectionName];
}

// Load bus pass section
// Bus pass section removed as per requirement

// Load routes section
function loadRoutesSection(user) {
    const container = document.getElementById('routes-container');

    if (!user.route) {
        container.innerHTML = `<div class="no-pass"><h2>No Route Assigned</h2><p>Your route isn't set yet. Please set a route in registration or contact transport office.</p></div>`;
        return;
    }

    const timings = {
        'A': '7:30 AM - 6:00 PM',
        'B': '7:45 AM - 5:45 PM',
        'C': '7:15 AM - 6:15 PM',
        'D': '8:00 AM - 5:30 PM'
    };

    container.innerHTML = `
        <div class="route-card" style="max-width: 800px; margin: 0 auto;">
            <h3 style="color:#667eea; margin-bottom:20px;">🚌 ${user.route}</h3>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:15px; margin-bottom:25px; padding:20px; background:#f8f9fa; border-radius:10px;">
                <div>
                    <div style="font-size:12px; color:#666; margin-bottom:5px;">Bus Number</div>
                    <div style="font-size:18px; font-weight:bold; color:#333;">${user.busNumber || 'Not Assigned'}</div>
                </div>
                <div>
                    <div style="font-size:12px; color:#666; margin-bottom:5px;">Distance (One Way)</div>
                    <div style="font-size:18px; font-weight:bold; color:#333;">${user.distanceKm} km</div>
                </div>
                <div>
                    <div style="font-size:12px; color:#666; margin-bottom:5px;">Final Destination</div>
                    <div style="font-size:18px; font-weight:bold; color:#333;">${user.destination || 'Campus'}</div>
                </div>
                <div>
                    <div style="font-size:12px; color:#666; margin-bottom:5px;">Timing</div>
                    <div style="font-size:18px; font-weight:bold; color:#333;">${timings[user.routeKey] || 'N/A'}</div>
                </div>
            </div>

            <div style="margin-top:25px;">
                <h4 style="margin-bottom:15px; color:#333;">🚏 Bus Stops</h4>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${(user.stops || []).map((stop, index) => `
                        <div style="display:flex; align-items:center; padding:12px; background:${index === user.stops.length - 1 ? '#e0e7ff' : '#fff'}; border-radius:8px; border-left:4px solid ${index === user.stops.length - 1 ? '#667eea' : '#e1e1e1'};">
                            <div style="width:30px; height:30px; background:${index === user.stops.length - 1 ? '#667eea' : '#94a3b8'}; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; margin-right:15px;">${index + 1}</div>
                            <div style="flex:1; font-weight:${index === user.stops.length - 1 ? 'bold' : 'normal'}; color:${index === user.stops.length - 1 ? '#667eea' : '#333'};">${stop}</div>
                            ${index === user.stops.length - 1 ? '<div style="color:#667eea; font-size:12px;">🎯 Destination</div>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="margin-top:25px; padding:15px; background:#fff3cd; border-radius:8px; border-left:4px solid #ffc107;">
                <strong>📍 Note:</strong> Please be at your boarding point 5 minutes before scheduled time.
            </div>
        </div>
    `;
}

// Load maintenance logs
function loadMaintenanceSection() {
    const logs = [
        { date: '2025-10-28', vehicle: 'Bus A01', type: 'Engine Service', cost: '₹5,000', status: 'Completed' },
        { date: '2025-10-25', vehicle: 'Bus B02', type: 'Tire Replacement', cost: '₹8,000', status: 'Completed' },
        { date: '2025-10-20', vehicle: 'Bus C03', type: 'Oil Change', cost: '₹2,500', status: 'Completed' },
        { date: '2025-10-15', vehicle: 'Bus D04', type: 'Brake Service', cost: '₹4,500', status: 'Completed' },
        { date: '2025-10-10', vehicle: 'Bus A01', type: 'AC Repair', cost: '₹6,000', status: 'Completed' }
    ];
    
    const container = document.getElementById('maintenance-container');
    container.innerHTML = `
        <div class="maintenance-table">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Vehicle</th>
                        <th>Service Type</th>
                        <th>Cost</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.map(log => `
                        <tr>
                            <td>${log.date}</td>
                            <td>${log.vehicle}</td>
                            <td>${log.type}</td>
                            <td>${log.cost}</td>
                            <td style="color: #4ade80;">${log.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Load profile section
function loadProfileSection(user) {
    const container = document.getElementById('profile-info');
    container.innerHTML = `
        <div class="profile-item">
            <strong>Full Name:</strong>
            <span>${user.name}</span>
        </div>
        <div class="profile-item">
            <strong>Roll Number:</strong>
            <span>${user.rollNo}</span>
        </div>
        <div class="profile-item">
            <strong>Email:</strong>
            <span>${user.email}</span>
        </div>
        <div class="profile-item">
            <strong>Department:</strong>
            <span>${user.department}</span>
        </div>
        <div class="profile-item">
            <strong>Year:</strong>
            <span>${user.year}${getOrdinal(user.year)} Year</span>
        </div>
        <div class="profile-item">
            <strong>Assigned Route:</strong>
            <span>${user.route || 'Not Assigned'}</span>
        </div>
        <div class="profile-item">
            <strong>Bus Number:</strong>
            <span>${user.busNumber || 'Not Assigned'}</span>
        </div>
        <div class="profile-item">
            <strong>Distance (one-way):</strong>
            <span>${user.distanceKm ? user.distanceKm + ' km' : '—'}</span>
        </div>
        <div class="profile-item">
            <strong>Destination:</strong>
            <span>${user.destination || 'Not Assigned'}</span>
        </div>
        <div class="profile-item">
            <strong>Registered Date:</strong>
            <span>${new Date(user.registeredDate).toLocaleDateString()}</span>
        </div>
    `;
}

// Helper function for ordinal numbers
function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Attendance logic
function loadAttendance(user){
    const table = document.getElementById('attendance-table');
    const summary = document.getElementById('attendance-summary');
    if (!table || !summary) return;
    const records = user.attendance || [];
    const presentDays = records.filter(r => r.present).length;
    const absentDays = records.filter(r => !r.present).length;
    const total = records.length;
    const rate = total ? Math.round((presentDays/total)*100) : 0;
    
    summary.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:15px; padding:20px; background:#f8f9fa; border-radius:10px;">
            <div style="text-align:center;">
                <div style="font-size:32px; font-weight:bold; color:#16a34a;">${presentDays}</div>
                <div style="color:#666; font-size:14px;">Days Present</div>
            </div>
            <div style="text-align:center;">
                <div style="font-size:32px; font-weight:bold; color:#dc2626;">${absentDays}</div>
                <div style="color:#666; font-size:14px;">Days Absent</div>
            </div>
            <div style="text-align:center;">
                <div style="font-size:32px; font-weight:bold; color:#667eea;">${total}</div>
                <div style="color:#666; font-size:14px;">Total Days</div>
            </div>
            <div style="text-align:center;">
                <div style="font-size:32px; font-weight:bold; color:#f59e0b;">${rate}%</div>
                <div style="color:#666; font-size:14px;">Attendance Rate</div>
            </div>
        </div>
    `;
    
    if (records.length === 0) {
        table.innerHTML = '<tr><td colspan="2" style="text-align:center; color:#999;">No attendance records yet</td></tr>';
    } else {
        table.innerHTML = records.slice().reverse().map(r=>`<tr><td>${new Date(r.date).toLocaleDateString()}</td><td>${r.present?'<span style="color:#16a34a; font-weight:600;">✓ Present in Bus</span>':'<span style="color:#dc2626; font-weight:600;">✗ Absent from Bus</span>'}</td></tr>`).join('');
    }
}

// markAttendance function removed - attendance is now read-only

// Payments
function renderPayments(user){
    const dueDiv = document.getElementById('payment-due');
    const txDiv = document.getElementById('transactions');
    if(!dueDiv || !txDiv) return;
    const due = (user.payments && user.payments.due) || 0;
    dueDiv.innerHTML = `<strong>Amount Due:</strong> <span style="color:${due>0?'#dc2626':'#16a34a'}; font-size:18px;">₹${due}</span>`;
    const txns = (user.payments && user.payments.transactions) || [];
    txDiv.innerHTML = txns.length? txns.slice().reverse().map(t=>`<div class="breakdown-item"><span>${new Date(t.date).toLocaleString()} • ${t.method}</span><span>${t.status==='success'?'✅':'❌'} ₹${t.amount}</span></div>`).join('') : '<p>No transactions yet.</p>';
}

function makePayment(){
    const user = checkAuth();
    if(!user) return;
    const method = document.getElementById('pay-method').value;
    const amount = user.payments.due || 0;
    if (amount <= 0){ alert('No dues to pay.'); return; }
    const txn = { id: 'TXN-'+Date.now(), amount, method, date: new Date().toISOString(), status: 'success' };
    user.payments.transactions = user.payments.transactions || [];
    user.payments.transactions.push(txn);
    user.payments.due = 0;
    addNotification(user, { type:'success', title:'Payment Successful', message:`Payment of ₹${amount} received. Bus pass activated.`, read:false });
    updateUser(user);
    updateOverviewStats(user);
    renderPayments(user);
}

// Notifications
function addNotification(user, {type,title,message,read}){
    user.notifications = user.notifications || [];
    user.notifications.push({ id: Date.now(), type, title, message, read: !!read, date: new Date().toISOString() });
}

function renderNotifications(user){
    const list = document.getElementById('notifications-list');
    if(!list) return;
    const items = (user.notifications||[]).slice().reverse();
    list.innerHTML = items.length? items.map(n=>`
        <div class="announcement-card" style="border-left-color:${n.read?'#94a3b8':'#667eea'}">
            <h3>${n.title}</h3>
            <p>${n.message}</p>
            <small>${new Date(n.date).toLocaleString()} • ${n.type}</small>
            ${n.read? '' : `<div style="margin-top:8px;"><button class="btn" style="background:#eef2ff" onclick="markNotificationRead(${n.id})">Mark as read</button></div>`}
        </div>
    `).join('') : '<p>No notifications yet.</p>';
}

function markNotificationRead(id){
    const user = checkAuth();
    if(!user) return;
    const n = (user.notifications||[]).find(x=>x.id===id);
    if(n) n.read = true;
    updateUser(user);
    renderNotifications(user);
}

// Issues
function renderIssues(user){
    const list = document.getElementById('issues-list');
    if(!list) return;
    const items = user.issues||[];
    list.innerHTML = items.length? items.slice().reverse().map(i=>`<div class="breakdown-item"><span>${i.title}</span><span>${new Date(i.date).toLocaleString()}</span></div><p style="margin:6px 0 12px;color:#666;">${i.desc}</p>`).join('') : '<p>No issues reported.</p>';
}

function submitIssue(){
    const user = checkAuth();
    if(!user) return;
    const title = document.getElementById('issue-title').value.trim();
    const desc = document.getElementById('issue-desc').value.trim();
    if(!title){ alert('Please provide an issue title'); return; }
    user.issues = user.issues || [];
    user.issues.push({ id: Date.now(), title, desc, date: new Date().toISOString(), status:'submitted' });
    addNotification(user,{ type:'info', title:'Issue Submitted', message:'Thank you. Transport team will review your issue.', read:false });
    updateUser(user);
    document.getElementById('issue-title').value = '';
    document.getElementById('issue-desc').value = '';
    renderIssues(user);
    renderNotifications(user);
}

// Persist user back to localStorage and currentUser
function updateUser(user){
    const users = JSON.parse(localStorage.getItem('busSystemUsers')) || [];
    const idx = users.findIndex(u=>u.rollNo===user.rollNo);
    if(idx>=0) users[idx]=user; else users.push(user);
    localStorage.setItem('busSystemUsers', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});
