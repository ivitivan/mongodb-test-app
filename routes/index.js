var express = require('express');
var router = express.Router();
var Entry = require('../models/entry.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.post('/', function(req, res, next) {
	console.log(req.body);
	var user = new Entry();
	user.text = req.body.entry;
	user.insert_date = new Date();
	user.save();
	res.render('index', { title: 'Express' });
});

router.get('/entries', function(req, res, next) {
	Entry.find(function(err, entries) {
		if (err)
			return res.status(500).send(err);
		res.send(entries);
	});
});

router.get('/entry/:id', function(req, res, next) {
	Entry.findOne({'_id': req.params.id}, function(err, entry) {
		if (err)
			return res.status(500).send(err);
		res.send(entry);
	})
});

router.delete('/entry/:id', function(req, res, next) {
	Entry.findOne({'_id': req.params.id}).remove( function(err, entry) {
		if (err)
			return res.status(500).send(err);
		res.send(entry);
	})
});

module.exports = router;
