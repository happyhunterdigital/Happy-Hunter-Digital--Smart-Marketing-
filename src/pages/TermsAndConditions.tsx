import React, { useEffect } from 'react';
import { PageMeta } from '../components/PageMeta';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen pb-20 animate-fade-in font-sans selection:bg-yellow-500 selection:text-black">
      <PageMeta
        title="Terms & Conditions | Happy Hunter Digital"
        description="Terms & Conditions for Happy Hunter Digital agency services — websites, AI chatbots, WhatsApp automation, retainers, payments and IP. Governed by South African law."
        path="/terms-and-conditions"
      />
      <header className="relative pt-40 pb-20 border-b border-gray-800 bg-[#0a0a0a]">
        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <Link to="/" className="inline-flex text-gray-400 hover:text-yellow-500 items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
            <ArrowLeft size={16} /> Return to Base
          </Link>
          <div className="flex justify-center mb-6">
            <FileText className="text-yellow-500" size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tighter text-white leading-none">
            Terms <br /><span className="text-yellow-500 italic">& Conditions</span>
          </h1>
          <p className="text-gray-400 text-lg uppercase tracking-widest font-bold mt-8">Effective Date: Current Deployment</p>
        </div>
      </header>

      <article className="container mx-auto px-6 max-w-3xl py-16 text-gray-300 text-base md:text-lg leading-relaxed space-y-12">
        <section>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-l-4 border-yellow-500 pl-4">1. Parties & Acceptance</h2>
          <p>
            These Terms & Conditions ("Terms") govern your use of the website at happyhunterdigital.com and any services
            provided by <strong className="text-white">Happy Hunter Digital</strong> ("we", "us", or "our"), a digital
            marketing agency based in Pretoria, South Africa.
          </p>
          <p className="mt-4">
            By accessing this website, requesting a quote, or engaging our services, you ("the Client") agree to be bound
            by these Terms. If you do not agree, do not use our website or services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-l-4 border-yellow-500 pl-4">2. Regulatory Framework</h2>
          <p>Our services are provided in accordance with the laws of the Republic of South Africa, including:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
            <li><strong className="text-white">Protection of Personal Information Act (POPIA):</strong> how we collect, use, and protect personal information. See our <Link to="/privacy-policy" className="text-yellow-500 underline hover:text-white transition-colors">Privacy Policy</Link>.</li>
            <li><strong className="text-white">Consumer Protection Act 68 of 2008 (CPA):</strong> your rights as a consumer of our services, including fair marketing and cooling-off rights where applicable.</li>
            <li><strong className="text-white">Electronic Communications and Transactions Act 25 of 2002 (ECT Act):</strong> formation of electronic contracts, electronic communications, and online transactions.</li>
            <li><strong className="text-white">General Data Protection Regulation (GDPR):</strong> applied to the extent we process data of individuals in the European Economic Area.</li>
          </ul>
          <p className="mt-4">
            Where any provision of these Terms conflicts with non-excludable consumer rights under the CPA, the CPA prevails
            to the extent of the conflict.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-l-4 border-yellow-500 pl-4">3. Agency Services</h2>
          <p>Happy Hunter Digital provides digital growth services, including but not limited to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
            <li><strong className="text-white">Websites:</strong> design, development, hosting setup, SEO and analytics integration.</li>
            <li><strong className="text-white">AI chatbots:</strong> AI-powered chat assistants, lead qualification flows, and website integrations.</li>
            <li><strong className="text-white">WhatsApp automation:</strong> WhatsApp Business API setup, automated messaging flows, and campaign integrations.</li>
            <li>Related services such as branding, content, social media, paid media, and marketing audits.</li>
          </ul>
          <p className="mt-4">
            Project scope, deliverables, and timelines are confirmed in writing (proposal, quote, or statement of work)
            before work begins. Anything outside the agreed scope is quoted separately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-l-4 border-yellow-500 pl-4">4. Retainers & Project Terms</h2>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
            <li><strong className="text-white">Retainers:</strong> monthly retainers cover the agreed hours or deliverables for that billing cycle. Unused hours do not roll over unless agreed in writing.</li>
            <li><strong className="text-white">Project work:</strong> fixed-scope projects are delivered against agreed milestones. Client feedback is required within 7 business days of each milestone delivery unless otherwise agreed.</li>
            <li><strong className="text-white">Third-party costs:</strong> ad spend, hosting, domains, licences, stock assets, and platform fees are billed separately and remain the Client's responsibility unless stated otherwise.</li>
            <li><strong className="text-white">Client materials:</strong> the Client warrants it owns or is licensed to use all logos, copy, images, and data it supplies, and grants us a licence to use them to deliver the services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-l-4 border-yellow-500 pl-4">5. Payments</h2>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
            <li><strong className="text-white">Quotes & invoices:</strong> fees are set out in the accepted quote or proposal. All amounts are in South African Rand (ZAR) unless stated otherwise and exclude VAT where applicable.</li>
            <li><strong className="text-white">Deposits:</strong> project work typically requires a 50% deposit before commencement, with the balance due on delivery or go-live.</li>
            <li><strong className="text-white">Retainer billing:</strong> retainers are billed monthly in advance and payable within 7 days of invoice.</li>
            <li><strong className="text-white">Late payment:</strong> overdue amounts may incur interest at the maximum rate permitted by law, and we may pause work or withhold deliverables until payment is received.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-l-4 border-yellow-500 pl-4">6. Intellectual Property</h2>
          <p>
            Unless agreed otherwise in writing, full ownership of final, paid-for deliverables (e.g. website design, copy,
            and creative produced specifically for the Client) transfers to the Client upon receipt of full payment.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
            <li><strong className="text-white">Agency IP retained:</strong> we retain ownership of our proprietary tools, frameworks, processes, templates, and pre-existing intellectual property, licensed to the Client only as part of the delivered services.</li>
            <li><strong className="text-white">Portfolio rights:</strong> we may reference the Client's project in our portfolio and case studies unless the Client requests otherwise in writing.</li>
            <li><strong className="text-white">Third-party IP:</strong> fonts, stock media, plugins, and platform components remain subject to their respective licences.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-l-4 border-yellow-500 pl-4">7. Acceptable Use</h2>
          <p>You agree not to use our website or services to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
            <li>Break any law, infringe intellectual property, or send spam or unlawful WhatsApp/email communications.</li>
            <li>Attempt to gain unauthorised access to our systems or interfere with service integrity.</li>
            <li>Misrepresent your identity or deploy chatbots and automations in a deceptive manner.</li>
          </ul>
          <p className="mt-4">
            WhatsApp automation and chatbot deployments must comply with the WhatsApp Business Policy, Meta platform terms,
            and applicable data protection laws. The Client is responsible for obtaining required end-user consents (opt-ins)
            for marketing messages sent through systems we build or manage for them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-l-4 border-yellow-500 pl-4">8. Warranties & Liability Cap</h2>
          <p>
            We provide our services with reasonable skill and care. Except as required by the CPA or other non-excludable
            law, our website and services are provided "as is" without warranties of uninterrupted availability or specific
            marketing outcomes (such as rankings, leads, or revenue).
          </p>
          <p className="mt-4">
            To the maximum extent permitted by law, our total liability for any claim arising from these Terms or the
            services is limited to <strong className="text-white">the fees paid by the Client for the specific services
            giving rise to the claim in the 3 months preceding the claim</strong>. We are not liable for indirect,
            incidental, or consequential loss, including loss of profit or data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-l-4 border-yellow-500 pl-4">9. Term, Termination & Governing Law</h2>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
            <li><strong className="text-white">Term:</strong> project engagements end on final delivery and payment; retainers continue until terminated with 30 days' written notice (calendar month).</li>
            <li><strong className="text-white">Termination for cause:</strong> either party may terminate on written notice if the other materially breaches these Terms and fails to remedy within 14 days.</li>
            <li><strong className="text-white">Effect:</strong> on termination, all outstanding fees become immediately due. Prepaid unused retainer fees are non-refundable except as required by the CPA.</li>
            <li><strong className="text-white">Governing law:</strong> these Terms are governed by the laws of South Africa. Disputes are subject to the jurisdiction of the South African courts, with the parties first attempting good-faith resolution.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-l-4 border-yellow-500 pl-4">10. Initiate Contact</h2>
          <p>Questions about these Terms? Ping our command center directly:</p>
          <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl mt-6">
            <p className="font-mono text-sm text-yellow-500 mb-2">Primary Contact Vector:</p>
            <p className="font-bold text-white">motsumitl@happyhunterdigital.com</p>
            <p className="font-bold text-white mt-2">+27 (0) 60 101 6673</p>
            <p className="text-gray-400 text-sm mt-2">574 Fred Messenger Avenue, Andeon, Pretoria West, Pretoria, South Africa</p>
          </div>
        </section>
      </article>
    </div>
  );
};
