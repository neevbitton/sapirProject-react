import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Camera } from '../types';

interface CameraFeedProps {
  camera: Camera;
  isActive: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ camera, isActive }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
      isActive ? 'ring-4 ring-red-500 animate-pulse' : ''
    }`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img 
        src={camera.feedUrl}
        alt={`Camera feed from ${camera.location}`}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {isActive && (
        <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 animate-pulse">
          <AlertCircle className="h-5 w-5" />
        </div>
      )}
      
      <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium text-sm">{camera.location}</h3>
            <p className="text-gray-300 text-xs">ID: {camera.id}</p>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-green-400 text-xs">Live</span>
          </div>
          <img 
  src={camera.feedUrl}
  alt="camera"
  onError={() => console.error("failed loading", camera.feedUrl)}
/>
<p className="text-xs">{camera.feedUrl}</p>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;