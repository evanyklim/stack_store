'use strict';
var app = angular.module('FullstackGeneratedApp', ['ui.router', 'fsaPreBuilt']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function destinationStateRequiresAuth(state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });
    });
});
'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });
});

app.controller('AboutController', function ($scope) {

    // Images of beautiful Fullstack people.
    $scope.images = ['https://pbs.twimg.com/media/B7gBXulCAAAXQcE.jpg:large', 'https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xap1/t31.0-8/10862451_10205622990359241_8027168843312841137_o.jpg', 'https://pbs.twimg.com/media/B-LKUshIgAEy9SK.jpg', 'https://pbs.twimg.com/media/B79-X7oCMAAkw7y.jpg', 'https://pbs.twimg.com/media/B-Uj9COIIAIFAh0.jpg:large', 'https://pbs.twimg.com/media/B6yIyFiCEAAql12.jpg:large'];
});
app.config(function ($stateProvider) {

    $stateProvider.state('checkout', {
        url: '/checkout',
        templateUrl: 'js/checkout/checkout.html',
        controller: 'CheckoutCtrl'
    });
});

app.controller('CheckoutCtrl', function ($scope, CheckoutFactory) {

    CheckoutFactory.getCart().then(function (cart) {
        $scope.cart = cart;
    });

    $scope.postPrice = function (price) {
        CheckoutFactory.sendTotal(item).then(function (cart) {});
    };
});

app.factory('CheckoutFactory', function ($http) {

    var getCart = function getCart() {
        return $http.get('/api/cart/').then(function (response) {
            return response.data;
        });
    };

    var totalPrice = function totalPrice() {
        return $http.get('/api/cart/items');
    };

    var postPrice = function postPrice(price) {
        return $http.post('/api/checkout', price).then(function (response) {

            return response.data;
        });
    };

    return {
        getCart: getCart,
        postPrice: postPrice
    };
});
'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('account', {
        url: '/account',
        controller: 'AccountController',
        templateUrl: 'js/account/account.html'
    });
});

app.controller('AccountController', function ($scope, AccountFactory) {

    $scope.accountComms = { msg: '' };

    AccountFactory.getUserInfo().then(function (userInfo) {
        $scope.userInfo = userInfo;
    });

    $scope.updateUser = function (userInfo) {
        AccountFactory.updateUserInfo(userInfo).then(function (returnMsg) {
            $scope.accountComms.msg = returnMsg;
        })['catch'](function (err) {
            console.log(err);
        });
    };
});

app.factory('AccountFactory', function ($http) {

    var getUserInfo = function getUserInfo() {
        return $http.get('/api/account/userinfo').then(function (response) {
            return response.data;
        });
    };

    var updateUserInfo = function updateUserInfo(payload) {
        return $http.post('/api/account/userinfo', payload).then(function (response) {
            return response.data;
        });
    };

    return {
        getUserInfo: getUserInfo,
        updateUserInfo: updateUserInfo
    };
});

'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartController',
        templateUrl: 'js/cart/cart.html'
    });
});

app.controller('CartController', function ($scope, CartFactory) {

    CartFactory.getCart().then(function (cart) {
        $scope.cart = cart;
    });

    $scope.post = function (item) {
        // post request will only work with JSON payload
        var payload = { items: item };
        CartFactory.postCart(payload).then(function (cart) {
            // console.log(cart);
            // $scope.cart.items.push(cart);
            $scope.cart = cart;
        });
    };

    $scope.removeFromCart = function (thing) {
        CartFactory.removeFromCart(thing).then(function () {
            $scope.cart = cart;
            location.reload(); //need to use sockets to update in real-time on deletion, for later
        });
    };
});

app.factory('CartFactory', function ($http) {

    var getCart = function getCart() {
        return $http.get('/api/cart/').then(function (response) {
            return response.data;
        });
    };

    var postCart = function postCart(payload) {
        return $http.post('/api/cart/items', payload).then(function (response) {
            return response.data;
        });
    };

    var totalPrice = function totalPrice() {
        return $http.get('/api/cart/items');
    };

    var removeFromCart = function removeFromCart(item) {
        return $http['delete']('api/cart/items/' + item._id).then(function (response) {
            return response.data;
        });
    };

    return {
        getCart: getCart,
        postCart: postCart,
        removeFromCart: removeFromCart
    };
});
'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('admin', {
        url: '/admin',
        controller: 'AdminController',
        templateUrl: 'js/admin/admin.html'
    });

    $stateProvider.state('admin.menu', {
        url: '/:menuName',
        templateUrl: 'js/admin/menu.html',
        controller: 'MenuController'
    });
});

app.controller('AdminController', function ($scope, $state) {

    $scope.items = { data: ['item 1', 'item 2', 'item 3'] };

    $scope.adminMenus = [{ label: 'Categories', menu: 'categories' }, { label: 'Products', menu: 'products' }, { label: 'Order History', menu: 'orders' }, { label: 'User Admins', menu: 'users' }];

    $scope.switchMenu = function (menu) {
        $state.go('admin.menu', { menuName: menu });
    };
});

app.controller('MenuController', function ($scope, $stateParams, MenuFactory) {

    $scope.currentMenu = $stateParams.menuName;
});
'use strict';
// consider putting these into separate files
app.factory('MenuFactory', function ($http) {

    var AdminGetCategoryData = function AdminGetCategoryData() {

        return $http.get('/api/admin/categories/data').then(function (response) {
            return response.data;
        });
    };

    var AdminUpdateCategoryData = function AdminUpdateCategoryData(payload) {

        return $http.post('/api/admin/categories/data', payload).then(function (response) {
            return response.data;
        });
    };

    var AdminGetProductData = function AdminGetProductData() {

        return $http.get('/api/admin/products/data').then(function (response) {
            return response.data;
        });
    };

    var AdminUpdateProductData = function AdminUpdateProductData(payload) {

        return $http.post('/api/admin/products/data', payload).then(function (response) {
            return response.data;
        });
    };

    var AdminGetOrderData = function AdminGetOrderData() {

        return $http.get('/api/admin/orders/data').then(function (response) {
            return response.data;
        });
    };

    var AdminUpdateOrderData = function AdminUpdateOrderData(payload) {

        return $http.post('/api/admin/orders/data', payload).then(function (response) {
            return response.data;
        });
    };

    var AdminGetUserData = function AdminGetUserData() {

        return $http.get('/api/admin/users/data').then(function (response) {
            return response.data;
        });
    };

    var AdminUpdateUserData = function AdminUpdateUserData(payload) {

        return $http.post('/api/admin/users/data', payload).then(function (response) {
            return response.data;
        });
    };

    return {
        AdminGetCategoryData: AdminGetCategoryData,
        AdminUpdateCategoryData: AdminUpdateCategoryData,
        AdminGetProductData: AdminGetProductData,
        AdminUpdateProductData: AdminUpdateProductData,
        AdminGetOrderData: AdminGetOrderData,
        AdminUpdateOrderData: AdminUpdateOrderData,
        AdminGetUserData: AdminGetUserData,
        AdminUpdateUserData: AdminUpdateUserData
    };
});
'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('create', {
        url: '/create',
        controller: 'CreateController',
        templateUrl: 'js/create/create.html'
    });
});

app.controller('CreateController', function ($scope, CreateFactory, $http) {

    $scope.communication = { msg: 'Please enter some credentials' };

    $scope.createUser = function (newUserData) {
        CreateFactory.createNewUser(newUserData).then(function (returnMsg) {
            $scope.communication.msg = returnMsg;
        })['catch'](function (err) {
            console.log(err);
        });
    };

    $scope.fbLogin = function () {
        return $http.get('auth/facebook').then(function (response) {
            console.log('HERERE', response);
            //return response.data;
        });
    };
});

app.factory('CreateFactory', function ($http) {

    var createNewUser = function createNewUser(newUserData) {
        return $http.post('/api/create/newuser', newUserData).then(function (response) {
            return response.data;
        });
    };

    return {
        createNewUser: createNewUser
    };
});

app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });
});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('home');
        })['catch'](function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
});
(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.
    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function ($location) {

        if (!window.io) throw new Error('socket.io not found!');

        var socket;

        if ($location.$$port) {
            socket = io('http://localhost:1337');
        } else {
            socket = io('/');
        }

        return socket;
    });

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function responseError(response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push(['$injector', function ($injector) {
            return $injector.get('AuthInterceptor');
        }]);
    });

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

        // Uses the session factory to see if an
        // authenticated user is currently registered.
        this.isAuthenticated = function () {
            return !!Session.user;
        };

        this.getLoggedInUser = function () {

            // If an authenticated session exists, we
            // return the user attached to that session
            // with a promise. This ensures that we can
            // always interface with this method asynchronously.
            if (this.isAuthenticated()) {
                return $q.when(Session.user);
            }

            // Make request GET /session.
            // If it returns a user, call onSuccessfulLogin with the response.
            // If it returns a 401 response, we catch it and instead resolve to null.
            return $http.get('/session').then(onSuccessfulLogin)['catch'](function () {
                return null;
            });
        };

        this.login = function (credentials) {
            return $http.post('/login', credentials).then(onSuccessfulLogin)['catch'](function (response) {
                return $q.reject({ message: 'Invalid login credentials.' });
            });
        };

        this.logout = function () {
            return $http.get('/logout').then(function () {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };

        function onSuccessfulLogin(response) {
            var data = response.data;
            Session.create(data.id, data.user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return data.user;
        }
    });

    app.service('Session', function ($rootScope, AUTH_EVENTS) {

        var self = this;

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            self.destroy();
        });

        $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
            self.destroy();
        });

        this.id = null;
        this.user = null;

        this.create = function (sessionId, user) {
            this.id = sessionId;
            this.user = user;
        };

        this.destroy = function () {
            this.id = null;
            this.user = null;
        };
    });
})();
app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly', {
        url: '/members-area',
        template: '<img ng-repeat="item in stash" width="300" ng-src="{{ item }}" />',
        controller: function controller($scope, SecretStash) {
            SecretStash.getStash().then(function (stash) {
                $scope.stash = stash;
            });
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });
});

app.factory('SecretStash', function ($http) {

    var getStash = function getStash() {
        return $http.get('/api/members/secret-stash').then(function (response) {
            return response.data;
        });
    };

    return {
        getStash: getStash
    };
});
'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function ($scope, Session) {

    $scope.user = Session.user;
});

//var app = angular.module('Product', []);

app.config(function ($stateProvider) {

    $stateProvider.state('product', {
        url: '/product',
        templateUrl: 'js/product/product.html',
        controller: 'ProductCtrl'
    });
});

app.controller('ProductCtrl', function ($scope, ProductFactory) {
    ProductFactory.getShoes().then(function (shoes) {
        $scope.products = shoes;
    });
});

app.factory('ProductFactory', function ($http) {

    var getShoes = function getShoes() {
        return $http.get('/api/products/shoes').then(function (response) {
            return response.data;
        });
    };

    return {
        getShoes: getShoes
    };
});

app.controller('PanelController', function ($scope) {
    $scope.tab = 1;

    $scope.selectedTab = function (setTab) {
        $scope.tab = setTab;
    };

    $scope.isSelected = function (checkTab) {
        return $scope.tab === checkTab;
    };
});

app.controller('ReviewController', function ($scope) {
    $scope.review = {};

    $scope.addReview = function (product) {
        product.reviews.push($scope.review);
        $scope.review = {};
    };
});

var shoes = [{
    name: 'Nike Air Jordan XI "45" Sample',
    image: 'http://images.complex.com/complex/image/upload/t_article_image/xzw3tp7k39lld4h2eu23.jpg',
    description: 'Michael Jordan wore this sneakers in the early 1990s. Of all the samples of Air Jordans, the "45" XIs remain the most coveted',
    category: 'Jordans',
    price: 500,
    Reviews: ''
}];

/////////

