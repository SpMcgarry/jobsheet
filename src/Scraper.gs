/**
 * Scraper Module (Six Sigma Revision)
 * Focuses on reliable job extraction using a "Search-First" approach.
 */

var Scraper = {
  
  /**
   * Main entry point for getting the latest job
   */
  getLatestJob: function(company, town, careerUrl) {
    console.log(`Getting latest job for ${company}...`);
    
    // 1. Try Google Search Snippets (Latest 2 days)
    const query = `${company} jobs ${town}`;
    const searchResults = Search.getGoogleSearchResults(query, "d2");
    
    if (searchResults && searchResults.length > 0) {
      const topSnippet = searchResults.map(item => `${item.title}: ${item.snippet}`).join("\n");
      const job = this.extractJobFromSnippets(topSnippet, company);
      if (job && job.title) return job;
    }
    
    // 2. Fallback: Try scraping the Career Page if we have a URL
    if (careerUrl) {
      return this.scrapeCareerPage(careerUrl);
    }
    
    return null;
  },

  /**
   * Scrapes a career page (Traditional Fallback)
   */
  scrapeCareerPage: function(url) {
    try {
      const response = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }
      });
      
      if (response.getResponseCode() !== 200) return null;
      
      const html = response.getContentText();
      const cleanText = this.cleanHtml(html);
      return this.extractJobFromSnippets(cleanText, "unknown"); // Reusing extraction logic
    } catch (e) {
      console.error(`Scrape failed for ${url}: ${e.message}`);
      return null;
    }
  },

  /**
   * AI Extraction: Unified for snippets or HTML text
   */
  extractJobFromSnippets: function(text, company) {
    const prompt = `
      Identify the MOST RECENT job opening from the following text for the company "${company}".
      Return ONLY a JSON object: {"title": "Job Title", "date": "Relative or absolute date", "link": "Direct link if any"}
      If no clear job is found, return {"title": null}.
      
      TEXT:
      ${text}
    `;
    return Search.callAI(prompt);
  },
  
  /**
   * Cleans HTML to reduce token usage
   */
  cleanHtml: function(html) {
    return html
      .replace(/<script.*?>.*?<\/script>/gi, '')
      .replace(/<style.*?>.*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .substring(0, 15000); 
  }
};
