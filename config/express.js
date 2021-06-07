import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import cors from 'cors'
import path from 'path';
import logger from 'morgan';
import routes from '../routes/index.route';
import config from './config';

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(methodOverride());
app.use(cors());
// mount all routes on /api path
app.use('/', routes);

app.use((req, res, next) => {
    const err = new Error('API resource not found');
    err.status = 404;
    return next(err);
});

app.use((err, req, res, next) => {// eslint-disable-line no-unused-vars
  let respMessage = {
      message: err.message || err.toString()
  };

  if (config.env === 'development') {
    respMessage.stack = err.stack;
  }
  res.status(err.status || 500).json(respMessage);
});

export default app;
