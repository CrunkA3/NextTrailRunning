
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

const detailsCardHeader = document.getElementById("detailsCardHeader");
const detailsDistance = document.getElementById("detailsDistance");
const detailsHeight = document.getElementById("detailsHeight");

function setDetails(element) {
    elementId = element.id;
    trail = trails[elementId];
    detailsCardHeader.innerHTML = trail.title;
    detailsDistance.innerHTML = trail.distance.toLocaleString() + " km";
    detailsHeight.innerHTML = trail.height.toLocaleString() + " hm";


    //download gpx
    fetch(trail.track)
    .then(x => console.log(x.text()))
}

trailRadios.forEach(item => {
    item.addEventListener('change', event => {
        setDetails(event.target);
    });
});

trailRadios[0].checked = true;
setDetails(trailRadios[0]);