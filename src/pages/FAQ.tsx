import { HelpCircle } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    { q: "What is a Digital Entity?", a: "A Digital Entity is your business's verified identity across the Knowledge Graph. It allows AI models to understand WHO you are, not just what keywords you use." },
    { q: "Why am I invisible to Google AI?", a: "AI engines like Gemini prioritize 'Verified Entities.' If your data is fragmented or your Trust Signals are weak, the AI filters you out to protect users from hallucinations." },
    { q: "What is the Mirror Rule?", a: "The Mirror Rule is our protocol for ensuring your digital footprint perfectly reflects your physical business reality—a primary validator for AI Trust." },
    { q: "What is AEO vs SEO?", a: "SEO is about ranking a link. AEO (Answer Engine Optimization) is about becoming the direct answer provided by an AI agent. We optimize for the latter." }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-12">
        <HelpCircle className="text-yellow-500" size={40} />
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Strategic <span className="text-yellow-500">Knowledge</span></h2>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="p-8 border border-slate-900 rounded-3xl bg-slate-900/10 hover:bg-slate-900/30 transition-colors">
            <h4 className="text-yellow-500 font-black mb-3 text-lg uppercase tracking-tight italic">Q: {faq.q}</h4>
            <p className="text-slate-400 leading-relaxed border-l border-slate-800 pl-6">A: {faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-yellow-500 rounded-3xl text-slate-950 text-center">
        <h3 className="text-3xl font-black mb-4">STILL INVISIBLE?</h3>
        <p className="font-bold mb-8 italic">Let Thabo Leslie Motsumi personally audit your entity infrastructure.</p>
        <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm">Book Strategy Call</a>
      </div>
    </div>
  );
}
