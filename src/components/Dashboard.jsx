import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from './ui/card';
import { Button } from './ui/button';
import {
  DollarSign,
  Users,
  Activity,
  LogOut
} from 'lucide-react';
import ReferralLinkGenerator from './ReferralLinkGenerator';
import VendorReferralGenerator from './VendorReferralGenerator';
import { toast } from 'react-toastify';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <Card className="hover:shadow-md transition-all duration-300">
    <CardContent className="flex items-center space-x-4 p-4">
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`${color} h-6 w-6`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    referrals: 0,
    valid: 0,
    earnings: 0
  });
  const [vendors, setVendors] = useState([]);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const agentId = localStorage.getItem('tempId');

  useEffect(() => {
    const fetchStats = () => {
      const mockStats = {
        field_agent: {
          referrals: 100,
          valid: 85,
          earnings: 42500,
          vendors: 8,
          active: 6
        },
        vendor: {
          referrals: 12,
          valid: 10,
          earnings: 120
        }
      };
      setStats(mockStats[role] || { referrals: 0, valid: 0, earnings: 0 });
    };

    const fetchVendors = () => {
      const mockVendors = [
        { name: 'Ella Amadi', referrals: 15, valid: 10, commission: 5000, status: 'paid', link: `https://play.google.com/store/apps/details?id=com.opera.mini.native&v_id=${agentId}_1` },
        { name: 'Shoozy B', referrals: 35, valid: 8, commission: 4000, status: 'pending', link: `https://play.google.com/store/apps/details?id=com.opera.mini.native&v_id=${agentId}_2` },
        { name: 'Victor PoS', referrals: 4, valid: 2, commission: 1000, status: 'pending', link: `https://play.google.com/store/apps/details?id=com.opera.mini.native&v_id=${agentId}_3` }
      ];
      setVendors(mockVendors);
    };

    fetchStats();
    fetchVendors();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [role, agentId]);

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

  const handleAddVendor = () => {
    setShowAddVendor(true);
  };

  const handleVendorNameChange = (e) => {
    setVendorName(e.target.value);
  };

  const handleGenerateVendorLink = () => {
    if (vendorName.trim() === '') {
      toast.error('Please enter a vendor name.');
      return;
    }

    const id = Math.random().toString(36).substr(2, 9);
    const link = `https://play.google.com/store/apps/details?id=com.opera.mini.native&v_id=${agentId}_${id}`;

    const newVendor = {
      name: vendorName,
      referrals: 0,
      valid: 0,
      commission: 0,
      status: 'pending',
      link: link
    };

    setVendors([...vendors, newVendor]);
    setVendorName('');
    setShowAddVendor(false);
    toast.success('Vendor added successfully!');
  };

  const handleCashout = () => {
    toast.success('Congratulations! Your earnings have been sent to MiniPay wallet!');
  };

  const roleTitle = role === 'field_agent' ? 'Field Agent' : 'Vendor';

  return (
    <div className="container">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          {roleTitle} Dashboard
        </h1>

        {role === 'field_agent' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Your Vendor Dashboard</h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border text-left">Total Vendors</th>
                  <th className="p-3 border text-left">Total Completed Vendor Referrals</th>
                  <th className="p-3 border text-left">Total Valid Referrals</th>
                  <th className="p-3 border text-left">Total Earnings via Vendor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border">{vendors.length}</td>
                  <td className="p-3 border">{vendors.reduce((total, vendor) => total + vendor.referrals, 0)}</td>
                  <td className="p-3 border">{vendors.reduce((total, vendor) => total + vendor.valid, 0)}</td>
                  <td className="p-3 border">₦{vendors.reduce((total, vendor) => total + vendor.commission, 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <h2 className="text-2xl font-bold mb-4">Vendor Performance</h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border text-left">Vendor</th>
                  <th className="p-3 border text-left">Referrals</th>
                  <th className="p-3 border text-left">Valid</th>
                  <th className="p-3 border text-left">Commission</th>
                  <th className="p-3 border text-left">Status</th>
                  <th className="p-3 border text-left">Referral Link</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, index) => (
                  <tr key={index}>
                    <td className="p-3 border">{vendor.name}</td>
                    <td className="p-3 border">{vendor.referrals}</td>
                    <td className="p-3 border">{vendor.valid}</td>
                    <td className="p-3 border">₦{vendor.commission.toLocaleString()}</td>
                    <td className="p-3 border">{vendor.status}</td>
                    <td className="p-3 border">
                      <ReferralLinkGenerator link={vendor.link} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-2xl font-bold mb-4">Your Personal Dashboard</h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border text-left">Total Referrals</th>
                  <th className="p-3 border text-left">Valid Referrals</th>
                  <th className="p-3 border text-left">Total Earnings</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border">{stats.referrals}</td>
                  <td className="p-3 border">{stats.valid}</td>
                  <td className="p-3 border">₦{stats.earnings.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="button-container space-y-4">
              <Button onClick={handleAddVendor} className="w-full bg-blue-600 hover:bg-blue-700">
                Add New Vendor
              </Button>

              {showAddVendor && (
                <div className="mt-4 space-y-2">
                  <input
                    type="text"
                    placeholder="Enter PoS Vendor Name"
                    value={vendorName}
                    onChange={handleVendorNameChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <Button onClick={handleGenerateVendorLink} className="w-full bg-blue-600 hover:bg-blue-700">
                    Generate Link for Vendor
                  </Button>
                </div>
              )}

              <Button onClick={handleCashout} className="w-full bg-green-600 hover:bg-green-700">
                Cashout
              </Button>
            </div>
          </>
        )}

        <ReferralLinkGenerator
          link={`https://play.google.com/store/apps/details?id=com.opera.mini.native&${role === 'field_agent' ? 'fa_id' : 'v_id'}=${localStorage.getItem('tempId')}`}
        />

        <div className="mt-6 flex justify-end">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="mr-2" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;