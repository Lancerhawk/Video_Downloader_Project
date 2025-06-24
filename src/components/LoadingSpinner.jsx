import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="glass rounded-2xl p-12 border border-red-900/20 text-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold gradient-text">
            Fetching Video Information
          </h3>
          <p className="text-gray-400">
            Please wait while we analyze the video...
          </p>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;