import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Database, PlusSquare } from 'lucide-react';

interface EntityInjectorProps {
  activeWorkspace: any;
}

export const EntityInjector: React.FC<EntityInjectorProps> = ({ activeWorkspace }) => {
  const [identity, setIdentity] = useState({
    legalName: '',
    orgType: 'LocalBusiness',
    telephone: '',
    websiteUrl: '',
    description: '',
    logo: '',
    image: '',
    priceRange: 'ZAR',
    sameAs: ''
  });

  const [claim, setClaim] = useState({
    category: 'service',
    content: '',
    url: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchIdentity = async () => {
      if (!activeWorkspace) return;
      // We use the workspace ID as the document ID for brand identity to maintain tenancy
      const docRef = doc(db, 'brand_identity', activeWorkspace.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIdentity({
          legalName: data.legalName || '',
          orgType: data.orgType || 'LocalBusiness',
          telephone: data.telephone || '',
          websiteUrl: data.websiteUrl || '',
          description: data.description || '',
          logo: data.logo || '',
          image: data.image || '',
          priceRange: data.priceRange || 'ZAR',
          sameAs: data.sameAs?.join(', ') || ''
        });
      }
    };
    fetchIdentity();
  }, [activeWorkspace]);

  const handleIdentitySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const sameAsArray = identity.sameAs.split(',').map(s => s.trim()).filter(s => s);
      await setDoc(doc(db, 'brand_identity', activeWorkspace.id), {
        ...identity,
        sameAs: sameAsArray,
        workspaceId: activeWorkspace.id,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      alert("Entity Identity Updated. Master Schema Recompiling...");
    } catch (err) {
      console.error(err);
      alert("Failed to update entity.");
    } finally {
      setSaving(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.content) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'verified_claims'), {
        ...claim,
        workspaceId: activeWorkspace.id,
        timestamp: serverTimestamp()
      });
      setClaim({ category: 'service', content: '', url: '' });
      alert("Claim Injected. Vector Embedder Activated.");
    } catch (err) {
      console.error(err);
      alert("Failed to inject claim.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Brand Identity Form */}
      <div className="bg-black/40 border border-gray-900 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
          <Database className="text-yellow-500" size={24} />
          <h3 className="text-xl font-black uppercase">Entity Identity</h3>
        </div>
        
        <form onSubmit={handleIdentitySave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Legal Name</label>
              <input type="text" value={identity.legalName} onChange={e => setIdentity({...identity, legalName: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 text-sm" required />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Schema Org Type</label>
              <select value={identity.orgType} onChange={e => setIdentity({...identity, orgType: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 text-sm">
                <option value="LocalBusiness">LocalBusiness</option>
                <option value="ProfessionalService">ProfessionalService</option>
                <option value="Organization">Organization</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Official Website</label>
              <input type="url" value={identity.websiteUrl} onChange={e => setIdentity({...identity, websiteUrl: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 text-sm" required />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Telephone (E.164)</label>
              <input type="tel" value={identity.telephone} onChange={e => setIdentity({...identity, telephone: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 text-sm" required />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Entity Description</label>
            <textarea value={identity.description} onChange={e => setIdentity({...identity, description: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 text-sm h-24 resize-none" required />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Social Profiles (Comma Separated URLs)</label>
            <textarea value={identity.sameAs} onChange={e => setIdentity({...identity, sameAs: e.target.value})} placeholder="https://linkedin.com/in/..., https://x.com/..." className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 text-sm h-24 resize-none" />
          </div>

          <button type="submit" disabled={saving} className="w-full bg-yellow-500 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50 mt-4">
            {saving ? 'Transmitting...' : 'Compile Master Schema'}
          </button>
        </form>
      </div>

      {/* Verified Claims Form */}
      <div className="bg-black/40 border border-gray-900 rounded-3xl p-8 shadow-2xl h-fit">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
          <PlusSquare className="text-yellow-500" size={24} />
          <h3 className="text-xl font-black uppercase">Inject Verified Claim</h3>
        </div>
        
        <form onSubmit={handleClaimSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Claim Category</label>
            <select value={claim.category} onChange={e => setClaim({...claim, category: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 text-sm">
              <option value="service">Service Offering</option>
              <option value="price">Pricing Node</option>
              <option value="blog">Insight/Blog</option>
              <option value="onboarding">Welcome/Onboarding</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Semantic Content (Strict Truth)</label>
            <textarea value={claim.content} onChange={e => setClaim({...claim, content: e.target.value})} placeholder="State the objective fact clearly for the AI to embed..." className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 text-sm h-32 resize-none" required />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Reference URL (Optional Evidence)</label>
            <input type="url" value={claim.url} onChange={e => setClaim({...claim, url: e.target.value})} placeholder="https://..." className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 text-sm" />
          </div>

          <button type="submit" disabled={saving || !claim.content} className="w-full bg-gray-900 border border-gray-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:border-yellow-500 hover:text-yellow-500 transition-colors disabled:opacity-50 mt-4">
            {saving ? 'Vectorizing...' : 'Inject Claim & Embed'}
          </button>
        </form>
      </div>
    </div>
  );
};
