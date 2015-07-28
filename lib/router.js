
var IR_BeforeHooks = {
	isLoggedIn: function(router) {
		if (!(Meteor.loggingIn() || Meteor.user())) {
			router.redirect("signin");
		}
	},
	baseAction: function() { 
		
	}
};

BaseController = RouteController.extend({
	layoutTemplate: "layout",
	onBeforeAction: function () {
		IR_BeforeHooks.baseAction();
		this.next();
	},
	action: function () {
		console.log("this should be overridden!");
	}
});
BoardController = BaseController.extend({
	onBeforeAction: function () {
		
		this.next();
	},
	action: function () {
		console.log("this should be overridden!");
	}
});

NoteController = BaseController.extend({
	onBeforeAction: function () {
		var self = this;
		self.subscribe("notes", decodeURI(self.request.url.substr(1))).wait();
		this.next();
	},
	action: function () {
		console.log("this should be overridden!");
	}
});

Router.configure({
});


/* HOME */
	Router.route("/", {
		controller : "BoardController",
		name: "home",
		action : function () {
			this.render("index-index");
		}
	});

	Router.route("/:boardName", {
		controller : "NoteController",
		loadingTemplate:"loadingTemplate",
		name: "board",
		data : function(){
			var board = Boards.findOne({name : this.params.boardName});
			if(board) return { board : board };
			Router.go("home");
		},
		action : function () {
			this.render("boardShow");
		}
	});