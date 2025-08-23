import React, { useEffect, useState } from 'react';
// import { useWebSocketContext } from '../context/WebSocketContext';
import { useAlertContext } from '../context/AlertContext';
import CameraFeed from './CameraFeed';
import { useAdminStore } from '../store/adminStore';

const CameraGrid: React.FC = () => {
  const [layout, setLayout] = useState<'2x2' | '3x3'>('2x2');
  const { activeCameraId } = useAlertContext();
  const { cameras, fetchCameras } = useAdminStore();

  useEffect(() => {
    fetchCameras(); // טוען מצלמות מהשרת כשנטען הקומפוננטה
  }, []);

  const gridClass =
    layout === '2x2'
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Live Camera Feeds</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLayout('2x2')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              layout === '2x2'
                ? 'bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            2×2
          </button>
          <button
            onClick={() => setLayout('3x3')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              layout === '3x3'
                ? 'bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            3×3
          </button>
        </div>
      </div>

      <div className={`grid ${gridClass} gap-4`}>
        {cameras.slice(0, layout === '2x2' ? 4 : 9).map((camera) => (
          <CameraFeed
            key={camera._id || camera.id}
            camera={camera}
            isActive={activeCameraId === (camera._id || camera.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CameraGrid;