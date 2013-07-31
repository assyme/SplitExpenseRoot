var ZS = ZS || {};

ZS.Storage = ZS.Storage || {};

ZS.Storage.LocalStorage = function(key) {
    if (typeof key == "undefined" || key == null) {
        throw "please initiliaze using key";
    }
    var self = this;
    this.key = key;
    //Constructor
    var initialize = function (k) {
        self.key = k;
        //self.Save(addSampleData); // Remove this code when you dont want to add the dummy data. 
    };

    this.Read = function() {
        console.log("Reading from database");
        var deferred = $.Deferred();
        var returnObject = window.localStorage.getItem(self.key);
        deferred.resolveWith(self, [JSON.parse(returnObject)]);
        return deferred.promise();
    };

    this.Save = function(objectToSave) {
        var deferred = $.Deferred();
        console.log("Saving in local");
        window.localStorage.setItem(self.key, JSON.stringify(objectToSave));
        deferred.resolveWith(self, [objectToSave]);
        return deferred.promise();
    };

    var addSampleData = function() {
        var expenses = [
            { "Id": 1, "Name": "Jeans", "Category": "Clothes", "Amount": 1999, "AddedOnDevice": false },
            { "Id": 2, "Name": "Contact Lenses", "Category": "Health", "Amount": 789, "AddedOnDevice": false },
            { "Id": 3, "Name": "Breakfast", "Category": "Food", "Amount": 25, "AddedOnDevice": true }
        ];
        return expenses;
    }();
    

    initialize(key);
};