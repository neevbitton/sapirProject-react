import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { Alert, EventStatus } from '../types';
import { useWebSocketContext } from './WebSocketContext';

interface AlertContextType {
  currentAlert: Alert | null;
  events: Alert[];
  activeCameraId: string | null;
  dismissAlert: () => void;
  confirmAlert: () => void;
}



const AlertContext = createContext<AlertContextType>({
  currentAlert: null,
  events: [],
  activeCameraId: null,
  dismissAlert: () => {},
  confirmAlert: () => {}
});

export const useAlertContext = () => useContext(AlertContext);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);
  const [events, setEvents] = useState<Alert[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const { lastMessage } = useWebSocketContext();

  // טוען את ההתראות הקיימות מהשרת
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:4001/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events from server:", err);
      }
    };

    fetchEvents();
  }, []);

  // כשהתקבלה הודעה חדשה ב־WebSocket
  useEffect(() => {
    if (lastMessage) {
    console.log("Setting new currentAlert:", lastMessage);
      const alert: Alert = {
        id: lastMessage.id || crypto.randomUUID(),
        cameraId: lastMessage.cameraId || 'unknown',
        cameraLocation: lastMessage.cameraLocation || 'Unknown Location',
        type: lastMessage.type || 'unknown',
        description: lastMessage.description || 'Detected anomaly',
        timestamp: new Date().toISOString(),
        status: 'pending',
        imageUrl: lastMessage.imageUrl || ''
      };

      setCurrentAlert(alert);
      setActiveCameraId(alert.cameraId);
    }
  }, [lastMessage]);

  const dismissAlert = async () => {
    if (currentAlert) {
      const updatedAlert = {
        ...currentAlert,
        status: 'dismissed' as EventStatus
      };

      try {
        await fetch(`http://localhost:4001/api/events/${currentAlert.id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status: "dismissed" })
});

await fetch(`http://localhost:4001/api/feedbacks`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    eventId: currentAlert.id,
    feedback: "dismissed"
  })
});
      } catch (err) {
        console.error('Failed to update event status on server:', err);
      }

      setEvents(prev => [updatedAlert, ...prev]);
      setCurrentAlert(null);
      setActiveCameraId(null);
    }
  };

  const confirmAlert = async () => {
    if (currentAlert) {
      const updatedAlert = {
        ...currentAlert,
        status: 'confirmed' as EventStatus
        
      };

      try {
  await fetch(`http://localhost:4001/api/events/${currentAlert.id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status: "confirmed" })
});

await fetch(`http://localhost:4001/api/feedbacks`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    eventId: currentAlert.id,
    feedback: "confirmed"
  })
});
      } catch (err) {
        console.error('Failed to update event status on server:', err);
      }

      setEvents(prev => [updatedAlert, ...prev]);
      setCurrentAlert(null);
      setActiveCameraId(null);
    }
  };

  return (
    <AlertContext.Provider
      value={{
        currentAlert,
        events,
        activeCameraId,
        dismissAlert,
        confirmAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};