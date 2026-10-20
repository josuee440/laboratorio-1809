const fs = require('fs');
const path = require('path');

const nombre = process.argv[2]; // Ej: Curso
if (!nombre) {
  console.log('Uso: node generar-crud.js NombreDelModelo');
  process.exit(1);
}

const nombreMin = nombre.toLowerCase();

const controllerCode = `const ${nombre} = require('../models/${nombre}');

exports.obtenerTodos = async (req, res) => {
  try {
    const datos = await ${nombre}.findAll();
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const item = await ${nombre}.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevo = await ${nombre}.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear', error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const item = await ${nombre}.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    await item.update(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar', error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const item = await ${nombre}.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    await item.destroy();
    res.status(200).json({ message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};
`;

const routesCode = `const { Router } = require('express');
const router = Router();
const verifyToken = require('../middlewares/verifyToken');
const controller = require('../controllers/${nombreMin}.controller');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', verifyToken, controller.crear);
router.put('/:id', verifyToken, controller.actualizar);
router.delete('/:id', verifyToken, controller.eliminar);

module.exports = router;
`;

fs.writeFileSync(
  path.join('server/controllers', `${nombreMin}.controller.js`),
  controllerCode
);
fs.writeFileSync(
  path.join('server/routes', `${nombreMin}.routes.js`),
  routesCode
);

console.log(`Listo: se generaron server/controllers/${nombreMin}.controller.js y server/routes/${nombreMin}.routes.js`);
console.log(`Recuerda agregar en app.js:`);
console.log(`  const ${nombreMin}Routes = require('./server/routes/${nombreMin}.routes');`);
console.log(`  app.use('/api/${nombreMin}', ${nombreMin}Routes);`);
