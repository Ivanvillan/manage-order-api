const nodemailer = require('nodemailer');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { config } = require('./../config/config');
const db = require('./../lib/database');

const UsersService = require('./users.service');
const service = new UsersService();

class AuthService {
    constructor() { }

    async readUser(email, password) {
        const user = await service.readByEmail(email);
        if (!user) {
            throw boom.unauthorized();
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            throw boom.unauthorized();
        }
        delete user[0].password;
        return user;
    }

    token(user) {
        const payload = {
            sub: user.iduser,
            role: user.role
        }
        const token = jwt.sign(payload, config.jwt_secret, {expiresIn: '1d'});
        return {
            user,
            token
        };
    }

    async linkRecovery(email) {
        const user = await service.readByEmail(email);
        if (!user) {
            throw boom.unauthorized();
        }
        console.log(user[0]);
        const payload = {
            sub: user[0].iduser
        }
        const token = jwt.sign(payload, config.jwt_secret, { expiresIn: '10min' });
        const sql = `UPDATE users SET tokenRecovery = ? WHERE iduser = ?`;
        await db.query(sql, [token, user[0].iduser]);
        const link = `https://localhost:4200/recovery-password/recovery?token=${token}`;
        const mail = {
            from: config.smtp_email,
            to: config.smtp_email,
            subject: 'Email para recuperar contraseña',
            html: `<b> Ingresar a este link => ${link}</b>`
        }
        const result = await this.sendEmail(mail);
        return result;
    }

    async sendEmail(emailBody) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            secure: true,
            port: 465,
            auth: {
              user: config.smtp_email,
              pass: config.smtp_password
            }
          });
          await transporter.sendMail(emailBody);
          return { message: 'mail sent' };
    }

    async changePassword(token, password) {
        try {
            const payload = jwt.verify(token, config.jwt_secret);
            const user = await service.readByID(payload.sub);
            if (user[0].tokenRecovery !== token) {
                throw boom.unauthorized();
            }
            const hash = await bcrypt.hash(password, 10);
            const sql = `UPDATE users SET password = ?, tokenRecovery = ? WHERE iduser = ?`;
            connection.query(sql, [hash, null, user[0].iduser]);
            return { message: 'Password changed' };
        } catch (error) {
            throw boom.unauthorized(error);
        }
    }
}

module.exports = AuthService;