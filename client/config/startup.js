Meteor.startup(function () {

	if (Notification.permission !== "granted") Notification.requestPermission();

	Tracker.autorun(function () {
		Meteor.subscribe("boards");
	});

	Boards
	.find({
		createdAt : {
			$gte : moment().toISOString()
		}
	})
	.observeChanges({
		added: function (board, fields){
			var notification = 	new Notification("OMETT.RE : la page " + fields.name + " viens d'être crée.", {
									//icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
									body: "Ouvrez cette page en clickant ici",
								});
			notification.onclick = function () {
				window.open("/"+fields.name);      
			};
		}
	});
});