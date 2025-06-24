import React from 'react';
import { Heart, Shield, Zap, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass border-t border-red-900/20 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4">
            <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Secure</h4>
            <p className="text-sm text-gray-400">Your privacy is protected</p>
          </div>
          <div className="text-center p-4">
            <Zap className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Fast</h4>
            <p className="text-sm text-gray-400">Lightning-fast downloads</p>
          </div>
          <div className="text-center p-4">
            <Globe className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Universal</h4>
            <p className="text-sm text-gray-400">Works on all devices</p>
          </div>
          <div className="text-center p-4">
            <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Free</h4>
            <p className="text-sm text-gray-400">Always free to use</p>
          </div>
        </div>
        
        <div className="text-center pt-6 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            © 2025 Video Downloader Pro. Made with <Heart className="w-4 h-4 inline text-red-500" /> for content creators.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;