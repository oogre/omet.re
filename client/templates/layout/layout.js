Template.layout.events({
	"click header" : function(event){
		event.preventDefault();
		Router.go("/");
		return false;
	}
})