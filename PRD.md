# Product Requirements Document (PRD)
## Shopify Post-Purchase Survey + Native Session Replay

**Version:** 1.0  
**Date:** January 2025  
**Project:** Shopify Plugin Development

---

## 🎯 Executive Summary

**Goal:** Build a Shopify app that combines post-purchase surveys with native session replay functionality, eliminating the need for external tools like FullStory or Clarity by providing integrated playback within the Shopify admin interface.

**Key Value Proposition:** Merchants can understand why customers respond the way they do after checkout by correlating survey feedback with actual user behavior recordings.

---

## 1. Problem Statement

### Current Pain Points
- Existing survey apps collect answers but don't provide context about user behavior
- Merchants can't see what users were doing on screen when they provided feedback
- External session replay tools require separate integrations and additional costs
- No native way to correlate survey responses with user interactions in Shopify

### Example Scenario
A customer responds to a survey saying "The checkout felt confusing," but without session replay, merchants can't identify where the customer got stuck or what specific elements caused confusion.

---

## 2. Solution Overview

Our app will provide an integrated solution that:

1. **Displays post-purchase surveys** on Shopify's Thank-You and Order-Status pages using official Checkout UI Extensions
2. **Captures customer interactions** (mouse movements, clicks, form fills, scrolling) through Shopify's Advanced DOM Events system in the Web Pixel API
3. **Stores interactions securely** in our database with optional cloud storage integration
4. **Reconstructs and replays sessions** inside a built-in player powered by the open-source rrweb library
5. **Links recordings to survey responses** for side-by-side analysis

---

## 3. Key Features (MVP)

| Feature | Description |
|---------|-------------|
| **Post-Purchase Survey** | Automatically displayed after checkout on Thank-You & Order-Status pages with customizable questions |
| **Session Recording (Pixel)** | Captures customer interactions via Shopify's Web Pixel API using Advanced DOM Events |
| **Data Linking** | Survey POST requests include session ID to correlate feedback with behavior recordings |
| **Replay Viewer (In-App)** | Built-in player with pause/play/timeline/speed controls within Shopify admin |
| **Privacy & Masking** | Automatic redaction of sensitive data (email, credit card, passwords) before storage |
| **Consent Handling** | Respects Shopify's built-in consent system - pixels only record with customer agreement |

---

## 4. Technical Architecture

### Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend (Survey)** | Shopify Checkout UI Extension (Polaris Components) | Displays post-purchase survey interface |
| **Event Capture** | Shopify Web Pixel Extension + Advanced DOM Events | Records user interactions and behavior |
| **Backend App** | Node.js / TypeScript (Next.js or Remix template) | Handles API routes and data storage |
| **Database** | PostgreSQL (via Prisma ORM) | Stores survey responses and session metadata |
| **Object Storage** | Amazon S3 or Supabase Storage | Stores compressed session files |
| **Replay Player** | rrweb + rrweb-player | Provides playback interface for session recordings |
| **Admin UI** | Polaris (embedded in Shopify Admin) | Lists survey responses and replays |

### Data Flow Architecture

#### A. Capture Phase
1. Web Pixel loads on relevant Shopify pages
2. Listens to Advanced DOM Events (mouse, input, scroll, resize, etc.)
3. Batches events every few seconds and sends to API
4. Each upload includes unique session key for visitor identification

**Advanced DOM Events:** Shopify's system for apps to "observe" page interactions - like a built-in camera recording anonymous clicks and movements.

#### B. Storage Phase
1. API receives event batches with HMAC signature verification
2. Events written to queue (Amazon SQS or Google Cloud Tasks)
3. Background worker processes queue items sequentially
4. Worker stores event batches in compressed files on S3
5. Metadata recorded in database

**HMAC Authentication:** Secret handshake between pixel and server using private key to prevent fake or tampered data.

**Queue-First Architecture:** Uploads placed in waiting line for background processing to maintain app performance during traffic spikes.

#### C. Survey Submission
1. Survey extension on Thank-You page collects answers and sessionKey
2. Sends both to `/api/surveys/submit` endpoint
3. Server saves survey and links to matching replay session via sessionKey

#### D. Playback Phase
1. Merchants access embedded app in Shopify Admin
2. View list of survey responses
3. Click "Watch Session" opens rrweb player
4. Player reconstructs user's screen interactions second by second

**rrweb:** Open-source screen recorder for web that rebuilds page appearance from stored events.

---

## 5. Data Model

### Core Tables

| Table | Key Fields | Description |
|-------|------------|-------------|
| **SurveyResponses** | orderId, answers, sessionKey, createdAt | Stores survey answers linked to session |
| **ReplaySessions** | sessionKey, shopDomain, startedAt, endedAt, status | Tracks recording session metadata |
| **ReplayChunks** | sessionId, sequence, url, fileSize | Points to compressed data chunks on S3 |

