Meteor.methods({
	noteCreator : function(boardId, location){
		if(!boardId)
			return false;
		if(!location || !location.x || !location.y)
			return false;

		var NoteId =  	Notes.insert({
							boardId : boardId,
							location : location,
							createdAt : moment().toISOString()
						});
		return Notes.findOne(NoteId);
	},
	noteUpdator : function(noteId, data){
		if(!noteId)
			return false;
		Notes.update(noteId, {
			$set : data
		});
		return Notes.findOne(noteId);
	}
});