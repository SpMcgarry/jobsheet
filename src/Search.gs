/**
 * Search Module (Six Sigma Revision)
 * Focuses on high-yield discovery and reliable job snippet extraction.
 */

var Search = {
  
  /**
   * Discovery: Find a town's business directory and extract companies.
   */
  discoverNewBusinesses: function() {
    const towns = CONFIG.TOWNS;
    const sheet = getOrCreateSheet();
    const existingNames = sheet.getDataRange().getValues().map(row => row[0].toString().toLowerCase());
    
    towns.forEach(town => {
      console.log(`Discovering businesses in ${town}...`);
      
      // Query for the specific town directory or Chamber list
      const query = `${town} MA business directory chamber of commerce members`;
      const searchResults = this.getGoogleSearchResults(query);
      
      if (searchResults && searchResults.length > 0) {
        // We take the first 3 links which are usually the directories
        searchResults.slice(0, 3).forEach(result => {
          try {
            const html = UrlFetchApp.fetch(result.link, { muteHttpExceptions: true }).getContentText();
            const cleanText = Scraper.cleanHtml(html);
            const companies = this.extractCompaniesFromDirectory(cleanText, town);
            
            companies.forEach(company => {
              const name = company.name ? company.name.toString().trim() : "";
              if (name && !existingNames.includes(name.toLowerCase())) {
                const enriched = this.enrichCompanyInfo(name, town);
                // Headers: Company Name, Town, Industry, Website, Career Page URL, Latest Job Title, Date Posted, Job Link, Last Checked
                sheet.appendRow([
                  name, 
                  town, 
                  company.industry || enriched.industry || "Discovered", 
                  enriched.website || "", 
                  enriched.career_url || "", 
                  "", "", "", new Date().toLocaleDateString()
                ]);
                existingNames.push(name.toLowerCase());
              }
            });
          } catch (e) {
            console.error(`Failed to process directory ${result.link}: ${e.message}`);
          }
        });
      }
    });
  },

  /**
   * Uses Google Search API to get raw results
   */
  getGoogleSearchResults: function(query, dateRestrict = "") {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GOOGLE_SEARCH_KEY');
    const cx = PropertiesService.getScriptProperties().getProperty('GOOGLE_SEARCH_CX');
    if (!apiKey || !cx) return [];
    
    let url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
    if (dateRestrict) url += `&dateRestrict=${dateRestrict}`;
    
    try {
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());
      return data.items || [];
    } catch (e) {
      console.error(`Search API Error: ${e.message}`);
      return [];
    }
  },

  /**
   * AI Extraction from Directory HTML
   */
  extractCompaniesFromDirectory: function(text, town) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) return [];
    
    const prompt = `
      EXTRACT BUSINESSES: Scan this text for a list of businesses in ${town}, MA.
      Return ONLY a JSON array of objects: [{"name": "Company Name", "industry": "Industry"}]
      Be exhaustive.
      TEXT:
      ${text}
    `;
    
    return this.callAI(prompt) || [];
  },

  /**
   * Enrich company with Website and Career Page URL
   */
  enrichCompanyInfo: function(name, town) {
    const prompt = `
      Find the official Website and Career Page URL for "${name}" in ${town}, MA.
      Return ONLY a JSON object: {"website": "URL", "career_url": "URL", "industry": "Industry"}
      If you are unsure, provide your best guess based on your knowledge.
    `;
    return this.callAI(prompt) || {};
  },

  /**
   * Helper for Gemini Calls
   */
  callAI: function(prompt) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      muteHttpExceptions: true
    };
    
    try {
      const response = UrlFetchApp.fetch(url, options);
      const result = JSON.parse(response.getContentText());
      const text = result.candidates[0].content.parts[0].text;
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("AI Call failed", e);
      return null;
    }
  }
};
