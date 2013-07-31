var ZS = ZS || {};

ZS.Model = ZS.Model || {};

ZS.Model.ExpenseCollection = ZS.Model.ExpenseCollection || function () {
    var self = this;
    var expenses = [];
    var addedExpenseIds = [];
    var pendingExpenseData = [];
    var storage;
    self.SaveKey = "expenses";

    //constructor
    var initiliaze = function () {
        var str = parseInt(ZS.Common.Options.option.StorageLocation);
        switch(str) {
            case 0: storage = new ZS.Storage.LocalStorage(self.SaveKey);
                break;
            case 1: storage = new ZS.Storage.FileStorage(self.SaveKey);
                break;
            case 2: storage = new ZS.Storage.SqlStore.ExpenseRepository(self.SaveKey);
                break;
        }
        
    };

    this.Save = function() {
        var pms = storage.Save(expenses); /* returns callers promise object*/
        return pms;
    };

    this.Load = function () {
        var def = $.Deferred();
        expenses = [];
        storage.Read().done(function(expArray) {
            if (expArray != null) {
                for (var i = 0; i < expArray.length; i++) {
                    var e = expArray[i];
                    addExpense(e.Name, e.Amount, e.Category, e.Id);
                }
            }
            def.resolveWith(self, [expenses]);
        });
        return def.promise();
    };

    this.AddExpense = function (name, amount, category, id) {
        //This call would come from outside, just load the fresh data and then add it to the list. 
        var dfd = $.Deferred();
        self.Load().done(function () {
            addExpense(name, amount, category, id);
            $.when(self.Save()).then(function() {
                dfd.resolve();
            });
        });
        return dfd.promise();
    };

    
    
    this.RemoveExpense = function (expenseIdToRemove) {
        for (var i = 0; i < expenses.length; i++) {
            if (expenseIdToRemove == expenses[i].Id) {
                expenses.splice(i, 1);
                self.Save();
            }
        }
    };
    
    this.RefreshNewData = function (jsonData) {
        var deferred = $.Deferred();
        this.Clear();
        if (jsonData != null) {
            var len = jsonData.length;
            for (var i = 0; i < len; i++) {
                var exp = jsonData[i];
                this.AddExpense(exp.Name, exp.Amount, exp.Category, exp.Id);

            }
        }
        deferred.resolve(expenses);
        return deferred.promise();
    };
    this.ProcessNewServerData = function (response) {
        var newData = 0;
        pendingExpenseData = [];
        if (response instanceof Array) {
            for (var i = 0; i < response.length; i++) {
                var exp = response[i];
                if (addedExpenseIds.indexOf(exp.Id) == -1) {
                    newData++;
                    pendingExpenseData.push(new expense(exp.Id, exp.Name, exp.Amount, exp.Category));
                }
            }
        } else {
            throw "need array input to this function";
        }
        return newData;
    };

    this.ResyncPendingData = function () {
        var initialLen = pendingExpenseData.length;
        for (var i = 0; i < initialLen; i++) {
            var exp = pendingExpenseData.pop();
            expenses.push(exp);
            addedExpenseIds.push(exp.Id);
        }
    };

    this.GetExpenseById = function (id) {
        var exp = null;
        for (var i = 0; i < expenses.length; i++) {
            if (expenses[i].Id == id) {
                exp = expenses[i];
                break;
            }
        }
        return exp;
    };
    
    var addExpense = function (name, amount, category, id) {
        if (typeof id == "undefined") {
            id = Math.floor(Math.random() * 101 * -1);
        }
        var exp = new expense(id, name, amount, category);
        if (typeof id != "undefined" && id > 0) {
            addedExpenseIds.push(exp.Id);
        }
        expenses.push(exp);
        return exp;
    };

    var expense = function (id, name, amount, category) {
        this.Name = name;
        this.Amount = amount;
        this.Id = id;
        this.Category = category;
        if (id > 0) {
            this.AddedOnDevice = false;
        } else {

            this.AddedOnDevice = true;
        }
    };

    initiliaze();

};

