Meteor.methods({
	boardCreator : function(name){
		var boardId =  	Boards.insert({
							name : name,
							createdAt : moment().toISOString()
						});
		if(!boardId) return ;

		if(this.isSimulation){
			Router.go("board", {
					boardName : name
			});
		}else{
			return name;
		}
	}
});