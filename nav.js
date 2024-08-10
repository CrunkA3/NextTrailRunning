
const trailContainer = document.getElementById("trailContainer");
const trailEntries = Object.entries(trails);


function loadTrailData(iTrail) {
    let trail = trailEntries[iTrail];
    const [key, value] = trail;

    let radioButton = document.createElement("input");
    radioButton.id = key;
    radioButton.name = "trailradio";
    radioButton.type = "radio";
    radioButton.classList.add("btn-check");
    radioButton.autocomplete = "off";

    let trailCard = document.createElement("label");
    trailCard.classList.add("btn-trail");
    trailCard.classList.add("card");
    trailCard.htmlFor = key;

    let trailImage = document.createElement("img");
    trailImage.src = value.image;
    trailImage.alt = value.title;
    trailImage.classList.add("card-img");
    trailCard.appendChild(trailImage);

    let trailCardOverlay = document.createElement("div");
    trailCardOverlay.classList.add("card-img-overlay");
    trailCard.appendChild(trailCardOverlay);

    let trailCardOverlayTitle = document.createElement("h5");
    trailCardOverlayTitle.classList.add("card-title");
    trailCardOverlayTitle.innerHTML = value.title;
    trailCardOverlay.appendChild(trailCardOverlayTitle);

    let trailCardOverlayDistance = document.createElement("p");
    trailCardOverlayDistance.classList.add("card-text");
    trailCardOverlayDistance.innerHTML = value.distance + " km | " + value.height + " hm";
    trailCardOverlay.appendChild(trailCardOverlayDistance);

    let trailCardOverlayDate = document.createElement("p");
    trailCardOverlayDate.classList.add("card-text");
    trailCardOverlayDate.innerHTML = value.date;
    trailCardOverlay.appendChild(trailCardOverlayDate);

    let loadingSpinner = document.createElement("div");
    loadingSpinner.id = key + "LoadingSpinner";
    loadingSpinner.classList.add("spinner-border");
    loadingSpinner.classList.add("mb-3");
    loadingSpinner.classList.add("position-absolute");
    loadingSpinner.classList.add("bottom-0");
    loadingSpinner.role = "status";
    loadingSpinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    trailCardOverlay.appendChild(loadingSpinner);


    trailContainer.appendChild(radioButton);
    trailContainer.appendChild(trailCard);



    //download gpx
    fetch(value.track)
        .then(response => {
            if (!response.ok) {
                throw new Error("GPX-Track konnte nicht geladen werden");
            }

            return response.text();
        })
        .then(xmlText => {
            const parser = new DOMParser();
            const gpxTrack = parser.parseFromString(xmlText, 'text/xml');
            const pointElements = gpxTrack
                .getElementsByTagName("trkpt");

            let coordinates = [];
            let elevations = [];

            let elevation = 0;
            for (var i = 0; i < pointElements.length; i++) {
                let item = pointElements[i];
                let longitude = item.getAttribute("lon");
                let latitude = item.getAttribute("lat");
                coordinates.push([latitude, longitude]);

                let elevationElement = item.getElementsByTagName("ele");
                if (elevationElement !== null && elevationElement.length > 0) {
                    elevation = elevationElement[0].innerHTML;
                }
                elevations.push(elevation);

            }


            // Track-Daten speichern
            value.coordinates = coordinates;
            value.elevations = elevations;

            // Event für Trail auswahl
            radioButton.addEventListener('change', event => {
                setDetails(event.target);
            });

            // Ersten Trail beim init laden
            if (iTrail == 0) {
                radioButton.checked = true;
                setDetails(radioButton);
            }

            const ctx = document.createElement("canvas");
            ctx.id = key + "ElevationChart"
            ctx.classList.add("position-absolute");
            ctx.classList.add("bottom-0");
            ctx.classList.add("start-0");
            ctx.classList.add("h-50");
            ctx.classList.add("w-100");

            trailCardOverlay.appendChild(ctx);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: elevations,
                    datasets: [{
                        label: 'hm',
                        data: elevations,
                        borderWidth: 0,
                        backgroundColor: '#fff8',
                        fill: {
                            target: 'origin'
                        }
                    }]
                },
                options: {
                    layout: {
                        autoPadding: false
                    },
                    scales: {
                        y: {
                            display: false,
                            beginAtZero: false
                        },
                        x: {
                            display: false
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    elements: {
                        point: {
                            pointRadius: 0
                        }
                    }
                }
            });

            trailCardOverlay.removeChild(loadingSpinner);
        });

}

const detailsCardHeaderText = document.getElementById("detailsCardHeaderText");
const detailsCardHeaderLink = document.getElementById("detailsCardHeaderLink");
const detailsDistance = document.getElementById("detailsDistance");
const detailsHeight = document.getElementById("detailsHeight");
const offCanvasTrailListElement = document.getElementById("offcanvasTrailList");

function setDetails(element) {
    elementId = element.id;
    trail = trails[elementId];
    detailsCardHeaderText.innerHTML = trail.title;
    detailsDistance.innerHTML = trail.distance.toLocaleString() + " km";
    detailsHeight.innerHTML = trail.height.toLocaleString() + " hm";
    detailsCardHeaderLink.setAttribute("href", trail.raceUrl);

    markers.clearLayers();

    const offcanvasTrailList = bootstrap.Offcanvas.getInstance(offCanvasTrailListElement);
    if (offcanvasTrailList !== null) {
        offcanvasTrailList.hide();
    }

    L.marker({ lon: trail.coordinates[0][1], lat: trail.coordinates[0][0] }).bindPopup('Start').addTo(markers);
    L.marker({ lon: trail.coordinates[trail.coordinates.length - 1][1], lat: trail.coordinates[trail.coordinates.length - 1][0] }).bindPopup('End').addTo(markers);

    var polyline = L.polyline(trail.coordinates, { color: 'red' }).addTo(markers);
    map.flyToBounds(polyline.getBounds());
}



for (var iTrail = 0; iTrail < trailEntries.length; iTrail++) {
    loadTrailData(iTrail);
};






//trailRadios[0].checked = true;
//setDetails(trailRadios[0]);