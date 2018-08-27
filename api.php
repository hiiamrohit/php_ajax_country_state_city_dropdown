<?php
error_reporting(0);
ob_start();

header("Access-Control-Allow-Origin: *");

require_once 'classes/class.Location.php';

$locationObject = new Location();

try {

    if ( !isset($_POST['type']) || empty($_POST['type']) ) {
        throw new exception("Type is not set.");
    }

    $type = $_POST['type'];

    if( $type == 'getCountries' ) {
        $data = $locationObject->getCountries();
    }

    if ( $type == 'getStates' ) {
        if ( !isset($_POST['countryId']) || empty($_POST['countryId'])) {
            throw new exception("Country Id is not set.");
        }
        $data = $locationObject->getStates( $_POST['countryId'] );
    }

    if ( $type == 'getCities' ) {
        if ( !isset($_POST['stateId']) || empty($_POST['stateId']) ) {
            throw new exception("State Id is not set.");
        }
        $data = $locationObject->getCities( $_POST['stateId'] );
    }

}
catch (Exception $e) {
    $data = array(
        'status' => 'error',
        'tp'     => 0,
        'msg'    => $e->getMessage()
    );
}
finally {
    header('Content-Type: application/json');
    echo json_encode($data);
}

ob_flush();
