"use strict"

function AjaxRequest() {

    this.send = function(data, url, method, success, type) {

        type = type || 'json';

        let successRes = function(data) {
            success(data);
        };

        let errorRes = function(e) {
            console.log(e);
            alert("Error found \nError Code: " + e.status + " \nError Message: " + e.statusText);
        };
        $.ajax({
            url: url,
            type: method,
            data: data,
            success: successRes,
            error: errorRes,
            dataType: type,
            timeout: 60000
        });
    }
}

function LocationInfo() {

    const __API_URL__ = "api.php",
          ajxReqst    = new AjaxRequest();

    this.getCities = function(id) {

        /**
         * Removing existing cities except index[0]
        */

        $("#cities option:gt(0)").remove();

        ajxReqst.send({ type: 'getCities', stateId: id }, __API_URL__, 'post', function(data) {

            if ( data.tp ) {
                $.each(data['result'], function(key, val) {
                    var option = $('<option />');
                    option.attr('value', key).text(val);
                    $('#cities').append(option);
                });
            }
            else {
                alert(data.msg);
            }
        });
    };

    this.getStates = function(id) {

        /**
         * Removing existing cities and states except index[0]
        */

        $("#states option:gt(0)").remove();
        $("#cities option:gt(0)").remove();

        ajxReqst.send({ type: 'getStates', countryId: id }, __API_URL__, 'post', function(data) {

            if ( data.tp ) {

                $("#states option").remove();

                $.each(data['result'], function(key, val) {
                    let option = $('<option />');
                    option.attr('value', key).text(val);
                    $('#states').append(option);
                });
            }
            else {
                alert(data.msg);
            }
        });
    };

    this.getCountries = function() {

        /**
         * Removing existing states and cities except index[0]
        */

        $("#state option:gt(0)").remove();
        $("#cities option:gt(0)").remove();

        ajxReqst.send({ type: 'getCountries' }, __API_URL__, 'post', function(data) {

            if ( data.tp ) {

                $.each(data['result'], function(key, val) {
                    let option = $('<option />');
                    option.attr('value', key).text(val);
                    $('#countries').append(option);
                });
            }
            else {
                alert(data.msg);
            }
        });
    };

}

$(function() {

    $('#countries').append('<option value="">Choose a country</option>');
    $('#states').append('<option value="">Choose a state</option>');
    $('#cities').append('<option value="">Choose a City</option>');

    var loc = new LocationInfo();
    loc.getCountries();

    $("#countries").on("change", function() {

        let countryId = $(this).val();

        if ( countryId != '' ) {
            loc.getStates(countryId);
        }
    });

    $("#states").on("change", function() {

        var stateId = $(this).val();

        if ( stateId != '' ) {
            loc.getCities(stateId);
        }
    });
});
