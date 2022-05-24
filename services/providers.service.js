const db = require('./../lib/database');
const boom = require('@hapi/boom');

class ProvidersService {

    constructor() { }

    async read() {
        const query = 'SELECT * FROM providers';
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
        const query = 'SELECT * FROM providers WHERE idprovider = ?';
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

    readByState(state) {
        const query = 'SELECT * FROM providers WHERE enabled = ?'
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

    async create(data) { 
        const query = 'INSERT INTO providers (business_name, phone, email, additional_information) VALUES (?, ?, ?, ?)';
        const business_name = data.business_name;
        const phone = data.phone;
        const email = data.email;
        const additional_information = data.additional_information;
        return new Promise((resolve, reject) => {
            db.query(query, [business_name, phone, email, additional_information], (err, result, row) => {
                if (!err) {
                    resolve(`provider id ${result.insertId}`);
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
        const query = 'UPDATE providers SET ? WHERE idprovider = ?';
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
        const query = 'DELETE FROM providers WHERE idprovider = ?';
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

module.exports = ProvidersService;