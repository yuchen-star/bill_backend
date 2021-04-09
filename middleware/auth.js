const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('拒绝访问。没有提供令牌。');

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('令牌无效！');
    }
}