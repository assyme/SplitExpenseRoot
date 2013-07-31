var ZS = ZS || {};

ZS.Views = ZS.Views || {};

ZS.Views.Options = function() {
    var self = this;
    self.elm = $("<div/>");
    var optionsTemplate = Handlebars.compile($('#optionsTemplate').html());
    //bind events. 
    self.elm.on('click', '#btnSaveOptions', function() {
        ZS.Common.Options.option.StorageLocation = $('#sltLocalStore').val();
        ZS.Common.Options.Save().done(function() {
            ZS.MainApp.onDeviceReady();
        });
    });
    
    var getInputData = function(size) {
        
    }
    self.elm.on('click', '#btnTestStorage', function() {
        var str = $('#sltLocalStore').val();
        var size = $('#txtSize').val();
        var loc = null;
        var expc = [];
        for (var i = 0; i < (8 * size) + 0; i++) {
            var exp = { Id: i + 200000, Name: "a", Category: "a", Amount: 1, AddedOnDevice: true };
            expc.push(exp);
        }
        console.log(expc.length);
        switch (str) {
            case "0":
                loc = new ZS.Storage.LocalStorage("mytemp");
                break;
            case "1":
                loc = new ZS.Storage.FileStorage("mytemp");
                break;
            case "2":
                loc = new ZS.Storage.SqlStore.ExpenseRepository("mytemp");
              
                break;
        }
        loc.Save(expc).done(function () {
            alert("done");
        });
        
        //console.log(inputdata.length * 8 * 1024);
       

    });
    return {
        Render: function () {
            var dfd = $.Deferred();
            self.elm.html(optionsTemplate(ZS.Common.Options.option));
            dfd.resolveWith(self, [self.elm]);
            return dfd.promise();
        }
    };
};

