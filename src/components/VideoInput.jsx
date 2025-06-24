import React, { useState } from 'react';
import { Search, Link, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VideoInput = ({ setVideoData, setLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url) => {
    const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(p|reel|tv)\/[A-Za-z0-9_-]+/;
    const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]+/;
    
    return instagramRegex.test(url) || youtubeRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid Instagram or YouTube URL');
      return;
    }

    setLoading(true);
    setVideoData(null);

    try {
      const response = await axios.post('/api/video-info', { url });
      setVideoData(response.data);
      toast.success('Video information loaded successfully!');
    } catch (error) {
      console.error('Error fetching video data:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch video information');
      setError(error.response?.data?.error || 'Failed to fetch video information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-8 border border-red-900/20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 gradient-text">
          Download Videos & Reels
        </h2>
        <p className="text-gray-400 text-lg">
          Paste your Instagram or YouTube URL below to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Link className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/p/... or https://www.youtube.com/watch?v=..."
            className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/30">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] btn-hover flex items-center justify-center space-x-2"
        >
          <Search className="w-5 h-5" />
          <span>Get Video Information</span>
        </button>
      </form>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Instagram Posts & Reels</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>YouTube Videos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>High Quality Downloads</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Fast & Secure</span>
        </div>
      </div>
    </div>
  );
};

export default VideoInput;