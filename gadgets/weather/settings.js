$.fn.gadgetWeatherSettings = function() {
	var $obj = this;

	// Private functions
	var updateCityName = function(cityPath) {
		$.ajax({
			url:  "interface.php",
			type: "GET",
			data: {
				type:    "json",
				cache:   "weather"+cityPath,
				expires: "3600",
				url:     "http://api.wunderground.com/api/52b0a04ba935dba7/conditions/forecast10day"+cityPath+".json"
			}, 
			success: function(data) {
				// Refresh content
				if (data['current_observation'] !== undefined) {
					$(".settings [name=location]", $obj).val(data['current_observation']['display_location']['city']);
				}

			},
			dataType: "json",
			async: false
		});
	}

	// Fill form when load
	// form / city name
	updateCityName(configService.property($obj, 'city_path'));
	// form / size
	$(".settings [name=size]", $obj).val(configService.property($obj, 'size'));

	// Events
	// Events / city autocomplete
	$(".settings [name=location]", $obj).click( function() {
		$(this).val("");
	});

	$(".settings [name=location]", $obj).autocomplete( {
		position: { my : "right top", at: "right bottom" },
		appendTo: $obj,
		source: function(request, response) {
			$.ajax({
				url:  "interface.php",
				type: "GET",
				data: {
					type:    "json",
					url:     "http://autocomplete.wunderground.com/aq?query="+request.term
				}, 
				success: function(data) {
					for (i in data.RESULTS) {
						data.RESULTS[i]["label"] = data.RESULTS[i]["name"];
					}
					response(data.RESULTS);
				},
				dataType: "json"
			});
		},
		select: function(event, ui) {
			updateCityName(ui.item.l)
			configService.property($obj, 'city_path', ui.item.l);
		}
	});

	// Events / submit
	$(".settings button", $obj).click( function() {
		configService.property($obj, 'size', $("select[name=size]", $obj).val())
		switch ($("select[name=size]", $obj).val()) {
			case "medium":
				configService.property($obj, 'width', 3);
				configService.property($obj, 'height', 2);
				break;
			case "small":
				configService.property($obj, 'width', 2);
				configService.property($obj, 'height', 2);
				break;
		}
		configService.save();
	});

}
