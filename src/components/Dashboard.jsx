import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { DollarSign, Users, LogOut, Copy, Share2, Check, X, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const [stats, setStats] = useState({
    referrals: 0,
    valid: 0,
    earnings: 0,
    availableBalance: 0,
    paidEarnings: 0
  });
  const [ambassadors, setAmbassadors] = useState([]);
  const [showAddAmbassador, setShowAddAmbassador] = useState(false);
  const [ambassadorName, setAmbassadorName] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('tempId');

  const generateSecureAmbassadorId = () => {
    return uuidv4().replace(/-/g, '').substring(0, 12);
  };

  useEffect(() => {
    const fetchStats = () => {
      const mockStats = {
        field_agent: {
          referrals: 100,
          valid: 85,
          earnings: 42500,
          availableBalance: 42500,
          paidEarnings: 0,
          ambassadors: 8,
          active: 6
        },
        ambassador: {
          referrals: 12,
          valid: 10,
          earnings: 12000,
          availableBalance: 12000,
          paidEarnings: 0
        }
      };
      setStats(mockStats[role] || { 
        referrals: 0, 
        valid: 0, 
        earnings: 0, 
        availableBalance: 0,
        paidEarnings: 0 
      });
    };

    const fetchAmbassadors = () => {
      const mockAmbassadors = [
        { 
          name: 'Ella Amadi', 
          referrals: 15, 
          valid: 10, 
          commission: 5000, 
          paidCommission: 5000,
          status: 'paid', 
          link: `https://play.google.com/store/apps/details?id=com.opera.mini.native&v_id=${userId}_${generateSecureAmbassadorId()}` 
        },
        { 
          name: 'Shoozy B', 
          referrals: 35, 
          valid: 8, 
          commission: 4000, 
          paidCommission: 0,
          status: 'pending', 
          link: `https://play.google.com/store/apps/details?id=com.opera.mini.native&v_id=${userId}_${generateSecureAmbassadorId()}` 
        },
        { 
          name: 'Victor PoS', 
          referrals: 4, 
          valid: 2, 
          commission: 1000, 
          paidCommission: 0,
          status: 'pending', 
          link: `https://play.google.com/store/apps/details?id=com.opera.mini.native&v_id=${userId}_${generateSecureAmbassadorId()}` 
        }
      ];
      setAmbassadors(mockAmbassadors);
    };

    fetchStats();
    if (role === 'field_agent') fetchAmbassadors();
    
    const param = role === 'field_agent' ? 'fa_id' : 'v_id';
    setReferralLink(`https://play.google.com/store/apps/details?id=com.opera.mini.native&${param}=${userId}`);

    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [role, userId]);

  const handleLogout = () => {
    toast.info('Logging out...', { 
      position: "top-right", 
      autoClose: 1500 
    });
    setTimeout(() => {
      localStorage.clear();
      navigate('/setup');
    }, 1500);
  };

  const handleAddAmbassador = () => setShowAddAmbassador(true);

  const handleAmbassadorNameChange = (e) => setAmbassadorName(e.target.value);

  const handleGenerateAmbassadorLink = () => {
    if (!ambassadorName.trim()) {
      toast.error('Please enter an ambassador name.');
      return;
    }

    const ambassadorId = generateSecureAmbassadorId();
    const newAmbassador = {
      name: ambassadorName,
      referrals: 0,
      valid: 0,
      commission: 0,
      paidCommission: 0,
      status: 'pending',
      link: `https://play.google.com/store/apps/details?id=com.opera.mini.native&v_id=${userId}_${ambassadorId}`
    };

    setAmbassadors([...ambassadors, newAmbassador]);
    setAmbassadorName('');
    setShowAddAmbassador(false);
    toast.success('Ambassador added successfully!');
  };

  const handleCashout = () => {
    const unpaidAmbassadorCommissions = ambassadors.reduce(
      (total, ambassador) => total + (ambassador.commission - ambassador.paidCommission), 
      0
    );
    const totalAvailable = stats.availableBalance + unpaidAmbassadorCommissions;

    if (totalAvailable <= 0) {
      toast.error('No available balance to cash out');
      return;
    }

    const updatedAmbassadors = ambassadors.map(ambassador => ({
      ...ambassador,
      paidCommission: ambassador.commission,
      status: 'paid'
    }));

    setAmbassadors(updatedAmbassadors);
    setStats(prev => ({
      ...prev,
      availableBalance: 0,
      paidEarnings: prev.paidEarnings + prev.availableBalance
    }));

    toast.success(
      <div>
        <div className="font-bold">Payment Successful!</div>
        <div>₦{totalAvailable.toLocaleString()} sent to your MiniPay wallet</div>
        <div className="text-sm text-gray-600 mt-1">
          Paid: ₦{stats.availableBalance.toLocaleString()} personal + ₦{unpaidAmbassadorCommissions.toLocaleString()} ambassador
        </div>
      </div>,
      { autoClose: 3000 }
    );
  };

  const calculateAvailableBalance = () => {
    const unpaidAmbassadorCommissions = ambassadors.reduce(
      (total, ambassador) => total + (ambassador.commission - ambassador.paidCommission), 
      0
    );
    return stats.availableBalance + unpaidAmbassadorCommissions;
  };

  const handleCopyLink = (link = referralLink) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied to clipboard!');
  };

  const handleShareLink = (link = referralLink) => {
    if (navigator.share) {
      navigator.share({
        title: 'Referral Link',
        text: 'Check out this referral link!',
        url: link
      }).catch(console.error);
    } else {
      toast.error('Web Share API is not supported in your browser.');
    }
  };

  return (
    <div className="container space-y-6">
      {/* PAYMENT SUMMARY SECTION */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="mb-4 text-[#cc0f16]">Payment Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="border rounded-lg p-4">
            <div className="text-gray-500 text-sm">Personal Balance</div>
            <div className="text-2xl font-bold">₦{stats.availableBalance.toLocaleString()}</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-gray-500 text-sm">Unpaid Ambassador Commissions</div>
            <div className="text-2xl font-bold">
              ₦{ambassadors.reduce((total, ambassador) => total + (ambassador.commission - ambassador.paidCommission), 0).toLocaleString()}
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="text-gray-500 text-sm">Total Available</div>
            <div className="text-2xl font-bold text-green-600">
              ₦{calculateAvailableBalance().toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleCashout} 
            className="flex-1 py-4 text-lg bg-green-600 hover:bg-green-700 text-white"
            disabled={calculateAvailableBalance() <= 0}
          >
            <span className="flex items-center justify-center gap-2">
              <DollarSign size={20} />
              Cashout ₦{calculateAvailableBalance().toLocaleString()}
            </span>
          </Button>
        </div>

        {ambassadors.some(a => a.status === 'pending') && (
          <div className="mt-4 text-sm text-gray-600 flex items-center">
            <Info size={16} className="mr-2" />
            {ambassadors.filter(a => a.status === 'pending').length} Ambassadors have pending payments
          </div>
        )}
      </div>

      {role === 'field_agent' ? (
        <>
          {/* AMBASSADOR DASHBOARD TABLE */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 overflow-auto">
            <h2 className="mb-4 text-[#cc0f16]">Ambassador Dashboard</h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full max-w-full table-fixed border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="px-4 py-3 w-1/5">Total</th>
                    <th className="px-4 py-3 w-1/5">Referrals</th>
                    <th className="px-4 py-3 w-1/5">Referrals</th>
                    <th className="px-4 py-3 w-1/5">Commission</th>
                    <th className="px-4 py-3 w-1/5">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-left">
                    <td className="px-4 py-3">{ambassadors.length}</td>
                    <td className="px-4 py-3">{ambassadors.reduce((total, ambassador) => total + ambassador.referrals, 0)}</td>
                    <td className="px-4 py-3">{ambassadors.reduce((total, ambassador) => total + ambassador.valid, 0)}</td>
                    <td className="px-4 py-3 font-medium">₦{ambassadors.reduce((total, ambassador) => total + ambassador.commission, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium">₦{ambassadors.reduce((total, ambassador) => total + ambassador.paidCommission, 0).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AMBASSADOR PERFORMANCE TABLE */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 overflow-auto">
            <h2 className="mb-4 text-[#cc0f16]">Ambassador Performance</h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full max-w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="px-4 py-3 w-1/7">Ambassador</th>
                    <th className="px-4 py-3 w-1/7">Referrals</th>
                    <th className="px-4 py-3 w-1/7">Valid</th>
                    <th className="px-4 py-3 w-1/7">Commission</th>
                    <th className="px-4 py-3 w-1/7">Paid</th>
                    <th className="px-4 py-3 w-1/7">Status</th>
                    <th className="px-4 py-3 w-1/7">Referral Link</th>
                  </tr>
                </thead>
                <tbody>
                  {ambassadors.map((ambassador, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-3 whitespace-nowrap">{ambassador.name}</td>
                      <td className="px-4 py-3 text-center">{ambassador.referrals}</td>
                      <td className="px-4 py-3 text-center">{ambassador.valid}</td>
                      <td className="px-4 py-3 text-right font-medium">₦{ambassador.commission.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium">₦{ambassador.paidCommission.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap flex items-center w-fit ${
                          ambassador.status === 'paid' ? 
                            'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ambassador.status === 'paid' ? (
                            <>
                              <Check size={14} className="mr-1" /> Paid
                            </>
                          ) : (
                            <>
                              <X size={14} className="mr-1" /> Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[140px] md:max-w-[180px] text-[#cc0f16]">{ambassador.link}</span>
                          <div className="flex gap-2 flex-shrink-0">
                            <button 
                              onClick={() => handleCopyLink(ambassador.link)}
                              className="p-1 text-gray-500 hover:text-[#cc0f16]"
                              title="Copy"
                            >
                              <Copy size={16} />
                            </button>
                            <button 
                              onClick={() => handleShareLink(ambassador.link)}
                              className="p-1 text-gray-500 hover:text-[#cc0f16]"
                              title="Share"
                            >
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PERSONAL DASHBOARD TABLE */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 overflow-auto">
            <h2 className="mb-4 text-[#cc0f16]">Your Performance</h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full max-w-full table-fixed border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="px-4 py-3 w-1/5">Total Referrals</th>
                    <th className="px-4 py-3 w-1/5">Valid Referrals</th>
                    <th className="px-4 py-3 w-1/5">Total Earnings</th>
                    <th className="px-4 py-3 w-1/5">Paid Earnings</th>
                    <th className="px-4 py-3 w-1/5">Available Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-left">
                    <td className="px-4 py-3">{stats.referrals}</td>
                    <td className="px-4 py-3">{stats.valid}</td>
                    <td className="px-4 py-3 font-bold">₦{stats.earnings.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">₦{stats.paidEarnings.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-green-600">₦{stats.availableBalance.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AGENT ACTIONS */}
          {showAddAmbassador && (
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mb-6">
              <input
                type="text"
                placeholder="Enter Ambassador Name"
                value={ambassadorName}
                onChange={handleAmbassadorNameChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#cc0f16] focus:ring-2 focus:ring-[#cc0f16]"
              />
              <div className="flex gap-4">
                <Button 
                  onClick={() => setShowAddAmbassador(false)}
                  variant="outline" 
                  className="flex-1 py-3 text-lg border-[#cc0f16] text-[#cc0f16] hover:bg-[#cc0f16]/10"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateAmbassadorLink} 
                  className="flex-1 py-3 text-lg bg-[#cc0f16] hover:bg-[#a50c12] text-white"
                >
                  Generate Link
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* AMBASSADOR DASHBOARD */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 overflow-auto">
            <h2 className="mb-4 text-[#cc0f16]">Your Performance</h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full max-w-full table-fixed border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="px-4 py-3 w-1/5">Total Referrals</th>
                    <th className="px-4 py-3 w-1/5">Valid Referrals</th>
                    <th className="px-4 py-3 w-1/5">Total Earnings</th>
                    <th className="px-4 py-3 w-1/5">Paid Earnings</th>
                    <th className="px-4 py-3 w-1/5">Available Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-left">
                    <td className="px-4 py-3">{stats.referrals}</td>
                    <td className="px-4 py-3">{stats.valid}</td>
                    <td className="px-4 py-3 font-bold">₦{stats.earnings.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">₦{stats.paidEarnings.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-green-600">₦{stats.availableBalance.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* COMMON REFERRAL LINK SECTION */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="mb-4 text-[#cc0f16]">Your Referral Link</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-lg"
          />
          <div className="flex gap-4">
            <Button 
              onClick={handleCopyLink} 
              variant="outline" 
              className="flex-1 py-3 text-lg border-[#cc0f16] text-[#cc0f16] hover:bg-[#cc0f16]/10"
            >
              <span className="flex items-center justify-center gap-2">
                <Copy size={20} />
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </Button>
            <Button 
              onClick={handleShareLink} 
              variant="outline" 
              className="flex-1 py-3 text-lg border-[#cc0f16] text-[#cc0f16] hover:bg-[#cc0f16]/10"
            >
              <span className="flex items-center justify-center gap-2">
                <Share2 size={20} />
                Share
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* BUTTONS ROW */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {role === 'field_agent' && (
          <Button 
            onClick={handleAddAmbassador} 
            className="flex-1 py-4 text-lg bg-[#cc0f16] hover:bg-[#a50c12] text-white"
          >
            <span className="flex items-center justify-center gap-2">
              <Users size={20} />
              Add New Ambassador
            </span>
          </Button>
        )}
        
        <Button
          onClick={handleLogout}
          className="flex-1 py-4 text-lg bg-[#cc0f16] hover:bg-[#a50c12] text-white"
        >
          <span className="flex items-center justify-center gap-2">
            <LogOut size={20} />
            Logout
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;