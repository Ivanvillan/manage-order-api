const passport = require('passport');

const LocalStrategy = require('./strategies/local.strategy');
const JwtStrategy = require('./strategies/jwt.strategy');

//passport utiliza estas dos estrategias y luego se importa al archivo index raíz
passport.use(LocalStrategy);
passport.use(JwtStrategy);