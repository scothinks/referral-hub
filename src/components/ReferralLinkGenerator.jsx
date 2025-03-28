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
        title: 'Referral Link',
        text: 'Check out this referral link!',
        url: link
      })
      .then(() => toast.success('Link shared successfully!'))
      .catch((error) => toast.error('Error sharing link: ' + error));
    } else {
      toast.error('Web Share API is not supported in your browser.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={link}
            className="w-full px-4 py-2 border rounded-md bg-white"
          />
          <div className="button-container">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              onClick={handleShareLink}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 size={16} />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralLinkGenerator;
