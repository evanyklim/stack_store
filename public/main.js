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
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function ($scope, Session) {

    $scope.user = Session.user;
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
        product.reviews.push($scope.review);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiY2FydC9jYXJ0LmpzIiwiYWNjb3VudC9hY2NvdW50LmpzIiwiY2hlY2tvdXQvY2hlY2tvdXQuanMiLCJob21lL2hvbWUuanMiLCJhZG1pbi9hZG1pbi5qcyIsImFkbWluL21lbnUuanMiLCJjcmVhdGUvY3JlYXRlLmpzIiwibG9naW4vbG9naW4uanMiLCJwcm9kdWN0L3Byb2R1Y3QuanMiLCJtZW1iZXJzLW9ubHkvbWVtYmVycy1vbmx5LmpzIiwiZnNhL2ZzYS1wcmUtYnVpbHQuanMiLCJ0dXRvcmlhbC90dXRvcmlhbC5qcyIsInByb2R1Y3RzL3Byb2R1Y3RzLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9SYW5kb21HcmVldGluZ3MuanMiLCJjb21tb24vZmFjdG9yaWVzL1NvY2tldC5qcyIsImFkbWluL2RpcmVjdGl2ZXMvYWRtaW5fY2F0ZWdvcmllcy5qcyIsImFkbWluL2RpcmVjdGl2ZXMvYWRtaW5fb3JkZXJzLmpzIiwiYWRtaW4vZGlyZWN0aXZlcy9hZG1pbl9wcm9kdWN0cy5qcyIsImFkbWluL2RpcmVjdGl2ZXMvYWRtaW5fdXNlcnMuanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uL3R1dG9yaWFsLXNlY3Rpb24uanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51LmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtdmlkZW8vdHV0b3JpYWwtdmlkZW8uanMiLCJjb21tb24vZGlyZWN0aXZlcy9mdWxsc3RhY2stbG9nby9mdWxsc3RhY2stbG9nby5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5qcyIsInByb2R1Y3RzL2RpcmVjdGl2ZXMvcHJvZHVjdC1pbmZvL3Byb2R1Y3QtaW5mby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFBLENBQUE7QUFDQSxJQUFBLEdBQUEsR0FBQSxPQUFBLENBQUEsTUFBQSxDQUFBLHVCQUFBLEVBQUEsQ0FBQSxXQUFBLEVBQUEsYUFBQSxDQUFBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsa0JBQUEsRUFBQSxpQkFBQSxFQUFBOztBQUVBLHFCQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBOztBQUVBLHNCQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOzs7QUFHQSxHQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsVUFBQSxFQUFBLFdBQUEsRUFBQSxNQUFBLEVBQUE7OztBQUdBLFFBQUEsNEJBQUEsR0FBQSxzQ0FBQSxLQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxZQUFBLENBQUE7S0FDQSxDQUFBOzs7O0FBSUEsY0FBQSxDQUFBLEdBQUEsQ0FBQSxtQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUE7O0FBRUEsWUFBQSxDQUFBLDRCQUFBLENBQUEsT0FBQSxDQUFBLEVBQUE7OztBQUdBLG1CQUFBO1NBQ0E7O0FBRUEsWUFBQSxXQUFBLENBQUEsZUFBQSxFQUFBLEVBQUE7OztBQUdBLG1CQUFBO1NBQ0E7OztBQUdBLGFBQUEsQ0FBQSxjQUFBLEVBQUEsQ0FBQTs7QUFFQSxtQkFBQSxDQUFBLGVBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLElBQUEsRUFBQTs7OztBQUlBLGdCQUFBLElBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxDQUFBLENBQUE7YUFDQSxNQUFBO0FBQ0Esc0JBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLENBQUE7YUFDQTtTQUNBLENBQUEsQ0FBQTtLQUVBLENBQUEsQ0FBQTtDQUVBLENBQUEsQ0FBQTtBQ2xEQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOzs7QUFHQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxPQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsUUFBQTtBQUNBLGtCQUFBLEVBQUEsaUJBQUE7QUFDQSxtQkFBQSxFQUFBLHFCQUFBO0tBQ0EsQ0FBQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsaUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQTs7O0FBR0EsVUFBQSxDQUFBLE1BQUEsR0FBQSxDQUNBLHVEQUFBLEVBQ0EscUhBQUEsRUFDQSxpREFBQSxFQUNBLGlEQUFBLEVBQ0EsdURBQUEsRUFDQSx1REFBQSxDQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUN4QkEsWUFBQSxDQUFBO0FBQ0EsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsT0FBQTtBQUNBLGtCQUFBLEVBQUEsZ0JBQUE7QUFDQSxtQkFBQSxFQUFBLG1CQUFBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUE7O0FBRUEsZUFBQSxDQUFBLE9BQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLElBQUEsRUFBQTtBQUNBLGNBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxJQUFBLEdBQUEsVUFBQSxJQUFBLEVBQUE7O0FBRUEsWUFBQSxPQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLENBQUE7QUFDQSxtQkFBQSxDQUFBLFFBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxJQUFBLEVBQUE7OztBQUdBLGtCQUFBLENBQUEsSUFBQSxHQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBR0EsVUFBQSxDQUFBLGNBQUEsR0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLG1CQUFBLENBQUEsY0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxZQUFBO0FBQ0Esa0JBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBO0FBQ0Esb0JBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUE7O0FBRUEsUUFBQSxPQUFBLEdBQUEsbUJBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsWUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxRQUFBLEdBQUEsa0JBQUEsT0FBQSxFQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLGlCQUFBLEVBQUEsT0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxVQUFBLEdBQUEsc0JBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsaUJBQUEsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLGNBQUEsR0FBQSx3QkFBQSxJQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUEsVUFBQSxDQUFBLGlCQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUdBLFdBQUE7QUFDQSxlQUFBLEVBQUEsT0FBQTtBQUNBLGdCQUFBLEVBQUEsUUFBQTtBQUNBLHNCQUFBLEVBQUEsY0FBQTtLQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUNsRUEsWUFBQSxDQUFBO0FBQ0EsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxTQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsVUFBQTtBQUNBLGtCQUFBLEVBQUEsbUJBQUE7QUFDQSxtQkFBQSxFQUFBLHlCQUFBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsbUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxjQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLFlBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQTs7QUFFQSxrQkFBQSxDQUFBLFdBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLGNBQUEsQ0FBQSxRQUFBLEdBQUEsUUFBQSxDQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLGNBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxTQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLFlBQUEsQ0FBQSxHQUFBLEdBQUEsU0FBQSxDQUFBO1NBQ0EsQ0FBQSxTQUFBLENBQUEsVUFBQSxHQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxnQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBOztBQUVBLFFBQUEsV0FBQSxHQUFBLHVCQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLHVCQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLGNBQUEsR0FBQSx3QkFBQSxPQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsdUJBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxXQUFBO0FBQ0EsbUJBQUEsRUFBQSxXQUFBO0FBQ0Esc0JBQUEsRUFBQSxjQUFBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUM5Q0EsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxVQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsV0FBQTtBQUNBLG1CQUFBLEVBQUEsMkJBQUE7QUFDQSxrQkFBQSxFQUFBLGNBQUE7S0FDQSxDQUFBLENBQUE7Q0FFQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxjQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsZUFBQSxFQUFBOztBQUVBLG1CQUFBLENBQUEsT0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7S0FDQSxDQUFBLENBQUE7O0FBR0EsVUFBQSxDQUFBLFNBQUEsR0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLHVCQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLElBQUEsRUFBQSxFQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBOztBQUVBLFFBQUEsT0FBQSxHQUFBLG1CQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsVUFBQSxHQUFBLHNCQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxTQUFBLEdBQUEsbUJBQUEsS0FBQSxFQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLGVBQUEsRUFBQSxLQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7O0FBRUEsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBSUEsV0FBQTtBQUNBLGVBQUEsRUFBQSxPQUFBO0FBQ0EsaUJBQUEsRUFBQSxTQUFBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTtBQ2hEQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBO0FBQ0EsV0FBQSxFQUFBLEdBQUE7QUFDQSxtQkFBQSxFQUFBLG1CQUFBO0FBQ0Esa0JBQUEsRUFBQSxVQUFBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsVUFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQTs7QUFFQSxVQUFBLENBQUEsSUFBQSxHQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUNiQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLE9BQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxRQUFBO0FBQ0Esa0JBQUEsRUFBQSxpQkFBQTtBQUNBLG1CQUFBLEVBQUEscUJBQUE7S0FDQSxDQUFBLENBQUE7O0FBRUEsa0JBQUEsQ0FBQSxLQUFBLENBQUEsWUFBQSxFQUFBO0FBQ0EsV0FBQSxFQUFBLFlBQUE7QUFDQSxtQkFBQSxFQUFBLG9CQUFBO0FBQ0Esa0JBQUEsRUFBQSxnQkFBQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLGlCQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBOztBQUVBLFVBQUEsQ0FBQSxLQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQSxRQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxDQUNBLEVBQUEsS0FBQSxFQUFBLFlBQUEsRUFBQSxJQUFBLEVBQUEsWUFBQSxFQUFBLEVBQ0EsRUFBQSxLQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsRUFDQSxFQUFBLEtBQUEsRUFBQSxlQUFBLEVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxFQUNBLEVBQUEsS0FBQSxFQUFBLGFBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLENBQ0EsQ0FBQTs7QUFFQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLEVBQUEsQ0FBQSxZQUFBLEVBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxnQkFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLFdBQUEsR0FBQSxZQUFBLENBQUEsUUFBQSxDQUFBO0NBRUEsQ0FBQSxDQUFBO0FDcENBLFlBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsT0FBQSxDQUFBLGFBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTs7QUFFQSxRQUFBLG9CQUFBLEdBQUEsZ0NBQUE7O0FBRUEsZUFBQSxLQUFBLENBQUEs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QSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxXQUFBLEVBQUE7QUFDQSxxQkFBQSxDQUFBLGFBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxTQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLGFBQUEsQ0FBQSxHQUFBLEdBQUEsU0FBQSxDQUFBO1NBQ0EsQ0FBQSxTQUFBLENBQUEsVUFBQSxHQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsVUFBQSxDQUFBLE9BQUEsR0FBQSxZQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLGVBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLENBQUEsR0FBQSxDQUFBLFFBQUEsRUFBQSxRQUFBLENBQUEsQ0FBQTs7U0FFQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxPQUFBLENBQUEsZUFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBOztBQUVBLFFBQUEsYUFBQSxHQUFBLHVCQUFBLFdBQUEsRUFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxxQkFBQSxFQUFBLFdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFdBQUE7QUFDQSxxQkFBQSxFQUFBLGFBQUE7S0FDQSxDQUFBO0NBSUEsQ0FBQSxDQUFBOztBQzVDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLE9BQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxRQUFBO0FBQ0EsbUJBQUEsRUFBQSxxQkFBQTtBQUNBLGtCQUFBLEVBQUEsV0FBQTtLQUNBLENBQUEsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLFdBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUEsTUFBQSxFQUFBOztBQUVBLFVBQUEsQ0FBQSxLQUFBLEdBQUEsRUFBQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLEtBQUEsR0FBQSxJQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFNBQUEsR0FBQSxVQUFBLFNBQUEsRUFBQTs7QUFFQSxjQUFBLENBQUEsS0FBQSxHQUFBLElBQUEsQ0FBQTs7QUFFQSxtQkFBQSxDQUFBLEtBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsWUFBQTtBQUNBLGtCQUFBLENBQUEsRUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBO1NBQ0EsQ0FBQSxTQUFBLENBQUEsWUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxHQUFBLDRCQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FFQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOzs7O0FDdkJBLEdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7O0FBRUEsa0JBQUEsQ0FBQSxLQUFBLENBQUEsU0FBQSxFQUFBO0FBQ0EsV0FBQSxFQUFBLFVBQUE7QUFDQSxtQkFBQSxFQUFBLHlCQUFBO0FBQ0Esa0JBQUEsRUFBQSxhQUFBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsYUFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLFFBQUEsR0FBQSxLQUFBLENBQUE7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxnQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBOztBQUVBLFFBQUEsUUFBQSxHQUFBLG9CQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLHFCQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxXQUFBO0FBQ0EsZ0JBQUEsRUFBQSxRQUFBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLGlCQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUE7QUFDQSxVQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsV0FBQSxHQUFBLFVBQUEsTUFBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLEdBQUEsR0FBQSxNQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxlQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsUUFBQSxDQUFBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLGtCQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUE7QUFDQSxVQUFBLENBQUEsTUFBQSxHQUFBLEVBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsU0FBQSxHQUFBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsZUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQ0EsY0FBQSxDQUFBLE1BQUEsR0FBQSxFQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLElBQUEsS0FBQSxHQUFBLENBQUE7QUFDQSxRQUFBLEVBQUEsZ0NBQUE7QUFDQSxTQUFBLEVBQUEseUZBQUE7QUFDQSxlQUFBLEVBQUEsK0hBQUE7QUFDQSxZQUFBLEVBQUEsU0FBQTtBQUNBLFNBQUEsRUFBQSxHQUFBO0FBQ0EsV0FBQSxFQUFBLEVBQUE7Q0FDQSxDQUFBLENBQUE7Ozs7QUM5REEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxhQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsZUFBQTtBQUNBLGdCQUFBLEVBQUEsbUVBQUE7QUFDQSxrQkFBQSxFQUFBLG9CQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUE7QUFDQSx1QkFBQSxDQUFBLFFBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsS0FBQSxHQUFBLEtBQUEsQ0FBQTthQUNBLENBQUEsQ0FBQTtTQUNBOzs7QUFHQSxZQUFBLEVBQUE7QUFDQSx3QkFBQSxFQUFBLElBQUE7U0FDQTtLQUNBLENBQUEsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsT0FBQSxDQUFBLGFBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTs7QUFFQSxRQUFBLFFBQUEsR0FBQSxvQkFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSwyQkFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsV0FBQTtBQUNBLGdCQUFBLEVBQUEsUUFBQTtLQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUMvQkEsQ0FBQSxZQUFBOztBQUVBLGdCQUFBLENBQUE7OztBQUdBLFFBQUEsQ0FBQSxNQUFBLENBQUEsT0FBQSxFQUFBLE1BQUEsSUFBQSxLQUFBLENBQUEsd0JBQUEsQ0FBQSxDQUFBOztBQUVBLFFBQUEsR0FBQSxHQUFBLE9BQUEsQ0FBQSxNQUFBLENBQUEsYUFBQSxFQUFBLEVBQUEsQ0FBQSxDQUFBOztBQUVBLE9BQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxFQUFBLFVBQUEsU0FBQSxFQUFBOztBQUVBLFlBQUEsQ0FBQSxNQUFBLENBQUEsRUFBQSxFQUFBLE1BQUEsSUFBQSxLQUFBLENBQUEsc0JBQUEsQ0FBQSxDQUFBOztBQUVBLFlBQUEsTUFBQSxDQUFBOztBQUVBLFlBQUEsU0FBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLGtCQUFBLEdBQUEsRUFBQSxDQUFBLHVCQUFBLENBQUEsQ0FBQTtTQUNBLE1BQUE7QUFDQSxrQkFBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtTQUNBOztBQUVBLGVBQUEsTUFBQSxDQUFBO0tBRUEsQ0FBQSxDQUFBOzs7OztBQUtBLE9BQUEsQ0FBQSxRQUFBLENBQUEsYUFBQSxFQUFBO0FBQ0Esb0JBQUEsRUFBQSxvQkFBQTtBQUNBLG1CQUFBLEVBQUEsbUJBQUE7QUFDQSxxQkFBQSxFQUFBLHFCQUFBO0FBQ0Esc0JBQUEsRUFBQSxzQkFBQTtBQUNBLHdCQUFBLEVBQUEsd0JBQUE7QUFDQSxxQkFBQSxFQUFBLHFCQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUVBLE9BQUEsQ0FBQSxPQUFBLENBQUEsaUJBQUEsRUFBQSxVQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsV0FBQSxFQUFBO0FBQ0EsWUFBQSxVQUFBLEdBQUE7QUFDQSxlQUFBLEVBQUEsV0FBQSxDQUFBLGdCQUFBO0FBQ0EsZUFBQSxFQUFBLFdBQUEsQ0FBQSxhQUFBO0FBQ0EsZUFBQSxFQUFBLFdBQUEsQ0FBQSxjQUFBO0FBQ0EsZUFBQSxFQUFBLFdBQUEsQ0FBQSxjQUFBO1NBQ0EsQ0FBQTtBQUNBLGVBQUE7QUFDQSx5QkFBQSxFQUFBLHVCQUFBLFFBQUEsRUFBQTtBQUNBLDBCQUFBLENBQUEsVUFBQSxDQUFBLFVBQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLEVBQUEsUUFBQSxDQUFBLENBQUE7QUFDQSx1QkFBQSxFQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBO2FBQ0E7U0FDQSxDQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUVBLE9BQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxhQUFBLEVBQUE7QUFDQSxxQkFBQSxDQUFBLFlBQUEsQ0FBQSxJQUFBLENBQUEsQ0FDQSxXQUFBLEVBQ0EsVUFBQSxTQUFBLEVBQUE7QUFDQSxtQkFBQSxTQUFBLENBQUEsR0FBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQTtTQUNBLENBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUVBLE9BQUEsQ0FBQSxPQUFBLENBQUEsYUFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxFQUFBLEVBQUEsRUFBQTs7OztBQUlBLFlBQUEsQ0FBQSxlQUFBLEdBQUEsWUFBQTtBQUNBLG1CQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQTs7QUFFQSxZQUFBLENBQUEsZUFBQSxHQUFBLFlBQUE7Ozs7OztBQU1BLGdCQUFBLElBQUEsQ0FBQSxlQUFBLEVBQUEsRUFBQTtBQUNBLHVCQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBO2FBQ0E7Ozs7O0FBS0EsbUJBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxVQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsaUJBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQTtBQUNBLHVCQUFBLElBQUEsQ0FBQTthQUNBLENBQUEsQ0FBQTtTQUVBLENBQUE7O0FBRUEsWUFBQSxDQUFBLEtBQUEsR0FBQSxVQUFBLFdBQUEsRUFBQTtBQUNBLG1CQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsUUFBQSxFQUFBLFdBQUEsQ0FBQSxDQUNBLElBQUEsQ0FBQSxpQkFBQSxDQUFBLFNBQ0EsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLHVCQUFBLEVBQUEsQ0FBQSxNQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsNEJBQUEsRUFBQSxDQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7U0FDQSxDQUFBOztBQUVBLFlBQUEsQ0FBQSxNQUFBLEdBQUEsWUFBQTtBQUNBLG1CQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFlBQUE7QUFDQSx1QkFBQSxDQUFBLE9BQUEsRUFBQSxDQUFBO0FBQ0EsMEJBQUEsQ0FBQSxVQUFBLENBQUEsV0FBQSxDQUFBLGFBQUEsQ0FBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFBO1NBQ0EsQ0FBQTs7QUFFQSxpQkFBQSxpQkFBQSxDQUFBLFFBQUEsRUFBQTtBQUNBLGdCQUFBLElBQUEsR0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBO0FBQ0EsbUJBQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLENBQUE7QUFDQSxzQkFBQSxDQUFBLFVBQUEsQ0FBQSxXQUFBLENBQUEsWUFBQSxDQUFBLENBQUE7QUFDQSxtQkFBQSxJQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0E7S0FFQSxDQUFBLENBQUE7O0FBRUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxVQUFBLEVBQUEsV0FBQSxFQUFBOztBQUVBLFlBQUEsSUFBQSxHQUFBLElBQUEsQ0FBQTs7QUFFQSxrQkFBQSxDQUFBLEdBQUEsQ0FBQSxXQUFBLENBQUEsZ0JBQUEsRUFBQSxZQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTs7QUFFQSxrQkFBQSxDQUFBLEdBQUEsQ0FBQSxXQUFBLENBQUEsY0FBQSxFQUFBLFlBQUE7QUFDQSxnQkFBQSxDQUFBLE9BQUEsRUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBOztBQUVBLFlBQUEsQ0FBQSxFQUFBLEdBQUEsSUFBQSxDQUFBO0FBQ0EsWUFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7O0FBRUEsWUFBQSxDQUFBLE1BQUEsR0FBQSxVQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUE7QUFDQSxnQkFBQSxDQUFBLEVBQUEsR0FBQSxTQUFBLENBQUE7QUFDQSxnQkFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBOztBQUVBLFlBQUEsQ0FBQSxPQUFBLEdBQUEsWUFBQTtBQUNBLGdCQUFBLENBQUEsRUFBQSxHQUFBLElBQUEsQ0FBQTtBQUNBLGdCQUFBLENBQUEsSUFBQSxHQUFBLElBQUEsQ0FBQTtTQUNBLENBQUE7S0FFQSxDQUFBLENBQUE7Q0FFQSxDQUFBLEVBQUEsQ0FBQTtBQzNJQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFVBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxXQUFBO0FBQ0EsbUJBQUEsRUFBQSwyQkFBQTtBQUNBLGtCQUFBLEVBQUEsY0FBQTtBQUNBLGVBQUEsRUFBQTtBQUNBLHdCQUFBLEVBQUEsc0JBQUEsZUFBQSxFQUFBO0FBQ0EsdUJBQUEsZUFBQSxDQUFBLGlCQUFBLEVBQUEsQ0FBQTthQUNBO1NBQ0E7S0FDQSxDQUFBLENBQUE7Q0FFQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBOztBQUVBLFdBQUE7QUFDQSx5QkFBQSxFQUFBLDZCQUFBO0FBQ0EsbUJBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxzQkFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsdUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTthQUNBLENBQUEsQ0FBQTtTQUNBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLGNBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxZQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxZQUFBLENBQUEsUUFBQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLE1BQUEsR0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQSxNQUFBLEVBQUEsU0FBQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLGNBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsTUFBQSxHQUFBLENBQ0EsMEJBQUEsRUFDQSwwQkFBQSxFQUNBLDBCQUFBLEVBQ0EsMEJBQUEsRUFDQSx3QkFBQSxDQUNBLENBQUE7O0FBRUEsVUFBQSxDQUFBLGtCQUFBLEdBQUEsVUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBO0FBQ0EsZUFBQSxNQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsbUJBQUEsS0FBQSxDQUFBLE9BQUEsS0FBQSxPQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBO0FDakRBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7OztBQUdBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFVBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxXQUFBO0FBQ0Esa0JBQUEsRUFBQSxjQUFBO0FBQ0EsbUJBQUEsRUFBQSwyQkFBQTs7S0FFQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxjQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsY0FBQSxFQUFBLFdBQUEsRUFBQTtBQUNBLFVBQUEsQ0FBQSxTQUFBLEdBQUEsS0FBQSxDQUFBOztBQUVBLGtCQUFBLENBQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLFFBQUEsR0FBQSxLQUFBLENBQUE7Ozs7S0FLQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxZQUFBO0FBQ0EsY0FBQSxDQUFBLFNBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxTQUFBLEdBQUEsVUFBQSxJQUFBLEVBQUE7O0FBRUEsbUJBQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsSUFBQSxFQUFBOzs7QUFHQSxrQkFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxPQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTs7QUFFQSxRQUFBLFFBQUEsR0FBQSxvQkFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxxQkFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBR0EsUUFBQSxRQUFBLEdBQUEsa0JBQUEsT0FBQSxFQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLGlCQUFBLEVBQUEsT0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBOztBQUVBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFdBQUE7QUFDQSxnQkFBQSxFQUFBLFFBQUE7QUFDQSxnQkFBQSxFQUFBLFFBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOzs7O0FDMURBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsaUJBQUEsRUFBQSxZQUFBOztBQUVBLFFBQUEsa0JBQUEsR0FBQSw0QkFBQSxHQUFBLEVBQUE7QUFDQSxlQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxTQUFBLEdBQUEsQ0FDQSxlQUFBLEVBQ0EsdUJBQUEsRUFDQSxzQkFBQSxFQUNBLHVCQUFBLEVBQ0EseURBQUEsRUFDQSwwQ0FBQSxDQUNBLENBQUE7O0FBRUEsV0FBQTtBQUNBLGlCQUFBLEVBQUEsU0FBQTtBQUNBLHlCQUFBLEVBQUEsNkJBQUE7QUFDQSxtQkFBQSxrQkFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBO1NBQ0E7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBO0FDdkJBLFlBQUEsQ0FBQTs7QUNBQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsU0FBQSxDQUFBLGlCQUFBLEVBQUEsWUFBQTs7QUFFQSxXQUFBO0FBQ0EsZ0JBQUEsRUFBQSxHQUFBO0FBQ0EsbUJBQUEsRUFBQSwwQ0FBQTtBQUNBLGtCQUFBLEVBQUEsbUJBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsbUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLFlBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQTtBQUNBLFVBQUEsQ0FBQSxhQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsc0JBQUEsRUFBQSxDQUFBOztBQUVBLGVBQUEsQ0FBQSxvQkFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsWUFBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLFlBQUEsQ0FBQSxNQUFBLEdBQUEsWUFBQSxDQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxXQUFBLEdBQUEsVUFBQSxlQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBLHVCQUFBLENBQUEsZUFBQSxDQUFBLENBQ0EsSUFBQSxDQUFBLFVBQUEsU0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxhQUFBLENBQUEsR0FBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLHVCQUFBLENBQUEsb0JBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFlBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsWUFBQSxDQUFBLE1BQUEsR0FBQSxZQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBO0FDN0JBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxTQUFBLENBQUEsYUFBQSxFQUFBLFlBQUE7O0FBRUEsV0FBQTtBQUNBLGdCQUFBLEVBQUEsR0FBQTtBQUNBLG1CQUFBLEVBQUEsc0NBQUE7QUFDQSxZQUFBLEVBQUEsY0FBQSxLQUFBLEVBQUEsRUFFQTtLQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUNYQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsU0FBQSxDQUFBLGVBQUEsRUFBQSxZQUFBOztBQUVBLFdBQUE7QUFDQSxnQkFBQSxFQUFBLEdBQUE7QUFDQSxtQkFBQSxFQUFBLHdDQUFBO0FBQ0Esa0JBQUEsRUFBQSxrQkFBQTtLQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxrQkFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLFdBQUEsRUFBQTs7QUFFQSxVQUFBLENBQUEsV0FBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEVBQUEsRUFBQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLFlBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSwyQkFBQSxFQUFBLENBQUE7O0FBRUEsZUFBQSxDQUFBLG9CQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxZQUFBLEVBQUE7QUFDQSxjQUFBLENBQUEsWUFBQSxDQUFBLE1BQUEsR0FBQSxZQUFBLENBQUE7S0FDQSxDQUFBLENBQUE7O0FBRUEsZUFBQSxDQUFBLG1CQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxXQUFBLEVBQUE7QUFDQSxjQUFBLENBQUEsV0FBQSxDQUFBLEtBQUEsR0FBQSxXQUFBLENBQUE7S0FDQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGVBQUEsQ0FBQSxHQUFBLENBQUEsY0FBQSxDQUFBLENBQUE7QUFDQSxtQkFBQSxDQUFBLHNCQUFBLENBQUEsY0FBQSxDQUFBLENBQ0EsSUFBQSxDQUFBLFVBQUEsU0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxZQUFBLENBQUEsR0FBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLHVCQUFBLENBQUEsbUJBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFdBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsV0FBQSxDQUFBLEtBQUEsR0FBQSxXQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBO0FDbENBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQSxFQUFBLFlBQUE7O0FBRUEsV0FBQTtB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IGFuZ3VsYXIubW9kdWxlKCdGdWxsc3RhY2tHZW5lcmF0ZWRBcHAnLCBbJ3VpLnJvdXRlcicsICdmc2FQcmVCdWlsdCddKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufSk7XG5cbi8vIFRoaXMgYXBwLnJ1biBpcyBmb3IgY29udHJvbGxpbmcgYWNjZXNzIHRvIHNwZWNpZmljIHN0YXRlcy5cbmFwcC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCAkc3RhdGUpIHtcblxuICAgIC8vIFRoZSBnaXZlbiBzdGF0ZSByZXF1aXJlcyBhbiBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcblxuICAgIC8vICRzdGF0ZUNoYW5nZVN0YXJ0IGlzIGFuIGV2ZW50IGZpcmVkXG4gICAgLy8gd2hlbmV2ZXIgdGhlIHByb2Nlc3Mgb2YgY2hhbmdpbmcgYSBzdGF0ZSBiZWdpbnMuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcykge1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCh0b1N0YXRlKSkge1xuICAgICAgICAgICAgLy8gVGhlIGRlc3RpbmF0aW9uIHN0YXRlIGRvZXMgbm90IHJlcXVpcmUgYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FuY2VsIG5hdmlnYXRpbmcgdG8gbmV3IHN0YXRlLlxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIC8vIElmIGEgdXNlciBpcyByZXRyaWV2ZWQsIHRoZW4gcmVuYXZpZ2F0ZSB0byB0aGUgZGVzdGluYXRpb25cbiAgICAgICAgICAgIC8vICh0aGUgc2Vjb25kIHRpbWUsIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpIHdpbGwgd29yaylcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgaWYgbm8gdXNlciBpcyBsb2dnZWQgaW4sIGdvIHRvIFwibG9naW5cIiBzdGF0ZS5cbiAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKHRvU3RhdGUubmFtZSwgdG9QYXJhbXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWJvdXQnLCB7XG4gICAgICAgIHVybDogJy9hYm91dCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBYm91dENvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2Fib3V0L2Fib3V0Lmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWJvdXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICAgLy8gSW1hZ2VzIG9mIGJlYXV0aWZ1bCBGdWxsc3RhY2sgcGVvcGxlLlxuICAgICRzY29wZS5pbWFnZXMgPSBbXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjdnQlh1bENBQUFYUWNFLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL2ZiY2RuLXNwaG90b3MtYy1hLmFrYW1haWhkLm5ldC9ocGhvdG9zLWFrLXhhcDEvdDMxLjAtOC8xMDg2MjQ1MV8xMDIwNTYyMjk5MDM1OTI0MV84MDI3MTY4ODQzMzEyODQxMTM3X28uanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CLUxLVXNoSWdBRXk5U0suanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNzktWDdvQ01BQWt3N3kuanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CLVVqOUNPSUlBSUZBaDAuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNnlJeUZpQ0VBQXFsMTIuanBnOmxhcmdlJ1xuICAgIF07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NhcnQnLCB7XG4gICAgdXJsOiAnL2NhcnQnLFxuICAgIGNvbnRyb2xsZXI6ICdDYXJ0Q29udHJvbGxlcicsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9jYXJ0L2NhcnQuaHRtbCdcbiAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NhcnRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQ2FydEZhY3RvcnkpIHtcblxuXHRDYXJ0RmFjdG9yeS5nZXRDYXJ0KCkudGhlbihmdW5jdGlvbiAoY2FydCkge1xuXHRcdCRzY29wZS5jYXJ0ID0gY2FydDtcblx0fSk7XG5cbiAgJHNjb3BlLnBvc3QgPSBmdW5jdGlvbihpdGVtKXtcbiAgICAvLyBwb3N0IHJlcXVlc3Qgd2lsbCBvbmx5IHdvcmsgd2l0aCBKU09OIHBheWxvYWRcbiAgICB2YXIgcGF5bG9hZCA9IHsgaXRlbXM6IGl0ZW0gfTtcbiAgICBDYXJ0RmFjdG9yeS5wb3N0Q2FydChwYXlsb2FkKS50aGVuKGZ1bmN0aW9uKGNhcnQpe1xuICAgICAgLy8gY29uc29sZS5sb2coY2FydCk7XG4gICAgICAvLyAkc2NvcGUuY2FydC5pdGVtcy5wdXNoKGNhcnQpO1xuICAgICAgJHNjb3BlLmNhcnQgPSBjYXJ0O1xuICAgIH0pO1xuICB9O1xuXG5cbiAgJHNjb3BlLnJlbW92ZUZyb21DYXJ0ID0gZnVuY3Rpb24odGhpbmcpe1xuICAgIENhcnRGYWN0b3J5LnJlbW92ZUZyb21DYXJ0KHRoaW5nKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAkc2NvcGUuY2FydCA9IGNhcnQ7XG4gICAgICBsb2NhdGlvbi5yZWxvYWQoKTsgLy9uZWVkIHRvIHVzZSBzb2NrZXRzIHRvIHVwZGF0ZSBpbiByZWFsLXRpbWUgb24gZGVsZXRpb24sIGZvciBsYXRlclxuICAgIH0pO1xuICB9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdDYXJ0RmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gIHZhciBnZXRDYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2FydC8nKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgcG9zdENhcnQgPSBmdW5jdGlvbihwYXlsb2FkKXtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9jYXJ0L2l0ZW1zJywgcGF5bG9hZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gICB2YXIgdG90YWxQcmljZSA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9jYXJ0L2l0ZW1zJyk7XG4gICB9OyBcblxuICAgdmFyIHJlbW92ZUZyb21DYXJ0ID0gZnVuY3Rpb24oaXRlbSl7XG4gICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKCdhcGkvY2FydC9pdGVtcy8nICsgaXRlbS5faWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pO1xuICAgfTtcblxuXG4gIHJldHVybiB7XG4gICAgZ2V0Q2FydDogZ2V0Q2FydCxcbiAgICBwb3N0Q2FydDogcG9zdENhcnQsXG4gICAgcmVtb3ZlRnJvbUNhcnQ6IHJlbW92ZUZyb21DYXJ0XG4gIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FjY291bnQnLCB7XG5cdFx0dXJsOiAnL2FjY291bnQnLCBcblx0XHRjb250cm9sbGVyOiAnQWNjb3VudENvbnRyb2xsZXInLFxuXHRcdHRlbXBsYXRlVXJsOiAnanMvYWNjb3VudC9hY2NvdW50Lmh0bWwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBY2NvdW50Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEFjY291bnRGYWN0b3J5KSB7XG5cblx0JHNjb3BlLmFjY291bnRDb21tcyA9IHsgbXNnOiAnJyB9O1xuXG5cdEFjY291bnRGYWN0b3J5LmdldFVzZXJJbmZvKCkudGhlbihmdW5jdGlvbiAodXNlckluZm8pIHtcblx0XHQkc2NvcGUudXNlckluZm8gPSB1c2VySW5mbztcblx0fSk7XG5cblx0JHNjb3BlLnVwZGF0ZVVzZXIgPSBmdW5jdGlvbiAodXNlckluZm8pIHtcblx0XHRBY2NvdW50RmFjdG9yeS51cGRhdGVVc2VySW5mbyh1c2VySW5mbykudGhlbihmdW5jdGlvbiAocmV0dXJuTXNnKSB7XG5cdFx0XHQkc2NvcGUuYWNjb3VudENvbW1zLm1zZyA9IHJldHVybk1zZztcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdH0pO1xuXHR9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdBY2NvdW50RmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG5cdHZhciBnZXRVc2VySW5mbyA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FjY291bnQvdXNlcmluZm8nKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIHVwZGF0ZVVzZXJJbmZvID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hY2NvdW50L3VzZXJpbmZvJywgcGF5bG9hZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0VXNlckluZm86IGdldFVzZXJJbmZvLFxuXHRcdHVwZGF0ZVVzZXJJbmZvOiB1cGRhdGVVc2VySW5mb1xuXHR9O1xuXG59KTtcblxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjaGVja291dCcsIHtcbiAgICAgICAgdXJsOiAnL2NoZWNrb3V0JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jaGVja291dC9jaGVja291dC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0NoZWNrb3V0Q3RybCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGVja291dEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBDaGVja291dEZhY3RvcnkpIHtcblxuICAgIENoZWNrb3V0RmFjdG9yeS5nZXRDYXJ0KCkudGhlbihmdW5jdGlvbiAoY2FydCkge1xuICAgICAgICAkc2NvcGUuY2FydCA9IGNhcnQ7XG4gICAgfSk7XG5cblxuICAgICRzY29wZS5wb3N0UHJpY2UgPSBmdW5jdGlvbihwcmljZSl7XG4gICAgICAgICAgICAgIENoZWNrb3V0RmFjdG9yeS5zZW5kVG90YWwoaXRlbSkudGhlbihmdW5jdGlvbihjYXJ0KXt9KTtcbiAgICB9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdDaGVja291dEZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICB2YXIgZ2V0Q2FydCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2NhcnQvJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgfSk7XG4gIH07XG5cbiAgIHZhciB0b3RhbFByaWNlID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2NhcnQvaXRlbXMnKTtcbiAgIH07IFxuXG4gIHZhciBwb3N0UHJpY2UgPSBmdW5jdGlvbihwcmljZSl7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvY2hlY2tvdXQnLCBwcmljZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgfTtcblxuXG5cbiAgcmV0dXJuIHtcbiAgICBnZXRDYXJ0OiBnZXRDYXJ0LFxuICAgIHBvc3RQcmljZTogcG9zdFByaWNlXG4gIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2hvbWUvaG9tZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIFNlc3Npb24pIHtcblxuXHQkc2NvcGUudXNlciA9IFNlc3Npb24udXNlcjtcblx0XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbicsIHtcblx0XHR1cmw6ICcvYWRtaW4nLFxuXHRcdGNvbnRyb2xsZXI6ICdBZG1pbkNvbnRyb2xsZXInLFxuXHRcdHRlbXBsYXRlVXJsOiAnanMvYWRtaW4vYWRtaW4uaHRtbCcgXG5cdH0pO1xuXG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi5tZW51Jywge1xuXHRcdHVybDogJy86bWVudU5hbWUnLFxuXHRcdHRlbXBsYXRlVXJsOiAnanMvYWRtaW4vbWVudS5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnTWVudUNvbnRyb2xsZXInXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBZG1pbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUpIHtcblxuXHQkc2NvcGUuaXRlbXMgPSB7IGRhdGE6IFsnaXRlbSAxJywgJ2l0ZW0gMicsICdpdGVtIDMnXSB9O1xuXG5cdCRzY29wZS5hZG1pbk1lbnVzID0gW1xuXHRcdHsgbGFiZWw6ICdDYXRlZ29yaWVzJywgbWVudTogJ2NhdGVnb3JpZXMnIH0sXG5cdFx0eyBsYWJlbDogJ1Byb2R1Y3RzJywgbWVudTogJ3Byb2R1Y3RzJyB9LFxuXHRcdHsgbGFiZWw6ICdPcmRlciBIaXN0b3J5JywgbWVudTogJ29yZGVycycgfSxcblx0XHR7IGxhYmVsOiAnVXNlciBBZG1pbnMnLCBtZW51OiAndXNlcnMnIH0sXG5cdF07XG5cblx0JHNjb3BlLnN3aXRjaE1lbnUgPSBmdW5jdGlvbiAobWVudSkge1xuXHRcdCRzdGF0ZS5nbygnYWRtaW4ubWVudScsIHsgbWVudU5hbWU6IG1lbnUgfSk7XG5cdH07XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ01lbnVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBNZW51RmFjdG9yeSkge1xuICBcbiAgJHNjb3BlLmN1cnJlbnRNZW51ID0gJHN0YXRlUGFyYW1zLm1lbnVOYW1lOyAgICBcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gY29uc2lkZXIgcHV0dGluZyB0aGVzZSBpbnRvIHNlcGFyYXRlIGZpbGVzXG5hcHAuZmFjdG9yeSgnTWVudUZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuXHR2YXIgQWRtaW5HZXRDYXRlZ29yeURhdGEgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FkbWluL2NhdGVnb3JpZXMvZGF0YScpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgQWRtaW5VcGRhdGVDYXRlZ29yeURhdGEgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuXG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vY2F0ZWdvcmllcy9kYXRhJywgcGF5bG9hZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBBZG1pbkdldFByb2R1Y3REYXRhID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9hZG1pbi9wcm9kdWN0cy9kYXRhJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBBZG1pblVwZGF0ZVByb2R1Y3REYXRhID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcblxuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2FkbWluL3Byb2R1Y3RzL2RhdGEnLCBwYXlsb2FkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIEFkbWluR2V0T3JkZXJEYXRhID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9hZG1pbi9vcmRlcnMvZGF0YScpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgQWRtaW5VcGRhdGVPcmRlckRhdGEgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuXG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vb3JkZXJzL2RhdGEnLCBwYXlsb2FkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIEFkbWluR2V0VXNlckRhdGEgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FkbWluL3VzZXJzL2RhdGEnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIEFkbWluVXBkYXRlVXNlckRhdGEgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuXG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vdXNlcnMvZGF0YScsIHBheWxvYWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdEFkbWluR2V0Q2F0ZWdvcnlEYXRhOiBBZG1pbkdldENhdGVnb3J5RGF0YSxcblx0XHRBZG1pblVwZGF0ZUNhdGVnb3J5RGF0YTogQWRtaW5VcGRhdGVDYXRlZ29yeURhdGEsXG5cdFx0QWRtaW5HZXRQcm9kdWN0RGF0YTogQWRtaW5HZXRQcm9kdWN0RGF0YSxcblx0XHRBZG1pblVwZGF0ZVByb2R1Y3REYXRhOiBBZG1pblVwZGF0ZVByb2R1Y3REYXRhLFxuXHRcdEFkbWluR2V0T3JkZXJEYXRhOiBBZG1pbkdldE9yZGVyRGF0YSxcblx0XHRBZG1pblVwZGF0ZU9yZGVyRGF0YTogQWRtaW5VcGRhdGVPcmRlckRhdGEsXG5cdFx0QWRtaW5HZXRVc2VyRGF0YTogQWRtaW5HZXRVc2VyRGF0YSxcblx0XHRBZG1pblVwZGF0ZVVzZXJEYXRhOiBBZG1pblVwZGF0ZVVzZXJEYXRhXG5cdH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjcmVhdGUnLCB7XG5cdFx0dXJsOiAnL2NyZWF0ZScsIFxuXHRcdGNvbnRyb2xsZXI6ICdDcmVhdGVDb250cm9sbGVyJyxcblx0XHR0ZW1wbGF0ZVVybDogJ2pzL2NyZWF0ZS9jcmVhdGUuaHRtbCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NyZWF0ZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBDcmVhdGVGYWN0b3J5LCAkaHR0cCkge1xuXG5cdCRzY29wZS5jb21tdW5pY2F0aW9uID0geyBtc2c6ICdQbGVhc2UgZW50ZXIgc29tZSBjcmVkZW50aWFscycgfTtcblxuXHQkc2NvcGUuY3JlYXRlVXNlciA9IGZ1bmN0aW9uKG5ld1VzZXJEYXRhKSB7XG5cdFx0Q3JlYXRlRmFjdG9yeS5jcmVhdGVOZXdVc2VyKG5ld1VzZXJEYXRhKS50aGVuKGZ1bmN0aW9uIChyZXR1cm5Nc2cpIHtcblx0XHRcdCRzY29wZS5jb21tdW5pY2F0aW9uLm1zZyA9IHJldHVybk1zZztcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdH0pO1xuXHR9XHRcblxuXHQkc2NvcGUuZmJMb2dpbiA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCdhdXRoL2ZhY2Vib29rJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiSEVSRVJFXCIsIHJlc3BvbnNlKTtcblx0XHRcdC8vcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0NyZWF0ZUZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuXHR2YXIgY3JlYXRlTmV3VXNlciA9IGZ1bmN0aW9uIChuZXdVc2VyRGF0YSkge1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2NyZWF0ZS9uZXd1c2VyJywgbmV3VXNlckRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGNyZWF0ZU5ld1VzZXI6IGNyZWF0ZU5ld1VzZXJcblx0fTtcblxuXG5cbn0pO1xuXG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2xvZ2luL2xvZ2luLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIEF1dGhTZXJ2aWNlLCAkc3RhdGUpIHtcblxuICAgICRzY29wZS5sb2dpbiA9IHt9O1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAkc2NvcGUuc2VuZExvZ2luID0gZnVuY3Rpb24gKGxvZ2luSW5mbykge1xuXG4gICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAgICAgQXV0aFNlcnZpY2UubG9naW4obG9naW5JbmZvKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSAnSW52YWxpZCBsb2dpbiBjcmVkZW50aWFscy4nO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbn0pOyIsIlxuXG4vL3ZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnUHJvZHVjdCcsIFtdKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdCcsIHtcblx0XHR1cmw6ICcvcHJvZHVjdCcsXG5cdFx0dGVtcGxhdGVVcmw6ICdqcy9wcm9kdWN0L3Byb2R1Y3QuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ1Byb2R1Y3RDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcihcIlByb2R1Y3RDdHJsXCIsIGZ1bmN0aW9uICgkc2NvcGUsIFByb2R1Y3RGYWN0b3J5KXtcblx0UHJvZHVjdEZhY3RvcnkuZ2V0U2hvZXMoKS50aGVuKGZ1bmN0aW9uIChzaG9lcykge1xuXHRcdCRzY29wZS5wcm9kdWN0cyA9IHNob2VzO1xuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnUHJvZHVjdEZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICAgIHZhciBnZXRTaG9lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcHJvZHVjdHMvc2hvZXMnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRTaG9lczogZ2V0U2hvZXNcbiAgICB9O1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoXCJQYW5lbENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSkge1xuXHQkc2NvcGUudGFiID0gMTtcblxuXHQkc2NvcGUuc2VsZWN0ZWRUYWIgPSBmdW5jdGlvbihzZXRUYWIpIHtcblx0XHQkc2NvcGUudGFiID0gc2V0VGFiO1xuXHR9O1xuXG5cdCRzY29wZS5pc1NlbGVjdGVkID0gZnVuY3Rpb24oY2hlY2tUYWIpIHtcblx0XHRyZXR1cm4gJHNjb3BlLnRhYiA9PT0gY2hlY2tUYWI7XG5cdH07XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcihcIlJldmlld0NvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSkge1xuXHQkc2NvcGUucmV2aWV3ID0ge307XG5cblx0JHNjb3BlLmFkZFJldmlldyA9IGZ1bmN0aW9uKHByb2R1Y3QpIHtcblx0XHRwcm9kdWN0LnJldmlld3MucHVzaCgkc2NvcGUucmV2aWV3KTtcblx0XHQkc2NvcGUucmV2aWV3ID0ge307XG5cdH07XG59KTtcblxudmFyIHNob2VzID0gW3tcblx0bmFtZTogJ05pa2UgQWlyIEpvcmRhbiBYSSBcIjQ1XCIgU2FtcGxlJyxcblx0aW1hZ2U6IFwiaHR0cDovL2ltYWdlcy5jb21wbGV4LmNvbS9jb21wbGV4L2ltYWdlL3VwbG9hZC90X2FydGljbGVfaW1hZ2UveHp3M3RwN2szOWxsZDRoMmV1MjMuanBnXCIsXG5cdGRlc2NyaXB0aW9uOiAnTWljaGFlbCBKb3JkYW4gd29yZSB0aGlzIHNuZWFrZXJzIGluIHRoZSBlYXJseSAxOTkwcy4gT2YgYWxsIHRoZSBzYW1wbGVzIG9mIEFpciBKb3JkYW5zLCB0aGUgXCI0NVwiIFhJcyByZW1haW4gdGhlIG1vc3QgY292ZXRlZCcgLFxuXHRjYXRlZ29yeTogXCJKb3JkYW5zXCIsXG5cdHByaWNlOiA1MDAuMDAsXG5cdFJldmlld3M6IFwiXCJcbn1dO1xuXG5cblxuXG5cblxuLy8vLy8vLy8vXG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWVtYmVyc09ubHknLCB7XG4gICAgICAgIHVybDogJy9tZW1iZXJzLWFyZWEnLFxuICAgICAgICB0ZW1wbGF0ZTogJzxpbWcgbmctcmVwZWF0PVwiaXRlbSBpbiBzdGFzaFwiIHdpZHRoPVwiMzAwXCIgbmctc3JjPVwie3sgaXRlbSB9fVwiIC8+JyxcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgU2VjcmV0U3Rhc2gpIHtcbiAgICAgICAgICAgIFNlY3JldFN0YXNoLmdldFN0YXNoKCkudGhlbihmdW5jdGlvbiAoc3Rhc2gpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3Rhc2ggPSBzdGFzaDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGRhdGEuYXV0aGVudGljYXRlIGlzIHJlYWQgYnkgYW4gZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgLy8gdGhhdCBjb250cm9scyBhY2Nlc3MgdG8gdGhpcyBzdGF0ZS4gUmVmZXIgdG8gYXBwLmpzLlxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhdXRoZW50aWNhdGU6IHRydWVcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KTtcblxuYXBwLmZhY3RvcnkoJ1NlY3JldFN0YXNoJywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgICB2YXIgZ2V0U3Rhc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbWVtYmVycy9zZWNyZXQtc3Rhc2gnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRTdGFzaDogZ2V0U3Rhc2hcbiAgICB9O1xuXG59KTsiLCIoZnVuY3Rpb24gKCkge1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBIb3BlIHlvdSBkaWRuJ3QgZm9yZ2V0IEFuZ3VsYXIhIER1aC1kb3kuXG4gIGlmICghd2luZG93LmFuZ3VsYXIpIHRocm93IG5ldyBFcnJvcignSSBjYW5cXCd0IGZpbmQgQW5ndWxhciEnKTtcblxuICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2ZzYVByZUJ1aWx0JywgW10pO1xuXG4gIGFwcC5mYWN0b3J5KCdTb2NrZXQnLCBmdW5jdGlvbiAoJGxvY2F0aW9uKSB7XG5cbiAgICAgIGlmICghd2luZG93LmlvKSB0aHJvdyBuZXcgRXJyb3IoJ3NvY2tldC5pbyBub3QgZm91bmQhJyk7XG5cbiAgICAgIHZhciBzb2NrZXQ7XG5cbiAgICAgIGlmICgkbG9jYXRpb24uJCRwb3J0KSB7XG4gICAgICAgICAgc29ja2V0ID0gaW8oJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzb2NrZXQgPSBpbygnLycpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc29ja2V0O1xuXG4gIH0pO1xuXG4gIC8vIEFVVEhfRVZFTlRTIGlzIHVzZWQgdGhyb3VnaG91dCBvdXIgYXBwIHRvXG4gIC8vIGJyb2FkY2FzdCBhbmQgbGlzdGVuIGZyb20gYW5kIHRvIHRoZSAkcm9vdFNjb3BlXG4gIC8vIGZvciBpbXBvcnRhbnQgZXZlbnRzIGFib3V0IGF1dGhlbnRpY2F0aW9uIGZsb3cuXG4gIGFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICBsb2dpblN1Y2Nlc3M6ICdhdXRoLWxvZ2luLXN1Y2Nlc3MnLFxuICAgICAgbG9naW5GYWlsZWQ6ICdhdXRoLWxvZ2luLWZhaWxlZCcsXG4gICAgICBsb2dvdXRTdWNjZXNzOiAnYXV0aC1sb2dvdXQtc3VjY2VzcycsXG4gICAgICBzZXNzaW9uVGltZW91dDogJ2F1dGgtc2Vzc2lvbi10aW1lb3V0JyxcbiAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICB9KTtcblxuICBhcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgdmFyIHN0YXR1c0RpY3QgPSB7XG4gICAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCxcbiAgICAgICAgICA0MTk6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LFxuICAgICAgICAgIDQ0MDogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXRcbiAgICAgIH07XG4gICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgIH1cbiAgICAgIH07XG4gIH0pO1xuXG4gIGFwcC5jb25maWcoZnVuY3Rpb24gKCRodHRwUHJvdmlkZXIpIHtcbiAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goW1xuICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5nZXQoJ0F1dGhJbnRlcmNlcHRvcicpO1xuICAgICAgICAgIH1cbiAgICAgIF0pO1xuICB9KTtcblxuICBhcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIFNlc3Npb24sICRyb290U2NvcGUsIEFVVEhfRVZFTlRTLCAkcSkge1xuXG4gICAgICAvLyBVc2VzIHRoZSBzZXNzaW9uIGZhY3RvcnkgdG8gc2VlIGlmIGFuXG4gICAgICAvLyBhdXRoZW50aWNhdGVkIHVzZXIgaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQuXG4gICAgICB0aGlzLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gISFTZXNzaW9uLnVzZXI7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmdldExvZ2dlZEluVXNlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgIC8vIElmIGFuIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbiBleGlzdHMsIHdlXG4gICAgICAgICAgLy8gcmV0dXJuIHRoZSB1c2VyIGF0dGFjaGVkIHRvIHRoYXQgc2Vzc2lvblxuICAgICAgICAgIC8vIHdpdGggYSBwcm9taXNlLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSBjYW5cbiAgICAgICAgICAvLyBhbHdheXMgaW50ZXJmYWNlIHdpdGggdGhpcyBtZXRob2QgYXN5bmNocm9ub3VzbHkuXG4gICAgICAgICAgaWYgKHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oU2Vzc2lvbi51c2VyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBNYWtlIHJlcXVlc3QgR0VUIC9zZXNzaW9uLlxuICAgICAgICAgIC8vIElmIGl0IHJldHVybnMgYSB1c2VyLCBjYWxsIG9uU3VjY2Vzc2Z1bExvZ2luIHdpdGggdGhlIHJlc3BvbnNlLlxuICAgICAgICAgIC8vIElmIGl0IHJldHVybnMgYSA0MDEgcmVzcG9uc2UsIHdlIGNhdGNoIGl0IGFuZCBpbnN0ZWFkIHJlc29sdmUgdG8gbnVsbC5cbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2Vzc2lvbicpLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfSk7XG5cbiAgICAgIH07XG5cbiAgICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgY3JlZGVudGlhbHMpXG4gICAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKVxuICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHsgbWVzc2FnZTogJ0ludmFsaWQgbG9naW4gY3JlZGVudGlhbHMuJyB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvbG9nb3V0JykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIFNlc3Npb24uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9nb3V0U3VjY2Vzcyk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBvblN1Y2Nlc3NmdWxMb2dpbihyZXNwb25zZSkge1xuICAgICAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICBTZXNzaW9uLmNyZWF0ZShkYXRhLmlkLCBkYXRhLnVzZXIpO1xuICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MpO1xuICAgICAgICAgIHJldHVybiBkYXRhLnVzZXI7XG4gICAgICB9XG5cbiAgfSk7XG5cbiAgYXBwLnNlcnZpY2UoJ1Nlc3Npb24nLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICB9KTtcblxuICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLmRlc3Ryb3koKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgIHRoaXMudXNlciA9IG51bGw7XG5cbiAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHNlc3Npb25JZCwgdXNlcikge1xuICAgICAgICAgIHRoaXMuaWQgPSBzZXNzaW9uSWQ7XG4gICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgfTtcblxuICB9KTtcblxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3R1dG9yaWFsJywge1xuICAgICAgICB1cmw6ICcvdHV0b3JpYWwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVHV0b3JpYWxDdHJsJyxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgdHV0b3JpYWxJbmZvOiBmdW5jdGlvbiAoVHV0b3JpYWxGYWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR1dG9yaWFsRmFjdG9yeS5nZXRUdXRvcmlhbFZpZGVvcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuZmFjdG9yeSgnVHV0b3JpYWxGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRUdXRvcmlhbFZpZGVvczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90dXRvcmlhbC92aWRlb3MnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1R1dG9yaWFsQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHR1dG9yaWFsSW5mbykge1xuXG4gICAgJHNjb3BlLnNlY3Rpb25zID0gdHV0b3JpYWxJbmZvLnNlY3Rpb25zO1xuICAgICRzY29wZS52aWRlb3MgPSBfLmdyb3VwQnkodHV0b3JpYWxJbmZvLnZpZGVvcywgJ3NlY3Rpb24nKTtcblxuICAgICRzY29wZS5jdXJyZW50U2VjdGlvbiA9IHsgc2VjdGlvbjogbnVsbCB9O1xuXG4gICAgJHNjb3BlLmNvbG9ycyA9IFtcbiAgICAgICAgJ3JnYmEoMzQsIDEwNywgMjU1LCAwLjEwKScsXG4gICAgICAgICdyZ2JhKDIzOCwgMjU1LCA2OCwgMC4xMSknLFxuICAgICAgICAncmdiYSgyMzQsIDUxLCAyNTUsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjU1LCAxOTMsIDczLCAwLjExKScsXG4gICAgICAgICdyZ2JhKDIyLCAyNTUsIDEsIDAuMTEpJ1xuICAgIF07XG5cbiAgICAkc2NvcGUuZ2V0VmlkZW9zQnlTZWN0aW9uID0gZnVuY3Rpb24gKHNlY3Rpb24sIHZpZGVvcykge1xuICAgICAgICByZXR1cm4gdmlkZW9zLmZpbHRlcihmdW5jdGlvbiAodmlkZW8pIHtcbiAgICAgICAgICAgIHJldHVybiB2aWRlby5zZWN0aW9uID09PSBzZWN0aW9uO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3RzJywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdHMnLFxuICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdHNDdHJsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9wcm9kdWN0cy9wcm9kdWN0cy5odG1sJ1xuXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1Byb2R1Y3RzQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIFByb2R1Y3RGYWN0b3J5LCBDYXJ0RmFjdG9yeSkge1xuICAgICRzY29wZS5sZWFybk1vcmUgPSBmYWxzZTtcblxuXHRQcm9kdWN0RmFjdG9yeS5nZXRTaG9lcygpLnRoZW4oZnVuY3Rpb24gKHNob2VzKSB7XG5cdFx0JHNjb3BlLnByb2R1Y3RzID0gc2hvZXM7XG4gICAgICAgIC8vICRzY29wZS5wcm9kdWN0cy5tYXAoZnVuY3Rpb24oZWxlbSl7XG4gICAgICAgIC8vICAgICBlbGVtLlJldmlld3MgPSBbXTtcbiAgICAgICAgLy8gfSlcblxuXHR9KTtcblxuICAgICRzY29wZS5zaG93SW5mbyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5sZWFybk1vcmUgPSAhJHNjb3BlLmxlYXJuTW9yZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAkc2NvcGUuYWRkVG9DYXJ0ID0gZnVuY3Rpb24oaXRlbSl7XG5cbiAgICAgICAgQ2FydEZhY3RvcnkucG9zdENhcnQoaXRlbSkudGhlbihmdW5jdGlvbihjYXJ0KXtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjYXJ0KTtcbiAgICAgICAgICAvLyAkc2NvcGUuY2FydC5pdGVtcy5wdXNoKGNhcnQpO1xuICAgICAgICAgICAgJHNjb3BlLmNhcnQgPSBjYXJ0O1xuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdQcm9kdWN0RmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgdmFyIGdldFNob2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wcm9kdWN0cy9zaG9lcycpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgICB2YXIgcG9zdENhcnQgPSBmdW5jdGlvbihwYXlsb2FkKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvY2FydC9pdGVtcycsIHBheWxvYWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXG4gICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFNob2VzOiBnZXRTaG9lcyxcbiAgICAgICAgcG9zdENhcnQ6IHBvc3RDYXJ0XG4gICAgfTtcblxufSk7XG5cbi8vIGFwcC5mYWN0b3J5KCdSZXZpZXdzRmFjdG9yeScsIGZ1bmN0aW9uIClcbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdSYW5kb21HcmVldGluZ3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZ2V0UmFuZG9tRnJvbUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbiAgICB9O1xuXG4gICAgdmFyIGdyZWV0aW5ncyA9IFtcbiAgICAgICAgJ0hlbGxvLCB3b3JsZCEnLFxuICAgICAgICAnQXQgbG9uZyBsYXN0LCBJIGxpdmUhJyxcbiAgICAgICAgJ0hlbGxvLCBzaW1wbGUgaHVtYW4uJyxcbiAgICAgICAgJ1doYXQgYSBiZWF1dGlmdWwgZGF5IScsXG4gICAgICAgICdJXFwnbSBsaWtlIGFueSBvdGhlciBwcm9qZWN0LCBleGNlcHQgdGhhdCBJIGFtIHlvdXJzLiA6KScsXG4gICAgICAgICdUaGlzIGVtcHR5IHN0cmluZyBpcyBmb3IgTGluZHNheSBMZXZpbmUuJ1xuICAgIF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBncmVldGluZ3M6IGdyZWV0aW5ncyxcbiAgICAgICAgZ2V0UmFuZG9tR3JlZXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Gcm9tQXJyYXkoZ3JlZXRpbmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ2FkbWluQ2F0ZWdvcmllcycsIGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fY2F0ZWdvcmllcy5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQWRtaW5DYXRlZ29yeUN0cmwnXG4gIH07XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWRtaW5DYXRlZ29yeUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBNZW51RmFjdG9yeSkge1xuXG5cdCRzY29wZS5jYXRlZ29yeURhdGEgPSB7IGJyYW5kczogW10gfTtcbiAgJHNjb3BlLmNhdGVnb3J5Q29tbXMgPSB7IG1zZzogJ0VudGVyIGEgbmV3IGNhdGVnb3J5JyB9O1xuXG5cdE1lbnVGYWN0b3J5LkFkbWluR2V0Q2F0ZWdvcnlEYXRhKCkudGhlbihmdW5jdGlvbiAoY2F0ZWdvcnlEYXRhKSB7XG5cdFx0JHNjb3BlLmNhdGVnb3J5RGF0YS5icmFuZHMgPSBjYXRlZ29yeURhdGE7XG5cdH0pO1xuXG5cdCRzY29wZS5uZXdDYXRlZ29yeSA9IGZ1bmN0aW9uIChuZXdDYXRlZ29yeURhdGEpIHtcblx0XHRNZW51RmFjdG9yeS5BZG1pblVwZGF0ZUNhdGVnb3J5RGF0YShuZXdDYXRlZ29yeURhdGEpXG5cdFx0LnRoZW4oZnVuY3Rpb24gKHJldHVybk1zZykge1xuXHRcdFx0JHNjb3BlLmNhdGVnb3J5Q29tbXMubXNnID0gcmV0dXJuTXNnO1xuXHRcdFx0TWVudUZhY3RvcnkuQWRtaW5HZXRDYXRlZ29yeURhdGEoKS50aGVuKGZ1bmN0aW9uIChjYXRlZ29yeURhdGEpIHtcblx0XHRcdFx0JHNjb3BlLmNhdGVnb3J5RGF0YS5icmFuZHMgPSBjYXRlZ29yeURhdGE7XG5cdFx0XHR9KTtcdFxuXHRcdH0pO1xuXHR9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnYWRtaW5PcmRlcnMnLCBmdW5jdGlvbiAoKSB7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlVXJsOiAnanMvYWRtaW4vdGVtcGxhdGVzL2FkbWluX29yZGVycy5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgIFxuICAgIH1cbiAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnYWRtaW5Qcm9kdWN0cycsIGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fcHJvZHVjdHMuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0FkbWluUHJvZHVjdEN0cmwnXG4gIH07XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWRtaW5Qcm9kdWN0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIE1lbnVGYWN0b3J5KSB7XG5cblx0JHNjb3BlLnByb2R1Y3REYXRhID0geyBpdGVtczogW10gfTtcbiAgJHNjb3BlLnByb2R1Y3RDb21tcyA9IHsgbXNnOiAnRW50ZXIgbmV3IHByb2R1Y3QgZGV0YWlscycgfTtcblxuICBNZW51RmFjdG9yeS5BZG1pbkdldENhdGVnb3J5RGF0YSgpLnRoZW4oZnVuY3Rpb24gKGNhdGVnb3J5RGF0YSkge1xuICBcdCRzY29wZS5jYXRlZ29yeURhdGEuYnJhbmRzID0gY2F0ZWdvcnlEYXRhO1xuICB9KTtcblxuXHRNZW51RmFjdG9yeS5BZG1pbkdldFByb2R1Y3REYXRhKCkudGhlbihmdW5jdGlvbiAocHJvZHVjdERhdGEpIHtcblx0XHQkc2NvcGUucHJvZHVjdERhdGEuaXRlbXMgPSBwcm9kdWN0RGF0YTtcblx0fSk7XG5cblx0JHNjb3BlLm5ld1Byb2R1Y3QgPSBmdW5jdGlvbiAobmV3UHJvZHVjdERhdGEpIHtcblx0XHRjb25zb2xlLmxvZyhuZXdQcm9kdWN0RGF0YSk7XG5cdFx0TWVudUZhY3RvcnkuQWRtaW5VcGRhdGVQcm9kdWN0RGF0YShuZXdQcm9kdWN0RGF0YSlcblx0XHQudGhlbihmdW5jdGlvbiAocmV0dXJuTXNnKSB7XG5cdFx0XHQkc2NvcGUucHJvZHVjdENvbW1zLm1zZyA9IHJldHVybk1zZztcblx0XHRcdE1lbnVGYWN0b3J5LkFkbWluR2V0UHJvZHVjdERhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9kdWN0RGF0YSkge1xuXHRcdFx0XHQkc2NvcGUucHJvZHVjdERhdGEuaXRlbXMgPSBwcm9kdWN0RGF0YTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnYWRtaW5Vc2VycycsIGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fdXNlcnMuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0FkbWluVXNlckN0cmwnXG4gIH07XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FkbWluVXNlckN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBNZW51RmFjdG9yeSkge1xuXG5cdCRzY29wZS51c2VyRGF0YSA9IHsgdXNlcnM6IFtdIH07XG4gICRzY29wZS51c2VyQ29tbXMgPSB7IG1zZzogJ0N1cnJlbnQgVXNlciBBZG1pbmlzdHJhdGl2ZSBSaWdodHMnIH07XG5cbiAgTWVudUZhY3RvcnkuQWRtaW5HZXRVc2VyRGF0YSgpLnRoZW4oZnVuY3Rpb24gKHVzZXJEYXRhKSB7XG4gIFx0JHNjb3BlLnVzZXJEYXRhLnVzZXJzID0gdXNlckRhdGE7XG4gIH0pO1xuXG4gICRzY29wZS5DaGFuZ2VBZG1pbiA9IGZ1bmN0aW9uICh1c2VyQWRtaW5EYXRhKSB7XG4gIFx0TWVudUZhY3RvcnkuQWRtaW5VcGRhdGVVc2VyRGF0YSh1c2VyQWRtaW5EYXRhKVxuICBcdC50aGVuKGZ1bmN0aW9uIChyZXR1cm5Nc2cpIHtcbiAgXHRcdCRzY29wZS51c2VyQ29tbXMubXNnID0gcmV0dXJuTXNnO1xuICBcdH0pO1xuICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIG5hbWU6ICdAJyxcbiAgICAgICAgICAgIHZpZGVvczogJz0nLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ0AnXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi90dXRvcmlhbC1zZWN0aW9uLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKHsgYmFja2dyb3VuZDogc2NvcGUuYmFja2dyb3VuZCB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb25NZW51JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51Lmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgc2VjdGlvbnM6ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuXG4gICAgICAgICAgICBzY29wZS5jdXJyZW50U2VjdGlvbiA9IHNjb3BlLnNlY3Rpb25zWzBdO1xuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShzY29wZS5jdXJyZW50U2VjdGlvbik7XG5cbiAgICAgICAgICAgIHNjb3BlLnNldFNlY3Rpb24gPSBmdW5jdGlvbiAoc2VjdGlvbikge1xuICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTZWN0aW9uID0gc2VjdGlvbjtcbiAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKHNlY3Rpb24pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9XG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3R1dG9yaWFsVmlkZW8nLCBmdW5jdGlvbiAoJHNjZSkge1xuXG4gICAgdmFyIGZvcm1Zb3V0dWJlVVJMID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyArIGlkO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXZpZGVvL3R1dG9yaWFsLXZpZGVvLmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgdmlkZW86ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLnRydXN0ZWRZb3V0dWJlVVJMID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoZm9ybVlvdXR1YmVVUkwoc2NvcGUudmlkZW8ueW91dHViZUlEKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uaHRtbCdcbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnbmF2YmFyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCBBVVRIX0VWRU5UUywgJHN0YXRlKSB7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiB7fSxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG5cbiAgICAgIHNjb3BlLml0ZW1zID0gW1xuICAgICAgICB7IGxhYmVsOiAnSG9tZScsIHN0YXRlOiAnaG9tZScgfSxcbiAgICAgICAgLy8geyBsYWJlbDogJ0Fib3V0Jywgc3RhdGU6ICdhYm91dCcgfSxcbiAgICAgICAgLy8geyBsYWJlbDogJ1R1dG9yaWFsJywgc3RhdGU6ICd0dXRvcmlhbCcgfSxcbiAgICAgICAgeyBsYWJlbDogJ1Byb2R1Y3RzJywgc3RhdGU6ICdwcm9kdWN0cycgfSxcbiAgICAgICAgLy97IGxhYmVsOiAnQ3JlYXRlIEFjY291bnQnLCBzdGF0ZTogJ2NyZWF0ZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ0FjY291bnQnLCBzdGF0ZTogJ2FjY291bnQnLCBhdXRoOiB0cnVlIH0sXG4gICAgICAgIHsgbGFiZWw6ICdBZG1pbicsIHN0YXRlOiAnYWRtaW4nLCBhdXRoOiB0cnVlIH1cbiAgICAgICAgLy97IGxhYmVsOiAnTWVtYmVycyBPbmx5Jywgc3RhdGU6ICdtZW1iZXJzT25seScsIGF1dGg6IHRydWUgfSxcbiAgICAgICAgLy8geyBsYWJlbDogJ0NhcnQnLCBzdGF0ZTogJ2NhcnQnIH1cbiAgICAgIF07XG5cbiAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuXG4gICAgICBzY29wZS5pc0xvZ2dlZEluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICB9O1xuXG4gICAgICBzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBzZXRVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgdmFyIHJlbW92ZVVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuICAgICAgfTtcblxuICAgICAgc2V0VXNlcigpO1xuXG4gICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MsIHNldFVzZXIpO1xuICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9nb3V0U3VjY2VzcywgcmVtb3ZlVXNlcik7XG4gICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgcmVtb3ZlVXNlcik7XG5cbiAgICB9XG4gIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdyYW5kb0dyZWV0aW5nJywgZnVuY3Rpb24gKFJhbmRvbUdyZWV0aW5ncykge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS5ncmVldGluZyA9IFJhbmRvbUdyZWV0aW5ncy5nZXRSYW5kb21HcmVldGluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgncHJvZHVjdEluZm8nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9wcm9kdWN0cy9kaXJlY3RpdmVzL3Byb2R1Y3QtaW5mby9wcm9kdWN0LWluZm8uaHRtbCcsXG4gICAgfTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcihcIlBhbmVsQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICAgJHNjb3BlLnRhYiA9IDE7XG5cbiAgICAkc2NvcGUuc2VsZWN0ZWRUYWIgPSBmdW5jdGlvbihzZXRUYWIpIHtcbiAgICAgICAgJHNjb3BlLnRhYiA9IHNldFRhYjtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmlzU2VsZWN0ZWQgPSBmdW5jdGlvbihjaGVja1RhYikge1xuICAgICAgICByZXR1cm4gJHNjb3BlLnRhYiA9PT0gY2hlY2tUYWI7XG4gICAgfTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKFwiUmV2aWV3Q29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCkgeyAvL3Jldmlld3NcbiAgICAkc2NvcGUucmV2aWV3ID0ge307XG5cbiAgICAkc2NvcGUuYWRkUmV2aWV3ID0gZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICBwcm9kdWN0LnJldmlld3MucHVzaCgkc2NvcGUucmV2aWV3KTtcbiAgICAgICAgcG9zdFJldmlldyhwcm9kdWN0KS50aGVuKGZ1bmN0aW9uKHJldmlldykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzIGlzIHRoZSByZXZpZXchISFcIiwgcmV2aWV3KTtcbiAgICAgICAgfSk7XG4gICAgICAgICRzY29wZS5yZXZpZXcgPSB7fTtcbiAgICB9O1xuXG4gICAgICAgIHZhciBwb3N0UmV2aWV3ID0gZnVuY3Rpb24ocGF5bG9hZCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSEVSUkVSRVJFXCIpO1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnYXBpL3Byb2R1Y3RzL3Nob2VzL3Jldmlld3MnLCBwYXlsb2FkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUEFZTE9BRCBUTyBSRVZJRVc6Pj4+XCIsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgICB9O1xuXG59KTtcblxuLy8gYXBwLmZhY3RvcnkoJ1Byb2R1Y3RGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKXtcblxuXG4vLyB9KTtcblxuXG4vLyB2YXIgZmFjZWJvb2tMb2dpbiA9IGZ1bmN0aW9uKHBheWxvYWQpe1xuLy8gICAgIHJldHVybiAkaHR0cC5wb3N0KCcnKVxuLy8gfVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9