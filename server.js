/**
 * Webserver.
 * Handles all requests to the dubble webserver.
 * Offers different endpoints and sessions handling aswell as authentication and authorization.
 */
'use strict';

import express from 'express';
import { WEBSOCKET_SERVER_PORT, SECRET, DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USER, SESSION_LIFETIME, SESSION_NAME } from './util/config.js';
import { checkCredentials } from './middleware/authenticate.js';
import { verifyToken } from './middleware/jwt-authorize.js';
import { registerUser } from './middleware/register.js';
import store from 'express-mysql-session';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import ws from 'ws';
import { sessionAuth, redirectToHomeIfAuth } from './middleware/session-authorize.js';

const MySQLStore = store(session);
const app = express();

// let server listen to port configured in .env
const server = app.listen(WEBSOCKET_SERVER_PORT, () => {
  console.log(`Server is up and running on http://localhost:${WEBSOCKET_SERVER_PORT}`);
});

// database configuration. Configure it in the .env file.
const conOptions = {
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: 'dubble',
  multipleStatements: true
}

// create a database store for sessions
const sessionStore = new MySQLStore(conOptions);

// actvate url encoding for the server
app.use(express.urlencoded({ extended: true }));
// setup session handling
app.use('/', express.static('public'))



app.use(session({
  name: SESSION_NAME,
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: SESSION_LIFETIME,
    sameSite: true,
    secure: false,
  }
}));

const wss = new ws.Server({ server });
wss.on('message', function incoming(data) {
  wss.clients.forEach(function each(client) {
    if (client != ws && client.readyState == WebSocket.OPEN) {
      client.send(data);
    }
  })
})

// setup view engine as "pug"
app.set('view engine', 'pug');

// set directory for views
app.set('views', './views');

/**
 * Server endpoint.
 * 
 * Route: "/"
 * Method: GET
 * 
 * Description:
 * Renders home view if authorized.
 * Redirects to "/login" if not. 
 */
app.get('/', sessionAuth, async (req, res) => {
  return res.render('home');
});

/**
 * Server endpoint.
 * 
 * Route: "/login"
 * Method: GET
 * 
 * Description:
 * Redirects to "/" if already logged in.
 * Renders login view if not.
 * 
 */
app.get('/login', redirectToHomeIfAuth, async (req, res) => {
  return res.render('login');
});

/**
 * Server endpoint.
 * 
 * Route: "/login"
 * Method: POST
 * Needed form parameters: "username", "password"
 * 
 * Description:
 * Redirects to "/" if already logged in.
 * Checks if user credentials match user in database and creates session for that user.
 * Redirects to "/login" if login fails.
 */
app.post('/login', redirectToHomeIfAuth, async (req, res) => {

  if (req.body.username && req.body.password) {
    const user = await checkCredentials(req.body);
    if (user) {
      const token = jwt.sign(user, SECRET, {
        expiresIn: 86400, // 24 hours
        issuer: 'localhost',
        audience: String(user.id)
      });
      req.session.token = token;
      req.session.userId = user.id;
      return res.redirect('/');
    }
  }
  return res.redirect('./login');
});

/**
 * Server endpoint.
 * 
 * Route: "/register"
 * Method: GET
 * Needed form parameters: "username", "password"
 * 
 * Description:
 * Redirects to "/" if already logged in.
 * Renders register view.
 */
app.get('/register', redirectToHomeIfAuth, async (req, res) => {
  return res.render('register');
});

/**
 * Server endpoint.
 * 
 * Route: "/register"
 * Method: POST
 * 
 * Description:
 * Redirects to "/" if already logged in.
 * Registers new user if it does not already exist and creates session.
 * Redirects to "/register" if register fails.
 */
app.post('/register', redirectToHomeIfAuth, registerUser, async (req, res) => {
  return res.redirect('./')
});

/**
 * Server endpoint.
 * 
 * Route: "/logout"
 * Method: POST
 * 
 * Description:
 * Redirects to "/" if not logged in.
 * Destroys the user session and redirects to "/login"
 */
app.post('/logout', async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('./');
    }
    res.clearCookie(SESSION_NAME);
    return res.redirect('./login');
  });
});

export default app