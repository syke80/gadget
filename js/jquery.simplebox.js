/**
 * Simplebox plugin
 * 
 * Létrehoz egy overlay ablakot az oldalon amibe dinamikus tartalom töltődik a megadott url-ről, vagy egy DOM elementbol 
 *  
 */

(function($) {
	var destroy_callback = function() {};
	var methods = {
		init: function(options) {
			// default configuration properties
			var defaults = {
				"url": "",                        // az url ahonnan a box tartalma betöltődik
				"content_id": "",                 // a dom element azonositoja ahonnan a box tartalma betöltődik
				"simplebox_id": "",               // az ablak azonosítója. különböző azonosítókkal több ablak is lehet az oldalon
				"title": "",                      // az ablak címe
				"classes": "",                    // az ablakhoz tartozó class-ok
				"width": "",                      // az ablak szélessége
				"height": "",                     // az ablak magassága
				"show_close" : true,              // bezárás gomb megjelenítése
				"show_title" : true,              // címsor megjelenítése
				"position": "center",             // az ablak pozíciója: "center, top-left, top, top-right, right, bottom-right, bottom, bottom-left, left"
				"load_callback": function() {},   // callback függvény ami az ablak létrehozása után fut le
				"destroy_callback": function() {} // callback függvény ami az ablak bezárása után fut le
			}; 

			options = $.extend(defaults, options);
			
			destroy_callback = options.destroy_callback;

			var simplebox_obj = this;			
			var id_overlay = "sb_overlay";
			var id_window = "sb_window";
			// ha meg van adva a simplebox_id, akkor hozzá kell adni a dom azonosítókhoz
			if (options.simplebox_id) {
				id_overlay += "_"+options.simplebox_id;
				id_window += "_"+options.simplebox_id;
			}

			// -overlay és sb_window létrehozása (ha már létezik akkor előbb megsemmisíti)
			// -sb_window eltűntetése a tartalom betöltése előtt
			if (($("#"+id_overlay).length)!=0) $("#"+id_overlay).remove();
			if (($("#"+id_window).length)!=0) $("#"+id_window).remove();
			$("body").append("<div id=\""+id_overlay+"\" class=\"sb_overlay\"></div>");
			$("body").append("<div id=\""+id_window+"\" class=\"sb_window\"></div>");
			$(id_window).append("<div class=\"body\"></div>");

			$("#"+id_window).css("left", 10000);


			// class-ok hozzáadása
			if (options.classes!="") $("#"+id_window).addClass(options.classes);

			// sb_window objektumai: title, close, content 
			$("#"+id_window).append("<div class=\"sb_body\"></div>");
			if (options.title != "") $("#"+id_window+" .sb_body").append("<div class=\"sb_title\"></div>");
			$("#"+id_window+" .sb_title").html(options.title);
			$("#"+id_window).append("<div class=\"sb_close\"><span>Close</span></div>");
			$("#"+id_window+" .sb_body").append("<div class=\"sb_content\"></div>");

			// kirakja a loading animationt
			$("body").append("<div id=\"sb_loading\"></div>");
			$("#sb_loading").css( "top", $(window).height() / 2 - $("#sb_loading").outerHeight() / 2 );
			$("#sb_loading").css( "left", $(window).width() / 2 - $("#sb_loading").outerWidth() / 2 );
			
			// bezárás hozzárendelése az eseményekhez
			document.onkeyup = function(e) {
				var KeyID = (window.event) ? event.keyCode : e.keyCode;
				if (KeyID == 27) {
					methods.destroy(options.simplebox_id);
				}
			}
			$("#"+id_window+" .sb_close").click( function() {
				methods.destroy(options.simplebox_id);
			} ); 
			$("#"+id_overlay).click( function() {
				methods.destroy(options.simplebox_id);
			} );

			// dimenziók beállítása: overlay
			var content_height = $(document).height() > $(window).height() ? $(document).height() : $(window).height();
			$("#"+id_overlay).height( content_height );

			// dimenziók beállítása: content
			$("#"+id_window+" .sb_content").width( options.width );
			$("#"+id_window+" .sb_content").height( options.height );

			// dimenziók beállítása: sb_window
			var window_height = options.height;
			if (options.title != "") window_height += $("#"+id_window+" .sb_title").outerHeight();
			$("#"+id_window).width( options.width );
			$("#"+id_window).height( window_height );


			// betölti a tartalmat és megjeleníti az ablakot
			if (options.url) {
				if (options.url.slice(-4)=='.jpg' || options.url.slice(-4)=='.png') {
					$("#"+id_window+" .sb_content").append("<img src=\""+options.url+"\" />");
					methods.show(id_window, options);
				}
				else {
					$("#"+id_window+" .sb_content").load(options.url, function() {
						methods.show(id_window, options);
					});
				}
			}
			else {
				$("#"+id_window).addClass("local_content");
				$(options.content_id).detach().prependTo("#"+id_window+" .sb_body .sb_content");
				$(options.content_id).show();
				methods.show(id_window, options);
			}
			options.load_callback();
		},
		show: function(id_window, options) {
				$("#sb_loading").remove();
//				$("#"+id_window).show();
				$("#"+id_window).fadeIn();

				// pozíció beállítása
				switch (options.position) {
					case "center":
						$("#"+id_window).css( "top", $(window).height() / 2 - $("#"+id_window).outerHeight() / 2 );
						$("#"+id_window).css( "left", $(window).width() / 2 - $("#"+id_window).outerWidth() / 2 );
						break;
					case "left":
						$("#"+id_window).css( "top", $(window).height() / 2 - $("#"+id_window).outerHeight() / 2 );
						$("#"+id_window).css( "left", 0 );
						break;
					case "right":
						$("#"+id_window).css( "top", $(window).height() / 2 - $("#"+id_window).outerHeight() / 2 );
						$("#"+id_window).css( "left", $(window).width() - $("#"+id_window).outerWidth() );
						break;
					case "top":
						$("#"+id_window).css( "top", 0 );
						$("#"+id_window).css( "left", $(window).width() / 2 - $("#"+id_window).outerWidth() / 2 );
						break;
					case "bottom":
						$("#"+id_window).css( "top", $(window).height() - $("#"+id_window).outerHeight() );
						$("#"+id_window).css( "left", $(window).width() / 2 - $("#"+id_window).outerWidth() / 2 );
						break;
					case "top-left":
						$("#"+id_window).css( "top", 0 );
						$("#"+id_window).css( "left", 0 );
						break;
					case "top-right":
						$("#"+id_window).css( "top", 0 );
						$("#"+id_window).css( "left", $(window).width() - $("#"+id_window).outerWidth() );
						break;
					case "bottom-left":
						$("#"+id_window).css( "top", $(window).height() - $("#"+id_window).outerHeight() );
						$("#"+id_window).css( "left", 0 );
						break;
					case "bottom-right":
						$("#"+id_window).css( "top", $(window).height() - $("#"+id_window).outerHeight() );
						$("#"+id_window).css( "left", $(window).width() - $("#"+id_window).outerWidth() );
						break;
				}

		},
		destroy: function(simplebox_id, options) {
			var defaults = {
				"disable_callback": false
//				"destroy_callback": function() {} // callback függvény ami az ablak bezárása után fut le
			}; 

			options = $.extend(defaults, options);

			var id_overlay = "sb_overlay";
			var id_window = "sb_window";
			// ha meg van adva a simplebox_id, akkor hozzá kell adni a dom azonosítókhoz
			if (typeof simplebox_id != "undefined" && simplebox_id != "") {
				id_overlay += "_" + simplebox_id;
				id_window += "_" + simplebox_id;
			}

			$("#"+id_window).fadeOut( function() {
				// ha local content (nem ajax content), akkor a tartalmat "menteni" kell, hogy a kovetkezo alkalommal is meg lehessen jeleniteni
				if ($("#"+id_window).hasClass("local_content")) {
					$("#"+id_window+" .sb_content").children().detach().prependTo("body").hide();
				}

				// objektumok torlese a DOM-bol
				$("#"+id_overlay).remove();
				$("#"+id_window).remove();
				$("#sb_loading").remove();
				if (destroy_callback && !options.disable_callback) destroy_callback();
			});
		}
	};

	// a kiválasztott metódus hívása
	$.simplebox = function(method) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.simplebox' );
		}
	};
})(jQuery);