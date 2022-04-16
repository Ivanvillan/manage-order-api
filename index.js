const express = require('express');
const { config } = require('./config/config');
const { boomErrorHandler } = require('./middlewares/error.handler');
const apiRouter = require('./routes');
const passport = require('passport');

const app = express();
const port = config.port;

require('./utils/');

app.use(express.json());

app.use(passport.initialize());

apiRouter(app);

app.use(boomErrorHandler)

app.listen(port, () => {
    console.log('Server up in port', port);
})