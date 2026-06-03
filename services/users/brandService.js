const brandModel = require('../../models/users/brandModel');

const createBrand = async (body) => {
    const checkBrand = await brandModel.getBrandByName(body.name);

    if (checkBrand.length > 0) {
        throw new Error('Brand already exists');
    }

    const result  = await brandModel.createBrand(body);

    const rows = await brandModel.getBrandById(result);

    return rows[0];
}

const getAllBrand = async () => {
    let rows = await brandModel.getAllBrand();

    return rows;
}

const updateBrand = async (id, body) => {

    let checkBrand = await brandModel.getBrandByName(body.name);

    if (checkBrand.length > 0) {
        throw new Error('Brand already exists');
    }
    let checkId = await brandModel.getBrandById(id);
    if (checkId.length === 0) {
        throw new Error('Brand not found');
    }

    await brandModel.updateBrand(id, body);

    const rows = await brandModel.getBrandById(id);

    return rows[0];
}

const deleteBrand = async (id) => {
    let checkId = await brandModel.getBrandById(id);

    if (checkId.length === 0) {
        throw new Error('Brand not found');
    }

    let rows = await brandModel.deleteBrand(id);

    return rows;
}
module.exports = {
    createBrand,
    getAllBrand,
    updateBrand,
    deleteBrand
}