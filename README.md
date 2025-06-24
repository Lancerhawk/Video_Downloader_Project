# Video Downloader Pro

A modern, fullstack video downloader platform supporting YouTube and Instagram, with real-time download progress, beautiful UI, and easy deployment to Railway (backend) and Vercel (frontend).

---

## 🚀 Features
- **Download from YouTube & Instagram**: Supports reels, posts, and videos.
- **Choose Quality**: Select from multiple resolutions (e.g., 144p, 720p, etc.).
- **Real-Time Progress**: See live download progress, speed, and ETA in the UI.
- **Modern UI**: Sleek, glassmorphic React interface with Tailwind CSS.
- **WebSocket Powered**: Instant feedback using Flask-SocketIO and socket.io-client.
- **Production Ready**: Deploy backend to Railway, frontend to Vercel.
- **FFmpeg Support**: Handles merging and conversion for best compatibility.

---

## 🗂️ Project Structure

```
project/
  README.md
  package.json
  src/           # React frontend
    components/
    ...
  server/        # Python backend
    app.py
    requirements.txt
    nixpacks.toml
    runtime.txt
```

---

## 🛠️ Tech Stack

### Frontend
- React 18 (Vite)
- Tailwind CSS
- socket.io-client
- Lucide React (icons)

### Backend
- Python 3.11 (Flask)
- Flask-SocketIO (WebSockets)
- yt-dlp (video downloading)
- instaloader (Instagram)
- eventlet (async server)
- ffmpeg (system package)

### Deployment
- **Backend:** Railway (with Gunicorn + eventlet)
- **Frontend:** Vercel (static React build)

---

## ⚡ Local Development

### 1. Clone the Repo
```bash
git clone <your-repo-url>
cd project
```

### 2. Install Backend Dependencies
```bash
cd server
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
```bash
cd ..
npm install
```

### 4. Start Backend (in `/server`)
```bash
python app.py
```
- Make sure you see: `* Running on http://0.0.0.0:5000/ ...`

### 5. Start Frontend (in project root)
```bash
npm run dev
```
- Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

### Backend (Railway)
1. **Set root directory to `/server`** in Railway service settings.
2. **Ensure `requirements.txt`, `nixpacks.toml`, and `runtime.txt` are present in `/server`.**
3. **Install Command:**
   ```
   pip install -r requirements.txt
   ```
4. **Start Command:**
   ```
   gunicorn --worker-class eventlet -w 1 -b 0.0.0.0:5000 app:app
   ```
5. **runtime.txt:**
   ```
   python-3.11.8
   ```
6. **nixpacks.toml:**
   ```toml
   [phases.setup]
   aptPkgs = ["ffmpeg"]

   [start]
   cmd = "gunicorn --worker-class eventlet -w 1 -b 0.0.0.0:5000 app:app"
   ```
7. **After deploy, note your backend URL (e.g., `https://your-backend.up.railway.app`).**

### Frontend (Vercel)
1. **Set root directory to `/` (or wherever your React app is).**
2. **Set environment variable in Vercel:**
   - `VITE_BACKEND_URL=https://your-backend.up.railway.app`
3. **Update all API and WebSocket calls in your React code to use:**
   ```js
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
   axios.post(`${backendUrl}/api/video-info`, ...);
   const socket = io(backendUrl);
   ```
4. **Deploy!**

---

## 🔗 Environment Variables
- **Frontend:**
  - `VITE_BACKEND_URL` — URL of your deployed Railway backend
- **Backend:**
  - No special variables needed for basic use

---

## 🔥 Usage
1. **Paste a YouTube or Instagram URL** in the input field.
2. **View video details** and select your desired quality.
3. **Click Download** — watch the real-time progress bar fill up!
4. **File downloads automatically when ready.**

---

## 🛡️ CORS & WebSocket Security
- For development, CORS is set to `*`.
- For production, set CORS to your Vercel frontend domain for better security:
  ```python
  socketio = SocketIO(app, cors_allowed_origins="https://your-frontend.vercel.app")
  CORS(app, origins="https://your-frontend.vercel.app")
  ```

---

## 📝 Troubleshooting
- **Frontend can't connect to backend?**
  - Make sure backend is running and CORS allows your frontend domain.
  - Check that `VITE_BACKEND_URL` is set correctly in Vercel.
- **WebSocket 404 or no progress?**
  - Make sure backend is started with Gunicorn + eventlet (not Flask dev server).
  - Make sure Python version is 3.11 or 3.10 (not 3.12).
- **ffmpeg errors?**
  - Confirm `ffmpeg` is installed (see `nixpacks.toml`).
- **Instagram/YouTube download errors?**
  - Make sure `yt-dlp` is up to date in `requirements.txt`.

---

## 📦 API Endpoints
- `POST /api/video-info` — Get video information
- `WebSocket: start_download` — Start download, receive progress events
- `GET /api/download_file?path=...` — Download the completed file
- `GET /api/health` — Health check

---

## 📄 License
MIT — see [LICENSE](LICENSE)

---

## 🙏 Credits
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [instaloader](https://github.com/instaloader/instaloader)
- [Flask-SocketIO](https://flask-socketio.readthedocs.io/)
- [Railway](https://railway.app/)
- [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 💬 Questions?
Open an issue or discussion on GitHub!
