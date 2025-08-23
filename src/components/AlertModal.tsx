import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAlertContext } from '../context/AlertContext';
import { formatTime } from '../utils/dateUtils';

const AlertModal: React.FC = () => {
  const { currentAlert, dismissAlert, confirmAlert } = useAlertContext();
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!currentAlert){
    // console.log("No alert to show");
   return null;
   }
   
  
  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      confirmAlert();
      setIsProcessing(false);
    }, 600);
  };
  
  const handleDismiss = () => {
    setIsProcessing(true);
    setTimeout(() => {
      dismissAlert();
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
        <div className="bg-red-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-bold">Potential Anomaly Detected</h2>
          </div>
          <button 
            onClick={handleDismiss} 
            className="text-white hover:text-red-100 transition-colors"
            disabled={isProcessing}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
            <img 
              src={currentAlert.imageUrl} 
              alt="Anomaly preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {formatTime(currentAlert.timestamp)}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{currentAlert.type}</h3>
              <span className="text-sm text-gray-500">{currentAlert.cameraLocation}</span>
            </div>
            <p className="text-sm text-gray-600">{currentAlert.description}</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-sm text-blue-800">
              <span className="font-medium">System learning:</span> Your feedback helps the system improve detection accuracy over time.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : (
                <span className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Anomaly
                </span>
              )}
            </button>
            <button
              onClick={handleDismiss}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : (
                <span className="flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  False Alarm
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;