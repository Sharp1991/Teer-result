'use client';

import { useEffect, useState } from 'react';

type Props = {
  language?: 'en' | 'bn';
};

function decodeVapidKey(value: string): Uint8Array {
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

export default function PushNotificationButton({
  language = 'en',
}: Props) {
  const [status, setStatus] = useState<
    'idle' | 'working' | 'enabled' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const isBengali = language === 'bn';

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        navigator.serviceWorker?.ready
          .then((registration) => registration.pushManager.getSubscription())
          .then((subscription) => {
            if (subscription) setStatus('enabled');
          })
          .catch(() => {});
      }

      const dismissed = window.localStorage.getItem(
        'teer-notification-popup-dismissed'
      );

      if (
        dismissed !== 'true' &&
        (!('Notification' in window) ||
          Notification.permission === 'default')
      ) {
        timer = setTimeout(() => setShowPopup(true), 6000);
      }
    } catch {
      // Keep the notification button usable if browser storage is unavailable.
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  function dismissPopup() {
    setShowPopup(false);
    try {
      window.localStorage.setItem(
        'teer-notification-popup-dismissed',
        'true'
      );
    } catch {
      // Dismiss for the current page even if storage is unavailable.
    }
  }

  async function enableNotifications() {
    setStatus('working');
    setMessage('');

    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error(
          isBengali
            ? 'এই ব্রাউজারে পুশ নোটিফিকেশন সমর্থিত নয়।'
            : 'Push notifications are not supported by this browser.'
        );
      }

      if (!('Notification' in window)) {
        throw new Error(
          isBengali
            ? 'ব্রাউজারে নোটিফিকেশন সুবিধা নেই।'
            : 'Browser notifications are unavailable.'
        );
      }

      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        throw new Error(
          isBengali
            ? 'ব্রাউজার সেটিংস থেকে নোটিফিকেশনের অনুমতি দিন।'
            : 'Please allow notifications in your browser settings.'
        );
      }

      const keyResponse = await fetch('/api/push/public-key', {
        cache: 'no-store',
      });

      if (!keyResponse.ok) {
        throw new Error(
          isBengali
            ? 'নোটিফিকেশন সেটিংস লোড করা যায়নি।'
            : 'Could not load notification settings.'
        );
      }

      const { publicKey } = await keyResponse.json();

      if (!publicKey) {
        throw new Error('Notification settings are incomplete.');
      }

      await navigator.serviceWorker.register('/sw.js');
      const registration = await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: decodeVapidKey(publicKey) as BufferSource,
        });
      }

      const saveResponse = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      if (!saveResponse.ok) {
        const result = await saveResponse.json().catch(() => ({}));
        throw new Error(
          result.error ||
            (isBengali
              ? 'নোটিফিকেশন চালু করা যায়নি।'
              : 'Could not save your subscription.')
        );
      }

      setStatus('enabled');
      setShowPopup(false);
      setMessage(
        isBengali
          ? 'নতুন শিলং তীরের ফলাফলের নোটিফিকেশন চালু হয়েছে!'
          : 'Notifications enabled! We’ll alert you when new Shillong Teer results are available.'
      );

      try {
        window.localStorage.setItem(
          'teer-notification-popup-dismissed',
          'true'
        );
      } catch {
        // Subscription is saved even if browser storage is unavailable.
      }
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : isBengali
            ? 'আবার চেষ্টা করুন।'
            : 'Could not enable notifications. Please try again.'
      );
    }
  }

  return (
    <>
      <div className="flex flex-col items-start gap-1">
        <button
          type="button"
          onClick={enableNotifications}
          disabled={status === 'working' || status === 'enabled'}
          className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'working'
            ? isBengali
              ? 'চালু হচ্ছে…'
              : 'Enabling…'
            : status === 'enabled'
              ? isBengali
                ? 'নোটিফিকেশন চালু'
                : 'Notifications enabled'
              : isBengali
                ? '🔔 ফলাফলের নোটিফিকেশন চালু করুন'
                : '🔔 Enable result notifications'}
        </button>

        {message && (
          <p
            role="status"
            className={`max-w-xs text-xs ${
              status === 'error' ? 'text-red-200' : 'text-emerald-200'
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {showPopup && status !== 'enabled' && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="teer-notification-title"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white shadow-2xl sm:p-6">
            <button
              type="button"
              onClick={dismissPopup}
              aria-label={isBengali ? 'বন্ধ করুন' : 'Close'}
              className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <span aria-hidden="true">✕</span>
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-900/60 text-2xl">
              🔔
            </div>

            <h2
              id="teer-notification-title"
              className="mb-2 pr-5 text-xl font-bold"
            >
              {isBengali
                ? 'শিলং তীরের ফলাফল মিস করবেন না!'
                : 'Never Miss Shillong Teer Results!'}
            </h2>

            <p className="mb-5 text-sm leading-6 text-slate-300">
              {isBengali
                ? 'ফার্স্ট রাউন্ড ও সেকেন্ড রাউন্ডের নতুন ফলাফল প্রকাশিত হলে এই ডিভাইসে নোটিফিকেশন পান। বারবার ওয়েবসাইট রিফ্রেশ করার দরকার নেই।'
                : 'Get an alert on this device when new First Round and Second Round results are available. No need to keep refreshing the website.'}
            </p>

            <button
              type="button"
              onClick={enableNotifications}
              disabled={status === 'working'}
              className="w-full rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-sky-500 disabled:opacity-70"
            >
              {status === 'working'
                ? isBengali
                  ? 'চালু হচ্ছে…'
                  : 'Enabling…'
                : isBengali
                  ? '🔔 নোটিফিকেশন চালু করুন'
                  : '🔔 Enable Notifications'}
            </button>

            {status === 'error' && message && (
              <p role="alert" className="mt-3 text-sm text-red-300">
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={dismissPopup}
              className="mt-3 w-full rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
            >
              {isBengali ? 'পরে দেখব' : 'Maybe later'}
            </button>

            <p className="mt-2 text-center text-xs text-slate-500">
              {isBengali
                ? 'আপনি চাইলে পরে ব্রাউজার সেটিংস থেকে অনুমতি পরিবর্তন করতে পারবেন।'
                : 'You can manage notification permissions in your browser settings.'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
