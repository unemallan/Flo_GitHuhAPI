const { default: axios } = require("axios");
var express = require('express');
var path = require('path');
const github = require ('github-profile');
var request = require('request')
var routes = require('./routes/index');
const { Client } = require("@notionhq/client")
 
// Create a new Express application.
var app = express();
const router = express.Router();
 const db = require('./db/mongoose');

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
 
// Use application-level middleware for common functionality, including logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/views')));
 

app.use('/', routes);
 
app.post('/getinfo', (req,res) =>{
    github(req.body.email).then((profile)=>{
        console.log(profile);
        res.render('index', {profile:profile});
    });
});

const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_AUTH_URL,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REDIRECT_URI
} = process.env;

app.get("/auth", (req, res) => {
    res.redirect(GITHUB_AUTH_URL);
});

app.get("/callback", (req, res) => {
    axios.post("https://github.com/login/oauth/access_token", {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: req.query.code
    }, {
        headers: {
            Accept: "application/json"
        }
    }).then((result) => {
        console.log(result.data.access_token)
        res.send("you are authorized " + result.data.access_token)
    }).catch((err) => {
        console.log(err);
    })
});

// encode in base 64
const encoded = Buffer.from(`${OAUTH_CLIENT_ID}:${OAUTH_CLIENT_SECRET}`).toString("base64");

app.get("/notion", (req, res) => {
    axios.post("https://api.notion.com/v1/oauth/token",
    {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${encoded}`
        }
    }).then((result) => {
        console.log(result.data.access_token)
        res.send("you are authorized " + result.data.your-temporary-code)
    }).catch((err) => {
        console.log(err);
    })
});

const port_runing = process.env.PORT || 8080;

app.listen(port_runing);

console.log("Application running at: " + port_runing)