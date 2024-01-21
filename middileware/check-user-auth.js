const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Sorry! Not a Authorized.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'a_secret_key_of_mission_twentty_twentty_three_generate_by_md_iqbal_in_2019_at_dhaka');
        req.userData = {
            phoneNo: decodedToken.phoneNo,
            email: decodedToken.email,
            userId: decodedToken.userId
        };
        next();
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Authorization Error!');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;

}
