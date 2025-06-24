import React from 'react';
import { Download, Video, Instagram, Youtube } from 'lucide-react';

const Header = () => {
  return (
    <header className="glass border-b border-red-900/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg">
              <Download className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Video Downloader Pro
              </h1>
              <p className="text-gray-400 text-sm">
                Download from Instagram & YouTube
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <Instagram className="w-5 h-5" />
              <Youtube className="w-5 h-5" />
              <Video className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;