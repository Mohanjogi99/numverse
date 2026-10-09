import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { NUMBER_PROFILES } from '../data/numberProfiles';
import { SingleDigit } from '../types/number';
import { ROUTES } from '../config/routes';

export const SharePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profileDigit, setProfileDigit] = useState<SingleDigit>(7);

  useEffect(() => {
    // Extract digit if encoded in share ID
    if (id && id.length > 0) {
      const match = id.match(/\d/);
      if (match) {
        setProfileDigit((parseInt(match[0], 10) % 10) as SingleDigit);
      }
    }
  }, [id]);

  const profile = NUMBER_PROFILES[profileDigit];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-center">
      <Badge variant="primary" size="sm">
        Shared Reflection Profile
      </Badge>

      {/* Share Card */}
      <Card className="p-8 sm:p-12 border-slate-200/90 shadow-2xl space-y-6 text-center max-w-lg mx-auto bg-gradient-to-b from-white via-white to-slate-50">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center font-display font-black text-3xl mx-auto shadow-lg shadow-indigo-200">
          {profile.number}
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Archetypal Energy
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-1">
            {profile.theme}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            {profile.tagline}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
          "{profile.description}"
        </p>

        <div className="pt-4 border-t border-slate-100">
          <Link to={ROUTES.NUMBER_ANALYSIS}>
            <Button size="md" variant="primary" className="w-full" rightIcon={<Compass className="w-4 h-4" />}>
              Discover Your Number Story
            </Button>
          </Link>
        </div>
      </Card>

      <DisclaimerBanner variant="inline" />
    </div>
  );
};
