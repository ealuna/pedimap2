"use strict";

const express = require('express');

const router = express.Router();
const seguimiento = express.Router();

const passport = require("../../services/passport");
const controllers = require("../../controllers");

const defaultStrategy = passport.default;
const defaultPassport = defaultStrategy.authenticate('jwt', {session: false});

seguimiento.post('/preventa', defaultPassport, controllers.ruta.seguimientoRutaPreventa);







router.use('/seguimiento', seguimiento);

module.exports = router;