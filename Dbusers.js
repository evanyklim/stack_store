// dummy data for seed file

var mongoose = require('mongoose');
var connectToDb = require('./server/db');
var User = mongoose.model('User');

var Evan = new User({ email: 'obama@gmail.com', password: 'potus' }),
	Anirban = new User({ email: 'testing@fsa.com', password: 'password' }),
	Carlos = new User({ email: 'testnumber2@sneakey.com', password: 'freshkicks' });

Evan.save();
Anirban.save();
Carlos.save();

module.exports = {
    Evan: Evan,
    Anirban: Anirban,
    Carlos: Carlos
};