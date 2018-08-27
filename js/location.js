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

    const __API_URL__          = "api.php",

          /**
           * Set your Pixabay API key here
          */
          __PIXABAY_API_KEY__  = '',
          ajxReqst             = new AjaxRequest();

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

    /**
     Pixabay fetch images process
    */
    this.getLocationImages = function( searchQuery ) {

        let __PIXABAY_API_URL__  = 'https://pixabay.com/api/?'       ;
            __PIXABAY_API_URL__ += 'image_type=photo&pretty=true&'   ;
            __PIXABAY_API_URL__ += 'key=' + __PIXABAY_API_KEY__ + '&';
            __PIXABAY_API_URL__ += 'q='   + searchQuery;

        ajxReqst.send({}, __PIXABAY_API_URL__, 'get', function( apiResponseJSON ) {

            /**
             * If API founds query images
            */
            if ( apiResponseJSON.total > 0 ) {

                /**
                 * Clearing up the images container
                */
                $('.images-gallery').html('');

                let seatchResultTemplate = `
                    <h4>${apiResponseJSON.total} images found from</h4>
                    <a href="https://pixabay.com/en/photos/?q=${searchQuery}" target="_blank">
                        <img src="./images/pixabay_logo_square.svg" alt="Pixabay Logo">
                    </a>
                `;

                $('.images-info').html( seatchResultTemplate );

                /**
                 * Need to use for loop to preview only 20 images
                */

                let imgPreviewLimit = (apiResponseJSON.total > 20 ? 20 : apiResponseJSON.total);

                for (let i = 0; i < imgPreviewLimit; i++) {

                    let largeImageURL = apiResponseJSON.hits[i].largeImageURL,
                        previewURL    = apiResponseJSON.hits[i].previewURL;

                    /**
                     * Creating <a>
                    */
                    let $a = $('<a>');
                    $a.attr('href', largeImageURL);
                    $a.attr('target', '__blank');

                    /**
                     * Creating <img/>
                    */
                    let $img = $('<img/>');
                    $img.attr('src', previewURL);

                    /**
                     * Now adding the img to a
                    */
                    $a.html( $img );

                    /**
                     * Finally appending the <a> t the images-gallery
                    */
                    $('.images-gallery').append($a);
                }
            }
            else {
                alert( 'No images found!' );
            }
        });
    }

}

$(document).ready(function() {

    let loc = new LocationInfo();

    /**
     * Feching country names by default
    */
    loc.getCountries();

    /**
    * Make it false if you don't have an API key, else set your API key
    * at line no 37
    */
    const IMAGES_PREVIEW = false;

    /**
    * Select2 initialized
    */

    $('select').select2({ width: '400px' });

    $('#countries').on('change', function() {

        let countryId   = $(this).val(),
            countryName = $('#countries option:selected').text();

        if ( countryId != '' ) {

            loc.getStates(countryId);

            if ( IMAGES_PREVIEW ) {
                loc.getLocationImages( countryName );
            }
        }
    });

    $('#states').on('change', function() {

        let stateId = $(this).val();

        if ( stateId != '' ) {
            loc.getCities(stateId);
        }
    });
});
