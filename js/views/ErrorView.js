var ZS = ZS || {};

ZS.Views = ZS.Views || {};

ZS.Views.ErrorView = function() {
    var self = this;
    self.elm = $('<div/>');

    this.Render = function() {
        var dfd = $.Deferred();
        for (var i = 0; i < ZS.Views.ErrorView.Errors.length; i++) {
            self.elm.append(ZS.Views.ErrorView.Errors[i]);
        }
        dfd.resolveWith(self, [self.elm]);
        return dfd.promise();
    };


};
ZS.Views.ErrorView.Errors = [];

if (typeof console != "undefined")
    if (typeof console.log != 'undefined')
        console.olog = console.log;
    else
        console.olog = function () { };

console.log = function (message) {
    console.olog(message);
    ZS.Views.ErrorView.Errors.push('<p>' + message + '</p>');
};
console.error = console.debug = console.info = console.log;