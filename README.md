# 🛰️ Regional Career Command Center

An automated, AI-driven job listing aggregator tailored for Northern Middlesex County, Massachusetts.

## 📍 Core Coverage
Targeting top-tier employers and local businesses in:
**Westford • Chelmsford • Groton • Acton • Littleton**

## 🚀 Key Features
*   **AI-Enhanced Extraction**: Leveraging **Gemini 1.5 Flash** to intelligently parse unstructured career pages. No more broken CSS selectors.
*   **Dual-Layer Search**: If a company blocks scraping (Workday/Greenhouse), the system automatically flips to **Google Custom Search** to capture the latest job snippets.
*   **4:00 AM Automation**: A daily "Pulse" refresh that ensures you wake up to the most recent postings within the last 24-48 hours.
*   **One-Click Manual Refresh**: Trigger a full regional scan directly from the Google Sheets menu.
*   **Secure Config**: API keys are isolated in `PropertiesService`, keeping your credentials private.

## 🛠️ Tech Stack
| Component | Technology |
| :--- | :--- |
| **Logic Engine** | Google Apps Script (GAS) |
| **Database/UI** | Google Sheets |
| **AI Parser** | Gemini 1.5 Flash API |
| **Discovery** | Google Custom Search JSON API |
| **Version Control** | GitHub |

## 📖 Setup Instructions
See the [Walkthrough](./handoff.md) for detailed setup steps, including API key configuration and trigger authorization.

---
*Powered by Antigravity AI*
