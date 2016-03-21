$.fn.gadgetExampleSettings = function() {
	var $obj = this;
	var config = $obj.data("config");

	// Get config from DOM (gadget.js got config at init, and stored that in specified DOM element)
	$(".settings form select[name=size]", $obj).val(configService.size);

	$(".settings form button", $obj).click( function() {
		configService.size = $(".settings form select[name=size]", $obj).val();
		saveConfig();
	});
}
