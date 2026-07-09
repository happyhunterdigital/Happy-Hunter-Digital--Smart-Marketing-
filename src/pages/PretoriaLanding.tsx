import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Cpu, Search, CheckCircle2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export const PretoriaLanding: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // 1. Dynamic Meta Title and Description Update
    document.title = "Digital Marketing Agency Pretoria | Entity Authority & AI Visibility | Happy Hunter Digital";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Happy Hunter Digital helps Pretoria SMEs build structured, algorithm-visible online identities — so Google, Google Business Profile, and AI search tools like ChatGPT and Gemini can actually find and recommend you. Serving Centurion, Hatfield, Menlyn, Brooklyn and the greater Tshwane metro.");
    }
    // 2. Dynamic Injection of LocalBusiness & FAQPage Schemas
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Happy Hunter Digital - Pretoria Division",
        "description": "Pretoria digital marketing agency specializing in local SEO, Google Business Profile optimization, schema markup, and entity resolution.",
        "telephone": "+27601016673",
        "email": "motsumitl@happyhunterdigital.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Pretoria",
          "addressRegion": "Gauteng",
          "postalCode": "0183",
          "addressCountry": "ZA"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "-25.7255",
          "longitude": "28.0688"
        },
        "areaServed": [
          "Centurion", "Hatfield", "Menlyn", "Brooklyn", "Sunnyside",
          "Waterkloof", "Arcadia", "Silverton", "Pretoria CBD", "Wonderboom", "Montana"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does digital marketing cost for a small business in Pretoria?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Costs vary by scope — a Google Business Profile cleanup and local schema setup is a smaller, fixed-cost project, while ongoing content and entity-authority management is typically a monthly retainer. We scope based on your current visibility gaps, not a flat package."
            }
          },
          {
            "@type": "Question",
            "name": "How is this different from regular SEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Regular SEO focuses mainly on ranking in Google's search results. We also optimize for how AI tools like ChatGPT and Gemini retrieve and cite information, which depends more on content clarity, schema accuracy, and consistent entity signals across the web than on keywords alone."
            }
          },
          {
            "@type": "Question",
            "name": "Do you only work with Pretoria businesses?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No — we're based in South Africa and work with SMEs across the country, but we have specific experience with Pretoria's business environment, including government-adjacent and institutional clients."
            }
          },
          {
            "@type": "Question",
            "name": "How long until I see results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Technical fixes (schema, GBP, site structure) typically show measurable local search improvement within 4–8 weeks. AI citation visibility often moves faster for real-time tools like Perplexity and Google AI Overviews, and more slowly for tools that rely on periodic training updates."
            }
          }
        ]
      }
    ];

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'pretoria-landing-schemas';
    script.innerHTML = JSON.stringify(schemas);
    document.head.appendChild(script);

    window.scrollTo(0, 0);

    return () => {
      const activeScript = document.getElementById('pretoria-landing-schemas');
      if (activeScript) activeScript.remove();
    };
  }, []);

  const faqs = [
    {
      q: "How much does digital marketing cost for a small business in Pretoria?",
      a: "Costs vary by scope — a Google Business Profile cleanup and local schema setup is a smaller, fixed-cost project, while ongoing content and entity-authority management is typically a monthly retainer. We scope based on your current visibility gaps, not a flat package."
    },
    {
      q: "How is this different from regular SEO?",
      a: "Regular SEO focuses mainly on ranking in Google's search results. We also optimize for how AI tools like ChatGPT and Gemini retrieve and cite information, which depends more on content clarity, schema accuracy, and consistent entity signals across the web than on keywords alone."
    },
    {
      q: "Do you only work with Pretoria businesses?",
      a: "No — we're based in South Africa and work with SMEs across the country, but we have specific experience with Pretoria's business environment, including government-adjacent and institutional clients."
    },
    {
      q: "How long until I see results?",
      a: "Technical fixes (schema, GBP, site structure) typically show measurable local search improvement within 4–8 weeks. AI citation visibility often moves faster for real-time tools like Perplexity and Google AI Overviews, and more slowly for tools that rely on periodic training updates."
    }
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-yellow-500 selection:text-black">
      <header className="relative pt-40 pb-20 border-b border-gray-900 bg-[#0a0a0a] text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dkyg07qvv/image/upload/v1783543561/Happyhunterdigital_Pretoria_Service_AreA_nonglc.jpg"
            alt="Pretoria Service Area"
            className="w-full h-full object-cover opacity-40 transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <MapPin size={12} /> Local Entity Nodes Active
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            Digital Marketing for Pretoria SMEs — <span className="text-yellow-500 italic">Stop Being a Ghost</span> to Algorithms
          </h1>
        </div>
      </header>

      <article className="container mx-auto px-6 max-w-3xl py-16 space-y-12">
        {/* Quick Answer Block - Must render first in body order */}
        <section className="bg-yellow-500/5 border border-yellow-500/20 rounded-3xl p-8 shadow-neural-glow">
          <p className="text-lg leading-relaxed text-gray-200">
            <strong>Happy Hunter Digital</strong> is a Pretoria-based digital marketing agency that helps small and medium businesses build a structured, verifiable online presence so search engines and AI tools can find, trust, and recommend them. We focus on three things: technical SEO foundations (schema markup, Google Business Profile optimization, site structure), content that answers real customer questions directly, and entity authority — making sure your business is described consistently across Google, directories, and the web so algorithms stop guessing who you are.
          </p>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">
            We work with Pretoria SMEs across Centurion, Hatfield, Menlyn, Brooklyn, Sunnyside, and the wider Tshwane metro, including businesses serving the government, education, and corporate sectors concentrated in the capital.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Why Pretoria Businesses Need This</h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Pretoria's business landscape is distinct and shaped heavily by government departments, embassies, two major universities (University of Pretoria and Tshwane University of Technology), and a dense cluster of professional services in areas like Brooklyn and Hatfield. This requires a dedicated local approach:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-gray-400">
              <CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5" />
              <span><strong>Tight local niche competition:</strong> Specific niches like legal, consulting, education, and medical services require specialized, high-authority configurations to cut through noise.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-400">
              <CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5" />
              <span><strong>Transition to AI search engines:</strong> Students, civil servants, and corporate professionals increasingly use tools like ChatGPT, Gemini, and Perplexity first. If you are not in their knowledge models, you are invisible.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-400">
              <CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5" />
              <span><strong>Institutional trust validation:</strong> Large buyers and government entities verify consistency before engaging. Outdated directory profiles or mismatched address information destroys trust.</span>
            </li>
          </ul>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">What We Do for Pretoria Businesses</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-yellow-500 mb-2">1. Google Business Profile Optimization</h3>
              <p className="text-gray-400 text-sm leading-relaxed">We verify, complete, and continuously manage your GBP listing—ensuring accurate hours, services, and local citations—so you dominate local near-me searches.</p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-yellow-500 mb-2">2. Local Schema & Technical SEO</h3>
              <p className="text-gray-400 text-sm leading-relaxed">We deploy explicit LocalBusiness schemas containing Pretoria coordinates and strict boundaries to provide structural confidence directly to web spiders.</p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-yellow-500 mb-2">3. Entity Consistency Across the Web</h3>
              <p className="text-gray-400 text-sm leading-relaxed">We resolve mapping ambiguities by unifying your NAP values (Name, Address, Phone) across Google, local directories, and databases like Snupit.</p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-yellow-500 mb-2">4. Content Tailored for AI Synthesis</h3>
              <p className="text-gray-400 text-sm leading-relaxed">We draft high-quality content using a direct answer format, ensuring your brand is easily extracted and cited by generative engines.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Areas We Serve in Pretoria / Tshwane</h2>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {["Centurion", "Hatfield", "Menlyn", "Brooklyn", "Sunnyside", "Waterkloof", "Arcadia", "Silverton", "Pretoria CBD", "Wonderboom", "Montana"].map((area) => (
              <span key={area} className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-full text-gray-300">{area}</span>
            ))}
          </div>
        </section>

        <section className="space-y-4 border-t border-gray-800 pt-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left bg-black hover:bg-[#0a0a0a] transition-all"
                >
                  <span className="font-bold text-sm md:text-base text-white">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="text-yellow-500" /> : <ChevronDown className="text-gray-500" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 pt-2 bg-[#050505]">
                    <p className="text-gray-400 text-sm leading-relaxed border-l border-yellow-500 pl-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <Cpu className="mx-auto text-yellow-500 mb-4" size={40} />
          <h3 className="text-2xl md:text-3xl font-black uppercase text-white mb-2">Find out where your business is invisible</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">We will run a free audit of your current Google presence, schema configuration, and AI visibility to show you exactly what is costing you clients.</p>
          <Link to="/audit" className="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl">
            Get Your Free Digital Visibility Audit <ArrowRight size={14} />
          </Link>
        </section>
      </article>
    </div>
  );
};
