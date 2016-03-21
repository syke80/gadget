$.fn.gadgetCurrencyChartSettings = function() {
	var $obj = this;

	// Fill form when load
	$(".settings [name=currency1]", $obj).val(configService.property($obj, 'currency1'));
	$(".settings [name=currency2]", $obj).val(configService.property($obj, 'currency2'));
	$(".settings [name=range]", $obj).val(configService.property($obj, 'range'));
	$(".settings [name=size]", $obj).val(configService.property($obj, 'size'));

	// Events / submit
	$(".settings button", $obj).click( function() {
		configService.property($obj, 'currency1', $("input[name=currency1]", $obj).val())
		configService.property($obj, 'currency2', $("input[name=currency2]", $obj).val())
		configService.property($obj, 'range', $("select[name=range]", $obj).val())
		configService.property($obj, 'size', $("select[name=size]", $obj).val())
		switch ($("select[name=size]", $obj).val()) {
			case "medium":
				configService.property($obj, 'width', 3);
				configService.property($obj, 'height', 2);
				break;
			case "large":
				configService.property($obj, 'width', 4);
				configService.property($obj, 'height', 2);
				break;
		}
		configService.save();
	});
}
