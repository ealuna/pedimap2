"use strict";

const databases = require('../services/sequelize');

class Cliente {

    static listTipoNegocio(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'listar_tipo_negocio'
            }
        });
    }

    static listTipoCanal(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'listar_tipo_canal'
            }
        });
    }

    static listTipoVisita(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'listar_tipo_visita'
            }
        });
    }

    static seguimientoPreventaCliente(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'seguimiento_clientes_preventa',
                parameters: data.payload
            }
        });
    }

    static seguimientoVisitaCliente(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'seguimiento_cliente_visita',
                parameters: data.payload
            }
        });
    }

    static seguimientoAltaCliente(data) {
        return databases.defaultResponse({
            database: data.company,
            payload: {
                schema: 'data',
                name: 'seguimiento_cliente_alta',
                parameters: data.payload
            }
        });
    }

}

module.exports = Cliente;