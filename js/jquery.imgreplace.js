/**
 * imgReplace plugin
 * 
 * Szövegek cseréje képekre.
 * Ha az objektum hátterében kép van, akkor eltűnteti az objektumban a szöveget.
 * 
 * Példa kód:
 * @code
 *   html: <div class="example">Lorem ipsum dolor sit amet</div>
 *   js:   $("div.example").imgReplace();
 *   css:  div.example { background: url(images/example.png); }
 * @endcode
 *  
 */

(function($) { 
	$.fn.imgReplace = function(method) {
		return $(".imgreplace",this).each( function() {
			if ($(this).css("background-image") != 'none') {
	        	// Az objektum tartalmát egy span-be rakja, majd eltűnteti
				$(this).html("<span class=\"imgreplace_content\">"+$(this).html()+"</span>");
				$(".imgreplace_content", this).hide();
				// Kicseréli az imgreplace classt, hogy mégegyszer ne lehessen rajta futtatni az imgReplacet
				$(this).addClass("imgreplaced");
				$(this).removeClass("imgreplace");
			}
		});
	};
})(jQuery);