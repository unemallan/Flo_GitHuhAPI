var express = require('express');
var path = require('path');
const github = require ('github-profile');
var routes = require('./routes/index');
 
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


const port_runing = 3000;

app.listen(port_runing);

console.log("Application running at: " + port_runing)