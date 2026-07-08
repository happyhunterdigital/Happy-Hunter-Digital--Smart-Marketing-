import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Database, BrainCircuit, ShieldCheck, MessageSquareCode, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, ShoppingCart, Sparkles, Smartphone, Bot, Zap } from 'lucide-react';

interface SKU {
  id: string;
  title: string;
  desc?: string;
  target?: string;
  specs?: string;
  features?: string[];
  price: string;
  buttonText?: string;
  isPopular?: boolean;
}

interface Category {
  slug: string;
  title: string;
  metaDesc: string;
  h1: string;
  quickAnswer: string;
  icon: React.ReactNode;
  services: SKU[];
  faqs: { q: string; a: string }[];
}

export const CoreServices: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories: Category[] = [
    {
      slug: "digital-marketing",
      title: "Digital Marketing",
      metaDesc: "Content marketing, social media management, Google Ads, and email marketing for South African SMEs — built on data, priced transparently.",
      h1: "Digital Marketing That Builds an Audience, Not Just Reach",
      quickAnswer: "Happy Hunter Digital's digital marketing services cover content marketing, social media management, paid advertising (Google Ads, Meta, TikTok), and email marketing. Each service is scoped individually or bundled, priced monthly, and reported on with real engagement and conversion data — not vanity metrics.",
      icon: <MessageSquareCode size={24} className="text-yellow-500" />,
      services: [
        { id: "DM-SOC-01", title: "Social Media Starter", desc: "Consistent posting and community management across Facebook & Instagram — built to grow followers who actually match your customer profile.", price: "R1,500/month", specs: "8 posts/reels per month, page setup, monitoring & response, monthly report (3-month minimum)" },
        { id: "DM-SOC-02", title: "Social Media Growth", price: "R2,800/month", desc: "Expanded content volume across Facebook, Instagram & TikTok, with audience retargeting to convert engagement into leads.", specs: "12 posts/reels per month, retargeting setup, monitoring & response, monthly report", isPopular: true },
        { id: "DM-CON-01", title: "Content Marketing", price: "R3,500/month", desc: "Blog and web content written to answer real customer questions first — structured for both Google ranking and AI citation.", specs: "4 articles/month, keyword & topic research, on-page SEO optimization" },
        { id: "DM-ADS-01", title: "Paid Search & Social Ads", price: "From R2,500/mo", desc: "Google Ads and/or Meta Ads campaign management — built around measurable cost-per-lead, not just raw impressions.", specs: "Campaign setup, ongoing optimization, monthly performance analytics" },
        { id: "DM-EML-01", title: "Email Marketing", price: "R1,950/month", desc: "Automated and campaign email marketing to turn one-time visitors into repeat, high-value customers.", specs: "Platform setup, 4 campaigns/month, list segmentation, performance tracking" }
      ],
      faqs: [
        { q: "Do I need social media and SEO, or just one?", a: "They work best together — social builds awareness and trust signals, SEO and content build the searchable, citable foundation that turns that awareness into inbound leads." },
        { q: "Is there a minimum contract period?", a: "Most digital marketing services run on a 3-month minimum to allow enough time for meaningful results — social and content performance compounds over time." }
      ]
    },
    {
      slug: "web-development",
      title: "Web Development",
      metaDesc: "Business websites, e-commerce stores, and landing pages built on structured, fast, AI- and search-crawlable foundations for South African SMEs.",
      h1: "Websites Built to Be Found — Not Just Seen",
      quickAnswer: "Happy Hunter Digital builds business websites, e-commerce stores, landing pages, and custom web applications for South African SMEs. Every site is built with technical SEO foundations from day one — fast load times, mobile responsiveness, schema markup, and server-rendered content — so it's discoverable by Google and readable by AI search tools from launch.",
      icon: <Database size={24} className="text-yellow-500" />,
      services: [
        { id: "WEB-BUS-01", title: "Business / Corporate Website", price: "R6,500 once-off", desc: "A professional multi-page site showcasing your company, services, and contact details — built to generate enquiries.", specs: "Up to 5 pages, business email, domain registration, GBP linkage, on-page SEO setup" },
        { id: "WEB-ECOM-01", title: "E-Commerce Website", price: "R14,500 once-off", desc: "A full online store built for South African buyers, with local payment gateways and mobile-optimized checkout.", specs: "Product catalogue, PayFast/Ozow/Yoco integration, inventory setup", isPopular: true },
        { id: "WEB-LAND-01", title: "Landing Page", price: "R2,950 once-off", desc: "A single, high-conversion page built for a specific campaign, product launch, or ad funnel.", specs: "1 page, fast load optimization, mobile-first design, conversion-focused copy" },
        { id: "WEB-PORT-01", title: "Portfolio / Personal Website", price: "R3,450 once-off", desc: "For freelancers, creatives, and professionals who need to showcase work and get discovered.", specs: "Portfolio layout, contact/booking form, blog integration, basic SEO setup" }
      ],
      faqs: [
        { q: "Will my website actually be found by Google when it launches?", a: "Only if it's built correctly from the start — every site we build includes schema markup, proper site structure, and technical SEO foundations from day one." },
        { q: "Can AI tools like ChatGPT find and recommend my site?", a: "That depends on whether your content is server-rendered and structured clearly — which is standard in every build we do." }
      ]
    },
    {
      slug: "seo-ai-search",
      title: "SEO & AI Search",
      metaDesc: "Technical SEO, entity authority, and Generative/Answer Engine Optimisation (GEO/AEO) for South African businesses.",
      h1: "Get Ranked on Google. Get Cited by AI.",
      quickAnswer: "Happy Hunter Digital's SEO & AI Search service covers both traditional search ranking and Generative Engine Optimisation (GEO) — the practice of structuring your content and entity signals so AI tools like ChatGPT, Gemini, Perplexity, and Google AI Overviews can find, trust, and cite your business directly in their answers.",
      icon: <BrainCircuit size={24} className="text-yellow-500" />,
      services: [
        { id: "SEO-AUD-01", title: "SEO & AI Visibility Audit", price: "R3,950 once-off", desc: "A full audit of your technical SEO health, content quality, schema implementation, and current AI search visibility.", specs: "Technical audit, content audit, schema review, AI citation test across major tools, written report" },
        { id: "SEO-TECH-01", title: "Technical SEO Management", price: "R2,450/month", desc: "Ongoing technical SEO management — crawlability, site speed, mobile performance, and structured data maintenance.", specs: "Monthly technical review, Core Web Vitals monitoring, schema maintenance" },
        { id: "SEO-ENT-01", title: "Entity Authority Building", price: "R3,450/month", desc: "We build and align your business's identity across Google, directories, and industry platforms so search engines resolve you as one clear, trustworthy entity.", specs: "NAP consistency audit & fix, directory listings, schema alignment, review strategy" },
        { id: "SEO-GEO-01", title: "GEO & AI Citation Optimisation", price: "R4,950/month", desc: "Content and schema strategy built specifically to get your business cited, quoted, or summarised by AI answer engines.", specs: "Content restructuring, llms.txt setup, monthly AI citation tracking across ChatGPT/Gemini/Perplexity", isPopular: true }
      ],
      faqs: [
        { q: "What's the difference between SEO and GEO?", a: "Traditional SEO optimises to rank in Google's search results. GEO (Generative Engine Optimisation) optimises for how AI tools retrieve, summarise, and cite information." },
        { q: "How do you measure AI visibility?", a: "We run a fixed set of relevant customer prompts against ChatGPT, Gemini, Perplexity, and Google AI Overviews monthly, and track whether your business is mentioned." }
      ]
    },
    {
      slug: "google-business-profile",
      title: "GBP Management",
      metaDesc: "Google Business Profile setup, verification, and ongoing management — win near me searches, Google Maps visibility, and local trust signals.",
      h1: "Own Your 'Near Me' Search Results",
      quickAnswer: "Happy Hunter Digital manages Google Business Profile setup, verification, optimisation, and ongoing maintenance — including accurate categories, hours, service areas, photos, and review management — so your business shows up correctly and competitively in local searches.",
      icon: <ShieldCheck size={24} className="text-yellow-500" />,
      services: [
        { 
          id: "GBP-ESSENTIAL", 
          title: "Essential", 
          target: "A smart starting point for businesses that want to be found by their potential customers and improve how they appear on Google.",
          price: "R1,180/pm", 
          features: [
            "2 x Engaging Google Business Profile Posts",
            "2 x Keyword-Optimised Q&A Entries",
            "Easy-to-Share Review Link (Short URL)",
            "1 x Conversion-Focused Local SEO Landing Page",
            "2 x High-Quality Stock Images Added",
            "2 x Branded Visual Mockups Created"
          ],
          buttonText: "Get Found"
        },
        { 
          id: "GBP-GROWTH", 
          title: "Growth", 
          target: "For businesses ready to step up & build stronger visibility, trust, and activity on Google.",
          price: "R2,730/pm", 
          isPopular: true,
          features: [
            "4 x High-Visibility Google Business Profile Posts (Drive Discovery)",
            "4 x Keyword-Rich Q&A Entries (Boost Search Relevance)",
            "Custom Review Link to Generate More 5-Star Reviews",
            "2 x Local SEO Landing Pages to Capture Nearby Searches",
            "1 x High-Quality Image to Strengthen Profile Appeal",
            "2 x Branded Mockups Enhance Visual Credibility"
          ],
          buttonText: "Get Chosen"
        },
        { 
          id: "GBP-PREMIUM", 
          title: "Premium", 
          target: "For businesses that want a more active, higher-impact Google Business Profile presence.",
          price: "R3,950/pm", 
          features: [
            "6 x High-Visibility Google Business Profile Posts (Consistent Search Presence)",
            "6 x Keyword-Optimised Q&A Entries (Capture High-Intent Local Searches)",
            "Custom Review Link to Accelerate 5-Star Review Generation",
            "3 x Local SEO Landing Pages to Dominate Nearby Search Results",
            "2 x High-Quality Images to Strengthen Profile Performance",
            "2 x Branded Mockups to Enhance Trust & Visual Authority"
          ],
          buttonText: "Dominate Local"
        }
      ],
      faqs: [
        { q: "Why does Google Business Profile matter if I already have a website?", a: "For local searches, GBP often shows before your website does — it is frequently the first touchpoint a nearby customer sees." },
        { q: "How long does verification take?", a: "It varies by method (postcard, phone, or instant verification). Postcard verification typically takes one to two weeks in South Africa." }
      ]
    },
    {
      slug: "whatsapp-marketing",
      title: "WhatsApp Marketing",
      metaDesc: "Turn Facebook, Instagram, and Google ads into direct WhatsApp conversations. Happy Hunter Digital builds and manages ad-to-chat campaigns with custom bot automation.",
      h1: "Turn Ad Clicks Into WhatsApp Conversations",
      quickAnswer: "Happy Hunter Digital's WhatsApp Marketing service runs targeted Facebook, Instagram, and Google ad campaigns that send potential customers straight into a WhatsApp conversation with your business — skipping contact forms and response delays entirely. Where this differs from a standard ad-to-chat setup is automation: we build and manage a custom WhatsApp bot on top of the campaign, so enquiries are captured, sorted, and responded to instantly, even outside business hours, before a human ever needs to step in.",
      icon: <Smartphone size={24} className="text-yellow-500" />,
      services: [
        { id: "WA-CAMP-01", title: "WhatsApp Ad Campaigns", price: "From R2,500/mo + spend", desc: "Facebook, Instagram, and Google ad campaigns built to drive qualified leads directly into a WhatsApp conversation.", specs: "Campaign setup across platforms, audience targeting, click-to-chat ad creative, monthly performance report" },
        { id: "WA-BOT-01", title: "WhatsApp Bot Setup", price: "R4,950 once-off", desc: "A custom-built automated bot that greets, qualifies, and routes incoming WhatsApp enquiries in real time — built on the WhatsApp Business API, not a generic auto-reply.", specs: "Bot flow design, WhatsApp Business API setup, FAQ automation, lead capture & handoff" },
        { id: "WA-MGT-01", title: "WhatsApp Marketing (Full Package)", price: "From R6,500/mo + spend", desc: "Campaigns and bot automation managed together as one system, so every ad click becomes an organised, trackable conversation.", specs: "Includes everything in Ad Campaigns and Bot Setup, ongoing optimisation, lead tracking dashboard", isPopular: true }
      ],
      faqs: [
        { q: "How is this different from just adding a WhatsApp button to my website?", a: "A WhatsApp button waits for someone to already be on your site. Ad-to-chat campaigns bring the conversation to people while they're still scrolling Facebook, Instagram, or searching Google — no site visit required first." },
        { q: "Will a bot make my business feel impersonal?", a: "Not if it's built well — a good WhatsApp bot handles instant acknowledgement, basic qualifying questions, and FAQs, then hands off to a real person for anything that needs judgement. The goal is faster response, not replacing the human conversation." },
        { q: "Do I need a large ad budget to start?", a: "No — ad-to-chat campaigns can start small and scale once you see which ad creative and targeting generates the best-quality conversations, rather than committing a large budget upfront." }
      ]
    },
    {
      slug: "automation-chatbots",
      title: "Automation & Chatbots",
      metaDesc: "Deploy intelligent, 24/7 AI agents and business automations that qualify leads, book appointments, and automate repetitive operational tasks.",
      h1: "Autonomous Business Systems & AI Chatbots",
      quickAnswer: "Deploy intelligent, 24/7 AI agents that integrate directly into your website and WhatsApp to qualify leads, book appointments, and automate repetitive operational tasks. We leverage custom-trained models (using OpenAI and Gemini architectures) that understand your business logic to replace friction with instant, personalized service.",
      icon: <Bot size={24} className="text-yellow-500" />,
      services: [
        { id: "AUTO-CHAT-01", title: "Website AI Chatbot", price: "From R4,950", desc: "A custom-trained AI assistant that lives on your site, answering questions instantly based on your exact business data and PDFs.", specs: "Knowledge base ingestion, UI integration, prompt engineering, hand-off protocols" },
        { id: "AUTO-CRM-01", title: "CRM & Workflow Automation", price: "Custom Quote", desc: "Connect your lead sources directly to your CRM, email sequences, and team notification channels using Zapier and Make.", specs: "No more manual data entry. Total lead pipeline automation.", isPopular: true },
        { id: "AUTO-VOICE-01", title: "AI Voice Agents", price: "From R12,000", desc: "Inbound and outbound AI voice receptionists that can answer the phone, answer FAQs, and book calendar appointments in real-time.", specs: "Voice cloning, telephony integration, calendar sync" }
      ],
      faqs: [
        { q: "Will the AI hallucinate or make up facts about my business?", a: "We utilize strict RAG (Retrieval-Augmented Generation) architectures. The AI is securely restricted to only answer questions using the exact data, PDFs, and links we provide it. It will not hallucinate pricing or policies." },
        { q: "Does the automation integrate with my current CRM?", a: "Yes. We build pipelines that connect seamlessly with HubSpot, Salesforce, Zoho, Monday.com, and Google Workspace ecosystems." }
      ]
    }
  ];

  const activeCategory = categories.find(c => c.slug === category);

  useEffect(() => {
    // 1. Dynamic Page Meta
    const currentTitle = activeCategory ? `${activeCategory.title} Services | Happy Hunter Digital` : "Digital Marketing & Web Services | Happy Hunter Digital";
    const currentDesc = activeCategory ? activeCategory.metaDesc : "Structured, algorithm-visible marketing and web services for South African businesses. Transparent pricing, built to be found by Google and AI.";
    
    document.title = currentTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", currentDesc);

    // 2. Dynamic Schema.org injection (FAQPage + Product)
    if (activeCategory) {
      const schemas: any[] = [];
      
      // FAQ Schema
      if (activeCategory.faqs.length > 0) {
        schemas.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": activeCategory.faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        });
      }

      // Product/Service Schema mapping for each SKU
      activeCategory.services.forEach(service => {
        // Extract numeric price if possible for schema
        const numericPrice = service.price.replace(/[^0-9]/g, '');
        if (numericPrice) {
          schemas.push({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": activeCategory.title,
            "name": service.title,
            "description": service.desc || service.target || "",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Happy Hunter Digital"
            },
            "offers": {
              "@type": "Offer",
              "price": numericPrice,
              "priceCurrency": "ZAR"
            }
          });
        }
      });

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'category-schema-markup';
      script.innerHTML = JSON.stringify(schemas);
      document.head.appendChild(script);

      return () => {
        const activeScript = document.getElementById('category-schema-markup');
        if (activeScript) activeScript.remove();
      };
    }
  }, [category, activeCategory]);

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-yellow-500 selection:text-black">
      <header className="relative pt-40 pb-20 border-b border-gray-900 bg-[#0a0a0a]">
        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Sparkles size={12} /> Domain & Architecture Nodes Active
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            {activeCategory ? activeCategory.h1 : "Services Built to Make Algorithms Notice You"}
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
            {activeCategory ? activeCategory.quickAnswer : "Happy Hunter Digital offers core service categories for South African SMEs: Digital Marketing, Web Development, SEO & AI Search Optimisation, GBP management, and WhatsApp Automation. Every service is built to get your business structured and verified."}
          </p>

          {/* Tab Selection Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <button onClick={() => navigate('/services')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${!activeCategory ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-black text-gray-400 border-gray-800 hover:text-white'}`}>Overview</button>
            {categories.map((c) => (
              <button key={c.slug} onClick={() => navigate(`/services/${c.slug}`)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${activeCategory?.slug === c.slug ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-black text-gray-400 border-gray-800 hover:text-white'}`}>
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-5xl py-16">
        {!activeCategory ? (
          /* HUB VIEW */
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            {categories.map((c) => (
              <div key={c.slug} className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl flex flex-col hover:border-yellow-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-6">
                  {c.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{c.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{c.metaDesc}</p>
                <button onClick={() => navigate(`/services/${c.slug}`)} className="flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-all mt-auto w-fit">
                  Explore {c.title} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* CATEGORY DETAILS VIEW */
          <div className="space-y-16 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              {activeCategory.services.map((s) => {
                const text = encodeURIComponent(`Hi Thabo, I would like to enquire about the service SKU: ${s.id} (${s.title}). Let's schedule a call.`);
                const waLink = `https://wa.me/27601016673?text=${text}`;
                return (
                  <div key={s.id} className={`bg-[#0a0a0a] border ${s.isPopular ? 'border-yellow-500/50 shadow-[0_0_30px_rgba(251,191,36,0.1)]' : 'border-gray-800 hover:border-yellow-500/20'} p-8 rounded-3xl flex flex-col transition-all relative overflow-hidden group`}>
                    {s.isPopular && (
                      <span className="absolute top-0 right-0 bg-yellow-500 text-black text-[9px] font-black uppercase px-4 py-1.5 rounded-bl-xl tracking-widest">Recommended</span>
                    )}
                    {!s.isPopular && (
                      <span className="absolute top-0 right-0 bg-gray-900 text-gray-500 text-[8px] font-black uppercase px-3 py-1 rounded-bl-xl font-mono">{s.id}</span>
                    )}
                    
                    <h3 className="text-2xl font-black text-white mb-2 pr-16">{s.title}</h3>
                    
                    {s.target && (
                      <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest mb-4">Best for: <span className="text-white">{s.target}</span></p>
                    )}
                    
                    <div className="mb-6 flex-grow">
                      {s.desc && <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>}
                      {s.specs && <p className="text-xs text-gray-500 font-mono p-3 bg-black rounded-xl border border-gray-800">{s.specs}</p>}
                      
                      {s.features && (
                        <ul className="space-y-3 mt-4">
                          {s.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                              <CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                              <span dangerouslySetInnerHTML={{ __html: feature.replace(/\(([^)]+)\)/g, '<span class="text-gray-500 text-xs ml-1">($1)</span>') }} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-gray-900 pt-6 mt-auto gap-4">
                      <div>
                        <span className="text-[9px] text-gray-600 block uppercase tracking-widest font-black mb-1">Investment</span>
                        <span className="text-2xl font-black text-white">{s.price}</span>
                      </div>
                      <a href={waLink} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-md ${s.isPopular ? 'bg-yellow-500 text-black hover:bg-white' : 'bg-white/5 text-white hover:bg-yellow-500 hover:text-black'}`}>
                        <ShoppingCart size={14} /> {s.buttonText || "Add to Cart"}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Category FAQ Toggles */}
            {activeCategory.faqs.length > 0 && (
              <div className="border-t border-gray-900 pt-12 space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-6">Category Intel & FAQ</h2>
                {activeCategory.faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-800 rounded-2xl overflow-hidden bg-black">
                    <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-[#0a0a0a] transition-all">
                      <span className="font-bold text-sm text-white">{faq.q}</span>
                      {openFaq === index ? <ChevronUp className="text-yellow-500 shrink-0" /> : <ChevronDown className="text-gray-500 shrink-0" />}
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6 pt-2 bg-[#050505] border-t border-gray-900">
                        <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-yellow-500 pl-4">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
