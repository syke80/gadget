<?php
	/**
	 *  TODO:
	 *    -kell egy log, hogy ellenorizzem mit csinal, ne menjen ki plusz keres, mert pl a weather gadgetnel napi limit van	 
	 *  	-request: clean url
	 *  	-request:	POST PUT GET DELETE metodusok
	 */	 

	/**
	 *  Letölt egy XML-t egy URL-röl
	 *  	type: XML
	 *  	url:	 
	 *  	cache: ha cachelni akarjuk, akkor ez lesz az azonosító. pl currency, vagy weather_/q/zmw:94125.1.99999
	 *  	expires: cacheléskor a lejárati dátum. ha nincs megadva, akkor nem jár le soha	 	 
	 */	 

function get_url_contents($url) {
	$ch = curl_init();
	$timeout = 5;
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
	$data = curl_exec($ch);
	curl_close($ch);
	return $data;
}

// Beérkező paraméterek feldolgozása, inicializálás
$type = isset($_GET['type']) ? $_GET['type'] : '';
$url = isset($_GET['url']) ? $_GET['url'] : '';
$cache = isset($_GET['cache']) ? $_GET['cache'] : '';
$expires = isset($_GET['expires']) ? $_GET['expires'] : '';


if (empty($type) || empty($url)) return;

add_log("Request: ".str_pad($type, 5)." | ".str_pad($cache, 10)." | {$url}");
if ($cache) {
	$data = cache_get($cache);
	if ($data === FALSE) {
		add_log("Cache miss: {$cache}");
		$data = get_data($type, $url);
		if ($data) cache_set($cache, $data, $expires);
	}
	else {
		add_log("Cache hit: {$cache}");
	}
	echo $data;
}
else {
	add_log("No cache");
	echo get_data($type, $url);
}
add_log("");
write_log();

function get_data($type, $url) {
	add_log("Get data {$type} from {$url}");
	switch ($type) {
		case 'xml':
			$XML = simplexml_load_file($url);
			return json_encode($XML);
			break;
		case 'json':
//			return file_get_contents($url);
			return get_url_contents($url);
			break;
	}
}

function cache_get($id) {
	include_once 'config.php';
	$db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
	if($db->connect_errno > 0){
		die('Unable to connect to database [' . $db->connect_error . ']');
	}

	if ($stmt = $db->prepare("SELECT data, (expires<NOW()) AS expired FROM cache WHERE id=?")) {
		$stmt->bind_param("s", $id);
		$stmt->execute();
		$stmt->bind_result($data, $expired);
		$stmt->fetch();
		$stmt->close();
	}
	if ($data == null) return FALSE;

	if ($expired) {
		if ($stmt = $db->prepare("DELETE FROM cache WHERE id=?")) {
			$stmt->bind_param("s", $id);
			$stmt->execute();
			$stmt->close();
		}
		
		return FALSE;
	}

	return $data;
}

/**
 * $id:
 * $data
 * $expires: az adat érvényessége másodpercben
 */	 	 	 	
function cache_set($id, $data, $expires) {
	include_once 'config.php';
	$db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
	if($db->connect_errno > 0){
		die('Unable to connect to database [' . $db->connect_error . ']');
	}

	if ($expires) {
		if ($stmt = $db->prepare("REPLACE INTO cache SET data=?, expires=DATE_ADD(NOW(), INTERVAL ? SECOND), id=?")) {
			$stmt->bind_param("sis", $data, $expires, $id);
			$stmt->execute();
			$stmt->close();
		}
	}
	else {
		if ($stmt = $db->prepare("REPLACE INTO cache SET data=?, expires=NULL, id=?")) {
			$stmt->bind_param("ss", $data, $id);
			$stmt->execute();
			$stmt->close();
		}
	}

	$db->close();
}

function add_log($txt) {
	if (!isset($GLOBALS['log'])) $GLOBALS['log'] = '';
	if ($txt) $GLOBALS['log'] .= date("Y-m-d H:i:s").' '.$txt."\r\n";
	else $GLOBALS['log'] .= "\r\n";
}

function write_log() {
	file_put_contents('interface.log', $GLOBALS['log'], FILE_APPEND);
}

?>