#!/usr/bin/env node
/**
 * Morning Briefing Automation
 * Runs daily at 7 AM to fetch AI news and send via Telegram
 */

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

if (!BRAVE_API_KEY) {
  console.error('Error: BRAVE_API_KEY environment variable required');
  process.exit(1);
}

// Search queries for AI news
const QUERIES = [
  'AI artificial intelligence news today',
  'OpenAI GPT ChatGPT updates',
  'AI startup funding news',
  'machine learning breakthrough 2025 2026'
];

async function braveSearch(query, count = 5) {
  const url = new URL('https://api.search.brave.com/res/v1/news/search');
  url.searchParams.set('q', query);
  url.searchParams.set('count', count.toString());
  url.searchParams.set('freshness', 'pd'); // Past day
  url.searchParams.set('search_lang', 'en');
  
  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X-Subscription-Token': BRAVE_API_KEY
    }
  });
  
  if (!response.ok) {
    throw new Error(`Brave API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.results || [];
}

async function fetchAINews() {
  const allResults = [];
  
  for (const query of QUERIES) {
    try {
      const results = await braveSearch(query, 3);
      allResults.push(...results);
      // Small delay to be nice to the API
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`Search failed for "${query}":`, err.message);
    }
  }
  
  // Deduplicate by URL
  const seen = new Set();
  return allResults.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function formatBriefing(news) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  let message = `🌅 **Morning AI Briefing**\n`;
  message += `📅 ${dateStr}\n`;
  message += `━━━━━━━━━━━━━━━━━━━\n\n`;
  
  if (news.length === 0) {
    message += `No new AI news today. Enjoy the quiet! 🤖✨`;
    return message;
  }
  
  // Take top 5 unique stories
  const topStories = news.slice(0, 5);
  
  topStories.forEach((story, i) => {
    const title = story.title?.replace(/\*/g, '').trim() || 'Untitled';
    const source = story.meta?.url?.hostname?.replace('www.', '') || 'Unknown';
    const description = story.description?.replace(/\*/g, '').trim() || '';
    
    message += `**${i + 1}.** ${title}\n`;
    message += `   📰 ${source}\n`;
    if (description) {
      const shortDesc = description.length > 100 
        ? description.slice(0, 100) + '...' 
        : description;
      message += `   💡 ${shortDesc}\n`;
    }
    message += `\n`;
  });
  
  message += `━━━━━━━━━━━━━━━━━━━\n`;
  message += `_Powered by Brave Search | Friday 🤖_`;
  
  return message;
}

async function sendToTelegram(message) {
  // Use OpenClaw's message tool via a simple approach
  // We'll write to a file that can be picked up
  const briefingPath = '/Users/amosthiosa/.openclaw/workspace/agents/friday/output/morning-briefing.txt';
  
  await Bun.write(briefingPath, message);
  console.log(`Briefing saved to: ${briefingPath}`);
  
  // Also log it
  console.log('\n=== BRIEFING PREVIEW ===\n');
  console.log(message);
  console.log('\n========================\n');
}

async function main() {
  console.log('🔍 Fetching AI news...');
  
  try {
    const news = await fetchAINews();
    console.log(`Found ${news.length} unique stories`);
    
    const briefing = formatBriefing(news);
    await sendToTelegram(briefing);
    
    // Update WORKING.md with completion
    console.log('✅ Morning briefing generated');
    
  } catch (err) {
    console.error('Failed to generate briefing:', err);
    process.exit(1);
  }
}

main();
