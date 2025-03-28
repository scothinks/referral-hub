import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReferralLinkGenerator from './ReferralLinkGenerator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { UserPlus, Users } from 'lucide-react';
import ReactTooltip from 'react-tooltip';

const Setup = () => {
  const [role, setRole] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const navigate = useNavigate();

  const generateReferralLink = (type) => {
    const id = Math.random().toString(36).substr(2, 9);
    const param = type === 'agent' ? 'fa_id' : 'v_id';
    const link = `https://play.google.com/store/apps/details?id=com.opera.mini.native&${param}=${id}`;
    setReferralLink(link);
    localStorage.setItem('tempId', id);
    localStorage.setItem('role', type === 'agent' ? 'field_agent' : 'vendor');
    localStorage.setItem('activated', 'false');
  };

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    generateReferralLink(selectedRole);
  };

  const handleSetPassword = () => {
    navigate('/activate');
  };

  return (
    <div className="container">
      <div className="w-full max-w-sm space-y-8">
        {!referralLink && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to Opera Referral Hub</h2>
            <p className="mt-2 text-sm text-gray-600">Earn ₦500 for every valid referral.</p>
            <p className="mt-2 text-sm text-gray-600">Tap any of the buttons below to generate your unique referral link.</p>
          </div>
        )}

        {!referralLink && (
          <div className="space-y-4">
            <div data-tip data-for="agentTooltip">
              <Button
                onClick={() => handleRoleSelection('agent')}
                className="w-full h-14 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <UserPlus className="h-5 w-5" />
                  <span>Generate as Agent</span>
                </div>
              </Button>
            </div>
            <ReactTooltip id="agentTooltip" place="bottom" effect="solid">
              Choose this option if you are interested in recruiting PoS operators for us in your community. You get paid for the first 10 successful valid referrals that each of your agents provide, plus ₦500 for every direct referral you complete.
            </ReactTooltip>

            <div data-tip data-for="vendorTooltip">
              <Button
                onClick={() => handleRoleSelection('vendor')}
                variant="outline"
                className="w-full h-14 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5" />
                  <span>Generate as Referrer</span>
                </div>
              </Button>
            </div>
            <ReactTooltip id="vendorTooltip" place="bottom" effect="solid">
              Choose this option if you simply want to earn ₦500 for every referral you complete.
            </ReactTooltip>
          </div>
        )}

        {referralLink && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">
                {role === 'agent' ? 'Your Agent Link' : 'Your Referrer Link'}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {role === 'agent' ? 'Here is your agent link:' : 'Here is your referrer link:'}
              </p>
            </div>
            <ReferralLinkGenerator link={referralLink} />
            <div className="text-center">
              <p className="mt-2 text-sm text-gray-600">
                {role === 'agent' ? 'Add a secure password to save it.' : 'Add a secure password to save it.'}
              </p>
            </div>
            <Button onClick={handleSetPassword} className="w-full bg-blue-600 hover:bg-blue-700">
              Set Password
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setup;
