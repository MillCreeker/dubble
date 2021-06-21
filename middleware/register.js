import { DBConnection } from '../util/db-connection.js';
import bcrypt from 'bcrypt';
import { UserWithPassword } from '../models/UserWithPassword.js';

/**
 * Middleware for registering a user. Takes username and password out of the request
 * and creates a new user if it does not already exist.
 */
export async function registerUser(req, res, next) {
    // does the request have username and password
    if(req.body.username && req.body.password) {
        var newUser = new UserWithPassword(null, req.body.username, req.body.password);
        // get users from database
        return await DBConnection.getUsers().then(function(users) {
            // check if user with the same username exists. If yes, then redirect.
            const alreadyExistingUser = users.find((u) => u.username === newUser.username);

            if (alreadyExistingUser) {
                return res.redirect('./register');
            }

            return bcrypt.hash(newUser.password, 10); // encrypt password
        }).then((hash) => {
            newUser.password = hash
            return DBConnection.addUser(newUser); // add user to database
        }).then(function(userId) {
            next();
        });
    }
    return res.redirect('./login');
}