"use strict";

const databases = require('../services/sequelize');

class Empleado {

    static listVendedor(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'listar_empleado_vendedor',
                parameters: data.payload
            }
        });
    }

    static positionSeguimientoVendedor(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'seguimiento_vendedor_posicion',
                parameters: data.payload
            }
        });
    }

    static roadSeguimientoVendedor(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'seguimiento_vendedor_recorrido',
                parameters: data.payload
            }
        });
    }

    static listSupervisor(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'listar_empleado_supervisor',
                parameters: data.payload
            }
        });
    }

    static listJefe(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'listar_empleado_jefe',
                parameters: data.payload
            }
        });
    }

}

module.exports = Empleado;