'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('tutorial', {
        url: '/tutorial',
        templateUrl: 'js/tutorial/tutorial.html',
        controller: 'TutorialCtrl',
        resolve: {
            tutorialInfo: function tutorialInfo(TutorialFactory) {
                return TutorialFactory.getTutorialVideos();
            }
        }
    });
});

app.factory('TutorialFactory', function ($http) {

    return {
        getTutorialVideos: function getTutorialVideos() {
            return $http.get('/api/tutorial/videos').then(function (response) {
                return response.data;
            });
        }
    };
});

app.controller('TutorialCtrl', function ($scope, tutorialInfo) {

    $scope.sections = tutorialInfo.sections;
    $scope.videos = _.groupBy(tutorialInfo.videos, 'section');

    $scope.currentSection = { section: null };

    $scope.colors = ['rgba(34, 107, 255, 0.10)', 'rgba(238, 255, 68, 0.11)', 'rgba(234, 51, 255, 0.11)', 'rgba(255, 193, 73, 0.11)', 'rgba(22, 255, 1, 0.11)'];

    $scope.getVideosBySection = function (section, videos) {
        return videos.filter(function (video) {
            return video.section === section;
        });
    };
});
'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'ProductsCtrl',
        templateUrl: 'js/products/products.html'

    });
});

app.controller('ProductsCtrl', function ($scope, ProductFactory, CartFactory) {
    $scope.learnMore = false;

    ProductFactory.getShoes().then(function (shoes) {
        $scope.products = shoes;
        // $scope.products.map(function(elem){
        //     elem.Reviews = [];
        // })
    });

    $scope.showInfo = function () {
        $scope.learnMore = !$scope.learnMore;
    };

    $scope.addToCart = function (item) {

        CartFactory.postCart(item).then(function (cart) {
            // console.log(cart);
            // $scope.cart.items.push(cart);
            $scope.cart = cart;
        });
    };
});

app.factory('ProductFactory', function ($http) {

    var getShoes = function getShoes() {
        return $http.get('/api/products/shoes').then(function (response) {
            return response.data;
        });
    };

    var postCart = function postCart(payload) {
        return $http.post('/api/cart/items', payload).then(function (response) {

            return response.data;
        });
    };

    return {
        getShoes: getShoes,
        postCart: postCart
    };
});

// app.factory('ReviewsFactory', function )

'use strict';
app.factory('RandomGreetings', function () {

    var getRandomFromArray = function getRandomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var greetings = ['Hello, world!', 'At long last, I live!', 'Hello, simple human.', 'What a beautiful day!', 'I\'m like any other project, except that I am yours. :)', 'This empty string is for Lindsay Levine.'];

    return {
        greetings: greetings,
        getRandomGreeting: function getRandomGreeting() {
            return getRandomFromArray(greetings);
        }
    };
});
'use strict';

'use strict';
app.directive('adminCategories', function () {

    return {
        restrict: 'E',
        templateUrl: 'js/admin/templates/admin_categories.html',
        controller: 'AdminCategoryCtrl'
    };
});

app.controller('AdminCategoryCtrl', function ($scope, MenuFactory) {

    $scope.categoryData = { brands: [] };
    $scope.categoryComms = { msg: 'Enter a new category' };

    MenuFactory.AdminGetCategoryData().then(function (categoryData) {
        $scope.categoryData.brands = categoryData;
    });

    $scope.newCategory = function (newCategoryData) {
        MenuFactory.AdminUpdateCategoryData(newCategoryData).then(function (returnMsg) {
            $scope.categoryComms.msg = returnMsg;
            MenuFactory.AdminGetCategoryData().then(function (categoryData) {
                $scope.categoryData.brands = categoryData;
            });
        });
    };
});
'use strict';
app.directive('adminOrders', function () {

    return {
        restrict: 'E',
        templateUrl: 'js/admin/templates/admin_orders.html',
        link: function link(scope) {}
    };
});
'use strict';
app.directive('adminProducts', function () {

    return {
        restrict: 'E',
        templateUrl: 'js/admin/templates/admin_products.html',
        controller: 'AdminProductCtrl'
    };
});

app.controller('AdminProductCtrl', function ($scope, MenuFactory) {

    $scope.productData = { items: [] };
    $scope.productComms = { msg: 'Enter new product details' };

    MenuFactory.AdminGetCategoryData().then(function (categoryData) {
        $scope.categoryData.brands = categoryData;
    });

    MenuFactory.AdminGetProductData().then(function (productData) {
        $scope.productData.items = productData;
    });

    $scope.newProduct = function (newProductData) {
        console.log(newProductData);
        MenuFactory.AdminUpdateProductData(newProductData).then(function (returnMsg) {
            $scope.productComms.msg = returnMsg;
            MenuFactory.AdminGetProductData().then(function (productData) {
                $scope.productData.items = productData;
            });
        });
    };
});
'use strict';
app.directive('adminUsers', function () {

    return {
        restrict: 'E',
        templateUrl: 'js/admin/templates/admin_users.html',
        controller: 'AdminUserCtrl'
    };
});

app.controller('AdminUserCtrl', function ($scope, MenuFactory) {

    $scope.userData = { users: [] };
    $scope.userComms = { msg: 'Current User Administrative Rights' };

    MenuFactory.AdminGetUserData().then(function (userData) {
        $scope.userData.users = userData;
    });

    $scope.ChangeAdmin = function (userAdminData) {
        MenuFactory.AdminUpdateUserData(userAdminData).then(function (returnMsg) {
            $scope.userComms.msg = returnMsg;
        });
    };
});
'use strict';

app.directive('tutorialSection', function () {
    return {
        restrict: 'E',
        scope: {
            name: '@',
            videos: '=',
            background: '@'
        },
        templateUrl: 'js/tutorial/tutorial-section/tutorial-section.html',
        link: function link(scope, element) {
            element.css({ background: scope.background });
        }
    };
});
'use strict';
app.directive('tutorialSectionMenu', function () {
    return {
        restrict: 'E',
        require: 'ngModel',
        templateUrl: 'js/tutorial/tutorial-section-menu/tutorial-section-menu.html',
        scope: {
            sections: '='
        },
        link: function link(scope, element, attrs, ngModelCtrl) {

            scope.currentSection = scope.sections[0];
            ngModelCtrl.$setViewValue(scope.currentSection);

            scope.setSection = function (section) {
                scope.currentSection = section;
                ngModelCtrl.$setViewValue(section);
            };
        }
    };
});
'use strict';
app.directive('tutorialVideo', function ($sce) {

    var formYoutubeURL = function formYoutubeURL(id) {
        return 'https://www.youtube.com/embed/' + id;
    };

    return {
        restrict: 'E',
        templateUrl: 'js/tutorial/tutorial-video/tutorial-video.html',
        scope: {
            video: '='
        },
        link: function link(scope) {
            scope.trustedYoutubeURL = $sce.trustAsResourceUrl(formYoutubeURL(scope.video.youtubeID));
        }
    };
});
'use strict';
app.directive('fullstackLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/fullstack-logo/fullstack-logo.html'
    };
});
'use strict';
app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function link(scope) {

            scope.items = [{ label: 'Home', state: 'home' },
            // { label: 'About', state: 'about' },
            // { label: 'Tutorial', state: 'tutorial' },
            { label: 'Products', state: 'products' },
            //{ label: 'Create Account', state: 'create' },
            { label: 'Account', state: 'account', auth: true }, { label: 'Admin', state: 'admin', auth: true }
            //{ label: 'Members Only', state: 'membersOnly', auth: true },
            // { label: 'Cart', state: 'cart' }
            ];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                    $state.go('home');
                });
            };

            var setUser = function setUser() {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function removeUser() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
        }
    };
});
'use strict';
app.directive('randoGreeting', function (RandomGreetings) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/rando-greeting/rando-greeting.html',
        link: function link(scope) {
            scope.greeting = RandomGreetings.getRandomGreeting();
        }
    };
});
'use strict';
app.directive('productInfo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/products/directives/product-info/product-info.html' };
});

app.controller('PanelController', function ($scope) {
    $scope.tab = 1;

    $scope.selectedTab = function (setTab) {
        $scope.tab = setTab;
    };

    $scope.isSelected = function (checkTab) {
        return $scope.tab === checkTab;
    };
});

app.controller('ReviewController', function ($scope, $http) {
    //reviews
    $scope.review = {};

    $scope.addReview = function (product) {
        product.Reviews.push($scope.review);
        postReview(product).then(function (review) {
            console.log('this is the review!!!', review);
        });
        $scope.review = {};
    };

    var postReview = function postReview(payload) {
        console.log('HERRERERE');
        return $http.post('api/products/shoes/reviews', payload).then(function (response) {
            console.log('PAYLOAD TO REVIEW:>>>', response.data);
            return response.data;
        });
    };
});

// app.factory('ProductFactory', function ($http){

// });

