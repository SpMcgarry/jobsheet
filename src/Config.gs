/**
 * Regional Career Command Center Configuration
 */

var CONFIG = {
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

var SEED_DATA = [
  // Westford
  { name: "Juniper Networks", town: "Westford", industry: "Technology" },
  { name: "Bridges by Epoch at Westford", town: "Westford", industry: "Healthcare" },
  { name: "Netscout Systems", town: "Westford", industry: "Technology" },
  { name: "Collins Aerospace", town: "Westford", industry: "Aerospace" },
  { name: "AECOM", town: "Westford", industry: "Engineering" },
  { name: "Town of Westford", town: "Westford", industry: "Government" },
  
  // Chelmsford
  { name: "Brooks Automation", town: "Chelmsford", industry: "Technology" },
  { name: "Mercury Systems", town: "Chelmsford", industry: "Defense" },
  { name: "Thermo Fisher Scientific", town: "Chelmsford", industry: "Life Sciences" },
  { name: "Microvision Labs", town: "Chelmsford", industry: "Analytical Testing" },
  { name: "Pace Industries", town: "Chelmsford", industry: "Manufacturing" },
  { name: "Town of Chelmsford", town: "Chelmsford", industry: "Government" },

  // Acton
  { name: "Insulet", town: "Acton", industry: "Medical Devices" },
  { name: "SeaChange International", town: "Acton", industry: "Software" },
  { name: "Life Care Center of Acton", town: "Acton", industry: "Healthcare" },
  { name: "Acton Ford", town: "Acton", industry: "Automotive" },
  { name: "Wonder Acton", town: "Acton", industry: "Education" },
  { name: "Town of Acton", town: "Acton", industry: "Government" },

  // Littleton
  { name: "IBM", town: "Littleton", industry: "Technology" },
  { name: "Kimball Farm", town: "Littleton", industry: "Entertainment/Food" },
  { name: "Littleton Lumber & Hardware", town: "Littleton", industry: "Construction" },
  { name: "Mevion Medical Systems", town: "Littleton", industry: "Medical Devices" },
  { name: "FIBA Technologies", town: "Littleton", industry: "Manufacturing" },

  // Groton
  { name: "Groton Hill Music Center", town: "Groton", industry: "Arts/Education" },
  { name: "Groton School", town: "Groton", industry: "Education" },
  { name: "Lawrence Academy", town: "Groton", industry: "Education" },
  { name: "Groton Herald", town: "Groton", industry: "Media" }
];
