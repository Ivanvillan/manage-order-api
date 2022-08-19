const db = require('./../lib/database');
const boom = require('@hapi/boom');

class CategoriesService {

    constructor() { }

    async read() {
        const query = 'SELECT * FROM categories';
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
        const query = 'SELECT * FROM categories WHERE idcategorie = ?';
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
        const query = 'SELECT * FROM categories WHERE enabled = ?'
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

    readByDenomination(data) {
        const query = 'SELECT * FROM categories WHERE denomination LIKE ?'
        return new Promise((resolve, reject) => {
            db.query(query, ['%' + data.denomination + '%'], (err, row) => {
                if (!err) {
                    resolve(row);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }

    async create(data) { 
        const query = 'INSERT INTO categories (denomination) VALUES (?)';
        const denomination = data.denomination;
        return new Promise((resolve, reject) => {
            db.query(query, [denomination], (err, result, row) => {
                if (!err) {
                    resolve(`categorie id ${result.insertId}`);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            })
        });
    }

    async update(id, updates) { 
        if(updates.created_at) {
            updates.created_at = updates.created_at.split('.')[0];
        }
        updates.updated_at = new Date();
        const query = 'UPDATE categories SET ? WHERE idcategorie = ?';
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
        const query = 'DELETE FROM categories WHERE idcategorie = ?';
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

module.exports = CategoriesService;