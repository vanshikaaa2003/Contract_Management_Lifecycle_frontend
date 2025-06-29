import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Role-based redirection map
const roleRedirects = {
    byteadmin: 'dashboardbytewiseadmin.html',
    admin: 'dashboardadmin.html',
    legal: 'dashboardlegal.html',
    businessH: 'dashboardbusinesshead.html',
    businessM: 'dashboardbusinessmember.html',
    finance: 'dashboardfinance.html'
};

// Wait for the DOM to load completely
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault(); // Prevent default form submission

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            console.log('Form submitted! Username:', username, 'Role:', role);

            try {
                // Fetch user data from Supabase
                const { data, error } = await supabase
                    .from('admins')
                    .select('*')
                    .eq('username', username)
                    .single(); // Expect a single matching record

                if (error) {
                    console.error('Supabase query error:', error.message);
                    alert('Login failed: ' + error.message);
                    return;
                }

                if (!data) {
                    console.warn('No user found with username:', username);
                    alert('Incorrect Username or Password');
                    return;
                }

                // Log the user data for debugging purposes
                console.log('Fetched user data:', data);

                // Check if the provided password matches the stored password (plaintext comparison)
                if (password !== data.password) {
                    console.error('Password mismatch for username:', username);
                    alert('Incorrect Username or Password');
                    return;
                }

                // Successful login
                alert('Login successful!');
                console.log('Login successful for:', username, 'with role:', role);

                // Redirect based on role
                const redirectUrl = roleRedirects[role] || 'dashboard.html'; // Fallback to a default dashboard
                console.log('Redirecting to:', redirectUrl);
                window.location.href = redirectUrl;

            } catch (err) {
                console.error('Unexpected error during login:', err);
                alert('An unexpected error occurred. Please try again.');
            }
        });
    } else {
        console.error('Login form not found in the DOM');
    }
});
