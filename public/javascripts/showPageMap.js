

(g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })({
    key: mapToken,
    v: "weekly",
});
let map;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const position = { lat: campground.geometry.coordinates[1], lng: campground.geometry.coordinates[0] };

    map = new Map(document.getElementById("map"), {
        center: position,
        zoom: 12,
    });

    const contentString = `<div class="custom-infowindow">
                            <h6>${campground.title}</h6>
                            <p>${campground.location}</p>
                          </div>`;

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: campground.location,
    });

    const marker = new google.maps.Marker({
        position: position,
        map: map
    });

    marker.addListener("mouseover", () => {
        infowindow.open({
            anchor: marker,
            map,
        });
    });

    marker.addListener("mouseout", () => {
        infowindow.close();
    });
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