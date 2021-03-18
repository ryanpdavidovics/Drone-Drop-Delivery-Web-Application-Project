<?php 
	$DB_HOST = "sql100.epizy.com";
	$DB_USER = "epiz_28147458";
	$DB_PASS = "9GOTBn87hUS";
	$DB_NAME = "epiz_28147458_drone_drop_delivery_rec";
	$DB_TBL_USERS = "users";
	$CAP_KEY = "6LfjLn8aAAAAALWHsAEXNtgx64CCOlnZNXD2-pWf";
	$CAP_URL = "https://www.google.com/recaptcha/api/siteverify";
	$ADR_KEY = "117cdb7df17d404daf8673e4d3365c38";
	$ADR_URL = "http://api.positionstack.com/v1/forward?access_key=" . $ADR_KEY;
	
	$userip = $_SERVER['REMOTE_ADDR']; // This may need to be adjusted if captcha service looks past proxies
	$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
	$resp = array('status' => '', 'error' => 'none');
	header('Content-Type: application/json');
	
	// Connect to database
	if ($conn->connect_error){
		$resp['error'] = $conn->connect_error;
		$resp['status'] = 'ERROR';
		die(json_encode($resp));
	}

	// If needed tables don't exist, create them.
	$conn->query("CREATE TABLE IF NOT EXISTS `{$DB_TBL_USERS}` (`index` INT PRIMARY KEY AUTO_INCREMENT, 
																`name` VARCHAR(128) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL, 
																`address` VARCHAR(256) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
															`geocode` VARCHAR(32) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL);");
	
	$post_data = json_decode(file_get_contents('php://input'), true);
	// Handle request
	// user = drone/user, g-recaptcha-response = '', cmd = adduser/users/checkaddr/getaddr/getgeo
	if (strcmp($post_data['user'],'user') == 0) {
		require("src/user_functions.php");
		if (verifyUserReqStruct($post_data)) {
			if (strcmp($post_data['cmd'],'adduser') == 0) {
				if (verifyCaptcha($CAP_URL, $CAP_KEY, $post_data['g-recaptcha-response'], $userip)) {
					if (verifyUserUnique($conn, $DB_TBL_USERS, $post_data['name'], $post_data['address'])) {
						$resp['status'] = addUserEntry($conn, $DB_TBL_USERS, $post_data['name'], $post_data['address'], $post_data['geocode']);
					} else {
						$resp['error'] = 'User Already Entered';
						$resp['status'] = false;
					}
				} else {
					$resp['error'] = 'Captcha Could Not Be Verified';
					$resp['status'] = false;
				}
			} else if (strcmp($post_data['cmd'],'users') == 0) {
				if (!verifyUserUnique($conn, $DB_TBL_USERS, $post_data['name'], NULL)) {
					$resp['status'] = true;
					$resp['users'] = getUserNames($conn, $DB_TBL_USERS, 0, NULL);
				}
			} else if (strcmp($post_data['cmd'],'geocode') == 0) {
				$res = geocodeAddress($ADR_URL, $post_data['address']);
				if ($res != NULL) {
					$resp['status'] = true;
					$resp['result'] = $res;
				}
			} else if (strcmp($post_data['cmd'],'deluser') == 0){
				if (verifyCaptcha($CAP_URL, $CAP_KEY, $post_data['g-recaptcha-response'], $userip) and
					!verifyUserUnique($conn, $DB_TBL_USERS, $post_data['name'], $post_data['address'])) {
						$resp['status'] = delUserEntry($conn, $DB_TBL_USERS, $post_data['name'], $post_data['address']);
					}
			} else {
				$resp['error'] = 'Failed Command Execution';
				$resp['status'] = false;
			}
		} else {
			$resp['error'] = 'Command Not Supported';
			$resp['status'] = false;
		}
	} else if (strcmp($post_data['user'],'drone') == 0) {
		// Drone API goes here.
	} else {
		$resp['error'] = 'Bad user type';
		$resp['status'] = false;
	}

	echo json_encode($resp);
	
?>