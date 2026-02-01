#!/usr/bin/env node
/**
 * Daily Standup Generator
 * Run this every morning at 7 AM Sydney Time
 * Usage: node daily-standup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AGENTS = ['jarvis', 'shuri', 'friday', 'loki', 'wong'];
const WORKSPACE = '/Users/amosthiosa/.openclaw/workspace';
const AGENTS_DIR = path.join(WORKSPACE, 'agents');

// Get yesterday's date
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const dateStr = yesterday.toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});
const dateFile = yesterday.toISOString().split('T')[0];

function readWorkingMd(agent) {
  const filePath = path.join(AGENTS_DIR, agent, 'memory', 'WORKING.md');
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

function readDailyNotes() {
  const filePath = path.join(AGENTS_DIR, 'shared', 'memory', `${dateFile}.md`);
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

function readMemory() {
  const filePath = path.join(AGENTS_DIR, 'shared', 'MEMORY.md');
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

function parseStatus(workingMd) {
  if (!workingMd) return { status: 'unknown', task: 'No data' };
  
  const lines = workingMd.split('\n');
  let task = 'No active task';
  let status = 'idle';
  
  for (const line of lines) {
    if (line.includes('## Current Task')) {
      const nextLine = lines[lines.indexOf(line) + 1];
      if (nextLine && !nextLine.startsWith('#')) {
        task = nextLine.trim();
      }
    }
    if (line.includes('## Status')) {
      if (line.includes('✅') || line.includes('COMPLETE')) status = 'completed';
      else if (line.includes('🔄') || line.includes('IN PROGRESS')) status = 'in_progress';
      else if (line.includes('🚫') || line.includes('BLOCK')) status = 'blocked';
      else if (line.includes('⏳') || line.includes('IDLE')) status = 'idle';
    }
  }
  
  return { status, task };
}

function compileStandup() {
  let completed = [];
  let inProgress = [];
  let blocked = [];
  let idle = [];
  
  // Check each agent
  for (const agent of AGENTS) {
    const working = readWorkingMd(agent);
    const { status, task } = parseStatus(working);
    
    const name = agent.charAt(0).toUpperCase() + agent.slice(1);
    
    switch (status) {
      case 'completed':
        completed.push(`${name}: ${task}`);
        break;
      case 'in_progress':
        inProgress.push(`${name}: ${task}`);
        break;
      case 'blocked':
        blocked.push(`${name}: ${task}`);
        break;
      default:
        idle.push(`${name}: ${task}`);
    }
  }
  
  // Read daily notes for additional context
  const dailyNotes = readDailyNotes();
  const memory = readMemory();
  
  // Extract key decisions from memory
  let keyDecisions = [];
  if (memory) {
    const decisionMatch = memory.match(/## Key Decisions([\s\S]*?)(?=##|$)/);
    if (decisionMatch) {
      const lines = decisionMatch[1].split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('**'));
      keyDecisions = lines.slice(0, 3).map(l => l.replace(/^[-*]\s*/, '').trim());
    }
  }
  
  // Compile standup
  let standup = `📊 DAILY STANDUP — ${dateStr}\n`;
  
  // Completed
  standup += '\n✅ COMPLETED YESTERDAY\n';
  if (completed.length > 0) {
    completed.forEach(item => standup += `• ${item}\n`);
  } else {
    standup += '• No completed tasks recorded\n';
  }
  
  // In Progress
  standup += '\n🔄 IN PROGRESS\n';
  if (inProgress.length > 0) {
    inProgress.forEach(item => standup += `• ${item}\n`);
  } else {
    standup += '• No active tasks\n';
  }
  
  // Blocked
  if (blocked.length > 0) {
    standup += '\n🚫 BLOCKED\n';
    blocked.forEach(item => standup += `• ${item}\n`);
  }
  
  // Needs Review (idle agents with completed work)
  if (idle.length > 0) {
    standup += '\n👀 IDLE / AVAILABLE\n';
    idle.forEach(item => standup += `• ${item}\n`);
  }
  
  // Key Decisions
  if (keyDecisions.length > 0) {
    standup += '\n📝 KEY DECISIONS\n';
    keyDecisions.forEach(decision => {
      if (decision) standup += `• ${decision}\n`;
    });
  }
  
  // Today's Priorities (based on WORKING.md next steps)
  standup += '\n📅 TODAY\n';
  standup += '• [ ] Check agent inboxes for new assignments\n';
  standup += '• [ ] Update Mission Control status\n';
  if (inProgress.length > 0) {
    standup += `• [ ] Follow up on ${inProgress.length} in-progress tasks\n`;
  }
  
  standup += '\n---\n💡 **Note:** Check `agents/shared/MESSAGE_BUS.md` for communication protocols.';
  
  return standup;
}

function sendToTelegram(message) {
  // This would integrate with OpenClaw's message system
  // For now, we save to a file and log
  const outputPath = path.join(AGENTS_DIR, 'jarvis', 'memory', 'last-standup.md');
  fs.writeFileSync(outputPath, message);
  
  console.log('📊 Daily Standup Generated');
  console.log('==========================\n');
  console.log(message);
  console.log('\n==========================');
  console.log(`\n✅ Saved to: ${outputPath}`);
  console.log('📱 Ready to send to Telegram (@amsaxx)');
  
  // In production, this would call the Telegram API
  // For now, we output to console and file
}

// Main execution
console.log('🌅 Generating Daily Standup...\n');
const standup = compileStandup();
sendToTelegram(standup);