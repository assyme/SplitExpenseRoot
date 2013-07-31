var ZS = ZS || {};

ZS.Views = ZS.Views || {};

ZS.Views.NewExpenseView = function () {

    var self = this;
    this.el = null;

    var initiliaze = function () {

        self.el = $('<div/>');
        //Bind events. 
        self.el.on('click', '#btnSave', function () {
            var name = $('#txtName').val();
            var amount = $('#txtAmount').val();
            var cat = $('#txtCategory').val();
            var pms = ZS.Common.Expenses.AddExpense(name, amount, cat);
            pms.done(function() {
                $('li#navCurrentExpenses').click();
            });
        });
    };

    this.Render = function () {
        var dfd = $.Deferred();
        this.el.html(ZS.Views.NewExpenseView.NewExpenseTemplate());
        dfd.resolveWith(self, []);
        return dfd.promise();
    };

    initiliaze();
};

ZS.Views.NewExpenseView.NewExpenseTemplate = Handlebars.compile($('#newExpenseTemplate').html());