var map, popup, Popup;
var mapElement = document.getElementById('map');
var popupOpen = false;
const sheetID = '2PACX-1vTr-LZbaPvZsAPGtDZgpy8114aJmzIrLdb2i2DLnZMK1DrVNbiP7SL9j1jESAm4AFpErxegxC0imtNH';

const C_DARK = '#222222',
      C_NORMAL = '#333333',
      C_LIGHT = '#444444',
      C_EXTRALIGHT = '#666666',
      C_ACCENT = '#63aaff',
      C_WHITE = '#f9f9f9';
const mapStyles = [
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
            color: C_DARK
        }]
    },
    {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{
            color: C_LIGHT
        }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
            {
                color: C_LIGHT
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
            color: C_EXTRALIGHT
        }]
    },
    {
        elementType: 'labels.text.stroke',
        stylers: [
            {
                visibility: 'on'
            },
            {
                color: C_EXTRALIGHT
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
            color: C_WHITE
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
                color: C_ACCENT
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
            color: C_NORMAL
        }]
    }
];


// Called by Maps API upon loading.
function initMap() {
    definePopupClass();

    map = new google.maps.Map(mapElement, { // Define Map Settings
        center: {
            lat: 41.3163,
            lng: -72.9228
        },
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        backgroundColor: '#333333',
        styles: mapStyles,
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
                console.log(data);
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

