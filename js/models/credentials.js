var ZS = ZS || {};

ZS.Model = ZS.Model || {};

ZS.Model.Credential = function() {
    var self = this;
    self.store = new ZS.Storage.LocalStorage("credentials");
    var creds = function(usr, pwd, cookieName, cookieToken) {
        this.UserName = usr;
        this.Password = pwd;
        this.CookieName = cookieName;
        this.CookieToken = cookieToken;
    };

    self.creds = new creds("", "", "", "");

    return {
        Load: function() {
            //Load from data store
            var dfd = $.Deferred();
            self.store.Read().done(function (data) {
                if (data == null) {
                    self.creds = new creds("", "", "", "");
                    dfd.resolveWith(self, [self.creds]);
                } else {
                    if (typeof window.Keychain != "undefined") {
                        console.log("Get from keychain");
                        var kc = new window.Keychain();
                        kc.getForKey(function (val) {
                            console.log("received from keychain");
                            self.creds = new creds(data.UserName, val, data.CookieName, data.CookieToken);
                            dfd.resolveWith(self, [self.creds]);
                        }, function(error) {
                            alert(error);
                            dfd.reject();
                        }, data.UserName, "splitexpense");
                    } else {
                        self.creds = new creds(data.UserName, data.Password, data.CookieName, data.CookieToken);
                        dfd.resolveWith(self, [self.creds]);
                    }
                    
                }
                
            });

            return dfd.promise();
        },
        Save : function() {
            //Save to a data store
            var dfd = $.Deferred();
            var encryptedCred = self.creds;
            if (typeof window.Keychain != "undefined") {
                var kc = new window.Keychain();
                kc.setForKey(function() {
                    console.log("success for keychain");
                    encryptedCred.Password = "Haha";
                    self.store.Save(encryptedCred).done(function() {
                        dfd.resolveWith(this, [self.creds]);
                    });
                }, function(error) {
                    alert(error);
                    dfd.reject();
                }, encryptedCred.UserName, "splitexpense", encryptedCred.Password);
            } else {
                //save normally 
                self.store.Save(encryptedCred).done(function () {
                    dfd.resolveWith(this, [self.creds]);
                });
            }
            return dfd.promise();
        },
        ApplyCredentials : function(u, p, n, t) {
            self.creds = new creds(u, p, n, t);
        }
    };
};