"use strict";

const Ruta = require('../models').ruta;
const response = require('../services/response');

module.exports = {
    seguimientoRutaPreventa: (req, res) => {
        const user = req.user['data'];
        const payload = req.body;

        response.simpleResponse({
            model: Ruta.seguimientoRutaPreventa,
            data: {company: user.empresa['id'], payload: payload},
            format: response,
            response: res
        });
    }
};