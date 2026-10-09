import { NumberInfluenceMatrix } from '../types/number';

export const NUMBER_ENGINE_VERSION = '1.0';

/**
 * Number Story Engine v1.0 Influence Matrix
 * Pure deterministic mapping of numbers (0-9) to baseline psychological and energetic dimensions.
 * Dimension values range from 0 to 100.
 */
export const NUMBER_INFLUENCE_MATRIX: NumberInfluenceMatrix = {
  0: {
    independence: 40,
    social: 70,
    curiosity: 40,
    leadership: 40,
    emotional: 60,
    stability: 100,
  },
  1: {
    independence: 100,
    social: 30,
    curiosity: 55,
    leadership: 80,
    emotional: 25,
    stability: 65,
  },
  2: {
    independence: 35,
    social: 100,
    curiosity: 40,
    leadership: 45,
    emotional: 85,
    stability: 75,
  },
  3: {
    independence: 65,
    social: 65,
    curiosity: 80,
    leadership: 85,
    emotional: 40,
    stability: 45,
  },
  4: {
    independence: 35,
    social: 85,
    curiosity: 30,
    leadership: 35,
    emotional: 100,
    stability: 75,
  },
  5: {
    independence: 95,
    social: 65,
    curiosity: 85,
    leadership: 55,
    emotional: 35,
    stability: 25,
  },
  6: {
    independence: 45,
    social: 85,
    curiosity: 30,
    leadership: 55,
    emotional: 95,
    stability: 90,
  },
  7: {
    independence: 80,
    social: 45,
    curiosity: 100,
    leadership: 50,
    emotional: 35,
    stability: 25,
  },
  8: {
    independence: 90,
    social: 40,
    curiosity: 60,
    leadership: 100,
    emotional: 30,
    stability: 75,
  },
  9: {
    independence: 70,
    social: 50,
    curiosity: 90,
    leadership: 60,
    emotional: 60,
    stability: 50,
  },
};
