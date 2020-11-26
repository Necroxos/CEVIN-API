/**
 * Aquí se genera el objeto APP base para todos los archivos de la carpeta ROUTER
 */

import { Router } from 'express';
const app = Router();
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(cors());
app.use(helmet());

module.exports = app;