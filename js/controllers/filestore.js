/* This structure does not work ripple. Google for more details. */

var ZS = ZS || {};

ZS.Storage = ZS.Storage || {};

ZS.Storage.FileStorage = function (key) {
    var self = this;
    self.key = key;




    var addSampleData = function () {
        var expenses = [
            { "Id": 1, "Name": "Jeans", "Category": "Clothes", "Amount": 1999, "AddedOnDevice": false },
            { "Id": 2, "Name": "Contact Lenses", "Category": "Health", "Amount": 789, "AddedOnDevice": false },
            { "Id": 3, "Name": "Breakfast", "Category": "Food", "Amount": 25, "AddedOnDevice": true }
        ];
        return expenses;
    }();


    //Public methods. 
    self.Save = function (objectToSave) {
        var dfd = $.Deferred();
        console.log("storing in file");
        //window.webkitStorageInfo.requestQuota(1, 1024 * 1024, function(granted) { // Had to do this for ripple under chrome. else you dont need this. 
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            //received a file system here.
            var fileName = self.key + ".txt"; // Can make it a dat file as well. 
            fs.root.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
                //Got file entry. 
                fileEntry.createWriter(function (writer) {
                    writer.write(JSON.stringify(objectToSave));
                    console.log("success");
                    dfd.resolveWith(self, [objectToSave]);
                }, function (evt) {
                    console.log("could not create a file writer");
                    dfd.rejectWith(self, [evt.target.error.code]);
                });
            }, function (evt) {
                //Error in getting file.
                console.log("cannot get file");
                console.log(evt.target.error.code);
                dfd.rejectWith(self, [evt.target.error.code]);
            });
        }, function (evt) {
            //Error in receiving the file system.
            console.log("error in getting a file system. ");
            console.log(evt.target.error.code);
            dfd.rejectWith(self, [evt.target.error.code]);
        });
        //}, function() {
        //    console.log("error");
        //};

        return dfd.promise();
    };
    self.Read = function () {
        console.log("attempting read from file storage system");
        var dfd = $.Deferred();
        var returnObject = null;
        console.log("reading from file");

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024 * 1024, function (fileSystem) {
            var fileName = self.key + ".txt";
            fileSystem.root.getFile(fileName, null, function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        console.log(evt.target.result);
                        returnObject = JSON.parse(evt.target.result);
                        dfd.resolveWith(self, [returnObject]);
                    };
                    reader.readAsText(file);
                }, function (evt) {
                    //Error in receiving the file system.
                    console.log("error in getting a file system. ");
                    console.log(evt.target.error.code);
                    dfd.rejectWith(self, [evt.target.error.code]);
                });
            }, function (evt) {
                //Error in receiving the file system.
                console.log("error in getting a file system. ");
                console.log(evt.target.error.code);
                dfd.rejectWith(self, [evt.target.error.code]);
            });
        }, function (evt) {
            //Error in receiving the file system.
            console.log("error in getting a file system. ");
            console.log(evt.target.error.code);
            dfd.rejectWith(self, [evt.target.error.code]);
        });

        return dfd.promise();
    };

    //constructor to initialize this class. 
    (function () {
        //self.Save(addSampleData);
    }(key));
};