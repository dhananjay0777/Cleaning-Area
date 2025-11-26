// --- Utilities ---
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.className = "show";
  toast.innerText = message;
  setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

function updateFileLabel(input) {
  const label = document.getElementById('fileLabel');
  if (input.files && input.files[0]) {
    label.style.borderColor = 'var(--primary)';
    label.style.color = 'var(--primary)';
    label.style.background = '#eef2ff';
    label.innerHTML = `<span>✅ ${input.files[0].name} selected</span>`;
  }
}

// --- Navigation ---
function showRegister() {
  document.getElementById('registerBox').classList.remove('hidden');
  document.getElementById('loginBox').classList.add('hidden');
}

function showLogin() {
  document.getElementById('registerBox').classList.add('hidden');
  document.getElementById('loginBox').classList.remove('hidden');
}

function toggleApp(isLoggedIn) {
  if (isLoggedIn) {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('appSection').classList.remove('hidden');
    const user = localStorage.getItem('currentUser');
    
    // Enhance Admin Display
    const displayEl = document.getElementById('userDisplay');
    const reportForm = document.getElementById('reportFormCard');
    const tabAll = document.getElementById('tabAll');
    const tabMy = document.getElementById('tabMy');

    if (user === 'team') {
        displayEl.innerHTML = `Team Admin <span class="admin-badge">✓</span>`;
        // ADMIN cannot submit reports, only verify. Hide form.
        reportForm.classList.add('hidden');
        
        // ADMIN VIEW: Single "All Reports" button
        tabAll.innerText = 'All Reports';
        tabMy.classList.add('hidden');
        showTab('all'); // Force 'all' view since 'my' is hidden
    } else {
        displayEl.innerText = user;
        // Citizens CAN submit reports. Show form.
        reportForm.classList.remove('hidden');
        
        // USER VIEW: Standard Tabs
        tabAll.innerText = 'Community Reports';
        tabMy.classList.remove('hidden');
    }
    
    loadAreas('all');
  } else {
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('appSection').classList.add('hidden');
    showLogin();
  }
}

// --- Auth Logic ---
function registerUser() {
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPass').value;
  if (!email || !pass) { showToast('Please fill all fields'); return; }
  
  let users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email]) { showToast('User already exists'); showLogin(); return; }
  
  users[email] = pass;
  localStorage.setItem('users', JSON.stringify(users));
  showToast('Registration successful! Please login.');
  showLogin();
  // Clear inputs
  document.getElementById('regEmail').value = '';
  document.getElementById('regPass').value = '';
}

function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  
  // SPECIAL TEAM LOGIN CHECK
  if (email === 'team' && pass === 'team') {
    localStorage.setItem('currentUser', 'team');
    toggleApp(true);
    showToast('Welcome, Team Administrator!');
    return;
  }
  
  let users = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (users[email] && users[email] === pass) {
    localStorage.setItem('currentUser', email);
    toggleApp(true);
  } else {
    showToast('Invalid email or password');
  }
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  toggleApp(false);
}

// --- App Logic ---
function submitArea() {
  const name = document.getElementById('areaName').value.trim();
  const loc = document.getElementById('areaLoc').value.trim();
  const picInput = document.getElementById('areaPic');
  const user = localStorage.getItem('currentUser');

  if (!name || !loc || picInput.files.length === 0) {
    showToast('Please complete all report details');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    let areas = JSON.parse(localStorage.getItem('areas') || '[]');
    areas.push({
      id: Date.now(),
      user: user,
      name: name,
      loc: loc,
      img: e.target.result,
      timestamp: Date.now(),
      status: 'pending' // Default status
    });
    localStorage.setItem('areas', JSON.stringify(areas));
    
    // Reset Form
    document.getElementById('areaName').value = '';
    document.getElementById('areaLoc').value = '';
    picInput.value = '';
    document.getElementById('fileLabel').innerHTML = '<span>📷 Click to upload photo evidence</span>';
    document.getElementById('fileLabel').style = ''; 
    
    showToast('Report submitted successfully!');
    
    // Refresh Feed
    const activeTab = document.getElementById('tabMy').classList.contains('active') ? 'my' : 'all';
    loadAreas(activeTab);
  };
  reader.readAsDataURL(picInput.files[0]);
}

function toggleStatus(id, newStatus) {
  let areas = JSON.parse(localStorage.getItem('areas') || '[]');
  const index = areas.findIndex(a => a.id == id);
  if (index > -1) {
    areas[index].status = newStatus;
    localStorage.setItem('areas', JSON.stringify(areas));
    
    let msg = newStatus === 'solved' ? 'Issue verified & resolved! 🎉' : 'Issue re-opened as Pending. ↩';
    showToast(msg);
    
    // Refresh view
    const activeTab = document.getElementById('tabMy').classList.contains('active') ? 'my' : 'all';
    loadAreas(activeTab);
  }
}

function showTab(type) {
  document.getElementById('tabAll').classList.toggle('active', type === 'all');
  document.getElementById('tabMy').classList.toggle('active', type === 'my');
  loadAreas(type);
}

function loadAreas(filter) {
  const feedContainer = document.getElementById('feedContainer');
  const areas = JSON.parse(localStorage.getItem('areas') || '[]');
  const currentUser = localStorage.getItem('currentUser');
  const isAdmin = (currentUser === 'team');
  
  feedContainer.innerHTML = '';

  let filteredAreas = areas;
  if (filter === 'my') {
    filteredAreas = areas.filter(a => a.user === currentUser);
  }

  // Sort by newest first
  filteredAreas.sort((a, b) => b.timestamp - a.timestamp);

  if (filteredAreas.length === 0) {
    feedContainer.innerHTML = `
      <div class="empty-state">
        <h3>No reports found</h3>
        <p>${filter === 'my' ? "You haven't submitted any reports yet." : "No reports in the community yet."}</p>
      </div>`;
    return;
  }

  filteredAreas.forEach(area => {
    const date = new Date(area.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
    
    // Check Status
    const status = area.status || 'pending'; 
    const isSolved = status === 'solved';
    const statusBadge = isSolved 
      ? `<span class="status-badge status-solved">Resolved</span>`
      : `<span class="status-badge status-pending">Pending</span>`;
      
    // Action Button Logic
    let actionBtn = '';
    
    if (isAdmin) {
        // ADMIN MODE: Can Toggle Any Status
        if (isSolved) {
             actionBtn = `<button class="btn-resolve btn-reopen" onclick="toggleStatus(${area.id}, 'pending')">↩ Re-open Issue (Unsolve)</button>`;
        } else {
             actionBtn = `<button class="btn-resolve" onclick="toggleStatus(${area.id}, 'solved')">Solved</button>`;
        }
    } else {
        // REGULAR USER: Can view only, no actions.
        actionBtn = ''; 
    }

    const card = document.createElement('div');
    card.className = 'report-item fade-in';
    card.innerHTML = `
      <img src="${area.img}" class="report-img" alt="${area.name}">
      <div class="report-content">
        <div class="report-meta">
          <span class="report-meta-text">${date} • ${area.user === currentUser ? 'You' : area.user.split('@')[0]}</span>
          ${statusBadge}
        </div>
        <div class="report-title">${area.name}</div>
        <div class="report-loc">📍 ${area.loc}</div>
        ${actionBtn}
      </div>
    `;
    feedContainer.appendChild(card);
  });
}

// --- Init ---
window.onload = function() {
  if (localStorage.getItem('currentUser')) {
    toggleApp(true);
  } else {
    toggleApp(false);
  }
}