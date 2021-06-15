/**
 * Model for a Text item that a user can write to.
 */
export class TextItem {
    constructor(id, text, user_id) {
        this.id = id;
        this.text = text;
        this.user_id = user_id;
    }
}