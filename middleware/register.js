import { DBConnection } from './db-connection.js';
import bcrypt from 'bcrypt';
import { UserWithPassword } from '../models/UserWithPassword.js';

export async function registerUser(req, res, next) {
    if(req.body.username && req.body.password) {
        var newUser = new UserWithPassword(null, req.body.username, req.body.password);
        return await DBConnection.getUsers().then(function(users) {
            const alreadyExistingUser = users.find((u) => u.username === newUser.username);

            if (alreadyExistingUser) {
                return res.redirect('.register');
            }

            return bcrypt.hash(newUser.password, 10)
        }).then((hash) => {
            newUser.password = hash
            return DBConnection.addUser(newUser);
        }).then(function(userId) {
            req.session.userId = userId;
            /*newUser.id = userId
            const { password, ...userWithoutPassword} = newUser;
            var token = jwt.sign(userWithoutPassword, SECRET, { //use this for api register
                expiresIn: 86400 // 24 hours
            });
            return res.status(200).json({
                accessToken: token
            });*/
            next();
        });
    }
    return res.redirect('.register');
  }