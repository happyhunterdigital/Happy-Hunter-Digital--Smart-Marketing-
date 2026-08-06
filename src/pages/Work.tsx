import React from 'react';
import { ArrowUpRight, CheckCircle2, TrendingUp, Users, Globe, BarChart3 } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { Link } from 'react-router-dom';

const CASE_STUDIES = [
  {
    client: "Skubalisto",
    logo: "https://res.cloudinary.com/dka0498ns/image/upload/v1770623694/IMG-20260209-WA0025_zgpgf7.jpg",
    website: "https://skubalisto.com",
    industry: "Art & Muralism",
    challenge: "Global physical fame but invisible online. Technical blocks prevented Knowledge Graph generation. No structured data meant AI tools couldn't identify or recommend them.",
    solution: "Entity Resolution protocol: Injected Person and LocalBusiness schema to align physical murals with digital data. Implemented AEO-first content strategy with Speakable markup.",
    results: [
      { metric: "AI Citations", value: "47+", icon: <Globe size={16} /> },
      { metric: "Knowledge Panel", value: "Verified", icon: <CheckCircle2 size={16} /> },
      { metric: "Organic Traffic", value: "+320%", icon: <TrendingUp size={16} /> },
    ],
    testimonial: "I was famous on the streets but invisible online. Thabo made the internet know who I am.",
    testimonialAuthor: "Thabiso Molefe, Founder"
  },
  {
    client: "Integrated Wellth Solutions",
    logo: "https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png",
    website: "https://www.integratedwellth.co.za",
    industry: "Financial Intelligence",
    challenge: "High traffic resulting in zero sales. Generic template-based positioning created ambiguity. Website visitors couldn't understand what the company actually does.",
    solution: "Rebranded as a 'Financial Intelligence Unit'. Deployed automated inbound triage with AI chatbot for high-LTV qualification. Implemented conversion-focused schema markup.",
    results: [
      { metric: "Qualified Leads", value: "+300%", icon: <Users size={16} /> },
      { metric: "Conversion Rate", value: "+180%", icon: <BarChart3 size={16} /> },
      { metric: "Revenue Impact", value: "R2.4M", icon: <TrendingUp size={16} /> },
    ],
    testimonial: "The AI acts as a 24/7 receptionist. I only speak to pre-convinced leads now.",
    testimonialAuthor: "CEO, Integrated Wellth"
  },
  {
    client: "Khongoloti Academy",
    logo: "https://res.cloudinary.com/dka0498ns/image/upload/v1762927791/logo_Khongoloti_1_e4k887.png",
    website: "https://khongoloti.co.za",
    industry: "B2B Education",
    challenge: "Fragmented messaging causing high-friction user journeys. Potential students dropped off between inquiry and certification. Google Business Profile was underoptimized.",
    solution: "Implemented AEO-First approach. Restructured digital assets to create a 'Business Success Loop'. Added FAQ schema, automated WhatsApp qualification, and GBP optimization.",
    results: [
      { metric: "Student Enquiries", value: "+215%", icon: <Users size={16} /> },
      { metric: "GBP Views", value: "+400%", icon: <Globe size={16} /> },
      { metric: "Enrollment Rate", value: "+85%", icon: <TrendingUp size={16} /> },
    ],
    testimonial: "Our enquiries went through the roof. Students find us before they even know they need us.",
    testimonialAuthor: "Dr. Khongoloti, Director"
  },
  {
    client: "Profuse Beauty Cosmetics",
    logo: "https://res.cloudinary.com/dka0498ns/image/upload/v1762929115/Black_Gold_Elegant_Floral_Gala_Night_Invitation_Square_-_1_xpngal.png",
    website: "https://profusebeauty.co.za",
    industry: "Luxury Beauty",
    challenge: "Premium brand with no digital authority. Competitors dominated AI search results. Website existed but wasn't formatted for modern discovery.",
    solution: "Full entity architecture build: SSR website with comprehensive JSON-LD, AEO content strategy, AI chatbot for shade matching, and automated WhatsApp catalog integration.",
    results: [
      { metric: "AI Search Ranking", value: "#1-3", icon: <Globe size={16} /> },
      { metric: "Online Sales", value: "+250%", icon: <TrendingUp size={16} /> },
      { metric: "Chat Conversions", value: "42%", icon: <BarChart3 size={16} /> },
    ],
    testimonial: "People now ask ChatGPT 'best South African beauty brand' and Profuse Beauty comes up.",
    testimonialAuthor: "Profuse Beauty Team"
  }
];

