angular.module('starter.controllers', [])

.controller('RoomsCtrl', function ($scope,$http,$ionicLoading,$ionicPopup,$ionicScrollDelegate,$stateParams, Rooms) {
    $ionicLoading.show({
        template: '<ion-spinner icon="lines"></ion-spinner>'
    });
    Rooms.all().then(function(data) {
        $ionicLoading.hide();
        $scope.rooms = data;
        if ($stateParams.id != null) {
            $scope.rooms.forEach(function(room){
                if (room.id ==$stateParams.id)
                    room.shown = true;
            });
        }
    }, function errorCallback(response) {
        $ionicLoading.hide();
        $ionicPopup.show({
            title: "Ein Fehler ist aufgetreten",
            template: err,
            buttons: [{ text: 'OK' }]
        });
    });

    $scope.resize = function() {$ionicScrollDelegate.resize()};
})
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

.controller('InfoCtrl', function ($scope,$http,$ionicLoading,$ionicPopup,$ionicScrollDelegate, Info) {
    $ionicLoading.show({
        template: '<ion-spinner icon="lines"></ion-spinner>'
    });
    var url = "";
    if(ionic.Platform.isAndroid()){
        url = "/android_asset/www/";
    }
    Info.all().then(function(data) {
        $ionicLoading.hide();
        $scope.infos = data;
        $http.get(url + 'files/stundentafel.html').then(function(res){
            $scope.infos.find(function(info) { return info.title =="Stundentafel"}).html = res.data;
        });
    }, function errorCallback(response) {
        $ionicLoading.hide();
        $ionicPopup.show({
            title: "Ein Fehler ist aufgetreten",
            template: err,
            buttons: [{ text: 'OK' }]
        });
    });

    $scope.resize = function() {$ionicScrollDelegate.resize()};

    $scope.openLink = function(link) {
        if(ionic.Platform.isAndroid()){
            navigator.app.loadUrl(encodeURI(link), {openExternal : true});
        }else {
            window.open(encodeURI(link), '_system');
        }

    };
})

.controller('FaqCtrl', function ($scope,$ionicLoading,$ionicPopup, FAQs) {
    $ionicLoading.show({
        template: '<ion-spinner icon="lines"></ion-spinner>'
    });
    FAQs.all().then(function(data) {
        $ionicLoading.hide();
        $scope.faqs = data;
    }, function errorCallback(response) {
        $ionicLoading.hide();
        $ionicPopup.show({
            title: "Ein Fehler ist aufgetreten",
            template: err,
            buttons: [{ text: 'OK' }]
        });
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
})

.controller('EvalCtrl', function ($scope,$ionicLoading,$ionicPopup,$ionicScrollDelegate, Eval) {
    $ionicLoading.show({
        template: '<ion-spinner icon="lines"></ion-spinner>'
    });
    Eval.check(localStorage.getItem("ID")).then(function(data) {
        if (data.length > 0) {
            $ionicLoading.hide();
            if (localStorage.getItem("won") == "true") {
              $scope.already = "Du hast gewonnen!\nHole dein Geschenk beim Ausgang ab!";
            }
            else {
                $scope.already = "Wir haben deine Evaluierung bereits gespeichert!";
            }
        }
        else {
            Eval.all().then(function(data) {
                $ionicLoading.hide();
                $scope.questions = data;
            }, function errorCallback(response) {
                $ionicLoading.hide();
                $ionicPopup.show({
                    title: "Ein Fehler ist aufgetreten",
                    template: err,
                    buttons: [{ text: 'OK' }]
                });
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            });
        }
    }, function errorCallback(response) {
        $ionicLoading.hide();
        $ionicPopup.show({
            title: "Ein Fehler ist aufgetreten",
            template: err,
            buttons: [{ text: 'OK' }]
        });
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });


    $scope.setChoice = function(q,a) {
        $scope.questions.find(function(question){return question.id == q}).answers.forEach(function(element) {
            if (element.id == a)
                element.selected = true;
            else
                element.selected = false;
        }, this);
    }

    $scope.send = function() {
        var response = [];
        $scope.questions.forEach(function(question) {
            question.answers.forEach(function(answer) {
                if (answer.selected){
                    response.push(answer.id);
                }
            }, this);
        }, this);
        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>'
        });
        Eval.post(localStorage.getItem("ID"),response).then(function(data) {
            $ionicLoading.hide();
            $scope.questions = [];
            $scope.already = "Wir haben deine Evaluierung bereits gespeichert!";
            if (data.won) {
                $ionicPopup.show({
                    title: "Herzlichen Glückwunsch",
                    template: "Du hast gewonnen! <br/>Hole dein Geschenk beim Ausgang ab!",
                    buttons: [{ text: 'OK' }]
                });
                $scope.already = "Sie haben gewonnen";
                localStorage.setItem("won","true");
            }
            else {
                $ionicPopup.show({
                    title: "Vielen Dank",
                    template: "Vielen Dank für dein Feedback!",
                    buttons: [{ text: 'OK' }]
                });
                localStorage.setItem("won","false");
            }
        },function errorCallback(error) {
            $ionicPopup.show({
                    title: "Ein Fehler ist aufgetreten",
                    template: err,
                    buttons: [{ text: 'OK' }]
                });
        });
    };

    $scope.resize = function() {$ionicScrollDelegate.resize()};
});
