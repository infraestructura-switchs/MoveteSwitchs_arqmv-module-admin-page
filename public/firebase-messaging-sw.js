importScripts('https://www.gstatic.com/firebasejs/9.16.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.16.0/firebase-messaging-compat.js');


const firebaseConfig = {
  apiKey: "AIzaSyAYJE52X4F6NnKu93Hpee05DKTYGi29xOo",
  authDomain: "movete-1bb07.firebaseapp.com",
  projectId: "movete-1bb07",
  storageBucket: "movete-1bb07.firebasestorage.app",
  messagingSenderId: "834750161397",
  appId: "1:834750161397:web:06a45f98d0ff70fd7b40bc",
  measurementId: "G-H0774FEP9E"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/icon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
