(function() {
	'use strict';

	// Entry adder
	function EntryAdder() {
		this.dom = $('.entry-adder');
		this.data = this.dom.serializeArray();
		this.listen();
	}

	// Makes a post request 
	EntryAdder.prototype.post = function(cb) {
		var entryAdder = this;
		// Using the core $.ajax() method
		$.ajax({
			url: "/",
			data: entryAdder.getData(),
			type: "POST",
			success: function( json ) {
				entryAdder.dom.children('.input').val('');
				cb(null, json);
			},
			error: function( xhr, status, errorThrown ) {
				cb(errorThrown);
			}
		});
	}

	// Asks for the form data
	EntryAdder.prototype.getData = function() {
		return this.dom.serializeArray();
	}

	// Starts listening to the submit event
	EntryAdder.prototype.listen = function() {
		var entryAdder = this;
		this.dom.on('submit', function(event) {
			entryAdder.post(function(err, json) {
				if (err)
					return $('body').append('<div>Something went wrong</div>');
				var entries = new Entries();
				entries.refresh();
			});
			event.preventDefault();
		});
	}


	// Little helper
	function JUtil() {}

	// Creates jQuery object
	JUtil.prototype.el = function(block, tag) {
		var tag = tag || 'div';
		var result = $('<'+ tag + '></' + tag + '>');
		if (Array.isArray(block)) {
			block.forEach(function(blck) {
				result.addClass(blck);
			});
		} else {
			result.addClass(block);
		}
		return result;
	}


	// Entries
	function Entries() {
		this.dom = $('.entries').empty();
		this.listen();
	}

	// Asks for data
	Entries.prototype.getData = function(cb) {
		$.ajax({
			url: '/entries',
			type: "GET",
			dataType : "json",
			success: function( json ) {
				cb(null, json);
			},
			error: function( xhr, status, errorThrown ) {
				cb(errorThrown);
			}
		});
	}

	// Refreshes entries
	Entries.prototype.refresh = function() {
		var entries = this;
		entries.dom.empty();
		this.getData(function(err, json) {
			json.forEach(function(entry) {
				var ju = new JUtil();
				var entryDOM= ju.el('entry').data('id', entry._id);
				var a = ju.el('entry__link', 'a').attr('href', '/entry/' + entry._id);
				var f = ju.el(['fontello', 'fontello_name_cancel'], 'span').text(String.fromCharCode(59393))
				var del = ju.el('entry__delete', 'span').append(f);
				a.text(format(entry, ['_id', 'text', 'insert_date']));
				entryDOM.append(a);
				entryDOM.append(del);
				entries.dom.append(entryDOM);
			});
			entries.dom.off('click');
			entries.listen();
		});

		function format(obj, filter) {
			var result = '';
			for (var prop in obj) {
				if (filter.indexOf(prop) >= 0) {
					result += prop + ': "' + obj[prop] + '", ';
				}
			}
			
			return '{' + result.slice(0, result.length - 2) + '}';
		}
	}

	// Delete the given entry
	Entries.prototype.delete = function(id, cb) {
		$.ajax({
			url: '/entry/' + id,
			type: "DELETE",
			dataType : "json",
			success: function( json ) {
				cb(null, json);
			},
			error: function( xhr, status, errorThrown ) {
				cb(errorThrown);
			}
		});
	}

	// Starts listening to cliks on entry__deletes
	Entries.prototype.listen = function() {
		var entries = this;
		this.dom.on( "click", ".entry__delete", function( event ) {
			entries.dom.off('click');
			event.preventDefault();
			entries.delete( $(this).parent('.entry').data('id'), function(err) {
				if (err)
					return console.log('someting wrong');
				var entries = new Entries();
				entries.refresh();
			});
		});
	}

	// Initializes all necessary stuff
	$(document).ready(function() {
		var entryAdder = new EntryAdder();
		var entries = new Entries();
		entries.refresh();
	});


})();
