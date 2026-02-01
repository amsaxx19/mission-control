const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.mission-control' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing connection to:', supabaseUrl);
console.log('Key starts with:', supabaseServiceKey?.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  try {
    // Test 1: Check if we can query
    const { data, error } = await supabase.from('agents').select('*').limit(1);
    
    if (error) {
      console.log('\n❌ Connection error:', error.message);
      console.log('\nPossible issues:');
      console.log('1. Project not fully initialized (wait 1-2 minutes after creation)');
      console.log('2. SQL schema not run yet');
      console.log('3. Wrong API key');
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log('Agents found:', data.length);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testConnection();