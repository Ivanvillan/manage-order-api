const db = require('./../lib/database');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

class UsersService {
    constructor() { }

    async read() {
        const query = 'SELECT * FROM users';
        return new Promise((resolve, reject) => {
            db.query(query, (err, row) => {
                if (!err) {
                    resolve(row);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }

    async readByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [email], (err, row) => {
                if (!err) {
                    resolve(row);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }

    async readByID(id) {
        const query = 'SELECT * FROM users WHERE iduser = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, row) => {
                if (!err) {
                    resolve(row);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }

    async create(data) {
        const query = 'INSERT INTO users (name, surname, role, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)';
        const name = data.name;
        const surname = data.surname;
        const role = data.role;
        const phone = data.phone;
        const email = data.email;
        const hash = await bcrypt.hash(data.password, 10);
        return new Promise((resolve, reject) => {
            db.query(query, [name, surname, role, phone, email, hash], (err, result, row) => {
                if (!err) {
                    delete data.password;
                    resolve(`user id ${result.insertId}`);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            })
        });
    }

    async update(id, updates) {
        const query = 'UPDATE users SET ? WHERE iduser = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [updates, id], (err, row) => {
                if (!err) {
                    resolve(row);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }

    async delete(id) {
        const query = 'DELETE FROM users WHERE iduser = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, row, fields) => {
                if (!err) {
                    resolve(row, fields);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }
}

module.exports = UsersService;