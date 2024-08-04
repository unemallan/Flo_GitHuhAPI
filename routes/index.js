var express =   require("express");
var router = express.Router();

// load index page 
router.get('/',function(req, res){
  res.render('index', {profile:''});
});

module.exports = router;