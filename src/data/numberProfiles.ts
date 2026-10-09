import { NumberProfile, SingleDigit } from '../types/number';

export const NUMBER_PROFILES: Record<SingleDigit, NumberProfile> = {
  0: {
    number: 0,
    theme: 'Balance',
    tagline: 'The Harmonizer and Grounded Peacemaker',
    description:
      'Your profile suggests an innate inclination toward equilibrium, calmness, and patient observation. You tend to seek internal and external stability, acting as an anchor in chaotic situations.',
    strengths: [
      'Calm and measured demeanor under pressure',
      'High adaptability to evolving circumstances',
      'Natural diplomacy and conflict de-escalation',
      'Patience and long-term perspective',
      'Deep capacity for emotional grounding',
    ],
    challenges: [
      'Hesitation or indecision when rapid choices are required',
      'Tendency to avoid constructive conflict to maintain apparent peace',
      'Over-compromising personal needs for collective comfort',
    ],
    relationship:
      'In relationships, your patterns suggest a preference for gentle, low-drama partnerships where mutual respect and steady understanding form the foundation.',
    career:
      'You are likely to thrive in environments requiring mediation, steady systems thinking, quality assurance, strategic moderation, and sustainable growth.',
    money:
      'Your approach to finances leans toward steady conservation, prudent budgeting, and risk mitigation over speculative gambles.',
    communication:
      'Your communication style tends to be measured, attentive, and receptive, prioritizing clarity and empathy over aggressive debate.',
    learning:
      'You assimilate information best when given space to synthesize diverse viewpoints and reflect quietly without high-stress timers.',
    growth:
      'Embrace healthy assertiveness. Recognizing that temporary friction is often the essential bridge to genuine harmony will unlock your greatest evolution.',
    colorHex: '#64748B',
    accentClass: 'from-slate-500 to-indigo-600',
  },
  1: {
    number: 1,
    theme: 'Money',
    tagline: 'The Resourceful Builder and Independent Driver',
    description:
      'Your profile indicates strong ambition, self-reliance, and practical resourcefulness. You possess an innate drive to create tangible value and manifest ideas into concrete results.',
    strengths: [
      'Clear goal orientation and execution speed',
      'Self-driven autonomy and decisive initiative',
      'Sharp eye for value creation and resource optimization',
      'Resilience in pioneering new projects',
      'Practical problem-solving mindset',
    ],
    challenges: [
      'Impatience with slower processes or team members',
      'Internalized material and performance pressure',
      'Tendency to shoulder entire burdens alone instead of delegating',
    ],
    relationship:
      'Your dynamics indicate appreciation for partners who respect your independence, celebrate your milestones, and maintain their own strong self-identity.',
    career:
      'You excel in entrepreneurial ventures, commercial strategy, project leadership, financial planning, and high-agency operational roles.',
    money:
      'You view capital as an instrument of autonomy and expansion, actively seeking investment growth and practical security.',
    communication:
      'Direct, concise, and outcome-focused. You value brevity, clear action items, and measurable milestones.',
    learning:
      'Hands-on experimentation, trial-and-error, and rapid feedback loops accelerate your mastery more than theoretical discourse.',
    growth:
      'Practice collaborative trust. Allowing others to share responsibility multiplies your impact and eases unnecessary solo strain.',
    colorHex: '#0D9488',
    accentClass: 'from-teal-600 to-emerald-700',
  },
  2: {
    number: 2,
    theme: 'Partnership',
    tagline: 'The Empathetic Connector and Diplomatic Ally',
    description:
      'Your pattern highlights a deep affinity for collaboration, supportive companionship, and relational synergy. You understand how people interconnect and thrive in harmonious alliances.',
    strengths: [
      'Exceptional empathy and emotional intelligence',
      'Natural collaborative spirit and loyalty',
      'Tactful diplomacy and consensus-building',
      'Supportive mentorship and active listening',
      'Intuitive awareness of interpersonal dynamics',
    ],
    challenges: [
      'Vulnerability to approval-seeking and external validation',
      'Difficulty setting firm personal boundaries',
      'Hesitation to voice unpopular truths for fear of disharmony',
    ],
    relationship:
      'Relationships are central to your energy. You cultivate deep intimacy, mutual loyalty, and shared journeys of emotional understanding.',
    career:
      'You flourish in collaborative teams, partnership management, human resources, client relations, counseling, and cross-functional leadership.',
    money:
      'Financial decisions are frequently evaluated through the lens of family security, shared wellbeing, and collaborative ventures.',
    communication:
      'Warm, considerate, and validating. You instinctively create safe conversational spaces where others feel heard and respected.',
    learning:
      'Peer-to-peer discussion, group workshops, and collaborative study settings unlock your deepest intellectual engagement.',
    growth:
      'Cultivate sovereign self-validation. Your unique voice has standalone worth independent of collective consensus.',
    colorHex: '#3B82F6',
    accentClass: 'from-blue-600 to-indigo-600',
  },
  3: {
    number: 3,
    theme: 'Success',
    tagline: 'The Dynamic Expressor and Creative Catalyst',
    description:
      'Your profile reflects creative vibrancy, infectious optimism, and an energetic drive toward expressive achievement. You bring enthusiasm and imaginative spark to everything you touch.',
    strengths: [
      'Vivid creative expression and storytelling ability',
      'Infectious enthusiasm and motivational energy',
      'Aspirational mindset focused on possibilities',
      'Quick wit and mental flexibility',
      'Natural charisma and presentation prowess',
    ],
    challenges: [
      'Susceptibility to external praise and recognition dependency',
      'Fluctuating focus across multiple concurrent interests',
      'Occasional difficulty completing routine or repetitive tasks',
    ],
    relationship:
      'In companionship, you bring joy, playful inspiration, and spontaneity, seeking a partner who shares laughs and encourages your creative ventures.',
    career:
      'You shine in creative direction, marketing, media, public speaking, innovation design, and roles requiring inspirational leadership.',
    money:
      'Your relationship with resources is often dynamic—balancing generous experiential spending with aspirational investments.',
    communication:
      'Engaging, expressive, and colorful. You use storytelling, humor, and expressive metaphors to captivate audiences.',
    learning:
      'Visual, multimodal, and interactive learning environments keep your curiosity ignited and your creativity sharp.',
    growth:
      'Ground your visionary concepts in structured daily cadence. Consistency turns fleeting bursts of brilliance into enduring legacies.',
    colorHex: '#F59E0B',
    accentClass: 'from-amber-500 to-orange-600',
  },
  4: {
    number: 4,
    theme: 'Love',
    tagline: 'The Devoted Caregiver and Heart-Centered Guardian',
    description:
      'Your profile indicates a profound emotional core centered around genuine care, heartfelt loyalty, and deep interpersonal devotion. You cherish authentic vulnerability and heartfelt warmth.',
    strengths: [
      'Profound capacity for unconditional empathy',
      'Steadfast loyalty and protective care for loved ones',
      'Emotional depth and intuitive sensitivity',
      'Creating nurturing, comforting home and work environments',
      'Authentic vulnerability and genuine compassion',
    ],
    challenges: [
      'Risk of over-attachment or emotional enmeshment',
      'Heightened sensitivity to perceived slights or coldness',
      'Tendency to sacrifice self-care for others until depleted',
    ],
    relationship:
      'You love deeply and wholeheartedly, prioritizing emotional safety, shared devotion, and enduring commitment over superficial connections.',
    career:
      'You are drawn to healthcare, social impact, community building, psychological well-being, hospitality, and nurturing leadership roles.',
    money:
      'You prioritize financial stability as a means to care for those you love, build a warm home, and provide heartfelt safety.',
    communication:
      'Tender, emotionally resonant, and considerate. You speak with sincerity and listen with the heart.',
    learning:
      'Connecting subject matter to human stories and personal meaning significantly deepens your retention and engagement.',
    growth:
      'Establish loving boundaries. Guarding your own emotional reservoir ensures your caring spirit remains a fountain rather than a drain.',
    colorHex: '#EC4899',
    accentClass: 'from-pink-500 to-rose-600',
  },
  5: {
    number: 5,
    theme: 'Freedom',
    tagline: 'The Agile Navigator and Independent Trailblazer',
    description:
      'Your patterns suggest a relentless desire for autonomy, versatile exploration, and self-directed evolution. You thrive when unburdened by rigid dogmas and restrictive routines.',
    strengths: [
      'High agility and rapid adaptability to change',
      'Resourceful problem-solving in unstructured environments',
      'Open-minded curiosity and broad worldview',
      'Natural independence and courageous initiative',
      'Ability to pivot swiftly when new data appears',
    ],
    challenges: [
      'Restlessness and quick boredom with repetitive routines',
      'Tendency toward impulsiveness under prolonged confinement',
      'Resistance to commitments that feel overly restrictive',
    ],
    relationship:
      'You require breathing room and mutual freedom. The best bonds are built with companions who celebrate your independence and join in exploratory pursuits.',
    career:
      'You excel in remote consulting, travel industries, investigative work, agile development, entrepreneurship, and flexible freelance roles.',
    money:
      'Money represents freedom of choice and geographic mobility. You value liquid options and experiential flexibility over static lock-ins.',
    communication:
      'Spontaneous, frank, and intellectually stimulating. You prefer dynamic dialogues over scripted formalities.',
    learning:
      'Self-directed, experiential exploration and self-paced discovery give you the freedom to master skills rapidly.',
    growth:
      'Cultivate purposeful discipline. True freedom is not the absence of structure, but the freedom to choose your own purposeful discipline.',
    colorHex: '#06B6D4',
    accentClass: 'from-cyan-500 to-blue-600',
  },
  6: {
    number: 6,
    theme: 'Protection',
    tagline: 'The Pillar of Reliability and Dedicated Guardian',
    description:
      'Your profile indicates a strong moral compass, dependable protective instincts, and a profound commitment to supporting those in your sphere of influence.',
    strengths: [
      'Unshakable dependability and personal integrity',
      'Proactive protection and support for team and family',
      'Strong sense of civic responsibility and fairness',
      'Organized stewardship of family and community systems',
      'Steady emotional support during crises',
    ],
    challenges: [
      'Carrying excessive responsibility for matters beyond your control',
      'Tendency to become overly protective or micromanaging',
      'Difficulty saying no when assistance is requested',
    ],
    relationship:
      'You are a loyal and protective partner, dedicated to fostering a safe, supportive, and structurally sound sanctuary for your loved ones.',
    career:
      'You excel in organizational leadership, crisis management, legal compliance, education, social protection, and operational oversight.',
    money:
      'Prudent, methodical, and protection-oriented. You prioritize emergency funds, insurance, and durable asset foundations.',
    communication:
      'Reassuring, structured, and protective. You convey clear guidance and steady reassurance.',
    learning:
      'Systematic, structured frameworks with clear practical applications appeal most strongly to your orderly intellect.',
    growth:
      'Release the compulsion to fix every problem. Empowering others to bear their own lessons is often the highest form of support.',
    colorHex: '#6366F1',
    accentClass: 'from-indigo-600 to-violet-700',
  },
  7: {
    number: 7,
    theme: 'Adventure',
    tagline: 'The Inquisitive Explorer and Deep Seeker',
    description:
      'Your profile highlights an insatiable curiosity, a philosophical mindset, and an urge to explore the uncharted frontiers of thought, experience, and knowledge.',
    strengths: [
      'Deep intellectual curiosity and analytical acumen',
      'Unconventional thinking and philosophical insight',
      'Courage to explore unexplored territories and ideas',
      'Strong self-sufficiency and comfort with solitude',
      'Intuitive ability to synthesize complex abstract concepts',
    ],
    challenges: [
      'Restlessness when confined to mundane environments',
      'Impatience with superficial small talk and routine chores',
      'Occasional detachment from day-to-day emotional realities',
    ],
    relationship:
      'You connect on an intellectual and existential level, valuing companions who can debate deep concepts and venture on spontaneous journeys.',
    career:
      'You shine in research, investigative journalism, emerging technology, strategic analysis, philosophy, and exploratory sciences.',
    money:
      'You treat resources as fuel for adventures, books, research tools, and immersive experiences rather than purely conventional prestige.',
    communication:
      'Thoughtful, provocative, and inquisitive. You ask penetrating questions that challenge assumptions and spark deeper inquiry.',
    learning:
      'Deep-dive autonomous research, immersive field trips, and advanced technical literature best satisfy your inquisitive mind.',
    growth:
      'Bridge the gap between intellectual contemplation and everyday grounded connection. Finding wonder in the ordinary enriches your journey.',
    colorHex: '#8B5CF6',
    accentClass: 'from-purple-600 to-indigo-700',
  },
  8: {
    number: 8,
    theme: 'Power',
    tagline: 'The Strategic Commander and Visionary Leader',
    description:
      'Your profile reflects high executive presence, strategic mastery, and confident ambition. You naturally see large architectures, organize systems, and drive monumental outcomes.',
    strengths: [
      'Decisive executive leadership and command authority',
      'Macro strategic vision and systems architecture',
      'High capacity for handling pressure and complex stakes',
      'Natural negotiation and influence skills',
      'Tenacious persistence toward overarching goals',
    ],
    challenges: [
      'Tendency toward excessive control or reluctance to yield authority',
      'Intense competitive drive leading to work-life imbalance',
      'Imposing overly rigorous standards on self and others',
    ],
    relationship:
      'You admire strength, ambition, and intellectual equality in a partner, creating an enduring alliance based on mutual respect and shared dreams.',
    career:
      'You are built for corporate executive roles, venture building, financial architecture, high-stakes negotiations, and large-scale management.',
    money:
      'You understand the mechanics of leverage, wealth generation, and strategic asset allocation at scale.',
    communication:
      'Authoritative, concise, and commanding. You focus on strategic objectives, bottom-line results, and decisive next moves.',
    learning:
      'Case studies of mastery, leadership dynamics, strategic theory, and executive simulation yield your greatest breakthroughs.',
    growth:
      'Integrate gentle vulnerability with your powerful vision. True strength is demonstrated when power is tempered with compassion.',
    colorHex: '#4F46E5',
    accentClass: 'from-violet-600 to-indigo-900',
  },
  9: {
    number: 9,
    theme: 'Transformation',
    tagline: 'The Resilient Alchemist and Visionary Pioneer',
    description:
      'Your profile reflects profound resilience, adaptability through major transitions, and an innate focus on continuous self-renewal and societal evolution.',
    strengths: [
      'Remarkable emotional resilience and regenerative capacity',
      'Broad, humanitarian perspective and wisdom',
      'Ability to navigate life transitions with grace',
      'Deep capacity for self-reflection and personal renewal',
      'Inspirational mentorship through lived experience',
    ],
    challenges: [
      'Difficulty letting go of past chapters or completed phases',
      'Feelings of uncertainty or drift during interlude transitions',
      'Carrying the weight of collective or historical burdens',
    ],
    relationship:
      'You look for transformative connections that foster mutual spiritual, intellectual, and psychological growth across life stages.',
    career:
      'You excel in organizational turnaround, life coaching, change management, philanthropic initiatives, creative reinvention, and leadership transitions.',
    money:
      'You view money as a circulating energy designed to fund meaningful transformations and broad community impact.',
    communication:
      'Wise, reflective, and poetic. You illuminate life lessons and guide others through periods of turbulence.',
    learning:
      'Transformational psychology, historical cycles, and integrative philosophies resonate deeply with your reflective intellect.',
    growth:
      'Master the art of graceful release. Honoring completed cycles opens the door for your next extraordinary rebirth.',
    colorHex: '#7C3AED',
    accentClass: 'from-indigo-600 to-fuchsia-700',
  },
};
