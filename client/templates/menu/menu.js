Template.menuMenu.events({
	"click .newPaper" : function(event){
		var name = false;
		var board = false;
		if(name = prompt("Nommez la page de note : ")){
			if(board = Boards.findOne({name : name})){
				Router.go("board", {
					boardName : name
				});
			}
			else{
				Meteor.call("boardCreator", name, 	function(error, boardName){
														if(error){
															console.error(error);
															alert("error : more info into log");
															return;
														}
														Router.go("board", {
															boardName : boardName
														});
													});	
			}
		}
		event.preventDefault();
		return false;
	},
	
});

Template.menuMenu.helpers({
	boards : function(){
		return Boards.find({}, {
			sort : {
				createdAt : -1,
				name : 1
			}
		});
	}
});