import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import './CoursesPage.css';

const faqs = [
  { question: "For whom is CareerKinetic designed?", answer: "CareerKinetic is expertly tailored for both technical and non-technical individuals looking to pivot, grow, or launch their careers through curated bootcamps and customized roadmaps." },
  { question: "Is there any prerequisite for starting a bootcamp?", answer: "No strictly enforced prerequisites! Once you select a professional background upon registering, CareerKinetic dynamically tailors your starting point to match your experience level." },
  { question: "How does the Mentorship system work?", answer: "Mentors are direct industry experts assigned to you specifically. They review your bootcamp progress, answer questions natively inside the platform, and provide direct career advice on your path." },
  { question: "Are the courses free?", answer: "Many foundational onboarding courses are completely free. Premium bootcamps and customized mentorship roadmaps require a subscription plan which unlocks full job opportunities globally." }
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '3.5rem' }}>
        <HelpCircle size={28} style={{ color: 'var(--primary)' }} />
        <h1 className="text-gradient" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>Frequently Asked Questions</h1>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {faqs.map((faq, index) => (
          <div key={index} className="glass-panel fade-in-up" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden', animationDelay: `${0.2 + (index * 0.1)}s` }}>
            <div 
              onClick={() => toggleFaq(index)} 
              style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: openIndex === index ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.3s' }}
            >
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: openIndex === index ? 'var(--primary)' : 'var(--foreground)', transition: 'color 0.3s' }}>
                {faq.question}
              </h3>
              <span style={{ transition: 'transform 0.3s', display: 'flex', alignItems: 'center' }}>
                {openIndex === index ? (
                  <ChevronUp size={20} style={{ color: 'var(--primary)' }} />
                ) : (
                  <ChevronDown size={20} style={{ color: 'var(--muted-foreground)' }} />
                )}
              </span>
            </div>
            
            {openIndex === index && (
              <div className="fade-in-up" style={{ padding: '0 2rem 1.75rem 2rem', borderTop: '1px solid var(--border)' }}>
                <p className="text-muted" style={{ margin: 0, marginTop: '1.5rem', fontSize: '1.05rem', lineHeight: '1.8' }}>
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
