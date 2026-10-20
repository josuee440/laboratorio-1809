require('dotenv').config();
const app = require('../app');
const sequelize = require('../server/config/database');

const PORT = process.env.PORT || 8010;

async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
  }
}

iniciar();
