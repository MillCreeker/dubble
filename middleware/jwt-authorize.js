import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config.js'
/**
 * Middleware for verifying JSON web tokens. Checks if a JWT is verified and stores the
 * user in a request variable
 */
export async function verifyToken(req, res, next) {
    let token = req.headers["x-access-token"];

    if (typeof token == 'undefined' || token == null) {
        return res.status(400).send({ error: "no access-token provided" });
    } else {
        jwt.verify(token, SECRET, (err, user) => {
            if (err) {
                return res.status(403).send({ error: "unauthorized access denied" });
            }
            req.user = user;
            next();
        });
    }
}
