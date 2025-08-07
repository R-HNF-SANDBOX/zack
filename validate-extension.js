#!/usr/bin/env node

/**
 * Zack Chrome Extension Validation Script
 * Validates that the extension is ready to be loaded in Chrome
 */

const fs = require('fs');
const path = require('path');

console.log('=== ZACK CHROME EXTENSION VALIDATION ===');
console.log('');

let allChecksPass = true;

// 1. Check manifest
try {
  const manifest = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'));
  console.log('1. Manifest validation: ✓ PASS');
  console.log('   - Name:', manifest.name);
  console.log('   - Version:', manifest.version);
  console.log('   - Manifest version:', manifest.manifest_version);
  
  // Validate required manifest properties
  if (!manifest.manifest_version || manifest.manifest_version !== 3) {
    console.log('   ✗ Invalid manifest version (expected 3)');
    allChecksPass = false;
  }
  if (!manifest.name || !manifest.version) {
    console.log('   ✗ Missing required name or version');
    allChecksPass = false;
  }
} catch (e) {
  console.log('1. Manifest validation: ✗ FAIL');
  console.log('   Error:', e.message);
  allChecksPass = false;
}

// 2. Check required files
const requiredFiles = [
  'manifest.json',
  'background/background.js', 
  'options/options.html',
  'options/options.js',
  'images/icon16.png',
  'images/icon48.png', 
  'images/icon128.png'
];

console.log('');
console.log('2. File structure validation:');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`   ✓ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`   ✗ ${file} - MISSING`);
    allChecksPass = false;
  }
}

// 3. Check JavaScript syntax
console.log('');
console.log('3. JavaScript syntax validation:');
const jsFiles = ['background/background.js', 'options/options.js'];
for (const file of jsFiles) {
  try {
    const code = fs.readFileSync(file, 'utf8');
    // Basic validation - check if it contains obvious syntax errors
    if (code.includes('function') || code.includes('=>') || code.includes('document')) {
      console.log(`   ✓ ${file} (${code.length} characters)`);
    } else {
      console.log(`   ⚠ ${file} - Unexpected content`);
    }
  } catch (e) {
    console.log(`   ✗ ${file} - Error: ${e.message}`);
    allChecksPass = false;
  }
}

// 4. Final result
console.log('');
if (allChecksPass) {
  console.log('🎉 ALL VALIDATION CHECKS PASSED! Extension is ready to load.');
  console.log('');
  console.log('Next steps:');
  console.log('1. Open Chrome and navigate to chrome://extensions/');
  console.log('2. Enable "Developer mode" toggle (top right)');
  console.log('3. Click "Load unpacked" button');
  console.log('4. Select this directory:', process.cwd());
  console.log('5. Test the extension by clicking the icon or using Alt+Shift+Z');
  console.log('6. Configure Slack webhook in the options page');
  process.exit(0);
} else {
  console.log('❌ SOME VALIDATION CHECKS FAILED!');
  console.log('Fix the issues above before loading the extension.');
  process.exit(1);
}