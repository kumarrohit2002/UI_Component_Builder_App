const jwt=require('jsonwebtoken');
const { handleGenericAPIError } = require('../utils');

const authenticateToken=async(req,res,next)=>{
    try {
        const token = req.cookies?.auth ;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' ,isSussess:false,data:{}});
        }

        const decodedData=await jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedData) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decodedData;
        next();
        
    } catch (error) {
        handleGenericAPIError('authenticateToken', req, res, error);
    }
}

module.exports = {
    authenticateToken
}