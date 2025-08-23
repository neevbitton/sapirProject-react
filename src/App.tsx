import React from 'react';
import { WebSocketProvider } from './context/WebSocketContext';
import { AlertProvider } from './context/AlertContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AlertModal from './components/AlertModal';
import { Toaster } from './components/ui/Toaster';
import { useAuthStore } from './store/authStore';

function App() {
  const user = useAuthStore(state => state.currentUser);

  if (!user) {
    return <Login />;
  }

  return (
    <WebSocketProvider>
      <AlertProvider>
        <div className="min-h-screen bg-gray-50">
          <Dashboard />
          <AlertModal />
          <Toaster />
        </div>
      </AlertProvider>
    </WebSocketProvider>
  );
}

export default App;