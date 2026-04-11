# Regional Career Command Center - Handoff

## Project Overview
An automated job listing aggregator for specific towns in Massachusetts (Westford, Chelmsford, Groton, Acton, Littleton). Built using Google Sheets and Google Apps Script.

## Tech Stack
- **Frontend/DB**: Google Sheets
- **Logic**: Google Apps Script (GAS)
- **AI**: Gemini API (for job parsing)
- **Search**: Google Custom Search API / Fallback to Google Jobs snippets

## Key Features
- Daily auto-refresh (4:00 AM EST)
- Manual refresh via Custom Menu
- AI-driven job extraction (Business Name, Town, Industry, Career Page, Job Title, Date, Link)
- Bot-blocker fallback (Google Search snippet extraction)

## Current Status
- [x] Research completed on expert scraping patterns.
- [ ] Initial git repository setup.
- [ ] Google Sheets structure definition.
- [ ] Core GAS implementation.

## Skills Identified
1. **Google Apps Script**: Expertise in HTTP requests and Spreadsheet automation.
2. **LLM Extraction**: Using Gemini to structured JSON from raw HTML.
3. **Advanced Search**: Custom Search JSON API implementation.

## Permissions & Settings Required
- [ ] Google Custom Search API Key (Requires User Approval for potential cost)
- [ ] Google AI Studio (Gemini) API Key
- [ ] GitHub Repository Creation

---
*Created by Antigravity AI*
