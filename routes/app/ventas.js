"use strict";

const express = require('express');

const router = express.Router();
const avance = express.Router();
const reporte = express.Router();


const passport = require("../../services/passport");

const defaultStrategy = passport.default;
const defaultPassport = defaultStrategy.authenticate('jwt', {
    session: false,
    failureRedirect: '/pedimap/app'
});

/*
router.get('/', defaultPassport, (req, res) => {
    res.render('preventa_seguimiento_mapa', {usuario: req.user['data']});
});
*/

router.use('/avance', avance);
router.use('/reporte', reporte);

module.exports = router;