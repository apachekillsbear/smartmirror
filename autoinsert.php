<?php

$link = mysqli_connect("localhost", "root", "usbw", "mirror");

$handle = fopen($_SERVER["DOCUMENT_ROOT"]."/city.list.json", "r");

while (($line = fgets($handle)) !== false) {
	set_time_limit(30);
	$row = json_decode($line, true);
	$sql = "INSERT INTO city_id (id, city, country) VALUES (" . $row["_id"] . ",\"" . $row["name"] . "\",\"" . $row["country"] . "\")";
	mysqli_query($link, $sql);
}

fclose($handle);

mysqli_close($link);
?>