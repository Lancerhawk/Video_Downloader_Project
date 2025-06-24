# Video Downloader Pro

A modern, sleek video downloading platform that supports Instagram and YouTube content with a beautiful red and black themed interface.

## Features

- 🎥 **Instagram Support**: Download posts, reels, and IGTV videos
- 📺 **YouTube Support**: Download videos in various qualities
- 🎨 **Modern UI**: Sleek red and black theme with glass morphism effects
- 📱 **Responsive Design**: Works perfectly on all devices
- ⚡ **Fast Downloads**: Optimized for speed and reliability
- 🔒 **Secure**: No data stored, privacy-focused
- 📊 **Video Details**: Shows views, likes, comments, and more

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Python Flask server
- yt-dlp for video extraction
- instaloader for Instagram content
- Flask-CORS for cross-origin requests

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- pip (Python package manager)

### Setup Instructions

1. **Install Python Dependencies**
   ```bash
   python server/install_dependencies.py
   ```

2. **Install Node.js Dependencies**
   ```bash
   npm install
   ```

3. **Start the Backend Server**
   ```bash
   python server/app.py
   ```

4. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Usage

1. **Paste URL**: Enter an Instagram or YouTube URL in the input field
2. **Get Info**: Click "Get Video Information" to fetch video details
3. **Download**: Choose your preferred quality and format, then click download

### Supported URLs

**Instagram:**
- Posts: `https://www.instagram.com/p/[POST_ID]/`
- Reels: `https://www.instagram.com/reel/[REEL_ID]/`
- IGTV: `https://www.instagram.com/tv/[TV_ID]/`

**YouTube:**
- Videos: `https://www.youtube.com/watch?v=[VIDEO_ID]`
- Short URLs: `https://youtu.be/[VIDEO_ID]`

## API Endpoints

- `POST /api/video-info` - Get video information
- `POST /api/download` - Download video
- `GET /api/health` - Health check

## Development

### Frontend Development
```bash
npm run dev
```

### Backend Development
```bash
python server/app.py
```

### Building for Production
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for educational purposes only. Please respect copyright laws and the terms of service of the platforms you're downloading from. Always ensure you have permission to download and use the content.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.