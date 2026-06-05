const { cloudinary, getCloudinaryConfigError } = require('../../configs/cloudinary');

const uploadImage = (file) => {
    if (!file) {
        return null;
    }

    const configError = getCloudinaryConfigError();
    if (configError) {
        throw new Error(configError);
    }

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'backend-ecommerce/products',
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                return resolve(result.secure_url);
            }
        );

        stream.end(file.buffer);
    });
};

module.exports = {
    uploadImage
};
