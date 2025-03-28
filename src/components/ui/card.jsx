import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="p-4 border-b">
    {children}
  </div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
);

export const CardDescription = ({ children }) => (
  <p className="text-gray-600">{children}</p>
);

export const CardContent = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
);
