<?php 
	$dateFormat="d-m-Y H:i:s";
	echo json_encode([
		'day' => gmdate('d', time()),
		'month' => gmdate('m', time()),
		'year' => gmdate('Y', time()),
		'hour24' => gmdate('H', time()),
		'hour12' => gmdate('h', time()),
		'min' => gmdate('i', time()),
		'sec' => gmdate('s', time()),
	]);
?>