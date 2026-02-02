import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto text-center py-20">
      <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8">
        Survive the <br /> <span className="text-yellow-500">Smart Filter</span>
      </h1>
      <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl mb-12">
        If you are not a Verified Entity by 2026, you are invisible. We build the architecture that AI models trust.
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link to="/audit" className="bg-yellow-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2">
          RUN ENTITY SCAN <Search size={20}/>
        </Link>
        <Link to="/services" className="border border-slate-800 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-900">
          THE ECOSYSTEM
        </Link>
      </div>
    </div>
  );
}
