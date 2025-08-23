import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

const CameraManagement: React.FC = () => {
  const { cameras, addCamera, removeCamera } = useAdminStore();
  const [isAddingCamera, setIsAddingCamera] = useState(false);
  const [newCamera, setNewCamera] =  useState<{ location: string; feedUrl: string }>({
    location: '',
    feedUrl: 'http://localhost:5000/video_feed' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCamera(newCamera);
    setIsAddingCamera(false);
    setNewCamera({ location: '', feedUrl: 'http://localhost:5000/video_feed' }); // מאפס עם אותו קישור
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Camera Management</h2>
        <button
          onClick={() => setIsAddingCamera(true)}
          className="flex items-center px-3 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Camera
        </button>
      </div>

      {isAddingCamera && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                required
                value={newCamera.location}
                onChange={e => setNewCamera({ ...newCamera, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Main Entrance"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Feed URL</label>
              <input
                type="url"
                value={newCamera.feedUrl}
                onChange={e => setNewCamera({ ...newCamera, feedUrl: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="http://localhost:5000/video_feed"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddingCamera(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md"
              >
                Add Camera
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map(camera => (
          <div key={camera.id} className="bg-gray-50 rounded-lg p-4">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3">
              <img
                src={camera.feedUrl}
                alt={`Camera feed from ${camera.location}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{camera.location}</h3>
                <p className="text-xs text-gray-500">ID: {camera.id}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`flex items-center space-x-1 text-xs ${
                  camera.status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    camera.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                  }`}></span>
                  <span>{camera.status}</span>
                </span>

                <button
                  onClick={() => camera.id && removeCamera(camera.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraManagement;