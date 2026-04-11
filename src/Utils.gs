/**
 * UI and Utils
 */

function showSettingsDialog() {
  const html = `
    <html>
      <body style="font-family: sans-serif; padding: 20px;">
        <h3>API Configuration</h3>
        <p>Enter your API keys below to enable AI and Search features.</p>
        <div style="margin-bottom: 10px;">
          <label>Gemini API Key:</label><br>
          <input type="password" id="gemini" style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
          <label>Google Search API Key:</label><br>
          <input type="password" id="search_key" style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
          <label>Google Search CX (Search Engine ID):</label><br>
          <input type="text" id="search_cx" style="width: 100%;">
        </div>
        <button onclick="save()" style="padding: 10px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Settings</button>
        
        <script>
          function save() {
            const keys = {
              gemini: document.getElementById('gemini').value,
              search_key: document.getElementById('search_key').value,
              search_cx: document.getElementById('search_cx').value
            };
            google.script.run.withSuccessHandler(() => {
              google.script.host.close();
            }).saveSettings(keys);
          }
        </script>
      </body>
    </html>
  `;
  const userInterface = HtmlService.createHtmlOutput(html)
    .setWidth(400)
    .setHeight(350)
    .setTitle('Command Center Settings');
  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Settings');
}

function saveSettings(keys) {
  const props = PropertiesService.getScriptProperties();
  if (keys.gemini) props.setProperty('GEMINI_API_KEY', keys.gemini);
  if (keys.search_key) props.setProperty('GOOGLE_SEARCH_KEY', keys.search_key);
  if (keys.search_cx) props.setProperty('GOOGLE_SEARCH_CX', keys.search_cx);
}

/**
 * Trigger to run every morning at 4 AM EST
 */
function createTimeDrivenTriggers() {
  // Delete existing triggers to avoid duplicates
  const allTriggers = ScriptApp.getProjectTriggers();
  allTriggers.forEach(t => {
    if (t.getHandlerFunction() === 'refreshJobs') {
      ScriptApp.deleteTrigger(t);
    }
  });
  
  // Create new trigger for 4 AM
  ScriptApp.newTrigger('refreshJobs')
    .timeBased()
    .everyDays(1)
    .atHour(4)
    .create();
}
