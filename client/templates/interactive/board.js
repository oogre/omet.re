Template.board.rendered = function(){
	Session.set(Meteor.CREATED_NOTE, false);
	window.scrollTo((document.body.offsetWidth - window.innerWidth) / 2, (document.body.offsetHeight - window.innerHeight) / 2);
};

Template.board.events({
	"click .container.board" : function(event){
			Meteor.call("noteCreator", 
				this.board._id, 
				{ 	
					x : event.offsetX, 
					y : event.offsetY 
				}, 
				function(error, note){
					 if(error) return ;

					 Session.set(Meteor.CREATED_NOTE, note);
				});
		return false;
	},
	
});

Template.board.helpers({
	notes : function(){
		if(this.board){
			return  Notes.find({
				boardId : this.board._id
			});
		}
	}
});