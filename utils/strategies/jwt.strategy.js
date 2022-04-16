const { Strategy, ExtractJwt } = require('passport-jwt');

const { config } = require('./../../config/config');

const options = {
    //se toma el token enviado por el usuario y se le agrega el secret de la api
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt_secret
}

const JwtStrategy = new Strategy(options, (payload, done) => {
    return done(null, payload);
});

module.exports = JwtStrategy;