var express =   require("express");
var router = express.Router();
const path = require('path');

// load index page 
router.get('/',function(req, res){
  res.render('index', {profile:''});
});

module.exports = router;