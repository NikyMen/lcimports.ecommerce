import React from 'react';
import { NotificationProvider } from '../contexts/NotificationContext';

interface NotificationWrapperProps {
  children: React.ReactNode;
}

export const NotificationWrapper: React.FC<NotificationWrapperProps> = ({ children }) => {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
};
