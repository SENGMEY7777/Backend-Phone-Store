const { v2: cloudinary } = require('cloudinary');

const getCloudinaryConfigError = () => {
    if (process.env.CLOUDINARY_URL) {
        return null;
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        return 'Missing Cloudinary config. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env';
    }

    if (cloudName.toLowerCase() === 'root' || cloudName.includes('://') || cloudName.includes('/')) {
        return 'Invalid Cloudinary cloud name. Use the Cloud name from your Cloudinary dashboard, not Root, account name, or full URL';
    }

    return null;
};

if (!process.env.CLOUDINARY_URL) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });
}

module.exports = {
    cloudinary,
    getCloudinaryConfigError
};
