var ZS = ZS || {};

ZS.Communication = ZS.Communication || {};

ZS.Communication.UserExpenses = function() {
    var self = this;
    var rooturl = "http://splitexpense.apphb.com/";
    //var rooturl = "http://pu-sdapalek.zs.local/ExpenseManager/";

    $(document).ajaxSend(function(event,request,settings) {
        request.setRequestHeader("Requested-With", "XMLHttpRequest");
    });

    $(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
        if (jqXHR.status == 401 /*Un authorized access */) {
            console.log("You need to log in");
            $('#navAuth').click();
        }
    });

    return {
      GetAllExpenses : function() {
          return $.ajax({
              url: rooturl + "UserExpenses/GetAllExpenses",
              dataType: "JSON",
              type:"POST"
          });
      },
      GetUserExpenses : function() {
          return $.ajax({
              url: rooturl + "UserExpenses/GetUserExpenses",
              dataType: "JSON",
              type: "POST"
          });
      },
      GetUserAuthentication : function(user,pwd,rem) {
          return $.ajax({
              url: rooturl + "Account/MobileLogin",
              type: "POST",
              dataType: "JSON",
              data: {
                  UserName: user,
                  Password: pwd,
                  RememberMe: rem
              },
          });
      },
      IsAlive : function() {
          return $.ajax({
              url: rooturl + "Home/IsAlive",
              type: "POST",
              dataType : "JSON"
          });
      }
    };
}();