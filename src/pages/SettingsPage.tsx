import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  Globe,
  Shield,
  Trash2,
  CheckCircle2,
  LogOut,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const { language, setLanguage, isHindi } = useLanguage();

  const [displayName, setDisplayName] = useState('Explorer');
  const [email, setEmail] = useState('explorer@example.com');
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(isHindi ? 'प्राथमिकताएं सफलतापूर्वक सहेजी गईं।' : 'Preferences saved successfully.', 'success');
  };

  const handleClearSession = () => {
    sessionStorage.clear();
    showToast(isHindi ? 'स्थानीय सत्र कैश साफ़ कर दिया गया।' : 'Local session cache cleared.', 'success');
  };

  const handleLogout = () => {
    showToast(isHindi ? 'सक्रिय अतिथि सत्र से लॉग आउट किया गया।' : 'Logged out of active guest session.', 'info');
  };

  const handleDeleteAccountPlaceholder = () => {
    showToast(isHindi ? 'खाता हटाने की सुविधा आगामी अपडेट में उपलब्ध होगी।' : 'Account deletion workflow will be available with Firebase Auth in upcoming phase.', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900">
          {isHindi ? 'प्राथमिकताएं और सेटिंग्स' : 'Preferences & Settings'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isHindi
            ? 'अपनी खाता प्रोफ़ाइल, गोपनीयता नियंत्रण और स्थानीय सत्र प्राथमिकताओं को प्रबंधित करें।'
            : 'Manage your account profile, privacy controls, and local session preferences.'}
        </p>
      </div>

      <form onSubmit={handleSaveChanges} className="space-y-6">
        {/* 1. Profile Section */}
        <Card className="p-6 space-y-4 border-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isHindi ? 'प्रोफ़ाइल विवरण' : 'Profile Details'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi ? 'आपका सार्वजनिक आत्म-खोज नाम।' : 'Your public self-discovery handle.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={isHindi ? 'प्रदर्शित नाम' : 'Display Name'}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Input
              label={isHindi ? 'ईमेल पता' : 'Email Address'}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </Card>

        {/* 2. Language Section */}
        <Card className="p-6 space-y-4 border-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isHindi ? 'भाषा और क्षेत्र' : 'Language & Region'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi ? 'अपनी पसंदीदा रिफ्लेक्शन भाषा चुनें।' : 'Choose your preferred reflection language.'}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="language-select" className="block text-sm font-medium text-slate-700 mb-1.5">
              {isHindi ? 'इंटरफ़ेस भाषा' : 'Interface Language'}
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
              className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm sm:text-base text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none font-medium"
            >
              <option value="en">English (ग्लोबल)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </Card>

        {/* 3. Privacy Section */}
        <Card className="p-6 space-y-4 border-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isHindi ? 'गोपनीयता और सत्र डेटा' : 'Privacy & Session Data'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi ? 'अपने स्थानीय स्टोरेज और अनाम डायग्नोस्टिक्स को नियंत्रित करें।' : 'Control your local storage and anonymous diagnostics.'}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-700">
                {isHindi ? 'अनाम एनालिटिक्स इवेंट ट्रैकिंग' : 'Anonymous analytics event tracking'}
              </span>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-semibold text-slate-800 block">
                  {isHindi ? 'सत्र इतिहास' : 'Session History'}
                </span>
                <span className="text-slate-500 text-xs">
                  {isHindi ? 'ब्राउज़र से स्थानीय रूप से सहेजे गए विश्लेषण हटाएं' : 'Clear locally cached analyses from browser'}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearSession}
                leftIcon={<Trash2 className="w-4 h-4 text-slate-500" />}
              >
                {isHindi ? 'कैश साफ़ करें' : 'Clear Cache'}
              </Button>
            </div>
          </div>
        </Card>

        {/* 4. Account & Destructive Action Section */}
        <Card className="p-6 space-y-4 border-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isHindi ? 'खाता क्रियाएं' : 'Account Actions'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi ? 'सत्र से साइन आउट और खाता प्रबंधन।' : 'Session sign out and account management.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              {isHindi ? 'साइन आउट' : 'Sign Out'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDeleteAccountPlaceholder}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              {isHindi ? 'खाता हटाएं' : 'Delete Account'}
            </Button>
          </div>
        </Card>

        {/* Save Changes Button */}
        <div className="pt-2">
          <Button type="submit" size="lg" variant="primary" leftIcon={<CheckCircle2 className="w-5 h-5" />}>
            {isHindi ? 'बदलाव सहेजें' : 'Save Changes'}
          </Button>
        </div>
      </form>

      <DisclaimerBanner variant="card" />
    </div>
  );
};
