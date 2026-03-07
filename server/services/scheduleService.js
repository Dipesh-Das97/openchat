const { db } = require('../firebase');

const isWithinWorkHours = async (installId) => {
    try {
        const snap = await db.ref(`users/${installId}`).once('value');
        const settings = snap.val();

        if (!settings?.workingHours) return true; // No hours set → always open

        const { workingHours } = settings;
        const timezone = workingHours.timezone || 'UTC';

        // Get current time in agent's timezone
        const now = new Date();
        const localTime = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            weekday: 'short',
        }).formatToParts(now);

        const weekday = localTime.find((p) => p.type === 'weekday')?.value?.toLowerCase();
        const hour = localTime.find((p) => p.type === 'hour')?.value;
        const minute = localTime.find((p) => p.type === 'minute')?.value;
        const currentTime = `${hour}:${minute}`;

        // Map weekday to our keys
        const dayMap = { mon: 'mon', tue: 'tue', wed: 'wed', thu: 'thu', fri: 'fri', sat: 'sat', sun: 'sun' };
        const todayKey = Object.keys(dayMap).find((k) => weekday?.startsWith(k));

        if (!todayKey) return false;

        const todayHours = workingHours[todayKey];
        if (!todayHours?.enabled) return false;

        // Compare times
        return currentTime >= todayHours.start && currentTime <= todayHours.end;

    } catch (err) {
        console.error('Schedule service error:', err);
        return true; // Default to open on error
    }
};

module.exports = { isWithinWorkHours };