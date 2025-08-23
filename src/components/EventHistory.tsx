import React, { useState, useEffect } from 'react';
import { Clock, Check, X, Filter, AlertTriangle, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWebSocketContext } from '../context/WebSocketContext';
import { useEventStore } from '../store/useEventStore';
import { formatTimeAgo, formatTime, formatDate } from '../utils/dateUtils';

const EventHistory: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'confirmed' | 'dismissed'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const { events, fetchEvents, addEvent } = useEventStore();
  const { lastMessage } = useWebSocketContext();
  const user = useAuthStore(state => state.currentUser);

  // טוען את כל האירועים מהשרת בטעינה ראשונית
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // מאזין להתראות חדשות מה-WebSocket ומוסיף אותן לסטור
  useEffect(() => {
    if (lastMessage) {
      addEvent(lastMessage);
    }
  }, [lastMessage, addEvent]);

  // סינון לפי משתמש ותפקיד
  const filteredEvents = events
    .filter(event => {
      if (user?.role === 'user' && event.assignedTo && event.assignedTo !== user.id) {
        return false;
      }
      if (filterType === 'confirmed') return event.status === 'confirmed';
      if (filterType === 'dismissed') return event.status === 'dismissed';
      return true;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Event History</span>
        </div>
        <div className="relative">
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </button>
          {showFilters && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-40 z-10">
              {['all', 'confirmed', 'dismissed'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setFilterType(type as typeof filterType);
                    setShowFilters(false);
                  }}
                  className={`block px-4 py-1 text-sm text-left w-full hover:bg-gray-100 ${
                    filterType === type ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  {type === 'all' ? 'All Events' : `${type.charAt(0).toUpperCase() + type.slice(1)} Only`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No events found</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event._id || event.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'confirmed' ? 'bg-red-100 text-red-800' :
                        event.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status === 'confirmed' ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : event.status === 'dismissed' ? (
                          <X className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{event.type}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>{formatDate(event.timestamp)}</div>
                    <div>{formatTime(event.timestamp)}</div>
                  </div>
                </div>

                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                   <img
                    src={event.imageUrl}
                    alt={`Event: ${event.type}`}
                    //  className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span>Camera: {event.cameraLocation}</span>
                  </div>
                  <span className="text-gray-400">{formatTimeAgo(event.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventHistory;
