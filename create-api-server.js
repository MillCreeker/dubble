import express, { response, text } from 'express';
import jwt from 'jsonwebtoken';
import { API_PORT, SECRET } from './util/config.js';
import { checkCredentials } from './middleware/authenticate.js';
import { verifyToken } from './middleware/jwt-authorize.js';
import { DBConnection } from './util/db-connection.js';

const app = express();
app.use(express.json());

app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

const uriPrefix = '/api/';

// Login
/**
 * OUTPUT:
 *  accessToken
 */
app.post(uriPrefix + 'login', async (req, res) => {
    try{
        const user = await checkCredentials(req.body);
        if (!user) {
            res.status(404).send({ error: "user not found" })
        }
        else {
            const token = jwt.sign(user, SECRET, {
                expiresIn: 86400, // 24 hours
                issuer: 'localhost',
                audience: String(user.id)
            });
            res.status(200).send({ accessToken: token });
        }
    } catch(e){
        console.error(e);
}
});


// Users

// GET one where
/**
 * INPUT:
 *  id
 *  username
 * 
 * OUTPUT:
 *  user{}
 */
app.get(uriPrefix + 'getUser', verifyToken, async (req, res) => {
    try {
        const user = req.body;

        if( (typeof user.id == 'undefined' || user.id == null || user.id == '') &&
            (typeof user.username == 'undefined' || user.username == null || user.username == '') ){
            return res.status(400).send({ error: "no parameters specified" });
        }

        DBConnection.getUser({
            id: user.id,
            username: user.username
        })
        .then(r => {
            return res.status(200).send({ user: r[0] });
        })
        .catch(e => {
            return res.status(500).send({ error: e });
        });
    } catch (error) {
        return res.status(400).send({ error: error });
    }
});

// GET multiple (where)
/**
 * INPUT:
 *  id,
 *  username
 * 
 * OUTPUT:
 *  users[]
 */
app.get(uriPrefix + 'getUsers', verifyToken, (req, res) => {
    try {
        const user = req.body;

        DBConnection.getUsers({
            id: user.id,
            username: user.username
        })
        .then(r => {
            return res.status(200).send({ users: r });
        })
        .catch(e => {
            return res.status(500).send({ error: e });
        });
    } catch (error) {
        return res.status(400).send({ error: error });
    }
});

// POST new
/**
 * INPUT:
 *  username
 *  password
 * 
 * OUTPUT:
 *  id
 */
app.post(uriPrefix + 'addUser', verifyToken, async (req, res) => {
    try {
        const user = req.body;
        if( (typeof user.username == 'undefined' || user.username == null || user.username == '') ||
            (typeof user.password == 'undefined' || user.password == null || user.password == '') ){
            return res.status(400).send({ error: "not all parameters specified" });
        }

        DBConnection.addUser({
            username: user.username,
            password: user.password
        })
        .then(r => {
            return res.status(200).send({ id: r });
        })
        .catch(e => {
            return res.status(500).send({ error: e });
        });
    } catch (error) {
        return res.status(400).send({ error: error });
    }
});

// PUT change
/**
 * INPUT:
 *  id
 *  username
 *  password
 * 
 * OUTPUT:
 *  message
 */
app.put(uriPrefix + 'changeUser', verifyToken, (req, res) => {
    try {
        const user = req.body;
        if(typeof user.id == 'undefined' || user.id == null || user.id == ''){
            return res.status(400).send({ error: "not all required parameters specified" });
        }

        DBConnection.changeUser({
            id: user.id,
            username: user.username,
            password: user.password
        })
        .then(r => {
            return res.status(200).send({ message: "success" });
        })
        .catch(e => {
            return res.status(500).send({ error: e });
        });
    } catch (error) {
        return res.status(400).send({ error: error });
    }
});

// DELETE where
/**
 * INPUT:
 *  id
 * 
 * OUTPUT:
 *  message
 */
app.delete(uriPrefix + 'deleteUser', verifyToken, (req, res) => {
    try {
        const id = req.body.id;
        if(typeof id == 'undefined' || id == null || id == ''){
            return res.status(400).send({ error: "not all required parameters specified" });
        }

        DBConnection.deleteUser(id)
        .then(r => {
            return res.status(200).send({ message: "success" });
        })
        .catch(e => {
            return res.status(500).send({ error: e });
        });
    } catch (error) {
        return res.status(400).send({ error: error });
    }
});


// Texts

// GET text
/**
 * INPUT:
 *  id
 *  userId
 * 
 * OUTPUT:
 *  textItem
 */
app.get(uriPrefix + 'getText', verifyToken, (req, res) => {
    try {
        const textItem = req.body;
        if( (typeof textItem.id == 'undefined' || textItem.id == null || textItem.id == '') &&
            (typeof textItem.userId == 'undefined' || textItem.userId == null || textItem.userId == '')){
            return res.status(400).send({ error: "no required parameter specified" });
        }

        DBConnection.getTextItems({
            id: textItem.id,
            userId: textItem.userId
        })
        .then(r => {
            return res.status(200).send({ textItem: r[0] });
        })
        .catch(e => {
            return res.status(500).send({ error: e });
        });
    } catch (error) {
        return res.status(400).send({ error: error });
    }
});

// POST text
/**
 * INPUT:
 *  text
 *  userId
 * 
 * OUTPUT:
 *  id
 */
app.post(uriPrefix + 'addText', verifyToken, (req, res) => {
    try {
        const textItem = req.body;
        if( (typeof textItem.text == 'undefined' || textItem.text == null || textItem.text == '') ||
            (typeof textItem.userId == 'undefined' || textItem.userId == null || textItem.userId == '') ){
            return res.status(400).send({ error: "not all parameters specified" });
        }

        DBConnection.addTextItem({
            text: textItem.text,
            userId: textItem.userId
        })
        .then(r => {
            return res.status(200).send({ id: r });
        })
        .catch(e => {
            return res.status(500).send({ error: e });
        });
    } catch (error) {
        return res.status(400).send({ error: error });
    }
});

// PUT text
/**
 * INPUT:
 *  id
 *  text
 *  userId
 * 
 * OUTPUT:
 *  message
 */
app.put(uriPrefix + 'changeText', verifyToken, (req, res) => {
    try {
        const textItem = req.body;
        if(typeof textItem.id == 'undefined' || textItem.id == null || textItem.id == ''){
            return res.status(400).send({ error: "not all parameters specified" });
        }

        DBConnection.changeTextItem({
            id: textItem.id,
            text: textItem.text,
            userId: textItem.userId
        })
        .then(r => {
            return res.status(200).send({ message: "success" });
        })
        .catch(e => {
            return res.status(500).send({ error: e });
        });
    } catch (error) {
        return res.status(400).send({ error: error });
    }
});

// DELETE text
/**
 * INPUT:
 *  id
 * 
 * OUTPUT:
 *  message
 */
app.delete(uriPrefix + 'deleteText', verifyToken, (req, res) => {
    try {
        const id = req.body.id;
        if(typeof id == 'undefined' || id == null || id == ''){
            return res.status(400).send({ error: "not all parameters specified" });
        }

        DBConnection.deleteTextItem(id)
        .then(r => {
            return res.status(200).send({ message: "success" });
        })
        .catch(e => {
            return res.status(500).send({ error: e });
        });
    } catch (error) {
        return res.status(400).send({ error: error });
    }
});


// Listen
app.listen(
    API_PORT,
    () => console.log(`API-server is up and running on http://localhost:${API_PORT}`)
)