/**
 * Regional Career Command Center (Six Sigma Revision)
 * Main logic for automation and UI.
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Career Command')
    .addItem('1. Initial Setup', 'setupSheet')
    .addSeparator()
    .addItem('2. Discover New Companies (Lean)', 'runDiscovery')
    .addItem('3. Refresh All Jobs', 'manualRefresh')
    .addSeparator()
    .addItem('⚙️ API Settings', 'showSettingsDialog')
    .addToUi();
}

/**
 * Step 1: Initialize the sheet with headers and seed data
 */
function setupSheet() {
  const sheet = getOrCreateSheet();
  sheet.clear();
  sheet.appendRow(CONFIG.HEADERS);
  
  // Format Headers
  const range = sheet.getRange(1, 1, 1, CONFIG.HEADERS.length);
  range.setBackground("#1a73e8")
       .setFontColor("#ffffff")
       .setFontWeight("bold");
  sheet.setFrozenRows(1);
  
  // Seed initial data
  SEED_DATA.forEach(item => {
    const enriched = Search.enrichCompanyInfo(item.name, item.town);
    sheet.appendRow([
      item.name, 
      item.town, 
      item.industry || enriched.industry || "Target", 
      enriched.website || "", 
      enriched.career_url || "", 
      "", "", "", new Date().toLocaleDateString()
    ]);
  });
  
  SpreadsheetApp.getUi().alert("Sheet Setup Complete! Click 'Discover' to find more local businesses.");
}

/**
 * Step 2: Discovery
 */
function runDiscovery() {
  const ui = SpreadsheetApp.getUi();
  ui.alert("Scouting local Directories and Chambers for businesses. Please wait...");
  try {
    Search.discoverNewBusinesses();
    ui.alert("Discovery cycle complete! Check the sheet for new entries.");
  } catch (e) {
    ui.alert("Discovery error: " + e.message);
  }
}

/**
 * Step 3: Job Refresh
 */
function manualRefresh() {
  const ui = SpreadsheetApp.getUi();
  ui.alert("Refreshing latest jobs for all companies in the dashboard...");
  try {
    refreshJobs();
    ui.alert("Job refresh complete!");
  } catch (e) {
    ui.alert("Refresh error: " + e.message);
    console.error(e);
  }
}

/**
 * Core Logic: Iterate through all rows and find jobs
 */
function refreshJobs() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  data.shift(); // Remove headers
  
  data.forEach((row, index) => {
    const company = row[0];
    const town = row[1];
    const careerUrl = row[4];
    const rowNum = index + 2;
    
    if (!company) return;
    
    // Attempt to get latest job
    const job = Scraper.getLatestJob(company, town, careerUrl);
    
    if (job && job.title) {
      // Update: Latest Job Title, Date Posted, Job Link, Last Checked
      sheet.getRange(rowNum, 6).setValue(job.title);
      sheet.getRange(rowNum, 7).setValue(job.date || "Just now");
      if (job.link) sheet.getRange(rowNum, 8).setValue(job.link);
      sheet.getRange(rowNum, 9).setValue(new Date().toLocaleDateString());
    } else {
      sheet.getRange(rowNum, 9).setValue("No new jobs found");
    }
    
    // Spread out calls to stay under rate limits
    Utilities.sleep(500);
  });
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }
  return sheet;
}
