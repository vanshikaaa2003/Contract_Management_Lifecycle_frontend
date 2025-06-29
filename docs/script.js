document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;


    if (username && password && role) {
        // Here you can add further logic to handle the login process
        // For demonstration, we will redirect based on the role
        
        
        
        if (role === 'finance') {
            window.location.href = 'dashboardfinanceteam.html'; // Redirect to admin dashboard
        }
        if (role === 'businessH') {
            window.location.href = 'dashboardbusinesshead.html'; // Redirect to admin dashboard
        }
        if (role === 'businessM') {
            window.location.href = 'dashboardbusinessmember.html'; // Redirect to admin dashboard
        }
    } else {
        alert('Please fill in all fields.');
    }
});
function openModal(type) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const roleGroup = document.getElementById('roleGroup');

    modal.style.display = "block";
    modalTitle.innerText = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    if (type.includes('Member')) {
        roleGroup.style.display = 'none';
    } else {
        roleGroup.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

document.getElementById('modalForm').onsubmit = function(event) {
    event.preventDefault();
    // Handle form submission logic here
    closeModal();
};
function openModal(type) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    modal.style.display = "block";
    modalTitle.innerText = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = "none";
}

document.getElementById('modalForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    // Logic to add the new team member goes here
    alert(`Added ${name} as ${role}`);
    closeModal();
});
document.getElementById('menu-toggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
});

