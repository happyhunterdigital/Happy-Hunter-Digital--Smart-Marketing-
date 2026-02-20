export const Founders = () => (
  <div className="container mx-auto px-6 py-20 min-h-screen">
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
            The <span className="text-brand-yellow">Architect</span>
          </h2>
          <div className="space-y-6 text-gray-400 leading-relaxed font-medium">
            <p>
              Happy Hunter Systems was founded on a single brutal realization: 
              <strong> The AI era is filtering out 90% of local businesses.</strong>
            </p>
            <p>
              Standard SEO agencies are still selling keywords from 2018. We architect entities for 2026. 
              My mission is to ensure that when an AI engine (Gemini, ChatGPT, SearchGPT) is asked for the best in your industry, it names <strong>YOU</strong> as the primary authority.
            </p>
            <p className="text-white italic text-lg">
              "We don't chase algorithms. We force them to verify your existence."
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] bg-gray-800 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative z-10">
             {/* Replace this with your actual image URL later */}
             <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent opacity-60"></div>
             <div className="absolute bottom-10 left-10">
               <p className="font-black uppercase tracking-widest text-brand-yellow">Thabo Leslie Motsumi</p>
               <p className="text-[10px] text-gray-400 font-bold uppercase">Principal Strategist</p>
             </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-yellow/10 blur-[80px] rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);
