import { useEffect, useRef, useCallback } from 'react';

export const useNotifications = () => {
    const permissionRef = useRef(Notification.permission);
    const unreadRef = useRef(0);
    const audioCtxRef = useRef(null);
    const originalTitle = 'OpenChat Dashboard';

    // Create AudioContext on first user gesture
    useEffect(() => {
        const unlock = () => {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            document.removeEventListener('click', unlock);
            document.removeEventListener('keydown', unlock);
        };
        document.addEventListener('click', unlock);
        document.addEventListener('keydown', unlock);
        return () => {
            document.removeEventListener('click', unlock);
            document.removeEventListener('keydown', unlock);
        };
    }, []);

    const requestPermission = async () => {
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            permissionRef.current = permission;
        }
    };

    const playSound = () => {
        try {
            const ctx = audioCtxRef.current;
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();

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

    useEffect(() => {
        const handleFocus = () => {
            unreadRef.current = 0;
            document.title = originalTitle;
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const notify = useCallback((title, body, onClick) => {
        unreadRef.current += 1;
        document.title = `(${unreadRef.current}) ${originalTitle}`;

        playSound();

        if (permissionRef.current === 'granted' && document.visibilityState !== 'visible') {
            const notification = new Notification(title, { body, icon: '/favicon.ico' });
            if (onClick) {
                notification.onclick = () => {
                    window.focus();
                    onClick();
                    notification.close();
                };
            }
            setTimeout(() => notification.close(), 5000);
        }
    }, []);

    return { requestPermission, notify };
};