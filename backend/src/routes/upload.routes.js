const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

router.post('/upload', verifyToken, authorize('Admin', 'Vendedor'), upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se pudo subir la imagen' });
    }
    res.json({ url: req.file.path });
});

module.exports = router;
