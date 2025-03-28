import React from 'react';

const PasswordActivator = ({ password, onPasswordChange }) => {
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/\d/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Enter password"
      />
      <div>
        Password Strength: {strength}/3
      </div>
    </div>
  );
};

export default PasswordActivator;
