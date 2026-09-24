# marketingEng.md — Marketing Engineering Skill (Growth OS)

> Single source of truth for Marketing Engineering at Happy Hunter Digital.
> Discipline name stays **Marketing Engineering**. Commercial names sell the outcome:
> **Smart Growth Engine / Growth OS Deployment / Growth on Autopilot**.
> When this file changes, update `src/pages/CoreServices/CoreServices.tsx` (marketing-engineering category),
> `functions/src/data/servicesKnowledge.ts`, `services.md`, and `BRAND-BOOK.md` together.

*Last synced: 2026-09-24 — from Marketing Engineer Playbook (Happy Hunter Digital — Smart Marketing).*

---

## 01 — What It Is

Marketing has shifted from manual acquisition to **Marketing Engineering**: turning live market signal
into predictable pipeline using AI agents, structured data, persistent memory, and editorial taste.

Mandate is no longer just ranking. It is being **recommended across Google, LLMs, Perplexity, and social**.

Rule: A Marketing Engineer does not manage campaigns. A Marketing Engineer builds and tunes the
software, agents, and data flows that generate demand continuously.

Era shift:

| Era | Objective | Operating Model | Bottleneck |
|-----|-----------|-----------------|------------|
| Traditional | Brand narrative | Mass media, print, broadcast | Zero measurement |
| Digital Marketing | Channel acquisition | Ad networks, SEO keywords, email | Rising CAC, fatigue |
| Growth Hacking | Virality, activation loops | Funnels, referrals | Product-dependent, ignores outbound |
| **Marketing Engineering** | **Autonomous pipeline + LLM recommendation** | **AI agents, code, vector memory, live data** | **Editorial taste + system architecture** |

When content is free, attention goes to deep customer truth, sharp positioning, and timing-based distribution.

## 02 — Growth OS Repository (Single Source of Truth)

Ephemeral prompting is the flaw: prompt, copy, paste, memory evaporates. Fix is a version-controlled
**Growth-OS** repo — living memory for the whole marketing ecosystem.

```
Growth-OS/
├── customer-truth/
│   ├── sales-transcripts/      # call recordings + CRM deal notes
│   ├── support-signals/        # ticket logs, complaints, FAQ tags
│   ├── churn-intelligence/     # exit interviews, cancellation reasons
│   └── what-the-market-says.md # agent-updated market brief
├── brand-and-voice/
│   ├── founder-convictions.md
│   ├── voice-guidelines.md
│   └── high-performing-hooks.md
├── intelligence-and-signals/
│   ├── icp-definition.md
│   ├── buying-triggers.md
│   └── entity-kgmid-map.md     # schema + Knowledge Graph + LLM entity nodes
├── creative-matrix/
│   ├── angle-testing-log.csv
│   └── approved-offers.md
└── agent-specs/
    ├── customer-truth-agent.md
    ├── geo-citation-agent.md
    ├── outbound-signal-agent.md
    └── whatsapp-concierge-agent.md
```

## 03 — The Six Engines (Technical)

1. **Customer Truth & Market Signal Engine** — nightly parse of CRM notes, sales transcripts,
   support tickets, WhatsApp chats into `what-the-market-says.md`. Verbatim phrases, objections
   seen 2x+ in a week, economic reasons vs vanity requests. Proof required: timestamp / deal ID / quote.
2. **Founder Content Engine** — 15-min weekly voice note → agent cross-refs founder-convictions +
   market-truth → drafts 5 assets (LinkedIn contrarian, X thread, newsletter, micro-guide/calculator
   concept, email). Human gate before publish.
3. **Outbound Signal Engine** — never pitch without a verifiable trigger (hiring surge, leadership
   change, regulation, negative competitor review, stack change). Enrich vs ICP, pair with case study,
   draft 3-sentence hyper-relevant outreach.
4. **GEO & LLM Citation Engine** — entity structuring (JSON-LD Organization/Service/AboutPage,
   KGMID + Wikidata), corpus seeding (original data, comparisons, calculators), weekly LLM audit
   across ChatGPT/Claude/Perplexity/Gemini on top commercial queries, gap remediation via PR/directory/docs.
5. **WhatsApp Concierge & Pipeline Relay** — 2–3 qualifying questions (size, bottleneck, timeline).
   Tier 1 high-fit → booking link + founder SMS/WhatsApp alert. Tier 2 nurture → audit resource +
   nurture flow. All notes/budget/pain synced to CRM (`crmRelay.ts`).
6. **Growth Cockpit** — Monday 07:00 SAST executive brief: pipeline velocity (qualified opps,
   cost per meeting, WhatsApp pipeline), customer-truth shift (winning prop, emerging objection +
   action), experiment scorecard (CTR, GEO citation share), next sprints.

