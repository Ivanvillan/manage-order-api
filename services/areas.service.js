const db = require('./../lib/database');
const boom = require('@hapi/boom');

class AreasService {
    constructor() {}

    async read() {
        const query = 'SELECT * FROM areas';
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

    async readByID(id) {
        const query = 'SELECT * FROM areas WHERE idarea = ?';
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

    async readByState(state) {
        const query = 'SELECT * FROM areas WHERE enabled = ?'
        return new Promise((resolve, reject) => {
            db.query(query, [state], (err, row) => {
                if (!err) {
                    resolve(row);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }

    async readByDetail(data) { 
        const query = 'SELECT * FROM areas WHERE detail LIKE ?'
        return new Promise((resolve, reject) => {
            db.query(query, ['%' + data.detail + '%'], (err, row) => {
                if (!err) {
                    resolve(row);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }

    async create(data) {
        const query = 'INSERT INTO areas (detail) VALUES (?)';
        const detail = data.detail;
        return new Promise((resolve, reject) => {
            db.query(query, [detail], (err, result, row) => {
                if (!err) {
                    resolve(`area id ${result.insertId}`);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            })
        });
    }

    async update(id, updates) {
        if(updates.created) {
            updates.created = updates.created.split('.')[0];
        }
        updates.updated = new Date();
        const query = 'UPDATE areas SET ? WHERE idarea = ?';
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
        const query = 'DELETE FROM areas WHERE idarea = ?';
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

module.exports = AreasService;