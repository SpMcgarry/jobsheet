/**
 * Scraper Module
 * Responsible for fetching and parsing career pages
 */

var Scraper = {
  
  /**
   * Scrapes a career page and uses AI to extract the latest job
   */
  scrapeCareerPage: function(url) {
    try {
      const response = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      
      if (response.getResponseCode() !== 200) {
        console.warn(`Failed to fetch ${url}: ${response.getResponseCode()}`);
        return null;
      }
      
      const html = response.getContentText();
      const cleanText = this.cleanHtml(html);
      
      return this.extractWithAI(cleanText);
    } catch (e) {
      console.error(`Error scraping ${url}: ${e.message}`);
      return null;
    }
  },
  
  /**
   * Cleans HTML to reduce token usage for AI
   */
  cleanHtml: function(html) {
    // Remove scripts, styles, and extra whitespace
    return html
      .replace(/<script.*?>.*?<\/script>/gi, '')
      .replace(/<style.*?>.*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .substring(0, 10000); // Limit to 10k chars to stay in token limits
  },
  
  /**
   * Calls Gemini API to extract structured job data
   */
  extractWithAI: function(text) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) return null;
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const prompt = `
      Extract the most recent job listing from the following text. 
      Return ONLY a JSON object with this structure:
      {
        "title": "Job Title",
        "date": "Posted Date",
        "link": "Direct Link (if findable)"
      }
      If no job is found, return {"title": null}.
      
      TEXT:
      ${text}
    `;
    
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(apiUrl, options);
    const result = JSON.parse(response.getContentText());
    
    try {
      const jsonRes = result.candidates[0].content.parts[0].text.replace(/ ```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonRes);
    } catch (e) {
      console.error("AI Extraction failed", e);
      return null;
    }
  }
};
