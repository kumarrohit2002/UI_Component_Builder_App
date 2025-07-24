const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const aiRoutes = require('./ai.routes');

router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);


module.exports = router;