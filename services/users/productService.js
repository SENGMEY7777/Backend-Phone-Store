const productModel = require('../../models/users/productModel');
const brandModel = require('../../models/users/brandModel');

const toBooleanInt = (value, defaultValue) => {
    if (value === undefined || value === null || value === '') {
        return defaultValue;
    }

    if (value === true || value === 1 || value === '1' || value === 'true') {
        return 1;
    }

    if (value === false || value === 0 || value === '0' || value === 'false') {
        return 0;
    }

    throw new Error('Invalid boolean value');
};

const toNumber = (value, defaultValue) => {
    if (value === undefined || value === null || value === '') {
        return defaultValue;
    }

    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
        throw new Error('Invalid number value');
    }

    return numberValue;
};

const toNullableValue = (value, defaultValue = null) => {
    if (value === undefined) {
        return defaultValue;
    }

    if (value === null || value === '' || value === 'null') {
        return null;
    }

    return value;
};

const normalizeProductBody = (body, currentProduct = {}) => ({
    ...body,
    brand_id: toNumber(body.brand_id, currentProduct.brand_id),
    price: toNumber(body.price, currentProduct.price),
    stock_quantity: toNumber(body.stock_quantity, currentProduct.stock_quantity),
    preorder_available: toBooleanInt(
        body.preorder_available,
        currentProduct.preorder_available ?? 0
    ),
    preorder_release_date: toNullableValue(
        body.preorder_release_date,
        currentProduct.preorder_release_date ?? null
    ),
    image_url: body.image_url || currentProduct.image_url || null,
    is_active: toBooleanInt(body.is_active, currentProduct.is_active ?? 1)
});

const createProduct = async (body) => {
    const productBody = normalizeProductBody(body);

    const checkBrand = await brandModel.getBrandById(productBody.brand_id);
    if (checkBrand.length === 0) {
        throw new Error('Brand not found');
    }

    const result = await productModel.createProduct(productBody);
    const rows = await productModel.getProductById(result);

    return rows[0];
}

const getAllProducts = async () => {
    let rows = await productModel.getAllProducts();

    return rows;
}

const getProductById = async (id) => {
    let rows = await productModel.getProductById(id);
    if(rows.length === 0) {
        throw new Error('Product not found');
    }

    return rows[0];
}

const updateProduct = async (id, body) => {
    let checkProduct = await productModel.getProductById(id);
    if(checkProduct.length === 0) {
        throw new Error('Product not found');
    }

    const productBody = normalizeProductBody(body, checkProduct[0]);

    const checkBrand = await brandModel.getBrandById(productBody.brand_id);
    if (checkBrand.length === 0) {
        throw new Error('Brand not found');
    }

    await productModel.updateProduct(id, productBody);
    const rows = await productModel.getProductById(id);

    return rows[0];
}

const deleteProduct = async (id) => {
    let checkProduct = await productModel.getProductById(id);
    if(checkProduct.length === 0) {
        throw new Error('Product not found');
    }

    await productModel.deleteProduct(id);
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}
