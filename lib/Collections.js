Boards = new Meteor.Collection("boards");
Notes = new Meteor.Collection("notes");

/*
Boards : {
	_id
	Url
	Name
	Date,
	author_id
}

Notes : {
	_id 
	boards_id
	content
	Date
	author_id
}
*/