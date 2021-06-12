'use strict';

import express from 'express';
import { WEBSOCKET_SERVER_PORT, SECRET, DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USER, SESSION_LIFETIME, SESSION_NAME } from './util/config.js';
import { checkCredentials } from './middleware/authenticate.js';
import { verifyToken } from './middleware/jwt-authorize.js';
import { registerUser } from './middleware/register.js';
import store from 'express-mysql-session';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import { sessionAuth, redirectToHomeIfAuth } from './middleware/session-authorize.js';

const MySQLStore = store(session);
const app = express();

const conOptions = {
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: 'dubble',
  multipleStatements: true
}

const sessionStore = new MySQLStore(conOptions);

app.use(express.urlencoded({extended: true})); //only for webserver
//app.use(express.json());  //for api server
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

/*app.use(function(req, res, next) { //api server
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});*/

app.set('view engine', 'pug');

app.set('views','./views');

app.get('/', sessionAuth, async (req, res) => {
  return res.render('home');
});

app.get('/login', redirectToHomeIfAuth, async (req, res) => {
  return res.render('login');
});

// login
app.post('/login', redirectToHomeIfAuth, async (req, res) => {
  if (req.body.username && req.body.password) {
    const user = await checkCredentials(req.body);
    if (user) {
      req.session.userId = user.id;
      /*var token = jwt.sign(user, SECRET, {  //use this for api login
        expiresIn: 86400 // 24 hours
      });
      res.json({
        accessToken: token
      });*/
      return res.redirect('/');
    }
  }
  return res.redirect('./login');
});

app.get('/register', redirectToHomeIfAuth, async (req, res) => {
  return res.render('register');
});

app.post('/register', redirectToHomeIfAuth, registerUser, async (req, res) => {
  return res.redirect('./')
});

app.post('/logout', async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('./');
    }
    res.clearCookie(SESSION_NAME);
    return res.redirect('./login');
  });
});

app.listen(WEBSOCKET_SERVER_PORT, () => {
  console.log(`Server is up and running on http://localhost:${WEBSOCKET_SERVER_PORT}`);
});

