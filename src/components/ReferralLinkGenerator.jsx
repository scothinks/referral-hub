import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import { Copy, Share2 } from 'lucide-react';

const ReferralLinkGenerator = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied to clipboard!');
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Opera Referral Link',
        text: 'Join me in earning with Opera Mini!',
        url: link
      })
      .then(() => toast.success('Link shared successfully!'))
      .catch((error) => toast.error('Error sharing link: ' + error));
    } else {
      toast.error('Web Share API is not supported in your browser.');
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            readOnly
            value={link}
            className="w-full p-3 pr-16 bg-white border border-gray-300 rounded-lg text-sm truncate"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-400 text-xs">URL</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="border-[#cc0f16] text-[#cc0f16] hover:bg-[#cc0f16]/10"
          >
            <Copy size={16} className="mr-2" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            onClick={handleShareLink}
            variant="outline"
            className="border-[#cc0f16] text-[#cc0f16] hover:bg-[#cc0f16]/10"
          >
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralLinkGenerator;
