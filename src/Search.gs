/**
 * Search Module
 * Responsible for finding career pages and fallback job searching
 */

var Search = {
  
  /**
   * Fallback using Google Search API to find job snippets
   */
  fallbackSearchJobs: function(businessName, town) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GOOGLE_SEARCH_KEY');
    const cx = PropertiesService.getScriptProperties().getProperty('GOOGLE_SEARCH_CX');
    
    if (!apiKey || !cx) return null;
    
    // Search query: "{Company} jobs {Town}" restricted to the last 2 days
    const query = `${businessName} jobs ${town}`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&dateRestrict=d2`;
    
    try {
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());
      
      if (data.items && data.items.length > 0) {
        const item = data.items[0]; // Take the first result
        return {
          title: item.title,
          date: new Date().toLocaleDateString(), // Today, since we restricted search to last 2 days
          link: item.link
        };
      }
    } catch (e) {
      console.error(`Search failed for ${query}: ${e.message}`);
    }
    return null;
  },
  
  /**
   * Discovery function to find a company's career page
   */
  findCareerPage: function(businessName, town) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GOOGLE_SEARCH_KEY');
    const cx = PropertiesService.getScriptProperties().getProperty('GOOGLE_SEARCH_CX');
    
    if (!apiKey || !cx) return null;
    
    const query = `${businessName} ${town} career page`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
    
  /**
   * Discovery function to find new companies in target towns
   */
  discoverNewBusinesses: function() {
    const towns = CONFIG.TOWNS;
    const sheet = getOrCreateSheet();
    const existingNames = sheet.getDataRange().getValues().map(row => row[0].toString().toLowerCase());
    
    towns.forEach(town => {
      const apiKey = PropertiesService.getScriptProperties().getProperty('GOOGLE_SEARCH_KEY');
      const cx = PropertiesService.getScriptProperties().getProperty('GOOGLE_SEARCH_CX');
      if (!apiKey || !cx) return;

      const query = `List of major employers and companies in ${town} MA`;
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
      
      try {
        const response = UrlFetchApp.fetch(url);
        const data = JSON.parse(response.getContentText());
        
        if (data.items) {
          const combinedSnippets = data.items.map(item => item.snippet).join("\n");
          const discovered = this.extractCompaniesWithAI(combinedSnippets, town);
          
          discovered.forEach(company => {
            if (company.name && !existingNames.includes(company.name.toLowerCase())) {
              sheet.appendRow([company.name, town, company.industry || "Discovered", company.career_link || "", "", "", ""]);
              existingNames.push(company.name.toLowerCase());
            }
          });
        }
      } catch (e) {
        console.error(`Discovery failed for ${town}: ${e.message}`);
      }
    });
  },

  /**
   * Uses Gemini to parse search snippets into a list of companies
   */
  extractCompaniesWithAI: function(text, town) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) return [];
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `
      Extract a list of distinct companies/employers located in ${town}, MA from the following search snippets.
      Return ONLY a JSON array of objects:
      [{"name": "Company Name", "industry": "Industry Type", "career_link": "URL to career page if mentioned"}]
      
      TEXT:
      ${text}
    `;
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      muteHttpExceptions: true
    };
    
    try {
      const response = UrlFetchApp.fetch(apiUrl, options);
      const result = JSON.parse(response.getContentText());
      const jsonStr = result.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("AI Discovery extraction failed", e);
      return [];
    }
  }
};
