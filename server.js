require('dotenv').config();

const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const methodOverride    = require('method-override');
const session           = require('express-session');
const PORT              = process.env.PORT;

require('./db/db')

const userController    = require('./controllers/users');
const eventController   = require('./controllers/events');
const authController    = require('./controllers/authControllers')

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: '8575ufjdjclw98',
    resave: false,
    saveUninitialized: false
}));

app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.use('/users', userController);
app.use('/events', eventController);
app.use('/auth', authController);

app.get("*", (req, res) => {
    res.send('page not found')
})
app.use('/assets', express.static('assets'))

app.listen(PORT, () => {
    console.log('listening...on port ', PORT);
})