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

    // Google Maps Creation, no countdown on footer, call of the velib API
    init: function () {
        Map.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 48.8592898,
                lng: 2.3523614
            },
            zoom: 13,
            minZoom: 12,
            scrollwheel: false
        });

        Map.hideCountDownPanel();
        Map.callApiVelib();
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

    // Call of the velibAPI, display markers and clusterers, reservation, and countdown
    callApiVelib: function () {
        ajaxGet(Map.velibApi, function (reponse) {
            // Answer in a Javascript array
            var stations = JSON.parse(reponse);
            markers = [];
            stations.forEach(function (station) {
                var marker = new google.maps.Marker({
                    position: station.position,
                    map: Map.map,
                    title: station.name
                });
                markers.push(marker);

                marker.addListener('click', function () {
                    Map.hideInfosStation();
                    Map.reservationButton.css('display', 'block');
                    Map.stationName.text(station.name);
                    Map.stationAddress.text('Adresse : ' + station.address);
                    Map.availableBikes.text('Vélib(s) disponible(s) : ' + station.available_bikes);
                    Map.stationName.fadeIn('slow');
                    Map.stationAddress.fadeIn('slow');
                    Map.availableBikes.fadeIn('slow');

                    Map.reservationButton.click(function () {
                        if (station.available_bikes > 0) {
                            Map.reservationPanel.css('display', 'block');
                            Map.availableBikes.text('Il y a ' + station.available_bikes + ' vélib(s) disponible(s) à réserver !');
                        } else {
                            Map.availableBikes.text('Il n\' y a aucun vélib disponible à réserver !');
                            Map.reservationButton.css('display', 'none');
                            Map.reservationPanel.css('display', 'none');
                        }
                    });

                    Map.submitButton.click(function () {
                        localStorage.setItem('name', station.name);
                        Map.reservationPanel.css('display', 'none');
                        Map.reservationButton.css('display', 'none');
                        Map.availableBikes.text('Vous avez réservé 1 vélib à cette station');
                        Map.currentReservMessage.text('Vous avez réservé 1 vélib à la station ' + localStorage.name + ' pour ');

                        var duration = 1201;
                        var timer = setInterval(function () {
                            displayCountDown()
                        }, 1000);

                        function displayCountDown() {
                            duration--;
                            Map.timerText.show();

                            if (duration > 59) {
                                m = Math.floor(duration / 60);
                                s = duration - m * 60;
                                if (s < 10) {
                                    s = "0" + s;
                                } else if (m < 10) {
                                    m = "0" + m;
                                }
                                Map.timerText.text(m + " min " + s + " s");
                            } else if (duration <= 59 && duration > 0) {
                                Map.timerText.text("00" + " min " + duration + " s");
                            } else if (duration === 0) {
                                Map.currentReservMessage.text('Votre réservation a expiré');
                                Map.timerText.text('');
                            }
                            Map.submitButton.click(function () {
                                duration = 1201;
                            })
                            Map.cancelReservation.click(function () {
                                duration = 0;
                                Map.timerText.hide();
                            })
                        };
                        Map.cancelReservation.show();
                        Map.cancelReservation.click(function () {
                            Map.currentReservMessage.text('');
                            Map.timerText.text('Réservation annulée');
                            Map.timerText.hide();
                            Map.cancelReservation.hide();
                        })

                    })


                });
            })
            Map.displayMarkerCluster(map, markers);
        })

    },
    // Add a marker clusterer to manage the markers.
    displayMarkerCluster: function (map, markers) {
        var markerCluster = new MarkerClusterer(Map.map, markers, {
            imagePath: 'img/m/m',

        });
    },



}


$(function () {
    Map.init();

})