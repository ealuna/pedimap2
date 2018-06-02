"use strict";

const express = require('express');

const router = express.Router();
const listar = express.Router();
const seguimiento = express.Router();

const passport = require("../../services/passport");
const controllers = require("../../controllers");

const defaultStrategy = passport.default;
const defaultPassport = defaultStrategy.authenticate('jwt', {session: false});

listar.post('/tipo-canal', defaultPassport, controllers.cliente.listTipoCanal);
listar.post('/tipo-negocio', defaultPassport, controllers.cliente.listTipoNegocio);
listar.post('/tipo-visita', defaultPassport, controllers.cliente.listTipoVisita);




seguimiento.post('/preventa', defaultPassport, controllers.cliente.seguimientoPreventaCliente);
seguimiento.post('/visita', defaultPassport, controllers.cliente.seguimientoVisitaCliente);
seguimiento.post('/alta', defaultPassport, controllers.cliente.seguimientoAltaCliente);


router.use('/listar', listar);
router.use('/seguimiento', seguimiento);

module.exports = router;