import express from 'express';

import routes from './routes/index';
import { ErrorRequestHandler } from 'express-serve-static-core';

const app = express();

app.use((_req, _res, next) => {
    // res.locals.var = var;
    next();
});

app.use('/', routes);

app.use((_req, _res, next) => {
    let err = { error: new Error('Not Found'), status: 404 };
    next(err);
});

const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
  const message = err.status ? err.error.message : err.message;
  console.log('Internal error(%d): %s', res.statusCode, message);
  res.status(err.status || 500).end(JSON.stringify({ error: message }));
};
app.use(handleError);

const port = process.env.PORT || 8000;
app.set('port', port);

const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

export default server;
