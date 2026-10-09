import { NumberProfile, SingleDigit, NumberThemeName } from '../types/number';
import { PersonalityTypeArchetype } from '../types/personality';
import { NUMBER_PROFILES } from '../data/numberProfiles';
import { PERSONALITY_ARCHETYPES } from '../data/personalityTypes';
import { NUMBER_PROFILES_HI } from './numberProfilesHi';
import { PERSONALITY_ARCHETYPES_HI } from './personalityTypesHi';
import { Language } from './translations';

export function getLocalizedNumberProfile(digit: SingleDigit, lang: Language): NumberProfile {
  const base = NUMBER_PROFILES[digit];
  if (lang === 'hi' && NUMBER_PROFILES_HI[digit]) {
    const hi = NUMBER_PROFILES_HI[digit];
    return {
      ...base,
      theme: hi.theme as unknown as NumberThemeName,
      tagline: hi.tagline,
      description: hi.description,
      strengths: hi.strengths,
      challenges: hi.challenges,
    };
  }
  return base;
}

export function getLocalizedPersonalityArchetype(
  id: string,
  lang: Language
): PersonalityTypeArchetype {
  const base = PERSONALITY_ARCHETYPES[id] || Object.values(PERSONALITY_ARCHETYPES)[0];
  if (lang === 'hi' && PERSONALITY_ARCHETYPES_HI[id]) {
    const hi = PERSONALITY_ARCHETYPES_HI[id];
    return {
      ...base,
      title: hi.title,
      subtitle: hi.subtitle,
      tagline: hi.tagline,
      summary: hi.summary,
      coreTraits: hi.coreTraits,
      strengths: hi.strengths,
      challenges: hi.challenges,
    };
  }
  return base;
}
