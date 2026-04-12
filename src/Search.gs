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
    
    try {
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());
      
      if (data.items && data.items.length > 0) {
        return data.items[0].link;
      }
    } catch (e) {
      console.error(`Discovery failed for ${query}: ${e.message}`);
    }
    return null;
  },

  /**
   * Deep Discovery function to find a comprehensive list of companies
   */
  discoverNewBusinesses: function() {
    const towns = CONFIG.TOWNS;
    const sheet = getOrCreateSheet();
    const existingNames = sheet.getDataRange().getValues().map(row => row[0].toString().toLowerCase());
    const apiKey = PropertiesService.getScriptProperties().getProperty('GOOGLE_SEARCH_KEY');
    const cx = PropertiesService.getScriptProperties().getProperty('GOOGLE_SEARCH_CX');
    
    if (!apiKey || !cx) return;

    const queryTemplates = [
      "Major employers in [TOWN] MA",
      "List of companies in [TOWN] MA",
      "Industrial parks and businesses in [TOWN] MA",
      "Chamber of commerce members in [TOWN] MA"
    ];
    
    towns.forEach(town => {
      queryTemplates.forEach(template => {
        const query = template.replace("[TOWN]", town);
        // Scan first 2 pages of Google (20 results)
        [1, 11].forEach(start => {
          const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&start=${start}`;
          
          try {
            const response = UrlFetchApp.fetch(url);
            const data = JSON.parse(response.getContentText());
            
            if (data.items) {
              const combinedSnippets = data.items.map(item => item.snippet).join("\n");
              const discovered = this.extractCompaniesWithAI(combinedSnippets, town);
              
              discovered.forEach(company => {
                const name = company.name ? company.name.toString().trim() : "";
                if (name && !existingNames.includes(name.toLowerCase())) {
                  sheet.appendRow([name, town, company.industry || "Discovered", company.career_link || "", "", "", ""]);
                  existingNames.push(name.toLowerCase());
                }
              });
            }
          } catch (e) {
            console.error(`Deep Discovery failed for ${query}: ${e.message}`);
          }
        });
      });
    });
  },

  /**
   * Exhaustive Gemini Extraction
   */
  extractCompaniesWithAI: function(text, town) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) return [];
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `
      EXTRACT EVERY COMPANY: Scan the following search snippets for ANY business or employer located in ${town}, MA.
      Be exhaustive. Include small businesses, tech firms, manufacturing, and municipal entities.
      Return ONLY a JSON array: [{"name": "Exact Company Name", "industry": "Industry Type", "career_link": "URL if findable"}]
      
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
      return [];
    }
  }
};
