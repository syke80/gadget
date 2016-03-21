$.fn.gadgetCurrency = function() {
	var $obj = this;
	
	var currencyList = {};
	var currencyDB = {};

	var buildList = function() {
		var list = configService.property($obj, 'list');
		var content = "";
		
		// Build rows
		for (i in list) {
			content += "<li data-currency=\""+list[i]+"\" data-rate=\""+currencyDB[list[i]]+"\"><label>"+list[i]+"<input /></label></li>";
		}

		// Append to DOM
		$(".content .currencies", $obj).html("<ul>"+content+"</ul>");

		// Define onkeyup (onchange) event
		$(".content .currencies ul li label input", $obj).keyup( function() {
			var $currentObj = $(this).parent().parent();
			var euroValue = $(this).val() / $currentObj.attr("data-rate");
			$(".content .currencies ul li", $obj).each( function() {
				if ($(this) != $currentObj) {
					if ($(this).attr("data-currency") != $currentObj.attr("data-currency")) {
						$("input", this).val(($(this).attr("data-rate") * euroValue).toFixed(2));
					}
				}
			});
			configService.property($obj, 'lastNumber', {
				currency: $currentObj.attr("data-currency"),
				value: $(this).val()
			});
			configService.save();
			//save_last_number(current_obj.attr("currency"), current_obj.val());
		});

		// Get last typed number (and what currency was it) and set inputs
		var lastNumber = configService.property($obj, 'lastNumber');
		$(".content .currencies ul li[data-currency="+lastNumber.currency+"] input", $obj).val( lastNumber.value );
		$(".content .currencies ul li[data-currency="+lastNumber.currency+"] input", $obj).trigger("keyup");
	}

	var loadRates= function(callback) {
		$.ajax({
			url:  "interface.php",
			type: "GET",
			data: {
				type:    "xml",
				cache:   "currency",
				expires: "3600",
				url:     "http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml"
			}, 
			success: function(data) {
				var currencyList = data["Cube"]["Cube"]["Cube"];
				var eur = new Array();
				eur["@attributes"] = new Array();
				eur["@attributes"]["currency"] = "EUR";
				eur["@attributes"]["rate"] = "1";
				currencyList.push(eur);
				currencyList.sort( function(a,b) {return a["@attributes"]["currency"] > b["@attributes"]["currency"] } );
				
				for (i in currencyList) {
					currencyDB[currencyList[i]["@attributes"]["currency"]] = currencyList[i]["@attributes"]["rate"];
				}
				if (callback !== undefined) callback();
			},
			dataType: "json",
		});
	}

	loadRates( function() {
		buildList();
	});

	setTimeout(function () {
		gadgetReload($obj);
	}, 1000 * 60 * 60);  // Reload in 1 hour
}
