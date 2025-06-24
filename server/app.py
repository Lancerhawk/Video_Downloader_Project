#!/usr/bin/env python3
import os
import sys
import json
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import instaloader
import requests
from urllib.parse import urlparse
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure temporary directory
TEMP_DIR = tempfile.mkdtemp()

class VideoDownloader:
    def __init__(self):
        self.yt_dlp_opts = {
            'outtmpl': os.path.join(TEMP_DIR, '%(title)s.%(ext)s'),
            'format': 'best[height<=720]',
            'noplaylist': True,
            'extractaudio': False,
            'audioformat': 'mp3',
            'embed_subs': True,
            'writesubtitles': False,
            'writeautomaticsub': False,
        }
        
    def is_instagram_url(self, url):
        instagram_patterns = [
            r'https?://(www\.)?instagram\.com/(p|reel|tv)/[A-Za-z0-9_-]+',
            r'https?://(www\.)?instagr\.am/(p|reel|tv)/[A-Za-z0-9_-]+'
        ]
        return any(re.match(pattern, url) for pattern in instagram_patterns)
    
    def is_youtube_url(self, url):
        youtube_patterns = [
            r'https?://(www\.)?youtube\.com/watch\?v=[A-Za-z0-9_-]+',
            r'https?://(www\.)?youtu\.be/[A-Za-z0-9_-]+',
            r'https?://(www\.)?youtube\.com/embed/[A-Za-z0-9_-]+'
        ]
        return any(re.match(pattern, url) for pattern in youtube_patterns)
    
    def get_instagram_info(self, url):
        try:
            # Extract shortcode from URL
            shortcode_match = re.search(r'/(p|reel|tv)/([A-Za-z0-9_-]+)', url)
            if not shortcode_match:
                raise ValueError("Invalid Instagram URL")
            
            shortcode = shortcode_match.group(2)
            
            # Use instaloader to get post info
            L = instaloader.Instaloader()
            
            try:
                post = instaloader.Post.from_shortcode(L.context, shortcode)
                
                video_info = {
                    'title': post.caption[:100] + '...' if post.caption and len(post.caption) > 100 else post.caption or 'Instagram Post',
                    'description': post.caption or '',
                    'thumbnail': post.url,
                    'author': post.owner_username,
                    'upload_date': post.date.strftime('%Y-%m-%d') if post.date else None,
                    'likes': post.likes,
                    'comments': post.comments,
                    'views': post.video_view_count if post.is_video else None,
                    'duration': post.video_duration if post.is_video else None,
                    'url': url,
                    'platform': 'instagram',
                    'formats': [
                        {
                            'quality': 'HD',
                            'ext': 'mp4' if post.is_video else 'jpg',
                            'filesize': 'Unknown'
                        }
                    ]
                }
                
                return video_info
                
            except Exception as e:
                # Fallback: try with yt-dlp
                return self.get_video_info_ytdlp(url)
                
        except Exception as e:
            print(f"Instagram info error: {str(e)}")
            raise Exception(f"Failed to get Instagram video info: {str(e)}")
    
    def get_youtube_info(self, url):
        try:
            return self.get_video_info_ytdlp(url)
        except Exception as e:
            print(f"YouTube info error: {str(e)}")
            raise Exception(f"Failed to get YouTube video info: {str(e)}")
    
    def get_video_info_ytdlp(self, url):
        try:
            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
                'extract_flat': False,
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                # Extract available formats
                formats = []
                if 'formats' in info:
                    seen_qualities = set()
                    for fmt in info['formats']:
                        if fmt.get('vcodec') != 'none':  # Video formats only
                            quality = fmt.get('height', 'Unknown')
                            if quality not in seen_qualities:
                                formats.append({
                                    'quality': f"{quality}p" if isinstance(quality, int) else str(quality),
                                    'ext': fmt.get('ext', 'mp4'),
                                    'filesize': self.format_filesize(fmt.get('filesize'))
                                })
                                seen_qualities.add(quality)
                
                # If no formats found, add default
                if not formats:
                    formats = [{'quality': 'Best', 'ext': 'mp4', 'filesize': 'Unknown'}]
                
                video_info = {
                    'title': info.get('title', 'Video'),
                    'description': info.get('description', ''),
                    'thumbnail': info.get('thumbnail'),
                    'author': info.get('uploader', info.get('channel', 'Unknown')),
                    'upload_date': info.get('upload_date'),
                    'views': info.get('view_count'),
                    'likes': info.get('like_count'),
                    'duration': info.get('duration'),
                    'url': url,
                    'platform': 'youtube' if 'youtube' in url else 'other',
                    'formats': formats[:5]  # Limit to 5 formats
                }
                
                return video_info
                
        except Exception as e:
            print(f"yt-dlp error: {str(e)}")
            raise Exception(f"Failed to extract video info: {str(e)}")
    
    def format_filesize(self, size):
        if not size:
            return 'Unknown'
        
        if size < 1024:
            return f"{size} B"
        elif size < 1024 * 1024:
            return f"{size / 1024:.1f} KB"
        elif size < 1024 * 1024 * 1024:
            return f"{size / (1024 * 1024):.1f} MB"
        else:
            return f"{size / (1024 * 1024 * 1024):.1f} GB"
    
    def download_video(self, url, format_ext='mp4', quality='best'):
        try:
            # Configure download options
            ydl_opts = {
                'outtmpl': os.path.join(TEMP_DIR, f'%(title)s-{quality}.%(ext)s'),
                'noplaylist': True,
            }

            if quality != 'best':
                height_match = re.search(r'(\d+)', str(quality))
                if height_match:
                    height = height_match.group(1)
                    ydl_opts['format'] = f"bestvideo[height<={height}]+bestaudio/best[height<={height}]"
                    ydl_opts['merge_output_format'] = 'mp4'
                else:
                    ydl_opts['format'] = 'best'
            else:
                ydl_opts['format'] = f'best[ext={format_ext}]' if format_ext != 'mp4' else 'best'

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # Extract info to get the filename
                info = ydl.extract_info(url, download=False)
                filename = ydl.prepare_filename(info)
                
                # Download the video
                ydl.download([url])
                
                return filename
                
        except Exception as e:
            print(f"Download error: {str(e)}")
            raise Exception(f"Failed to download video: {str(e)}")

# Initialize downloader
downloader = VideoDownloader()

@app.route('/api/video-info', methods=['POST'])
def get_video_info():
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Determine platform and get info
        if downloader.is_instagram_url(url):
            video_info = downloader.get_instagram_info(url)
        elif downloader.is_youtube_url(url):
            video_info = downloader.get_youtube_info(url)
        else:
            return jsonify({'error': 'Unsupported URL. Please provide a valid Instagram or YouTube URL.'}), 400
        
        return jsonify(video_info)
        
    except Exception as e:
        print(f"Error in get_video_info: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
def download_video():
    try:
        data = request.get_json()
        url = data.get('url')
        format_ext = data.get('format', 'mp4')
        quality = data.get('quality', 'best')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Download the video
        filename = downloader.download_video(url, format_ext, quality)
        
        if os.path.exists(filename):
            return send_file(
                filename,
                as_attachment=True,
                download_name=os.path.basename(filename)
            )
        else:
            return jsonify({'error': 'Download failed - file not found'}), 500
            
    except Exception as e:
        print(f"Error in download_video: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Video Downloader API is running'})

if __name__ == '__main__':
    print("Starting Video Downloader API server...")
    print(f"Temporary directory: {TEMP_DIR}")
    app.run(debug=True, host='0.0.0.0', port=5000)