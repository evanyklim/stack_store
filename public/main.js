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

    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartController',
        templateUrl: 'js/cart/cart.html'
    });
});

app.controller('CartController', function ($scope, CartFactory) {

    $scope.itemsCounter = '';

    CartFactory.getCart().then(function (cart) {
        $scope.cart = cart;
        $scope.itemsCounter = cart.items.length;
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

    $scope.addToCart = function (item) {
        CartFactory.postCart(item).then(function (cart) {
            // console.log(cart);
            // $scope.cart.items.push(cart);
            $scope.cart = cart;
            $scope.itemsCounter = $scope.itemsCounter + 1;
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
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function ($scope, Session) {

    $scope.user = Session.user;
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

    // Register our *about* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'ProductsCtrl',
        templateUrl: 'js/products/products.html'

    });
});

app.controller('ProductsCtrl', function ($scope, ProductFactory) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWNjb3VudC9hY2NvdW50LmpzIiwiYWRtaW4vYWRtaW4uanMiLCJhZG1pbi9tZW51LmpzIiwiY2FydC9jYXJ0LmpzIiwiY2hlY2tvdXQvY2hlY2tvdXQuanMiLCJjcmVhdGUvY3JlYXRlLmpzIiwiZnNhL2ZzYS1wcmUtYnVpbHQuanMiLCJob21lL2hvbWUuanMiLCJsb2dpbi9sb2dpbi5qcyIsIm1lbWJlcnMtb25seS9tZW1iZXJzLW9ubHkuanMiLCJwcm9kdWN0cy9wcm9kdWN0cy5qcyIsInR1dG9yaWFsL3R1dG9yaWFsLmpzIiwiYWRtaW4vZGlyZWN0aXZlcy9hZG1pbl9jYXRlZ29yaWVzLmpzIiwiYWRtaW4vZGlyZWN0aXZlcy9hZG1pbl9vcmRlcnMuanMiLCJhZG1pbi9kaXJlY3RpdmVzL2FkbWluX3Byb2R1Y3RzLmpzIiwiYWRtaW4vZGlyZWN0aXZlcy9hZG1pbl91c2Vycy5qcyIsImNvbW1vbi9mYWN0b3JpZXMvUmFuZG9tR3JlZXRpbmdzLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9Tb2NrZXQuanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uL3R1dG9yaWFsLXNlY3Rpb24uanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51LmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtdmlkZW8vdHV0b3JpYWwtdmlkZW8uanMiLCJjb21tb24vZGlyZWN0aXZlcy9mdWxsc3RhY2stbG9nby9mdWxsc3RhY2stbG9nby5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5qcyIsInByb2R1Y3RzL2RpcmVjdGl2ZXMvcHJvZHVjdC1pbmZvL3Byb2R1Y3QtaW5mby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFBLENBQUE7QUFDQSxJQUFBLEdBQUEsR0FBQSxPQUFBLENBQUEsTUFBQSxDQUFBLHVCQUFBLEVBQUEsQ0FBQSxXQUFBLEVBQUEsYUFBQSxDQUFBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsa0JBQUEsRUFBQSxpQkFBQSxFQUFBOztBQUVBLHFCQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBOztBQUVBLHNCQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOzs7QUFHQSxHQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsVUFBQSxFQUFBLFdBQUEsRUFBQSxNQUFBLEVBQUE7OztBQUdBLFFBQUEsNEJBQUEsR0FBQSxzQ0FBQSxLQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxZQUFBLENBQUE7S0FDQSxDQUFBOzs7O0FBSUEsY0FBQSxDQUFBLEdBQUEsQ0FBQSxtQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUE7O0FBRUEsWUFBQSxDQUFBLDRCQUFBLENBQUEsT0FBQSxDQUFBLEVBQUE7OztBQUdBLG1CQUFBO1NBQ0E7O0FBRUEsWUFBQSxXQUFBLENBQUEsZUFBQSxFQUFBLEVBQUE7OztBQUdBLG1CQUFBO1NBQ0E7OztBQUdBLGFBQUEsQ0FBQSxjQUFBLEVBQUEsQ0FBQTs7QUFFQSxtQkFBQSxDQUFBLGVBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLElBQUEsRUFBQTs7OztBQUlBLGdCQUFBLElBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxDQUFBLENBQUE7YUFDQSxNQUFBO0FBQ0Esc0JBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLENBQUE7YUFDQTtTQUNBLENBQUEsQ0FBQTtLQUVBLENBQUEsQ0FBQTtDQUVBLENBQUEsQ0FBQTtBQ2xEQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOzs7QUFHQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxPQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsUUFBQTtBQUNBLGtCQUFBLEVBQUEsaUJBQUE7QUFDQSxtQkFBQSxFQUFBLHFCQUFBO0tBQ0EsQ0FBQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsaUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQTs7O0FBR0EsVUFBQSxDQUFBLE1BQUEsR0FBQSxDQUNBLHVEQUFBLEVBQ0EscUhBQUEsRUFDQSxpREFBQSxFQUNBLGlEQUFBLEVBQ0EsdURBQUEsRUFDQSx1REFBQSxDQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUN4QkEsWUFBQSxDQUFBO0FBQ0EsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxTQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsVUFBQTtBQUNBLGtCQUFBLEVBQUEsbUJBQUE7QUFDQSxtQkFBQSxFQUFBLHlCQUFBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsbUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxjQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLFlBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQTs7QUFFQSxrQkFBQSxDQUFBLFdBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLGNBQUEsQ0FBQSxRQUFBLEdBQUEsUUFBQSxDQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLGNBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxTQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLFlBQUEsQ0FBQSxHQUFBLEdBQUEsU0FBQSxDQUFBO1NBQ0EsQ0FBQSxTQUFBLENBQUEsVUFBQSxHQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxnQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBOztBQUVBLFFBQUEsV0FBQSxHQUFBLHVCQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLHVCQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLGNBQUEsR0FBQSx3QkFBQSxPQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsdUJBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxXQUFBO0FBQ0EsbUJBQUEsRUFBQSxXQUFBO0FBQ0Esc0JBQUEsRUFBQSxjQUFBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUM5Q0EsWUFBQSxDQUFBO0FBQ0EsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxPQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsUUFBQTtBQUNBLGtCQUFBLEVBQUEsaUJBQUE7QUFDQSxtQkFBQSxFQUFBLHFCQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFlBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxZQUFBO0FBQ0EsbUJBQUEsRUFBQSxvQkFBQTtBQUNBLGtCQUFBLEVBQUEsZ0JBQUE7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxpQkFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQTs7QUFFQSxVQUFBLENBQUEsS0FBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLENBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsQ0FDQSxFQUFBLEtBQUEsRUFBQSxZQUFBLEVBQUEsSUFBQSxFQUFBLFlBQUEsRUFBQSxFQUNBLEVBQUEsS0FBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUEsVUFBQSxFQUFBLEVBQ0EsRUFBQSxLQUFBLEVBQUEsZUFBQSxFQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsRUFDQSxFQUFBLEtBQUEsRUFBQSxhQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxDQUNBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxVQUFBLElBQUEsRUFBQTtBQUNBLGNBQUEsQ0FBQSxFQUFBLENBQUEsWUFBQSxFQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBOztBQUVBLFVBQUEsQ0FBQSxXQUFBLEdBQUEsWUFBQSxDQUFBLFFBQUEsQ0FBQTtDQUVBLENBQUEsQ0FBQTtBQ3BDQSxZQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUE7O0FBRUEsUUFBQSxvQkFBQSxHQUFBLGdDQUFBOztBQUVBLGVBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSw0QkFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSx1QkFBQSxHQUFBLGlDQUFBLE9BQUEsRUFBQTs7QUFFQSxlQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsNEJBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLG1CQUFBLEdBQUEsK0JBQUE7O0FBRUEsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLDBCQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLHNCQUFBLEdBQUEsZ0NBQUEsT0FBQSxFQUFBOztBQUVBLGVBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSwwQkFBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsaUJBQUEsR0FBQSw2QkFBQTs7QUFFQSxlQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsd0JBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsb0JBQUEsR0FBQSw4QkFBQSxPQUFBLEVBQUE7O0FBRUEsZUFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLHdCQUFBLEVBQUEsT0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxnQkFBQSxHQUFBLDRCQUFBOztBQUVBLGVBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSx1QkFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxtQkFBQSxHQUFBLDZCQUFBLE9BQUEsRUFBQTs7QUFFQSxlQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsdUJBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxXQUFBO0FBQ0EsNEJBQUEsRUFBQSxvQkFBQTtBQUNBLCtCQUFBLEVBQUEsdUJBQUE7QUFDQSwyQkFBQSxFQUFBLG1CQUFBO0FBQ0EsOEJBQUEsRUFBQSxzQkFBQTtBQUNBLHlCQUFBLEVBQUEsaUJBQUE7QUFDQSw0QkFBQSxFQUFBLG9CQUFBO0FBQ0Esd0JBQUEsRUFBQSxnQkFBQTtBQUNBLDJCQUFBLEVBQUEsbUJBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBO0FDdEVBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7O0FBRUEsa0JBQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBO0FBQ0EsV0FBQSxFQUFBLE9BQUE7QUFDQSxrQkFBQSxFQUFBLGdCQUFBO0FBQ0EsbUJBQUEsRUFBQSxtQkFBQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLGdCQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsV0FBQSxFQUFBOztBQUVBLFVBQUEsQ0FBQSxZQUFBLEdBQUEsRUFBQSxDQUFBOztBQUVBLGVBQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxJQUFBLEVBQUE7QUFDQSxjQUFBLENBQUEsSUFBQSxHQUFBLElBQUEsQ0FBQTtBQUNBLGNBQUEsQ0FBQSxZQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxNQUFBLENBQUE7S0FDQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLElBQUEsR0FBQSxVQUFBLElBQUEsRUFBQTs7QUFFQSxZQUFBLE9BQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQTtBQUNBLG1CQUFBLENBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLElBQUEsRUFBQTs7O0FBR0Esa0JBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxVQUFBLENBQUEsU0FBQSxHQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsbUJBQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsSUFBQSxFQUFBOzs7QUFHQSxrQkFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7QUFDQSxrQkFBQSxDQUFBLFlBQUEsR0FBQSxNQUFBLENBQUEsWUFBQSxHQUFBLENBQUEsQ0FBQTtTQUVBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsVUFBQSxDQUFBLGNBQUEsR0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLG1CQUFBLENBQUEsY0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxZQUFBO0FBQ0Esa0JBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBO0FBQ0Esb0JBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7O0FBS0EsR0FBQSxDQUFBLE9BQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUE7O0FBRUEsUUFBQSxPQUFBLEdBQUEsbUJBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsWUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxRQUFBLEdBQUEsa0JBQUEsT0FBQSxFQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLGlCQUFBLEVBQUEsT0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxVQUFBLEdBQUEsc0JBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsaUJBQUEsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLGNBQUEsR0FBQSx3QkFBQSxJQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUEsVUFBQSxDQUFBLGlCQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUdBLFdBQUE7QUFDQSxlQUFBLEVBQUEsT0FBQTtBQUNBLGdCQUFBLEVBQUEsUUFBQTtBQUNBLHNCQUFBLEVBQUEsY0FBQTtLQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUNsRkEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxVQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsV0FBQTtBQUNBLG1CQUFBLEVBQUEsMkJBQUE7QUFDQSxrQkFBQSxFQUFBLGNBQUE7S0FDQSxDQUFBLENBQUE7Q0FFQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxjQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsZUFBQSxFQUFBOztBQUVBLG1CQUFBLENBQUEsT0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7S0FDQSxDQUFBLENBQUE7O0FBR0EsVUFBQSxDQUFBLFNBQUEsR0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLHVCQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLElBQUEsRUFBQSxFQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBOztBQUVBLFFBQUEsT0FBQSxHQUFBLG1CQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsVUFBQSxHQUFBLHNCQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxTQUFBLEdBQUEsbUJBQUEsS0FBQSxFQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLGVBQUEsRUFBQSxLQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7O0FBRUEsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBSUEsV0FBQTtBQUNBLGVBQUEsRUFBQSxPQUFBO0FBQ0EsaUJBQUEsRUFBQSxTQUFBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTtBQ2hEQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFFBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxTQUFBO0FBQ0Esa0JBQUEsRUFBQSxrQkFBQTtBQUNBLG1CQUFBLEVBQUEsdUJBQUE7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxrQkFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLGFBQUEsRUFBQSxLQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLGFBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSwrQkFBQSxFQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxVQUFBLFdBQUEsRUFBQTtBQUNBLHFCQUFBLENBQUEsYUFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsYUFBQSxDQUFBLEdBQUEsR0FBQSxTQUFBLENBQUE7U0FDQSxDQUFBLFNBQUEsQ0FBQSxVQUFBLEdBQUEsRUFBQTtBQUNBLG1CQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxVQUFBLENBQUEsT0FBQSxHQUFBLFlBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsZUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsQ0FBQSxHQUFBLENBQUEsUUFBQSxFQUFBLFFBQUEsQ0FBQSxDQUFBOztTQUVBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxlQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUE7O0FBRUEsUUFBQSxhQUFBLEdBQUEsdUJBQUEsV0FBQSxFQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLHFCQUFBLEVBQUEsV0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsV0FBQTtBQUNBLHFCQUFBLEVBQUEsYUFBQTtLQUNBLENBQUE7Q0FJQSxDQUFBLENBQUE7O0FDNUNBLENBQUEsWUFBQTs7QUFFQSxnQkFBQSxDQUFBOzs7QUFHQSxRQUFBLENBQUEsTUFBQSxDQUFBLE9BQUEsRUFBQSxNQUFBLElBQUEsS0FBQSxDQUFBLHdCQUFBLENBQUEsQ0FBQTs7QUFFQSxRQUFBLEdBQUEsR0FBQSxPQUFBLENBQUEsTUFBQSxDQUFBLGFBQUEsRUFBQSxFQUFBLENBQUEsQ0FBQTs7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LFlBQUE7QUFDQSxtQkFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxZQUFBO0FBQ0EsdUJBQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQTtBQUNBLDBCQUFBLENBQUEsVUFBQSxDQUFBLFdBQUEsQ0FBQSxhQUFBLENBQUEsQ0FBQTthQUNBLENBQUEsQ0FBQTtTQUNBLENBQUE7O0FBRUEsaUJBQUEsaUJBQUEsQ0FBQSxRQUFBLEVBQUE7QUFDQSxnQkFBQSxJQUFBLEdBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtBQUNBLG1CQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBO0FBQ0Esc0JBQUEsQ0FBQSxVQUFBLENBQUEsV0FBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBO0FBQ0EsbUJBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBO0tBRUEsQ0FBQSxDQUFBOztBQUVBLE9BQUEsQ0FBQSxPQUFBLENBQUEsU0FBQSxFQUFBLFVBQUEsVUFBQSxFQUFBLFdBQUEsRUFBQTs7QUFFQSxZQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7O0FBRUEsa0JBQUEsQ0FBQSxHQUFBLENBQUEsV0FBQSxDQUFBLGdCQUFBLEVBQUEsWUFBQTtBQUNBLGdCQUFBLENBQUEsT0FBQSxFQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7O0FBRUEsa0JBQUEsQ0FBQSxHQUFBLENBQUEsV0FBQSxDQUFBLGNBQUEsRUFBQSxZQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTs7QUFFQSxZQUFBLENBQUEsRUFBQSxHQUFBLElBQUEsQ0FBQTtBQUNBLFlBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBOztBQUVBLFlBQUEsQ0FBQSxNQUFBLEdBQUEsVUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxFQUFBLEdBQUEsU0FBQSxDQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQTs7QUFFQSxZQUFBLENBQUEsT0FBQSxHQUFBLFlBQUE7QUFDQSxnQkFBQSxDQUFBLEVBQUEsR0FBQSxJQUFBLENBQUE7QUFDQSxnQkFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBO0tBRUEsQ0FBQSxDQUFBO0NBRUEsQ0FBQSxFQUFBLENBQUE7QUMzSUEsWUFBQSxDQUFBO0FBQ0EsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxHQUFBO0FBQ0EsbUJBQUEsRUFBQSxtQkFBQTtBQUNBLGtCQUFBLEVBQUEsVUFBQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLFVBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLElBQUEsR0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBO0NBRUEsQ0FBQSxDQUFBO0FDYkEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxPQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsUUFBQTtBQUNBLG1CQUFBLEVBQUEscUJBQUE7QUFDQSxrQkFBQSxFQUFBLFdBQUE7S0FDQSxDQUFBLENBQUE7Q0FFQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxXQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsV0FBQSxFQUFBLE1BQUEsRUFBQTs7QUFFQSxVQUFBLENBQUEsS0FBQSxHQUFBLEVBQUEsQ0FBQTtBQUNBLFVBQUEsQ0FBQSxLQUFBLEdBQUEsSUFBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxTQUFBLEdBQUEsVUFBQSxTQUFBLEVBQUE7O0FBRUEsY0FBQSxDQUFBLEtBQUEsR0FBQSxJQUFBLENBQUE7O0FBRUEsbUJBQUEsQ0FBQSxLQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFlBQUE7QUFDQSxrQkFBQSxDQUFBLEVBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQTtTQUNBLENBQUEsU0FBQSxDQUFBLFlBQUE7QUFDQSxrQkFBQSxDQUFBLEtBQUEsR0FBQSw0QkFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBRUEsQ0FBQTtDQUVBLENBQUEsQ0FBQTtBQzNCQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLGFBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxlQUFBO0FBQ0EsZ0JBQUEsRUFBQSxtRUFBQTtBQUNBLGtCQUFBLEVBQUEsb0JBQUEsTUFBQSxFQUFBLFdBQUEsRUFBQTtBQUNBLHVCQUFBLENBQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxLQUFBLEdBQUEsS0FBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFBO1NBQ0E7OztBQUdBLFlBQUEsRUFBQTtBQUNBLHdCQUFBLEVBQUEsSUFBQTtTQUNBO0tBQ0EsQ0FBQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxPQUFBLENBQUEsYUFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBOztBQUVBLFFBQUEsUUFBQSxHQUFBLG9CQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLDJCQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxXQUFBO0FBQ0EsZ0JBQUEsRUFBQSxRQUFBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTtBQy9CQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOzs7QUFHQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxVQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsV0FBQTtBQUNBLGtCQUFBLEVBQUEsY0FBQTtBQUNBLG1CQUFBLEVBQUEsMkJBQUE7O0tBRUEsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsY0FBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLGNBQUEsRUFBQTtBQUNBLFVBQUEsQ0FBQSxTQUFBLEdBQUEsS0FBQSxDQUFBOztBQUVBLGtCQUFBLENBQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLFFBQUEsR0FBQSxLQUFBLENBQUE7Ozs7S0FLQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxZQUFBO0FBQ0EsY0FBQSxDQUFBLFNBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxPQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTs7QUFFQSxRQUFBLFFBQUEsR0FBQSxvQkFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxxQkFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7O0FBR0EsUUFBQSxRQUFBLEdBQUEsa0JBQUEsT0FBQSxFQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLGlCQUFBLEVBQUEsT0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsUUFBQSxFQUFBOztBQUVBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFdBQUE7QUFDQSxnQkFBQSxFQUFBLFFBQUE7QUFDQSxnQkFBQSxFQUFBLFFBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOzs7O0FDbERBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7O0FBRUEsa0JBQUEsQ0FBQSxLQUFBLENBQUEsVUFBQSxFQUFBO0FBQ0EsV0FBQSxFQUFBLFdBQUE7QUFDQSxtQkFBQSxFQUFBLDJCQUFBO0FBQ0Esa0JBQUEsRUFBQSxjQUFBO0FBQ0EsZUFBQSxFQUFBO0FBQ0Esd0JBQUEsRUFBQSxzQkFBQSxlQUFBLEVBQUE7QUFDQSx1QkFBQSxlQUFBLENBQUEsaUJBQUEsRUFBQSxDQUFBO2FBQ0E7U0FDQTtLQUNBLENBQUEsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsT0FBQSxDQUFBLGlCQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUE7O0FBRUEsV0FBQTtBQUNBLHlCQUFBLEVBQUEsNkJBQUE7QUFDQSxtQkFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLHNCQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSx1QkFBQSxRQUFBLENBQUEsSUFBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFBO1NBQ0E7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsY0FBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLFlBQUEsRUFBQTs7QUFFQSxVQUFBLENBQUEsUUFBQSxHQUFBLFlBQUEsQ0FBQSxRQUFBLENBQUE7QUFDQSxVQUFBLENBQUEsTUFBQSxHQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsWUFBQSxDQUFBLE1BQUEsRUFBQSxTQUFBLENBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsY0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FDQSwwQkFBQSxFQUNBLDBCQUFBLEVBQ0EsMEJBQUEsRUFDQSwwQkFBQSxFQUNBLHdCQUFBLENBQ0EsQ0FBQTs7QUFFQSxVQUFBLENBQUEsa0JBQUEsR0FBQSxVQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUE7QUFDQSxlQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxLQUFBLEVBQUE7QUFDQSxtQkFBQSxLQUFBLENBQUEsT0FBQSxLQUFBLE9BQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUNqREEsWUFBQSxDQUFBO0FBQ0EsR0FBQSxDQUFBLFNBQUEsQ0FBQSxpQkFBQSxFQUFBLFlBQUE7O0FBRUEsV0FBQTtBQUNBLGdCQUFBLEVBQUEsR0FBQTtBQUNBLG1CQUFBLEVBQUEsMENBQUE7QUFDQSxrQkFBQSxFQUFBLG1CQUFBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsVUFBQSxDQUFBLG1CQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsV0FBQSxFQUFBOztBQUVBLFVBQUEsQ0FBQSxZQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLENBQUE7QUFDQSxVQUFBLENBQUEsYUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLHNCQUFBLEVBQUEsQ0FBQTs7QUFFQSxlQUFBLENBQUEsb0JBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLFlBQUEsRUFBQTtBQUNBLGNBQUEsQ0FBQSxZQUFBLENBQUEsTUFBQSxHQUFBLFlBQUEsQ0FBQTtLQUNBLENBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsV0FBQSxHQUFBLFVBQUEsZUFBQSxFQUFBO0FBQ0EsbUJBQUEsQ0FBQSx1QkFBQSxDQUFBLGVBQUEsQ0FBQSxDQUNBLElBQUEsQ0FBQSxVQUFBLFNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsYUFBQSxDQUFBLEdBQUEsR0FBQSxTQUFBLENBQUE7QUFDQSx1QkFBQSxDQUFBLG9CQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxZQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLFlBQUEsQ0FBQSxNQUFBLEdBQUEsWUFBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTtDQUNBLENBQUEsQ0FBQTtBQzdCQSxZQUFBLENBQUE7QUFDQSxHQUFBLENBQUEsU0FBQSxDQUFBLGFBQUEsRUFBQSxZQUFBOztBQUVBLFdBQUE7QUFDQSxnQkFBQSxFQUFBLEdBQUE7QUFDQSxtQkFBQSxFQUFBLHNDQUFBO0FBQ0EsWUFBQSxFQUFBLGNBQUEsS0FBQSxFQUFBLEVBRUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBO0FDWEEsWUFBQSxDQUFBO0FBQ0EsR0FBQSxDQUFBLFNBQUEsQ0FBQSxlQUFBLEVBQUEsWUFBQTs7QUFFQSxXQUFBO0FBQ0EsZ0JBQUEsRUFBQSxHQUFBO0FBQ0EsbUJBQUEsRUFBQSx3Q0FBQTtBQUNBLGtCQUFBLEVBQUEsa0JBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxVQUFBLENBQUEsa0JBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUE7O0FBRUEsVUFBQSxDQUFBLFdBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQTtBQUNBLFVBQUEsQ0FBQSxZQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsMkJBQUEsRUFBQSxDQUFBOztBQUVBLGVBQUEsQ0FBQSxvQkFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsWUFBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLFlBQUEsQ0FBQSxNQUFBLEdBQUEsWUFBQSxDQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUVBLGVBQUEsQ0FBQSxtQkFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsV0FBQSxFQUFBO0FBQ0EsY0FBQSxDQUFBLFdBQUEsQ0FBQSxLQUFBLEdBQUEsV0FBQSxDQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxlQUFBLENBQUEsR0FBQSxDQUFBLGNBQUEsQ0FBQSxDQUFBO0FBQ0EsbUJBQUEsQ0FBQSxzQkFBQSxDQUFBLGNBQUEsQ0FBQSxDQUNBLElBQUEsQ0FBQSxVQUFBLFNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsWUFBQSxDQUFBLEdBQUEsR0FBQSxTQUFBLENBQUE7QUFDQSx1QkFBQSxDQUFBLG1CQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxXQUFBLEVBQUE7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QUEsR0FBQSxDQUFBLFdBQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxDQUFBLENBQUE7QUFDQSxzQkFBQSxDQUFBLEdBQUEsQ0FBQSxXQUFBLENBQUEsY0FBQSxFQUFBLFVBQUEsQ0FBQSxDQUFBO1NBRUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBO0FDbkRBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxTQUFBLENBQUEsZUFBQSxFQUFBLFVBQUEsZUFBQSxFQUFBOztBQUVBLFdBQUE7QUFDQSxnQkFBQSxFQUFBLEdBQUE7QUFDQSxtQkFBQSxFQUFBLHlEQUFBO0FBQ0EsWUFBQSxFQUFBLGNBQUEsS0FBQSxFQUFBO0FBQ0EsaUJBQUEsQ0FBQSxRQUFBLEdBQUEsZUFBQSxDQUFBLGlCQUFBLEVBQUEsQ0FBQTtTQUNBO0tBQ0EsQ0FBQTtDQUVBLENBQUEsQ0FBQTtBQ1hBLFlBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxTQUFBLENBQUEsYUFBQSxFQUFBLFlBQUE7QUFDQSxXQUFBO0FBQ0EsZ0JBQUEsRUFBQSxHQUFBO0FBQ0EsbUJBQUEsRUFBQSx1REFBQSxFQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxpQkFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBO0FBQ0EsVUFBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFdBQUEsR0FBQSxVQUFBLE1BQUEsRUFBQTtBQUNBLGNBQUEsQ0FBQSxHQUFBLEdBQUEsTUFBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsZUFBQSxNQUFBLENBQUEsR0FBQSxLQUFBLFFBQUEsQ0FBQTtLQUNBLENBQUE7Q0FFQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxrQkFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQTs7QUFDQSxVQUFBLENBQUEsTUFBQSxHQUFBLEVBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsU0FBQSxHQUFBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsZUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQ0Esa0JBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxNQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBLEdBQUEsQ0FBQSx1QkFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0FBQ0EsY0FBQSxDQUFBLE1BQUEsR0FBQSxFQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsVUFBQSxHQUFBLG9CQUFBLE9BQUEsRUFBQTtBQUNBLGVBQUEsQ0FBQSxHQUFBLENBQUEsV0FBQSxDQUFBLENBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsNEJBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBLEdBQUEsQ0FBQSx1QkFBQSxFQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBRUEsQ0FBQSxDQUFBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0Z1bGxzdGFja0dlbmVyYXRlZEFwcCcsIFsndWkucm91dGVyJywgJ2ZzYVByZUJ1aWx0J10pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG59KTtcblxuLy8gVGhpcyBhcHAucnVuIGlzIGZvciBjb250cm9sbGluZyBhY2Nlc3MgdG8gc3BlY2lmaWMgc3RhdGVzLlxuYXBwLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgLy8gVGhlIGdpdmVuIHN0YXRlIHJlcXVpcmVzIGFuIGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICB2YXIgZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICByZXR1cm4gc3RhdGUuZGF0YSAmJiBzdGF0ZS5kYXRhLmF1dGhlbnRpY2F0ZTtcbiAgICB9O1xuXG4gICAgLy8gJHN0YXRlQ2hhbmdlU3RhcnQgaXMgYW4gZXZlbnQgZmlyZWRcbiAgICAvLyB3aGVuZXZlciB0aGUgcHJvY2VzcyBvZiBjaGFuZ2luZyBhIHN0YXRlIGJlZ2lucy5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zKSB7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoKHRvU3RhdGUpKSB7XG4gICAgICAgICAgICAvLyBUaGUgZGVzdGluYXRpb24gc3RhdGUgZG9lcyBub3QgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgLy8gVGhlIHVzZXIgaXMgYXV0aGVudGljYXRlZC5cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYW5jZWwgbmF2aWdhdGluZyB0byBuZXcgc3RhdGUuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgLy8gSWYgYSB1c2VyIGlzIHJldHJpZXZlZCwgdGhlbiByZW5hdmlnYXRlIHRvIHRoZSBkZXN0aW5hdGlvblxuICAgICAgICAgICAgLy8gKHRoZSBzZWNvbmQgdGltZSwgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkgd2lsbCB3b3JrKVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBpZiBubyB1c2VyIGlzIGxvZ2dlZCBpbiwgZ28gdG8gXCJsb2dpblwiIHN0YXRlLlxuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28odG9TdGF0ZS5uYW1lLCB0b1BhcmFtcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcbiAgICAgICAgdXJsOiAnL2Fib3V0JyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWJvdXQvYWJvdXQuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgICAvLyBJbWFnZXMgb2YgYmVhdXRpZnVsIEZ1bGxzdGFjayBwZW9wbGUuXG4gICAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CN2dCWHVsQ0FBQVhRY0UuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vZmJjZG4tc3Bob3Rvcy1jLWEuYWthbWFpaGQubmV0L2hwaG90b3MtYWsteGFwMS90MzEuMC04LzEwODYyNDUxXzEwMjA1NjIyOTkwMzU5MjQxXzgwMjcxNjg4NDMzMTI4NDExMzdfby5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItTEtVc2hJZ0FFeTlTSy5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3OS1YN29DTUFBa3c3eS5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItVWo5Q09JSUFJRkFoMC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I2eUl5RmlDRUFBcWwxMi5qcGc6bGFyZ2UnXG4gICAgXTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWNjb3VudCcsIHtcblx0XHR1cmw6ICcvYWNjb3VudCcsIFxuXHRcdGNvbnRyb2xsZXI6ICdBY2NvdW50Q29udHJvbGxlcicsXG5cdFx0dGVtcGxhdGVVcmw6ICdqcy9hY2NvdW50L2FjY291bnQuaHRtbCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FjY291bnRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQWNjb3VudEZhY3RvcnkpIHtcblxuXHQkc2NvcGUuYWNjb3VudENvbW1zID0geyBtc2c6ICcnIH07XG5cblx0QWNjb3VudEZhY3RvcnkuZ2V0VXNlckluZm8oKS50aGVuKGZ1bmN0aW9uICh1c2VySW5mbykge1xuXHRcdCRzY29wZS51c2VySW5mbyA9IHVzZXJJbmZvO1xuXHR9KTtcblxuXHQkc2NvcGUudXBkYXRlVXNlciA9IGZ1bmN0aW9uICh1c2VySW5mbykge1xuXHRcdEFjY291bnRGYWN0b3J5LnVwZGF0ZVVzZXJJbmZvKHVzZXJJbmZvKS50aGVuKGZ1bmN0aW9uIChyZXR1cm5Nc2cpIHtcblx0XHRcdCRzY29wZS5hY2NvdW50Q29tbXMubXNnID0gcmV0dXJuTXNnO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0fSk7XG5cdH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0FjY291bnRGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cblx0dmFyIGdldFVzZXJJbmZvID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYWNjb3VudC91c2VyaW5mbycpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgdXBkYXRlVXNlckluZm8gPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2FjY291bnQvdXNlcmluZm8nLCBwYXlsb2FkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRnZXRVc2VySW5mbzogZ2V0VXNlckluZm8sXG5cdFx0dXBkYXRlVXNlckluZm86IHVwZGF0ZVVzZXJJbmZvXG5cdH07XG5cbn0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbicsIHtcblx0XHR1cmw6ICcvYWRtaW4nLFxuXHRcdGNvbnRyb2xsZXI6ICdBZG1pbkNvbnRyb2xsZXInLFxuXHRcdHRlbXBsYXRlVXJsOiAnanMvYWRtaW4vYWRtaW4uaHRtbCcgXG5cdH0pO1xuXG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi5tZW51Jywge1xuXHRcdHVybDogJy86bWVudU5hbWUnLFxuXHRcdHRlbXBsYXRlVXJsOiAnanMvYWRtaW4vbWVudS5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnTWVudUNvbnRyb2xsZXInXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBZG1pbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUpIHtcblxuXHQkc2NvcGUuaXRlbXMgPSB7IGRhdGE6IFsnaXRlbSAxJywgJ2l0ZW0gMicsICdpdGVtIDMnXSB9O1xuXG5cdCRzY29wZS5hZG1pbk1lbnVzID0gW1xuXHRcdHsgbGFiZWw6ICdDYXRlZ29yaWVzJywgbWVudTogJ2NhdGVnb3JpZXMnIH0sXG5cdFx0eyBsYWJlbDogJ1Byb2R1Y3RzJywgbWVudTogJ3Byb2R1Y3RzJyB9LFxuXHRcdHsgbGFiZWw6ICdPcmRlciBIaXN0b3J5JywgbWVudTogJ29yZGVycycgfSxcblx0XHR7IGxhYmVsOiAnVXNlciBBZG1pbnMnLCBtZW51OiAndXNlcnMnIH0sXG5cdF07XG5cblx0JHNjb3BlLnN3aXRjaE1lbnUgPSBmdW5jdGlvbiAobWVudSkge1xuXHRcdCRzdGF0ZS5nbygnYWRtaW4ubWVudScsIHsgbWVudU5hbWU6IG1lbnUgfSk7XG5cdH07XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ01lbnVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBNZW51RmFjdG9yeSkge1xuICBcbiAgJHNjb3BlLmN1cnJlbnRNZW51ID0gJHN0YXRlUGFyYW1zLm1lbnVOYW1lOyAgICBcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gY29uc2lkZXIgcHV0dGluZyB0aGVzZSBpbnRvIHNlcGFyYXRlIGZpbGVzXG5hcHAuZmFjdG9yeSgnTWVudUZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuXHR2YXIgQWRtaW5HZXRDYXRlZ29yeURhdGEgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FkbWluL2NhdGVnb3JpZXMvZGF0YScpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgQWRtaW5VcGRhdGVDYXRlZ29yeURhdGEgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuXG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vY2F0ZWdvcmllcy9kYXRhJywgcGF5bG9hZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBBZG1pbkdldFByb2R1Y3REYXRhID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9hZG1pbi9wcm9kdWN0cy9kYXRhJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBBZG1pblVwZGF0ZVByb2R1Y3REYXRhID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcblxuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2FkbWluL3Byb2R1Y3RzL2RhdGEnLCBwYXlsb2FkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIEFkbWluR2V0T3JkZXJEYXRhID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9hZG1pbi9vcmRlcnMvZGF0YScpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgQWRtaW5VcGRhdGVPcmRlckRhdGEgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuXG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vb3JkZXJzL2RhdGEnLCBwYXlsb2FkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIEFkbWluR2V0VXNlckRhdGEgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FkbWluL3VzZXJzL2RhdGEnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIEFkbWluVXBkYXRlVXNlckRhdGEgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuXG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vdXNlcnMvZGF0YScsIHBheWxvYWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdEFkbWluR2V0Q2F0ZWdvcnlEYXRhOiBBZG1pbkdldENhdGVnb3J5RGF0YSxcblx0XHRBZG1pblVwZGF0ZUNhdGVnb3J5RGF0YTogQWRtaW5VcGRhdGVDYXRlZ29yeURhdGEsXG5cdFx0QWRtaW5HZXRQcm9kdWN0RGF0YTogQWRtaW5HZXRQcm9kdWN0RGF0YSxcblx0XHRBZG1pblVwZGF0ZVByb2R1Y3REYXRhOiBBZG1pblVwZGF0ZVByb2R1Y3REYXRhLFxuXHRcdEFkbWluR2V0T3JkZXJEYXRhOiBBZG1pbkdldE9yZGVyRGF0YSxcblx0XHRBZG1pblVwZGF0ZU9yZGVyRGF0YTogQWRtaW5VcGRhdGVPcmRlckRhdGEsXG5cdFx0QWRtaW5HZXRVc2VyRGF0YTogQWRtaW5HZXRVc2VyRGF0YSxcblx0XHRBZG1pblVwZGF0ZVVzZXJEYXRhOiBBZG1pblVwZGF0ZVVzZXJEYXRhXG5cdH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjYXJ0Jywge1xuICAgIHVybDogJy9jYXJ0JyxcbiAgICBjb250cm9sbGVyOiAnQ2FydENvbnRyb2xsZXInLFxuICAgIHRlbXBsYXRlVXJsOiAnanMvY2FydC9jYXJ0Lmh0bWwnXG4gIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDYXJ0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIENhcnRGYWN0b3J5KSB7XG5cbiAgJHNjb3BlLml0ZW1zQ291bnRlciA9ICcnO1xuXG5cdENhcnRGYWN0b3J5LmdldENhcnQoKS50aGVuKGZ1bmN0aW9uIChjYXJ0KSB7XG5cdFx0JHNjb3BlLmNhcnQgPSBjYXJ0O1xuICAgICRzY29wZS5pdGVtc0NvdW50ZXIgPSBjYXJ0Lml0ZW1zLmxlbmd0aDtcblx0fSk7XG5cbiAgJHNjb3BlLnBvc3QgPSBmdW5jdGlvbihpdGVtKXtcbiAgICAvLyBwb3N0IHJlcXVlc3Qgd2lsbCBvbmx5IHdvcmsgd2l0aCBKU09OIHBheWxvYWRcbiAgICB2YXIgcGF5bG9hZCA9IHsgaXRlbXM6IGl0ZW0gfTtcbiAgICBDYXJ0RmFjdG9yeS5wb3N0Q2FydChwYXlsb2FkKS50aGVuKGZ1bmN0aW9uKGNhcnQpe1xuICAgICAgLy8gY29uc29sZS5sb2coY2FydCk7XG4gICAgICAvLyAkc2NvcGUuY2FydC5pdGVtcy5wdXNoKGNhcnQpO1xuICAgICAgJHNjb3BlLmNhcnQgPSBjYXJ0O1xuICAgIH0pO1xuICB9O1xuICBcbiAgJHNjb3BlLmFkZFRvQ2FydCA9IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgQ2FydEZhY3RvcnkucG9zdENhcnQoaXRlbSkudGhlbihmdW5jdGlvbihjYXJ0KXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coY2FydCk7XG4gICAgICAgIC8vICRzY29wZS5jYXJ0Lml0ZW1zLnB1c2goY2FydCk7XG4gICAgICAgICAgJHNjb3BlLmNhcnQgPSBjYXJ0O1xuICAgICAgICAgICAgICAkc2NvcGUuaXRlbXNDb3VudGVyID0gJHNjb3BlLml0ZW1zQ291bnRlciArIDE7XG5cbiAgICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5yZW1vdmVGcm9tQ2FydCA9IGZ1bmN0aW9uKHRoaW5nKXtcbiAgICBDYXJ0RmFjdG9yeS5yZW1vdmVGcm9tQ2FydCh0aGluZykudGhlbihmdW5jdGlvbigpe1xuICAgICAgJHNjb3BlLmNhcnQgPSBjYXJ0O1xuICAgICAgbG9jYXRpb24ucmVsb2FkKCk7IC8vbmVlZCB0byB1c2Ugc29ja2V0cyB0byB1cGRhdGUgaW4gcmVhbC10aW1lIG9uIGRlbGV0aW9uLCBmb3IgbGF0ZXJcbiAgICB9KTtcbiAgfTtcblxufSk7XG5cblxuXG5cbmFwcC5mYWN0b3J5KCdDYXJ0RmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gIHZhciBnZXRDYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2FydC8nKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgcG9zdENhcnQgPSBmdW5jdGlvbihwYXlsb2FkKXtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9jYXJ0L2l0ZW1zJywgcGF5bG9hZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgfTtcblxuICAgdmFyIHRvdGFsUHJpY2UgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2FydC9pdGVtcycpO1xuICAgfTsgXG5cbiAgIHZhciByZW1vdmVGcm9tQ2FydCA9IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnYXBpL2NhcnQvaXRlbXMvJyArIGl0ZW0uX2lkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICB9KTtcbiAgIH07XG5cblxuICByZXR1cm4ge1xuICAgIGdldENhcnQ6IGdldENhcnQsXG4gICAgcG9zdENhcnQ6IHBvc3RDYXJ0LFxuICAgIHJlbW92ZUZyb21DYXJ0OiByZW1vdmVGcm9tQ2FydFxuICB9O1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoZWNrb3V0Jywge1xuICAgICAgICB1cmw6ICcvY2hlY2tvdXQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NoZWNrb3V0L2NoZWNrb3V0Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ2hlY2tvdXRDdHJsJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoZWNrb3V0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIENoZWNrb3V0RmFjdG9yeSkge1xuXG4gICAgQ2hlY2tvdXRGYWN0b3J5LmdldENhcnQoKS50aGVuKGZ1bmN0aW9uIChjYXJ0KSB7XG4gICAgICAgICRzY29wZS5jYXJ0ID0gY2FydDtcbiAgICB9KTtcblxuXG4gICAgJHNjb3BlLnBvc3RQcmljZSA9IGZ1bmN0aW9uKHByaWNlKXtcbiAgICAgICAgICAgICAgQ2hlY2tvdXRGYWN0b3J5LnNlbmRUb3RhbChpdGVtKS50aGVuKGZ1bmN0aW9uKGNhcnQpe30pO1xuICAgIH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0NoZWNrb3V0RmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gIHZhciBnZXRDYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2FydC8nKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgfTtcblxuICAgdmFyIHRvdGFsUHJpY2UgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2FydC9pdGVtcycpO1xuICAgfTsgXG5cbiAgdmFyIHBvc3RQcmljZSA9IGZ1bmN0aW9uKHByaWNlKXtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9jaGVja291dCcsIHByaWNlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblxuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgIH0pO1xuICB9O1xuXG5cblxuICByZXR1cm4ge1xuICAgIGdldENhcnQ6IGdldENhcnQsXG4gICAgcG9zdFByaWNlOiBwb3N0UHJpY2VcbiAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY3JlYXRlJywge1xuXHRcdHVybDogJy9jcmVhdGUnLCBcblx0XHRjb250cm9sbGVyOiAnQ3JlYXRlQ29udHJvbGxlcicsXG5cdFx0dGVtcGxhdGVVcmw6ICdqcy9jcmVhdGUvY3JlYXRlLmh0bWwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDcmVhdGVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQ3JlYXRlRmFjdG9yeSwgJGh0dHApIHtcblxuXHQkc2NvcGUuY29tbXVuaWNhdGlvbiA9IHsgbXNnOiAnUGxlYXNlIGVudGVyIHNvbWUgY3JlZGVudGlhbHMnIH07XG5cblx0JHNjb3BlLmNyZWF0ZVVzZXIgPSBmdW5jdGlvbihuZXdVc2VyRGF0YSkge1xuXHRcdENyZWF0ZUZhY3RvcnkuY3JlYXRlTmV3VXNlcihuZXdVc2VyRGF0YSkudGhlbihmdW5jdGlvbiAocmV0dXJuTXNnKSB7XG5cdFx0XHQkc2NvcGUuY29tbXVuaWNhdGlvbi5tc2cgPSByZXR1cm5Nc2c7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblx0fVx0XG5cblx0JHNjb3BlLmZiTG9naW4gPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnYXV0aC9mYWNlYm9vaycpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkhFUkVSRVwiLCByZXNwb25zZSk7XG5cdFx0XHQvL3JldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pO1xuXHR9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdDcmVhdGVGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cblx0dmFyIGNyZWF0ZU5ld1VzZXIgPSBmdW5jdGlvbiAobmV3VXNlckRhdGEpIHtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9jcmVhdGUvbmV3dXNlcicsIG5ld1VzZXJEYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRjcmVhdGVOZXdVc2VyOiBjcmVhdGVOZXdVc2VyXG5cdH07XG5cblxuXG59KTtcblxuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gSG9wZSB5b3UgZGlkbid0IGZvcmdldCBBbmd1bGFyISBEdWgtZG95LlxuICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB0aHJvdyBuZXcgRXJyb3IoJ0kgY2FuXFwndCBmaW5kIEFuZ3VsYXIhJyk7XG5cbiAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdmc2FQcmVCdWlsdCcsIFtdKTtcblxuICBhcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCRsb2NhdGlvbikge1xuXG4gICAgICBpZiAoIXdpbmRvdy5pbykgdGhyb3cgbmV3IEVycm9yKCdzb2NrZXQuaW8gbm90IGZvdW5kIScpO1xuXG4gICAgICB2YXIgc29ja2V0O1xuXG4gICAgICBpZiAoJGxvY2F0aW9uLiQkcG9ydCkge1xuICAgICAgICAgIHNvY2tldCA9IGlvKCdodHRwOi8vbG9jYWxob3N0OjEzMzcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc29ja2V0ID0gaW8oJy8nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNvY2tldDtcblxuICB9KTtcblxuICAvLyBBVVRIX0VWRU5UUyBpcyB1c2VkIHRocm91Z2hvdXQgb3VyIGFwcCB0b1xuICAvLyBicm9hZGNhc3QgYW5kIGxpc3RlbiBmcm9tIGFuZCB0byB0aGUgJHJvb3RTY29wZVxuICAvLyBmb3IgaW1wb3J0YW50IGV2ZW50cyBhYm91dCBhdXRoZW50aWNhdGlvbiBmbG93LlxuICBhcHAuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICAgICAgbG9naW5TdWNjZXNzOiAnYXV0aC1sb2dpbi1zdWNjZXNzJyxcbiAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgbG9nb3V0U3VjY2VzczogJ2F1dGgtbG9nb3V0LXN1Y2Nlc3MnLFxuICAgICAgc2Vzc2lvblRpbWVvdXQ6ICdhdXRoLXNlc3Npb24tdGltZW91dCcsXG4gICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbiAgfSk7XG5cbiAgYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkcSwgQVVUSF9FVkVOVFMpIHtcbiAgICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsXG4gICAgICAgICAgNDE5OiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCxcbiAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuICB9KTtcblxuICBhcHAuY29uZmlnKGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICBmdW5jdGlvbiAoJGluamVjdG9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICB9XG4gICAgICBdKTtcbiAgfSk7XG5cbiAgYXBwLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLCBTZXNzaW9uLCAkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUywgJHEpIHtcblxuICAgICAgLy8gVXNlcyB0aGUgc2Vzc2lvbiBmYWN0b3J5IHRvIHNlZSBpZiBhblxuICAgICAgLy8gYXV0aGVudGljYXRlZCB1c2VyIGlzIGN1cnJlbnRseSByZWdpc3RlcmVkLlxuICAgICAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICEhU2Vzc2lvbi51c2VyO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5nZXRMb2dnZWRJblVzZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAvLyBJZiBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24gZXhpc3RzLCB3ZVxuICAgICAgICAgIC8vIHJldHVybiB0aGUgdXNlciBhdHRhY2hlZCB0byB0aGF0IHNlc3Npb25cbiAgICAgICAgICAvLyB3aXRoIGEgcHJvbWlzZS4gVGhpcyBlbnN1cmVzIHRoYXQgd2UgY2FuXG4gICAgICAgICAgLy8gYWx3YXlzIGludGVyZmFjZSB3aXRoIHRoaXMgbWV0aG9kIGFzeW5jaHJvbm91c2x5LlxuICAgICAgICAgIGlmICh0aGlzLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKFNlc3Npb24udXNlcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTWFrZSByZXF1ZXN0IEdFVCAvc2Vzc2lvbi5cbiAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgdXNlciwgY2FsbCBvblN1Y2Nlc3NmdWxMb2dpbiB3aXRoIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgNDAxIHJlc3BvbnNlLCB3ZSBjYXRjaCBpdCBhbmQgaW5zdGVhZCByZXNvbHZlIHRvIG51bGwuXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3Nlc3Npb24nKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH0pO1xuXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9sb2dpbicsIGNyZWRlbnRpYWxzKVxuICAgICAgICAgICAgICAudGhlbihvblN1Y2Nlc3NmdWxMb2dpbilcbiAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCh7IG1lc3NhZ2U6ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLicgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gb25TdWNjZXNzZnVsTG9naW4ocmVzcG9uc2UpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgU2Vzc2lvbi5jcmVhdGUoZGF0YS5pZCwgZGF0YS51c2VyKTtcbiAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzKTtcbiAgICAgICAgICByZXR1cm4gZGF0YS51c2VyO1xuICAgICAgfVxuXG4gIH0pO1xuXG4gIGFwcC5zZXJ2aWNlKCdTZXNzaW9uJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuZGVzdHJveSgpO1xuICAgICAgfSk7XG5cbiAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICB0aGlzLnVzZXIgPSBudWxsO1xuXG4gICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChzZXNzaW9uSWQsIHVzZXIpIHtcbiAgICAgICAgICB0aGlzLmlkID0gc2Vzc2lvbklkO1xuICAgICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgIH07XG5cbiAgfSk7XG5cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaG9tZS9ob21lLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgU2Vzc2lvbikge1xuXG5cdCRzY29wZS51c2VyID0gU2Vzc2lvbi51c2VyO1xuXHRcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgJHNjb3BlLmxvZ2luID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zZW5kTG9naW4gPSBmdW5jdGlvbiAobG9naW5JbmZvKSB7XG5cbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihsb2dpbkluZm8pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtZW1iZXJzT25seScsIHtcbiAgICAgICAgdXJsOiAnL21lbWJlcnMtYXJlYScsXG4gICAgICAgIHRlbXBsYXRlOiAnPGltZyBuZy1yZXBlYXQ9XCJpdGVtIGluIHN0YXNoXCIgd2lkdGg9XCIzMDBcIiBuZy1zcmM9XCJ7eyBpdGVtIH19XCIgLz4nLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCBTZWNyZXRTdGFzaCkge1xuICAgICAgICAgICAgU2VjcmV0U3Rhc2guZ2V0U3Rhc2goKS50aGVuKGZ1bmN0aW9uIChzdGFzaCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5zdGFzaCA9IHN0YXNoO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgZGF0YS5hdXRoZW50aWNhdGUgaXMgcmVhZCBieSBhbiBldmVudCBsaXN0ZW5lclxuICAgICAgICAvLyB0aGF0IGNvbnRyb2xzIGFjY2VzcyB0byB0aGlzIHN0YXRlLiBSZWZlciB0byBhcHAuanMuXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0ZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuZmFjdG9yeSgnU2VjcmV0U3Rhc2gnLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICAgIHZhciBnZXRTdGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9tZW1iZXJzL3NlY3JldC1zdGFzaCcpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFN0YXNoOiBnZXRTdGFzaFxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdHMnLCB7XG4gICAgICAgIHVybDogJy9wcm9kdWN0cycsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0c0N0cmwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3Byb2R1Y3RzL3Byb2R1Y3RzLmh0bWwnXG5cbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignUHJvZHVjdHNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgUHJvZHVjdEZhY3RvcnkpIHtcbiAgICAkc2NvcGUubGVhcm5Nb3JlID0gZmFsc2U7XG5cblx0UHJvZHVjdEZhY3RvcnkuZ2V0U2hvZXMoKS50aGVuKGZ1bmN0aW9uIChzaG9lcykge1xuXHRcdCRzY29wZS5wcm9kdWN0cyA9IHNob2VzO1xuICAgICAgICAvLyAkc2NvcGUucHJvZHVjdHMubWFwKGZ1bmN0aW9uKGVsZW0pe1xuICAgICAgICAvLyAgICAgZWxlbS5SZXZpZXdzID0gW107XG4gICAgICAgIC8vIH0pXG5cblx0fSk7XG5cbiAgICAkc2NvcGUuc2hvd0luZm8gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGVhcm5Nb3JlID0gISRzY29wZS5sZWFybk1vcmU7XG4gICAgICAgICAgICB9O1xuXG59KTtcblxuYXBwLmZhY3RvcnkoJ1Byb2R1Y3RGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgICB2YXIgZ2V0U2hvZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3Byb2R1Y3RzL3Nob2VzJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAgIHZhciBwb3N0Q2FydCA9IGZ1bmN0aW9uKHBheWxvYWQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9jYXJ0L2l0ZW1zJywgcGF5bG9hZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0U2hvZXM6IGdldFNob2VzLFxuICAgICAgICBwb3N0Q2FydDogcG9zdENhcnRcbiAgICB9O1xuXG59KTtcblxuLy8gYXBwLmZhY3RvcnkoJ1Jldmlld3NGYWN0b3J5JywgZnVuY3Rpb24gKVxuIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd0dXRvcmlhbCcsIHtcbiAgICAgICAgdXJsOiAnL3R1dG9yaWFsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1R1dG9yaWFsQ3RybCcsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHR1dG9yaWFsSW5mbzogZnVuY3Rpb24gKFR1dG9yaWFsRmFjdG9yeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBUdXRvcmlhbEZhY3RvcnkuZ2V0VHV0b3JpYWxWaWRlb3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KTtcblxuYXBwLmZhY3RvcnkoJ1R1dG9yaWFsRmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0VHV0b3JpYWxWaWRlb3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHV0b3JpYWwvdmlkZW9zJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdUdXRvcmlhbEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCB0dXRvcmlhbEluZm8pIHtcblxuICAgICRzY29wZS5zZWN0aW9ucyA9IHR1dG9yaWFsSW5mby5zZWN0aW9ucztcbiAgICAkc2NvcGUudmlkZW9zID0gXy5ncm91cEJ5KHR1dG9yaWFsSW5mby52aWRlb3MsICdzZWN0aW9uJyk7XG5cbiAgICAkc2NvcGUuY3VycmVudFNlY3Rpb24gPSB7IHNlY3Rpb246IG51bGwgfTtcblxuICAgICRzY29wZS5jb2xvcnMgPSBbXG4gICAgICAgICdyZ2JhKDM0LCAxMDcsIDI1NSwgMC4xMCknLFxuICAgICAgICAncmdiYSgyMzgsIDI1NSwgNjgsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjM0LCA1MSwgMjU1LCAwLjExKScsXG4gICAgICAgICdyZ2JhKDI1NSwgMTkzLCA3MywgMC4xMSknLFxuICAgICAgICAncmdiYSgyMiwgMjU1LCAxLCAwLjExKSdcbiAgICBdO1xuXG4gICAgJHNjb3BlLmdldFZpZGVvc0J5U2VjdGlvbiA9IGZ1bmN0aW9uIChzZWN0aW9uLCB2aWRlb3MpIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvcy5maWx0ZXIoZnVuY3Rpb24gKHZpZGVvKSB7XG4gICAgICAgICAgICByZXR1cm4gdmlkZW8uc2VjdGlvbiA9PT0gc2VjdGlvbjtcbiAgICAgICAgfSk7XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnYWRtaW5DYXRlZ29yaWVzJywgZnVuY3Rpb24gKCkge1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2FkbWluL3RlbXBsYXRlcy9hZG1pbl9jYXRlZ29yaWVzLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdBZG1pbkNhdGVnb3J5Q3RybCdcbiAgfTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBZG1pbkNhdGVnb3J5Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIE1lbnVGYWN0b3J5KSB7XG5cblx0JHNjb3BlLmNhdGVnb3J5RGF0YSA9IHsgYnJhbmRzOiBbXSB9O1xuICAkc2NvcGUuY2F0ZWdvcnlDb21tcyA9IHsgbXNnOiAnRW50ZXIgYSBuZXcgY2F0ZWdvcnknIH07XG5cblx0TWVudUZhY3RvcnkuQWRtaW5HZXRDYXRlZ29yeURhdGEoKS50aGVuKGZ1bmN0aW9uIChjYXRlZ29yeURhdGEpIHtcblx0XHQkc2NvcGUuY2F0ZWdvcnlEYXRhLmJyYW5kcyA9IGNhdGVnb3J5RGF0YTtcblx0fSk7XG5cblx0JHNjb3BlLm5ld0NhdGVnb3J5ID0gZnVuY3Rpb24gKG5ld0NhdGVnb3J5RGF0YSkge1xuXHRcdE1lbnVGYWN0b3J5LkFkbWluVXBkYXRlQ2F0ZWdvcnlEYXRhKG5ld0NhdGVnb3J5RGF0YSlcblx0XHQudGhlbihmdW5jdGlvbiAocmV0dXJuTXNnKSB7XG5cdFx0XHQkc2NvcGUuY2F0ZWdvcnlDb21tcy5tc2cgPSByZXR1cm5Nc2c7XG5cdFx0XHRNZW51RmFjdG9yeS5BZG1pbkdldENhdGVnb3J5RGF0YSgpLnRoZW4oZnVuY3Rpb24gKGNhdGVnb3J5RGF0YSkge1xuXHRcdFx0XHQkc2NvcGUuY2F0ZWdvcnlEYXRhLmJyYW5kcyA9IGNhdGVnb3J5RGF0YTtcblx0XHRcdH0pO1x0XG5cdFx0fSk7XG5cdH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdhZG1pbk9yZGVycycsIGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fb3JkZXJzLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgXG4gICAgfVxuICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdhZG1pblByb2R1Y3RzJywgZnVuY3Rpb24gKCkge1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2FkbWluL3RlbXBsYXRlcy9hZG1pbl9wcm9kdWN0cy5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQWRtaW5Qcm9kdWN0Q3RybCdcbiAgfTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBZG1pblByb2R1Y3RDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgTWVudUZhY3RvcnkpIHtcblxuXHQkc2NvcGUucHJvZHVjdERhdGEgPSB7IGl0ZW1zOiBbXSB9O1xuICAkc2NvcGUucHJvZHVjdENvbW1zID0geyBtc2c6ICdFbnRlciBuZXcgcHJvZHVjdCBkZXRhaWxzJyB9O1xuXG4gIE1lbnVGYWN0b3J5LkFkbWluR2V0Q2F0ZWdvcnlEYXRhKCkudGhlbihmdW5jdGlvbiAoY2F0ZWdvcnlEYXRhKSB7XG4gIFx0JHNjb3BlLmNhdGVnb3J5RGF0YS5icmFuZHMgPSBjYXRlZ29yeURhdGE7XG4gIH0pO1xuXG5cdE1lbnVGYWN0b3J5LkFkbWluR2V0UHJvZHVjdERhdGEoKS50aGVuKGZ1bmN0aW9uIChwcm9kdWN0RGF0YSkge1xuXHRcdCRzY29wZS5wcm9kdWN0RGF0YS5pdGVtcyA9IHByb2R1Y3REYXRhO1xuXHR9KTtcblxuXHQkc2NvcGUubmV3UHJvZHVjdCA9IGZ1bmN0aW9uIChuZXdQcm9kdWN0RGF0YSkge1xuXHRcdGNvbnNvbGUubG9nKG5ld1Byb2R1Y3REYXRhKTtcblx0XHRNZW51RmFjdG9yeS5BZG1pblVwZGF0ZVByb2R1Y3REYXRhKG5ld1Byb2R1Y3REYXRhKVxuXHRcdC50aGVuKGZ1bmN0aW9uIChyZXR1cm5Nc2cpIHtcblx0XHRcdCRzY29wZS5wcm9kdWN0Q29tbXMubXNnID0gcmV0dXJuTXNnO1xuXHRcdFx0TWVudUZhY3RvcnkuQWRtaW5HZXRQcm9kdWN0RGF0YSgpLnRoZW4oZnVuY3Rpb24gKHByb2R1Y3REYXRhKSB7XG5cdFx0XHRcdCRzY29wZS5wcm9kdWN0RGF0YS5pdGVtcyA9IHByb2R1Y3REYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdhZG1pblVzZXJzJywgZnVuY3Rpb24gKCkge1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2FkbWluL3RlbXBsYXRlcy9hZG1pbl91c2Vycy5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQWRtaW5Vc2VyQ3RybCdcbiAgfTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWRtaW5Vc2VyQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIE1lbnVGYWN0b3J5KSB7XG5cblx0JHNjb3BlLnVzZXJEYXRhID0geyB1c2VyczogW10gfTtcbiAgJHNjb3BlLnVzZXJDb21tcyA9IHsgbXNnOiAnQ3VycmVudCBVc2VyIEFkbWluaXN0cmF0aXZlIFJpZ2h0cycgfTtcblxuICBNZW51RmFjdG9yeS5BZG1pbkdldFVzZXJEYXRhKCkudGhlbihmdW5jdGlvbiAodXNlckRhdGEpIHtcbiAgXHQkc2NvcGUudXNlckRhdGEudXNlcnMgPSB1c2VyRGF0YTtcbiAgfSk7XG5cbiAgJHNjb3BlLkNoYW5nZUFkbWluID0gZnVuY3Rpb24gKHVzZXJBZG1pbkRhdGEpIHtcbiAgXHRNZW51RmFjdG9yeS5BZG1pblVwZGF0ZVVzZXJEYXRhKHVzZXJBZG1pbkRhdGEpXG4gIFx0LnRoZW4oZnVuY3Rpb24gKHJldHVybk1zZykge1xuICBcdFx0JHNjb3BlLnVzZXJDb21tcy5tc2cgPSByZXR1cm5Nc2c7XG4gIFx0fSk7XG4gIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnUmFuZG9tR3JlZXRpbmdzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGdldFJhbmRvbUZyb21BcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG4gICAgfTtcblxuICAgIHZhciBncmVldGluZ3MgPSBbXG4gICAgICAgICdIZWxsbywgd29ybGQhJyxcbiAgICAgICAgJ0F0IGxvbmcgbGFzdCwgSSBsaXZlIScsXG4gICAgICAgICdIZWxsbywgc2ltcGxlIGh1bWFuLicsXG4gICAgICAgICdXaGF0IGEgYmVhdXRpZnVsIGRheSEnLFxuICAgICAgICAnSVxcJ20gbGlrZSBhbnkgb3RoZXIgcHJvamVjdCwgZXhjZXB0IHRoYXQgSSBhbSB5b3Vycy4gOiknLFxuICAgICAgICAnVGhpcyBlbXB0eSBzdHJpbmcgaXMgZm9yIExpbmRzYXkgTGV2aW5lLidcbiAgICBdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ3JlZXRpbmdzOiBncmVldGluZ3MsXG4gICAgICAgIGdldFJhbmRvbUdyZWV0aW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0UmFuZG9tRnJvbUFycmF5KGdyZWV0aW5ncyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFwcC5kaXJlY3RpdmUoJ3R1dG9yaWFsU2VjdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgbmFtZTogJ0AnLFxuICAgICAgICAgICAgdmlkZW9zOiAnPScsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAnQCdcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uL3R1dG9yaWFsLXNlY3Rpb24uaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5jc3MoeyBiYWNrZ3JvdW5kOiBzY29wZS5iYWNrZ3JvdW5kIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3R1dG9yaWFsU2VjdGlvbk1lbnUnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXNlY3Rpb24tbWVudS90dXRvcmlhbC1zZWN0aW9uLW1lbnUuaHRtbCcsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBzZWN0aW9uczogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWxDdHJsKSB7XG5cbiAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTZWN0aW9uID0gc2NvcGUuc2VjdGlvbnNbMF07XG4gICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKHNjb3BlLmN1cnJlbnRTZWN0aW9uKTtcblxuICAgICAgICAgICAgc2NvcGUuc2V0U2VjdGlvbiA9IGZ1bmN0aW9uIChzZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuY3VycmVudFNlY3Rpb24gPSBzZWN0aW9uO1xuICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoc2VjdGlvbik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH1cbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgndHV0b3JpYWxWaWRlbycsIGZ1bmN0aW9uICgkc2NlKSB7XG5cbiAgICB2YXIgZm9ybVlvdXR1YmVVUkwgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuICdodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8nICsgaWQ7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtdmlkZW8vdHV0b3JpYWwtdmlkZW8uaHRtbCcsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICB2aWRlbzogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUudHJ1c3RlZFlvdXR1YmVVUkwgPSAkc2NlLnRydXN0QXNSZXNvdXJjZVVybChmb3JtWW91dHViZVVSTChzY29wZS52aWRlby55b3V0dWJlSUQpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ2Z1bGxzdGFja0xvZ28nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9mdWxsc3RhY2stbG9nby9mdWxsc3RhY2stbG9nby5odG1sJ1xuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCduYXZiYXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQXV0aFNlcnZpY2UsIEFVVEhfRVZFTlRTLCAkc3RhdGUpIHtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHt9LFxuICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcblxuICAgICAgc2NvcGUuaXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICAvLyB7IGxhYmVsOiAnQWJvdXQnLCBzdGF0ZTogJ2Fib3V0JyB9LFxuICAgICAgICAvLyB7IGxhYmVsOiAnVHV0b3JpYWwnLCBzdGF0ZTogJ3R1dG9yaWFsJyB9LFxuICAgICAgICB7IGxhYmVsOiAnUHJvZHVjdHMnLCBzdGF0ZTogJ3Byb2R1Y3RzJyB9LFxuICAgICAgICAvL3sgbGFiZWw6ICdDcmVhdGUgQWNjb3VudCcsIHN0YXRlOiAnY3JlYXRlJyB9LFxuICAgICAgICB7IGxhYmVsOiAnQWNjb3VudCcsIHN0YXRlOiAnYWNjb3VudCcsIGF1dGg6IHRydWUgfSxcbiAgICAgICAgeyBsYWJlbDogJ0FkbWluJywgc3RhdGU6ICdhZG1pbicsIGF1dGg6IHRydWUgfVxuICAgICAgICAvL3sgbGFiZWw6ICdNZW1iZXJzIE9ubHknLCBzdGF0ZTogJ21lbWJlcnNPbmx5JywgYXV0aDogdHJ1ZSB9LFxuICAgICAgICAvLyB7IGxhYmVsOiAnQ2FydCcsIHN0YXRlOiAnY2FydCcgfVxuICAgICAgXTtcblxuICAgICAgc2NvcGUudXNlciA9IG51bGw7XG5cbiAgICAgIHNjb3BlLmlzTG9nZ2VkSW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcbiAgICAgIH07XG5cbiAgICAgIHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgdmFyIHNldFVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICBzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgcmVtb3ZlVXNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2NvcGUudXNlciA9IG51bGw7XG4gICAgICB9O1xuXG4gICAgICBzZXRVc2VyKCk7XG5cbiAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLmxvZ2luU3VjY2Vzcywgc2V0VXNlcik7XG4gICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5sb2dvdXRTdWNjZXNzLCByZW1vdmVVc2VyKTtcbiAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LCByZW1vdmVVc2VyKTtcblxuICAgIH1cbiAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3JhbmRvR3JlZXRpbmcnLCBmdW5jdGlvbiAoUmFuZG9tR3JlZXRpbmdzKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL3JhbmRvLWdyZWV0aW5nL3JhbmRvLWdyZWV0aW5nLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLmdyZWV0aW5nID0gUmFuZG9tR3JlZXRpbmdzLmdldFJhbmRvbUdyZWV0aW5nKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdwcm9kdWN0SW5mbycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3Byb2R1Y3RzL2RpcmVjdGl2ZXMvcHJvZHVjdC1pbmZvL3Byb2R1Y3QtaW5mby5odG1sJyxcbiAgICB9O1xufSk7XG5cbmFwcC5jb250cm9sbGVyKFwiUGFuZWxDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgICAkc2NvcGUudGFiID0gMTtcblxuICAgICRzY29wZS5zZWxlY3RlZFRhYiA9IGZ1bmN0aW9uKHNldFRhYikge1xuICAgICAgICAkc2NvcGUudGFiID0gc2V0VGFiO1xuICAgIH07XG5cbiAgICAkc2NvcGUuaXNTZWxlY3RlZCA9IGZ1bmN0aW9uKGNoZWNrVGFiKSB7XG4gICAgICAgIHJldHVybiAkc2NvcGUudGFiID09PSBjaGVja1RhYjtcbiAgICB9O1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoXCJSZXZpZXdDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwKSB7IC8vcmV2aWV3c1xuICAgICRzY29wZS5yZXZpZXcgPSB7fTtcblxuICAgICRzY29wZS5hZGRSZXZpZXcgPSBmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgICAgIHByb2R1Y3QucmV2aWV3cy5wdXNoKCRzY29wZS5yZXZpZXcpO1xuICAgICAgICBwb3N0UmV2aWV3KHByb2R1Y3QpLnRoZW4oZnVuY3Rpb24ocmV2aWV3KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMgaXMgdGhlIHJldmlldyEhIVwiLCByZXZpZXcpO1xuICAgICAgICB9KTtcbiAgICAgICAgJHNjb3BlLnJldmlldyA9IHt9O1xuICAgIH07XG5cbiAgICAgICAgdmFyIHBvc3RSZXZpZXcgPSBmdW5jdGlvbihwYXlsb2FkKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJIRVJSRVJFUkVcIik7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdhcGkvcHJvZHVjdHMvc2hvZXMvcmV2aWV3cycsIHBheWxvYWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQQVlMT0FEIFRPIFJFVklFVzo+Pj5cIiwgcmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgIH07XG5cbn0pO1xuXG4vLyBhcHAuZmFjdG9yeSgnUHJvZHVjdEZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApe1xuXG5cbi8vIH0pO1xuXG5cbi8vIHZhciBmYWNlYm9va0xvZ2luID0gZnVuY3Rpb24ocGF5bG9hZCl7XG4vLyAgICAgcmV0dXJuICRodHRwLnBvc3QoJycpXG4vLyB9XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=