const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { isWithinWorkHours } = require('../services/scheduleService');

router.get('/:installId', async (req, res) => {
    const { installId } = req.params;

    try {
        const [presenceSnap, withinHours] = await Promise.all([
            db.ref(`agentPresence/${installId}`).once('value'),
            isWithinWorkHours(installId),
        ]);

        const presence = presenceSnap.val();
        const agentOnline = presence?.online || false;

        res.json({
            online: agentOnline,
            withinHours,
            available: agentOnline || withinHours,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;