$.fn.gadgetWeather = function() {
	var $obj = this;

	// Initialize gadget

	// Initialize gadget / add "size" class
	$obj.addClass(configService.property($obj, 'size'));

	// Initialize gadget / Load data
	$.ajax({
		url:  "interface.php",
		type: "GET",
		data: {
			type:    "json",
			cache:   "weather"+configService.property($obj, 'city_path'),
			expires: "3600",
			url:     "http://api.wunderground.com/api/52b0a04ba935dba7/conditions/forecast10day"+configService.property($obj, 'city_path')+".json"
		}, 
		success: function(info) {
			if (info['current_observation'] !== undefined) {
				$(".current .icon", $obj).attr("src", "http://icons.wxug.com/i/c/i/"+info['current_observation']['icon']+".gif");
				$(".current .temp", $obj).html(info['current_observation']['temp_c']+" &#8451;");
				$(".current .feelslike", $obj).html(info['current_observation']['feelslike_c']+" &#8451;");
				$(".current .city", $obj).html(info['current_observation']['display_location']['city']);
				$(".current .state_name", $obj).html(info['current_observation']['display_location']['state_name']);
				//$(".current .wind img", $obj).rotate(info['current_observation']['wind_degrees']);
				$(".current .wind", $obj).attr("data-degrees", info['current_observation']['wind_degrees']+"deg");
				$(".current .wind .value", $obj).html(info['current_observation']['wind_kph']+" km/h");
				var forecast;
				var line;
				$(".forecast", $obj).html("");
				for (i in info['forecast']['simpleforecast']['forecastday']) {
					forecast = info['forecast']['simpleforecast']['forecastday'][i];
					txt_day = info['forecast']['txt_forecast']['forecastday'][i*2];
					txt_night = info['forecast']['txt_forecast']['forecastday'][i*2+1];
					line = "<div class=\"day day"+i+"\">";
					line += "<span class=\"high\">"+forecast["high"]["celsius"]+" &deg;</span>";
					line += "<span class=\"low\">"+forecast["low"]["celsius"]+" &deg;</span>";
					line += "<span class=\"name\">"+txt_day["title"]+"</span>";
					line += "<span class=\"name_short\"><span class=\"bg\"></span>"+txt_day["title"].substr(0,3)+"</span>";
					line += "<img class=\"icon\" src=\"http://icons.wxug.com/i/c/i/"+forecast["icon"]+".gif\" />";
					line += "</div>";
					$(".forecast", $obj).append(line);
				}
			}
		},
		dataType: "json",
	});

	setTimeout(function () {
		gadgetReload($obj);
	}, 1000 * 60 * 60);  // Reload in 1 hour
}
