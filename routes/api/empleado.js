"use strict";

const express = require('express');

const router = express.Router();
const listar = express.Router();
const seguimiento = express.Router();

const passport = require("../../services/passport");
const controllers = require("../../controllers");

const defaultStrategy = passport.default;
const defaultPassport = defaultStrategy.authenticate('jwt', {session: false});

listar.post('/vendedor', defaultPassport, controllers.empleado.listVendedor);
listar.post('/supervisor', defaultPassport, controllers.empleado.listSupervisor);
listar.post('/jefe', defaultPassport, controllers.empleado.listJefe);





seguimiento.post('/vendedor-posicion', defaultPassport, controllers.empleado.positionSeguimientoVendedor);
seguimiento.post('/vendedor-recorrido', defaultPassport, controllers.empleado.roadSeguimientoVendedor);


router.use('/listar', listar);
router.use('/seguimiento', seguimiento);

module.exports = router;