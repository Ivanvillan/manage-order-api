const db = require('../lib/database');
const boom = require('@hapi/boom');
const nodemailer = require('nodemailer');

class ShipmentsService {
    constructor() {}

    async read() {
        const query = 'SELECT * FROM movements INNER JOIN products ON movements.idproduct = products.idproduct ORDER BY movements.datetime DESC';
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
        const query = 'INSERT INTO movements (idproduct, idreference, datetime, type, quantity, price) VALUES (?, ?, ?, ?, ?, ?)';
        const idproduct = data.idproduct;
        const idreference = data.idreference;
        const datetime = data.datetime;
        const type = data.type;
        const quantity = data.quantity;
        const price = data.price;
        const lastMovement = data.lastMovement;
        const dataForProduct = {
            productQuantity: quantity,
            productPrice: price,
            productType: type
        }
        return new Promise((resolve, reject) => {
            db.query(query, [idproduct, idreference, datetime, type, quantity, price], (err, result, row) => {
                if (!err) {
                    resolve(result.insertId);
                    this.update(idproduct, dataForProduct);
                    if (type === 0 && lastMovement) {
                        const link = `http://localhost:4200/movements/movement-list`;
                        const mail = {
                            from: data.email,
                            to: 'ivanvillan54@gmail.com',
                            subject: 'Movimiento de entrada generado',
                            html: `<h3> Nuevos movimientos => Generado por el usuario ${data.email}</h3>
                                    <p>Los productos han sido actualizados</p>
                                    <p>Ir al listado de movimientos ${link}</p>`
                        }
                        const transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            secure: true,
                            port: 465,
                            auth: {
                                user: 'ivanvillan54@gmail.com',
                                pass: 'ugatswudzcuslocw'
                            }
                        });
                        transporter.sendMail(mail);
                        return { message: 'mail sent' };
                    } 
                    if (type === 1 && lastMovement) {
                        const link = `http://localhost:4200/movements/movement-list`;
                        const mail = {
                            from: data.email,
                            to: 'ivanvillan54@gmail.com',
                            subject: 'Movimiento de salida generado',
                            html: `<h3> Movimiento N° ${result.insertId} => Generado por el usuario ${data.email}</h3>
                                    <p>Los productos han sido actualizados</p>
                                    <p>Ir al listado de movimientos ${link}</p>`
                        }
                        const transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            secure: true,
                            port: 465,
                            auth: {
                                user: 'ivanvillan54@gmail.com',
                                pass: 'ugatswudzcuslocw'
                            }
                        });
                        transporter.sendMail(mail);
                        return { message: 'mail sent' };
                    }
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