//import modules
var express = require('express');
var router = express.Router();

/* GET admin page. */
router.get('/:id', function(req, res, next){
    res.send("schueler");
});



module.exports = router; 

