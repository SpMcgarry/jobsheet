/**
 * Regional Career Command Center Configuration
 * Six Sigma Revised Version
 */

var CONFIG = {
  TOWNS: ["Westford", "Chelmsford", "Groton", "Acton", "Littleton"],
  SHEET_NAME: "Regional Job Board",
  HEADERS: [
    "Company Name", 
    "Town", 
    "Industry", 
    "Website",
    "Career Page URL", 
    "Latest Job Title", 
    "Date Posted", 
    "Job Link",
    "Last Checked"
  ],
  PROPERTIES: {
    GEMINI_API_KEY: "GEMINI_API_KEY",
    GOOGLE_SEARCH_CX: "GOOGLE_SEARCH_CX",
    GOOGLE_SEARCH_KEY: "GOOGLE_SEARCH_KEY"
  }
};

/**
 * Seed data for initial setup
 */
var SEED_DATA = [
  { name: "Juniper Networks", town: "Westford", industry: "Technology" },
  { name: "Mercury Systems", town: "Chelmsford", industry: "Defense" },
  { name: "Insulet", town: "Acton", industry: "Medical Devices" },
  { name: "IBM", town: "Littleton", industry: "Technology" },
  { name: "Groton School", town: "Groton", industry: "Education" },
  { name: "Collins Aerospace", town: "Westford", industry: "Aerospace" },
  { name: "Thermo Fisher Scientific", town: "Chelmsford", industry: "Life Sciences" }
];
