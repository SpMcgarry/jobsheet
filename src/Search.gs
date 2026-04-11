/**
 * Search Module
 * Responsible for finding career pages and fallback job searching
 */

const Search = {
  
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
  }
};
