import { SEO } from '../components/SEO';
import { Shield, Cpu, Activity } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <SEO title="Home" description="South Africa's Smart Marketing Agency." />
      <h1 className="text-6xl font-bold mb-8">Survive the <span className="text-[#C6A87C]">AI Filter</span></h1>
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="border border-gray-800 p-6 rounded-xl"><Shield className="text-[#C6A87C] mb-4" /><h3>Trust Anchor</h3></div>
        <div className="border border-gray-800 p-6 rounded-xl"><Cpu className="text-[#C6A87C] mb-4" /><h3>AIO Optimization</h3></div>
        <div className="border border-gray-800 p-6 rounded-xl"><Activity className="text-[#C6A87C] mb-4" /><h3>Revenue Agents</h3></div>
      </div>
    </div>
  );
};
