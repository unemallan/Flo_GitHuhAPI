const { default: axios } = require("axios");
var express = require('express');
var path = require('path');
const github = require ('github-profile');
var request = require('request')
var routes = require('./routes/index');
const { Client } = require("@notionhq/client")
 
// Create a new Express application.
var app = express();
 
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

const gitClientId = process.env.GITHUB_CLIENT_ID;
const gitClientSecret = process.env.GITHUB_CLIENT_SECRET;
const gitAuthURI = process.env.GITHUB_AUTH_URL

const gitURIEncoded = Buffer.from(`${gitAuthURI}`).toString("base64");
app.get("/auth", (req, res) => {
    res.redirect(gitAuthURI);
});

app.get("/callback", (req, res) => {
    axios.post("https://github.com/login/oauth/access_token", {
        client_id: gitClientId,
        client_secret: gitClientSecret,
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


const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const redirectUri = process.env.NOTION_AUTH_URL;

// encode in base 64
const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
const notionURIEncoded = Buffer.from(`${redirectUri}`).toString("base64");

app.get("/notionAuth", (req, res) => {
    res.redirect(redirectUri);
});


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

const port_runing = 3000;

app.listen(port_runing);

console.log("Application running at: " + port_runing)