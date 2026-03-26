import React, { useState, useRef } from 'react';
import { db, functions } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AuditForm } from './AuditForm';
import { AuditResults } from './AuditResults';

export const AiAudit: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ biz: '', loc: '', name: '', mail: '', wa: '' });
  const [scanProgress, setScanProgress] = useState(0);
  const [verdict, setVerdict] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const [phoneError, setPhoneError] = useState('');

  const calculateRevenueLoss = (score: number) => {
    if (score <= 30) return { amount: 'R18,500+', desc: 'Severe ghost entity status. Maximum revenue leakage.' };
    if (score <= 55) return { amount: 'R9,800+', desc: 'Critical signal failures. Significant monthly loss.' };
    return { amount: 'R3,200+', desc: 'Moderate gaps detected. Optimization required.' };
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phone) {
      setPhoneError('WhatsApp number is required.');
      return false;
    }
    if (!phone.startsWith('+')) {
      setPhoneError('Must start with a + country code.');
      return false;
    }
    if (phone.includes(' ')) {
      setPhoneError('Remove all spaces.');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError('Invalid international format.');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setForm({ ...form, wa: input });
    if (input.length > 0) validatePhone(input);
  };

  const runForensicScan = async () => {
    if (!validatePhone(form.wa)) {
        alert("Please fix the WhatsApp number format before proceeding.");
        return;
    }

    setStep(3);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      if (progress >= 95) clearInterval(interval);
    }, 50);

    try {
      const performAudit = httpsCallable(functions, 'performAudit');
      const response = await performAudit({
        businessName: form.biz,
        location: form.loc,
        clientEmail: form.mail,
        whatsapp: form.wa
      });
      const data = response.data as any;
      if (!data.success) throw new Error("Server rejected audit.");

      const rev = calculateRevenueLoss(data.score);
      setVerdict({ ...data, revenueLoss: rev });
      
      clearInterval(interval);
      setScanProgress(100);
      setTimeout(() => setStep(4), 500);

    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      alert("Neural Link Interrupted. Please check your connection and retry.");
      setStep(1);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { backgroundColor: '#050505', scale: 2 });
    const img = canvas.toDataURL('image/jpeg', 0.8);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
    pdf.save(`HH_Audit_${form.biz}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
      {(step === 1 || step === 2 || step === 3) && (
        <AuditForm 
          step={step} 
          form={form} 
          setForm={setForm} 
          setStep={setStep} 
          phoneError={phoneError} 
          handlePhoneChange={handlePhoneChange} 
          runForensicScan={runForensicScan} 
          scanProgress={scanProgress} 
        />
      )}

      {step === 4 && verdict && (
        <AuditResults 
          verdict={verdict} 
          reportRef={reportRef} 
          downloadPDF={downloadPDF} 
          bizName={form.biz} 
        />
      )}
    </div>
  );
};
