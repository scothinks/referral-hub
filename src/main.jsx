import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import Setup from './components/Setup';
import Activate from './components/Activate';
import Dashboard from './components/Dashboard';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <div className="font-sans antialiased text-gray-900 min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/setup" />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/activate" element={<Activate />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!bg-white !text-gray-800 !rounded-lg !shadow-md"
        progressClassName="!bg-opera-red"
      />
    </Router>
  </React.StrictMode>
);
