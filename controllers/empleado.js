"use strict";

const Empleado = require('../models').empleado;
const response = require('../services/response');

module.exports = {
    listVendedor: (req, res) => {
        const user = req.user['data'];
        const payload = req.body;

        response.simpleResponse({
            model: Empleado.listVendedor,
            data: {company: user.empresa['id'], payload: payload},
            format: response,
            response: res
        });
    },
    listSupervisor: (req, res) => {
        const user = req.user['data'];
        const payload = req.body;

        response.simpleResponse({
            model: Empleado.listSupervisor,
            data: {company: user.empresa['id'], payload: payload},
            format: response,
            response: res
        });
    },
    listJefe: (req, res) => {
        const user = req.user['data'];
        const payload = req.body;

        response.simpleResponse({
            model: Empleado.listJefe,
            data: {company: user.empresa['id'], payload: payload},
            format: response,
            response: res
        });
    },
    positionSeguimientoVendedor: (req, res) => {
        const user = req.user['data'];
        const payload = req.body;

        response.simpleResponse({
            model: Empleado.positionSeguimientoVendedor,
            data: {company: user.empresa['id'], payload: payload},
            format: response,
            response: res
        });
    },
    roadSeguimientoVendedor: (req, res) => {
        const user = req.user['data'];
        const payload = req.body;

        response.simpleResponse({
            model: Empleado.roadSeguimientoVendedor,
            data: {company: user.empresa['id'], payload: payload},
            format: response,
            response: res
        });
    }
};