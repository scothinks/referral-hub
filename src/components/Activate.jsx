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
  XCircle
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
          <div
            key={index}
            className={`flex items-center space-x-2 ${passed ? 'text-green-600' : 'text-red-500'}`}
          >
            {passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span className="text-sm">{check.label}</span>
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
    <div className="container">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Activate Account</h2>
          <p className="mt-2 text-sm text-gray-600">Create a strong password to secure your account</p>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter secure password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full"
          />
          <PasswordStrengthIndicator password={password} />
          <Input
            type="email"
            placeholder="Backup Email (optional)"
            value={backupEmail}
            onChange={handleBackupEmailChange}
            className="w-full"
          />
          <p className="text-sm text-gray-600">
            If you ever forget your password, we'll send a link to this email address to reset your password.
          </p>
          <Button
            onClick={handleActivate}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Activate Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Activate;
