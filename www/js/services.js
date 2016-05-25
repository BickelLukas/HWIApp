angular.module('starter.services', [])

    .factory('Rooms', function ($http) {
        return {
            all: function () {
                var promise = $http.get(WebServiceAdress +'rooms'); //('../files/rooms.json');
                
                //var promise = $http.get('../files/rooms.json');
                promise = promise.then(function (res) {
                    return res.data.rooms;
                }); 
                return promise;
            },
            get: function(id) {
                var promise = $http.get(WebServiceAdress +'rooms/'+id); //('../files/rooms.json');
                
                //var promise = $http.get('../files/rooms.json');
                promise = promise.then(function (res) {
                    return res.data.rooms;
                }); 
                return promise;
            }
        };
    })
    
    .factory('Info', function ($http) {
        return {
            all: function () {
                var promise = $http.get(WebServiceAdress +'infos'); //('../files/rooms.json');
                
                //var promise = $http.get('../files/rooms.json');
                promise = promise.then(function (res) {
                    return res.data.infos;
                }); 
                return promise;
            }
        };
    })
    
    .factory('FAQs', function($http) {
       return {
           all: function() {
                var promise = $http.get(WebServiceAdress +'faqs');
                //var promise = $http.get('../files/faqs.json');
                promise = promise.then(function (res) {
                    return res.data.faqs;
                }); 
                return promise;
           }
       } 
    })
    
    .factory('User', function($http) {
       return {
           get: function(imei) {
                var promise = $http.get(WebServiceAdress +'users/'+imei);
                //var promise = $http.get('../files/faqs.json');
                promise = promise.then(function (res) {
                    return res.data;
                }); 
                return promise;
                
           },
           post: function(platform, imei) {
                var data = {deviceid:imei,device:platform};
                var promise = $http.post(WebServiceAdress +'users',data);
                
                //var promise = $http.get('../files/faqs.json');
                promise = promise.then(function (res) {
                    return res.data;
                }); 
                return promise;
           }
       } 
    })
    
    .factory('Eval', function($http) {
        return {
            check: function (ID) {
                var promise = $http.get(WebServiceAdress +'users/'+ID+"/evals");
                //var promise = $http.get('../files/faqs.json');
                promise = promise.then(function (res) {
                    return res.data;
                }); 
                return promise;
            },
            all: function() {
                var promise = $http.get(WebServiceAdress +'evals');
                //var promise = $http.get('../files/faqs.json');
                promise = promise.then(function (res) {
                    return res.data.evalquestions;
                }); 
                return promise;
            },
            post: function (ID,resp) {
                var data = {responses:resp};
                var promise = $http.post(WebServiceAdress +'users/'+ID+"/evals",data);
                //var promise = $http.get('../files/faqs.json');
                promise = promise.then(function (res) {
                    return res.data;
                }); 
                return promise;
            }
        }  
    });


//var data;
//data.userID = "asdf";
//data.antworten = [1,3,6,7];
//$http.post("",data);