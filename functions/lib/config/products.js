"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_ALIASES = exports.PRODUCTS = void 0;
exports.getProductById = getProductById;
exports.PRODUCTS = {
    free: {
        id: 'free',
        code: 'free10',
        name: 'Free Baseline',
        price: 0,
        priceInr: 0,
        amountInPaise: 0,
        currency: 'INR',
        formattedPrice: '₹0',
        description: 'Basic insight and number baseline overview.',
        questionCount: 10,
        includesNumberAnalysis: true,
        premium: false,
        features: [
            'Basic 10-digit number analysis',
            'Dominant theme calculation',
            '10-question personality snapshot',
            'Instant online results',
        ],
    },
    standard: {
        id: 'standard',
        code: 'standard25',
        name: 'Standard Personality Test',
        badge: 'Popular',
        price: 49,
        priceInr: 49,
        amountInPaise: 4900,
        currency: 'INR',
        formattedPrice: '₹49',
        description: 'Moderate assessment with enhanced dimension resolution.',
        questionCount: 25,
        includesNumberAnalysis: false,
        premium: true,
        features: [
            'Everything in Free',
            '25-question structured assessment',
            'Six dimension score breakdown',
            'Primary & secondary archetype traits',
            'Career & relationship tendencies',
        ],
    },
    complete: {
        id: 'complete',
        code: 'complete50',
        name: 'Complete Personality Test',
        price: 99,
        priceInr: 99,
        amountInPaise: 9900,
        currency: 'INR',
        formattedPrice: '₹99',
        description: 'Deeper assessment exploring values, agency, and conflict.',
        questionCount: 50,
        includesNumberAnalysis: false,
        premium: true,
        features: [
            'Everything in Standard',
            'Full 50-question deep assessment',
            'Comprehensive 6-pillar reflection',
            'Growth & communication analysis',
            'Detailed archetypal narrative',
            'Downloadable reflection card',
        ],
    },
    combo: {
        id: 'combo',
        code: 'combo149',
        name: 'Number + Complete Personality Test Combo',
        badge: 'BEST VALUE',
        price: 149,
        priceInr: 149,
        amountInPaise: 14900,
        currency: 'INR',
        formattedPrice: '₹149',
        description: 'Number + Complete Personality + Multi-Layer Fusion Report & AI Narrative.',
        questionCount: 50,
        includesNumberAnalysis: true,
        premium: true,
        features: [
            'Full Mobile & DOB Number Analysis',
            'Complete 50-Question Personality Assessment',
            'Harmonic Fusion Report (Number × Mindset)',
            '6 Detailed Life Pillars (Love, Career, Money, etc.)',
            'Personalized AI Narrative & Biographical Story',
            'Full lifetime access to report in workspace',
        ],
    },
};
exports.PRODUCT_ALIASES = {
    free10: 'free',
    standard25: 'standard',
    complete50: 'complete',
    combo149: 'combo',
};
function getProductById(id) {
    const normId = (id || '').toLowerCase().trim();
    const direct = exports.PRODUCTS[normId];
    if (direct)
        return direct;
    const canonical = exports.PRODUCT_ALIASES[normId];
    if (canonical && exports.PRODUCTS[canonical]) {
        return exports.PRODUCTS[canonical];
    }
    return undefined;
}
//# sourceMappingURL=products.js.map