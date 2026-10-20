const Estudiante = require('../models/Estudiante');

exports.obtenerTodos = async (req, res) => {
  try {
    const datos = await Estudiante.findAll();
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const item = await Estudiante.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevo = await Estudiante.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear', error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const item = await Estudiante.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    await item.update(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar', error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const item = await Estudiante.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    await item.destroy();
    res.status(200).json({ message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};
