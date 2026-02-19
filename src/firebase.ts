import { useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { BASE_URL_API } from "./constants/index";
import { getOrders as getTable  } from "../src/Api/OrderTableApi";

export const firebaseConfig = {
  apiKey: "AIzaSyAYJE52X4F6NnKu93Hpee05DKTYGi29xOo",
  authDomain: "movete-1bb07.firebaseapp.com",
  projectId: "movete-1bb07",
  storageBucket: "movete-1bb07.firebasestorage.app",
  messagingSenderId: "834750161397",
  appId: "1:834750161397:web:06a45f98d0ff70fd7b40bc",
  measurementId: "G-H0774FEP9E"
};

const URL: string = `${BASE_URL_API}/subscription`;
//const URL = '/api/back-whatsapp-qr-app/subscription';

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error al decodificar el token JWT:", error);
    return null;
  }
};

const getTokenFromStorage = () => localStorage.getItem("jwt_token");

const getUserIdFromToken = () => {
  const token = getTokenFromStorage();
  if (!token) return null;
  const decoded = parseJwt(token);
  return decoded?.userId ?? null;
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
  console.log('¡Notificación recibida en foreground!', payload);
  alert(`Nueva notificación: ${payload.notification?.title} - ${payload.notification?.body}`);
  getTable();
});

export const requestFirebaseNotificationPermission = (onRefresh: () => void) => {
  const userId = getUserIdFromToken();
  console.log("userId desde firebase.ts:", userId);

  if (!userId || isNaN(Number(userId))) {
    console.error("No se encontró un userId válido en el token");
    return;
  }

  getToken(messaging, { vapidKey: 'BAekrMtKYaV5pGlDKb3aJBjzore3Vs7jZHDOjof93RlTVI-dzho1PupuvG4ppoH5le9eAlRDoDM_zZiB3dHVmIA' })
    .then((currentToken) => {
      if (currentToken) {
        console.log("Token de notificación:", currentToken);
        sendTokenToBackend(Number(userId), currentToken);
      } else {
        console.log('No se pudo obtener un token de notificación');
      }
    })
    .catch((err) => {
      console.error('Error al obtener permiso para notificaciones:', err);
    });

  onMessage(messaging, (payload) => {
    console.log('Notificación recibida en primer plano:', payload);
    console.log('Estructura completa del payload:', payload);

    if (payload && payload.notification) {
      console.log(`Nuevo mensaje: ${payload.notification.body}`);
    }

    onRefresh();
  });
};

export const sendTokenToBackend = async (userId: number, token: string) => {
  const response = await fetch(`${URL}/firebase?userId=${userId}&token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    console.error("Error al enviar el token al backend");
  }
};

export const useNotificationPermission = (onRefresh: () => void) => {
  useEffect(() => {
    requestFirebaseNotificationPermission(onRefresh);
  }, [onRefresh]);
};