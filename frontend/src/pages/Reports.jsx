import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Download, Calendar, Search } from 'lucide-react';

const Reports = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (!startDate || !endDate) return alert('Por favor seleccione un rango de fechas');
        setLoading(true);
        try {
            const response = await axios.get(`/api/reports/download/sales?startDate=${startDate}&endDate=${endDate}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte-ventas-${startDate}-${endDate}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert('Error al generar el reporte');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Centro de Reportes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Reporte de Ventas */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center space-x-3 text-blue-600">
                        <FileText size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Reporte de Ventas Operacional</h2>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Genera un detalle completo de todas las ventas completadas en el rango de fechas seleccionado. 
                        Incluye información de clientes, fechas y montos totales.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    type="date" 
                                    className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    type="date" 
                                    className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleDownload}
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                        {loading ? <span>Generando...</span> : (
                            <>
                                <Download size={20} />
                                <span>Descargar PDF</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Otros Reportes (Placeholder) */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-white rounded-full text-gray-400">
                        <Search size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-700">Más Reportes próximamente</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            Estamos trabajando en reportes de inventario, análisis de tendencias y proyecciones de ventas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
