/**
 * Model for a user in the application.
 * Stores no password for safety reasons.
 */
export class User {
    constructor(id, username) {
        this.id = id;
        this.username = username;
    }
}