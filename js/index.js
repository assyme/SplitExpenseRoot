var ZS = ZS || {};
ZS.Common = ZS.Common || {};

ZS.MainApp = new function () {
    var self = this;

    // Application Constructor
    this.initialize = function () {
        console.log("binding device ready events");
        document.addEventListener("deviceready", self.onDeviceReady, true);
    };

    var fetchNewDataFromServer = function () {
        if (deviceInfo.IsConnected) {
            //Update the wifi icon
            $('#wifiStatus').addClass("icon-signal");
            ZS.Communication.UserExpenses.GetUserExpenses().done(function (data, textStatus, jqXHR) {
                console.log("data recieved from server");
                console.log(data);
                var newExpensesCount = ZS.Common.Expenses.ProcessNewServerData(data);
                $('#badgeExpense').html(newExpensesCount);
            }).fail(function (jqXHR, responseText, errorThrown) {
                console.log("request failed" + responseText);
            });
        } else {
            $('#wifiStatus').removeClass("icon-signal");
        }
    };

    self.onDeviceReady = function () {

        //dac.Read(expenses);
        //window.navigator.notification.alert("Device Ready");
        console.log("application is ready");
        //Load Commons
        ZS.Common.Options = new ZS.Model.Options();
        ZS.Common.Expenses = new ZS.Model.ExpenseCollection();
        ZS.Common.Authenticated = false;
        ZS.Communication.UserExpenses.IsAlive().done(function () {
            ZS.Common.Online = true;
            $('#wifiStatus').addClass("icon-signal");
        }).fail(function () {
            ZS.Common.Online = false;
            $('#wifiStatus').removeClass("icon-signal");
        });

        //Fill device details. 
        deviceInfo = new ZS.Model.DeviceInfo();

        $('ul.nav li').on('click', function (event) {
            $('li.active').removeClass('active');
            $(this).addClass('active');
            //fetchNewDataFromServer();
            if (this.id != "navAuth" && !ZS.Common.Authenticated) {
                event.bubbles = false;
                $('#navAuth').click();
            } 
        });

        $('#navNewExpense').on('click', function () {
            var view = new ZS.Views.NewExpenseView();
            view.Render().done(function () {
                $('div#contents').html(this.el);
            });

            fetchNewDataFromServer();
        });

        $('li#navCurrentExpenses').on('click', function () {
            var view = new ZS.Views.HomeView();
            view.Render().done(function () {
                $('div#contents').html(this.el);
            });
            fetchNewDataFromServer();
        });


        $('li#navAuth').on('click', function () {
            var view = new ZS.Views.AuthView();
            view.Render().done(function () {
                $('div#contents').html(this.elm);
            });
        });

        $('#navSync').on('click', function () {
            console.log("syncing device");
            ZS.Common.Expenses.ResyncPendingData();
            ZS.Common.Expenses.Save().done(function () {
                $('#navCurrentExpenses').click();
            });
        });

        $('li#navOptions').on('click', function () {
            var view = new ZS.Views.Options();
            view.Render().done(function (elm) {
                $('div#contents').html(elm);
            });

        });
        $('li#navErrors').on('click', function () {
            var view = new ZS.Views.ErrorView();
            view.Render().done(function () {
                $('div#contents').html(this.elm);
            });
        });


        $('li#navAuth').click();
    };
};

window.Handlebars.registerHelper('select', function (value, options) {
    var $el = $('<select />').html(options.fn(this));
    $el.find('[value=' + value + ']').attr({ 'selected': 'selected' });
    return $el.html();
});


