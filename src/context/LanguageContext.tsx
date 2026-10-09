import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDictionary, TRANSLATIONS } from '../i18n/translations';
import { QUESTIONS_HI } from '../i18n/questionsHi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
  isHindi: boolean;
  getQuestionText: (question: { id: string; text: string }) => string;
  getOptionLabel: (weight: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'ns_selected_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'hi'; // Default to Hindi as per user request
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = TRANSLATIONS[language];
  const isHindi = language === 'hi';

  const getQuestionText = (question: { id: string; text: string }): string => {
    if (isHindi && QUESTIONS_HI[question.id]) {
      return QUESTIONS_HI[question.id];
    }
    return question.text;
  };

  const getOptionLabel = (weight: number): string => {
    switch (weight) {
      case 1:
        return t.personalityTest.optStronglyDisagree;
      case 2:
        return t.personalityTest.optDisagree;
      case 3:
        return t.personalityTest.optNeutral;
      case 4:
        return t.personalityTest.optAgree;
      case 5:
        return t.personalityTest.optStronglyAgree;
      default:
        return '';
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isHindi,
        getQuestionText,
        getOptionLabel,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
