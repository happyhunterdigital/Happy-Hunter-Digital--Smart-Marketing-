# Happy Hunter - Smart Marketing Systems

A holistic, AI-driven digital marketing agency application for South African SMEs, featuring an AI Google Business Profile Audit tool, Earned Media knowledge base, and automated marketing solutions.

## Features

- **AI Audit Tool**: Analyze Google Business Profiles using Gemini AI.
- **Earned Media Hub**: Educational content on SEO, GEO, and Digital PR.
- **Service Portfolio**: Showcase of marketing services and case studies.
- **Dynamic Blog**: Knowledge base integrated with Firestore.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **AI**: Google Gemini API
- **Database**: Firebase Firestore (for blog content)
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/happy-hunter.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your API keys:
   ```env
   # API Key is managed via process.env.API_KEY in the current setup
   # Ensure you have your Firebase configuration ready in firebaseConfig.ts
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Building for Production

To build the application for production:

```bash
npm run build
```

## License

All rights reserved. Happy Hunter - Smart Marketing Systems.
