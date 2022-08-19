const db = require('../lib/database');
const boom = require('@hapi/boom');
const nodemailer = require('nodemailer');
const exceljs = require('exceljs');
const moment = require('moment')

class ShipmentsService {
    constructor() { }

    async read() {
        const query = 'SELECT shipments.*, providers.business_name FROM shipments INNER JOIN providers ON shipments.idprovider = providers.idprovider ORDER BY shipments.created_at DESC';
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
        const query = 'INSERT INTO shipments (idorder, idprovider, status) VALUES (?, ?, ?)';
        const idorder = data.idorder;
        const idprovider = data.idprovider;
        const status = data.status
        const email = data.email;
        return new Promise((resolve, reject) => {
            db.query(query, [idorder, idprovider, status], (err, result, row) => {
                if (!err) {
                    resolve(result.insertId);
                    const mail = {
                        from: 'app.gisisrl@gmail.com',
                        to: email,
                        attachments: [
                            {
                                filename: 'GISI SRL: Nota de pedido - ' + moment(new Date()).locale('es-AR').format('D/MMM/YY') + '.xlsx',
                                path: './assets/docs/export.xlsx'
                            }
                        ],
                        subject: 'GISI SRL: Nota de pedido - ' + moment(new Date()).locale('es-AR').format('D/MMM/YY'),
                        html: `<h3>Nueva nota de pedido generada</h3>
                                <p>Hola, el documento con los requerimientos se encuentra adjunto al final del mail.</p>
                                <p>Saludos.</p>
                            `
                    }
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        secure: true,
                        port: 465,
                        auth: {
                            user: 'app.gisisrl@gmail.com',
                            pass: 'wfdrjyawcgphzzqi'
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
        updates.updated_at = new Date();
        const query = 'UPDATE shipments SET ? WHERE idshipment = ?';
        const data = updates;
        delete data.email
        return new Promise((resolve, reject) => {
            db.query(query, [data, id], (err, row) => {
                if (!err) {
                    resolve(row);
                } else {
                    reject(boom.badRequest(err.sqlMessage));
                }
            });
        });
    }


    async export(data) {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Orden');

        [
            'A1', 'B1', 'C1', 'D1',
            'A2', 'B2', 'C2', 'D2',
            'A3', 'B3', 'C3', 'D3',
            'A4', 'B4', 'C4', 'D4',
            'A5', 'B5', 'C5', 'D5',
        ].map(key => {
            worksheet.getCell(key).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '424851' },
                bgColor: { argb: '424851' }
            };
        });

        worksheet.getCell('C2').width = 15;
        worksheet.getCell('C2').value = 'NOTA DE PEDIDO'
        worksheet.getCell('C2').font = {
            name: 'Arial',
            family: 2,
            size: 18,
            color: { argb: 'FFFFFF' },
            bold: true
        };

        worksheet.getCell('C3').width = 15;
        worksheet.getCell('C3').value = 'A PROVEEDORES'
        worksheet.getCell('C3').font = {
            name: 'Arial',
            family: 2,
            size: 24,
            color: { argb: 'FFFFFF' },
            bold: true
        };

        worksheet.getColumn(1).width = 15;
        worksheet.getColumn(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getColumn(2).width = 60;
        worksheet.getColumn(2).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getColumn(3).width = 40;
        worksheet.getColumn(3).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getColumn(4).width = 25;
        worksheet.getColumn(4).alignment = { vertical: 'middle', horizontal: 'center' };

        const imageId1 = workbook.addImage({
            filename: './assets/img/gisi-logo.png',
            extension: 'png',
        });

        worksheet.addImage(imageId1, {
            tl: { col: 1.0, row: 1.5},
            ext: { width: 117, height: 54 },
        });

        [
            'A6', 'B6', 'C6', 'D6'
        ].map(key => {
            worksheet.getCell(key).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'C33C01' },
                bgColor: { argb: 'C33C01' }
            };
        });

        [
            'A6', 'B6', 'C6', 'D6'
        ].map(key => {
            worksheet.getCell(key).border = {
                top: { style: 'medium' },
                left: { style: 'thin' },
                bottom: { style: 'medium' },
                right: { style: 'thin' }
            };
        });

        [
            'A6', 'B6', 'C6', 'D6'
        ].map(key => {
            worksheet.getCell(key).font = {
                name: 'Calibri',
                family: 2,
                size: 12,
                color: { argb: 'FFFFFF' },
                bold: true
            };
        });

        [
            'A7', 'B7', 'C7', 'D7'
        ].map(key => {
            worksheet.getCell(key).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'C0C0C0' },
                bgColor: { argb: 'C0C0C0' }
            };
        });

        [
            'A7', 'B7', 'C7', 'D7'
        ].map(key => {
            worksheet.getCell(key).border = {
                top: { style: 'medium' },
                left: { style: 'thin' },
                bottom: { style: 'medium' },
                right: { style: 'thin' }
            };
        });

        [
            'A7', 'B7', 'C7', 'D7'
        ].map(key => {
            worksheet.getCell(key).font = {
                name: 'Calibri',
                family: 2,
                size: 11,
                color: { argb: 'FFFFFF' },
                bold: true
            };
        });

        [
            'A8', 'B8', 'C8', 'D8'
        ].map(key => {
            worksheet.getCell(key).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '8FD24C' },
                bgColor: { argb: '8FD24C' }
            };
        });

