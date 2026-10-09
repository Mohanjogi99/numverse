import React from 'react';
import { Share2, Copy, Download, Sparkles, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { SingleDigit } from '../../types/number';
import { NUMBER_PROFILES } from '../../data/numberProfiles';
import { analytics } from '../../services/analyticsService';

export interface ShareCardProps {
  digit: SingleDigit;
  theme: string;
  tagline?: string;
  shareUrl?: string;
  className?: string;
}

export const ShareCard: React.FC<ShareCardProps> = ({
  digit,
  theme,
  tagline,
  shareUrl,
  className,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const profile = NUMBER_PROFILES[digit];
  const urlToShare = shareUrl || window.location.href;

  const handleShare = async () => {
    analytics.logEvent('share_clicked', { digit, theme });
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Number Story: ${theme}`,
          text: `My Number Story dominant theme is ${digit} - ${theme}! Discover your story:`,
          url: urlToShare,
        });
        showToast('Shared successfully!', 'success');
      } catch {
        // User dismissed native share dialog
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(urlToShare);
    setCopied(true);
    showToast('Link copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadImage = () => {
    showToast('Download Image preview will be active in the next release.', 'info');
  };

  return (
    <div className={className}>
      {/* Visual Reflection Card (Privacy Safe: Zero phone numbers or PII) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-6 sm:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden text-center max-w-sm mx-auto border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold tracking-widest text-indigo-300 uppercase">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>NUMBER STORY</span>
          </div>

          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-display font-black text-4xl mx-auto shadow-inner">
            {digit}
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Dominant Theme
            </div>
            <h3 className="text-2xl font-display font-extrabold text-white mt-0.5">{theme}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed italic">
              "{tagline || profile.tagline}"
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400">
            <span>Discover your story at <strong>numberstory.app</strong></span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
        <Button
          size="sm"
          variant="primary"
          onClick={handleShare}
          leftIcon={<Share2 className="w-4 h-4" />}
        >
          Share
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopyLink}
          leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        >
          {copied ? 'Copied' : 'Copy Link'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDownloadImage}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Download Image
        </Button>
      </div>
    </div>
  );
};
