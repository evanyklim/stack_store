// dummy data for seed file

var mongoose = require('mongoose');
var connectToDb = require('./server/db');
var User = mongoose.model('User');

// var Evan = new User({ nickname: 'evan', email: 'obama@gmail.com', password: 'potus' }),
// 	Anirban = new User({ nickname: 'abnb', email: 'testing@fsa.com', password: 'password' }),
// 	Carlos = new User({ nickname: 'Carlos', email: 'testnumber2@sneakey.com', password: 'freshkicks' });

var sneakyteam = [{ nickname: 'evan', email: 'obama@gmail.com', password: 'potus' },
	{ nickname: 'abnb', email: 'testing@fsa.com', password: 'password' },
	{ nickname: 'Carlos', email: 'testnumber2@sneakey.com', password: 'freshkicks' }];

	User.create(sneakyteam).then(function (users) {
		console.log(users);
	});

// Evan.save();
// Anirban.save();
// Carlos.save();

// module.exports = {
//     Evan: Evan,
//     Anirban: Anirban,
//     Carlos: Carlos
// };