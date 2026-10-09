import React from 'react';
import { DimensionKey } from '../../types/number';
import { DIMENSION_INFO } from '../../config/constants';
import { ProgressBar } from '../ui/ProgressBar';

export interface DimensionBarProps {
  dimension: DimensionKey;
  score: number;
}

export const DimensionBar: React.FC<DimensionBarProps> = ({ dimension, score }) => {
  const info = DIMENSION_INFO[dimension] || { label: dimension, description: '' };

  const getVariant = (val: number): 'primary' | 'secondary' | 'gold' | 'emerald' => {
    if (val >= 80) return 'gold';
    if (val >= 60) return 'primary';
    if (val >= 40) return 'secondary';
    return 'emerald';
  };

  return (
    <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
      <div className="flex justify-between items-center text-sm font-semibold text-slate-800 dark:text-slate-200">
        <span>{info.label}</span>
        <span className="font-mono text-indigo-700 dark:text-indigo-400 font-bold">{score} / 100</span>
      </div>
      <ProgressBar value={score} max={100} size="md" variant={getVariant(score)} />
      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight pt-0.5">{info.description}</p>
    </div>
  );
};
