const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Initialize Supabase client
const supabaseUrl = '***REMOVED***';  // Your Supabase URL
const supabaseKey = '***REMOVED***';  // Your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Predefined admin credentials
const adminCredentials = {
    username: 'admin_user',  // Replace with the actual username
    password: 'adminPassword123!'  // Replace with the actual password
};

// Function to hash the password and insert into Supabase
async function insertAdminCredentials() {
    const { username, password } = adminCredentials;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 rounds of hashing
    
    // Insert into Supabase
    const { data, error } = await supabase
        .from('admins')  // Make sure this table exists in your Supabase DB
        .insert([
            {
                username: username,
                password_hash: hashedPassword
            }
        ]);

    if (error) {
        console.error('Error inserting admin:', error);
    } else {
        console.log('Admin inserted:', data);
    }
}

// Run the function to insert the admin credentials
insertAdminCredentials();
