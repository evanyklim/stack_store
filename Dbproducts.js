// dummy data for seed file
var q = require('q');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var connectToDb = require('./server/db');
var review = mongoose.model('Review');

var users = require('./Dbusers.js');

var review1 = new review({ title: 'this shoe stinks', body: "I've never worn shoes this bad", score: 1});
var review2 = new review({ title: 'My life is complete! I will never take these off!!!', body: "Excellent shoes, ver comfortable, highly recommended!", score: 4});
var review3 = new review({ title: 'Great pair of kicks!', body: "Can't go wrong with these kicks", score: 3});

review1.save();
review2.save();
review3.save();
// console.log(review1);
// console.log(review2);
// console.log(review3);

module.exports = [
	{
		name: 'Nike Air Jordan XI "45" Sample',
		image: "http://images.complex.com/complex/image/upload/t_article_image/xzw3tp7k39lld4h2eu23.jpg",
		description: 'Michael Jordan wore this sneakers in the early 1990s. Of all the samples of Air Jordans, the "45" XIs remain the most coveted' ,
		//category: "Jordans",
		price: 500.00,
		reviews: [review1, review2, review3]
	},
	{
		name: 'UNDFTD Air Jordan IV',
		image: "http://images.complex.com/complex/image/upload/t_article_image/g8uze0snsfohrxox9tia.jpg",
		description: 'There were just 72 pairs of the MA-1 flight jacket inspired UNDFTD Air Jordan IV released, which made the 2011 Air MAG drop look like a GR. Distributed by raffle and auction only, these have been nearly impossible to get from day one.' ,
		// category: "Jordans", 
		price: 30000.00,
		// Reviews: ''
	},
	{
		name: 'Nike Air Jordan 1 "Black/Red"', 
		image: "http://images.complex.com/complex/image/upload/t_article_image/qswznb5yoxnib1kazng2.jpg",
		description: 'It was the one that started it all: The black/red Air Jordan 1 in the black/red Nike box. Pretty much any Jordan collector should have a pair of these.' ,
		// category: "Jordans", 
		price: 300.00,
		// Reviews: review._id
	},
	{
		name: 'Nike Air Jordan 1 Low', 
		image: "http://images.complex.com/complex/image/upload/t_article_image/oo7rlvxsmmljne4p4vs8.jpg",
		description: 'While the original Air Jordan came out in a multitude of colors, some of which still may be undocumented except in old copies of BOON. But the Air Jordan 1 Low was much simpler. You could get it in any color you wanted as long as that color was either white/natural or white/metallic blue. For some reason the current Air Jordan 1 Low is cut entirely differently, so the only way to find a "real" Air Jordan 1 Low is to track down a pair from 1985' ,
		// category: "Jordans", 
		price: 100.00,
		// Reviews: []
	},
	{
		name: 'Nike Air Jordan III', 
		image: "http://images.complex.com/complex/image/upload/t_article_image/e7pwo50ehkketqaxsx4g.jpg",
		description: 'Aside from the 1, there might not be another Air Jordan more important to the line than the Air Jordan III. The story has been told all too often-how a former architect named Tinker Hatfield took over the line, and used his architecture training to come up with an entirely new way to approach signature product. ' ,
		// category: "Jordans", 
		price: 120.00,
		// Reviews: []
	},
]; 
