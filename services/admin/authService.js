const userModel = require('../../models/users/userModel');
const jwtConfig = require('../../configs/jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const login = async (body) => {
    if(!body.email || !body.password_hash) {
        throw new Error('Email and password_hash are required');
    }

    let userInfo = await userModel.findEmail(body.email);
    if(userInfo.length === 0) {
        throw new Error('Email and password invalid');
    }

    if(userInfo[0].role !== 'admin') {
        throw new Error('Access denied. Admin only');
    }

    let hashPassword = await bcrypt.compare(body.password_hash, userInfo[0].password_hash);
    if(!hashPassword) {
        throw new Error('Email and password invalid');
    }

    let token = jwt.sign(
        { id: userInfo[0].id, email: userInfo[0].email, role: userInfo[0].role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );

    await userModel.addToken(token, userInfo[0].id);

    return {
        id: userInfo[0].id,
        full_name: userInfo[0].full_name,
        email: userInfo[0].email,
        role: userInfo[0].role,
        token
    };
}

const logout = async (adminId) => {
    if(!adminId) {
        throw new Error('Admin ID is required');
    }

    await userModel.deleteToken(adminId);

    return {
        message: 'Logout successfully'
    };
}

module.exports = {
    login,
    logout
}
