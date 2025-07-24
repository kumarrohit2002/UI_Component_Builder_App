const express = require('express');
const router = express.Router();

const { generateJSX } = require('../../controllers/ai.controller');


router.post('/generate', generateJSX);


module.exports = router;