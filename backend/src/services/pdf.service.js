const PDFDocument = require('pdfkit');
const db = require('../config/db');

exports.generateSalesReport = async (startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `
                SELECT o.*, u.username as customer 
                FROM orders o 
                JOIN users u ON o.customer_id = u.id 
                WHERE o.status = 'completado' 
                AND o.created_at BETWEEN $1 AND $2
                ORDER BY o.created_at DESC
            `;
            const result = await db.query(query, [startDate, endDate]);
            const orders = result.rows;

            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Header
            doc.fontSize(20).text('Reporte de Ventas', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Periodo: ${startDate} a ${endDate}`, { align: 'center' });
            doc.moveDown();

            // Table Header
            const tableTop = 150;
            doc.font('Helvetica-Bold');
            doc.text('ID', 50, tableTop);
            doc.text('Fecha', 100, tableTop);
            doc.text('Cliente', 200, tableTop);
            doc.text('Total', 400, tableTop);
            doc.moveDown();
            doc.font('Helvetica');

            let currentY = tableTop + 25;
            let totalRevenue = 0;

            orders.forEach(order => {
                doc.text(order.id.toString(), 50, currentY);
                doc.text(new Date(order.created_at).toLocaleDateString(), 100, currentY);
                doc.text(order.customer, 200, currentY);
                doc.text(`$${order.total_amount}`, 400, currentY);
                
                totalRevenue += Number(order.total_amount);
                currentY += 20;

                if (currentY > 700) {
                    doc.addPage();
                    currentY = 50;
                }
            });

            doc.moveDown();
            doc.font('Helvetica-Bold').text(`Ingresos Totales: $${totalRevenue.toFixed(2)}`, 350, currentY + 20);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
