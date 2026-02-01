const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ohgnjyeqdqahhxewhgwi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZ25qeWVxZHFhaGh4ZXdoZ3dpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY2ODk4NiwiZXhwIjoyMDc5MjQ0OTg2fQ.zUotMmOwENVNk4Wyu_PE2UsQ7e4vbsVuBKuaL8c7x5I';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupMissionControl() {
  console.log('🚀 Setting up Mission Control...\n');
  
  // 1. Insert initial agents
  console.log('1️⃣ Creating agents...');
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
    console.log('⚠️  Agents table might not exist yet. Run SQL first.');
    console.log('Error:', agentsError.message);
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
  
  const { data: taskData, error: tasksError } = await supabase
    .from('tasks')
    .upsert(tasks, { onConflict: 'title' })
    .select();
  
  if (tasksError) {
    console.log('⚠️  Tasks table might not exist yet. Run SQL first.');
    console.log('Error:', tasksError.message);
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
    console.log('⚠️  Activities table might not exist yet.');
  } else {
    console.log('✅ Activities added');
  }
  
  console.log('\n🎉 Mission Control setup complete!');
  console.log('\n📊 Dashboard: https://app.supabase.com/project/ohgnjyeqdqahhxewhgwi');
}

setupMissionControl().catch(console.error);