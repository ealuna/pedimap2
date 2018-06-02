"use strict";

const databases = require('../services/sequelize');

class Ruta {

    static seguimientoRutaPreventa(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'seguimiento_rutas_preventa',
                parameters: data.payload
            }
        });
    }
}

module.exports = Ruta;