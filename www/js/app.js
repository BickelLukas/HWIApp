// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function ($ionicPlatform,$cordovaStatusbar,$ionicPopup,$http,User) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
        $cordovaStatusbar.overlaysWebView(false);
        $cordovaStatusbar.styleHex('#002141');

        var ID;
        User.get(device.uuid).then(function(data) {
            ID = data.id;
            if (ID == null)
            {
                User.post(device.platform,device.uuid).then(function(data) {
                    ID = data;
                    localStorage.setItem("ID",ID);
                });
            }else
                localStorage.setItem("ID",ID);
        });

        var delegate = new cordova.plugins.locationManager.Delegate();
        delegate.didEnterRegion = function (pluginResult) {
            var id = pluginResult.region.identifier;
            $http.get(WebServiceAdress +'rooms').then(function(response) {
                var room;
                response.data.rooms.forEach(function(elem){
                    if (elem.ibeaconMinorid == pluginResult.region.minor)
                        room = elem;
                });
                cordova.plugins.notification.local.schedule({
                    id: id,
                    title: "Willkommen",
                    text: "Du befindest dich im Raum " + room.abbreviation
                });

                cordova.plugins.notification.local.on("click", function (notification) {
                    window.open('#tab/rooms/'+room.id, '_self');
                });
                var data = {begin:moment().format('YYYY-MM-DD hh:mm:ss')};
                $http.post(WebService + "rooms/"+room.id + "/users/"+localStorage.getItem("ID")+"/attendances",data).then(function(response) {
                    var attID = response.data;
                    localStorage.setItem(pluginResult.region.identifier,attID);
                });
            });
        };
        delegate.didExitRegion = function (pluginResult) {
            //$http.get(WebServiceAdress + "foundBeacon/exit");
            //stopRanging(createBeaconRegion());
            $http.get(WebServiceAdress +'rooms').then(function(response) {
                var room;
                response.data.rooms.forEach(function(elem){
                    if (elem.ibeaconMinorid == pluginResult.region.minor)
                        room = elem;

                });
                var data = {end:moment().format('YYYY-MM-DD hh:mm:ss')};
                $http.put(WebService + "rooms/"+room.id + "/users/"+localStorage.getItem("ID")+"/attendances/"+localStorage.getItem(pluginResult.region.identifier),data).then(function(response) { });
            });

            cordova.plugins.notification.local.cancel(pluginResult.region.identifier);
        };
        cordova.plugins.locationManager.requestWhenInUseAuthorization();
        cordova.plugins.locationManager.setDelegate(delegate);
        var beacons = createBeaconRegion();
        for (var i = 0; i < beacons.length; i++) {
            var beacon = beacons[i];
            startScanning(beacon);
        }
        //$http.get(WebServiceAdress + "foundBeacon/started");
     });
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: 'templates/tabs.html'
      })

    // Each tab has its own nav history stack:

    .state('tab.rooms', {
        url: '/rooms/:id',
        views: {
            'tab-rooms': {
                templateUrl: 'templates/tab-rooms.html',
                controller: 'RoomsCtrl'
            }
        }
    })
    .state('tab.info', {
        url: '/info',
        views: {
            'tab-info': {
                templateUrl: 'templates/tab-info.html',
                controller: 'InfoCtrl'
            }
        }
    })
    .state('tab.faq', {
        url: '/faq',
        views: {
            'tab-faq': {
                templateUrl: 'templates/tab-faq.html',
                controller: 'FaqCtrl'
            }
        }
    }).state('tab.eval', {
        url: '/eval',
        views: {
            'tab-eval': {
                templateUrl: 'templates/tab-eval.html',
                controller: 'EvalCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/rooms/');

});
