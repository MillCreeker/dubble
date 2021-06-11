import { DBConnection } from './db-connection.js';

export async function sessionAuthorize(req, res, next) {
  if (req.cookies) { // first, check if cookies are available
    var dbCon = new DBConnection();
    const activeSession = await dbCon.getSessions().find(
      // search for active sessions (we will add new sessions in a moment) and compare it with cookie 'session_id'
      (session) => session.id === req.cookies.session_id
    );
    dbCon.close();
    // when we found a active session, we can continoue
    if (activeSession) {
      return next();
    }
  }
  // when no cookies or active session found, we return a 401 NOT AUTHORIZED back to the client
  return res.status(401).json({ error: 'not authorized' });
}
