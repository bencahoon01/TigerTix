const jwt = require('jsonwebtoken');

// A secure secret key for JWT. This must match the one used in the user-authentication service.
// In a real application, this should be loaded from an environment variable.
const JWT_SECRET = 'your_super_secret_key_that_is_long_and_random';

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = decoded; // Attach user payload to the request
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
