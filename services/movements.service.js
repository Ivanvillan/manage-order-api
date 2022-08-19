const db = require('../lib/database');
const boom = require('@hapi/boom');
const nodemailer = require('nodemailer');

class ShipmentsService {
    constructor() {}

    async read() {
        const query = 'SELECT * FROM movements INNER JOIN products ON movements.idproduct = products.idproduct ORDER BY movements.created_at DESC';
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
        const query = 'SELECT * FROM movements WHERE idmovement = ?';
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
        const query = 'INSERT INTO movements (idproduct, idreference, quantity, price, type) VALUES (?, ?, ?, ?, ?)';
        const idproduct = data.idproduct;
        const idreference = data.idreference;
        const type = data.type;
        const quantity = data.quantity;
        const price = data.price;
        const dataForProduct = {
            productQuantity: quantity,
            productPrice: price,
            productType: type
        }
        return new Promise((resolve, reject) => {
            db.query(query, [idproduct, idreference, quantity, price, type], (err, result, row) => {
                if (!err) {
                    resolve(result.insertId);
                    this.update(idproduct, dataForProduct);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            })
        });
    }

    async update(id, updates) { 
        let query;
        const quantity = updates.productQuantity;
        const price = updates.productPrice;
        const type = updates.productType;
        if (type === 0) {
            query = `UPDATE products SET stock = stock + ${quantity}, price = ${price} WHERE idproduct = ${id}`;
        } else {
            query = `UPDATE products SET stock = stock - ${quantity}, price = ${price} WHERE idproduct = ${id}`;
        }
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
}

module.exports = ShipmentsService;