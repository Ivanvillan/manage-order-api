const db = require('../lib/database');
const boom = require('@hapi/boom');
const nodemailer = require('nodemailer');

class ShipmentsService {
    constructor() { }

    async read() {
        const query = 'SELECT * FROM shipments INNER JOIN providers ON shipments.idprovider = providers.idprovider ORDER BY shipments.send DESC';
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
        const query = 'SELECT * FROM shipments WHERE idshipment = ?';
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
        const query = 'INSERT INTO shipments (idorder, idprovider, send, result, created_at) VALUES (?, ?, ?, ?, ?)';
        const idorder = data.idorder;
        const idprovider = data.idprovider;
        const send = data.send;
        const result = data.result;
        const created_at = data.created_at;
        return new Promise((resolve, reject) => {
            db.query(query, [idorder, idprovider, send, result, created_at], (err, result, row) => {
                if (!err) {
                    resolve(result.insertId);
                    const link = `http://localhost:4200/shipments/shipments-list`;
                    const mail = {
                        from: data.email,
                        to: 'ivanvillan54@gmail.com',
                        subject: 'Envio a proveedor generado',
                        html: `<h3> Envío N° ${result.insertId} => Generado por el usuario ${data.email}</h3>
                                <p>A la espera de ser recibida</p>
                                <p>Ir al listado de envios ${link}</p>`
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
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            })
        });
    }

    async update(id, updates) {
        if (updates.created_at) {
            updates.created_at = updates.created_at.split('.')[0];
        }
        const query = 'UPDATE shipments SET ? WHERE idshipment = ?';
        const data = updates;
        delete data.email
        return new Promise((resolve, reject) => {
            db.query(query, [data, id], (err, row) => {
                if (!err) {
                    resolve(row);
                    if (updates.result) {
                        const link = `http://localhost:4200/shipments/shipments-list`;
                        const mail = {
                            from: updates.email,
                            to: 'ivanvillan54@gmail.com',
                            subject: 'Envio a proveedor actualizado',
                            html: `<h3> Envío N° ${id} => Actualizado por el usuario ${updates.email}</h3>
                                    <p>Ha sido actualizado y su estado es ${updates.result}</p>
                                    <p>Ir al listado de envios ${link}</p>`
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
                        if (updates.result == 2) {
                            const query = 'UPDATE orders SET ? WHERE idorder = ?';
                            const id = updates.idorder;
                            const orderUpdate = {
                                state: 3,
                                updated_at: new Date()
                            }
                            return new Promise((resolve, reject) => {
                                db.query(query, [orderUpdate, id], (err, row) => {
                                    if (!err) {
                                        resolve(row);
                                    } else {
                                        reject(boom.badRequest(err.sqlMessage));
                                    }
                                });
                            });
                        }
                        if (updates.result == 3) {
                            const query = 'UPDATE orders SET ? WHERE idorder = ?';
                            const id = updates.idorder;
                            const orderUpdate = {
                                state: 4,
                                updated_at: new Date()
                            }
                            return new Promise((resolve, reject) => {
                                db.query(query, [orderUpdate, id], (err, row) => {
                                    if (!err) {
                                        resolve(row);
                                    } else {
                                        reject(boom.badRequest(err.sqlMessage));
                                    }
                                });
                            });
                        }
                        if (updates.result == 4) {
                            const query = 'UPDATE orders SET ? WHERE idorder = ?';
                            const id = updates.idorder;
                            const orderUpdate = {
                                state: 5,
                                updated_at: new Date()
                            }
                            return new Promise((resolve, reject) => {
                                db.query(query, [orderUpdate, id], (err, row) => {
                                    if (!err) {
                                        resolve(row);
                                    } else {
                                        reject(boom.badRequest(err.sqlMessage));
                                    }
                                });
                            });
                        }
                        transporter.sendMail(mail);
                        return { message: 'mail sent' };
                    } 
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }
}

module.exports = ShipmentsService;