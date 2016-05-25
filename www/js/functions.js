function createBeaconRegion() {
    var beacons = [];
    for (var i = 1; i <= 8; i++) {
        beacons.push(new cordova.plugins.locationManager.BeaconRegion(
            i.toString(), //ID
            '00000000-0000-0000-0000-000000000000', //UUID
            1, //major
            i //minor
        ));
    }
    return beacons;
}

function startScanning(beaconRegion) {
    enableBluetooth();
    cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
        .fail(console.error)
        .done();
}

function stopScanning(beaconRegion) {
    cordova.plugins.locationManager.stopMonitoringForRegion(beaconRegion)
        .fail(console.error)
        .done();
}

function startRanging(beaconRegion) {
    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
        .fail(console.error)
        .done();
}

function stopRanging(beaconRegion) {
    cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
        .fail(console.error)
        .done();
}

function enableBluetooth() {
    cordova.plugins.locationManager.isBluetoothEnabled()
        .then(function (isEnabled) {
            if (!isEnabled) {
                cordova.plugins.locationManager.enableBluetooth();
            }
        })
        .fail(console.error)
        .done();
}