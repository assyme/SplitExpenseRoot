var ZS = ZS || {};

ZS.Views = ZS.Views || {};

ZS.Views.AuthView = function () {
    var self = this;
    self.elm = null;


    this.Initialize = function () {
        //Constructor
        self.elm = $('<div/>');
        self.elm.on("click", "#btnLogin", function () {
            console.log('Attempting authentication!');
            var u = $('#txtUsername', self.elm).val();
            var p = $('#txtPassword', self.elm).val();
            var r = $('#cbRemember', self.elm).is("checked");
            var credmodel = new ZS.Model.Credential();
            if (ZS.Common.Online) {
                ZS.Communication.UserExpenses.GetUserAuthentication(u, p, r).done(function(response, responseText, jqXHR) {
                    //Save this auth information into the local store. 
                    console.log("Authentication.");
                    console.log(response.success);
                    console.log(jqXHR.getAllResponseHeaders());
                    //console.log(jqXHR.getResponseHeader('Set-Cookie'));
                    if (response.success == "true") {
                        //navigate to main page. 
                        
                        credmodel.ApplyCredentials(u, p, response.authName, response.authToken);
                        credmodel.Save().done(function() {
                            ZS.Common.Authenticated = true;
                            $('#navCurrentExpenses').click();
                        });

                    } else {
                        self.elm.append("<p>Wrong user name or password. Try again!</p>");
                    }
                });
            } else {
                //Try offline authentication 
                credmodel.Load().done(function(cred) {
                    if (cred.UserName == u && cred.Password == p) {
                        //User was never authentication
                        ZS.Common.Authenticated = true;
                        //Alternatively check if you need to tweek the cookie
                        $('#navCurrentExpenses').click();
                    } else {
                        self.elm.append("<p>No network connection! Please connect and try login in</p>");
                    }
                });
            }

        });
    };


    this.Render = function () {
        var dfd = $.Deferred();
        var credmodel = new ZS.Model.Credential();
        credmodel.Load().done(function (creds) {
            var htmlContent = ZS.Views.AuthView.template(creds);
            self.elm.html(htmlContent);

            dfd.resolveWith(self, [self.elm]);
        });

        return dfd.promise();
    };


    //Call the constructor when page loads
    this.Initialize();
};

ZS.Views.AuthView.template = Handlebars.compile($('#authTemplate').html());