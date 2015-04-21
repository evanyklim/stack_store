
	
	var app = angular.module('store', []);

	//Cotnrollers are where we define our app's behavior
	//by defining functions and values
	app.controller('StoreController', function ($scope) {
		$scope.products = gems;
	});

	app.controller("PanelController", function(){
		this.tab = 1;

		this.selectTab = function(setTab) {
			this.tab = setTab;
		};

		this.isSelected = function(checkTab) {
			return this.tab === checkTab;
		};
	});

	app.controller("ReviewController", function() {
		this.review = {};

		this.addReview = function(product) {
			product.reviews.push(this.review);
			this.review = {};
		};
	});

	var gems = 
		[{
			name: 'Dodecahedron',
			price: 2.95,
			description: '. . .',
			canPurchase: true,
			soldOut: false,
			//images: [{ full: false, thumb: false }]
			reviews: [
				{
					stars: 5,
					body: "Great product!",
					author: "cl@gmail.com"
				},
				{
					stars: 1,
					body: "Poor service",
					author: "adf@gmail.com"
				}]
		},
		{
			name: 'Emerald',
			price: 212.95,
			description: '. . .',
			canPurchase: true,
			soldOut: false
		}];

