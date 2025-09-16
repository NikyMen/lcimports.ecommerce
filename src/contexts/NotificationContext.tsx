import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationData, useNotifications } from '../components/Notification';
import { NotificationContainer } from '../components/NotificationContainer';

interface NotificationContextType {
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  } = useNotifications();

  useEffect(() => {
    // Renderizar notificaciones en el contenedor global
    const container = document.getElementById('notification-container');
    if (container) {
      const { createRoot } = require('react-dom/client');
      const root = createRoot(container);
      root.render(
        <NotificationContainer
          notifications={notifications}
          onRemoveNotification={removeNotification}
        />
      );
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{
      showSuccess,
      showError,
      showInfo,
      showWarning
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
