import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import db from 'knex';

db({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  },
});

// const register = require('./controllers/register');
import registerHandler from "./controllers/register.js";
// const signin = require('./controllers/signin');
import signinHandler from "./controllers/signin.js";
// const profile = require('./controllers/profile');
import profileHandler from "./controllers/profile.js";
// const image = require('./controllers/image');
import image from "./controllers/image.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.json('Success'));
app.post('/signin', (req, res) => signinHandler(req, res, db, bcrypt));
app.post('/register', (req, res) => registerHandler(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profileHandler(req, res, db));
app.put('/image', (req, res) => image.imageHandler(req, res, db));
app.post('/imageUrl', (req, res) => image.imageApiHandler(req, res));

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});