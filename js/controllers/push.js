/* This code is ios push notification specific */

var ZS = ZS || {};
ZS.PushNotification = (function(){

	var self = this;
	self.notification;
	var tokenHandler = function(token){
		console.log("yeah you got it");
		console.log(token);
		//Send token to the server. 
		ZS.Communication.
	};
	var errorHandler = function(error){
		alert(error);
	};
	var successHandler = function(success){
		console.log(success);
	}

	return {	
		init : function(){
			//contructor
			console.log("initilizing ios push notifications"); 
			self.notification = window.plugins.pushNotification;
			console.log(typeof self.notification);
			self.notification.register(tokenHandler,errorHandler,
			 {"badge" : true,"sound" : true,"alert" : true, "ecb": "ZS.PushNotification.onNotificationAPN" /* This cannot be changed ever */}); 
		},
		unregister : function(){
			//probably you would not want to call this at all. But putting it here for the sake of completness

			console.log("unregister the device token");
			self.notification.unregister(successHandler,errorHandler);
		},	
		onNotificationAPN : function(event){
			//event that gets fired when the app receives notification. 
			console.log("notification recieved");
			if (event.alert) {
        		navigator.notification.alert(event.alert);
			}

    		if (event.sound) {
        		var snd = new Media(event.sound);
        		snd.play();
    		}

    		if (event.badge) {
        		pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    		}
    		//TODO : Pull the new data from server. 
		}
	}
}());