const jsonLdCases = CASE_STUDIES.map(c => ({
  "@context": "https://schema.org",
  "@type": "CaseStudy",
  "name": `${c.client} Case Study - Happy Hunter Digital`,
  "description": `How Happy Hunter Digital helped ${c.client} in ${c.industry} achieve ${c.results[0].value} ${c.results[0].metric}.`,
  "about": { "@type": "Organization", "name": c.client },
  "provider": { "@type": "Organization", "name": "Happy Hunter Digital" },
  "result": c.results.map(r => `${r.metric}: ${r.value}`).join(', ')
}));

export const Work = () => (
  <div className="min-h-screen bg-[#050505]">
    <PageMeta
      title="Our Work & Client Results | Happy Hunter Digital"
      description="Real results for real South African businesses. See how we helped Skubalisto, Integrated Wellth, Khongoloti Academy, and more get found online and grow revenue."
      path="/work"
      jsonLd={jsonLdCases}
    />

    <div className="container mx-auto px-6 pt-32 pb-20">
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
          Portfolio
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white leading-none">
          Verified <span className="text-amber-500 italic">Results</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Every project follows the same protocol: diagnose the vulnerability, architect the solution, and deploy measurable digital authority.
        </p>
      </div>

      <div className="grid gap-16 max-w-6xl mx-auto">
        {CASE_STUDIES.map((study, i) => (
          <article
            key={i}
            className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/20 transition-all duration-500 group"
            itemScope
            itemType="https://schema.org/CaseStudy"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/5 p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={study.logo}
                      alt={`${study.client} logo`}
                      className="h-14 w-auto object-contain rounded-xl bg-white/5 p-2"
                      loading="lazy"
                    />
                    <div>
                      <h2 className="text-2xl font-black text-white" itemProp="name">{study.client}</h2>
                      <p className="text-amber-500 font-bold uppercase tracking-widest text-[10px] mt-1">{study.industry}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-red-400 font-black uppercase text-[10px] tracking-widest mb-1">Challenge</p>
                      <p className="text-gray-400 text-sm leading-relaxed" itemProp="description">{study.challenge}</p>
                    </div>
                    <div>
                      <p className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-1">Solution</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{study.solution}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={study.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Visit Live Site <ArrowUpRight size={14} />
                </a>
              </div>

              <div className="lg:w-3/5 p-8 lg:p-10">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {study.results.map((r, idx) => (
                    <div key={idx} className="text-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                      <div className="flex justify-center mb-2 text-amber-500/60">{r.icon}</div>
                      <p className="text-2xl font-black text-white" itemProp="result">{r.value}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{r.metric}</p>
                    </div>
                  ))}
                </div>

                <blockquote className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                  <p className="text-white font-medium italic text-lg leading-relaxed mb-3">
                    "{study.testimonial}"
                  </p>
                  <cite className="text-amber-500 text-xs font-bold uppercase tracking-widest not-italic">
                    — {study.testimonialAuthor}
                  </cite>
                </blockquote>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-24 p-12 bg-white/[0.02] border border-amber-500/20 rounded-3xl text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
          Your Business <span className="text-amber-500">Next?</span>
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Get a free AI Visibility Audit. We'll show you exactly what's stopping ChatGPT, Gemini, and Google AI from recommending your business.
        </p>
        <Link
          to="/audit"
          className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-amber-400 transition-all hover:scale-[1.02]"
        >
          Start Free Audit
        </Link>
      </div>
    </div>
  </div>
);
