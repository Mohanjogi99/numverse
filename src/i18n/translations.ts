export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  common: {
    appName: string;
    tagline: string;
    selfDiscoveryEngine: string;
    loading: string;
    error: string;
    retry: string;
    back: string;
    next: string;
    submit: string;
    share: string;
    print: string;
    download: string;
    close: string;
    viewDetails: string;
    disclaimerShort: string;
    disclaimerFull: string;
  };
  nav: {
    home: string;
    numberAnalysis: string;
    personalityTest: string;
    about: string;
    compatibility: string;
    soon: string;
    dashboard: string;
    settings: string;
    takeTest: string;
    analyzeNumber: string;
  };
  home: {
    heroBadge: string;
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    analyzeBtn: string;
    takeTestBtn: string;
    spectrumTitle: string;
    spectrumPreview: string;
    discoverDominantBtn: string;
    methodologyTitle: string;
    methodologyHeading: string;
    methodologySubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    numberThemesBadge: string;
    numberThemesHeading: string;
    numberThemesSubtitle: string;
    personalityBadge: string;
    personalityHeading: string;
    personalitySubtitle: string;
    explorePersonalityBtn: string;
    archetypesBadge: string;
    archetypesHeading: string;
    archetypesSubtitle: string;
    exploreAllArchetypesBtn: string;
    pricingBadge: string;
    pricingHeading: string;
    pricingSubtitle: string;
    freeTitle: string;
    freePrice: string;
    standardTitle: string;
    standardPrice: string;
    completeTitle: string;
    completePrice: string;
    comboTitle: string;
    comboPrice: string;
    comboBadge: string;
    trustPrivate: string;
    trustPrivateDesc: string;
    trustReflection: string;
    trustReflectionDesc: string;
    trustHonest: string;
    trustHonestDesc: string;
    trustSecure: string;
    trustSecureDesc: string;
  };
  numberAnalysis: {
    title: string;
    subtitle: string;
    mobileTab: string;
    dobTab: string;
    mobileLabel: string;
    mobilePlaceholder: string;
    mobileHint: string;
    dobLabel: string;
    dobHint: string;
    analyzeCta: string;
    recentSearches: string;
    privacyNotice: string;
    invalidMobile: string;
    invalidDob: string;
  };
  numberResult: {
    title: string;
    dominantTheme: string;
    secondaryTheme: string;
    frequencyTitle: string;
    spectrumTitle: string;
    strengthsTitle: string;
    challengesTitle: string;
    takePersonalityNext: string;
    takePersonalityNextDesc: string;
    takePersonalityBtn: string;
  };
  personalityTest: {
    title: string;
    subtitle: string;
    selectTier: string;
    miniTier: string;
    miniTierDesc: string;
    standardTier: string;
    standardTierDesc: string;
    completeTier: string;
    completeTierDesc: string;
    startTestBtn: string;
    questionCounter: string;
    optStronglyDisagree: string;
    optDisagree: string;
    optNeutral: string;
    optAgree: string;
    optStronglyAgree: string;
    prevBtn: string;
    nextBtn: string;
    finishBtn: string;
  };
  personalityResult: {
    title: string;
    archetypeTitle: string;
    dimensionScoresTitle: string;
    unlockFusionCta: string;
    unlockFusionDesc: string;
    unlockFusionBtn: string;
  };
  checkout: {
    title: string;
    orderSummary: string;
    oneTime: string;
    oneTimePayment: string;
    billingDetails: string;
    yourName: string;
    nameLabel: string;
    emailReceipt: string;
    emailLabel: string;
    included: string;
    includedTitle: string;
    includedBadge: string;
    gstIncluded: string;
    totalPayable: string;
    totalAmount: string;
    sslBadge: string;
    encryptedNotice: string;
    testModeBadge: string;
    pay: string;
    unlock: string;
    payBtn: string;
    processing: string;
  };
  report: {
    title: string;
    returnHome: string;
    share: string;
    print: string;
    lockedTitle: string;
    lockedDesc: string;
    unlockReport: string;
    synergyIndex: string;
    unifiedIdentity: string;
    fusionBadge: string;
    languageSwitch: string;
    aiNarrativeTitle: string;
    generatingStory: string;
    regenerateBtn: string;
    strengthsTitle: string;
    challengesTitle: string;
    pillarsTitle: string;
    pillarsDesc: string;
    sixPillarsTitle: string;
    pillarLove: string;
    pillarCareer: string;
    pillarMoney: string;
    pillarCommunication: string;
    pillarLearning: string;
    pillarGrowth: string;
  };
  footer: {

    aboutText: string;
    quickLinks: string;
    legalDisclaimer: string;
    rightsReserved: string;
    entertainmentOnly: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    common: {
      appName: 'Numverse',
      tagline: 'Numbers की दुनिया',
      selfDiscoveryEngine: 'Universe of Numbers & Personality Tools',
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      share: 'Share',
      print: 'Print Report',
      download: 'Download',
      close: 'Close',
      viewDetails: 'View Details',
      disclaimerShort: 'For self-reflection and entertainment only. Not professional psychological or financial advice.',
      disclaimerFull: 'Numverse (Numbers की दुनिया) is an expansive self-reflection and personality universe blending numerological insights with psychological self-discovery tools.',
    },
    nav: {
      home: 'Home',
      numberAnalysis: 'Number Analysis',
      personalityTest: 'Personality Test',
      about: 'About',
      compatibility: 'Compatibility',
      soon: 'Soon',
      dashboard: 'Dashboard',
      settings: 'Settings',
      takeTest: 'Take Test',
      analyzeNumber: 'Analyze Number',
    },
    home: {
      heroBadge: 'Know Your Numbers. Discover Yourself.',
      heroTitlePrefix: 'Discover the Story',
      heroTitleHighlight: 'Behind You',
      heroSubtitle: 'Explore your number patterns and personality to discover a unique self-reflection profile.',
      analyzeBtn: 'Analyze My Number',
      takeTestBtn: 'Take Personality Test',
      spectrumTitle: 'The 0–9 Spectrum',
      spectrumPreview: 'Interactive Preview',
      discoverDominantBtn: 'Discover Your Dominant Theme',
      methodologyTitle: 'Methodology',
      methodologyHeading: 'How It Works',
      methodologySubtitle: 'A simple 3-step path to discover the structured patterns behind your numbers.',
      step1Title: '1. Enter',
      step1Desc: 'Enter your mobile number or birth date.',
      step2Title: '2. Discover',
      step2Desc: 'Explore your number and personality patterns.',
      step3Title: '3. Understand',
      step3Desc: 'Get your personalized Number Story.',
      numberThemesBadge: 'Core Framework',
      numberThemesHeading: 'Explore the 10 Number Themes',
      numberThemesSubtitle: 'Each digit represents a unique thematic archetypal energy. Click any theme to explore its dedicated profile.',
      personalityBadge: 'Multi-Layer Self-Reflection',
      personalityHeading: 'Your Number Is Only Part of the Story',
      personalitySubtitle: 'Numbers provide one layer of your profile. Your personality responses add another perspective.',
      explorePersonalityBtn: 'Explore My Personality',
      archetypesBadge: 'Archetypal Profiles',
      archetypesHeading: 'The 10 Personality Types',
      archetypesSubtitle: 'Structured behavioral patterns across 6 psychological dimensions.',
      exploreAllArchetypesBtn: 'Explore All Personality Types',
      pricingBadge: 'Plans & Tiers',
      pricingHeading: 'Choose Your Reflection Depth',
      pricingSubtitle: 'Transparent pricing designed for self-discovery and entertainment.',
      freeTitle: 'FREE',
      freePrice: '₹0',
      standardTitle: 'STANDARD',
      standardPrice: '₹49',
      completeTitle: 'COMPLETE',
      completePrice: '₹99',
      comboTitle: 'COMBO',
      comboPrice: '₹149',
      comboBadge: 'COMBO — BEST VALUE',
      trustPrivate: 'Private by Design',
      trustPrivateDesc: 'Numbers are normalized securely and never published publicly.',
      trustReflection: 'Self-Reflection Focused',
      trustReflectionDesc: 'Thoughtful psychological prompts crafted for self-discovery.',
      trustHonest: 'No Guaranteed Predictions',
      trustHonestDesc: 'Honest, non-prescriptive framing for personal reflection.',
      trustSecure: 'Secure Payments',
      trustSecureDesc: 'Encrypted transaction architecture for premium offerings.',
    },
    numberAnalysis: {
      title: 'Analyze Your Numbers',
      subtitle: 'Enter your mobile number or date of birth to reveal your dominant numerical energy patterns.',
      mobileTab: 'Mobile Number',
      dobTab: 'Date of Birth',
      mobileLabel: '10-Digit Mobile Number',
      mobilePlaceholder: 'e.g. 9876543210',
      mobileHint: 'Enter 10-digit Indian mobile number without +91 or country code.',
      dobLabel: 'Select Date of Birth',
      dobHint: 'Your birth date provides your core lifepath & root number energy.',
      analyzeCta: 'Analyze Pattern Now',
      recentSearches: 'Recent Analyses',
      privacyNotice: 'Your input is processed strictly in-memory and never shared.',
      invalidMobile: 'Please enter a valid 10-digit mobile number.',
      invalidDob: 'Please select a valid date of birth.',
    },
    numberResult: {
      title: 'Number Analysis Results',
      dominantTheme: 'Dominant Energy Theme',
      secondaryTheme: 'Secondary Supporting Energy',
      frequencyTitle: 'Digit Frequency Distribution',
      spectrumTitle: 'Core Thematic Spectrum',
      strengthsTitle: 'Primary Strengths',
      challengesTitle: 'Growth Opportunities',
      takePersonalityNext: 'Complete Your Dual Reflection',
      takePersonalityNextDesc: 'Combine this numerical profile with your behavioral personality test to unlock your Complete Fusion Report.',
      takePersonalityBtn: 'Take Personality Test Now',
    },
    personalityTest: {
      title: 'Psychological Self-Reflection Test',
      subtitle: 'Answer honest questions to map your score across 6 key personality dimensions.',
      selectTier: 'Choose Your Test Tier',
      miniTier: '10 Questions (Quick Free)',
      miniTierDesc: 'Essential archetype snapshot in 2 minutes.',
      standardTier: '25 Questions (Standard ₹49)',
      standardTierDesc: 'Detailed multi-pillar profile analysis.',
      completeTier: '50 Questions (Complete ₹99)',
      completeTierDesc: 'Comprehensive psychological breakdown across all dimensions.',
      startTestBtn: 'Start Reflection Test',
      questionCounter: 'Question',
      optStronglyDisagree: 'Strongly Disagree',
      optDisagree: 'Disagree',
      optNeutral: 'Neutral',
      optAgree: 'Agree',
      optStronglyAgree: 'Strongly Agree',
      prevBtn: 'Previous Question',
      nextBtn: 'Next Question',
      finishBtn: 'Complete & View Results',
    },
    personalityResult: {
      title: 'Your Personality Archetype',
      archetypeTitle: 'Primary Archetype',
      dimensionScoresTitle: 'Dimensional Trait Breakdown',
      unlockFusionCta: 'Unlock Your Number + Personality Fusion',
      unlockFusionDesc: 'Synthesize your number frequencies with your psychological traits into an AI-narrated 6-pillar life profile.',
      unlockFusionBtn: 'View Complete Premium Report',
    },
    checkout: {
      title: 'Secure Checkout',
      orderSummary: 'Order Summary',
      oneTime: 'One-time payment',
      oneTimePayment: 'One-time payment',
      billingDetails: 'Billing Details',
      yourName: 'Your Name',
      nameLabel: 'Your Full Name',
      emailReceipt: 'Email (For Receipt)',
      emailLabel: 'Email (For Report Receipt)',
      included: 'What is included in this tier:',
      includedTitle: 'What is included in this tier:',
      includedBadge: 'Included',
      gstIncluded: 'GST & Platform Fee Included',
      totalPayable: 'Total Amount Payable',
      totalAmount: 'Total Payable Amount',
      sslBadge: '256-Bit SSL Encrypted Razorpay Checkout',
      encryptedNotice: '256-Bit SSL Encrypted Razorpay Checkout',
      testModeBadge: 'Test Mode',
      pay: 'Pay',
      unlock: 'Unlock Report',
      payBtn: 'Pay & Unlock Premium Report',
      processing: 'Processing Order...',
    },
    report: {
      title: 'Complete Number Story Report',
      returnHome: 'Return Home',
      share: 'Share',
      print: 'Print',
      lockedTitle: 'Premium Fusion Report Preview',
      lockedDesc: 'Unlock full access to all 6 detailed life pillars, AI personalized narrative, and future PDF export.',
      unlockReport: 'Unlock Full Report',
      synergyIndex: 'Harmonic Synergy Index',
      unifiedIdentity: 'Unified Fusion Identity',
      fusionBadge: '40% Number + 60% Personality Fusion',
      languageSwitch: 'Language / भाषा',
      aiNarrativeTitle: 'AI Personalized Narrative Story',
      generatingStory: 'Synthesizing your personalized story...',
      regenerateBtn: 'Regenerate Narrative',
      strengthsTitle: 'Core Synthesized Strengths',
      challengesTitle: 'Growth & Blindspot Guidance',
      pillarsTitle: 'Deterministic Life Pillars & Calculations',
      pillarsDesc: 'Mathematical baseline evaluations from your Numverse calculation engines.',
      sixPillarsTitle: '6-Pillar Life Profile',
      pillarLove: 'Love & Relationships',
      pillarCareer: 'Career & Ambition',
      pillarMoney: 'Money & Wealth Mindset',
      pillarCommunication: 'Communication Style',
      pillarLearning: 'Learning & Curiosity',
      pillarGrowth: 'Personal Growth & Evolution',
    },

    footer: {
      aboutText: 'Numverse (Numbers की दुनिया) is a modern self-discovery universe connecting deterministic numbers with multi-dimensional personality tools and archetypes.',
      quickLinks: 'Quick Links',
      legalDisclaimer: 'Legal & Entertainment Disclaimer',
      rightsReserved: 'All rights reserved.',
      entertainmentOnly: 'Designed exclusively for self-reflection and entertainment purposes.',
    },
  },
  hi: {
    common: {
      appName: 'Numverse',
      tagline: 'Numbers की दुनिया',
      selfDiscoveryEngine: 'Numbers की दुनिया — अंक एवं व्यक्तित्व ब्रह्मांड',
      loading: 'लोड हो रहा है...',
      error: 'एक त्रुटि हुई',
      retry: 'पुनः प्रयास करें',
      back: 'पीछे जाएं',
      next: 'आगे बढ़ें',
      submit: 'सबमिट करें',
      share: 'शेयर करें',
      print: 'रिपोर्ट प्रिंट करें',
      download: 'डाउनलोड करें',
      close: 'बंद करें',
      viewDetails: 'विवरण देखें',
      disclaimerShort: 'केवल आत्म-चिंतन और मनोरंजन के लिए। यह कोई चिकित्सीय या वित्तीय सलाह नहीं है।',
      disclaimerFull: 'Numverse (Numbers की दुनिया) एक आत्म-चिंतन और व्यक्तित्व अन्वेषण मंच है जो अंकशास्त्रीय प्रतिरूपों और मनोवैज्ञानिक परीक्षणों का संयोजन करता है। यह भविष्य की भविष्यवाणी नहीं करता है।',
    },
    nav: {
      home: 'होम',
      numberAnalysis: 'अंक विश्लेषण',
      personalityTest: 'व्यक्तित्व परीक्षण',
      about: 'हमारे बारे में',
      compatibility: 'अनुकूलता',
      soon: 'जल्द',
      dashboard: 'डैशबोर्ड',
      settings: 'सेटिंग्स',
      takeTest: 'परीक्षण दें',
      analyzeNumber: 'नंबर विश्लेषण',
    },
    home: {
      heroBadge: 'Numbers की दुनिया — Know Your Numbers',
      heroTitlePrefix: 'पहचानें अपनी कहानी',
      heroTitleHighlight: 'अंकों के संग',
      heroSubtitle: 'अपने मोबाइल नंबर, जन्मतिथि और व्यक्तित्व पैटर्न के माध्यम से एक अनूठी आत्म-चिंतन यात्रा का अनुभव करें।',
      analyzeBtn: 'मेरा नंबर विश्लेषण करें',
      takeTestBtn: 'व्यक्तित्व परीक्षण दें',
      spectrumTitle: '0 से 9 का ऊर्जा स्पेक्ट्रम',
      spectrumPreview: 'इंटरैक्टिव पूर्वावलोकन',
      discoverDominantBtn: 'अपना मुख्य अंक विषय जानें',
      methodologyTitle: 'कार्यप्रणाली',
      methodologyHeading: 'यह कैसे काम करता है?',
      methodologySubtitle: 'अपने अंकों और व्यक्तित्व के पीछे छिपे पैटर्न को समझने के लिए 3 सरल कदम।',
      step1Title: '1. दर्ज करें',
      step1Desc: 'अपना मोबाइल नंबर या जन्मतिथि दर्ज करें।',
      step2Title: '2. खोजें',
      step2Desc: 'अपने अंक और व्यक्तित्व के पैटर्न को एक्सप्लोर करें।',
      step3Title: '3. समझें',
      step3Desc: 'अपनी व्यक्तिगत नंबर स्टोरी रिपोर्ट प्राप्त करें।',
      numberThemesBadge: 'मूल आधार',
      numberThemesHeading: '10 अंक ऊर्जा थीम का अन्वेषण करें',
      numberThemesSubtitle: 'प्रत्येक अंक (0–9) एक अद्वितीय ऊर्जा और व्यवहार का प्रतिनिधित्व करता है। किसी भी अंक का विवरण देखने के लिए उस पर क्लिक करें।',
      personalityBadge: 'बहुआयामी आत्म-चिंतन',
      personalityHeading: 'अंक आपकी कहानी का केवल एक हिस्सा हैं',
      personalitySubtitle: 'अंक आपकी ऊर्जा का एक आयाम दर्शाते हैं, जबकि आपके विचार और प्रतिक्रियाएं व्यक्तित्व की गहराई को जोड़ती हैं।',
      explorePersonalityBtn: 'व्यक्तित्व परीक्षण शुरू करें',
      archetypesBadge: 'व्यक्तित्व प्रारूप',
      archetypesHeading: '10 व्यक्तित्व प्रकार (Archetypes)',
      archetypesSubtitle: '6 मनोवैज्ञानिक आयामों पर आधारित संरचित व्यावहारिक पैटर्न।',
      exploreAllArchetypesBtn: 'सभी 10 व्यक्तित्व प्रकार देखें',
      pricingBadge: 'योजनाएं एवं मूल्य',
      pricingHeading: 'अपनी आत्म-खोज की गहराई चुनें',
      pricingSubtitle: 'आत्म-चिंतन और मनोरंजन के लिए पारदर्शी और उचित मूल्य।',
      freeTitle: 'निःशुल्क (FREE)',
      freePrice: '₹0',
      standardTitle: 'स्टैंडर्ड (STANDARD)',
      standardPrice: '₹49',
      completeTitle: 'कम्प्लीट (COMPLETE)',
      completePrice: '₹99',
      comboTitle: 'कॉम्बो (COMBO)',
      comboPrice: '₹149',
      comboBadge: 'कॉम्बो — सर्वश्रेष्ठ मूल्य',
      trustPrivate: 'गोपनीयता सर्वप्रथम',
      trustPrivateDesc: 'नंबर सुरक्षित रूप से विश्लेषित होते हैं और कभी सार्वजनिक नहीं किए जाते।',
      trustReflection: 'आत्म-चिंतन पर केंद्रित',
      trustReflectionDesc: 'आत्म-जागरूकता और व्यक्तिगत स्पष्टता के लिए तैयार किए गए मनोवैज्ञानिक प्रश्न।',
      trustHonest: 'कोई झूठे दावे नहीं',
      trustHonestDesc: 'बिना किसी अंधविश्वास या गारंटीड भविष्यवाणियों के शुद्ध आत्म-चिंतन।',
      trustSecure: 'सुरक्षित भुगतान',
      trustSecureDesc: 'प्रीमियम रिपोर्ट के लिए 256-बिट सुरक्षित भुगतान प्रणाली।',
    },
    numberAnalysis: {
      title: 'अपने अंकों का विश्लेषण करें',
      subtitle: 'अपना 10-अंकीय मोबाइल नंबर या जन्मतिथि दर्ज करें और अपने अंकों की मुख्य ऊर्जा को पहचानें।',
      mobileTab: 'मोबाइल नंबर',
      dobTab: 'जन्मतिथि (DOB)',
      mobileLabel: '10 अंकों का मोबाइल नंबर',
      mobilePlaceholder: 'उदा. 9876543210',
      mobileHint: '+91 या देश कोड के बिना 10 अंकों का भारतीय नंबर दर्ज करें।',
      dobLabel: 'जन्मतिथि चुनें',
      dobHint: 'आपकी जन्मतिथि आपकी मूल जीवन-ऊर्जा (Life Path) को दर्शाती है।',
      analyzeCta: 'पैटर्न का विश्लेषण करें',
      recentSearches: 'हालिया विश्लेषण',
      privacyNotice: 'आपका डेटा केवल तात्कालिक विश्लेषण के लिए उपयोग होता है और सुरक्षित रहता है।',
      invalidMobile: 'कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।',
      invalidDob: 'कृपया एक मान्य जन्मतिथि चुनें।',
    },
    numberResult: {
      title: 'अंक विश्लेषण परिणाम',
      dominantTheme: 'मुख्य ऊर्जा थीम (Primary)',
      secondaryTheme: 'सहायक ऊर्जा थीम (Secondary)',
      frequencyTitle: 'अंकों की आवृत्ति वितरण',
      spectrumTitle: 'ऊर्जा स्पेक्ट्रम अवलोकन',
      strengthsTitle: 'मुख्य विशेषताएं एवं ताकत',
      challengesTitle: 'सुधार एवं विकास के अवसर',
      takePersonalityNext: 'अपनी दोहरी रिपोर्ट पूरी करें',
      takePersonalityNextDesc: 'अपने अंक परिणाम को व्यक्तित्व परीक्षण के साथ मिलाकर संपूर्ण फ्यूजन रिपोर्ट अनलॉक करें।',
      takePersonalityBtn: 'व्यक्तित्व परीक्षण अभी दें',
    },
    personalityTest: {
      title: 'मनोवैज्ञानिक आत्म-चिंतन परीक्षण',
      subtitle: '6 प्रमुख व्यक्तित्व आयामों में अपना स्कोर जानने के लिए प्रश्नों के ईमानदारी से उत्तर दें।',
      selectTier: 'परीक्षण का स्तर चुनें',
      miniTier: '10 प्रश्न (त्वरित निःशुल्क)',
      miniTierDesc: '2 मिनट में संक्षिप्त व्यक्तित्व स्नैपशॉट।',
      standardTier: '25 प्रश्न (स्टैंडर्ड ₹49)',
      standardTierDesc: 'विस्तृत बहुआयामी प्रोफाइल विश्लेषण।',
      completeTier: '50 प्रश्न (कम्प्लीट ₹99)',
      completeTierDesc: 'सभी 6 आयामों का गहन और संपूर्ण विश्लेषण।',
      startTestBtn: 'परीक्षण शुरू करें',
      questionCounter: 'प्रश्न संख्या',
      optStronglyDisagree: 'पूर्णतः असहमत',
      optDisagree: 'असहमत',
      optNeutral: 'तटस्थ (Neutral)',
      optAgree: 'सहमत',
      optStronglyAgree: 'पूर्णतः सहमत',
      prevBtn: 'पिछला प्रश्न',
      nextBtn: 'अगला प्रश्न',
      finishBtn: 'समाप्त करें और परिणाम देखें',
    },
    personalityResult: {
      title: 'आपका व्यक्तित्व प्रकार (Archetype)',
      archetypeTitle: 'मुख्य व्यक्तित्व प्रकार',
      dimensionScoresTitle: '6 मनोवैज्ञानिक आयामों का स्कोर',
      unlockFusionCta: 'नंबर + व्यक्तित्व का महा-संगम अनलॉक करें',
      unlockFusionDesc: 'अपने अंकों और व्यक्तित्व लक्षणों को मिलाकर जीवन के 6 स्तंभों (प्रेम, करियर, धन, संवाद, सीखना, विकास) पर AI रिपोर्ट प्राप्त करें।',
      unlockFusionBtn: 'संपूर्ण प्रीमियम रिपोर्ट देखें',
    },
    checkout: {
      title: 'सुरक्षित चेकआउट',
      orderSummary: 'ऑर्डर का विवरण',
      oneTime: 'एकमुश्त भुगतान',
      oneTimePayment: 'एकमुश्त भुगतान (One-Time)',
      billingDetails: 'बिलिंग जानकारी',
      yourName: 'आपका नाम',
      nameLabel: 'आपका पूरा नाम',
      emailReceipt: 'ईमेल (रसीद के लिए)',
      emailLabel: 'ईमेल पता (रसीद और रिपोर्ट के लिए)',
      included: 'इस पैकेज में शामिल विशेषताएं:',
      includedTitle: 'इस पैकेज में शामिल विशेषताएं:',
      includedBadge: 'शामिल है',
      gstIncluded: 'GST और सभी शुल्क शामिल हैं',
      totalPayable: 'कुल देय राशि',
      totalAmount: 'कुल देय राशि',
      sslBadge: '256-बिट एसएसएल एन्क्रिप्टेड रेज़रपे चेकआउट',
      encryptedNotice: '256-बिट एसएसएल एन्क्रिप्टेड रेज़रपे चेकआउट',
      testModeBadge: 'टेस्ट मोड',
      pay: 'भुगतान करें',
      unlock: 'रिपोर्ट अनलॉक करें',
      payBtn: 'भुगतान करें और रिपोर्ट अनलॉक करें',
      processing: 'ऑर्डर प्रोसेस हो रहा है...',
    },
    report: {
      title: 'संपूर्ण नंबर स्टोरी प्रीमियम रिपोर्ट',
      returnHome: 'होमपेज पर वापस जाएं',
      share: 'शेयर करें',
      print: 'प्रिंट करें',
      lockedTitle: 'प्रीमियम फ्यूजन रिपोर्ट पूर्वावलोकन',
      lockedDesc: 'सभी 6 जीवन स्तंभों, AI व्यक्तिगत कहानी और PDF रिपोर्ट के लिए पूर्ण एक्सेस अनलॉक करें।',
      unlockReport: 'संपूर्ण रिपोर्ट अनलॉक करें',
      synergyIndex: 'हार्मोनिक सिनर्जी इंडेक्स',
      unifiedIdentity: 'एकीकृत फ्यूजन पहचान',
      fusionBadge: '40% अंक + 60% व्यक्तित्व का वैज्ञानिक संगम',
      languageSwitch: 'भाषा / Language',
      aiNarrativeTitle: 'AI व्यक्तिगत आख्यान (Personal Narrative)',
      generatingStory: 'आपकी व्यक्तिगत कहानी तैयार हो रही है...',
      regenerateBtn: 'कहानी पुनः उत्पन्न करें',
      strengthsTitle: 'समन्वित मुख्य ताकतें',
      challengesTitle: 'विकास एवं सावधानी बिंदु',
      pillarsTitle: 'जीवन के 6 प्राथमिक स्तंभ और गणना',
      pillarsDesc: 'Numverse गणना इंजन से प्राप्त गणितीय और मनोवैज्ञानिक मूल्यांकन।',
      sixPillarsTitle: 'जीवन के 6 प्रमुख स्तंभ',
      pillarLove: 'प्रेम और संबंध',
      pillarCareer: 'करियर और महत्वाकांक्षा',
      pillarMoney: 'धन और वित्तीय दृष्टिकोण',
      pillarCommunication: 'संवाद और अभिव्यक्ति',
      pillarLearning: 'ज्ञान और सीखने की शैली',
      pillarGrowth: 'व्यक्तिगत विकास और प्रगति',
    },

    footer: {
      aboutText: 'Numverse (Numbers की दुनिया) एक आधुनिक आत्म-चिंतन और व्यक्तित्व अन्वेषण मंच है जो अंकशास्त्रीय ऊर्जा और मनोवैज्ञानिक परीक्षणों का अद्भुत संगम प्रस्तुत करता है।',
      quickLinks: 'त्वरित लिंक',
      legalDisclaimer: 'कानूनी और मनोरंजन अस्वीकरण',
      rightsReserved: 'सर्वाधिकार सुरक्षित।',
      entertainmentOnly: 'केवल आत्म-चिंतन, आत्म-खोज और मनोरंजन के उद्देश्य से निर्मित।',
    },
  },
};
