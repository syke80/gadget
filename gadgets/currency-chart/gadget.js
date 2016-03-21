$.fn.gadgetCurrencyChart = function() {
	var $obj = this;

	$(".content img", $obj).attr("src", "http://chart.finance.yahoo.com/z?s="+configService.property($obj, 'currency1')+configService.property($obj, 'currency2')+"=X&t="+configService.property($obj, 'range')+"&l=on&z=s&q=l&c=");
	
	$.ajax({
		url:  "interface.php",
		type: "GET",
		data: {
			type:    "xml",
			cache:   "yahoo-finance-"+configService.property($obj, 'currency1')+configService.property($obj, 'currency2'),
			expires: "3600",
			url:     "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22"+configService.property($obj, 'currency1')+configService.property($obj, 'currency2')+"%22)&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
		}, 
		success: function(data) {
			$(".content .ask", $obj).html(parseFloat(data["results"]["rate"]["Ask"]).toFixed(2));
			$(".content .bid", $obj).html(parseFloat(data["results"]["rate"]["Bid"]).toFixed(2));
			$(".content .rate", $obj).html(parseFloat(data["results"]["rate"]["Rate"]).toFixed(2));
		},
		dataType: "json",
	});

	setTimeout(function () {
		gadgetReload($obj);
	}, 1000 * 60 * 60);  // Reload in 1 hour

}
