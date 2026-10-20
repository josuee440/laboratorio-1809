const { Router } = require('express');
const router = Router();
const verifyToken = require('../middlewares/verifyToken');
const controller = require('../controllers/estudiante.controller');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', verifyToken, controller.crear);
router.put('/:id', verifyToken, controller.actualizar);
router.delete('/:id', verifyToken, controller.eliminar);

module.exports = router;