Closed loop: Signal Intake (calls/tickets/WhatsApp) → extract truth → LLM/GEO engine (authority
into index → AI recommendations) + Pipeline engine (vocabulary into concierge → CRM deals) →
Closed-Loop Pipeline.

## 04 — 30-Day Implementation Roadmap

Week 1 Audit & Map: last 50 calls + closed-lost + tickets, ICP map (buyer/user/gatekeeper),
AI visibility audit on top 10 queries. Deliverable: Market & Entity Map.
Week 2 Build Growth OS: stand up repo, seed convictions/angles/winning copy, v1.0
`what-the-market-says.md`. Deliverable: Growth Memory Bank.
Week 3 Deploy First Engine: highest-friction engine first, deterministic specs
(inputs/frequency/filters/approval/metrics), wire CRM/webhooks/WhatsApp/LLM APIs, dry-run +
correct hallucinations. Deliverable: live workflow with human-in-loop.
Week 4 Pipeline Launch: go live (outreach + content + concierge), track qualified conversations /
booked calls / reply rate, start Monday Cockpit, document edge cases. Deliverable: measurable pipeline.

## 05 — Service Hierarchy (What We Sell)

Never sell the job title "Marketing Engineer" (anchors to salary/hourly). Sell the system + outcome.
Marketing Engineering stays the discipline/category.

| Tier | Commercial Name | Delivery | Outcome |
|------|-----------------|----------|---------|
| Audit | Market Signal & AI Visibility Audit | 7-day sprint | Messaging gaps + LLM visibility baseline |
| Flagship | **Growth OS Deployment** (or Marketing Engineering Sprint) | 30–45 day build | Customer-truth repo + GEO schema + trigger/content loops + WhatsApp/CRM concierge |
| Retainer | **Embedded Marketing Engineering** (or Fractional Marketing Engineer) | Monthly | Cockpit + prompt-drift prevention + citation monitoring + agent upkeep |
| Category | **Marketing Engineering as a Service (MEaaS)** | Ongoing | Replacement for bloated agency: code + agents + memory + taste → revenue |
| Wedge | AI Visibility & GEO Engine / Customer Truth System / Pipeline Concierge | Scoped | Fast entry-point before full engine |

Positioning lines:
- Flagship: "We don't sell campaigns; we engineer your autonomous growth infrastructure in 45 days."
- Retainer: "Senior engineering-grade marketing embedded in your business, at a fraction of a 5-person team."
- MEaaS: "Code, agents, persistent memory, and editorial judgment connected directly to revenue."

## 06 — Website Version (Plain English, No Jargon)

Do NOT sell "Marketing Engineering" to an SME owner. Sell booked calls.

Names: **Smart Growth Engine / 24/7 Demand Engine / AI Pipeline System**

Pitch: "Most businesses waste money on random posts, overpriced agencies, and guessing what to say.
We build a smart marketing system that learns what your buyers actually want, gets you recommended
by Google and ChatGPT, and books qualified leads into your calendar on autopilot."

3 parts:
1. What buyers actually care about — pull real words/complaints from sales calls into one place.
   Result: messaging that makes people buy, not buzzwords.
2. Recommended everywhere — set you up as the obvious expert so Google/AI/social recommend you
   when someone asks "Who is the best at X?"
3. Booked calls instantly — WhatsApp/chat assistant answers instantly, checks fit, books calendar.
   Result: wake up to qualified appointments, no chasing.

Packages (website):
- Step 1 Diagnosis: Growth & Visibility Audit — why marketing fails + where AI/Google gaps are.
- Step 2 Build: Smart Growth Engine Setup — 30–45 day rollout (messaging + AI presence + WhatsApp booking).
- Step 3 Pilot: Growth on Autopilot — monthly upkeep + weekly lead reports + campaign updates.

## 07 — Quoting Rules

- Audit maps to existing **SEO & AI Visibility Check R3,950 once-off** where scoped as audit.
- Engine build + retainer = **Custom Quote** — never invent a flat fee. Scope via audit first.
- Always say **"starting from"** where a floor exists. ZAR, monthly vs once-off explicit.
- Link scope to outcome: "This makes you citable to ChatGPT, verifiable on Maps, booked on WhatsApp."
- Chatbot/WhatsApp knowledge lives in `functions/src/data/servicesKnowledge.ts` — keep in sync.

## Source Files

- This file — skill + discipline definition
- `src/pages/CoreServices/CoreServices.tsx` — `marketing-engineering` category (renders `/services/marketing-engineering`)
- `functions/src/data/servicesKnowledge.ts` — bot/WhatsApp knowledge (must mirror)
- `services.md` — human catalogue
- `BRAND-BOOK.md` — category + positioning
