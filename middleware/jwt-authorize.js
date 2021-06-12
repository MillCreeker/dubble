import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config.js'

export async function verifyToken(req, res, next) {
  let token = req.headers["x-access-token"];
  //let token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    next();
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      next();
    }
    req.user = user;
    next();
  });
}
