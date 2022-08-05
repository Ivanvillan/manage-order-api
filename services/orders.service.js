const db = require('./../lib/database');
const boom = require('@hapi/boom');
const nodemailer = require('nodemailer');
const exceljs = require('exceljs');
const { unlink } = require('node:fs/promises');


class OrdersService {

    constructor() { }

    async read() {
        const query = 'SELECT * FROM orders INNER JOIN areas ON orders.idarea = areas.idarea INNER JOIN users ON orders.iduser = users.iduser ORDER BY orders.generate DESC';
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
        const query = 'SELECT * FROM orders WHERE idorder = ?';
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

    async readByState(data, query) {
        return new Promise((resolve, reject) => {
            db.query(query, [data], (err, row) => {
                if (!err) {
                    resolve(row);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }

    async readOrderDetailByID(id) {
        const query = 'SELECT * FROM orders_details INNER JOIN products ON orders_details.idproduct = products.idproduct WHERE idorder = ?';
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
        const query = `INSERT INTO orders 
        (idarea, generate, reception_date, work_start_date, agreed_delivery_date, 
            state, canceled, finished, observations, iduser, 
            validated_user, validated_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            db.query(query,
                [data.idarea, data.generate, data.reception_date, data.work_start_date, data.agreed_delivery_date,
                data.state, data.canceled, data.finished, data.observations, data.iduser,
                data.validated_user, data.validated_date], (err, result, row) => {
                    if (!err) {
                        resolve(result.insertId);
                        const link = `http://localhost:4200/orders/orders-update`;
                        const mail = {
                            from: data.email,
                            to: 'ivanvillan54@gmail.com',
                            subject: 'Nota de pedido generada',
                            html: `<h3> Orden N° ${result.insertId} => Generada por el usuario ${data.email}</h3>
                                    <p>A la espera de ser aprobada</p>
                                    <p>Editar esta orden ${link}</p>`
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

    async createOrderDetail(data) {
        const query = `INSERT INTO orders_details (idorder, idproduct, aggregate_date, 
            original_quantity, real_quantity, excluded, isnew) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            db.query(query,
                [data.idorder, data.idproduct, data.aggregate_date, data.original_quantity,
                data.real_quantity, data.excluded, data.isnew], (err, result, row) => {
                    if (!err) {
                        resolve(`order detail id ${result.insertId}`);
                    } else {
                        reject(boom.badRequest(err.sqlMessage));
                    }
                })
        });
    }

    async update(id, updates) {
        const data = updates;
        delete data.email;
        if (updates.generate) {
            updates.generate = updates.generate.split('.')[0];
        }
        if (updates.finished) {
            updates.finished = updates.finished.split('.')[0];
        }
        if (updates.validated_date) {
            updates.validated_date = updates.validated_date.split('.')[0];
        }
        updates.updated_at = new Date();
        const query = 'UPDATE orders SET ? WHERE idorder = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [data, id], (err, row) => {
                if (!err) {
                    resolve(row);
                    if (updates.state == 2) {
                        const mail = {
                            from: updates.email,
                            to: 'ivanvillan54@gmail.com',
                            attachments: [
                                {
                                    filename: `Nota de pedido ${id}.xlsx`,
                                    path: './assets/docs/export.xlsx'
                                }
                            ],
                            subject: 'Nota de pedido validada',
                            html: `<h3> Orden N° ${id} => Actualizada por el usuario ${updates.email}</h3>
                                    <p>Esta orden ha sido validada</p>
                                    <p>Archivo adjunto generado para seguir con el proceso</p>`
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
            });
        });
    }

    async updateOrderDetail(id, updates) {
        const query = 'UPDATE orders_details SET ? WHERE iddetail = ?';
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
        const query = 'DELETE FROM orders WHERE idorder = ?';
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

    async export(data) {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Orden');

        const imageId1 = workbook.addImage({
            filename: './assets/img/gisi-logo.png',
            extension: 'png',
        });

        worksheet.addImage(imageId1, {
            ext: { width: 117, height: 54 },
        });
        worksheet.addTable({
            name: 'header',
            ref: 'C1',
            headerRow: true,
            style: {
                showFirstColumn: true
            },
            columns: [
                { name: 'Identificador' },
                { name: 'Fecha' },
                { name: 'Área' },
                { name: 'Solicitante' },
            ],
            rows: [
                [, data[0]?.generate, data[0]?.detail, data[0]?.name + ' ' + data[0]?.surname]
            ],
        });
        worksheet.addTable({
            name: 'products',
            ref: 'A4',
            headerRow: true,
            style: {
                showFirstColumn: true
            },
            columns: [
                { name: 'Cantidad' },
                { name: 'Producto' },
            ],
            rows: []
        });
        const table = worksheet.getTable('products');
        data.splice(0, 1);
        data.forEach((val, i) => {
            table.addRow([val.real_quantity, val.description], i)
        });
        table.commit();
        await workbook.xlsx.writeFile('./assets/docs/export.xlsx');
    };
}


module.exports = OrdersService;