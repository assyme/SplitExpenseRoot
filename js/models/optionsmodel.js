var ZS = ZS || {};

ZS.Model = ZS.Model || {};

ZS.Model.Options = function() {
    var self = this;
    var store = null;

    function option() {
        this.StorageLocation = 0;
    }

    self.option = new option();

    var initiliaze = function () {
        store = new ZS.Storage.LocalStorage("options");
        self.Load();
    };

    self.Save = function() {
        return store.Save(self.option);
    };

    self.Load = function() {
        store.Read().done(function(opt) {
            if (opt != "undefined" && opt != null) {
                self.option = opt;
            }
        });
    };

    initiliaze();
};
