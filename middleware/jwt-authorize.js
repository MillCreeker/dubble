import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config.js'
/**
 * Middleware for verifying JSON web tokens. Checks if a JWT is verified and stores the
 * user in a request variable
 */
export async function verifyToken(req, res, next) {
    let token = req.headers["x-access-token"];

    if (typeof token == 'undefined' || token == null) {
        next();
    } else {
        jwt.verify(token, SECRET, (err, user) => {
            if (err) {
            next();
            }
            req.user = user;
            next();
        });
    }
}
