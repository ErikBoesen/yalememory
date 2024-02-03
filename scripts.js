var map, popup, Popup;
var mapElement = document.getElementById('map');
var popupOpen = false;
const sheetID = '2PACX-1vTr-LZbaPvZsAPGtDZgpy8114aJmzIrLdb2i2DLnZMK1DrVNbiP7SL9j1jESAm4AFpErxegxC0imtNH';


// Called by Maps API upon loading.
function initMap() {
    definePopupClass();

    map = new google.maps.Map(mapElement, { // Define Map Settings
        center: {
            lat: 35,
            lng: -98
        },
        zoom: 4,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        backgroundColor: '#333333',
        styles: [
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{
                    color: '#222222'
                }]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{
                    color: '#444444'
                }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#444444'
                    },
                    {
                        lightness: -37
                    }
                ]
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{
                    color: '#666666'
                }]
            },
            {
                elementType: 'labels.text.stroke',
                stylers: [
                    {
                        visibility: 'on'
                    },
                    {
                        color: '#666666'
                    },
                    {
                        weight: 2
                    },
                    {
                        gamma: 0.84
                    }
                ]
            },
            {
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#ffffff'
                }]
            },
            {
                featureType: 'administrative',
                elementType: 'geometry',
                stylers: [
                    {
                        weight: 0.6
                    },
                    {
                        color: '#d12727'
                    }
                ]
            },
            {
                elementType: 'labels.icon',
                stylers: [{
                    visibility: 'off'
                }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{
                    color: '#333333'
                }]
            }
        ]
    });

    console.log('Running Papa query...');
    fetchPapaData()
        .then(displayMap);
}

function fetchPapaData() {
    var fetchFunction = function fetchData(resolve, reject) {
        Papa.parse(`https://docs.google.com/spreadsheets/d/e/${sheetID}/pub?output=csv`, {
            header: true,
            download: true,
            delimiter: ',',
            dynamicTyping: true,
            error: reject,
            // "complete:" is the callback when the parser finishes, and spits out its finished data (the data is stored in the 'papa' variable)
            complete: function({ data }, _) {
                console.log(papa.data);
                /*
                for (name in memories) {
                    //console.log('Creating marker for ' + name + ' with ' + institutions[name].students.length + ' student(s).');
                    var marker = new google.maps.Marker(institutions[name]);
                    google.maps.event.addListener(marker, 'click', function() {
                        details(this);
                    });
                    marker.setMap(map);
                }
                */
            }
        });
    }

    return new Promise(fetchFunction);
}

function displayMap() {
    // TODO
}

function clearPopups() {
    if (popup) popup.setMap(null);
}

function details(institution) {
    clearPopups();
    var info = document.createElement('div');
    var title = document.createElement('h3');
    title.textContent = institution.name;
    info.appendChild(title);
    popup = new Popup(new google.maps.LatLng(institution.position.lat(), institution.position.lng()), info);
    popup.setMap(map);
    console.log('Adding popup');
    popupOpen = true;
}

var dragged = false;
onmousedown = function() {
    dragged = false;
}
onmousemove = function() {
    dragged = true;
}

onmouseup = function(e) {
    // Check that we're not clicking a marker and that there was no dragging
    if (e.target.tagName != 'AREA'
        && dragged == false) {
        clearPopups();
    }
    dragged = false;
}

onkeydown = function(e) {
    if (e.key === 'Escape') {
        clearPopups();
    }
}

