const db = require('./../lib/database');
const boom = require('@hapi/boom');

class ProductsService {
    constructor() { }

    async read() {
        const query = 'SELECT * FROM products';
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
        const query = 'SELECT * FROM products WHERE idproduct = ?';
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
        const query = 'SELECT * FROM products WHERE enabled = ?'
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

    async readByCategorie(id) { 
        const query = 'SELECT * FROM products WHERE idcategorie = ?'
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

    async readByDescription(data) { 
        const query = 'SELECT * FROM products WHERE description LIKE ?'
        return new Promise((resolve, reject) => {
            db.query(query, ['%' + data.description + '%'], (err, row) => {
                if (!err) {
                    resolve(row);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }

    async create(data) { 
        const query = 'INSERT INTO products (idcategorie, description, stock, last_updated) VALUES (?, ?, ?, ?)';
        const idcategorie = data.idcategorie;
        const description = data.description;
        const stock = data.stock;
        const last_updated = new Date();
        return new Promise((resolve, reject) => {
            db.query(query, [idcategorie, description, stock, last_updated], (err, result, row) => {
                if (!err) {
                    resolve(`product id ${result.insertId}`);
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
        updates.last_updated = new Date();
        const query = 'UPDATE products SET ? WHERE idproduct = ?';
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
        const query = 'DELETE FROM products WHERE idproduct = ?';
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

module.exports = ProductsService;