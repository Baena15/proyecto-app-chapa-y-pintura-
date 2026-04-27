import { useEffect, useState } from 'react';
import { api } from '../api/client';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = 'serviceWorker' in navigator && 'PushManager' in window;
    setSupported(s);

    if (!s) {
      setLoading(false);
      return;
    }

    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        setSubscribed(!!subscription);
        setLoading(false);
      });
    });
  }, []);

  const subscribe = async () => {
    if (!supported) return;

    const registration = await navigator.serviceWorker.ready;
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permiso de notificaciones denegado');
    }

    const { public_key: vapidKey } = await api.get('/vapid-public-key/');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    await api.post('/push-subscribe/', {
      endpoint: subscription.endpoint,
      p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
      auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))),
    });

    setSubscribed(true);
  };

  const unsubscribe = async () => {
    if (!supported) return;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }
    setSubscribed(false);
  };

  const sendTest = async () => {
    await api.post('/push-test/');
  };

  return { supported, subscribed, loading, subscribe, unsubscribe, sendTest };
}
