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
        // Increment unread count
        unreadRef.current += 1;
        document.title = `(${unreadRef.current}) ${originalTitle}`;

        // Browser notification — only when tab not focused
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