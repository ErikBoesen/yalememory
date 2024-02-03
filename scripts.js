const mapElement = document.getElementById('map');
const placeButton = document.getElementById('placeButton');
let map, popup, Popup;
let popupOpen = false;
const sheetID = '2PACX-1vTr-LZbaPvZsAPGtDZgpy8114aJmzIrLdb2i2DLnZMK1DrVNbiP7SL9j1jESAm4AFpErxegxC0imtNH';
const formID = '1FAIpQLSeReJCEVjobeGBiXIlwyMtDqmA8kb2V_DCeM0F1k3C51tyTwQ';
const CENTER = {
    lat: 41.3163,
    lng: -72.9228
};
const PAN_DISTANCE = 0.1;
const C_DARK = '#001f40',
      C_NORMAL = '#002a55',
      C_LIGHT = '#00356b',
      C_EXTRALIGHT = '#286dc0',
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
        center: CENTER,
        restriction: {
            latLngBounds: {
                north: CENTER.lat + PAN_DISTANCE,
                south: CENTER.lat - PAN_DISTANCE,
                west: CENTER.lng - PAN_DISTANCE,
                east: CENTER.lng + PAN_DISTANCE,
            },
            strictBounds: false,
        },

        zoom: 15,
        minZoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        backgroundColor: C_NORMAL,
        styles: mapStyles,
    });

    console.log('Running Papa query...');
    fetchPapaData()
        .then(displayMap);

    map.addListener('click', (mapsMouseEvent) => {
        if (placing) {
            let coordinates = mapsMouseEvent.latLng;
            let lat = coordinates.lat();
            let lng = coordinates.lng();
            window.open(`https://docs.google.com/forms/d/e/${formID}/viewform?usp=pp_url&entry.732376344=${lat}&entry.1233983317=${lng}`, '_blank');
            //&entry.1896936497=titlehere&entry.1231121394=bodyhere
            stopPlacing();
        }
    });
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
                for (let rawMemory of data) {
                    let memory = {
                        position: {
                            lat: rawMemory['Latitude'],
                            lng: rawMemory['Longitude'],
                        },
                        title: rawMemory['Title of your memory'],
                        body: rawMemory['What\'s your fondest memory at this location?'],
                    };
                    //console.log('Creating marker for ' + name + ' with ' + institutions[name].students.length + ' student(s).');
                    var marker = new google.maps.Marker(memory);
                    google.maps.event.addListener(marker, 'click', function() {
                        details(this);
                    });
                    marker.setMap(map);
                }
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

function details(memory) {
    clearPopups();
    let info = document.createElement('div');
    let title = document.createElement('h3');
    title.textContent = memory.title;
    info.appendChild(title);
    let body = document.createElement('p');
    body.textContent = memory.body;
    info.appendChild(body);

    popup = new Popup(new google.maps.LatLng(memory.position.lat(), memory.position.lng()), info);
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

let placing = false;
function startPlacing() {
    placing = true;
    document.body.classList.add('placing');
}

function stopPlacing() {
    placing = false;
    document.body.classList.remove('placing');
}

placeButton.onclick = function() {
    console.log('hi' + placing);
    if (placing) {
        stopPlacing();
    } else {
        startPlacing();
    }
}
