import { ref, set, onDisconnect } from 'firebase/database';
import { db } from '../firebase';

export default function StatusToggle({ installId, isOnline, setIsOnline }) {

    const handleToggle = async () => {
        const presRef = ref(db, `agentPresence/${installId}`);

        if (!isOnline) {
            // Going online
            await set(presRef, { online: true, lastSeen: Date.now() });

            // Auto set offline when tab closes
            onDisconnect(presRef).set({ online: false, lastSeen: Date.now() });
        } else {
            // Going offline manually
            await set(presRef, { online: false, lastSeen: Date.now() });
        }

        setIsOnline(!isOnline);
    };

    return (
        <div style={styles.container} onClick={handleToggle}>
            <div style={{
                ...styles.dot,
                backgroundColor: isOnline ? '#4ADE80' : '#D1D5DB',
            }} />
            <span style={styles.label}>
                {isOnline ? 'Online' : 'Offline'}
            </span>
            <div style={{
                ...styles.toggle,
                backgroundColor: isOnline ? '#4F46E5' : '#E5E7EB',
            }}>
                <div style={{
                    ...styles.thumb,
                    transform: isOnline ? 'translateX(18px)' : 'translateX(2px)',
                }} />
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#F9FAFB',
        userSelect: 'none',
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        flexShrink: 0,
        transition: 'background-color 0.2s',
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
        flex: 1,
    },
    toggle: {
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        position: 'relative',
        transition: 'background-color 0.2s',
        flexShrink: 0,
    },
    thumb: {
        position: 'absolute',
        top: '3px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s',
    },
};