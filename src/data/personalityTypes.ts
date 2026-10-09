import { PersonalityTypeArchetype } from '../types/personality';

export const PERSONALITY_ARCHETYPES: Record<string, PersonalityTypeArchetype> = {
  explorer: {
    id: 'explorer',
    code: 'EXPLORER',
    title: 'The Explorer',
    subtitle: 'Curiosity + Independence',
    tagline: 'Inquisitive, autonomous, and energized by discovery.',
    summary:
      'Your responses suggest a natural inclination toward self-directed exploration, intellectual curiosity, and novel experiences. You thrive when given the freedom to discover fresh horizons without rigid constraints.',
    coreTraits: ['Intellectual Curiosity', 'Autonomous Agency', 'Open-Mindedness', 'Adaptability'],
    strengths: [
      'Quick adaptability to novel and unstructured situations',
      'Unconventional thinking and creative problem-solving',
      'High self-reliance and autonomous motivation',
      'Insatiable appetite for learning and exploration',
    ],
    challenges: [
      'May feel restless when restricted by repetitive routines',
      'Could experience impatience with rigid administrative procedures',
      'Might pivot between interests before completing long-term cycles',
    ],
    relationships:
      'You appreciate partners and friends who respect your personal independence, engage in stimulating discussions, and share a sense of adventure.',
    career:
      'You tend to excel in research, emerging technology, creative consulting, freelance initiatives, exploratory strategy, and environments offering high autonomy.',
    communication:
      'Spontaneous, inquisitive, and concept-driven. You prefer engaging dialogues that explore possibilities rather than mundane small talk.',
    learning:
      'Self-directed inquiry, experimental trial-and-error, and deep dives into multidisciplinary topics keep your intellect engaged.',
    growth:
      'Practicing structured follow-through on your most valuable discoveries allows your creative explorations to manifest into enduring legacies.',
    primaryDimension: 'curiosity',
    secondaryDimension: 'independence',
    idealEnvironments: ['Innovation Labs', 'Autonomous Consulting', 'Exploratory Research', 'Creative Studios'],
  },
  leader: {
    id: 'leader',
    code: 'LEADER',
    title: 'The Leader',
    subtitle: 'Leadership + Independence',
    tagline: 'Decisive, autonomous, and focused on collective progress.',
    summary:
      'Your profile indicates a natural capacity to provide strategic direction, take command in uncertain scenarios, and create organized structures that help teams accomplish ambitious goals.',
    coreTraits: ['Decisive Direction', 'Strategic Vision', 'Organizational Focus', 'Grounded Presence'],
    strengths: [
      'Clarity of vision and confidence in decision-making',
      'Ability to mobilize people and resources toward common objectives',
      'Calm and reassuring authority during complex challenges',
      'Focus on tangible milestones and measurable outcomes',
    ],
    challenges: [
      'May shoulder excessive responsibility rather than delegating early',
      'Could feel frustrated by slow decision-making in others',
      'Might prioritize objective milestones over emotional nuances',
    ],
    relationships:
      'In relationships, you value loyalty, mutual ambition, and clear communication, offering steady support and dependable companionship.',
    career:
      'You flourish in executive leadership, project direction, organizational management, venture operations, and high-impact strategy.',
    communication:
      'Direct, inspiring, and clear. You communicate objectives with purpose and set clear expectations.',
    learning:
      'Executive case studies, systems modeling, and high-stakes simulations accelerate your mastery.',
    growth:
      'Integrating active empathetic listening with your decisive nature elevates your leadership from effective to truly inspiring.',
    primaryDimension: 'leadership',
    secondaryDimension: 'independence',
    idealEnvironments: ['Executive Strategy', 'Venture Leadership', 'Operations Governance', 'Organizational Design'],
  },
  empath: {
    id: 'empath',
    code: 'EMPATH',
    title: 'The Empath',
    subtitle: 'Emotional Sensitivity + Social Connection',
    tagline: 'Compassionate, intuitive, and attuned to human needs.',
    summary:
      'Your responses reflect a deep emotional reservoir and a keen awareness of interpersonal atmospheres. You naturally foster empathy, psychological safety, and meaningful heartfelt connections.',
    coreTraits: ['Empathetic Awareness', 'Emotional Depth', 'Authentic Care', 'Intuitive Rapport'],
    strengths: [
      'Profound emotional intelligence and intuitive understanding',
      'Ability to make others feel genuinely seen and supported',
      'Creating compassionate, trusting social environments',
      'Sensitive perception of unstated team dynamics',
    ],
    challenges: [
      'May absorb the emotional stress or turbulence of surrounding environments',
      'Could hesitate to assert firm personal boundaries to avoid discomfort',
      'Might experience emotional fatigue after prolonged social giving',
    ],
    relationships:
      'You cherish authentic vulnerability, deep emotional intimacy, and enduring mutual devotion in your partnerships.',
    career:
      'You are drawn to counseling, human resources, healthcare, mentorship, community building, coaching, and mediation.',
    communication:
      'Warm, validating, and empathetic. You listen attentively with genuine care and respond with heartfelt clarity.',
    learning:
      'Narrative-driven case studies, human stories, and personal reflection exercises resonate most deeply with your understanding.',
    growth:
      'Guarding your emotional boundaries ensures your capacity for compassion remains a sustainable source of strength.',
    primaryDimension: 'emotional',
    secondaryDimension: 'social',
    idealEnvironments: ['Community Hubs', 'Counseling & Mentorship', 'People Development', 'Healthcare & Wellness'],
  },
  thinker: {
    id: 'thinker',
    code: 'THINKER',
    title: 'The Thinker',
    subtitle: 'Curiosity + Analytical Depth',
    tagline: 'Methodical, reflective, and dedicated to objective truth.',
    summary:
      'Your profile suggests an analytical, contemplative mind that enjoys deconstructing intricate problems, verifying facts, and understanding the foundational mechanics of how systems operate.',
    coreTraits: ['Analytical Acumen', 'Methodical Rigor', 'Objective Reflection', 'Intellectual Depth'],
    strengths: [
      'Exceptional analytical clarity and logical reasoning',
      'Patience in investigating complex, multi-variable issues',
      'Objective perspective unclouded by fleeting emotional impulses',
      'Dedication to accuracy, data integrity, and depth',
    ],
    challenges: [
      'May experience analysis paralysis when rapid intuitive decisions are required',
      'Could appear detached or overly formal in casual social settings',
      'Might hold internal models to unrealistically stringent standards',
    ],
    relationships:
      'You value intellectual equality, honest discourse, and thoughtful companions who appreciate quiet reflection.',
    career:
      'You shine in data science, software architecture, technical research, economics, engineering, and philosophical analysis.',
    communication:
      'Precise, structured, and fact-grounded. You value well-reasoned arguments and clear definitions.',
    learning:
      'Deep reading, technical documentation, first-principles logic, and autonomous research suit your contemplative nature.',
    growth:
      'Balancing rigorous intellectual analysis with rapid real-world prototyping bridges theory with practical momentum.',
    primaryDimension: 'curiosity',
    secondaryDimension: 'stability',
    idealEnvironments: ['Technical Architecture', 'Data & Analytics', 'Scientific Research', 'Policy Analysis'],
  },
  builder: {
    id: 'builder',
    code: 'BUILDER',
    title: 'The Builder',
    subtitle: 'Stability + Practical Execution',
    tagline: 'Reliable, pragmatic, and focused on tangible creation.',
    summary:
      'Your profile reflects a steady, pragmatic approach to life. You take pride in crafting durable foundations, executing plans with discipline, and delivering dependable, real-world results.',
    coreTraits: ['Execution Discipline', 'Pragmatic Focus', 'Reliable Grounding', 'Resource Efficiency'],
    strengths: [
      'Dependable follow-through and exceptional consistency',
      'Ability to translate abstract ideas into concrete deliverables',
      'Efficient resource management and practical problem-solving',
      'Calm perseverance when facing long-term workloads',
    ],
    challenges: [
      'May resist sudden procedural shifts without clear empirical justification',
      'Could hesitate to embrace speculative or unproven methodologies',
      'Might prioritize immediate efficiency over imaginative experimentation',
    ],
    relationships:
      'You express affection through steady loyalty, acts of service, and creating a stable, safe haven for loved ones.',
    career:
      'You excel in project operations, civil & software engineering, financial administration, construction, and supply chain governance.',
    communication:
      'Grounded, concise, and focused on actionable steps and measurable outcomes.',
    learning:
      'Hands-on apprenticeships, structured step-by-step methodologies, and practical application reinforce your knowledge.',
    growth:
      'Allowing space for playful experimentation and unconventional methods can expand your already impressive creative output.',
    primaryDimension: 'stability',
    secondaryDimension: 'independence',
    idealEnvironments: ['Operations Management', 'Engineering & Construction', 'Financial Planning', 'Production Systems'],
  },
  connector: {
    id: 'connector',
    code: 'CONNECTOR',
    title: 'The Connector',
    subtitle: 'Social Connection + Collaborative Synergy',
    tagline: 'Sociable, diplomatic, and passionate about community.',
    summary:
      'Your responses highlight an innate talent for bridging diverse people, cultivating expansive networks, and creating collaborative environments where everyone feels included and inspired.',
    coreTraits: ['Relational Synergy', 'Consensus Building', 'Diplomatic Tact', 'Infectious Warmth'],
    strengths: [
      'Natural networking and community-building instincts',
      'Diplomatic consensus creation across diverse stakeholders',
      'High social charisma and welcoming interpersonal warmth',
      'Identifying mutual synergy between disparate individuals',
    ],
    challenges: [
      'May feel drained when isolated or working in solitary silos',
      'Could over-commit social time at the expense of personal priorities',
      'Might avoid addressing difficult interpersonal friction to maintain group comfort',
    ],
    relationships:
      'You thrive in lively, communicative partnerships where social engagement, mutual friends, and shared community events are abundant.',
    career:
      'You flourish in public relations, business development, community management, event production, client partnerships, and team recruiting.',
    communication:
      'Enthusiastic, inclusive, and socially receptive. You naturally weave stories and invite others to contribute their perspectives.',
    learning:
      'Collaborative workshops, interactive group seminars, and peer-to-peer discussions maximize your retention.',
    growth:
      'Carving out regular solitary reflection ensures your personal goals remain clear amidst bustling social activity.',
    primaryDimension: 'social',
    secondaryDimension: 'emotional',
    idealEnvironments: ['Community Ecosystems', 'Partnership Development', 'Public Relations', 'Collaborative Agencies'],
  },
  challenger: {
    id: 'challenger',
    code: 'CHALLENGER',
    title: 'The Challenger',
    subtitle: 'Leadership + Curiosity',
    tagline: 'Bold, candid, and unafraid to challenge the status quo.',
    summary:
      'Your responses indicate a dynamic, high-agency personality that thrives on overcoming obstacles, advocating for truth, and disrupting stagnant conventions to drive meaningful progress.',
    coreTraits: ['Courageous Agency', 'Constructive Disruption', 'Radical Candor', 'Tenacious Drive'],
    strengths: [
      'Courage to question outdated norms and voice unpopular truths',
      'High resilience and motivation when confronting formidable challenges',
      'Energizing catalysts for positive institutional change',
      'Strong protective advocacy for equitable treatment',
    ],
    challenges: [
      'May come across as confrontational when subtlety or patience is called for',
      'Could struggle with compromises that feel like unnecessary concessions',
      'Might experience friction with highly bureaucratic or risk-averse environments',
    ],
    relationships:
      'You respect strength, honesty, and intellectual courage in a partner, seeking passionate and transparent companionship.',
    career:
      'You thrive in turnaround management, investigative journalism, disruptive startup entrepreneurship, advocacy law, and competitive markets.',
    communication:
      'Direct, passionate, and persuasive. You cut straight to the core of issues with bold conviction.',
    learning:
      'Debates, adversarial problem scenarios, and high-pressure challenges stimulate your best thinking.',
    growth:
      'Pairing your fierce conviction with gentle timing and strategic diplomacy multiplies your transformative impact.',
    primaryDimension: 'leadership',
    secondaryDimension: 'curiosity',
    idealEnvironments: ['Disruptive Startups', 'Turnaround Strategy', 'Advocacy & Law', 'Competitive Markets'],
  },
  harmonizer: {
    id: 'harmonizer',
    code: 'HARMONIZER',
    title: 'The Harmonizer',
    subtitle: 'Stability + Emotional Sensitivity',
    tagline: 'Patient, calming, and dedicated to balance and peace.',
    summary:
      'Your profile reflects a grounding, tranquil energy that naturally restores calm in chaotic atmospheres. You prioritize emotional balance, mutual respect, and steady, conflict-free collaboration.',
    coreTraits: ['Inner Tranquility', 'Conflict Mediation', 'Patient Consistency', 'Holistic Balance'],
    strengths: [
      'Exceptional patience and emotional composure under pressure',
      'Natural talent for de-escalating interpersonal tensions',
      'Creating harmonious, emotionally safe environments',
      'Steadfast reliability in supporting team equilibrium',
    ],
    challenges: [
      'May procrastinate on necessary confrontations to avoid temporary friction',
      'Could compromise personal needs too readily for group peace',
      'Might feel unsettled by volatile or erratic environments',
    ],
    relationships:
      'You cultivate gentle, peaceful partnerships built on deep emotional security, quiet understanding, and shared serenity.',
    career:
      'You excel in mediation, human resources, organizational culture, wellness administration, quality assurance, and sustainable design.',
    communication:
      'Gentle, receptive, and tactful. You listen deeply and seek points of alignment rather than disagreement.',
    learning:
      'Calm, unhurried study environments with space for holistic synthesis support your best cognitive integration.',
    growth:
      'Embracing constructive confrontation as a healthy bridge to deeper harmony will unlock your greatest empowerment.',
    primaryDimension: 'stability',
    secondaryDimension: 'emotional',
    idealEnvironments: ['Mediation & HR', 'Wellness & Balance Hubs', 'Quality Governance', 'Sustainable Design'],
  },
  creator: {
    id: 'creator',
    code: 'CREATOR',
    title: 'The Creator',
    subtitle: 'Curiosity + Social Connection',
    tagline: 'Expressive, imaginative, and inspired by meaningful connection.',
    summary:
      'Your responses reflect an artistic, imaginative spirit attuned to aesthetic beauty, social connection, and original expression. You interpret the world through a vivid and creative lens.',
    coreTraits: ['Imaginative Vision', 'Aesthetic Sensitivity', 'Expressive Resonance', 'Originality'],
    strengths: [
      'Rich imagination and distinctive aesthetic sensibilities',
      'Ability to translate complex feelings into creative works',
      'Deep appreciation for nuances of design, language, and culture',
      'Inspiring others through authentic and collaborative expression',
    ],
    challenges: [
      'May experience creative fluctuations influenced by emotional moods',
      'Could find rigid administrative tasks draining and uninspiring',
      'Might be sensitive to unconstructive criticism of creative work',
    ],
    relationships:
      'You seek soulful, expressive partnerships that celebrate individuality, deep philosophical conversations, and artistic inspiration.',
    career:
      'You shine in design, creative writing, multimedia arts, brand storytelling, marketing innovation, and architectural aesthetics.',
    communication:
      'Evocative, metaphor-rich, and genuine. You communicate through expressive imagery and social resonance.',
    learning:
      'Multimodal, visual, and immersive collaborative experiences ignite your intellectual and creative curiosity.',
    growth:
      'Establishing gentle daily creative rituals provides a steady container for your brilliant imagination to flourish regularly.',
    primaryDimension: 'curiosity',
    secondaryDimension: 'social',
    idealEnvironments: ['Creative Studios', 'Design Agencies', 'Publishing & Media', 'Innovation Workshops'],
  },
  strategist: {
    id: 'strategist',
    code: 'STRATEGIST',
    title: 'The Strategist',
    subtitle: 'Leadership + Stability',
    tagline: 'Visionary, structured, and architect of future outcomes.',
    summary:
      'Your profile indicates a visionary intellect that excels at connecting long-range possibilities with disciplined tactical execution. You naturally anticipate future trends and design comprehensive strategic roadmaps.',
    coreTraits: ['Long-Range Foresight', 'Pattern Synthesis', 'Tactical Architecture', 'Calculated Initiative'],
    strengths: [
      'Exceptional foresight and ability to anticipate market or situational trends',
      'Synthesis of complex disparate data points into actionable strategy',
      'Calm strategic maneuvering in competitive environments',
      'Designing scalable, future-proof organizational frameworks',
    ],
    challenges: [
      'May become frustrated by short-term or reactive thinking in teams',
      'Could spend excessive time refining plans before initiating execution',
      'Might overlook subtle emotional nuances in favor of systemic efficiency',
    ],
    relationships:
      'You respect depth, vision, and intellectual curiosity in a partner, enjoying shared strategic discussions about long-term goals.',
    career:
      'You excel in corporate strategy, venture capital, management consulting, product architecture, and long-range organizational design.',
    communication:
      'Structured, forward-looking, and insightful. You articulate complex ideas with macro-level clarity.',
    learning:
      'High-level strategic frameworks, historical case studies, and predictive simulations best feed your intellect.',
    growth:
      'Grounding visionary long-term horizons with agile short-term feedback loops accelerates your strategic execution.',
    primaryDimension: 'leadership',
    secondaryDimension: 'stability',
    idealEnvironments: ['Strategic Advisory', 'Venture Capital', 'Product Management', 'Corporate Foresight'],
  },
};
