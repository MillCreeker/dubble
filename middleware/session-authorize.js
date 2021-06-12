import { DBConnection } from './db-connection.js'

export async function sessionAuth(req, res, next) {
    if (req.session.userId) {
        next()
    } else {
        return res.redirect('./login');
    }
}

export async function redirectToHomeIfAuth(req, res, next) {
    if(req.session.userId) {
        return res.redirect('./')
    }
}