import React, { useEffect, useState } from 'react';
import { TrendingUp, BrainCircuit, AlertCircle, CheckCircle2 } from 'lucide-react';

const SystemMetrics: React.FC = () => {
  const [stats, setStats] = useState({
    confirmed: 0,
    dismissed: 0,
    totalCameras: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:4001/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(" Failed to fetch stats:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // רענון כל 10 שניות
    return () => clearInterval(interval);
  }, []);

  const totalEvents = stats.confirmed + stats.dismissed;

  const detectionAccuracy = totalEvents > 0
    ? Math.floor((stats.confirmed / totalEvents) * 100)
    : 0;

  const learningProgress = totalEvents > 0
    ? Math.min(100, Math.floor((stats.confirmed / totalEvents) * 100 + totalEvents / 10))
    : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <BrainCircuit className="h-4 w-4 text-purple-600 mr-1" />
            <span className="text-sm font-medium">Learning Progress</span>
          </div>
          <span className="text-sm font-medium">{learningProgress}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${learningProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-xs text-gray-500">Accuracy</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{detectionAccuracy}%</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-xs text-gray-500">Alerts</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{totalEvents}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-xs text-gray-500">Confirmed</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{stats.confirmed}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center">
            <span className="h-4 w-4 rounded-full border-4 border-blue-600 mr-2"></span>
            <span className="text-xs text-gray-500">Cameras</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{stats.totalCameras}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemMetrics;