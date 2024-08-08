
const trailContainer = document.getElementById("trailContainer");

Object.entries(trails).forEach(trail => {
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
    trailCardOverlayDistance.innerHTML = value.distance + " km";
    trailCardOverlay.appendChild(trailCardOverlayDistance);

    let trailCardOverlayHeight = document.createElement("p");
    trailCardOverlayHeight.classList.add("card-text");
    trailCardOverlayHeight.innerHTML = value.height + " hm";
    trailCardOverlay.appendChild(trailCardOverlayHeight);

    let trailCardOverlayDate = document.createElement("p");
    trailCardOverlayDate.classList.add("card-text");
    trailCardOverlayDate.innerHTML = value.date;
    trailCardOverlay.appendChild(trailCardOverlayDate);

    trailContainer.appendChild(radioButton);
    trailContainer.appendChild(trailCard);

});

const trailRadios = document.querySelectorAll('[name="trailradio"]');

const detailsCardHeaderText = document.getElementById("detailsCardHeaderText");
const detailsCardHeaderLink = document.getElementById("detailsCardHeaderLink");
const detailsDistance = document.getElementById("detailsDistance");
const detailsHeight = document.getElementById("detailsHeight");

function setDetails(element) {
    elementId = element.id;
    trail = trails[elementId];
    detailsCardHeaderText.innerHTML = trail.title;
    detailsDistance.innerHTML = trail.distance.toLocaleString() + " km";
    detailsHeight.innerHTML = trail.height.toLocaleString() + " hm";
    detailsCardHeaderLink.setAttribute("href", trail.raceUrl);


    //download gpx
    fetch(trail.track)
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

            let coordinates = []

            for (var i = 0; i < pointElements.length; i++) {
                let item = pointElements[i];
                let longitude = item.getAttribute("lon");
                let latitude = item.getAttribute("lat");
                coordinates.push([latitude, longitude]);
            }

            markers.clearLayers();


            L.marker({ lon: coordinates[0][1], lat: coordinates[0][0] }).bindPopup('Start').addTo(markers);
            L.marker({ lon: coordinates[coordinates.length - 1][1], lat: coordinates[coordinates.length - 1][0] }).bindPopup('End').addTo(markers);

            var polyline = L.polyline(coordinates, { color: 'red' }).addTo(markers);
            map.flyToBounds(polyline.getBounds());
        });
}

trailRadios.forEach(item => {
    item.addEventListener('change', event => {
        setDetails(event.target);
    });
});

trailRadios[0].checked = true;
setDetails(trailRadios[0]);