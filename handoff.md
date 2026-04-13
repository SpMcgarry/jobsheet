# Regional Career Command Center - Handoff (Six Sigma Revision)

## Project Overview
Automated job listing aggregator for Massachusetts towns (Westford, Chelmsford, Groton, Acton, Littleton). Revised for Lean efficiency to reduce manual data entry and increase job detection reliability.

## Tech Stack
- **Database**: Google Sheets (Regional Job Board)
- **Logic**: Google Apps Script (GAS)
- **AI**: Gemini 1.5 Flash (Discovery & Extraction)
- **Search**: Google Custom Search API (Snippet-based job discovery)

## Key Features
- **Directory Discovery**: Targets Town/Chamber of Commerce directories to find *actual* local businesses instead of just web snippets.
- **AI Enrichment**: Automatically identifies Website and Career Page URLs for newly discovered companies.
- **Search-First Pulse**: Finds latest jobs using Google's search snippets (which bypass bot blockers) as the primary source.
- **Unified Extraction**: AI logic that handles both snippets and HTML fallbacks.

## Revision Improvements (Six Sigma)
1.  **Eliminated Waste**: Replaced manual "career page" entry with AI-automated lookups during discovery.
2.  **Reduced Defects**: Shifted from direct HTML scraping (vulnerable to Cloudflare/headers) to Search Snippet extraction for job data.
3.  **Improved Flow**: Batch enrichment of SEED_DATA on setup.

## Current Status
- [x] Strategic revision of architecture.
- [x] Implementation of Directory-based discovery.
- [x] Implementation of Snippet-first job extraction.
- [x] Expanded headers for better tracking (Website, Last Checked).

## Setup Instructions
1.  **API Keys**: Enter Gemini and Google Search keys via the **🚀 Career Command > API Settings** menu.
2.  **Initial Setup**: Run **1. Initial Setup** to build the sheet and enrich seed companies.
3.  **Discovery**: Run **2. Discover** to scan for more local companies.
4.  **Daily Refresh**: The system is designed to run `refreshJobs` daily (Setup trigger via Script Editor or manual menu).

---
*Revision by Antigravity AI (Six Sigma Black Belt Mode)*
