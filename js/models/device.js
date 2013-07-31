var ZS = ZS || {};

ZS.Model = ZS.Model || {};

ZS.Model.DeviceInfo = function () {

    this.Connection = function () {
        //this function returns the connection type if cordova is loaded. 
        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';

        var networkState = navigator.connection.type;
        return states[networkState];
    };
    this.IsConnected = function () {
        if (this.Connection() == "No network connection") {
            return false;
        } else {
            return true;
        }
    };
};