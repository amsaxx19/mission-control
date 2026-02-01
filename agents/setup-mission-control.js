const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.mission-control' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please create .env.mission-control with:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=...');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=...');
  console.error('\nSee SETUP_NEW_PROJECT.md for instructions');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupMissionControl() {
  console.log('🚀 Setting up Mission Control...\n');
  console.log('Project:', supabaseUrl);
  
  // 1. Insert initial agents
  console.log('\n1️⃣ Creating agents...');
  const agents = [
    { name: 'Jarvis', role: 'Squad Lead', status: 'active', session_key: 'agent:main:main' },
    { name: 'Shuri', role: 'Product Analyst', status: 'idle', session_key: 'agent:product-analyst:main' },
    { name: 'Friday', role: 'Developer', status: 'active', session_key: 'agent:developer:main' },
    { name: 'Loki', role: 'Content Writer', status: 'idle', session_key: 'agent:content-writer:main' },
    { name: 'Wong', role: 'Documentation', status: 'active', session_key: 'agent:notion-agent:main' }
  ];
  
  const { error: agentsError } = await supabase
    .from('agents')
    .upsert(agents, { onConflict: 'session_key' });
  
  if (agentsError) {
    console.log('⚠️  Error:', agentsError.message);
    console.log('\nMake sure you ran the SQL schema first!');
    console.log('See SETUP_NEW_PROJECT.md');
    return;
  }
  console.log('✅ Agents created');
  
  // 2. Insert initial tasks
  console.log('\n2️⃣ Creating tasks...');
  const tasks = [
    { 
      title: 'Setup Multi-Agent System', 
      description: 'Create 5-agent system with Mission Control', 
      status: 'in_progress',
      priority: 'high'
    },
    { 
      title: 'Morning Briefing Automation', 
      description: 'Automate daily AI news briefing using Brave Search API', 
      status: 'inbox',
      priority: 'high'
    },
    { 
      title: 'TikTok Affiliate SOPs', 
      description: 'Create standard operating procedures for Adek', 
      status: 'inbox',
      priority: 'medium'
    }
  ];
  
  const { error: tasksError } = await supabase
    .from('tasks')
    .upsert(tasks, { onConflict: 'title' });
  
  if (tasksError) {
    console.log('⚠️  Error:', tasksError.message);
    return;
  }
  console.log('✅ Tasks created');
  
  // 3. Add activities
  console.log('\n3️⃣ Adding activities...');
  const activities = [
    { type: 'task_created', message: 'Multi-Agent System setup started by Jarvis' },
    { type: 'document_created', message: 'Email system deployed by Friday' },
    { type: 'document_created', message: '2nd Brain created by Wong and Friday' }
  ];
  
  const { error: activitiesError } = await supabase
    .from('activities')
    .insert(activities);
  
  if (activitiesError) {
    console.log('⚠️  Error:', activitiesError.message);
  } else {
    console.log('✅ Activities added');
  }
  
  console.log('\n🎉 Mission Control setup complete!');
  console.log('\n📊 Dashboard:', supabaseUrl.replace('.co', '.co/project'));
}

setupMissionControl().catch(console.error);