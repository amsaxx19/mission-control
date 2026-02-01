const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.mission-control' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createTables() {
  console.log('🚀 Creating Mission Control tables...\n');
  
  // Create agents table
  const { error: agentsError } = await supabase.rpc('create_agents_table');
  if (agentsError) {
    console.log('Creating agents table via SQL...');
    const { error } = await supabase.from('agents').select('count');
    if (error && error.code === '42P01') { // Table doesn't exist
      console.log('⚠️  Please run SQL schema in Supabase Dashboard first');
      console.log('   Go to: https://app.supabase.com/project/ihdbwzuslgtepalvjwxz/sql-editor');
      console.log('   Copy paste from: agents/supabase-schema.sql');
      return false;
    }
  }
  
  return true;
}

createTables().then(success => {
  if (success) {
    console.log('\n✅ Tables created successfully!');
  } else {
    console.log('\n❌ Please run SQL schema manually first');
  }
});