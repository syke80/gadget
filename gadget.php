<?php

function fetchPutVars() {
	if ($_SERVER['REQUEST_METHOD'] != "PUT") return FALSE;
	parse_str(file_get_contents('php://input'), $putVars);
	return $putVars;
}

function updateConfig($idUser, $config) {
	global $conn;

	$sql = '
		UPDATE user 
		SET config = ?
		WHERE id_user = ?
	';

	if ($stmt = $conn->prepare($sql)) {
		$stmt->bind_param("si", $config, $idUser);
		$stmt->execute();
		$stmt->close();
		return TRUE;
	}

	//echo $conn->error;
	return FALSE;
}

function getConfig($idUser) {
	global $conn;

	$sql = '
		SELECT *
		FROM user
		WHERE id_user = ?
	';

	if ($stmt = $conn->prepare($sql)) {
		$stmt->bind_param("i", $idUser);
		$stmt->execute();
		$result = $stmt->get_result();
		$stmt->close();
		return $result;
	}

	//echo $conn->error;
	return FALSE;
}

require 'config.php';
global $conn;
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT);

if ($_SERVER['REQUEST_METHOD'] == "PUT") {
	$vars = fetchPutVars();
	updateConfig(1, $vars['config']);
}

if ($_SERVER['REQUEST_METHOD'] == "GET") {
	$result = getConfig(1)->fetch_object();
	echo $result->config;
}
