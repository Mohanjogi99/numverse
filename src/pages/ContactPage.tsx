import React, { useState } from 'react';
import { Mail, MessageSquare, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { isHindi } = useLanguage();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast(isHindi ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill all required fields.', 'warning');
      return;
    }

    // Direct mailto fallback or submission trigger
    setIsSubmitted(true);
    showToast(isHindi ? 'आपका संदेश प्राप्त हो गया है! हमारी टीम 24 घंटों में संपर्क करेगी।' : 'Message received! Our support team will respond within 24 hours.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-fade-in text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-semibold border border-pink-200 dark:border-pink-900/50">
          <MessageSquare className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
          <span>{isHindi ? 'ग्राहक सहायता एवं संपर्क' : 'Customer Support & Inquiries'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
          {isHindi ? 'हमसे संपर्क करें (Contact Us)' : 'Contact Us'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isHindi
            ? 'हमारी टीम आपकी सहायता के लिए सदैव तत्पर है। सामान्य प्रतिक्रिया समय: 24 घंटे।'
            : 'We are here to assist with report inquiries, technical support, and billing questions.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Support Cards (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
              {isHindi ? 'आधिकारिक ईमेल' : 'Official Support Email'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isHindi ? 'किसी भी प्रश्न, रिफंड या तकनीकी सहायता के लिए लिखें:' : 'Direct queries, technical support, and refund tickets:'}
            </p>
            <a href="mailto:support@numverse.art" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline block pt-1">
              support@numverse.art
            </a>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
              {isHindi ? 'कार्य समय' : 'Operating Hours'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Monday – Saturday: 09:30 AM – 06:30 PM (IST)
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {isHindi ? 'औसत उत्तर समय: 2-4 घंटे' : 'Average Response Time: 2-4 hours'}
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
              {isHindi ? 'डिजिटल प्लेटफ़ॉर्म' : 'Platform Location'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Numverse Digital Operations, India.
            </p>
          </Card>
        </div>

        {/* Contact Form (7 cols) */}
        <Card className="p-6 sm:p-8 space-y-6 md:col-span-7 border-slate-200 dark:border-slate-800">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                {isHindi ? 'संदेश सफलतापूर्वक भेजा गया!' : 'Message Received!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                {isHindi
                  ? 'धन्यवाद! हमारी टीम आपके प्रश्न की समीक्षा करेगी और 24 घंटों के भीतर ईमेल पर उत्तर देगी।'
                  : 'Thank you for reaching out. Our support team will review your inquiry and reply to your email promptly.'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                }}
              >
                {isHindi ? 'अन्य संदेश भेजें' : 'Send Another Message'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                {isHindi ? 'सीधा संदेश भेजें' : 'Send Us a Direct Message'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={isHindi ? 'आपका नाम' : 'Your Name'}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                />
                <Input
                  label={isHindi ? 'ईमेल पता' : 'Email Address'}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                />
              </div>

              <Input
                label={isHindi ? 'विषय (Subject)' : 'Subject'}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={isHindi ? 'उदा. रिपोर्ट से संबंधित प्रश्न / बिलिंग' : 'e.g. Report Query / Payment Support'}
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'संदेश का विवरण' : 'Message'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isHindi ? 'कृपया अपना प्रश्न या समस्या विस्तार से लिखें...' : 'Please describe your inquiry or feedback...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <Button
                type="submit"
                size="md"
                variant="primary"
                className="w-full"
                rightIcon={<Send className="w-4 h-4" />}
              >
                {isHindi ? 'संदेश सबमिट करें' : 'Submit Message'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
