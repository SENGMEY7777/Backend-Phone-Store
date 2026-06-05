const multer = require('multer');
const { sendResponse } = require('../utils/responeHelper');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'));
    }

    return cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const uploadProductImage = (req, res, next) => {
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'image_url', maxCount: 1 }
    ])(req, res, (error) => {
        if (error) {
            return sendResponse(res, 400, false, error.message);
        }

        req.file = req.files?.image_url?.[0] || req.files?.image?.[0] || null;

        return next();
    });
};

module.exports = {
    upload,
    uploadProductImage
};
