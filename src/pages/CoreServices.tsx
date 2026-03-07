import React from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CoreServices = () => (
  <div className="bg-[#050505] min-h-screen pb-0 animate-fade-in font-sans selection:bg-yellow-500 selection:text-black">
    
    {/* HERO SECTION WITH REQUESTED IMAGE */}
    <header className="relative pt-40 pb-24 border-b border-gray-800 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://res.cloudinary.com/dka0498ns/image/upload/v1772893108/Untitled_design_4_jghatq.png" 
          alt="Strategic Services" 
          className="w-full h-full object-cover object-center opacity-50 mix-blend-overlay transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          The 2026 Protocol
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none text-white">
          Architectural <span className="text-yellow-500 italic text-white underline decoration-yellow-500/30 underline-offset-[12px]">Pricing</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          We do not sell &quot;websites.&quot; We engineer <strong>Digital Entities</strong>. Here is the comprehensive pricing architecture to establish your baseline trust and deploy your agentic revenue systems.
        </p>
      </div>
    </header>

    {/* PHASE 1: ONCE-OFF ARCHITECTURE */}
    <section className="py-24 px-6 relative border-b border-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase 1</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Once-Off Entity Architecture</h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">This tier replaces traditional &quot;web design&quot; by providing high-performance, Server-Side Rendered (SSR) infrastructure engineered specifically for Large Language Model (LLM) ingestion and speed.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1 */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-yellow-500/30 transition-all flex flex-col relative">
            <div className="mb-8">
              <h4 className="text-2xl font-black text-white mb-1">The &quot;Digital Front Door&quot;</h4>
              <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Starter Business Website</p>
            </div>
            <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">Best for: Startups needing a verified, high-speed footprint.</p>
            
            <div className="flex-grow space-y-4 mb-10">
              <p className="text-white text-sm font-medium">A lightning-fast, 1-to-3 page professional site to get your business online securely.</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Hand-coded 1–3 page static node</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Sub-200ms TTFB guarantee</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> SSL security &amp; standard SEO</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Initial &quot;Digital Passport&quot; creation in Firestore</li>
              </ul>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-800/50">
              <p className="text-gray-500 line-through text-sm">R7,500 – R12,500</p>
              <p className="text-3xl font-black text-white">R4,500 <span className="text-lg text-gray-500 font-medium">to</span> R12,500</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 mb-6">Once-Off Investment</p>
            </div>
          </div>

          {/* Tier 2 (Highlighted) */}
          <div className="bg-gradient-to-b from-[#111827] to-[#0a0a0a] border-2 border-yellow-500/50 rounded-3xl p-8 hover:border-yellow-500 transition-all flex flex-col relative shadow-[0_0_40px_rgba(234,179,8,0.1)] transform lg:-translate-y-4 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
            <div className="mb-8">
              <h4 className="text-2xl font-black text-white mb-1">The Agentic Web Hub</h4>
              <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Professional AI-Ready Website</p>
            </div>
            <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">Best for: Established SMEs requiring dedicated service pages.</p>
            
            <div className="flex-grow space-y-4 mb-10">
              <p className="text-white text-sm font-medium">A comprehensive site built so Google and AI tools can easily read and recommend your services.</p>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> 5–10 hand-coded pages (SSR)</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> &quot;Truth Table&quot; initialized with verified claims</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> LocalBusiness &amp; Organization schema markup</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Expert copywriting included</li>
              </ul>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-800/50">
              <p className="text-gray-500 line-through text-sm">R18,000 – R28,000</p>
              <p className="text-3xl font-black text-yellow-500">R14,000 <span className="text-lg text-gray-500 font-medium">to</span> R19,000</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 mb-6">Once-Off Investment</p>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-yellow-500/30 transition-all flex flex-col relative">
            <div className="mb-8">
              <h4 className="text-2xl font-black text-white mb-1">The Premium Blueprint</h4>
              <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Brand Authority Website</p>
            </div>
            <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">Best for: High-value firms (medical, financial, legal).</p>
            
            <div className="flex-grow space-y-4 mb-10">
              <p className="text-white text-sm font-medium">The ultimate company website, including professional photography and video to build absolute trust.</p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Deep architectural build</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Extensive JSON-LD schema mesh</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> 2 hours of professional photography</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> 3 hours of film for verified Knowledge Graph visual assets</li>
              </ul>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-800/50">
              <p className="text-gray-500 line-through text-sm">R38,000 – R55,000+</p>
              <p className="text-3xl font-black text-white">R25,000 <span className="text-lg text-gray-500 font-medium">to</span> R55,000+</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 mb-6">Once-Off Investment</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* PHASE 2: GOVERNANCE & AEO RETAINERS */}
    <section className="py-24 px-6 relative border-b border-gray-900 bg-[#020202]">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase 2</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Entity Governance &amp; AEO Retainers</h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">This tier replaces standard SEO. These packages are recurring governance retainers focused on maintaining a 100% perfect Rich Results score, driving AI visibility, and triaging leads.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Monthly Tier 1 */}
          <div className="bg-black border border-gray-800 p-8 rounded-3xl hover:border-white/20 transition-all flex flex-col">
            <div className="mb-6">
              <h4 className="text-xl font-black text-white mb-1">Local Authority &amp; Verification</h4>
              <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">Local Search Dominance</p>
            </div>
            <p className="text-gray-500 text-xs mb-6 font-medium pb-6 border-b border-gray-800">Target Scope: Single-city or suburban practices.</p>
            <div className="flex-grow mb-8">
              <p className="text-sm text-gray-300 mb-6">We manage your Google Maps and website so you show up first when people in your city search for your services.</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> Active Google Business Profile (GBP) management</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> Tracking up to 10 core keywords</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> 1 RAG-optimized monthly blog post</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> Ongoing technical maintenance</li>
              </ul>
            </div>
            <div className="mt-auto pt-6 border-t border-gray-800/50">
              <p className="text-gray-500 line-through text-xs">R8,500 – R12,500</p>
              <p className="text-2xl font-black text-white">R5,500 – R9,500 <span className="text-sm text-gray-500 font-normal">/mo</span></p>
            </div>
          </div>

          {/* Monthly Tier 2 */}
          <div className="bg-black border border-yellow-500/30 p-8 rounded-3xl hover:border-yellow-500 transition-all flex flex-col shadow-xl relative">
            <div className="mb-6">
              <h4 className="text-xl font-black text-white mb-1">National AI Growth &amp; Lead Triage</h4>
              <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">National Growth &amp; Lead Generation</p>
            </div>
            <p className="text-gray-500 text-xs mb-6 font-medium pb-6 border-b border-gray-800">Target Scope: SMEs targeting multiple cities or a province.</p>
            <div className="flex-grow mb-8">
              <p className="text-sm text-gray-300 mb-6">We optimize your site for nationwide searches and use AI to capture and filter your incoming leads.</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> Optimization for 20–50 core keywords</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> Continuous updates to Firestore &quot;Truth Table&quot;</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> Advanced schema (FAQ/HowTo)</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> Maintenance of the &quot;Neural Link&quot; Chatbot</li>
              </ul>
            </div>
            <div className="mt-auto pt-6 border-t border-gray-800/50">
              <p className="text-gray-500 line-through text-xs">R30,000 – R45,000</p>
              <p className="text-2xl font-black text-yellow-500">R21,000 – R34,000 <span className="text-sm text-gray-500 font-normal">/mo</span></p>
            </div>
          </div>

          {/* Monthly Tier 3 */}
          <div className="bg-black border border-gray-800 p-8 rounded-3xl hover:border-white/20 transition-all flex flex-col">
            <div className="mb-6">
              <h4 className="text-xl font-black text-white mb-1">Enterprise Entity Governance</h4>
              <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">Ultimate Brand Protection &amp; Visibility</p>
            </div>
            <p className="text-gray-500 text-xs mb-6 font-medium pb-6 border-b border-gray-800">Target Scope: National brands, high-risk brokers, e-commerce.</p>
            <div className="flex-grow mb-8">
              <p className="text-sm text-gray-300 mb-6">24/7 technical monitoring, legal data compliance, and aggressive strategy to make your massive brand the top answer everywhere.</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> 24/7 Agentic Technical SEO monitoring</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> POPIA/FAIS digital asset compliance auditing</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> AI Share of Voice tracking</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> Monthly live broadcast facilitation (OBS/Mux)</li>
              </ul>
            </div>
            <div className="mt-auto pt-6 border-t border-gray-800/50">
              <p className="text-gray-500 line-through text-xs">R75,000 – R120,000+</p>
              <p className="text-2xl font-black text-white">R55,000 – R109,000+ <span className="text-sm text-gray-500 font-normal">/mo</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* PHASE 3: AGENTIC SOCIAL MEDIA */}
    <section className="py-24 px-6 relative border-b border-gray-900 bg-[#050505]">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase 3</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Agentic Social Media Packages</h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">These packages feed vital social signals and traffic back to the client&apos;s Digital Passport, utilizing active media spend to guarantee reach.</p>
        </div>

        <div className="overflow-x-auto bg-[#0a0a0a] rounded-3xl border border-gray-800 shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800 text-yellow-500">
                <th className="p-6 font-bold uppercase tracking-widest text-xs w-1/4">Package Name</th>
                <th className="p-6 font-bold uppercase tracking-widest text-xs w-1/4">Content &amp; Output</th>
                <th className="p-6 font-bold uppercase tracking-widest text-xs w-1/3">Professional Services</th>
                <th className="p-6 font-bold uppercase tracking-widest text-xs text-right w-auto">Investment (Monthly)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr className="hover:bg-gray-900/30 transition-colors">
                <td className="p-6 align-top border-r border-gray-800/50">
                  <p className="font-bold text-white text-lg">The &quot;Awareness&quot; Mesh</p>
                  <p className="text-[10px] text-yellow-500 uppercase tracking-widest mt-1">Brand Awareness Ads</p>
                </td>
                <td className="p-6 text-gray-300 align-top text-sm">2 Promoted Adverts<br/>across 2 channels.</td>
                <td className="p-6 text-gray-400 text-sm align-top leading-relaxed">
                  Entry-level social media ads designed to get people in your area to recognize your business name.<br/><br/>
                  <span className="text-white font-medium">Copywriting, design, plus <strong>R1,000</strong> allocated media spend.</span>
                </td>
                <td className="p-6 align-top text-right">
                  <p className="text-gray-500 line-through text-xs">R4,900</p>
                  <p className="font-black text-white text-xl">R3,500</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-900/30 transition-colors">
                <td className="p-6 align-top border-r border-gray-800/50">
                  <p className="font-bold text-white text-lg">The &quot;Acquisition&quot; Engine</p>
                  <p className="text-[10px] text-yellow-500 uppercase tracking-widest mt-1">Lead Generation Ads</p>
                </td>
                <td className="p-6 text-gray-300 align-top text-sm">4 Promoted Posts<br/>across 2 channels.</td>
                <td className="p-6 text-gray-400 text-sm align-top leading-relaxed">
                  Aggressive, targeted social media campaigns designed to make people click, call, and buy.<br/><br/>
                  <span className="text-white font-medium">Elevated copywriting, advanced design, plus <strong>R2,000</strong> allocated media spend.</span>
                </td>
                <td className="p-6 align-top text-right">
                  <p className="text-gray-500 line-through text-xs">R8,500</p>
                  <p className="font-black text-yellow-500 text-xl">R6,500</p>
                </td>
              </tr>
              <tr className="hover:bg-gray-900/30 transition-colors">
                <td className="p-6 align-top border-r border-gray-800/50">
                  <p className="font-bold text-white text-lg">The &quot;Omnichannel&quot; Dominance</p>
                  <p className="text-[10px] text-yellow-500 uppercase tracking-widest mt-1">Total Market Takeover</p>
                </td>
                <td className="p-6 text-gray-300 align-top text-sm">6 Promoted Posts<br/>across 3 channels.</td>
                <td className="p-6 text-gray-400 text-sm align-top leading-relaxed">
                  High-budget advertising across multiple platforms (Facebook, LinkedIn, X) so your brand is everywhere your customers look.<br/><br/>
                  <span className="text-white font-medium">Priority copywriting, premium design execution, plus <strong>R4,000</strong> allocated media spend.</span>
                </td>
                <td className="p-6 align-top text-right">
                  <p className="text-gray-500 line-through text-xs">R14,500</p>
                  <p className="font-black text-white text-xl">R10,500</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* PHASE 4: A LA CARTE SERVICES */}
    <section className="py-24 px-6 relative bg-[#020202]">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase 4</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Standalone &quot;Smart&quot; Services</h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">These are highly technical foot-in-the-door diagnostics and specialized one-off integrations.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
            <h4 className="font-bold text-white text-lg mb-2">Google Search Console Setup</h4>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Verification and direct crawler communication setup to uncover &quot;orphan pages&quot; and indexing errors.</p>
            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-yellow-500 font-black text-xl">R990 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
            </div>
          </div>
          
          <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
            <h4 className="font-bold text-white text-lg mb-2">GBP Ultimate Setup</h4>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Complete optimization of Google Business Profile categories, attributes, and local trust signals.</p>
            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-yellow-500 font-black text-xl">R1,500 – R2,500 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
            </div>
          </div>

          <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
            <h4 className="font-bold text-white text-lg mb-2">Semantic Intent Mapping</h4>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Mapping semantic clusters and user intents to define topical authority, bypassing standard keyword lists.</p>
            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-yellow-500 font-black text-xl">R1,760 – R15,000 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
            </div>
          </div>

          <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
            <h4 className="font-bold text-white text-lg mb-2">Custom GA4 Tracking</h4>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Configuration of GA4 to isolate and track AI/LLM referral traffic and document friction points.</p>
            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-yellow-500 font-black text-xl">R5,500 – R11,000 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-[#111827] to-[#0a0a0a] border border-yellow-500/30 rounded-3xl flex flex-col hover:border-yellow-500 transition-all shadow-lg">
            <h4 className="font-bold text-white text-lg mb-2">Forensic Technical Audit</h4>
            <p className="text-sm text-gray-300 mb-6 flex-grow">Deep-dive architectural blueprint mapping crawl budgets, canonical tags, and server latency.</p>
            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-yellow-500 font-black text-xl">R7,000 – R50,000+ <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
            </div>
          </div>
          
          <div className="p-8 bg-gradient-to-br from-[#111827] to-[#0a0a0a] border border-yellow-500/30 rounded-3xl flex flex-col hover:border-yellow-500 transition-all shadow-lg">
            <h4 className="font-bold text-white text-lg mb-2">Neural Link Chatbot</h4>
            <p className="text-sm text-gray-300 mb-6 flex-grow">Setup and deployment of an autonomous, NLP-driven sales/support chatbot (e.g., Hunter AI).</p>
            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-yellow-500 font-black text-xl">R10,000 – R38,000 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
            </div>
          </div>

          <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
            <h4 className="font-bold text-white text-lg mb-2">UX Behavioral Analysis</h4>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Exhaustive, human-led qualitative research utilizing dynamic heatmaps and session recordings.</p>
            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-yellow-500 font-black text-xl">R75,000 – R175,000 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
            </div>
          </div>

          <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
            <h4 className="font-bold text-white text-lg mb-2">Targeted AEO Content</h4>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Creation of highly expert, human-generated articles engineered as magnets for organic LLM citations.</p>
            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-yellow-500 font-black text-xl">R1,000 – R1,500 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Per article)</span></p>
            </div>
          </div>

          <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
            <h4 className="font-bold text-white text-lg mb-2">AEO &quot;Answer Blocks&quot;</h4>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Restructuring existing pages into concise, schema-rich snippets designed for &quot;position zero&quot; extraction.</p>
            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-yellow-500 font-black text-xl">R1,440 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Per keyword/page)</span></p>
            </div>
          </div>

          <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
            <h4 className="font-bold text-white text-lg mb-2">Verified Visuals</h4>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Dedicated capture sessions to establish authoritative visual assets for the client&apos;s Knowledge Graph.</p>
            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-yellow-500 font-black text-xl">R4,500 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mx-1">(Photo)</span> / R8,500 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-1">(Film)</span></p>
            </div>
          </div>

          <div className="p-8 bg-yellow-500/10 border border-yellow-500/30 rounded-3xl flex flex-col lg:col-span-2">
            <h4 className="font-bold text-yellow-500 text-lg mb-2">Strategic Consulting</h4>
            <p className="text-sm text-gray-300 mb-6 flex-grow">Purely strategic, bi-weekly consultation based on real-time algorithmic weather and data tracking.</p>
            <div className="pt-4 border-t border-yellow-500/20">
              <p className="text-yellow-500 font-black text-2xl">R9,500 <span className="text-[10px] font-bold tracking-widest text-yellow-500/70 uppercase ml-2">(Monthly)</span></p>
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* SHARED FOOTER IMAGE BANNER */}
    <section className="relative h-[60vh] min-h-[500px] border-t border-black overflow-hidden bg-[#050505] flex items-center justify-center text-center">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://res.cloudinary.com/dka0498ns/image/upload/v1772893091/happyhunterdigital_smart_marketing_contacts_v3w73g.png" 
          alt="Digital Dominance Footer" 
          className="w-full h-full object-cover object-bottom opacity-50 mix-blend-screen transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-transparent h-32"></div>
      </div>
      <div className="relative z-10 container mx-auto px-6 max-w-3xl">
        <ShieldCheck className="mx-auto text-yellow-500 mb-6" size={56} />
        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none drop-shadow-2xl">Initialize <br/><span className="text-yellow-500">The Protocol</span></h2>
        <p className="text-gray-300 text-xl md:text-2xl font-medium mb-10 drop-shadow-lg">Stop losing revenue to invisible algorithms. Secure your digital passport today.</p>
        <Link to="/audit" className="inline-flex items-center justify-center gap-3 bg-yellow-500 text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:scale-105">
          Commence Onboarding <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  </div>
);
