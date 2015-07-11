
var TextareaHandler = function(parentNode, note){
	var $_parentNode = $(parentNode);
	var $_elem = $_parentNode.find("textarea");
	var $_tools = $_parentNode.find(".writtingTools");
	var _x = 0;
	var _y = 0;
	var _fontSize = ["", "font-large", "font-larger", "font-largest"];
	var _fontColor = ["black", "red", "orange", "green", "turquoise", "blue", "magenta"];

	var reorderStyleArray = function (toSetFirst, array){
		return	array
				.splice( array.indexOf(toSetFirst) )
				.concat(array);
	}

	if($_elem.hasClass("font-large") || note.fontSize == "font-large"){
		_fontSize = reorderStyleArray("font-large", _fontSize);
	}
	else if($_elem.hasClass("font-larger") || note.fontSize == "font-larger"){
		_fontSize = reorderStyleArray("font-larger", _fontSize);
	}
	else if($_elem.hasClass("font-largest") || note.fontSize == "font-largest"){
		_fontSize = reorderStyleArray("font-largest", _fontSize);
	}
	if($_elem.hasClass("black") || note.fontColor == "black"){
		_fontColor = reorderStyleArray("black", _fontColor);
	}
	else if($_elem.hasClass("red") || note.fontColor == "red"){
		_fontColor = reorderStyleArray("red", _fontColor);
	}
	else if($_elem.hasClass("orange") || note.fontColor == "orange"){
		_fontColor = reorderStyleArray("orange", _fontColor);
	}
	else if($_elem.hasClass("green") || note.fontColor == "green"){
		_fontColor = reorderStyleArray("green", _fontColor);
	}
	else if($_elem.hasClass("turquoise") || note.fontColor == "turquoise"){
		_fontColor = reorderStyleArray("turquoise", _fontColor);
	}
	else if($_elem.hasClass("blue") || note.fontColor == "blue"){
		_fontColor = reorderStyleArray("blue", _fontColor);
	}
	else if($_elem.hasClass("magenta") || note.fontColor == "magenta"){
		_fontColor = reorderStyleArray("magenta", _fontColor);
	}

	var _resize = function(){
		var value = ($_elem.val() || "");


		value = value.split("\n");
		var y = value.length;
		var x = 0;
		value
		.map(function(v){
			if(x < v.length){
				x = v.length;
			}
		});
		
		$_elem
		.attr("cols", x + 4)
		.attr("rows", y + 1);

		Meteor.call("noteUpdator", note._id, {
			content : $_elem.val(),
			size : {
				cols : x+4 ,
				rows : y+1
			}
		});
	};
	
	_resize();
	return {
		add : function(position){
			_x = position.x;
			_y = position.y;
			Session.set(Meteor.WRITTING, {
				x : _x, 
				y : _y
			});
		},
		resize : function(){
			_resize();
		},
		nextFontSize : function(button){
			$_elem.removeClass(_fontSize[0]);
			_fontSize.push(_fontSize.shift());
			$_elem.addClass(_fontSize[0]);
			Meteor.call("noteUpdator", note._id, {
				fontSize : _fontSize[0]
			});
		},
		nextFontColor : function(button){
			var picto = $(button).find("i");
			picto.removeClass(_fontColor[1]);
			$_elem.removeClass(_fontColor[0]);
			_fontColor.push(_fontColor.shift());
			$_elem.addClass(_fontColor[0]);
			picto.addClass(_fontColor[1]);

			Meteor.call("noteUpdator", note._id, {
				fontColor : _fontColor[0]
			});

		},
		stopEdit : function(){
			$_parentNode.removeClass("edition");
			if($_elem.val() == ""){
				$_parentNode.remove();				
			}
		},
		startEdit : function(flag){
			$_parentNode.addClass("edition");
			if(flag!== false)$_elem.focus();
		},
		isEditing : function(){
			return $_parentNode.hasClass("edition");
		},
		parentNode : $_parentNode,
		elem : $_elem
	}
};

var textHandler;

Template.writtingArea.rendered = function(){
	var self = this;
	Tracker.autorun(function (c) {
		var note = Session.get(Meteor.CREATED_NOTE);
		if(note && note._id == self.data._id){
			if(textHandler) textHandler.stopEdit();
			textHandler = new TextareaHandler($(self.firstNode), self.data);
			textHandler.startEdit();
			c.stop();
		}
	});
};

Template.writtingArea.events({
	"click .writtingTools button.sizer" : function(event){
		textHandler.nextFontSize();
		event.preventDefault();
		textHandler.elem.focus();
		return false;
	},
	"click .writtingTools button.colorizer" : function(event){
		textHandler.nextFontColor(event.target);
		event.preventDefault();
		textHandler.elem.focus();
		return false;
	},
	"click textarea" : function(event){
		event.preventDefault();
		return false;
	},
	"keyup textarea" : function(event){
		textHandler.resize();
	},
	"paste textarea" : function(event){
		setTimeout(textHandler.resize, 20);
	},
	"focus textarea" : function(event){
		var focused = $(event.target).parent();

		if(textHandler && textHandler.parentNode[0] == focused[0]){
			return;
		}
		else{
			if(textHandler)
				textHandler.stopEdit();
			textHandler = new TextareaHandler(focused, this);
			textHandler.startEdit(false);
		}
	}
});