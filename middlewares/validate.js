const {sendResponse} = require('../utils/responseHelper');

const validate = (schema) => (req, res, next) =>{
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