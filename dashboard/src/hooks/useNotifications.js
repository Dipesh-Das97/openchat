import { useEffect, useRef } from 'react';

export const useNotifications = () => {
    const permissionRef = useRef(Notification.permission);
    const unreadRef = useRef(0);
    const originalTitle = 'OpenChat Dashboard';

    const requestPermission = async () => {
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            permissionRef.current = permission;
        }
    };

    const playSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();

            oscillator.connect(gain);
            gain.connect(ctx.destination);

            oscillator.frequency.value = 880;
            oscillator.type = 'sine';
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.4);
        } catch (err) {
            console.warn('Audio notification failed:', err);
        }
    };

    // Reset unread count when tab is focused
    useEffect(() => {
        const handleFocus = () => {
            unreadRef.current = 0;
            document.title = originalTitle;
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const notify = (title, body, onClick) => {
        // Always increment tab badge
        unreadRef.current += 1;
        document.title = `(${unreadRef.current}) ${originalTitle}`;

        // Always play sound
        playSound();

        // Browser popup only when tab not focused
        if (permissionRef.current === 'granted' && document.visibilityState !== 'visible') {
            const notification = new Notification(title, {
                body,
                icon: '/favicon.ico',
            });

            if (onClick) {
                notification.onclick = () => {
                    window.focus();
                    onClick();
                    notification.close();
                };
            }

            setTimeout(() => notification.close(), 5000);
        }
    };

    return { requestPermission, notify };
};