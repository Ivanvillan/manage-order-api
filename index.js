const express = require('express');
const { config } = require('./config/config');
const { boomErrorHandler } = require('./middlewares/error.handler');
const apiRouter = require('./routes');
const passport = require('passport');
const cors = require('cors');

const app = express();
const port = config.port;
// app.use(express.static(process.cwd()+"/dist/"))

// const whitelist = ['http://localhost:4200', 'http://190.228.175.35', 'http://192.168.248.131',
//                     'appweb.gisi.com.ar', '192.168.248.131', '190.228.175.35'];
// const options = {
//   origin: (origin, callback) => {
//     if (whitelist.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('no permitido'));
//     }
//   }
// }
app.use(cors({ origin:true, preflightContinue: true }));

require('./utils/');

app.use(express.json());

app.use(passport.initialize());

apiRouter(app);

app.use(boomErrorHandler)

// app.get('/', (req,res) => {
//   res.sendFile(process.cwd()+"/dist/index.html")
// });

app.listen(port, () => {
    console.log('Server up in port', port);
})