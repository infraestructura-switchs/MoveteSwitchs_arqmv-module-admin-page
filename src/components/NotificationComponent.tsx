import React, { useEffect, useState } from 'react';
import { messaging, getToken } from '../firebase';

const NotificationComponent = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Solicitar permiso para recibir notificaciones
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          // Obtener el token FCM
          const token = await getToken(messaging, {
            vapidKey: 'BAekrMtKYaV5pGlDKb3aJBjzore3Vs7jZHDOjof93RlTVI-dzho1PupuvG4ppoH5le9eAlRDoDM_zZiB3dHVmIA', // Asegúrate de reemplazarlo con tu clave VAPID
          });

          // Verifica el token
          if (token) {
            console.log('FCM Token:', token);  // Muestra el token en la consola
            setFcmToken(token);  // Asigna el token al estado
          } else {
            console.log('No se pudo obtener el token FCM');
          }
        } else {
          console.log('Permission denied for notifications');
        }
      } catch (error) {
        console.error('Error getting permission or token:', error);
      }
    };

    // Verificar si la API de notificaciones está disponible
    if ('Notification' in window) {
      requestPermission();
    } else {
      console.error('Notification API is not supported by this browser');
    }
  }, []);

  return (
    <div>
      {permissionGranted ? (
        <div>
          <h2>FCM Token:</h2>
          {/* Muestra el token en la UI */}
          {fcmToken ? <p>{fcmToken}</p> : <p>Fetching token...</p>}
        </div>
      ) : (
        <p>Requesting notification permissions...</p>
      )}
    </div>
  );
};

export default NotificationComponent;
