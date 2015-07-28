Meteor.startup(function () {
	Meteor.publish("boards", function() {
		return Boards.find({});
	});
	Meteor.publish("notes", function(boardName) {
		var t = 0 ; 
			boardName = decodeURI(boardName);
			return [
				Boards
				.find({
					name : boardName
				}), 
				Notes
				.find({
					boardId :	Boards
								.findOne({
									name : boardName
								})
								._id
				})
			];
	});
});