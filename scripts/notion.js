#!/usr/bin/env node
/**
 * Notion Integration Script
 * Push agent deliverables to Notion automatically
 */

const fs = require('fs');
const path = require('path');

// Load token from env file
const envPath = path.join(__dirname, '..', '.env.notion');
const envContent = fs.readFileSync(envPath, 'utf8');
const NOTION_TOKEN = envContent.match(/NOTION_API_TOKEN=(.+)/)?.[1];

if (!NOTION_TOKEN) {
  console.error('❌ Notion token not found');
  process.exit(1);
}

const NOTION_VERSION = '2022-06-28';

async function notionRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, options);
  return response.json();
}

async function getDatabase(databaseId) {
  return notionRequest(`/databases/${databaseId}`);
}

async function createPage(databaseId, title, content, tags = []) {
  const page = {
    parent: { database_id: databaseId },
    properties: {
      title: {
        title: [{ text: { content: title } }]
      },
      Tags: {
        multi_select: tags.map(tag => ({ name: tag }))
      }
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: content } }]
        }
      }
    ]
  };
  
  return notionRequest('/pages', 'POST', page);
}

async function searchPages(query) {
  return notionRequest('/search', 'POST', { query });
}

// CLI usage
const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

async function main() {
  try {
    switch (command) {
      case 'test':
        console.log('🧪 Testing Notion connection...');
        const user = await notionRequest('/users/me');
        console.log('✅ Connected as:', user.name || user.bot?.owner?.user?.name);
        break;
        
      case 'push':
        if (!arg1 || !arg2) {
          console.log('Usage: node notion.js push "Page Title" "path/to/content.md"');
          process.exit(1);
        }
        console.log(`📤 Pushing "${arg1}" to Notion...`);
        const content = fs.readFileSync(arg2, 'utf8');
        // Note: Need database ID from Notion setup
        console.log('✅ Content ready to push (setup database ID first)');
        break;
        
      case 'search':
        console.log(`🔍 Searching for "${arg1}"...`);
        const results = await searchPages(arg1);
        console.log(`Found ${results.results?.length || 0} results`);
        break;
        
      default:
        console.log(`
Notion Integration for Mission Control

Usage:
  node notion.js test                    # Test connection
  node notion.js push "Title" "file.md"  # Push content to Notion
  node notion.js search "query"          # Search pages

Environment:
  Token loaded from: .env.notion
        `);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();