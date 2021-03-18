<?php
// Created by Ryan Davidovics
// Drone Drop Delivery api functions

function addUserEntry($conn, $table, $name, $address, $geocode) {
	$query = "INSERT INTO `{$table}` (`name`, `address`, `geocode`) VALUES ('{$name}','{$address}','{$geocode}');";
	return $conn->query($query);
}

function delUserEntry($conn, $table, $name, $address) {
	$query = "DELETE FROM `{$table}` WHERE `name` LIKE BINARY '{$name}' AND `address` LIKE BINARY '{$address}';";
	return $conn->query($query);
}

function checkUserName($conn, $table, $name) {
	$query = "SELECT `name` FROM `{$table}` WHERE `name` LIKE BINARY '{$name}';";
	if ($namelist = $conn->query($query)) {
		if ($namelist->num_rows > 0) {
			return true;
		}
	}
	return false;
}

function getUserNames($conn, $table, $start, $end) {
	if (strcmp(gettype($end),"NULL") == 0) {
		$query = "SELECT `name` FROM `{$table}` WHERE `index` >= {$start};";
	} else {
		$query = "SELECT `name` FROM `{$table}` WHERE `index` >= {$start} AND `index` <= {$end};";
	}
	if ($namelist = $conn->query($query)) {
		$namearray = array();
		while ($name = $namelist->fetch_row()) {
			$namearray[] = $name[0];
		}
		return json_encode($namearray);
	}
	return json_encode('');
}

function verifyUserReqStruct($data) {
	//TODO: Expand this
	//if (array_key_exists('user', $data) and array_key_exists('name', $data) and array_key_exists('cmd', $data)) {
	if (gettype($data['user']) == "string" and gettype($data['cmd']) == "string" and gettype($data['name']) == "string") {
		return true;
	}
	return false;
}

function verifyUserData($name, $address, $geocode) {
	
}

function geocodeAddress($addrvalurl, $address) {
	$faddr = urlencode($address);
	$content = '&query=' . $faddr . '&limit=1&output=json';
	$reply = file_get_contents($addrvalurl . $content, false, $context);
	$rep_address_data = json_decode($reply, true);
	return $rep_address_data["data"][0];
}

function verifyCaptcha($verifyadd, $sectoken, $restoken, $userip) {
	$content = "secret={$sectoken}&response={$restoken}&remoteip={$userip}";
	$ahttp = array ('http' => array('method' => 'POST', 'header' => 'Content-type: application/x-www-form-urlencoded', 'content' => $content));
	$context = stream_context_create($ahttp);
	$reply = file_get_contents($verifyadd, false, $context);
	$captcha_stat = json_decode($reply, true);
	return $captcha_stat['success'];
}

function verifyUserUnique($conn, $table, $name, $address) {
	if (is_string($address)) {
		$query = "SELECT `index` FROM `{$table}` WHERE `name` LIKE BINARY '{$name}' AND `address` LIKE BINARY '{$address}';";
	} else {
		$query = "SELECT `index` FROM `{$table}` WHERE `name` LIKE BINARY '{$name}';";
	}
	$result = $conn->query($query);
	if ($result->num_rows != null) {
		return false;
	}
	return true;
}

function get_content($URL){
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_URL, $URL);
      $data = curl_exec($ch);
      curl_close($ch);
      return $data;
}


?>