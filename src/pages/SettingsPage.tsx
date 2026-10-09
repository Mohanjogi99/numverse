import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { useToast } from '../context/ToastContext';
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

  const [displayName, setDisplayName] = useState('Explorer');
  const [email, setEmail] = useState('explorer@example.com');
  const [language, setLanguage] = useState('en');
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences saved successfully.', 'success');
  };

  const handleClearSession = () => {
    sessionStorage.clear();
    showToast('Local session cache cleared.', 'success');
  };

  const handleLogout = () => {
    showToast('Logged out of active guest session.', 'info');
  };

  const handleDeleteAccountPlaceholder = () => {
    showToast('Account deletion workflow will be available with Firebase Auth in upcoming phase.', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900">
          Preferences & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your account profile, privacy controls, and local session preferences.
        </p>
      </div>

      <form onSubmit={handleSaveChanges} className="space-y-6">
        {/* 1. Profile Section (Section 51) */}
        <Card className="p-6 space-y-4 border-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Profile Details</h2>
              <p className="text-xs text-slate-500">Your public self-discovery handle.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </Card>

        {/* 2. Language Section (Section 51) */}
        <Card className="p-6 space-y-4 border-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Language & Region</h2>
              <p className="text-xs text-slate-500">Choose your preferred reflection language.</p>
            </div>
          </div>

          <div>
            <label htmlFor="language-select" className="block text-sm font-medium text-slate-700 mb-1.5">
              Interface Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm sm:text-base text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
            >
              <option value="en">English (Global)</option>
              <option value="hi">Hindi (Coming Soon)</option>
            </select>
          </div>
        </Card>

        {/* 3. Privacy Section (Section 51) */}
        <Card className="p-6 space-y-4 border-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Privacy & Session Data</h2>
              <p className="text-xs text-slate-500">Control your local storage and anonymous diagnostics.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-700">Anonymous analytics event tracking</span>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-semibold text-slate-800 block">Session History</span>
                <span className="text-slate-500 text-xs">Clear locally cached analyses from browser</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearSession}
                leftIcon={<Trash2 className="w-4 h-4 text-slate-500" />}
              >
                Clear Cache
              </Button>
            </div>
          </div>
        </Card>

        {/* 4. Account & Destructive Action Section (Section 51) */}
        <Card className="p-6 space-y-4 border-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Account Actions</h2>
              <p className="text-xs text-slate-500">Session sign out and account management.</p>
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
              Sign Out
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDeleteAccountPlaceholder}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Account
            </Button>
          </div>
        </Card>

        {/* Save Changes Button */}
        <div className="pt-2">
          <Button type="submit" size="lg" variant="primary" leftIcon={<CheckCircle2 className="w-5 h-5" />}>
            Save Changes
          </Button>
        </div>
      </form>

      <DisclaimerBanner variant="card" />
    </div>
  );
};
