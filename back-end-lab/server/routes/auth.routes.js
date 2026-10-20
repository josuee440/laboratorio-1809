const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');

router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

module.exports = router;
