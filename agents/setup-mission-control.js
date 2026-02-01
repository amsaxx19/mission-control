const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.mission-control' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function setupMissionControl() {
  console.log('🚀 Setting up Mission Control...\n');
  
  // 1. Check agents
  console.log('1️⃣ Checking agents...');
  const { data: agents, error: agentsError } = await supabase
    .from('agents')
    .select('*');
  
  if (agentsError) {
    console.log('❌ Error:', agentsError.message);
    return;
  }
  console.log(`✅ ${agents.length} agents found`);
  
  // 2. Insert tasks (without upsert)
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
  
  // Check if tasks exist first
  const { data: existingTasks } = await supabase
    .from('tasks')
    .select('title');
  
  const existingTitles = existingTasks?.map(t => t.title) || [];
  const newTasks = tasks.filter(t => !existingTitles.includes(t.title));
  
  if (newTasks.length > 0) {
    const { error: tasksError } = await supabase
      .from('tasks')
      .insert(newTasks);
    
    if (tasksError) {
      console.log('⚠️  Error:', tasksError.message);
    } else {
      console.log(`✅ ${newTasks.length} tasks created`);
    }
  } else {
    console.log('✅ Tasks already exist');
  }
  
  // 3. Add activities
  console.log('\n3️⃣ Adding activities...');
  const { count } = await supabase
    .from('activities')
    .select('*', { count: 'exact', head: true });
  
  if (count === 0) {
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
  } else {
    console.log('✅ Activities already exist');
  }
  
  console.log('\n🎉 Mission Control setup complete!');
  console.log('\n📊 Dashboard: https://app.supabase.com/project/ihdbwzuslgtepalvjwxz');
}

setupMissionControl().catch(console.error);