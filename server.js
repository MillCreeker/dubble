'use strict';

import express from 'express';
import cookieParser from 'cookie-parser';
import { WEBSOCKET_SERVER_PORT } from './util/config.js';
import { checkCredentials } from './middleware/authenticate.js';
import { sessionAuthorize } from './middleware/session-authorize.js';
import { v4 as uuidv4 } from 'uuid';
import { DBConnection } from './middleware/db-connection.js';
import { Session } from './models/Session.js';
import bodyParser from 'body-parser'
const app = express();

// provide static data (index.html) on base route
app.use('/', express.static('public/html'));

app.use(cookieParser());
app.use(express.urlencoded());

// login
app.post('/login', async (req, res) => {
  console.log(req.body);
  if (req.body.username && req.body.password) {
    const user = checkCredentials(req.body);

    if (user) {
      const session_id = uuidv4();
      var dbCon = new DBConnection();
      dbCon.addSession(new Session(session_id, user.id));
      dbCon.close();

      return res.cookie('session_id', session_id, {httpOnly: true, expires: 0, sameSite: true}).json({
        user,
      });
    }
  }
  res.status(401).json({ error: 'invalid credentials' });
});

app.listen(WEBSOCKET_SERVER_PORT, () => {
  console.log(`Server is up and running on http://localhost:${WEBSOCKET_SERVER_PORT}`);
});

