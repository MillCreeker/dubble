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

/**
 * API endpoint.
 * 
 * Route: "/api/login"
 * Method: POST
 * Returned parameter: "accessToken"
 * 
 * Description:
 * Returnes access-token if authorized.
 */
app.post(uriPrefix + 'login', async (req, res) => {
    try{
        const user = await checkCredentials(req.body);
        if (!user) {
            return res.status(404).send({ error: "user not found" })
        }
        else {
            const token = jwt.sign(user, SECRET, {
                expiresIn: 86400, // 24 hours
                issuer: 'localhost',
                audience: String(user.id)
            });
            return res.status(200).send({ accessToken: token });
        }
    } catch(e){
        return res.status(400).send({ error: error });
}
});


// Users

/**
 * API endpoint.
 * 
 * Route: "/api/getUser"
 * Method: GET
 * Needed form parameters: "id", "username" (only one is required)
 * Returned parameter: "user"
 * 
 * Description:
 * Returns one matching user.
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

/**
 * API endpoint.
 * 
 * Route: "/api/getUsers"
 * Method: GET
 * Optional form parameters: "id", "username"
 * Returned parameter: "users"
 * 
 * Description:
 * Returns all matching users.
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

/**
 * API endpoint.
 * 
 * Route: "/api/addUser"
 * Method: POST
 * Needed form parameters: "username", "password"
 * Returned parameter: "id"
 * 
 * Description:
 * Adds a user.
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

/**
 * API endpoint.
 * 
 * Route: "/api/changeUser"
 * Method: PUT
 * Needed form parameter: "id"
 * Returned parameter: "message"
 * 
 * Description:
 * Changes an existing user.
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

/**
 * API endpoint.
 * 
 * Route: "/api/deleteUser"
 * Method: DELETE
 * Needed form parameter: "id"
 * Returned parameter: "message"
 * 
 * Description:
 * Deletes an user.
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

/**
 * API endpoint.
 * 
 * Route: "/api/getText"
 * Method: GET
 * Needed form parameters: "id", "userId" (only one is required)
 * Returned parameter: "textItem"
 * 
 * Description:
 * Returnes a matching text.
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

/**
 * API endpoint.
 * 
 * Route: "/api/addText"
 * Method: POST
 * Needed form parameters: "text", "userId"
 * Returned parameter: "id"
 * 
 * Description:
 * Adds a text.
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

/**
 * API endpoint.
 * 
 * Route: "/api/changeText"
 * Method: PUT
 * Needed form parameters: "id", "text", "userId"
 * Returned parameters: "message"
 * 
 * Description:
 * Changes an existing text.
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

/**
 * API endpoint.
 * 
 * Route: "/api/deleteText"
 * Method: DELETE
 * Needed form parameter: "id"
 * Returned parameters: "message"
 * 
 * Description:
 * Deletes a text.
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
    () => console.log(`API-API is up and running on http://localhost:${API_PORT}`)
)