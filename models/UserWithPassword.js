/**
 * Model for a user in the application.
 * If no password is needed, use User.
 */
export class UserWithPassword {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }
}