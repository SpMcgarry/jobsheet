/**
 * Main Entry Point for Regional Career Command Center
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Career Command')
    .addItem('1. Initial Setup (Seed Businesses)', 'setupSheet')
    .addSeparator()
    .addItem('2. Daily Refresh (Scrape Jobs)', 'manualRefresh')
    .addSeparator()
    .addItem('⚙️ Setup / Update API Keys', 'showSettingsDialog')
    .addToUi();
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
  const headers = data.shift(); // Remove headers
  
  data.forEach((row, index) => {
    const businessName = row[0];
    const town = row[1];
    const careerUrl = row[3];
    
    if (!businessName) return;
    
    // 1. Try Scraper with Career URL
    let jobDetail = null;
    if (careerUrl) {
      jobDetail = Scraper.scrapeCareerPage(careerUrl);
    }
    
    // 2. Fallback to Google Search if needed
    if (!jobDetail || !jobDetail.title) {
      jobDetail = Search.fallbackSearchJobs(businessName, town);
    }
    
    // 3. Update the row if new data found
    if (jobDetail && jobDetail.title) {
      updateRow(sheet, index + 2, jobDetail); // index + 2 because of 1-indexing and header
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
