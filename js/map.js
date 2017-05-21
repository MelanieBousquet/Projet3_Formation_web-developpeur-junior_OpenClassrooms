var Map = {
    // Api OpenData Paris key
    velibApi: 'https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=28950ba3df2d20b429a4e90c6d58654d921a0964',
    map: null,
    reservationPanel: $('.reservation'),
    stationName: $('.station-name'),
    stationAddress: $('.station-address'),
    availableBikes: $('.available-bikes'),
    infoStationPanel: $('.info-station'),
    reservationButton: $('.reservation-button'),
    submitButton: $('#submit'),
    currentReservMessage: $('.footer-text'),
    cancelReservation: $('.cancel'),
    timerText: $('.timer-text'),
    x: null,

    // Google Maps Creation, no countdown on footer, call of the velib API
    init: function () {
        Map.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 48.8592898,
                lng: 2.3523614
            },
            zoom: 13,
            minZoom: 11,
            scrollwheel: false
        });

        Map.hideCountDownPanel();
        Map.callApiVelib();
    },
    // Add a marker clusterer to manage the markers.
    displayMarkerCluster: function (map, markers) {
        var markerCluster = new MarkerClusterer(Map.map, markers, {
            imagePath: 'img/m/m',

        });
    },

    // when there isn't a current reservation : no countdown, no cancel button
    hideCountDownPanel: function () {
        Map.timerText.hide();
        Map.cancelReservation.hide();
    },

    // Hide precedent station informations on click on a different station
    hideInfosStation: function () {
        Map.reservationPanel.fadeOut();
        Map.stationName.hide();
        Map.stationAddress.hide();
        Map.availableBikes.hide();
    },

    countDown: function() {
        var finishDate = new Date().getTime() + 1200000;
        Map.x = setInterval(function() {
            var now = new Date().getTime();

            var distance = finishDate - now;

            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            // Display the result in the element with id="demo"
            Map.timerText.fadeIn();
             Map.timerText.text(minutes + "m " + seconds + "s ");

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                Map.currentReservMessage.text('Votre réservation a expiré');
                Map.timerText.text('');
            }


        }, 999);

    },

    // Call of the velibAPI, display markers and clusterers, reservation, and countdown
    callApiVelib: function () {
        ajaxGet(Map.velibApi, function (reponse) {
            // Answer in a Javascript array
            var stations = JSON.parse(reponse);
            markers = [];
            // For each station : we create a marker on the map + we define actions on click on this marker
            stations.forEach(function (station) {
                var marker = new google.maps.Marker({
                    position: station.position,
                    map: Map.map,
                    title: station.name
                });
                markers.push(marker);

                // Display infosStations on click on the marker
                marker.addListener('click', function () {
                    Map.hideInfosStation();
                    Map.reservationButton.css('display', 'block');
                    Map.stationName.text(station.name);
                    Map.stationAddress.text('Adresse : ' + station.address);
                    Map.availableBikes.text('Vélib(s) disponible(s) : ' + station.available_bikes);
                    Map.stationName.fadeIn('slow');
                    Map.stationAddress.fadeIn('slow');
                    Map.availableBikes.fadeIn('slow');
                    // On click on a marker, smooth scroll to the informations panel for a better experience for mobile devices
                    $('html, body').animate({
                        scrollTop: Map.infoStationPanel.offset().top},
                        'slow'
                    );

                    // Display the panel of reservation on click on the reservation button
                    Map.reservationButton.click(function () {
                        if (station.available_bikes > 0) {
                            Map.reservationPanel.css('display', 'block');
                            Map.availableBikes.text('Il y a ' + station.available_bikes + ' vélib(s) disponible(s) à réserver !');
                        } else {
                            Map.availableBikes.text('Il n\' y a aucun vélib disponible à réserver !');
                            Map.reservationButton.css('display', 'none');
                            Map.reservationPanel.css('display', 'none');
                        }
                        // On click on a marker, smooth scroll to the reservation panel for a better experience for mobile devices
                        $('html, body').animate({
                        scrollTop: Map.reservationPanel.offset().top},
                        'slow'
                    );
                    });

                    // Register reservation on validation
                    Map.submitButton.click(function () {
                        sessionStorage.setItem('name', station.name);
                        Map.reservationPanel.css('display', 'none');
                        Map.reservationButton.css('display', 'none');
                        Map.availableBikes.text('Vous avez réservé 1 vélib à cette station');
                        Map.currentReservMessage.text('Vous avez réservé 1 vélib à la station ' + sessionStorage.name + ' pour ');
                        Map.cancelReservation.show();
                        // Reset a precedent countdown if there was a precedent reservation
                        clearInterval(Map.x);
                        // Start a new countdow for the current reservation
                        Map.countDown();

                        // Annulation of the reservation
                        Map.cancelReservation.click(function () {
                            clearInterval(Map.x);
                            Map.currentReservMessage.text('');
                            Map.timerText.text('Réservation annulée');
                            Map.cancelReservation.hide();
                        })
                    })
                });
            })
            Map.displayMarkerCluster(map, markers);
        })
    },

}


$(function () {
    Map.init();

})