---

## 6. Privacy, Security & Compliance

### Security Measures
- **Consent-aware:** Web Pixel only runs after user accepts tracking cookies
- **Data redaction:** Sensitive inputs (email, name, card numbers) automatically replaced with `•••••`
- **Encryption:** All transfers use HTTPS; stored files encrypted on S3
- **Retention policy:** Default 30 days (configurable), with auto-deletion of old recordings

### Compliance Features
- GDPR compliance through consent management
- Data minimization principles
- Right to deletion support
- Audit trail for data access

---

## 7. Performance Considerations

### Optimization Strategies
- **Compressed chunks:** Sessions stored in 50-150KB chunks per 5-10 seconds
- **Queue system:** Ensures uploads don't block main app performance
- **Cost efficiency:** Typical 3-5 minute sessions cost pennies in storage
- **Throttled data:** Mousemove and scroll events throttled to reduce noise

### Load Impact
- Target: <1 second load impact on checkout pages
- Event batching reduces network requests
- Lazy loading of replay data

---

## 8. Development Roadmap

### Phase 1: MVP Foundation (Weeks 1-8)
**Deliverable:** Working MVP with native replay and survey correlation
- Build survey UI with Checkout UI Extension
- Implement session capture via Web Pixel
- Create data ingestion pipeline
- Develop rrweb playback integration
- Basic admin interface for viewing responses

### Phase 2: Enhanced Usability (Weeks 9-12)
**Deliverable:** Full merchant usability features
- Advanced filtering and search capabilities
- Session tagging system
- Enhanced masking settings UI
- Performance optimization
- Bulk operations for session management

### Phase 3: Analytics & Intelligence (Weeks 13-16)
**Deliverable:** Smart insights dashboard
- AI-powered session summaries
- Friction point detection
- Multi-store analytics
- Survey sentiment analysis
- Custom reporting features

---

## 9. Success Metrics

### Performance KPIs
- **<1 second** load impact on checkout pages
- **95%+** successful event uploads per session
- **<1 minute** average replay start time after session ends
- **≥80%** of survey responses linked to valid replay

### Business KPIs
- Merchant adoption rate
- Session completion rate
- Survey response correlation accuracy
- Customer satisfaction with checkout experience improvements

---

## 10. Future Enhancements

### Advanced Features
- **AI Summary:** Highlight key friction points in each replay
- **Smart Tagging:** Automatic categorization of session issues
- **Multi-Store Analytics:** Aggregated insights across merchant's stores
- **Pre-Checkout Recording:** Extended recording for Plus merchants
- **Real-time Alerts:** Notifications for critical checkout issues

### Integration Opportunities
- Shopify Flow triggers
- Third-party analytics platforms
- Customer support tools
- A/B testing platforms

---

## 11. Technical Glossary

| Term | Definition |
|------|------------|
| **Web Pixel** | Lightweight script Shopify apps use to track events across storefront/checkout |
| **Advanced DOM Events** | Shopify's feed of page changes (clicks, scrolls, typing, resizing) |
| **HMAC Authentication** | Secret digital signature proving data authenticity from pixel |
| **Queue-First Architecture** | Data placed in waiting line before saving to handle traffic spikes |
| **Worker** | Background process handling queued jobs (compress & store files) |
| **rrweb** | Open-source library for recording and replaying web sessions visually |
| **Polaris** | Shopify's design system for embedded app UIs |
| **Checkout UI Extension** | Official method to add custom blocks to Shopify checkout and post-purchase pages |

---

## 12. Risk Assessment

### Technical Risks
- **Performance impact:** Mitigated through event throttling and queue architecture
- **Data privacy:** Addressed through comprehensive masking and consent systems
- **Storage costs:** Managed via compression and retention policies

### Business Risks
- **Shopify policy changes:** Monitored through official channels and beta programs
- **Competition:** Differentiated through native integration and survey correlation
- **Adoption:** Addressed through clear value proposition and ease of setup

---

## 13. Appendix

### Related Documentation
- Shopify Web Pixel API Documentation
- Checkout UI Extensions Guide
- rrweb Implementation Examples
- Polaris Design System Guidelines

### Stakeholder Information
- **Primary Users:** Shopify merchants seeking checkout optimization
- **Secondary Users:** Customer success teams and UX designers
- **Decision Makers:** Store owners and marketing managers

---

*This PRD serves as the foundational document for the Shopify Post-Purchase Survey + Native Session Replay project and should be updated as requirements evolve.*
