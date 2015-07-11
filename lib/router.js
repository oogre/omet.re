
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
	before: function () {
		IR_BeforeHooks.baseAction();
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
		controller : "BaseController",
		name: "home",
		action : function () {
			this.render("index-index");
		}
	});

	Router.route("/:boardName", {
		controller : "BaseController",
		name: "board",
		data : function(){
			var _board = Boards.findOne({name : this.params.boardName});
			return {
				board : Boards.findOne({name : this.params.boardName})
			}
		},
		action : function () {
			this.render("boardShow");
		}
	});