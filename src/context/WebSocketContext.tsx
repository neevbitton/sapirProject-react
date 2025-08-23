import { io, Socket } from "socket.io-client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert } from "../types";

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: Alert | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  lastMessage: null,
});

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<Alert | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
   const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 3000
});

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket.IO connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log(" Socket.IO disconnected");
      setIsConnected(false);
    });

    socket.on("anomaly_detected", (data: { type: string; imageUrl: string; eventId: string }) => {
  console.log("Received anomaly:", data);
  setLastMessage({
    id: data.eventId, 
    type: data.type,
    imageUrl: data.imageUrl,
    cameraId: "1",
    cameraLocation: "Main Entrance",
    description: "Auto Detected",
    timestamp: new Date().toISOString(),
    status: "pending",
  });
});

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
