
import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-brand-dark min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="group flex items-center text-gray-400 hover:text-brand-yellow transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 sm:p-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-brand-yellow/10 p-3 rounded-lg text-brand-yellow">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
          </div>

          <p className="text-gray-400 mb-8 text-sm">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert max-w-none text-gray-300">
            <p>
              Happy Hunter - Smart Marketing Systems ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (www.happyhunterdigital.com) and tell you about your privacy rights and how the law protects you.
            </p>

            <h3 className="text-white font-bold text-xl mt-8 mb-4 flex items-center gap-2">
              <Eye size={20} className="text-brand-yellow" /> 1. Information We Collect
            </h3>
            <p>
              We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address, telephone number, and business details provided in our audit tools or contact forms.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website, products, and services.</li>
            </ul>

            <h3 className="text-white font-bold text-xl mt-8 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-brand-yellow" /> 2. How We Use Your Data
            </h3>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>To provide the AI Audit analysis and marketing services you requested.</li>
              <li>To communicate with you about your account or our services via Email or WhatsApp.</li>
              <li>To improve our website, products/services, marketing, and customer relationships.</li>
              <li>To comply with a legal or regulatory obligation.</li>
            </ul>

            <h3 className="text-white font-bold text-xl mt-8 mb-4 flex items-center gap-2">
              <Lock size={20} className="text-brand-yellow" /> 3. Data Security
            </h3>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
            </p>

            <h3 className="text-white font-bold text-xl mt-8 mb-4">4. Third-Party Links</h3>
            <p>
              This website may include links to third-party websites, plug-ins, and applications (such as Google, WhatsApp, Calendly). Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
            </p>

            <h3 className="text-white font-bold text-xl mt-8 mb-4">5. Contact Details</h3>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-gray-800 p-6 rounded-lg mt-4 border border-gray-700">
              <p className="mb-2"><strong className="text-white">Full Name of Legal Entity:</strong> Happy Hunter - Smart Marketing Systems</p>
              <p className="mb-2"><strong className="text-white">Email Address:</strong> <a href="mailto:motsumitl@happyhunterdigital.com" className="text-brand-yellow hover:underline">motsumitl@happyhunterdigital.com</a></p>
              <p className="mb-0"><strong className="text-white">Phone/WhatsApp:</strong> +27 (0) 60 101 6673</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
