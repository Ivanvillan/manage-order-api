const { Strategy } = require('passport-local');

const AuthService = require('./../../services/auth.service');
const service = new AuthService();

// se crea una instancia de una nueva estategia
const LocalStrategy = new Strategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    //se require el email y el password. segun la condicion se ejecuta el done que recibe dos parametros.
    async (email, password, done) => {
        try {
            //se utiliza el metodo getuser para obtener el usuario y la contraseña así tener autenticacion
            const user = await service.readUser(email, password);
            //devuelve todos los datos del usuario para el login
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
);

module.exports = LocalStrategy;