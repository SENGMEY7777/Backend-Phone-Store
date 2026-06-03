const userModel = require('../../models/users/userModel');
const jwtConfig = require('../../configs/jwt');
const jwt = require('jsonwebtoken');
const mailService = require('../../services/users/maillerService');
const bcrypt = require('bcrypt');
const crypto = require('crypto');



const getAllUser = async () => {
    let rows = await userModel.getAllUser();

    return rows;
}
const register = async (body) => {
    if(!body.name || !body.email || !body.password_hash) {
        throw new Error('Name, email and password_hash are required');
    }

    let checkEmail = await userModel.findEmail(body.email);
    if(checkEmail.length > 0) {
        throw new Error('Email already exists');
    }

    const hashPassword = await bcrypt.hash(body.password_hash, 10);
    const verification_token = crypto.randomBytes(32).toString('hex');
    const verification_expires = new Date(Date.now() + 5 * 60 * 60 * 1000);

    const create = await userModel.register({
        full_name: body.name,
        email: body.email,
        password_hash: hashPassword,
        verification_token,
        verification_expires 
    });
    await mailService.sendVerificationEmail(body.email, verification_token);
    const rows = await userModel.getUserById(create);
    return rows[0];
}

const login = async (body) => {
    if(!body.email || !body.password_hash) {
        throw new Error('Email and password_hash are required');
    }

    let checkEmail = await userModel.findEmail(body.email);
    if(checkEmail.length === 0) {
        throw new Error('Email and password invalid');
    }

    if(!checkEmail[0].password_hash) {
        throw new Error('User password is missing');
    }
    
    let hashPassword = await bcrypt.compare(body.password_hash, checkEmail[0].password_hash);
    if(!hashPassword) {
        throw new Error('Email and password invalid');
    }

    let token = jwt.sign(
        { id: checkEmail[0].id, email: checkEmail[0].email},
        jwtConfig.secret,
        {expiresIn: jwtConfig.expiresIn }
    );

    await userModel.addToken(token, checkEmail[0].id);
    const rows = await userModel.getUserById(checkEmail[0].id);
    return rows;
}


const verifyEmail = async (token) => {
    if (!token) {
        throw new Error('Verification token is required');
    }

    const verificationToken = token.trim();

    let userInfo = await userModel.verifyEmail(verificationToken);
    if(userInfo.length === 0) {
        throw new Error('Verification token is invalid');
    }

    if(!userInfo[0].verification_expires || new Date(userInfo[0].verification_expires) < new Date()) {
        throw new Error('Verification token has expired');
    }

    await userModel.markEmailAsVerified(userInfo[0].id);

    let result = await userModel.findEmail(userInfo[0].email);

    return result[0];

}

const resendVerificationEmail = async (body) => {
    if(!body.email) {
        throw new Error('Email is required');
    }

    let userInfo = await userModel.findEmail(body.email);
    if(userInfo.length === 0) {
        throw new Error('Email not found');
    }

    if(userInfo[0].is_verified) {
        throw new Error('Email is already verified');
    }

    const verification_token = crypto.randomBytes(32).toString('hex');
    const verification_expires = new Date(Date.now() + 5 * 60 * 60 * 1000);

    await userModel.updateVerificationToken(userInfo[0].id, verification_token, verification_expires);
    await mailService.sendVerificationEmail(userInfo[0].email, verification_token);

    return {
        email: userInfo[0].email,
        verification_expires
    };
}

const forgotPassword = async (body) => {
    if(!body.email) {
        throw new Error('Email is required');
    }

    let userInfo = await userModel.findEmail(body.email);
    if(userInfo.length === 0) {
        throw new Error('Email not found');
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const password_reset_expires = new Date(Date.now() + 10 * 60 * 1000);

    await userModel.updatePasswordResetOtp(userInfo[0].id, otp, password_reset_expires);
    await mailService.sendPasswordResetOtp(userInfo[0].email, otp);

    return {
        email: userInfo[0].email,
        password_reset_expires
    };
}

const verifyPasswordResetOtp = async (body) => {
    if(!body.email || !body.otp) {
        throw new Error('Email and otp are required');
    }

    let userInfo = await userModel.findEmail(body.email);
    if(userInfo.length === 0) {
        throw new Error('Email not found');
    }

    if(!userInfo[0].password_reset_otp || userInfo[0].password_reset_otp !== body.otp.toString()) {
        throw new Error('OTP is invalid');
    }

    if(!userInfo[0].password_reset_expires || new Date(userInfo[0].password_reset_expires) < new Date()) {
        await userModel.clearPasswordResetOtp(userInfo[0].id);
        throw new Error('OTP has expired');
    }

    return {
        email: userInfo[0].email,
        otp_verified: true
    };
}

const resetPassword = async (body) => {
    if(!body.email || !body.otp || !body.password_hash) {
        throw new Error('Email, otp and password_hash are required');
    }

    await verifyPasswordResetOtp(body);

    let userInfo = await userModel.findEmail(body.email);
    const hashPassword = await bcrypt.hash(body.password_hash, 10);

    await userModel.updatePassword(userInfo[0].id, hashPassword);

    return {
        email: userInfo[0].email
    };
}

const logout = async (id) => {
    let result = await userModel.deleteToken(id);

    return result[0];
}

module.exports = {
    getAllUser,
    register,
    login,
    logout,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    verifyPasswordResetOtp,
    resetPassword
}
