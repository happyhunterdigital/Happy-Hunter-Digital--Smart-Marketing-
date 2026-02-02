export default function FAQ() {
  const faqs = [
    { q: "What is AEO?", a: "Answer Engine Optimization. Being the direct answer for AI." },
    { q: "What is the Mirror Rule?", a: "Ensuring digital data reflects physical reality for Trust." }
  ];
  return (
    <div className="pt-32 px-6 max-w-4xl mx-auto min-h-screen">
      <h2 className="text-5xl font-black mb-12 uppercase tracking-tighter text-center">Knowledge</h2>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="p-8 border border-slate-900 rounded-3xl bg-slate-900/10">
            <h4 className="text-yellow-500 font-bold mb-2 uppercase italic text-sm">Q: {f.q}</h4>
            <p className="text-slate-400 text-sm">A: {f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
