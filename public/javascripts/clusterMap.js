(g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })({
    key: mapToken,
    v: "weekly",
});

async function initMap() {
    // Request needed libraries.
    const MarkerClusterer = markerClusterer.MarkerClusterer;
    const locations = campgrounds.map(campground => {
        return {
            lat: campground.geometry.coordinates[1],
            lng: campground.geometry.coordinates[0],
        };
    });

    const averageLat = campgrounds.reduce((acc, campground) => acc + campground.geometry.coordinates[1], 0) / campgrounds.length;
    const averageLng = campgrounds.reduce((acc, campground) => acc + campground.geometry.coordinates[0], 0) / campgrounds.length;

    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
        "marker",
    );

    const map = new google.maps.Map(document.getElementById("cluster-map"), {
        zoom: 4,
        center: { lat: averageLat, lng: averageLng },
        mapId: "259377678cb5b772"
    });

    const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
    });

    map.addListener("click", () => {
        infoWindow.close();
    });

    // Add some markers to the map.
    const markers = campgrounds.map((campground) => {
        const position = {
            lat: campground.geometry.coordinates[1],
            lng: campground.geometry.coordinates[0],
        };

        const pinGlyph = new google.maps.marker.PinElement({
            scale: 0.7
        });

        const marker = new google.maps.marker.AdvancedMarkerElement({
            position,
            content: pinGlyph.element,
        });

        // markers can only be keyboard focusable when they have click listeners
        // open info window when marker is clicked
        const contentString = `<div class="custom-infowindow">
                                <strong>
                                    <a href="/campgrounds/${campground._id}">${campground.title}</a>
                                </strong>
                            </div>`
        marker.addListener("click", () => {
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
        });

        return marker;
    });

    // Add a marker clusterer to manage the markers.
    new MarkerClusterer({ markers, map });
}

const style = document.createElement('style');
style.innerHTML = `
    .gm-style-iw-c button.gm-ui-hover-effect {
        display: none !important;
    }
    .custom-infowindow {
        display: inline-block;
        width: auto;
        height: 8px;
    }
`;
document.head.appendChild(style);



initMap();