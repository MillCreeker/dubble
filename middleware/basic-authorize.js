import { DBConnection } from './db-connection.js';
import bcrypt from 'bcrypt';

function isValidUser(username, password) {
  const dbCon = new DBConnection();
  const user = await dbCon.getUsers().find(u => u.username === username);
  dbCon.close();
  // instead of simple compare the plain passwords, compare the hashed with the help of bcrypt
  if (user) {
    return await bcrypt.compare(password, user.password);
  }

  return false;

  }
  

export async function basicAuth(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Basic ')) {
      return res.status(401).json({error: 'no or invalid authorization'})
    }
  
    const base64 = req.headers.authorization.split(' ')[1];
  
    const user_pass = Buffer.from(base64, 'base64').toString('utf8');
  
    const [username, password] = user_pass.split(':');

    if (!(await isValidUser(username, password))) {
      return res.status(401).json({error: 'invalid credentials'});
    }
  
  
    next();
  }
  