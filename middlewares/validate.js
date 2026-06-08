const {sendResponse} = require('../utils/responeHelper');

const validate = (schema) => (req, res, next) =>{
    if(!schema || typeof schema.validate !== 'function'){
        return sendResponse(res, 500, false, 'Validation schema is missing or invalid');
    }

    if(req.body && req.body.password_hash && !req.body.password){
        req.body.password = req.body.password_hash;
    }

    const {error, value} = schema.validate(req.body,{
        abortEarly: false,
        stripUnknown: true
    });

    if(error){
        let errMsg = error.details.map((d) => d.message).join(', ');
        return sendResponse(res, 400, false, errMsg);
    }

    req.validateBody = value;
    next();
};

module.exports = validate;