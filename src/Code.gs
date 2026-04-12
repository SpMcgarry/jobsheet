/**
 * Main Entry Point for Regional Career Command Center
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Career Command')
    .addItem('1. Initial Setup (Seed Businesses)', 'setupSheet')
    .addSeparator()
    .addItem('2. Daily Refresh (Scrape Jobs)', 'manualRefresh')
    .addItem('3. Scout New Companies (Discovery)', 'runDiscovery')
    .addSeparator()
    .addItem('⚙️ Setup / Update API Keys', 'showSettingsDialog')
    .addToUi();
}

/**
 * Trigger business discovery
 */
function runDiscovery() {
  const ui = SpreadsheetApp.getUi();
  ui.alert('Scouting for new businesses in ' + CONFIG.TOWNS.join(', ') + '. This uses your Search API.');
  try {
    Search.discoverNewBusinesses();
    ui.alert('Discovery Complete! Check the bottom of your sheet for new entries.');
  } catch (e) {
    ui.alert('Error during discovery: ' + e.message);
  }
}

/**
 * Manual trigger for job refresh
 */
function manualRefresh() {
  const ui = SpreadsheetApp.getUi();
  ui.alert('Refresing job listings. This may take a few minutes...');
  try {
    refreshJobs();
    ui.alert('Daily Refresh Complete!');
  } catch (e) {
    ui.alert('Error during refresh: ' + e.message);
    console.error(e);
  }
}

/**
 * Main logic to refresh jobs
 */
function refreshJobs() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  data.shift(); // Remove headers
  
  data.forEach((row, index) => {
    const businessName = row[0];
    const town = row[1];
    let careerUrl = row[3];
    const rowNum = index + 2;
    
    if (!businessName) return;
    
    // 1. Auto-discover Career Page URL if missing
    if (!careerUrl || careerUrl === "") {
      careerUrl = Search.findCareerPage(businessName, town);
      if (careerUrl) {
        sheet.getRange(rowNum, 4).setValue(careerUrl);
      }
    }
    
    // 2. Try Scraper with Career URL
    let jobDetail = null;
    if (careerUrl) {
      jobDetail = Scraper.scrapeCareerPage(careerUrl);
    }
    
    // 3. Fallback to Google Search if scraper failed or was blocked
    if (!jobDetail || !jobDetail.title) {
      jobDetail = Search.fallbackSearchJobs(businessName, town);
    }
    
    // 4. Update the row with findings
    if (jobDetail && jobDetail.title) {
      updateRow(sheet, rowNum, jobDetail);
    }
  });
}

/**
 * Helper to update a row with new job data
 */
function updateRow(sheet, rowNum, jobData) {
  // Columns: [Business Name, Town, Industry, Career Page URL, Latest Job Title, Date Posted, Direct Job Link]
  // Indices: 0, 1, 2, 3, 4, 5, 6
  sheet.getRange(rowNum, 5).setValue(jobData.title);
  sheet.getRange(rowNum, 6).setValue(jobData.date || new Date().toLocaleDateString());
  sheet.getRange(rowNum, 7).setValue(jobData.link);
}

/**
 * Initial sheet setup
 */
function setupSheet() {
  const sheet = getOrCreateSheet();
  sheet.clear();
  sheet.appendRow(CONFIG.HEADERS);
  
  // Apply formatting (Header styling)
  const headerRange = sheet.getRange(1, 1, 1, CONFIG.HEADERS.length);
  headerRange.setBackground("#202124")
             .setFontColor("#FFFFFF")
             .setFontWeight("bold")
             .setHorizontalAlignment("center");
  
  // Freeze Header
  sheet.setFrozenRows(1);
  
  // Seed initial data
  SEED_DATA.forEach(item => {
    sheet.appendRow([item.name, item.town, item.industry, "", "", "", ""]);
  });
  
  SpreadsheetApp.getUi().alert("Sheet Setup Complete! Please add Career Page URLs manually or use the Discovery tool.");
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }
  return sheet;
}
