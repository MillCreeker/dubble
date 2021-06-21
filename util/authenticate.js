import { DBConnection } from './db-connection.js';
import bcrypt from 'bcrypt';

/**
 * Helper-function to check if credentials match a user in the database
 * @param {{username: string, password: string}} credentials get from request
 * @returns {{id: number, username: string, fullname: string} | undefined} user object (without password) when a valid user was found
 */
export async function checkCredentials(credentials) {
    return await DBConnection.getUsersWithPassword().then(function(users) {

        // check if user with given username exists
        const user = users.find((u) => u.username === credentials.username);
        // when user exists, check if given password is correct
        return new Promise((resolve, reject) => {
            if (user) {
                // compare password with encrypted password
                bcrypt.compare(credentials.password, user.password).then(function(isAuthenticated) {
                    if (isAuthenticated) {
                        const { password, ...userWithoutPassword } = user; // 'remove' password on object that gets returned
                        resolve(userWithoutPassword);
                    } else {
                        resolve(undefined);
                    }
                });
            } else {
                resolve(undefined);
            }
        });
    }).then((user) => {
        return user;
    }).catch(function(error) {
        return undefined;
    });
}
