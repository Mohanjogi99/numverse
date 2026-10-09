import React from 'react';
import { Card } from './Card';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3 text-center max-w-xl mx-auto">
        <div className="h-6 w-32 bg-slate-200 rounded-full mx-auto" />
        <div className="h-10 w-3/4 bg-slate-200 rounded-2xl mx-auto" />
        <div className="h-4 w-1/2 bg-slate-200 rounded-lg mx-auto" />
      </div>

      {/* Main card skeleton */}
      <Card className="p-8 space-y-6 border-slate-200">
        <div className="h-12 w-full bg-slate-100 rounded-xl" />
        <div className="h-32 w-full bg-slate-100 rounded-xl" />
        <div className="h-12 w-full bg-slate-200 rounded-xl" />
      </Card>
    </div>
  );
};
