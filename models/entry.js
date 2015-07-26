var mongoose = require('mongoose');

module.exports = mongoose.model('Entry', {
	/** id: {type: Number, min: 1}, */
	text: String,
	insert_date: Date
});
