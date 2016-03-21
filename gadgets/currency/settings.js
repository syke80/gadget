$.fn.gadgetCurrencySettings = function() {
	var $obj = this;
	var currencyList = {};
	var currencyDB = {};

	var buildList = function() {
		var list = configService.property($obj, 'list');
		var content = "";
		
		// Build the content of select element
		var options = "";
		for (i in currencyDB) {
			options += "<option value=\""+i+"\">"+i+"</option>";
		}
		
		// Build list of selects
		for (i in list) {
			content += "<li><select>"+options+"</select><button type=\"button\">Remove</button></li>";
		}

		// Append to DOM
		$(".settings .currencies", $obj).html("<ul>"+content+"</ul>");

		// Define events:
		//   onchange: save all variables to config
		$(".settings .currencies ul li select", $obj).change( function() {
			var listToSave = [];
			var items = $(".settings .currencies ul li select", $obj).each( function() {
				listToSave.push($(this).val());
			});
			list = listToSave;
			configService.property($obj, 'list', listToSave);
		});
		//   remove button
		$(".settings .currencies ul li button", $obj).click( function() {
			list.splice($(".settings .currencies ul li", $obj).index($(this).parent()), 1);
			configService.property($obj, 'list', list);
			buildList();
		});

		// Select specified items in the rows
		for (i in list) {
			$(".settings .currencies ul li:nth-child("+(parseInt(i)+1)+") select", $obj).val(list[i]);
		}
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

	$(".settings .btn-add", $obj).click( function() {
		var list = configService.property($obj, 'list');
		if (list == undefined) list = [];
		list.push("EUR");
		configService.property($obj, 'list', list);
		buildList();
	});

	loadRates( function() {
		buildList();
	});
}
