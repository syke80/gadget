$.fn.gadgetClockSettings = function() {
	var $obj = this;

	// Fill form when load
	if (configService.property($obj, 'label') != false) $(".settings [name=label]", $obj).val(configService.property($obj, 'label'));

	// Events / submit
	$(".settings button", $obj).click( function() {
		configService.property($obj, 'timezone', $("select[name=timezone]", $obj).val())
		configService.property($obj, 'label', $("input[name=label]", $obj).val())
		configService.save();
	});
}
