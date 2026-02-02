export default function FAQ() {
  const faqs = [
    { q: "What is a Digital Entity?", a: "A Digital Entity is how AI models see your business. It's more than SEO; it's a verified identity across the entire web." },
    { q: "Why am I invisible to Google AI?", a: "If your data is inconsistent or lacks 'Trust Signals,' AI filters you out to protect the user from bad information." },
    { q: "What is the Mirror Rule?", a: "The Mirror Rule ensures your digital profiles perfectly reflect your physical business reality, a key validator for AI trust." }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter">Strategic Knowledge</h2>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="p-6 border border-slate-900 rounded-2xl bg-slate-900/20">
            <h4 className="text-yellow-500 font-bold mb-2">Q: {faq.q}</h4>
            <p className="text-slate-400 text-sm italic">A: {faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
