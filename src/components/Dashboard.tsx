import React, { useState } from 'react';
import { Shield, Users, Camera as CameraIcon } from 'lucide-react';
import Header from './Header';
import CameraGrid from './CameraGrid';
import EventHistory from './EventHistory';
import AlertModal from './AlertModal';
import SystemMetrics from './SystemMetrics';
import UserManagement from './admin/UserManagement';
import CameraManagement from './admin/CameraManagement';
import { useAlertContext } from '../context/AlertContext';
import { useAuthStore } from '../store/authStore';
// import { useWebSocketContext } from '../context/WebSocketContext';
// import { hexToBase64 } from '../utils/utils';

const Dashboard: React.FC = () => {
  const { currentAlert } = useAlertContext();
  // const { lastMessage } = useWebSocketContext();
  const user = useAuthStore(state => state.currentUser);
  const [selectedTab, setSelectedTab] = useState<'cameras' | 'history' | 'users' | 'camera-management'>('cameras');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-700" />
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <div className="flex space-x-1">
              <button 
                onClick={() => setSelectedTab('cameras')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedTab === 'cameras' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Live Cameras
              </button>
              <button 
                onClick={() => setSelectedTab('history')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedTab === 'history' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Event History
              </button>
              {user?.role === 'admin' && (
                <>
                  <button 
                    onClick={() => setSelectedTab('users')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      selectedTab === 'users' 
                        ? 'bg-blue-700 text-white' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Users
                    </span>
                  </button>
                  <button 
                    onClick={() => setSelectedTab('camera-management')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      selectedTab === 'camera-management' 
                        ? 'bg-blue-700 text-white' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center">
                      <CameraIcon className="h-4 w-4 mr-1" />
                      Cameras
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {selectedTab === 'users' && user?.role === 'admin' ? (
          <UserManagement />
        ) : selectedTab === 'camera-management' && user?.role === 'admin' ? (
          <CameraManagement />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className={`lg:col-span-3 ${selectedTab === 'cameras' ? 'block' : 'hidden lg:block'}`}>
              <CameraGrid />
              <img
                src="http://localhost:5000/video_feed"
                alt="Live Stream"
                className="mt-6 rounded-lg border border-gray-300 shadow"
              />
              {/* {lastMessage && (
                <div className="mt-4 bg-red-100 border border-red-300 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-700">Anomaly Detected: {lastMessage.type}</h3>
                  <img
                    src={`data:image/jpeg;base64,${hexToBase64(lastMessage.imageUrl)}`}
                    alt="Detected Anomaly"
                    className="mt-2 rounded border border-gray-300"
                  />
                </div>
              )} */}
            </div>

            <div className={`lg:col-span-1 ${selectedTab === 'history' ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
                <SystemMetrics />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h2>
                <EventHistory />
              </div>
            </div>
          </div>
        )}
      </div>

      {currentAlert && <AlertModal />}
    </div>
  );
};

export default Dashboard;
