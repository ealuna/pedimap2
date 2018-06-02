"use strict";

const express = require('express');

const router = express.Router();
const listar = express.Router();

const passport = require("../../services/passport");
const controllers = require("../../controllers");

const defaultStrategy = passport.default;
const defaultPassport = defaultStrategy.authenticate('jwt', {session: false});

listar.post('/sucursal', defaultPassport, controllers.empresa.listSucursal);
listar.post('/esquema', defaultPassport, controllers.empresa.listEsquema);







router.use('/listar', listar);

module.exports = router;