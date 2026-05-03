import React, { useState, useCallback } from 'react';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ImageUploader = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFile = (selectedFile) => {
        if (!selectedFile) return;
        
        if (!selectedFile.type.startsWith('image/')) {
            toast.error('Por favor sube una imagen válida');
            return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
            toast.error('La imagen no debe superar los 2MB');
            return;
        }

        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(selectedFile);
    };

    const uploadImage = async () => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post('/api/uploads/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percent);
                }
            });
            toast.success('Imagen subida con éxito');
            onUploadSuccess(res.data.url);
        } catch (err) {
            toast.error('Error al subir imagen');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {!preview ? (
                <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFile(e.dataTransfer.files[0]);
                    }}
                    className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-slate-50 transition-all cursor-pointer group"
                    onClick={() => document.getElementById('file-upload').click()}
                >
                    <div className="p-4 bg-slate-100 rounded-2xl text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Upload size={32} />
                    </div>
                    <p className="mt-4 font-bold text-slate-900">Suelta tu imagen aquí</p>
                    <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">PNG, JPG hasta 2MB</p>
                    <input id="file-upload" type="file" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </div>
            ) : (
                <div className="relative group rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 h-64">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        {!uploading && (
                            <>
                                <button 
                                    onClick={uploadImage}
                                    className="bg-primary text-white p-3 rounded-2xl font-bold text-xs flex items-center gap-2 hover:scale-110 transition-transform"
                                >
                                    <CheckCircle2 size={18} /> Confirmar Subida
                                </button>
                                <button 
                                    onClick={() => { setFile(null); setPreview(null); }}
                                    className="bg-white text-slate-900 p-3 rounded-2xl font-bold text-xs flex items-center gap-2 hover:scale-110 transition-transform"
                                >
                                    <X size={18} /> Cancelar
                                </button>
                            </>
                        )}
                    </div>
                    {uploading && (
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-8">
                            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-4">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-primary"
                                />
                            </div>
                            <p className="text-white font-black uppercase tracking-widest text-[10px] animate-pulse">Subiendo... {progress}%</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
