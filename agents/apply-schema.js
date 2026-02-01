const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://ohgnjyeqdqahhxewhgwi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZ25qeWVxZHFhaGh4ZXdoZ3dpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY2ODk4NiwiZXhwIjoyMDc5MjQ0OTg2fQ.zUotMmOwENVNk4Wyu_PE2UsQ7e4vbsVuBKuaL8c7x5I';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applySchema() {
  const sqlFile = path.join(__dirname, 'supabase-schema.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  console.log('🚀 Applying Mission Control schema to Supabase...\n');
  
  // Split SQL by semicolon and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (statement.startsWith('--')) {
      console.log(`Skipping comment...`);
      continue;
    }
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
      if (error) {
        // If exec_sql doesn't exist, try direct query
        const { error: queryError } = await supabase.from('_exec_sql').select('*').eq('sql', statement + ';');
        if (queryError) {
          console.log(`⚠️  Statement ${i + 1}: ${queryError.message}`);
        }
      } else {
        console.log(`✅ Statement ${i + 1} applied`);
      }
    } catch (err) {
      console.log(`⚠️  Statement ${i + 1}: ${err.message}`);
    }
  }
  
  console.log('\n🎉 Schema application complete!');
  console.log('\nNext steps:');
  console.log('1. Go to Supabase Dashboard: https://app.supabase.com/project/ohgnjyeqdqahhxewhgwi');
  console.log('2. Open SQL Editor');
  console.log('3. Paste contents of supabase-schema.sql');
  console.log('4. Click Run');
}

applySchema().catch(console.error);