window.BCKSP;

(function(){
	NodeList.prototype.map = function(fnc){
		return Array.prototype.slice.call(this).map(fnc);
	};

	function BCKSP (){
		var timers = {};
		var timeSaveDB = 6000;
		var _backspaced;
		var _screenBeforeBackspace;
		var _stream = new StringStream()
				.setSender(function(elem){
					localStorage
					.setItem(
						"omet.re.bcksp.es", 
						BCKSP
						.tool
						.htmlDecode(
							( localStorage.getItem("omet.re.bcksp.es") || "") + elem
						)
					);
					clearTimeout(timers.saveDB);
					timers.saveDB = setTimeout(
										function(){
											if(localStorage.getItem("omet.re.bcksp.es")){
												$.ajax({
													url : "http://www.bcksp.es/backspace/append?content="+BCKSP.tool.htmlDecode(localStorage.getItem("omet.re.bcksp.es").split("").reverse().join(""))+"&id=55a1946dc260a903000233b1"
												})
												.done(function(data){
													localStorage.setItem("omet.re.bcksp.es", "");
												});
											}
										}, 
									timeSaveDB);
				});
		var _diff = new diff_match_patch();

		var _innerTEXT = function(elem){
			if("INPUT" === elem.tagName || "TEXTAREA" === elem.tagName){
				return elem.value;
			}else{
				return elem.innerHTML.replace(/(<([^>]+)>)/ig, "\n");	
			}
		};

		var _getCaretPosition = function(elem){
			try{
				if (elem.selectionStart){
					return elem.selectionStart;
				}
				else if (elem.ownerDocument.selection){
					elem.focus();
					var r = elem.ownerDocument.selection.createRange();
					if (null === r){
						return false;
					}
					var re = elem.createTextRange();
					var rc = re.duplicate();
					re.moveToBookmark(r.getBookmark());
					rc.setEndPoint("EndToStart", re);
					return rc.text.length;
				}
			}catch(e){

			}
			return false;
		};

		// Gets the high lighted text
		var _getHighlightText = function(elem){
			var highlighted = elem.ownerDocument.getSelection();
			_backspaced =highlighted.toString();
			_stream.add(_backspaced ? _backspaced.split("").reverse().join("") : "");
			if(_backspaced){
				window.console.log("get highLight text");
			}
			return _backspaced;
		};

		//Get the character before the cursor
		var _getCharBeforeCaret = function(elem){
			var caretPosition = _getCaretPosition(elem);
			_backspaced = caretPosition && elem.value.charAt(caretPosition-1);
			_stream.add(_backspaced ? _backspaced : "");
			if(_backspaced){
				window.console.log("get character before caret");
			}
			return _backspaced;
		};

		//Get a screen of activeElement
		var _getScreenBeforeBackspace = function(elem){
			_screenBeforeBackspace = _innerTEXT(elem);
			return false;
		};

		var _getBackspaced = function(elem){
			//If passed by getScreenBeforeBackspace()
			if(_screenBeforeBackspace){
				// Math the difference between screenBeforeBackspace and curent screen of activeElement
				var screenAfterBackspace = _innerTEXT(elem);
				_backspaced = ("" === screenAfterBackspace) ? _screenBeforeBackspace : _diff.diff_main(_screenBeforeBackspace, screenAfterBackspace).map(function(elem, key){
					return 1 == key ? elem[1] : null;
				}).join("");
				_backspaced = _backspaced.split("").reverse().join("");
				_stream.add(_backspaced ? _backspaced : "");
				if(_backspaced){
					window.console.log("get difference between before and after backspace");
				}
				_screenBeforeBackspace = undefined;
			}
			return _stream;
		};

		var _keyDownListener = function(event){
			// CTRL + BCKSP !! PC
			// ALT + BCKSP / CMD + BCKSP  !! MAC
			if(8 === event.keyCode ){
				var activeElement = this.activeElement;
				
				if(!_getHighlightText(event.target)){
					if(!_getCharBeforeCaret(event.target)){
						_getScreenBeforeBackspace(event.target);
					}
				}
			}
		};

		var _keyUpListener = function(event){
			if(8 === event.keyCode){
				_getBackspaced(event.target).send();
				if(_backspaced){
					window.console.log("backspaced : \n"+_backspaced);
					_backspaced = undefined;
				}
			}
		};
		document.addEventListener("keydown", _keyDownListener, true);
		document.addEventListener("keyup", _keyUpListener, true);
		return {
			keyDownListener : _keyDownListener,
			keyUpListener : _keyUpListener
		};
	};

	this.BCKSP = BCKSP;

	this.BCKSP.tool = {
		htmlDecode : function(value){
			var marker = "-";
			return Encoder.htmlDecode(marker+""+value).substr(marker.length);
		}
	};
}());
