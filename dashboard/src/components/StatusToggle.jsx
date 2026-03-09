import { ref, set, onDisconnect } from 'firebase/database';
import { db } from '../firebase';

export default function StatusToggle({ installId, isOnline, setIsOnline }) {

  const handleToggle = async () => {
    const presRef = ref(db, `agentPresence/${installId}`);
    if (!isOnline) {
      await set(presRef, { online: true, lastSeen: Date.now() });
      onDisconnect(presRef).set({ online: false, lastSeen: Date.now() });
    } else {
      await set(presRef, { online: false, lastSeen: Date.now() });
    }
    setIsOnline(!isOnline);
  };

  return (
    <div onClick={handleToggle} style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      cursor: 'pointer', userSelect: 'none',
      padding: '7px 12px', borderRadius: '20px',
      backgroundColor: isOnline ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${isOnline ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.09)'}`,
      transition: 'all 0.2s',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>

      {/* Pulsing dot */}
      <div style={{ position: 'relative', width: '8px', height: '8px', flexShrink: 0 }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          backgroundColor: isOnline ? '#34D399' : '#3A3A52',
          transition: 'background-color 0.2s',
        }} />
        {isOnline && (
          <div style={{
            position: 'absolute', inset: '-3px', borderRadius: '50%',
            backgroundColor: 'rgba(52,211,153,0.25)',
            animation: 'statusPulse 2s ease-in-out infinite',
          }} />
        )}
      </div>

      <span style={{
        fontSize: '12px', fontWeight: '700',
        color: isOnline ? '#34D399' : '#3A3A52',
        transition: 'color 0.2s',
        letterSpacing: '0.03em',
      }}>
        {isOnline ? 'Online' : 'Offline'}
      </span>

      {/* Toggle pill */}
      <div style={{
        width: '36px', height: '20px', borderRadius: '10px', position: 'relative',
        backgroundColor: isOnline ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.08)',
        border: `1px solid ${isOnline ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.1)'}`,
        flexShrink: 0, transition: 'all 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: '2px',
          width: '14px', height: '14px', borderRadius: '50%',
          backgroundColor: isOnline ? '#34D399' : '#3A3A52',
          boxShadow: isOnline ? '0 0 6px rgba(52,211,153,0.5)' : 'none',
          transition: 'transform 0.2s, background-color 0.2s, box-shadow 0.2s',
          transform: isOnline ? 'translateX(18px)' : 'translateX(2px)',
        }} />
      </div>

      <style>{`
        @keyframes statusPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}