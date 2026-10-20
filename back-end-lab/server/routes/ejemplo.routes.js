const { Router } = require('express');
const router = Router();
const verifyToken = require('../middlewares/verifyToken');

// Ruta de prueba protegida: solo responde si el token es válido.
router.get('/', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Acceso autorizado',
    usuario: req.usuario,
  });
});

module.exports = router;
