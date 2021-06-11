import { DBConnection } from './db-connection.js';
import bcrypt from 'bcrypt';

/**
 * Helper-function to check credentials
 * @param {{username: string, password: string}} credentials get from request
 * @returns {{id: number, username: string, fullname: string} | undefined} user object (without password) when valid user was found
 */
export async function checkCredentials(credentials) {
    var dbCon = new DBConnection();
    // check if user with given username exists
    const user = await dbCon.getUsers().find((u) => u.username === credentials.username);
    dbCon.close();

    // when user exists, check if given password is correct
    if (user && await bcrypt.compare(credentials.password, user.password)) {
        const { password, ...userWithoutPassword } = user; // 'remove' password on object that will returned
        return userWithoutPassword;
    }
    return undefined;
}
