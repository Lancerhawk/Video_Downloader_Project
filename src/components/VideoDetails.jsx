import React from 'react';
import { Download, Eye, Heart, MessageCircle, Share, Calendar, User, Play } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VideoDetails = ({ videoData }) => {
  const handleDownload = async (format, quality) => {
    try {
      toast.loading('Preparing download...');
      
      const response = await axios.post('/api/download', {
        url: videoData.url,
        format,
        quality
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${videoData.title || 'video'}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.dismiss();
      toast.success('Download started!');
    } catch (error) {
      toast.dismiss();
      toast.error('Download failed. Please try again.');
      console.error('Download error:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass rounded-2xl p-8 border border-red-900/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Preview */}
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-video">
            {videoData.thumbnail ? (
              <img
                src={videoData.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <Play className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Video Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videoData.views && (
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <Eye className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <div className="text-sm font-semibold">{formatNumber(videoData.views)}</div>
                <div className="text-xs text-gray-400">Views</div>
              </div>
            )}
            {videoData.likes && (
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <div className="text-sm font-semibold">{formatNumber(videoData.likes)}</div>
                <div className="text-xs text-gray-400">Likes</div>
              </div>
            )}
            {videoData.comments && (
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <MessageCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <div className="text-sm font-semibold">{formatNumber(videoData.comments)}</div>
                <div className="text-xs text-gray-400">Comments</div>
              </div>
            )}
            {videoData.duration && (
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <Play className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <div className="text-sm font-semibold">{formatDuration(videoData.duration)}</div>
                <div className="text-xs text-gray-400">Duration</div>
              </div>
            )}
          </div>
        </div>

        {/* Video Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2 gradient-text">
              {videoData.title || 'Video Title'}
            </h3>
            {videoData.description && (
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {videoData.description}
              </p>
            )}
          </div>

          {/* Author Info */}
          {videoData.author && (
            <div className="flex items-center space-x-3 p-4 bg-black/30 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold">{videoData.author}</div>
                <div className="text-sm text-gray-400">Content Creator</div>
              </div>
            </div>
          )}

          {/* Upload Date */}
          {videoData.upload_date && (
            <div className="flex items-center space-x-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Uploaded: {videoData.upload_date}</span>
            </div>
          )}

          {/* Download Options */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold gradient-text">Download Options</h4>
            
            <div className="grid gap-3">
              {videoData.formats?.map((format, index) => (
                <button
                  key={index}
                  onClick={() => handleDownload(format.ext, format.quality)}
                  className="flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300 btn-hover"
                >
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-red-400" />
                    <div className="text-left">
                      <div className="font-medium">{format.quality || 'Standard'} Quality</div>
                      <div className="text-sm text-gray-400">
                        {format.ext?.toUpperCase()} • {format.filesize || 'Unknown size'}
                      </div>
                    </div>
                  </div>
                  <div className="text-red-400 font-medium">Download</div>
                </button>
              )) || (
                <button
                  onClick={() => handleDownload('mp4', 'best')}
                  className="flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300 btn-hover"
                >
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-red-400" />
                    <div className="text-left">
                      <div className="font-medium">Best Quality</div>
                      <div className="text-sm text-gray-400">MP4 Format</div>
                    </div>
                  </div>
                  <div className="text-red-400 font-medium">Download</div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;