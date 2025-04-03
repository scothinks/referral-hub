import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  Lock,
  CheckCircle2,
  XCircle,
  Mail
} from 'lucide-react';

const PasswordStrengthIndicator = ({ password }) => {
  const checks = [
    { test: (p) => p.length >= 8, label: 'At least 8 characters' },
    { test: (p) => /\d/.test(p), label: 'Contains a number' },
    { test: (p) => /[A-Z]/.test(p), label: 'Contains a capital letter' }
  ];
  
  return (
    <div className="space-y-2 mt-2">
      {checks.map((check, index) => {
        const passed = check.test(password);
        return (
          <div key={index} className="flex items-center gap-2 text-sm">
            {passed ? 
              <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
              <XCircle className="h-4 w-4 text-red-500" />
            }
            <span className={passed ? "text-green-700" : "text-gray-600"}>
              {check.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const Activate = () => {
  const [password, setPassword] = useState('');
  const [backupEmail, setBackupEmail] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleBackupEmailChange = (e) => {
    setBackupEmail(e.target.value);
  };

  const handleActivate = () => {
    const passwordChecks = [
      password.length >= 8,
      /\d/.test(password),
      /[A-Z]/.test(password)
    ];
    
    if (!passwordChecks.every(Boolean)) {
      toast.error('Password does not meet all requirements', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
      return;
    }
    
    const tempId = localStorage.getItem('tempId');
    const role = localStorage.getItem('role');
    const hashedPassword = btoa(password);
    
    localStorage.setItem('password', hashedPassword);
    localStorage.setItem('activated', 'true');
    localStorage.setItem('backupEmail', backupEmail);
    
    toast.success('Account Activated Successfully!', {
      position: "top-right",
      autoClose: 2000,
      onClose: () => navigate('/dashboard')
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Activate Account</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Create a strong password to secure your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="password"
                id="password"
                placeholder="Create Password"
                value={password}
                onChange={handlePasswordChange}
                className="pl-10 w-full bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <PasswordStrengthIndicator password={password} />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="backupEmail" className="block text-sm font-medium text-gray-700"><br></br>
              Backup Email Address
            </label>
            <div className="text-xs text-gray-500 mb-2">
              If you forget your password, we'll send a reset link to this email address.
            </div>
            <div className="relative">
              <Input
                type="email"
                id="backupEmail"
                placeholder="Enter your email"
                value={backupEmail}
                onChange={handleBackupEmailChange}
                className="pl-10 w-full bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <Button 
            onClick={handleActivate} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
          >
            Activate Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activate;