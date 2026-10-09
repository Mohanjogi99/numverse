import React from 'react';
import { Card } from './Card';

export const ResultSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      {/* Banner */}
      <div className="h-44 w-full bg-slate-200 rounded-3xl" />

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 space-y-4 border-slate-200">
          <div className="h-6 w-48 bg-slate-200 rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-slate-100 rounded-2xl" />
            <div className="h-24 bg-slate-100 rounded-2xl" />
          </div>
          <div className="h-32 bg-slate-100 rounded-2xl" />
        </Card>
        <Card className="p-6 space-y-4 border-slate-200">
          <div className="h-6 w-36 bg-slate-200 rounded-lg" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
