var ZS = ZS || {};

ZS.Storage = ZS.Storage || {};

ZS.Storage.SqlStore = ZS.Storage.SqlStore || {};


/* I see this as the slowest, hence a proper queing mechanism should be developed for all transactions.  */
ZS.Storage.SqlStore.ExpenseRepository = function (key) {
    var self = this;
    self.key = key;
    var database = null;

    var initiliaze = function () {

        //Get Database object.
        database = window.openDatabase(self.key, "1.0", "User Expenses", 5 * 1024 * 1024 /* 5mb*/);
        database.transaction(function (tx) {
            //tx.executeSql("DROP TABLE IF EXISTS  " + self.key);
            tx.executeSql("CREATE TABLE IF NOT EXISTS " + self.key + " (Id unique,Name,Amount,Category,AddedOnDevice)");
        }, function (evt) {
            console.log("error with database");
        }, function () {
            console.log("Database ready");
            //self.Save(addSampleData);
        });

    };

    self.Save = function (objectToSave) {
        var dfd = $.Deferred();
        console.log("storing in db");
        //TODO : Check for array types else this will fail. 
        //TODO : See if you can bulk insert. 
        var query = "";
        database.transaction(function (tx) {
            for (var i = 0; i < objectToSave.length; i++) {
                var e = objectToSave[i];
                query = "INSERT OR REPLACE INTO " + self.key + " (Id,Name,Amount,Category,AddedOnDevice) VALUES (" + e.Id + ",'" + e.Name + "','" + e.Amount + "','" + e.Category + "','" + e.AddedOnDevice + "')";
                tx.executeSql(query);
                console.log(query);
            }
        }, function (evt) {
            //bah. why error first and then success callback. bad cordova bad. 
            console.log("transaction failed " + evt.code);
            dfd.rejectWith(self, [evt]);
        }, function () {
            //success callback
            dfd.resolveWith(self, [objectToSave]);

        });
        return dfd.promise();
    };

    self.Read = function () {
        var dfd = $.Deferred();
        database.transaction(function (tx) {
            tx.executeSql("SELECT * FROM " + self.key, [], function (txFired, resultSet) {
                //query execution success. 
                var expenses = [];
                for (var i = 0; i < resultSet.rows.length; i++) {
                    expenses.push(resultSet.rows.item(i));
                }
                dfd.resolveWith(self, [expenses]);
            },function(tx) {
                console.log("Error " + tx);
            });
        },
            function (evt) {
                console.log("error while creating transaction");
            }, function () {
                console.log("query fired successfully");
            });

        return dfd.promise();
    };

    var addSampleData = function () {
        var expenses = [
            { "Id": 1, "Name": "Jeans", "Category": "Clothes", "Amount": 1999, "AddedOnDevice": false },
            { "Id": 2, "Name": "Contact Lenses", "Category": "Health", "Amount": 789, "AddedOnDevice": false },
            { "Id": 3, "Name": "Breakfast", "Category": "Food", "Amount": 25, "AddedOnDevice": true }
        ];
        return expenses;
    }();

    initiliaze();
};