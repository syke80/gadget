$.fn.gadgetExample = function(config) {
	var $obj = this;

	var defaults = {
		v1_saved: 0,
		v2_saved: 0,
		width: 1,
		height: 1
	}; 

	config = $.extend(defaults, config);
	
	// Save config to the object
	$obj.data("config", config);

	// Initialize gadget
	$("input[name=v1]", $obj).val(configService.v1_saved);
	$("input[name=v2]", $obj).val(configService.v2_saved);

	// Events
	$(".content button", this).click( function() {
		// Doing something: .result = v1 + v2
		$(".content .result", $obj).html( parseInt($("input[name=v1]", $obj).val()) + parseInt($("input[name=v2]", $obj).val()));
		
		// Store custom variables in the config: for example the 2 variables of the form
		configService.v1_saved = parseInt($("input[name=v1]", $obj).val());
		configService.v2_saved = parseInt($("input[name=v2]", $obj).val());
		// Store config in the DOM. Not needed, because the object linked to the local "config" variable
		//$obj.data("config", config);
		
		// Save config
		saveConfig();
	});

}
