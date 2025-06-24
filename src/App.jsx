import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import VideoInput from './components/VideoInput';
import VideoDetails from './components/VideoDetails';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

function App() {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid #dc2626',
          },
        }}
      />
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <VideoInput 
            setVideoData={setVideoData} 
            setLoading={setLoading}
          />
          
          {loading && <LoadingSpinner />}
          
          {videoData && !loading && (
            <VideoDetails videoData={videoData} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;