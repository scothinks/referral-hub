import React, { useState, useCallback } from 'react';
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
import { 
  UserPlus, 
  Users, 
  ChevronRight, 
  LogIn, 
  Lock, 
  Mail,
  ArrowLeft,
  Info
} from 'lucide-react';
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const ROLE_TYPES = {
  AGENT: 'agent',
  AMBASSADOR: 'ambassador'
};

const STORAGE_KEYS = {
  TEMP_ID: 'tempId',
  ROLE: 'role',
  ACTIVATED: 'activated'
};

const Setup = () => {
  const [role, setRole] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showHowToEarn, setShowHowToEarn] = useState(false);
  const [loginData, setLoginData] = useState({
    referralLink: '',
    password: '',
    email: ''
  });
  const navigate = useNavigate();

  const generateReferralLink = useCallback((type) => {
    const id = Math.random().toString(36).substr(2, 9);
    const param = type === ROLE_TYPES.AGENT ? 'fa_id' : 'v_id';
    const baseUrl = 'https://play.google.com/store/apps/details?id=com.opera.mini.native';
    const link = `${baseUrl}?${param}=${id}`;
    
    setReferralLink(link);
    localStorage.setItem(STORAGE_KEYS.TEMP_ID, id);
    localStorage.setItem(STORAGE_KEYS.ROLE, type === ROLE_TYPES.AGENT ? 'field_agent' : 'ambassador');
    localStorage.setItem(STORAGE_KEYS.ACTIVATED, 'false');
  }, []);

  const handleRoleSelection = useCallback((selectedRole) => {
    setRole(selectedRole);
    generateReferralLink(selectedRole);
  }, [generateReferralLink]);

  const handleSetPassword = useCallback(() => {
    navigate('/activate');
  }, [navigate]);

  const handleBack = useCallback(() => {
    if (showForgotPassword) {
      setShowForgotPassword(false);
    } else if (showLogin) {
      setShowLogin(false);
    } else if (referralLink) {
      setReferralLink('');
    } else if (showHowToEarn) {
      setShowHowToEarn(false);
    }
  }, [showForgotPassword, showLogin, referralLink, showHowToEarn]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    toast.success('Login successful!');
    navigate('/dashboard');
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    toast.success('Password reset link sent to your email');
    setShowForgotPassword(false);
  };

  const RoleButton = ({ roleType, icon: Icon, label, tooltip }) => (
    <div className="group relative flex-1">
      <Button
        onClick={() => handleRoleSelection(roleType)}
        variant={roleType === ROLE_TYPES.AGENT ? 'primary' : 'outline'}
        size="lg"
        className={`h-16 flex items-center justify-between px-4 py-4 rounded-lg transition-all duration-200
          ${roleType === ROLE_TYPES.AGENT ? 'bg-[#cc0f16] hover:bg-[#a50c12]' : 'border-[#cc0f16] text-[#cc0f16] hover:bg-[#cc0f16]/10'}
          group-hover:shadow-md`}
        data-tooltip-id={`${roleType}Tooltip`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${roleType === ROLE_TYPES.AGENT ? 'bg-white/20' : 'bg-[#cc0f16]/10'}`}>
            <Icon className={`h-5 w-5 ${roleType === ROLE_TYPES.AGENT ? 'text-white' : 'text-[#cc0f16]'}`} />
          </div>
          <span className={`text-sm font-medium ${roleType === ROLE_TYPES.AGENT ? 'text-white' : 'text-[#cc0f16]'}`}>{label}</span>
        </div>
        <ChevronRight className={`h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform ${roleType === ROLE_TYPES.AGENT ? 'text-white' : 'text-[#cc0f16]'}`} />
      </Button>
      
      <ReactTooltip 
        id={`${roleType}Tooltip`}
        place="bottom"
        className="!bg-[#cc0f16] !text-white !p-4 !rounded-lg !max-w-xs !opacity-100 !shadow-xl"
      >
        <div className="text-sm leading-relaxed">
          {tooltip}
        </div>
      </ReactTooltip>
    </div>
  );

  const HowToEarnCard = () => (
    <Card className="border-0 shadow-lg mb-4">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-[#cc0f16]">
          How To Earn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 mt-1">
            <Info className="h-4 w-4 text-[#cc0f16]" />
          </div>
          <p className="text-sm text-gray-700">
            Share your unique link to invite people to enjoy free daily 50MB browsing with Opera Mini
          </p>
        </div>
        
        <div className="ml-6 space-y-2">
          <p className="text-sm font-medium text-gray-800">For valid referrals:</p>
          <ul className="text-sm text-gray-700 list-disc pl-4 space-y-1">
            <li>User must be new to Opera Mini on that device (last 6 months)</li>
            <li>Must activate MiniPay after installing Opera Mini</li>
          </ul>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg mt-3">
          <p className="text-sm font-medium text-green-800">
            You'll receive ₦500 for every valid referral!
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {(referralLink || showLogin || showForgotPassword || showHowToEarn) && (
          <button 
            onClick={handleBack}
            className="flex items-center text-sm text-[#cc0f16] hover:text-[#a50c12]"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        )}

        {showHowToEarn ? (
          <HowToEarnCard />
        ) : !referralLink && !showLogin && !showForgotPassword ? (
          <>
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-[#cc0f16]">
                  Opera Referral Hub
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Earn ₦500 for every valid referral. Choose your path!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <RoleButton
                    roleType={ROLE_TYPES.AGENT}
                    icon={UserPlus}
                    label="Super Agent"
                    tooltip={
                      <>
                        <h4 className="font-bold mb-2 text-white">Super Agent Benefits</h4>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Recruit ambassadors in your community</li>
                          <li>Earn from your ambassadors' first 10 referrals</li>
                          <li>+₦500 for every direct referral</li>
                        </ul>
                      </>
                    }
                  />

                  <RoleButton
                    roleType={ROLE_TYPES.AMBASSADOR}
                    icon={Users}
                    label="Refer & Earn"
                    tooltip={
                      <>
                        <h4 className="font-bold mb-2 text-white">Simple Referral Program</h4>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Earn ₦500 per referral</li>
                          <li>No recruitment required</li>
                          <li>Straightforward earnings</li>
                        </ul>
                      </>
                    }
                  />
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setShowHowToEarn(true)}
                    className="w-full text-sm text-[#cc0f16] hover:text-[#a50c12] flex items-center justify-center gap-1"
                  >
                    <Info className="h-4 w-4" />
                    How to Earn
                  </button>
                  
                  <div className="pt-2 border-t border-gray-200 text-center">
                    <button 
                      onClick={() => setShowLogin(true)}
                      className="text-sm text-[#cc0f16] hover:text-[#a50c12] flex items-center justify-center gap-1"
                    >
                      <LogIn className="h-4 w-4" />
                      Already have an account? Login here
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : showLogin || showForgotPassword ? (
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-[#cc0f16] p-4 text-center">
              <h2 className="text-xl font-bold text-white">
                {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
              </h2>
            </div>
            <CardContent className="p-6">
              {showForgotPassword ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="pl-10 w-full"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full py-3 bg-[#cc0f16] hover:bg-[#a50c12] text-white"
                  >
                    Send Reset Link
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="referralLink" className="block text-sm font-medium text-gray-700 mb-1">
                      Login With Your Referral Link
                    </label>
                    <Input
                      type="text"
                      id="referralLink"
                      name="referralLink"
                      value={loginData.referralLink}
                      onChange={handleLoginChange}
                      className="w-full"
                      placeholder="https://play.google.com/store/apps/details?id=com.opera..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="pl-10 w-full"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full py-3 bg-[#cc0f16] hover:bg-[#a50c12] text-white"
                  >
                    Login
                  </Button>
                </form>
              )}
              
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  className="text-sm text-[#cc0f16] hover:text-[#a50c12]"
                >
                  {showForgotPassword ? 'Back to login' : 'Forgot Password?'}
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg">
            <div className="bg-[#cc0f16] p-4 text-center">
              <h2 className="text-xl font-bold text-white">
                {role === ROLE_TYPES.AGENT ? 'Your Agent Link' : 'Your Referrer Link'}
              </h2>
            </div>
            <CardContent className="p-6 space-y-6">
              <p className="text-center text-gray-600">
                {role === ROLE_TYPES.AGENT 
                  ? 'Share this link to earn via your recruited ambassadors:' 
                  : 'Share this link to earn via direct referrals:'}
              </p>
              
              <ReferralLinkGenerator link={referralLink} />
              
              <Button 
                onClick={handleSetPassword}
                className="w-full py-3 bg-[#cc0f16] hover:bg-[#a50c12] text-white"
              >
                Set Password to track Earnings
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Setup;