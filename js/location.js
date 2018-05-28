function ajaxCall() {

    this.send = function (data, url, method, success, type) {
        type = type||'json';
        var successRes = function(data) {
            success(data);
        };

        var errorRes = function(e) {
            console.log(e);
            alert("Error found \nError Code: "+e.status+" \nError Message: "+e.statusText);
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

function locationInfo() {

    var rootUrl = "api.php",
        call    = new ajaxCall();

    this.getCities = function(id) {

        $(".cities option:gt(0)").remove();

        var url    = rootUrl + '?type=getCities&stateId=' + id,
            method = "post",
            data   = {};

        $('.cities').find("option:eq(0)").html("Please wait..");

        call.send(data, url, method, function(data) {

            $('.cities').find("option:eq(0)").html("Select City");

            if (data.tp == 1) {
                $.each(data['result'], function(key, val) {

                    var option = $('<option />');
                    option.attr('value', key).text(val);
                    $('.cities').append(option);
                });

                $(".cities").prop("disabled",false);
            }
            else {
                alert(data.msg);
            }
        });
    };

    this.getStates = function(id) {
        $(".states option:gt(0)").remove();
        $(".cities option:gt(0)").remove();

        var url    = rootUrl + '?type=getStates&countryId=' + id,
            method = "post",
            data   = {};

        $('.states').find("option:eq(0)").html("Please wait..");

        call.send(data, url, method, function(data) {

            $('.states').find("option:eq(0)").html("Select State");

            if (data.tp == 1) {

                $.each(data['result'], function(key, val) {

                    var option = $('<option />');
                    option.attr('value', key).text(val);
                    $('.states').append(option);
                });

                $(".states").prop("disabled",false);
            }
            else{
                alert(data.msg);
            }
        });
    };

    this.getCountries = function() {
        var url    = rootUrl+'?type=getCountries',
            method = "post",
            data   = {};

        $('.countries').find("option:eq(0)").html("Please wait..");

        call.send(data, url, method, function(data) {

            $('.countries').find("option:eq(0)").html("Select Country");

            //console.log(data);

            if (data.tp == 1) {

                $.each(data['result'], function(key, val) {
                    var option = $('<option />');
                    option.attr('value', key).text(val);
                    $('.countries').append(option);
                });

                $(".countries").prop("disabled",false);
            }
            else {
                alert(data.msg);
            }
        });
    };

}

$(function() {

    $('.countries').select2({
        placeholder: 'Choose a Country',
        width: '200px'
    });

    $('.states').select2({
        placeholder: 'Choose a State',
        width: '200px'
    });

    $('.cities').select2({
        placeholder: 'Choose a City',
        width: '200px'
    });

    var loc = new locationInfo();
    loc.getCountries();

    $(".countries").on("change", function(ev) {
        var countryId = $(this).val();
        if (countryId != '') {
            loc.getStates(countryId);
        }
        else {
            $(".states option:gt(0)").remove();
        }
    });

    $(".states").on("change", function(ev) {
        var stateId = $(this).val();
        if (stateId != '') {
            loc.getCities(stateId);
        }
        else {
            $(".cities option:gt(0)").remove();
        }
    });
});
