import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import { Copy, Share2 } from 'lucide-react';

const VendorReferralGenerator = () => {
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateReferralLink = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const link = `https://play.google.com/store/apps/details?id=com.opera.mini.native&v_id=${id}`;
    setReferralLink(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied to clipboard!');
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Vendor Referral Link',
        text: 'Check out this vendor referral link!',
        url: referralLink
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
            value={referralLink}
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
      <Button
        onClick={generateReferralLink}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Generate New Vendor Referral Link
      </Button>
    </div>
  );
};

export default VendorReferralGenerator;
