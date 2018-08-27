<?php
/*
* Author: Rohit Kumar
* Website: iamrohit.in
* Version: 2.0
* Date: 25-04-2015
* App Name: PHP Ajax Country State City Dropdown
* Description: A simple oops based php and ajax country state city dropdown list
*/

require_once 'class.DBConfig.php';

class Location extends DBConfig
{
    public static $data;

    function __construct() {
        parent::__construct();
    }

    // Fetch all countries list
    public static function getCountries() {
        try {
            $query  = "SELECT id, name FROM countries";
            $result = dbconfig::run($query);

            if ( !$result ) {
                throw new exception("Country not found.");
            }

            $res = array();

            while ( $resultSet = mysqli_fetch_assoc( $result ) ) {
                $res[$resultSet['id']] = $resultSet['name'];
            }

            parent::close();

            $data = array(
                'status' => 'success',
                'tp'     => true,
                'msg'    => "Countries fetched successfully.",
                'result' => $res
            );
        }
        catch (Exception $e) {
            $data = array( 'status' => 'error', 'tp' => 0, 'msg' => $e->getMessage() );
        }
        finally {
            return $data;
        }
    }

    // Fetch all states list by country id
    public static function getStates($countryId) {
        try {
            $query  = "SELECT id, name FROM states WHERE country_id=".$countryId;
            $result = dbconfig::run($query);

            if( !$result ) {
                throw new exception("State not found.");
            }

            $res = array();
            while ( $resultSet = mysqli_fetch_assoc($result) ) {
                $res[$resultSet['id']] = $resultSet['name'];
            }

            parent::close();

            $data = array(
                'status' => 'success',
                'tp'     => true,
                'msg'    => "States fetched successfully.",
                'result' => $res
            );
        }
        catch (Exception $e) {
            $data = array( 'status' => 'error', 'tp' => 0, 'msg' => $e->getMessage());
        }
        finally {
            return $data;
        }
    }

    // Fetch all cities list by state id
    public static function getCities($stateId) {
        try {
            $query = "SELECT id, name FROM cities WHERE state_id=".$stateId;
            $result = dbconfig::run($query);

            if ( !$result ) {
                throw new exception("City not found.");
            }

            $res = array();
            while ( $resultSet = mysqli_fetch_assoc($result) ) {
                $res[$resultSet['id']] = $resultSet['name'];
            }

            parent::close();

            $data = array(
                'status' => 'success',
                'tp'     => true,
                'msg'    => "Cities fetched successfully.",
                'result' => $res
            );
        }
        catch (Exception $e) {
            $data = array( 'status' => 'error', 'tp' => 0, 'msg' => $e->getMessage());
        }
        finally {
            return $data;
        }
    }
}
