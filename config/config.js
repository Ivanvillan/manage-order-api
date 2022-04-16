require('dotenv').config();

const config = {
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    pass: process.env.PASSWORD_DB,
    db: process.env.DATABASE,
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET
}

module.exports = { config };