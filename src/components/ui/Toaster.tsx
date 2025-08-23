import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useWebSocketContext } from '../../context/WebSocketContext';

export const Toaster: React.FC = () => {
  const { isConnected } = useWebSocketContext();
  const [showToast, setShowToast] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  useEffect(() => {
    if (isConnected) {
      setStatusMessage('Connected to security system');
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setStatusMessage('Disconnected from security system');
      setShowToast(true);
    }
  }, [isConnected]);
  
  if (!showToast) return null;
  
  return (
    <div className="fixed bottom-4 right-4 max-w-md w-full md:w-auto z-50">
      <div className={`rounded-lg shadow-lg overflow-hidden ${
        isConnected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {isConnected ? (
                <div className="h-5 w-5 rounded-full bg-green-600 animate-pulse"></div>
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className={`text-sm font-medium ${
                isConnected ? 'text-green-800' : 'text-red-800'
              }`}>
                {statusMessage}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className={`bg-transparent rounded-md inline-flex focus:outline-none ${
                  isConnected ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'
                }`}
                onClick={() => setShowToast(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};