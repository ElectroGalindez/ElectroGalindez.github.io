const router = require('express').Router();

router.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'El servidor está funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;