        [
            'A8', 'B8', 'C8', 'D8'
        ].map(key => {
            worksheet.getCell(key).border = {
                bottom: { style: 'medium' },
            };
        });

        worksheet.getCell('B8').width = 15;
        worksheet.getCell('B8').alignment = { vertical: 'middle', horizontal: 'right' };
        worksheet.getCell('B8').font = {
            name: 'Calibri',
            family: 2,
            size: 11,
            color: { argb: '000000' },
            bold: true
        };
        worksheet.getCell('B8').value = 'PAÑOL';

        [
            'A9', 'B9', 'C9', 'D9'
        ].map(key => {
            worksheet.getCell(key).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'C33C01' },
                bgColor: { argb: 'C33C01' }
            };
        });

        worksheet.getCell('B9').width = 15;
        worksheet.getCell('B9').alignment = { vertical: 'middle', horizontal: 'right' };
        worksheet.getCell('B9').font = {
            name: 'Calibri',
            family: 2,
            size: 11,
            color: { argb: 'FFFFFF' },
            bold: true
        };
        worksheet.getCell('B9').value = 'DETALLE  DEL';

        worksheet.getCell('C9').width = 15;
        worksheet.getCell('C9').alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getCell('C9').font = {
            name: 'Calibri',
            family: 2,
            size: 11,
            color: { argb: 'FFFFFF' },
            bold: true
        };
        worksheet.getCell('C9').value = 'PEDIDO';

        [
            'A10', 'B10', 'C10', 'D10'
        ].map(key => {
            worksheet.getCell(key).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'C0C0C0' },
                bgColor: { argb: 'C0C0C0' }
            };
        });

        [
            'A10', 'B10', 'C10', 'D10'
        ].map(key => {
            worksheet.getCell(key).border = {
                top: { style: 'medium' },
                left: { style: 'thin' },
                bottom: { style: 'medium' },
                right: { style: 'thin' }
            };
        });

        [
            'A10', 'B10', 'C10', 'D10'
        ].map(key => {
            worksheet.getCell(key).font = {
                name: 'Calibri',
                family: 2,
                size: 12,
                color: { argb: 'FFFFFF' },
                bold: true
            };
        });


        worksheet.addTable({
            name: 'header',
            ref: 'A6',
            headerRow: true,
            style: {
                showFirstColumn: true
            },
            columns: [
                { name: 'Numero' },
                { name: 'Proveedor' },
                { name: 'Fecha' },
                { name: 'Solicitante' },
            ],
            rows: [
                [data[0]?.orden, data[0]?.provider, data[0]?.generate, data[0]?.name + ' ' + data[0]?.surname]
            ],
        });
        worksheet.addTable({
            name: 'products',
            ref: 'A10',
            headerRow: true,
            style: {
                showFirstColumn: true
            },
            columns: [
                { name: 'Cantidad' },
                { name: 'Producto' },
                { name: 'Dato' },
            ],
            rows: []
        });
        const table = worksheet.getTable('products');
        data.splice(0, 1);
        data.forEach((val, i) => {
            table.addRow([val.real_quantity, val.description, val.denomination], i)
        });
        table.commit();
        await workbook.xlsx.writeFile('./assets/docs/export.xlsx');
    };
}

module.exports = ShipmentsService;