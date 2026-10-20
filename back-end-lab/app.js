const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración CORS básica
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-Auth-Token, Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
});

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Bienvenido a mi Servidor NodeJS"
    });
});

const authRoutes = require('./server/routes/auth.routes');
app.use('/api/auth', authRoutes);

const ejemploRoutes = require('./server/routes/ejemplo.routes');
app.use('/api/ejemplo', ejemploRoutes);

const estudianteRoutes = require('./server/routes/estudiante.routes');
app.use('/api/estudiante', estudianteRoutes);

// A partir de aquí, en el laboratorio, cada estudiante agregará SU entidad nueva
// (Curso o Profesor) siguiendo el mismo patrón, por ejemplo:
// const cursoRoutes = require('./server/routes/curso.routes');
// app.use('/api/curso', cursoRoutes);

module.exports = app;
