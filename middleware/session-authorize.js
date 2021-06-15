/**
 * Middleware to check if client is logged into a session.
 * Redirects to login if not.
 */
export async function sessionAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        return res.redirect('./login');
    }
}

/**
 * Middleware to check if client is logged into a session.
 * Redirects root if yes.
 */
export async function redirectToHomeIfAuth(req, res, next) {
    if(req.session.userId) {
        return res.redirect('./')
    }
    next();
}