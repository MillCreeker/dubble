import express, { response, text } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { API_PORT, SECRET } from './util/config.js';
import { checkCredentials } from './middleware/authenticate.js';
import { verifyToken } from './middleware/jwt-authorize.js';
import { DBConnection } from './util/db-connection.js';

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

//setting the cors options to allow all sources
var corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    credentials:true
}
//added cors library to allow cross domain interactions
app.use(cors(corsOptions))

const uriPrefix = '/api/';

/**
 * API endpoint.
 * 
 * Route: "/api/login"
 * Method: POST
 * Needed parameters: "username", "password"
 * Returned parameter: "accessToken"
 * 
 * Description:
 * NOT PART OF THE ACTUAL API
 * Returnes access-token if authorized.
 */
app.post(uriPrefix + 'login', async (req, res) => {
    try {
        const user = await checkCredentials({
            username: req.body.username,
            password: req.body.password
        });
        console.log(user);
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
    } catch (e) {
        return res.status(400).send({ error: error });
    }
});


// Users

/**
 * API endpoint.
 * 
 * Route: "/api/user"
 * Method: GET
 * Returned parameter: "user"
 * 
 * Description:
 * Returns the user's information.
 */
app.get(uriPrefix + 'user', verifyToken, async (req, res) => {
    try {
        const id = req.user.id;

        DBConnection.getUser({
            id: id
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
 * Route: "/api/user"
 * Method: DELETE
 * Needed form parameter: "id"
 * Returned parameter: "message"
 * 
 * Description:
 * Deletes the user.
 */
app.delete(uriPrefix + 'user', verifyToken, (req, res) => {
    try {
        const id = req.user.id;

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
 * Route: "api/user/text"
 * Method: GET
 * Returned parameter: "textItem"
 * 
 * Description:
 * Returnes the user's text.
 */
app.get(uriPrefix + 'user/text', verifyToken, (req, res) => {
    try {
        const userId = req.user.id;

        DBConnection.getTextItem({
            userId: userId
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
 * Route: "api/user/text"
 * Method: POST
 * Needed parameter: "content"
 * Returned parameter: "id"
 * 
 * Description:
 * Adds a text from the user.
 */
app.post(uriPrefix + 'user/text', verifyToken, (req, res) => {
    try {

        const userId = req.user.id;
        const content = req.body.content;

        if (typeof content == 'undefined' || content == null || content == '') {
            return res.status(400).send({ error: "not all parameters specified" });
        }

        DBConnection.addTextItem({
            text: content,
            userId: userId
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
 * Route: "api/user/text"
 * Method: PUT
 * Needed parameter: "content"
 * Returned parameters: "message"
 * 
 * Description:
 * Changes the user's text.
 */
app.put(uriPrefix + 'user/text', verifyToken, (req, res) => {
    try {
        const userId = req.user.id;
        const content = req.body.content;

        DBConnection.changeTextItem({
            text: content,
            userId: userId
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
 * Route: "api/user/text"
 * Method: DELETE
 * Returned parameters: "message"
 * 
 * Description:
 * Deletes the user's text.
 */
app.delete(uriPrefix + 'user/text', verifyToken, (req, res) => {
    try {
        const userId = req.user.id;

        DBConnection.deleteTextItem(userId)
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

export default app;