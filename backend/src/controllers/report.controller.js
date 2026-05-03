const db = require('../config/db');
const pdfService = require('../services/pdf.service');

exports.getDashboardStats = async (req, res, next) => {
    try {
        // 1. KPIs Generales
        const kpisQuery = `
            SELECT 
                COALESCE(SUM(total_amount), 0) as total_revenue,
                COUNT(id) as total_orders,
                AVG(total_amount) as avg_order_value
            FROM orders 
            WHERE status = 'completado'
        `;
        const kpis = await db.query(kpisQuery);

        // 2. Ventas por periodo (últimos 30 días)
        const salesPeriodQuery = `
            SELECT 
                DATE(created_at) as date,
                SUM(total_amount) as amount,
                COUNT(id) as count
            FROM orders 
            WHERE status = 'completado' AND created_at > CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `;
        const salesPeriod = await db.query(salesPeriodQuery);

        // 3. Productos más vendidos
        const topProductsQuery = `
            SELECT 
                p.name,
                SUM(oi.quantity) as total_sold,
                SUM(oi.subtotal) as revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.status = 'completado'
            GROUP BY p.id, p.name
            ORDER BY total_sold DESC
            LIMIT 5
        `;
        const topProducts = await db.query(topProductsQuery);

        // 4. Ingresos por categoría
        const revenueByCategoryQuery = `
            SELECT 
                c.name as category,
                SUM(oi.subtotal) as revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN categories c ON p.category_id = c.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.status = 'completado'
            GROUP BY c.id, c.name
            ORDER BY revenue DESC
        `;
        const revenueByCategory = await db.query(revenueByCategoryQuery);

        // 5. Estadísticas Descriptivas
        const statsQuery = `
            SELECT 
                AVG(total_amount) as mean,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_amount) as median,
                STDDEV(total_amount) as stddev
            FROM orders 
            WHERE status = 'completado'
        `;
        const stats = await db.query(statsQuery);

        res.json({
            kpis: kpis.rows[0],
            salesPeriod: salesPeriod.rows,
            topProducts: topProducts.rows,
            revenueByCategory: revenueByCategory.rows,
            stats: stats.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

exports.downloadSalesReport = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const pdfBuffer = await pdfService.generateSalesReport(startDate, endDate);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte-ventas-${startDate}-${endDate}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};
