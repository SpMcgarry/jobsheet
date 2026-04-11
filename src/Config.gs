/**
 * Regional Career Command Center Configuration
 */

const CONFIG = {
  TOWNS: ["Westford", "Chelmsford", "Groton", "Acton", "Littleton"],
  SHEET_NAME: "Job Listings",
  HEADERS: [
    "Business Name", 
    "Town", 
    "Industry", 
    "Career Page URL", 
    "Latest Job Title", 
    "Date Posted", 
    "Direct Job Link"
  ],
  // API Keys will be retrieved from Script Properties for security
  PROPERTIES: {
    GEMINI_API_KEY: "GEMINI_API_KEY",
    GOOGLE_SEARCH_CX: "GOOGLE_SEARCH_CX",
    GOOGLE_SEARCH_KEY: "GOOGLE_SEARCH_KEY"
  }
};

const SEED_DATA = [
  { name: "Insulet", town: "Acton", industry: "Medical Devices" },
  { name: "SeaChange International", town: "Acton", industry: "Software" },
  { name: "Apps Associates", town: "Acton", industry: "IT Services" },
  { name: "Brooks Automation", town: "Chelmsford", industry: "Robotics/Tech" },
  { name: "Thermo Fisher Scientific", town: "Chelmsford", industry: "Life Sciences" },
  { name: "Groton School", town: "Groton", industry: "Education" },
  { name: "IBM", town: "Littleton", industry: "Technology" },
  { name: "Mevion Medical Systems", town: "Littleton", industry: "MedTech" },
  { name: "Collins Aerospace", town: "Westford", industry: "Aerospace" },
  { name: "NETSCOUT", town: "Westford", industry: "Network Security" }
];
