$.fn.gadgetClock = function() {
	$.getScript("gadgets/clock/js/moment.min.js");
	var $obj = this;

	// Initialize gadget
	setInterval( function() {
		var d = new Date()

		//d.setTime(d.getTime() + 30*60000);

		var hdegree = d.getUTCHours() * 30 + (d.getUTCMinutes() / 2);
		var hrotate = "rotate(" + hdegree + "deg)";

		var mdegree = (d.getUTCMinutes() * 6) + (d.getUTCSeconds() * 0.1);
		var mrotate = "rotate(" + mdegree + "deg)";

		var sdegree = d.getUTCSeconds() * 6;
		var srotate = "rotate(" + sdegree + "deg)";
		
		$(".hour", $obj).css({"-moz-transform" : hrotate, "-webkit-transform" : hrotate});
		$(".min", $obj).css({"-moz-transform" : mrotate, "-webkit-transform" : mrotate});
		$(".sec", $obj).css({"-moz-transform" : srotate, "-webkit-transform" : srotate});
	}, 1000);
}
