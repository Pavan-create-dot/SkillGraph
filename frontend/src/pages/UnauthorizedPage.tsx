import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
          403
        </h1>
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-slate-400 text-sm">
          You do not have the required permissions to view this resource.
        </p>
        <div>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