// var facebookLogin = function(payload){
//     return $http.post('')
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiY2hlY2tvdXQvY2hlY2tvdXQuanMiLCJhY2NvdW50L2FjY291bnQuanMiLCJjYXJ0L2NhcnQuanMiLCJhZG1pbi9hZG1pbi5qcyIsImFkbWluL21lbnUuanMiLCJjcmVhdGUvY3JlYXRlLmpzIiwibG9naW4vbG9naW4uanMiLCJmc2EvZnNhLXByZS1idWlsdC5qcyIsIm1lbWJlcnMtb25seS9tZW1iZXJzLW9ubHkuanMiLCJob21lL2hvbWUuanMiLCJwcm9kdWN0L3Byb2R1Y3QuanMiLCJ0dXRvcmlhbC90dXRvcmlhbC5qcyIsInByb2R1Y3RzL3Byb2R1Y3RzLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9SYW5kb21HcmVldGluZ3MuanMiLCJjb21tb24vZmFjdG9yaWVzL1NvY2tldC5qcyIsImFkbWluL2RpcmVjdGl2ZXMvYWRtaW5fY2F0ZWdvcmllcy5qcyIsImFkbWluL2RpcmVjdGl2ZXMvYWRtaW5fb3JkZXJzLmpzIiwiYWRtaW4vZGlyZWN0aXZlcy9hZG1pbl9wcm9kdWN0cy5qcyIsImFkbWluL2RpcmVjdGl2ZXMvYWRtaW5fdXNlcnMuanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uL3R1dG9yaWFsLXNlY3Rpb24uanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51LmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtdmlkZW8vdHV0b3JpYWwtdmlkZW8uanMiLCJjb21tb24vZGlyZWN0aXZlcy9mdWxsc3RhY2stbG9nby9mdWxsc3RhY2stbG9nby5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5qcyIsInByb2R1Y3RzL2RpcmVjdGl2ZXMvcHJvZHVjdC1pbmZvL3Byb2R1Y3QtaW5mby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFBLENBQUE7QUFDQSxJQUFBLEdBQUEsR0FBQSxPQUFBLENBQUEsTUFBQSxDQUFBLHVCQUFBLEVBQUEsQ0FBQSxXQUFBLEVBQUEsYUFBQSxDQUFBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsa0JBQUEsRUFBQSxpQkFBQSxFQUFBOztBQUVBLHFCQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBOztBQUVBLHNCQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOzs7QUFHQSxHQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsVUFBQSxFQUFBLFdBQUEsRUFBQSxNQUFBLEVBQUE7OztBQUdBLFFBQUEsNEJBQUEsR0FBQSxzQ0FBQSxLQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxZQUFBLENBQUE7S0FDQSxDQUFBOzs7O0FBSUEsY0FBQSxDQUFBLEdBQUEsQ0FBQSxtQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUE7O0FBRUEsWUFBQSxDQUFBLDRCQUFBLENBQUEsT0FBQSxDQUFBLEVBQUE7OztBQUdBLG1CQUFBO1NBQ0E7O0FBRUEsWUFBQSxXQUFBLENBQUEsZUFBQSxFQUFBLEVBQUE7OztBQUdBLG1CQUFBO1NBQ0E7OztBQUdBLGFBQUEsQ0FBQSxjQUFBLEVBQUEsQ0FBQTs7QUFFQSxtQkFBQSxDQUFBLGVBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLElBQUEsRUFBQTs7OztBQUlBLGdCQUFBLElBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxDQUFBLENBQUE7YUFDQSxNQUFBO0FBQ0Esc0JBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLENBQUE7YUFDQTtTQUNBLENBQUEsQ0FBQTtLQUVBLENBQUEsQ0FBQTtDQUVBLENBQUEsQ0FBQTtBQ2xEQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOzs7QUFHQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxPQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsUUFBQTtBQUNBLGtCQUFBLEVBQUEsaUJBQUE7QUFDQSxtQkFBQSxFQUFBLHFCQUFBO0tBQ0EsQ0FBQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsaUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQTs7O0FBR0EsVUFBQSxDQUFBLE1BQUEsR0FBQSxDQUNBLHVEQUFBLEVBQ0EscUhBQUEsRUFDQSxpREFBQSxFQUNBLGlEQUFBLEVBQ0EsdURBQUEsRUFDQSx1REFBQSxDQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUN4QkEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxVQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsV0FBQTtBQUNBLG1CQUFBLEVBQUEsMkJBQUE7QUFDQSxrQkFBQSxFQUFBLGNBQUE7S0FDQSxDQUFBLENBQUE7Q0FFQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxjQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsZUFBQSxFQUFBOztBQUVBLG1CQUFBLENBQUEsT0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7S0FDQSxDQUFBLENBQUE7O0FBR0EsVUFBQSxDQUFBLFNBQUEsR0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLHVCQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLElBQUEsRUFBQSxFQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBOztBQUVBLFFBQUEsT0FBQSxHQUFBLG1CQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsVUFBQSxHQUFBLHNCQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxTQUFBLEdBQUEsbUJBQUEsS0FBQSxFQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLGVBQUEsRUFBQSxLQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7O0FBRUEsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBSUEsV0FBQTtBQUNBLGVBQUEsRUFBQSxPQUFBO0FBQ0EsaUJBQUEsRUFBQSxTQUFBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTtBQ2hEQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFNBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxVQUFBO0FBQ0Esa0JBQUEsRUFBQSxtQkFBQTtBQUNBLG1CQUFBLEVBQUEseUJBQUE7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxtQkFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLGNBQUEsRUFBQTs7QUFFQSxVQUFBLENBQUEsWUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxDQUFBOztBQUVBLGtCQUFBLENBQUEsV0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLFFBQUEsR0FBQSxRQUFBLENBQUE7S0FDQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsY0FBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsWUFBQSxDQUFBLEdBQUEsR0FBQSxTQUFBLENBQUE7U0FDQSxDQUFBLFNBQUEsQ0FBQSxVQUFBLEdBQUEsRUFBQTtBQUNBLG1CQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsT0FBQSxDQUFBLGdCQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUE7O0FBRUEsUUFBQSxXQUFBLEdBQUEsdUJBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsdUJBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsY0FBQSxHQUFBLHdCQUFBLE9BQUEsRUFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSx1QkFBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFdBQUE7QUFDQSxtQkFBQSxFQUFBLFdBQUE7QUFDQSxzQkFBQSxFQUFBLGNBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQzlDQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxPQUFBO0FBQ0Esa0JBQUEsRUFBQSxnQkFBQTtBQUNBLG1CQUFBLEVBQUEsbUJBQUE7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxnQkFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLFdBQUEsRUFBQTs7QUFFQSxlQUFBLENBQUEsT0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7S0FDQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLElBQUEsR0FBQSxVQUFBLElBQUEsRUFBQTs7QUFFQSxZQUFBLE9BQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQTtBQUNBLG1CQUFBLENBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLElBQUEsRUFBQTs7O0FBR0Esa0JBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFHQSxVQUFBLENBQUEsY0FBQSxHQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsbUJBQUEsQ0FBQSxjQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFlBQUE7QUFDQSxrQkFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7QUFDQSxvQkFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsT0FBQSxDQUFBLGFBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTs7QUFFQSxRQUFBLE9BQUEsR0FBQSxtQkFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxZQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLFFBQUEsR0FBQSxrQkFBQSxPQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsaUJBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLFVBQUEsR0FBQSxzQkFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsY0FBQSxHQUFBLHdCQUFBLElBQUEsRUFBQTtBQUNBLGVBQUEsS0FBQSxVQUFBLENBQUEsaUJBQUEsR0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBR0EsV0FBQTtBQUNBLGVBQUEsRUFBQSxPQUFBO0FBQ0EsZ0JBQUEsRUFBQSxRQUFBO0FBQ0Esc0JBQUEsRUFBQSxjQUFBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTtBQ2xFQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLE9BQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxRQUFBO0FBQ0Esa0JBQUEsRUFBQSxpQkFBQTtBQUNBLG1CQUFBLEVBQUEscUJBQUE7S0FDQSxDQUFBLENBQUE7O0FBRUEsa0JBQUEsQ0FBQSxLQUFBLENBQUEsWUFBQSxFQUFBO0FBQ0EsV0FBQSxFQUFBLFlBQUE7QUFDQSxtQkFBQSxFQUFBLG9CQUFBO0FBQ0Esa0JBQUEsRUFBQSxnQkFBQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLGlCQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBOztBQUVBLFVBQUEsQ0FBQSxLQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQSxRQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxDQUNBLEVBQUEsS0FBQSxFQUFBLFlBQUEsRUFBQSxJQUFBLEVBQUEsWUFBQSxFQUFBLEVBQ0EsRUFBQSxLQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsRUFDQSxFQUFBLEtBQUEsRUFBQSxlQUFBLEVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxFQUNBLEVBQUEsS0FBQSxFQUFBLGFBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLENBQ0EsQ0FBQTs7QUFFQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLEVBQUEsQ0FBQSxZQUFBLEVBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxnQkFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLFdBQUEsR0FBQSxZQUFBLENBQUEsUUFBQSxDQUFBO0NBRUEsQ0FBQSxDQUFBO0FDcENBLFlBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsT0FBQSxDQUFBLGFBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTs7QUFFQSxRQUFBLG9CQUFBLEdBQUEsZ0NBQUE7O0FBRUEsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLDRCQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLHVCQUFBLEdBQUEsaUNBQUEsT0FBQSxFQUFBOztBQUVBLGVBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSw0QkFBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsbUJBQUEsR0FBQSwrQkFBQTs7QUFFQSxlQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsMEJBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsc0JBQUEsR0FBQSxnQ0FBQSxPQUFBLEVBQUE7O0FBRUEsZUFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLDBCQUFBLEVBQUEsT0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxpQkFBQSxHQUFBLDZCQUFBOztBQUVBLGVBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSx3QkFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxvQkFBQSxHQUFBLDhCQUFBLE9BQUEsRUFBQTs7QUFFQSxlQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsd0JBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLGdCQUFBLEdBQUEsNEJBQUE7O0FBRUEsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLHVCQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLG1CQUFBLEdBQUEsNkJBQUEsT0FBQSxFQUFBOztBQUVBLGVBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSx1QkFBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFdBQUE7QUFDQSw0QkFBQSxFQUFBLG9CQUFBO0FBQ0EsK0JBQUEsRUFBQSx1QkFBQTtBQUNBLDJCQUFBLEVBQUEsbUJBQUE7QUFDQSw4QkFBQSxFQUFBLHNCQUFBO0FBQ0EseUJBQUEsRUFBQSxpQkFBQTtBQUNBLDRCQUFBLEVBQUEsb0JBQUE7QUFDQSx3QkFBQSxFQUFBLGdCQUFBO0FBQ0EsMkJBQUEsRUFBQSxtQkFBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7QUN0RUEsWUFBQSxDQUFBO0FBQ0EsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxRQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsU0FBQTtBQUNBLGtCQUFBLEVBQUEsa0JBQUE7QUFDQSxtQkFBQSxFQUFBLHVCQUFBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsa0JBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxhQUFBLEVBQUEsS0FBQSxFQUFBOztBQUVBLFVBQUEsQ0FBQSxhQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsK0JBQUEsRUFBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxXQUFBLEVBQUE7QUFDQSxxQkFBQSxDQUFBLGFBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxTQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLGFBQUEsQ0FBQSxHQUFBLEdBQUEsU0FBQSxDQUFBO1NBQ0EsQ0FBQSxTQUFBLENBQUEsVUFBQSxHQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsVUFBQSxDQUFBLE9BQUEsR0FBQSxZQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLGVBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLENBQUEsR0FBQSxDQUFBLFFBQUEsRUFBQSxRQUFBLENBQUEsQ0FBQTs7U0FFQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxPQUFBLENBQUEsZUFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBOztBQUVBLFFBQUEsYUFBQSxHQUFBLHVCQUFBLFdBQUEsRUFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxxQkFBQSxFQUFBLFdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFdBQUE7QUFDQSxxQkFBQSxFQUFBLGFBQUE7S0FDQSxDQUFBO0NBSUEsQ0FBQSxDQUFBOztBQzVDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLE9BQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxRQUFBO0FBQ0EsbUJBQUEsRUFBQSxxQkFBQTtBQUNBLGtCQUFBLEVBQUEsV0FBQTtLQUNBLENBQUEsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLFdBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUEsTUFBQSxFQUFBOztBQUVBLFVBQUEsQ0FBQSxLQUFBLEdBQUEsRUFBQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLEtBQUEsR0FBQSxJQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFNBQUEsR0FBQSxVQUFBLFNBQUEsRUFBQTs7QUFFQSxjQUFBLENBQUEsS0FBQSxHQUFBLElBQUEsQ0FBQTs7QUFFQSxtQkFBQSxDQUFBLEtBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsWUFBQTtBQUNBLGtCQUFBLENBQUEsRUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBO1NBQ0EsQ0FBQSxTQUFBLENBQUEsWUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxHQUFBLDRCQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FFQSxDQUFBO0NBRUEsQ0FBQSxDQUFBO0FDM0JBLENBQUEsWUFBQTs7QUFFQSxnQkFBQSxDQUFBOzs7QUFHQSxRQUFBLENBQUEsTUFBQSxDQUFBLE9BQUEsRUFBQSxNQUFBLElBQUEsS0FBQSxDQUFBLHdCQUFBLENBQUEsQ0FBQTs7QUFFQSxRQUFBLEdBQUEsR0FBQSxPQUFBLENBQUEsTUFBQSxDQUFBLGFBQUEsRUFBQSxFQUFBLENBQUEsQ0FBQTs7QUFFQSxPQUFBLENBQUEsT0FBQSxDQUFBLFFBQUEsRUFBQSxVQUFBLFNBQUEsRUFBQTs7QUFFQSxZQUFBLENBQUEsTUFBQSxDQUFBLEVBQUEsRUFBQSxNQUFBLElBQUEsS0FBQSxDQUFBLHNCQUFBLENBQUEsQ0FBQTs7QUFFQSxZQUFBLE1BQUEsQ0FBQTs7QUFFQSxZQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQUE7QUFDQSxrQkFBQSxHQUFBLEVBQUEsQ0FBQSx1QkFBQSxDQUFBLENBQUE7U0FDQSxNQUFBO0FBQ0Esa0JBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLENBQUE7U0FDQTs7QUFFQSxlQUFBLE1BQUEsQ0FBQTtLQUVBLENBQUEsQ0FBQTs7Ozs7QUFLQSxPQUFBLENBQUEsUUFBQSxDQUFBLGFBQUEsRUFBQTtBQUNBLG9CQUFBLEVBQUEsb0JBQUE7QUFDQSxtQkFBQSxFQUFBLG1CQUFBO0FBQ0EscUJBQUEsRUFBQSxxQkFBQTtBQUNBLHNCQUFBLEVBQUEsc0JBQUE7QUFDQSx3QkFBQSxFQUFBLHdCQUFBO0FBQ0EscUJBQUEsRUFBQSxxQkFBQTtLQUNBLENBQUEsQ0FBQTs7QUFFQSxPQUFBLENBQUEsT0FBQSxDQUFBLGlCQUFBLEVBQUEsVUFBQSxVQUFBLEVBQUEsRUFBQSxFQUFBLFdBQUEsRUFBQTtBQUNBLFlBQUEsVUFBQSxHQUFBO0FBQ0EsZUFBQSxFQUFBLFdBQUEsQ0FBQSxnQkFBQTtBQUNBLGVBQUEsRUFBQSxXQUFBLENBQUEsYUFBQTtBQUNBLGVBQUEsRUFBQSxXQUFBLENBQUEsY0FBQTtBQUNBLGVBQUEsRUFBQSxXQUFBLENBQUEsY0FBQTtTQUNBLENBQUE7QUFDQSxlQUFBO0FBQ0EseUJBQUEsRUFBQSx1QkFBQSxRQUFBLEVBQUE7QUFDQSwwQkFBQSxDQUFBLFVBQUEsQ0FBQSxVQUFBLENBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxDQUFBO0FBQ0EsdUJBQUEsRUFBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQTthQUNBO1NBQ0EsQ0FBQTtLQUNBLENBQUEsQ0FBQTs7QUFFQSxPQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsYUFBQSxFQUFBO0FBQ0EscUJBQUEsQ0FBQSxZQUFBLENBQUEsSUFBQSxDQUFBLENBQ0EsV0FBQSxFQUNBLFVBQUEsU0FBQSxFQUFBO0FBQ0EsbUJBQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBLENBQUE7U0FDQSxDQUNBLENBQUEsQ0FBQTtLQUNBLENBQUEsQ0FBQTs7QUFFQSxPQUFBLENBQUEsT0FBQSxDQUFBLGFBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsRUFBQSxFQUFBLEVBQUE7Ozs7QUFJQSxZQUFBLENBQUEsZUFBQSxHQUFBLFlBQUE7QUFDQSxtQkFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUE7O0FBRUEsWUFBQSxDQUFBLGVBQUEsR0FBQSxZQUFBOzs7Ozs7QUFNQSxnQkFBQSxJQUFBLENBQUEsZUFBQSxFQUFBLEVBQUE7QUFDQSx1QkFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQTthQUNBOzs7OztBQUtBLG1CQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsVUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLGlCQUFBLENBQUEsU0FBQSxDQUFBLFlBQUE7QUFDQSx1QkFBQSxJQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7U0FFQSxDQUFBOztBQUVBLFlBQUEsQ0FBQSxLQUFBLEdBQUEsVUFBQSxXQUFBLEVBQUE7QUFDQSxtQkFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLFFBQUEsRUFBQSxXQUFBLENBQUEsQ0FDQSxJQUFBLENBQUEsaUJBQUEsQ0FBQSxTQUNBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSx1QkFBQSxFQUFBLENBQUEsTUFBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLDRCQUFBLEVBQUEsQ0FBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFBO1NBQ0EsQ0FBQTs7QUFFQSxZQUFBLENBQUEsTUFBQSxHQUFBLFlBQUE7QUFDQSxtQkFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxZQUFBO0FBQ0EsdUJBQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQTtBQUNBLDBCQUFBLENBQUEsVUFBQSxDQUFBLFdBQUEsQ0FBQSxhQUFBLENBQUEsQ0FBQTthQUNBLENBQUEsQ0FBQTtTQUNBLENBQUE7O0FBRUEsaUJBQUEsaUJBQUEsQ0FBQSxRQUFBLEVBQUE7QUFDQSxnQkFBQSxJQUFBLEdBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtBQUNBLG1CQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBO0FBQ0Esc0JBQUEsQ0FBQSxVQUFBLENBQUEsV0FBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBO0FBQ0EsbUJBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBO0tBRUEsQ0FBQSxDQUFBOztBQUVBLE9BQUEsQ0FBQSxPQUFBLENBQUEsU0FBQSxFQUFBLFVBQUEsVUFBQSxFQUFBLFdBQUEsRUFBQTs7QUFFQSxZQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7O0FBRUEsa0JBQUEsQ0FBQSxHQUFBLENBQUEsV0FBQSxDQUFBLGdCQUFBLEVBQUEsWUFBQTtBQUNBLGdCQUFBLENBQUEsT0FBQSxFQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7O0FBRUEsa0JBQUEsQ0FBQSxHQUFBLENBQUEsV0FBQSxDQUFBLGNBQUEsRUFBQSxZQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTs7QUFFQSxZQUFBLENBQUEsRUFBQSxHQUFBLElBQUEsQ0FBQTtBQUNBLFlBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBOztBQUVBLFlBQUEsQ0FBQSxNQUFBLEdBQUEsVUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxFQUFBLEdBQUEsU0FBQSxDQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQTs7QUFFQSxZQUFBLENBQUEsT0FBQSxHQUFBLFlBQUE7QUFDQSxnQkFBQSxDQUFBLEVBQUEsR0FBQSxJQUFBLENBQUE7QUFDQSxnQkFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBO0tBRUEsQ0FBQSxDQUFBO0NBRUEsQ0FBQSxFQUFBLENBQUE7QUMzSUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxhQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsZUFBQTtBQUNBLGdCQUFBLEVBQUEsbUVBQUE7QUFDQSxrQkFBQSxFQUFBLG9CQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUE7QUFDQSx1QkFBQSxDQUFBLFFBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsS0FBQSxHQUFBLEtBQUEsQ0FBQTthQUNBLENBQUEsQ0FBQTtTQUNBOzs7QUFHQSxZQUFBLEVBQUE7QUFDQSx3QkFBQSxFQUFBLElBQUE7U0FDQTtLQUNBLENBQUEsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsT0FBQSxDQUFBLGFBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTs7QUFFQSxRQUFBLFFBQUEsR0FBQSxvQkFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSwyQkFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsV0FBQTtBQUNBLGdCQUFBLEVBQUEsUUFBQTtLQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUMvQkEsWUFBQSxDQUFBO0FBQ0EsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxHQUFBO0FBQ0EsbUJBQUEsRUFBQSxtQkFBQTtBQUNBLGtCQUFBLEVBQUEsVUFBQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLFVBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLElBQUEsR0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOzs7O0FDVEEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxTQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsVUFBQTtBQUNBLG1CQUFBLEVBQUEseUJBQUE7QUFDQSxrQkFBQSxFQUFBLGFBQUE7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsY0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxRQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxLQUFBLEVBQUE7QUFDQSxjQUFBLENBQUEsUUFBQSxHQUFBLEtBQUEsQ0FBQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsT0FBQSxDQUFBLGdCQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUE7O0FBRUEsUUFBQSxRQUFBLEdBQUEsb0JBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEscUJBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFdBQUE7QUFDQSxnQkFBQSxFQUFBLFFBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsaUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQTtBQUNBLFVBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxXQUFBLEdBQUEsVUFBQSxNQUFBLEVBQUE7QUFDQSxjQUFBLENBQUEsR0FBQSxHQUFBLE1BQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxRQUFBLENBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsa0JBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQTtBQUNBLFVBQUEsQ0FBQSxNQUFBLEdBQUEsRUFBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxTQUFBLEdBQUEsVUFBQSxPQUFBLEVBQUE7QUFDQSxlQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLENBQUE7QUFDQSxjQUFBLENBQUEsTUFBQSxHQUFBLEVBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsSUFBQSxLQUFBLEdBQUEsQ0FBQTtBQUNBLFFBQUEsRUFBQSxnQ0FBQTtBQUNBLFNBQUEsRUFBQSx5RkFBQTtBQUNBLGVBQUEsRUFBQSwrSEFBQTtBQUNBLFlBQUEsRUFBQSxTQUFBO0FBQ0EsU0FBQSxFQUFBLEdBQUE7QUFDQSxXQUFBLEVBQUEsRUFBQTtDQUNBLENBQUEsQ0FBQTs7OztBQzlEQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFVBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxXQUFBO0FBQ0EsbUJBQUEsRUFBQSwyQkFBQTtBQUNBLGtCQUFBLEVBQUEsY0FBQTtBQUNBLGVBQUEsRUFBQTtBQUNBLHdCQUFBLEVBQUEsc0JBQUEsZUFBQSxFQUFBO0FBQ0EsdUJBQUEsZUFBQSxDQUFBLGlCQUFBLEVBQUEsQ0FBQTthQUNBO1NBQ0E7S0FDQSxDQUFBLENBQUE7Q0FFQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBOztBQUVBLFdBQUE7QUFDQSx5QkFBQSxFQUFBLDZCQUFBO0FBQ0EsbUJBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxzQkFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsdUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTthQUNBLENBQUEsQ0FBQTtTQUNBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLGNBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxZQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxZQUFBLENBQUEsUUFBQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLE1BQUEsR0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQSxNQUFBLEVBQUEsU0FBQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLGNBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsTUFBQSxHQUFBLENBQ0EsMEJBQUEsRUFDQSwwQkFBQSxFQUNBLDBCQUFBLEVBQ0EsMEJBQUEsRUFDQSx3QkFBQSxDQUNBLENBQUE7O0FBRUEsVUFBQSxDQUFBLGtCQUFBLEdBQUEsVUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBO0FBQ0EsZUFBQSxNQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsbUJBQUEsS0FBQSxDQUFBLE9BQUEsS0FBQSxPQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBO0FDakRBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7OztBQUdBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFVBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxXQUFBO0FBQ0Esa0JBQUEsRUFBQSxjQUFBO0FBQ0EsbUJBQUEsRUFBQSwyQkFBQTs7S0FFQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxjQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsY0FBQSxFQUFBLFdBQUEsRUFBQTtBQUNBLFVBQUEsQ0FBQSxTQUFBLEdBQUEsS0FBQSxDQUFBOztBQUVBLGtCQUFBLENBQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLFFBQUEsR0FBQSxLQUFBLENBQUE7Ozs7S0FLQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxZQUFBO0FBQ0EsY0FBQSxDQUFBLFNBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxTQUFBLEdBQUEsVUFBQSxJQUFBLEVBQUE7O0FBRUEsbUJBQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsSUFBQSxFQUFBOzs7QUFHQSxrQkFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxPQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTs7QUFFQSxRQUFBLFFBQUEsR0FBQSxvQkFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxxQkFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBR0EsUUFBQSxRQUFBLEdBQUEsa0JBQUEsT0FBQSxFQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLGlCQUFBLEVBQUEsT0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBOztBQUVBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFdBQUE7QUFDQSxnQkFBQSxFQUFBLFFBQUE7QUFDQSxnQkFBQSxFQUFBLFFBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOzs7O0FDMURBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsaUJBQUEsRUFBQSxZQUFBOztBQUVBLFFBQUEsa0JBQUEsR0FBQSw0QkFBQSxHQUFBLEVBQUE7QUFDQSxlQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxTQUFBLEdBQUEsQ0FDQSxlQUFBLEVBQ0EsdUJBQUEsRUFDQSxzQkFBQSxFQUNBLHVCQUFBLEVBQ0EseURBQUEsRUFDQSwwQ0FBQSxDQUNBLENBQUE7O0FBRUEsV0FBQTtBQUNBLGlCQUFBLEVBQUEsU0FBQTtBQUNBLHlCQUFBLEVBQUEsNkJBQUE7QUFDQSxtQkFBQSxrQkFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBO1NBQ0E7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBO0FDdkJBLFlBQUEsQ0FBQTs7QUNBQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsU0FBQSxDQUFBLGlCQUFBLEVBQUEsWUFBQTs7QUFFQSxXQUFBO0FBQ0EsZ0JBQUEsRUFBQSxHQUFBO0FBQ0EsbUJBQUEsRUFBQSwwQ0FBQTtBQUNBLGtCQUFBLEVBQUEsbUJBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsbUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLFlBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQTtBQUNBLFVBQUEsQ0FBQSxhQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsc0JBQUEsRUFBQSxDQUFBOztBQUVBLGVBQUEsQ0FBQSxvQkFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsWUFBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLFlBQUEsQ0FBQSxNQUFBLEdBQUEsWUFBQSxDQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxXQUFBLEdBQUEsVUFBQSxlQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBLHVCQUFBLENBQUEsZUFBQSxDQUFBLENBQ0EsSUFBQSxDQUFBLFVBQUEsU0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxhQUFBLENBQUEsR0FBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLHVCQUFBLENBQUEsb0JBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFlBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsWUFBQSxDQUFBLE1BQUEsR0FBQSxZQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBO0FDN0JBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxTQUFBLENBQUEsYUFBQSxFQUFBLFlBQUE7O0FBRUEsV0FBQTtBQUNBLGdCQUFBLEVBQUEsR0FBQTtBQUNBLG1CQUFBLEVBQUEsc0NBQUE7QUFDQSxZQUFBLEVBQUEsY0FBQSxLQUFBLEVBQUEsRUFFQTtLQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUNYQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsU0FBQSxDQUFBLGVBQUEsRUFBQSxZQUFBOztBQUVBLFdBQUE7QUFDQSxnQkFBQSxFQUFBLEdBQUE7QUFDQSxtQkFBQSxFQUFBLHdDQUFBO0FBQ0Esa0JBQUEsRUFBQSxrQkFBQTtLQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxrQkFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLFdBQUEsRUFBQTs7QUFFQSxVQUFBLENBQUEsV0FBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEVBQUEsRUFBQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLFlBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSwyQkFBQSxFQUFBLENBQUE7O0FBRUEsZUFBQSxDQUFBLG9CQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxZQUFBLEVBQUE7QUFDQSxjQUFBLENBQUEsWUFBQSxDQUFBLE1BQUEsR0FBQSxZQUFBLENBQUE7S0FDQSxDQUFBLENBQUE7O0FBRUEsZUFBQSxDQUFBLG1CQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxXQUFBLEVBQUE7QUFDQSxjQUFBLENBQUEsV0FBQSxDQUFBLEtBQUEsR0FBQSxXQUFBLENBQUE7S0FDQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGVBQUEsQ0FBQSxHQUFBLENBQUEsY0FBQSxDQUFBLENBQUE7QUFDQSxtQkFBQSxDQUFBLHNCQUFBLENBQUEsY0FBQSxDQUFBLENBQ0EsSUFBQSxDQUFBLFVBQUEsU0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxZQUFBLENBQUEsR0FBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLHVCQUFBLENBQUEsbUJBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFdBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsV0FBQSxDQUFBLEtBQUEsR0FBQSxXQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBO0FDbENBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQSxFQUFBLFlBQUE7O0FBRUEsV0FBQTtB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IGFuZ3VsYXIubW9kdWxlKCdGdWxsc3RhY2tHZW5lcmF0ZWRBcHAnLCBbJ3VpLnJvdXRlcicsICdmc2FQcmVCdWlsdCddKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufSk7XG5cbi8vIFRoaXMgYXBwLnJ1biBpcyBmb3IgY29udHJvbGxpbmcgYWNjZXNzIHRvIHNwZWNpZmljIHN0YXRlcy5cbmFwcC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCAkc3RhdGUpIHtcblxuICAgIC8vIFRoZSBnaXZlbiBzdGF0ZSByZXF1aXJlcyBhbiBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcblxuICAgIC8vICRzdGF0ZUNoYW5nZVN0YXJ0IGlzIGFuIGV2ZW50IGZpcmVkXG4gICAgLy8gd2hlbmV2ZXIgdGhlIHByb2Nlc3Mgb2YgY2hhbmdpbmcgYSBzdGF0ZSBiZWdpbnMuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcykge1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCh0b1N0YXRlKSkge1xuICAgICAgICAgICAgLy8gVGhlIGRlc3RpbmF0aW9uIHN0YXRlIGRvZXMgbm90IHJlcXVpcmUgYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FuY2VsIG5hdmlnYXRpbmcgdG8gbmV3IHN0YXRlLlxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIC8vIElmIGEgdXNlciBpcyByZXRyaWV2ZWQsIHRoZW4gcmVuYXZpZ2F0ZSB0byB0aGUgZGVzdGluYXRpb25cbiAgICAgICAgICAgIC8vICh0aGUgc2Vjb25kIHRpbWUsIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpIHdpbGwgd29yaylcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgaWYgbm8gdXNlciBpcyBsb2dnZWQgaW4sIGdvIHRvIFwibG9naW5cIiBzdGF0ZS5cbiAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKHRvU3RhdGUubmFtZSwgdG9QYXJhbXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWJvdXQnLCB7XG4gICAgICAgIHVybDogJy9hYm91dCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBYm91dENvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2Fib3V0L2Fib3V0Lmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWJvdXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICAgLy8gSW1hZ2VzIG9mIGJlYXV0aWZ1bCBGdWxsc3RhY2sgcGVvcGxlLlxuICAgICRzY29wZS5pbWFnZXMgPSBbXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjdnQlh1bENBQUFYUWNFLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL2ZiY2RuLXNwaG90b3MtYy1hLmFrYW1haWhkLm5ldC9ocGhvdG9zLWFrLXhhcDEvdDMxLjAtOC8xMDg2MjQ1MV8xMDIwNTYyMjk5MDM1OTI0MV84MDI3MTY4ODQzMzEyODQxMTM3X28uanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CLUxLVXNoSWdBRXk5U0suanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNzktWDdvQ01BQWt3N3kuanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CLVVqOUNPSUlBSUZBaDAuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNnlJeUZpQ0VBQXFsMTIuanBnOmxhcmdlJ1xuICAgIF07XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hlY2tvdXQnLCB7XG4gICAgICAgIHVybDogJy9jaGVja291dCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY2hlY2tvdXQvY2hlY2tvdXQuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja291dEN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hlY2tvdXRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQ2hlY2tvdXRGYWN0b3J5KSB7XG5cbiAgICBDaGVja291dEZhY3RvcnkuZ2V0Q2FydCgpLnRoZW4oZnVuY3Rpb24gKGNhcnQpIHtcbiAgICAgICAgJHNjb3BlLmNhcnQgPSBjYXJ0O1xuICAgIH0pO1xuXG5cbiAgICAkc2NvcGUucG9zdFByaWNlID0gZnVuY3Rpb24ocHJpY2Upe1xuICAgICAgICAgICAgICBDaGVja291dEZhY3Rvcnkuc2VuZFRvdGFsKGl0ZW0pLnRoZW4oZnVuY3Rpb24oY2FydCl7fSk7XG4gICAgfTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQ2hlY2tvdXRGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgdmFyIGdldENhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9jYXJ0LycpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgIH0pO1xuICB9O1xuXG4gICB2YXIgdG90YWxQcmljZSA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9jYXJ0L2l0ZW1zJyk7XG4gICB9OyBcblxuICB2YXIgcG9zdFByaWNlID0gZnVuY3Rpb24ocHJpY2Upe1xuICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2NoZWNrb3V0JywgcHJpY2UpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgfSk7XG4gIH07XG5cblxuXG4gIHJldHVybiB7XG4gICAgZ2V0Q2FydDogZ2V0Q2FydCxcbiAgICBwb3N0UHJpY2U6IHBvc3RQcmljZVxuICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhY2NvdW50Jywge1xuXHRcdHVybDogJy9hY2NvdW50JywgXG5cdFx0Y29udHJvbGxlcjogJ0FjY291bnRDb250cm9sbGVyJyxcblx0XHR0ZW1wbGF0ZVVybDogJ2pzL2FjY291bnQvYWNjb3VudC5odG1sJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWNjb3VudENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBBY2NvdW50RmFjdG9yeSkge1xuXG5cdCRzY29wZS5hY2NvdW50Q29tbXMgPSB7IG1zZzogJycgfTtcblxuXHRBY2NvdW50RmFjdG9yeS5nZXRVc2VySW5mbygpLnRoZW4oZnVuY3Rpb24gKHVzZXJJbmZvKSB7XG5cdFx0JHNjb3BlLnVzZXJJbmZvID0gdXNlckluZm87XG5cdH0pO1xuXG5cdCRzY29wZS51cGRhdGVVc2VyID0gZnVuY3Rpb24gKHVzZXJJbmZvKSB7XG5cdFx0QWNjb3VudEZhY3RvcnkudXBkYXRlVXNlckluZm8odXNlckluZm8pLnRoZW4oZnVuY3Rpb24gKHJldHVybk1zZykge1xuXHRcdFx0JHNjb3BlLmFjY291bnRDb21tcy5tc2cgPSByZXR1cm5Nc2c7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQWNjb3VudEZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuXHR2YXIgZ2V0VXNlckluZm8gPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9hY2NvdW50L3VzZXJpbmZvJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciB1cGRhdGVVc2VySW5mbyA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWNjb3VudC91c2VyaW5mbycsIHBheWxvYWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldFVzZXJJbmZvOiBnZXRVc2VySW5mbyxcblx0XHR1cGRhdGVVc2VySW5mbzogdXBkYXRlVXNlckluZm9cblx0fTtcblxufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NhcnQnLCB7XG4gICAgdXJsOiAnL2NhcnQnLFxuICAgIGNvbnRyb2xsZXI6ICdDYXJ0Q29udHJvbGxlcicsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9jYXJ0L2NhcnQuaHRtbCdcbiAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NhcnRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQ2FydEZhY3RvcnkpIHtcblxuXHRDYXJ0RmFjdG9yeS5nZXRDYXJ0KCkudGhlbihmdW5jdGlvbiAoY2FydCkge1xuXHRcdCRzY29wZS5jYXJ0ID0gY2FydDtcblx0fSk7XG5cbiAgJHNjb3BlLnBvc3QgPSBmdW5jdGlvbihpdGVtKXtcbiAgICAvLyBwb3N0IHJlcXVlc3Qgd2lsbCBvbmx5IHdvcmsgd2l0aCBKU09OIHBheWxvYWRcbiAgICB2YXIgcGF5bG9hZCA9IHsgaXRlbXM6IGl0ZW0gfTtcbiAgICBDYXJ0RmFjdG9yeS5wb3N0Q2FydChwYXlsb2FkKS50aGVuKGZ1bmN0aW9uKGNhcnQpe1xuICAgICAgLy8gY29uc29sZS5sb2coY2FydCk7XG4gICAgICAvLyAkc2NvcGUuY2FydC5pdGVtcy5wdXNoKGNhcnQpO1xuICAgICAgJHNjb3BlLmNhcnQgPSBjYXJ0O1xuICAgIH0pO1xuICB9O1xuXG5cbiAgJHNjb3BlLnJlbW92ZUZyb21DYXJ0ID0gZnVuY3Rpb24odGhpbmcpe1xuICAgIENhcnRGYWN0b3J5LnJlbW92ZUZyb21DYXJ0KHRoaW5nKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAkc2NvcGUuY2FydCA9IGNhcnQ7XG4gICAgICBsb2NhdGlvbi5yZWxvYWQoKTsgLy9uZWVkIHRvIHVzZSBzb2NrZXRzIHRvIHVwZGF0ZSBpbiByZWFsLXRpbWUgb24gZGVsZXRpb24sIGZvciBsYXRlclxuICAgIH0pO1xuICB9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdDYXJ0RmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gIHZhciBnZXRDYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2FydC8nKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgcG9zdENhcnQgPSBmdW5jdGlvbihwYXlsb2FkKXtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9jYXJ0L2l0ZW1zJywgcGF5bG9hZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gICB2YXIgdG90YWxQcmljZSA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9jYXJ0L2l0ZW1zJyk7XG4gICB9OyBcblxuICAgdmFyIHJlbW92ZUZyb21DYXJ0ID0gZnVuY3Rpb24oaXRlbSl7XG4gICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKCdhcGkvY2FydC9pdGVtcy8nICsgaXRlbS5faWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pO1xuICAgfTtcblxuXG4gIHJldHVybiB7XG4gICAgZ2V0Q2FydDogZ2V0Q2FydCxcbiAgICBwb3N0Q2FydDogcG9zdENhcnQsXG4gICAgcmVtb3ZlRnJvbUNhcnQ6IHJlbW92ZUZyb21DYXJ0XG4gIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluJywge1xuXHRcdHVybDogJy9hZG1pbicsXG5cdFx0Y29udHJvbGxlcjogJ0FkbWluQ29udHJvbGxlcicsXG5cdFx0dGVtcGxhdGVVcmw6ICdqcy9hZG1pbi9hZG1pbi5odG1sJyBcblx0fSk7XG5cblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluLm1lbnUnLCB7XG5cdFx0dXJsOiAnLzptZW51TmFtZScsXG5cdFx0dGVtcGxhdGVVcmw6ICdqcy9hZG1pbi9tZW51Lmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdNZW51Q29udHJvbGxlcidcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FkbWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSkge1xuXG5cdCRzY29wZS5pdGVtcyA9IHsgZGF0YTogWydpdGVtIDEnLCAnaXRlbSAyJywgJ2l0ZW0gMyddIH07XG5cblx0JHNjb3BlLmFkbWluTWVudXMgPSBbXG5cdFx0eyBsYWJlbDogJ0NhdGVnb3JpZXMnLCBtZW51OiAnY2F0ZWdvcmllcycgfSxcblx0XHR7IGxhYmVsOiAnUHJvZHVjdHMnLCBtZW51OiAncHJvZHVjdHMnIH0sXG5cdFx0eyBsYWJlbDogJ09yZGVyIEhpc3RvcnknLCBtZW51OiAnb3JkZXJzJyB9LFxuXHRcdHsgbGFiZWw6ICdVc2VyIEFkbWlucycsIG1lbnU6ICd1c2VycycgfSxcblx0XTtcblxuXHQkc2NvcGUuc3dpdGNoTWVudSA9IGZ1bmN0aW9uIChtZW51KSB7XG5cdFx0JHN0YXRlLmdvKCdhZG1pbi5tZW51JywgeyBtZW51TmFtZTogbWVudSB9KTtcblx0fTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWVudUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIE1lbnVGYWN0b3J5KSB7XG4gIFxuICAkc2NvcGUuY3VycmVudE1lbnUgPSAkc3RhdGVQYXJhbXMubWVudU5hbWU7ICAgIFxuXG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyBjb25zaWRlciBwdXR0aW5nIHRoZXNlIGludG8gc2VwYXJhdGUgZmlsZXNcbmFwcC5mYWN0b3J5KCdNZW51RmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG5cdHZhciBBZG1pbkdldENhdGVnb3J5RGF0YSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYWRtaW4vY2F0ZWdvcmllcy9kYXRhJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBBZG1pblVwZGF0ZUNhdGVnb3J5RGF0YSA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hZG1pbi9jYXRlZ29yaWVzL2RhdGEnLCBwYXlsb2FkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIEFkbWluR2V0UHJvZHVjdERhdGEgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FkbWluL3Byb2R1Y3RzL2RhdGEnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIEFkbWluVXBkYXRlUHJvZHVjdERhdGEgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuXG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vcHJvZHVjdHMvZGF0YScsIHBheWxvYWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgQWRtaW5HZXRPcmRlckRhdGEgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FkbWluL29yZGVycy9kYXRhJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBBZG1pblVwZGF0ZU9yZGVyRGF0YSA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hZG1pbi9vcmRlcnMvZGF0YScsIHBheWxvYWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgQWRtaW5HZXRVc2VyRGF0YSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYWRtaW4vdXNlcnMvZGF0YScpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgQWRtaW5VcGRhdGVVc2VyRGF0YSA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hZG1pbi91c2Vycy9kYXRhJywgcGF5bG9hZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0QWRtaW5HZXRDYXRlZ29yeURhdGE6IEFkbWluR2V0Q2F0ZWdvcnlEYXRhLFxuXHRcdEFkbWluVXBkYXRlQ2F0ZWdvcnlEYXRhOiBBZG1pblVwZGF0ZUNhdGVnb3J5RGF0YSxcblx0XHRBZG1pbkdldFByb2R1Y3REYXRhOiBBZG1pbkdldFByb2R1Y3REYXRhLFxuXHRcdEFkbWluVXBkYXRlUHJvZHVjdERhdGE6IEFkbWluVXBkYXRlUHJvZHVjdERhdGEsXG5cdFx0QWRtaW5HZXRPcmRlckRhdGE6IEFkbWluR2V0T3JkZXJEYXRhLFxuXHRcdEFkbWluVXBkYXRlT3JkZXJEYXRhOiBBZG1pblVwZGF0ZU9yZGVyRGF0YSxcblx0XHRBZG1pbkdldFVzZXJEYXRhOiBBZG1pbkdldFVzZXJEYXRhLFxuXHRcdEFkbWluVXBkYXRlVXNlckRhdGE6IEFkbWluVXBkYXRlVXNlckRhdGFcblx0fTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NyZWF0ZScsIHtcblx0XHR1cmw6ICcvY3JlYXRlJywgXG5cdFx0Y29udHJvbGxlcjogJ0NyZWF0ZUNvbnRyb2xsZXInLFxuXHRcdHRlbXBsYXRlVXJsOiAnanMvY3JlYXRlL2NyZWF0ZS5odG1sJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ3JlYXRlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIENyZWF0ZUZhY3RvcnksICRodHRwKSB7XG5cblx0JHNjb3BlLmNvbW11bmljYXRpb24gPSB7IG1zZzogJ1BsZWFzZSBlbnRlciBzb21lIGNyZWRlbnRpYWxzJyB9O1xuXG5cdCRzY29wZS5jcmVhdGVVc2VyID0gZnVuY3Rpb24obmV3VXNlckRhdGEpIHtcblx0XHRDcmVhdGVGYWN0b3J5LmNyZWF0ZU5ld1VzZXIobmV3VXNlckRhdGEpLnRoZW4oZnVuY3Rpb24gKHJldHVybk1zZykge1xuXHRcdFx0JHNjb3BlLmNvbW11bmljYXRpb24ubXNnID0gcmV0dXJuTXNnO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0fSk7XG5cdH1cdFxuXG5cdCRzY29wZS5mYkxvZ2luID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJ2F1dGgvZmFjZWJvb2snKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJIRVJFUkVcIiwgcmVzcG9uc2UpO1xuXHRcdFx0Ly9yZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQ3JlYXRlRmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG5cdHZhciBjcmVhdGVOZXdVc2VyID0gZnVuY3Rpb24gKG5ld1VzZXJEYXRhKSB7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvY3JlYXRlL25ld3VzZXInLCBuZXdVc2VyRGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0Y3JlYXRlTmV3VXNlcjogY3JlYXRlTmV3VXNlclxuXHR9O1xuXG5cblxufSk7XG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgJHNjb3BlLmxvZ2luID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zZW5kTG9naW4gPSBmdW5jdGlvbiAobG9naW5JbmZvKSB7XG5cbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihsb2dpbkluZm8pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxufSk7IiwiKGZ1bmN0aW9uICgpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gSG9wZSB5b3UgZGlkbid0IGZvcmdldCBBbmd1bGFyISBEdWgtZG95LlxuICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB0aHJvdyBuZXcgRXJyb3IoJ0kgY2FuXFwndCBmaW5kIEFuZ3VsYXIhJyk7XG5cbiAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdmc2FQcmVCdWlsdCcsIFtdKTtcblxuICBhcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCRsb2NhdGlvbikge1xuXG4gICAgICBpZiAoIXdpbmRvdy5pbykgdGhyb3cgbmV3IEVycm9yKCdzb2NrZXQuaW8gbm90IGZvdW5kIScpO1xuXG4gICAgICB2YXIgc29ja2V0O1xuXG4gICAgICBpZiAoJGxvY2F0aW9uLiQkcG9ydCkge1xuICAgICAgICAgIHNvY2tldCA9IGlvKCdodHRwOi8vbG9jYWxob3N0OjEzMzcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc29ja2V0ID0gaW8oJy8nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNvY2tldDtcblxuICB9KTtcblxuICAvLyBBVVRIX0VWRU5UUyBpcyB1c2VkIHRocm91Z2hvdXQgb3VyIGFwcCB0b1xuICAvLyBicm9hZGNhc3QgYW5kIGxpc3RlbiBmcm9tIGFuZCB0byB0aGUgJHJvb3RTY29wZVxuICAvLyBmb3IgaW1wb3J0YW50IGV2ZW50cyBhYm91dCBhdXRoZW50aWNhdGlvbiBmbG93LlxuICBhcHAuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICAgICAgbG9naW5TdWNjZXNzOiAnYXV0aC1sb2dpbi1zdWNjZXNzJyxcbiAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgbG9nb3V0U3VjY2VzczogJ2F1dGgtbG9nb3V0LXN1Y2Nlc3MnLFxuICAgICAgc2Vzc2lvblRpbWVvdXQ6ICdhdXRoLXNlc3Npb24tdGltZW91dCcsXG4gICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbiAgfSk7XG5cbiAgYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkcSwgQVVUSF9FVkVOVFMpIHtcbiAgICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsXG4gICAgICAgICAgNDE5OiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCxcbiAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuICB9KTtcblxuICBhcHAuY29uZmlnKGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICBmdW5jdGlvbiAoJGluamVjdG9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICB9XG4gICAgICBdKTtcbiAgfSk7XG5cbiAgYXBwLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLCBTZXNzaW9uLCAkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUywgJHEpIHtcblxuICAgICAgLy8gVXNlcyB0aGUgc2Vzc2lvbiBmYWN0b3J5IHRvIHNlZSBpZiBhblxuICAgICAgLy8gYXV0aGVudGljYXRlZCB1c2VyIGlzIGN1cnJlbnRseSByZWdpc3RlcmVkLlxuICAgICAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICEhU2Vzc2lvbi51c2VyO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5nZXRMb2dnZWRJblVzZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAvLyBJZiBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24gZXhpc3RzLCB3ZVxuICAgICAgICAgIC8vIHJldHVybiB0aGUgdXNlciBhdHRhY2hlZCB0byB0aGF0IHNlc3Npb25cbiAgICAgICAgICAvLyB3aXRoIGEgcHJvbWlzZS4gVGhpcyBlbnN1cmVzIHRoYXQgd2UgY2FuXG4gICAgICAgICAgLy8gYWx3YXlzIGludGVyZmFjZSB3aXRoIHRoaXMgbWV0aG9kIGFzeW5jaHJvbm91c2x5LlxuICAgICAgICAgIGlmICh0aGlzLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKFNlc3Npb24udXNlcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTWFrZSByZXF1ZXN0IEdFVCAvc2Vzc2lvbi5cbiAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgdXNlciwgY2FsbCBvblN1Y2Nlc3NmdWxMb2dpbiB3aXRoIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgNDAxIHJlc3BvbnNlLCB3ZSBjYXRjaCBpdCBhbmQgaW5zdGVhZCByZXNvbHZlIHRvIG51bGwuXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3Nlc3Npb24nKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH0pO1xuXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9sb2dpbicsIGNyZWRlbnRpYWxzKVxuICAgICAgICAgICAgICAudGhlbihvblN1Y2Nlc3NmdWxMb2dpbilcbiAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCh7IG1lc3NhZ2U6ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLicgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gb25TdWNjZXNzZnVsTG9naW4ocmVzcG9uc2UpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgU2Vzc2lvbi5jcmVhdGUoZGF0YS5pZCwgZGF0YS51c2VyKTtcbiAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzKTtcbiAgICAgICAgICByZXR1cm4gZGF0YS51c2VyO1xuICAgICAgfVxuXG4gIH0pO1xuXG4gIGFwcC5zZXJ2aWNlKCdTZXNzaW9uJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuZGVzdHJveSgpO1xuICAgICAgfSk7XG5cbiAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICB0aGlzLnVzZXIgPSBudWxsO1xuXG4gICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChzZXNzaW9uSWQsIHVzZXIpIHtcbiAgICAgICAgICB0aGlzLmlkID0gc2Vzc2lvbklkO1xuICAgICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgIH07XG5cbiAgfSk7XG5cbn0pKCk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtZW1iZXJzT25seScsIHtcbiAgICAgICAgdXJsOiAnL21lbWJlcnMtYXJlYScsXG4gICAgICAgIHRlbXBsYXRlOiAnPGltZyBuZy1yZXBlYXQ9XCJpdGVtIGluIHN0YXNoXCIgd2lkdGg9XCIzMDBcIiBuZy1zcmM9XCJ7eyBpdGVtIH19XCIgLz4nLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCBTZWNyZXRTdGFzaCkge1xuICAgICAgICAgICAgU2VjcmV0U3Rhc2guZ2V0U3Rhc2goKS50aGVuKGZ1bmN0aW9uIChzdGFzaCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5zdGFzaCA9IHN0YXNoO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgZGF0YS5hdXRoZW50aWNhdGUgaXMgcmVhZCBieSBhbiBldmVudCBsaXN0ZW5lclxuICAgICAgICAvLyB0aGF0IGNvbnRyb2xzIGFjY2VzcyB0byB0aGlzIHN0YXRlLiBSZWZlciB0byBhcHAuanMuXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0ZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuZmFjdG9yeSgnU2VjcmV0U3Rhc2gnLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICAgIHZhciBnZXRTdGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9tZW1iZXJzL3NlY3JldC1zdGFzaCcpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFN0YXNoOiBnZXRTdGFzaFxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2hvbWUvaG9tZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIFNlc3Npb24pIHtcblxuXHQkc2NvcGUudXNlciA9IFNlc3Npb24udXNlcjtcblx0XG59KTsiLCJcblxuLy92YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ1Byb2R1Y3QnLCBbXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3QnLCB7XG5cdFx0dXJsOiAnL3Byb2R1Y3QnLFxuXHRcdHRlbXBsYXRlVXJsOiAnanMvcHJvZHVjdC9wcm9kdWN0Lmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdQcm9kdWN0Q3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoXCJQcm9kdWN0Q3RybFwiLCBmdW5jdGlvbiAoJHNjb3BlLCBQcm9kdWN0RmFjdG9yeSl7XG5cdFByb2R1Y3RGYWN0b3J5LmdldFNob2VzKCkudGhlbihmdW5jdGlvbiAoc2hvZXMpIHtcblx0XHQkc2NvcGUucHJvZHVjdHMgPSBzaG9lcztcblx0fSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ1Byb2R1Y3RGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgICB2YXIgZ2V0U2hvZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3Byb2R1Y3RzL3Nob2VzJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0U2hvZXM6IGdldFNob2VzXG4gICAgfTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKFwiUGFuZWxDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblx0JHNjb3BlLnRhYiA9IDE7XG5cblx0JHNjb3BlLnNlbGVjdGVkVGFiID0gZnVuY3Rpb24oc2V0VGFiKSB7XG5cdFx0JHNjb3BlLnRhYiA9IHNldFRhYjtcblx0fTtcblxuXHQkc2NvcGUuaXNTZWxlY3RlZCA9IGZ1bmN0aW9uKGNoZWNrVGFiKSB7XG5cdFx0cmV0dXJuICRzY29wZS50YWIgPT09IGNoZWNrVGFiO1xuXHR9O1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoXCJSZXZpZXdDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblx0JHNjb3BlLnJldmlldyA9IHt9O1xuXG5cdCRzY29wZS5hZGRSZXZpZXcgPSBmdW5jdGlvbihwcm9kdWN0KSB7XG5cdFx0cHJvZHVjdC5yZXZpZXdzLnB1c2goJHNjb3BlLnJldmlldyk7XG5cdFx0JHNjb3BlLnJldmlldyA9IHt9O1xuXHR9O1xufSk7XG5cbnZhciBzaG9lcyA9IFt7XG5cdG5hbWU6ICdOaWtlIEFpciBKb3JkYW4gWEkgXCI0NVwiIFNhbXBsZScsXG5cdGltYWdlOiBcImh0dHA6Ly9pbWFnZXMuY29tcGxleC5jb20vY29tcGxleC9pbWFnZS91cGxvYWQvdF9hcnRpY2xlX2ltYWdlL3h6dzN0cDdrMzlsbGQ0aDJldTIzLmpwZ1wiLFxuXHRkZXNjcmlwdGlvbjogJ01pY2hhZWwgSm9yZGFuIHdvcmUgdGhpcyBzbmVha2VycyBpbiB0aGUgZWFybHkgMTk5MHMuIE9mIGFsbCB0aGUgc2FtcGxlcyBvZiBBaXIgSm9yZGFucywgdGhlIFwiNDVcIiBYSXMgcmVtYWluIHRoZSBtb3N0IGNvdmV0ZWQnICxcblx0Y2F0ZWdvcnk6IFwiSm9yZGFuc1wiLFxuXHRwcmljZTogNTAwLjAwLFxuXHRSZXZpZXdzOiBcIlwiXG59XTtcblxuXG5cblxuXG5cbi8vLy8vLy8vL1xuXG4iLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3R1dG9yaWFsJywge1xuICAgICAgICB1cmw6ICcvdHV0b3JpYWwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVHV0b3JpYWxDdHJsJyxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgdHV0b3JpYWxJbmZvOiBmdW5jdGlvbiAoVHV0b3JpYWxGYWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR1dG9yaWFsRmFjdG9yeS5nZXRUdXRvcmlhbFZpZGVvcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuZmFjdG9yeSgnVHV0b3JpYWxGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRUdXRvcmlhbFZpZGVvczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90dXRvcmlhbC92aWRlb3MnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1R1dG9yaWFsQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHR1dG9yaWFsSW5mbykge1xuXG4gICAgJHNjb3BlLnNlY3Rpb25zID0gdHV0b3JpYWxJbmZvLnNlY3Rpb25zO1xuICAgICRzY29wZS52aWRlb3MgPSBfLmdyb3VwQnkodHV0b3JpYWxJbmZvLnZpZGVvcywgJ3NlY3Rpb24nKTtcblxuICAgICRzY29wZS5jdXJyZW50U2VjdGlvbiA9IHsgc2VjdGlvbjogbnVsbCB9O1xuXG4gICAgJHNjb3BlLmNvbG9ycyA9IFtcbiAgICAgICAgJ3JnYmEoMzQsIDEwNywgMjU1LCAwLjEwKScsXG4gICAgICAgICdyZ2JhKDIzOCwgMjU1LCA2OCwgMC4xMSknLFxuICAgICAgICAncmdiYSgyMzQsIDUxLCAyNTUsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjU1LCAxOTMsIDczLCAwLjExKScsXG4gICAgICAgICdyZ2JhKDIyLCAyNTUsIDEsIDAuMTEpJ1xuICAgIF07XG5cbiAgICAkc2NvcGUuZ2V0VmlkZW9zQnlTZWN0aW9uID0gZnVuY3Rpb24gKHNlY3Rpb24sIHZpZGVvcykge1xuICAgICAgICByZXR1cm4gdmlkZW9zLmZpbHRlcihmdW5jdGlvbiAodmlkZW8pIHtcbiAgICAgICAgICAgIHJldHVybiB2aWRlby5zZWN0aW9uID09PSBzZWN0aW9uO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3RzJywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdHMnLFxuICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdHNDdHJsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9wcm9kdWN0cy9wcm9kdWN0cy5odG1sJ1xuXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1Byb2R1Y3RzQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIFByb2R1Y3RGYWN0b3J5LCBDYXJ0RmFjdG9yeSkge1xuICAgICRzY29wZS5sZWFybk1vcmUgPSBmYWxzZTtcblxuXHRQcm9kdWN0RmFjdG9yeS5nZXRTaG9lcygpLnRoZW4oZnVuY3Rpb24gKHNob2VzKSB7XG5cdFx0JHNjb3BlLnByb2R1Y3RzID0gc2hvZXM7XG4gICAgICAgIC8vICRzY29wZS5wcm9kdWN0cy5tYXAoZnVuY3Rpb24oZWxlbSl7XG4gICAgICAgIC8vICAgICBlbGVtLlJldmlld3MgPSBbXTtcbiAgICAgICAgLy8gfSlcblxuXHR9KTtcblxuICAgICRzY29wZS5zaG93SW5mbyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5sZWFybk1vcmUgPSAhJHNjb3BlLmxlYXJuTW9yZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAkc2NvcGUuYWRkVG9DYXJ0ID0gZnVuY3Rpb24oaXRlbSl7XG5cbiAgICAgICAgQ2FydEZhY3RvcnkucG9zdENhcnQoaXRlbSkudGhlbihmdW5jdGlvbihjYXJ0KXtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjYXJ0KTtcbiAgICAgICAgICAvLyAkc2NvcGUuY2FydC5pdGVtcy5wdXNoKGNhcnQpO1xuICAgICAgICAgICAgJHNjb3BlLmNhcnQgPSBjYXJ0O1xuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdQcm9kdWN0RmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgdmFyIGdldFNob2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wcm9kdWN0cy9zaG9lcycpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgICB2YXIgcG9zdENhcnQgPSBmdW5jdGlvbihwYXlsb2FkKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvY2FydC9pdGVtcycsIHBheWxvYWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXG4gICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFNob2VzOiBnZXRTaG9lcyxcbiAgICAgICAgcG9zdENhcnQ6IHBvc3RDYXJ0XG4gICAgfTtcblxufSk7XG5cbi8vIGFwcC5mYWN0b3J5KCdSZXZpZXdzRmFjdG9yeScsIGZ1bmN0aW9uIClcbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdSYW5kb21HcmVldGluZ3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZ2V0UmFuZG9tRnJvbUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbiAgICB9O1xuXG4gICAgdmFyIGdyZWV0aW5ncyA9IFtcbiAgICAgICAgJ0hlbGxvLCB3b3JsZCEnLFxuICAgICAgICAnQXQgbG9uZyBsYXN0LCBJIGxpdmUhJyxcbiAgICAgICAgJ0hlbGxvLCBzaW1wbGUgaHVtYW4uJyxcbiAgICAgICAgJ1doYXQgYSBiZWF1dGlmdWwgZGF5IScsXG4gICAgICAgICdJXFwnbSBsaWtlIGFueSBvdGhlciBwcm9qZWN0LCBleGNlcHQgdGhhdCBJIGFtIHlvdXJzLiA6KScsXG4gICAgICAgICdUaGlzIGVtcHR5IHN0cmluZyBpcyBmb3IgTGluZHNheSBMZXZpbmUuJ1xuICAgIF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBncmVldGluZ3M6IGdyZWV0aW5ncyxcbiAgICAgICAgZ2V0UmFuZG9tR3JlZXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Gcm9tQXJyYXkoZ3JlZXRpbmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ2FkbWluQ2F0ZWdvcmllcycsIGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fY2F0ZWdvcmllcy5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQWRtaW5DYXRlZ29yeUN0cmwnXG4gIH07XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWRtaW5DYXRlZ29yeUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBNZW51RmFjdG9yeSkge1xuXG5cdCRzY29wZS5jYXRlZ29yeURhdGEgPSB7IGJyYW5kczogW10gfTtcbiAgJHNjb3BlLmNhdGVnb3J5Q29tbXMgPSB7IG1zZzogJ0VudGVyIGEgbmV3IGNhdGVnb3J5JyB9O1xuXG5cdE1lbnVGYWN0b3J5LkFkbWluR2V0Q2F0ZWdvcnlEYXRhKCkudGhlbihmdW5jdGlvbiAoY2F0ZWdvcnlEYXRhKSB7XG5cdFx0JHNjb3BlLmNhdGVnb3J5RGF0YS5icmFuZHMgPSBjYXRlZ29yeURhdGE7XG5cdH0pO1xuXG5cdCRzY29wZS5uZXdDYXRlZ29yeSA9IGZ1bmN0aW9uIChuZXdDYXRlZ29yeURhdGEpIHtcblx0XHRNZW51RmFjdG9yeS5BZG1pblVwZGF0ZUNhdGVnb3J5RGF0YShuZXdDYXRlZ29yeURhdGEpXG5cdFx0LnRoZW4oZnVuY3Rpb24gKHJldHVybk1zZykge1xuXHRcdFx0JHNjb3BlLmNhdGVnb3J5Q29tbXMubXNnID0gcmV0dXJuTXNnO1xuXHRcdFx0TWVudUZhY3RvcnkuQWRtaW5HZXRDYXRlZ29yeURhdGEoKS50aGVuKGZ1bmN0aW9uIChjYXRlZ29yeURhdGEpIHtcblx0XHRcdFx0JHNjb3BlLmNhdGVnb3J5RGF0YS5icmFuZHMgPSBjYXRlZ29yeURhdGE7XG5cdFx0XHR9KTtcdFxuXHRcdH0pO1xuXHR9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnYWRtaW5PcmRlcnMnLCBmdW5jdGlvbiAoKSB7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlVXJsOiAnanMvYWRtaW4vdGVtcGxhdGVzL2FkbWluX29yZGVycy5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgIFxuICAgIH1cbiAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnYWRtaW5Qcm9kdWN0cycsIGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fcHJvZHVjdHMuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0FkbWluUHJvZHVjdEN0cmwnXG4gIH07XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWRtaW5Qcm9kdWN0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIE1lbnVGYWN0b3J5KSB7XG5cblx0JHNjb3BlLnByb2R1Y3REYXRhID0geyBpdGVtczogW10gfTtcbiAgJHNjb3BlLnByb2R1Y3RDb21tcyA9IHsgbXNnOiAnRW50ZXIgbmV3IHByb2R1Y3QgZGV0YWlscycgfTtcblxuICBNZW51RmFjdG9yeS5BZG1pbkdldENhdGVnb3J5RGF0YSgpLnRoZW4oZnVuY3Rpb24gKGNhdGVnb3J5RGF0YSkge1xuICBcdCRzY29wZS5jYXRlZ29yeURhdGEuYnJhbmRzID0gY2F0ZWdvcnlEYXRhO1xuICB9KTtcblxuXHRNZW51RmFjdG9yeS5BZG1pbkdldFByb2R1Y3REYXRhKCkudGhlbihmdW5jdGlvbiAocHJvZHVjdERhdGEpIHtcblx0XHQkc2NvcGUucHJvZHVjdERhdGEuaXRlbXMgPSBwcm9kdWN0RGF0YTtcblx0fSk7XG5cblx0JHNjb3BlLm5ld1Byb2R1Y3QgPSBmdW5jdGlvbiAobmV3UHJvZHVjdERhdGEpIHtcblx0XHRjb25zb2xlLmxvZyhuZXdQcm9kdWN0RGF0YSk7XG5cdFx0TWVudUZhY3RvcnkuQWRtaW5VcGRhdGVQcm9kdWN0RGF0YShuZXdQcm9kdWN0RGF0YSlcblx0XHQudGhlbihmdW5jdGlvbiAocmV0dXJuTXNnKSB7XG5cdFx0XHQkc2NvcGUucHJvZHVjdENvbW1zLm1zZyA9IHJldHVybk1zZztcblx0XHRcdE1lbnVGYWN0b3J5LkFkbWluR2V0UHJvZHVjdERhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9kdWN0RGF0YSkge1xuXHRcdFx0XHQkc2NvcGUucHJvZHVjdERhdGEuaXRlbXMgPSBwcm9kdWN0RGF0YTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnYWRtaW5Vc2VycycsIGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fdXNlcnMuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0FkbWluVXNlckN0cmwnXG4gIH07XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FkbWluVXNlckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBNZW51RmFjdG9yeSkge1xuXG5cdCRzY29wZS51c2VyRGF0YSA9IHsgdXNlcnM6IFtdIH07XG4gICRzY29wZS51c2VyQ29tbXMgPSB7IG1zZzogJ0N1cnJlbnQgVXNlciBBZG1pbmlzdHJhdGl2ZSBSaWdodHMnIH07XG5cbiAgTWVudUZhY3RvcnkuQWRtaW5HZXRVc2VyRGF0YSgpLnRoZW4oZnVuY3Rpb24gKHVzZXJEYXRhKSB7XG4gIFx0JHNjb3BlLnVzZXJEYXRhLnVzZXJzID0gdXNlckRhdGE7XG4gIH0pO1xuXG4gICRzY29wZS5DaGFuZ2VBZG1pbiA9IGZ1bmN0aW9uICh1c2VyQWRtaW5EYXRhKSB7XG4gIFx0TWVudUZhY3RvcnkuQWRtaW5VcGRhdGVVc2VyRGF0YSh1c2VyQWRtaW5EYXRhKVxuICBcdC50aGVuKGZ1bmN0aW9uIChyZXR1cm5Nc2cpIHtcbiAgXHRcdCRzY29wZS51c2VyQ29tbXMubXNnID0gcmV0dXJuTXNnO1xuICBcdH0pO1xuICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIG5hbWU6ICdAJyxcbiAgICAgICAgICAgIHZpZGVvczogJz0nLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ0AnXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi90dXRvcmlhbC1zZWN0aW9uLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKHsgYmFja2dyb3VuZDogc2NvcGUuYmFja2dyb3VuZCB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb25NZW51JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51Lmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgc2VjdGlvbnM6ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuXG4gICAgICAgICAgICBzY29wZS5jdXJyZW50U2VjdGlvbiA9IHNjb3BlLnNlY3Rpb25zWzBdO1xuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShzY29wZS5jdXJyZW50U2VjdGlvbik7XG5cbiAgICAgICAgICAgIHNjb3BlLnNldFNlY3Rpb24gPSBmdW5jdGlvbiAoc2VjdGlvbikge1xuICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTZWN0aW9uID0gc2VjdGlvbjtcbiAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKHNlY3Rpb24pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9XG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3R1dG9yaWFsVmlkZW8nLCBmdW5jdGlvbiAoJHNjZSkge1xuXG4gICAgdmFyIGZvcm1Zb3V0dWJlVVJMID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyArIGlkO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXZpZGVvL3R1dG9yaWFsLXZpZGVvLmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgdmlkZW86ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLnRydXN0ZWRZb3V0dWJlVVJMID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoZm9ybVlvdXR1YmVVUkwoc2NvcGUudmlkZW8ueW91dHViZUlEKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uaHRtbCdcbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnbmF2YmFyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCBBVVRIX0VWRU5UUywgJHN0YXRlKSB7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiB7fSxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG5cbiAgICAgIHNjb3BlLml0ZW1zID0gW1xuICAgICAgICB7IGxhYmVsOiAnSG9tZScsIHN0YXRlOiAnaG9tZScgfSxcbiAgICAgICAgLy8geyBsYWJlbDogJ0Fib3V0Jywgc3RhdGU6ICdhYm91dCcgfSxcbiAgICAgICAgLy8geyBsYWJlbDogJ1R1dG9yaWFsJywgc3RhdGU6ICd0dXRvcmlhbCcgfSxcbiAgICAgICAgeyBsYWJlbDogJ1Byb2R1Y3RzJywgc3RhdGU6ICdwcm9kdWN0cycgfSxcbiAgICAgICAgLy97IGxhYmVsOiAnQ3JlYXRlIEFjY291bnQnLCBzdGF0ZTogJ2NyZWF0ZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ0FjY291bnQnLCBzdGF0ZTogJ2FjY291bnQnLCBhdXRoOiB0cnVlIH0sXG4gICAgICAgIHsgbGFiZWw6ICdBZG1pbicsIHN0YXRlOiAnYWRtaW4nLCBhdXRoOiB0cnVlIH1cbiAgICAgICAgLy97IGxhYmVsOiAnTWVtYmVycyBPbmx5Jywgc3RhdGU6ICdtZW1iZXJzT25seScsIGF1dGg6IHRydWUgfSxcbiAgICAgICAgLy8geyBsYWJlbDogJ0NhcnQnLCBzdGF0ZTogJ2NhcnQnIH1cbiAgICAgIF07XG5cbiAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuXG4gICAgICBzY29wZS5pc0xvZ2dlZEluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICB9O1xuXG4gICAgICBzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBzZXRVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgdmFyIHJlbW92ZVVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuICAgICAgfTtcblxuICAgICAgc2V0VXNlcigpO1xuXG4gICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MsIHNldFVzZXIpO1xuICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9nb3V0U3VjY2VzcywgcmVtb3ZlVXNlcik7XG4gICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgcmVtb3ZlVXNlcik7XG5cbiAgICB9XG4gIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdyYW5kb0dyZWV0aW5nJywgZnVuY3Rpb24gKFJhbmRvbUdyZWV0aW5ncykge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS5ncmVldGluZyA9IFJhbmRvbUdyZWV0aW5ncy5nZXRSYW5kb21HcmVldGluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgncHJvZHVjdEluZm8nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9wcm9kdWN0cy9kaXJlY3RpdmVzL3Byb2R1Y3QtaW5mby9wcm9kdWN0LWluZm8uaHRtbCcsXG4gICAgfTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcihcIlBhbmVsQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICAgJHNjb3BlLnRhYiA9IDE7XG5cbiAgICAkc2NvcGUuc2VsZWN0ZWRUYWIgPSBmdW5jdGlvbihzZXRUYWIpIHtcbiAgICAgICAgJHNjb3BlLnRhYiA9IHNldFRhYjtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmlzU2VsZWN0ZWQgPSBmdW5jdGlvbihjaGVja1RhYikge1xuICAgICAgICByZXR1cm4gJHNjb3BlLnRhYiA9PT0gY2hlY2tUYWI7XG4gICAgfTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKFwiUmV2aWV3Q29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCkgeyAvL3Jldmlld3NcbiAgICAkc2NvcGUucmV2aWV3ID0ge307XG5cbiAgICAkc2NvcGUuYWRkUmV2aWV3ID0gZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICBwcm9kdWN0LlJldmlld3MucHVzaCgkc2NvcGUucmV2aWV3KTtcbiAgICAgICAgcG9zdFJldmlldyhwcm9kdWN0KS50aGVuKGZ1bmN0aW9uKHJldmlldykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzIGlzIHRoZSByZXZpZXchISFcIiwgcmV2aWV3KTtcbiAgICAgICAgfSk7XG4gICAgICAgICRzY29wZS5yZXZpZXcgPSB7fTtcbiAgICB9O1xuXG4gICAgICAgIHZhciBwb3N0UmV2aWV3ID0gZnVuY3Rpb24ocGF5bG9hZCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSEVSUkVSRVJFXCIpO1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnYXBpL3Byb2R1Y3RzL3Nob2VzL3Jldmlld3MnLCBwYXlsb2FkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUEFZTE9BRCBUTyBSRVZJRVc6Pj4+XCIsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgICB9O1xuXG59KTtcblxuLy8gYXBwLmZhY3RvcnkoJ1Byb2R1Y3RGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKXtcblxuXG4vLyB9KTtcblxuXG4vLyB2YXIgZmFjZWJvb2tMb2dpbiA9IGZ1bmN0aW9uKHBheWxvYWQpe1xuLy8gICAgIHJldHVybiAkaHR0cC5wb3N0KCcnKVxuLy8gfVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9