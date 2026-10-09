import { Marker, Circle } from "leaflet";
export class MapUI {
    constructor(map, layer) {
        this.radiusLatLon = [0, 0];
        this.layer = layer;
        this.map = map;
    }
    Clear() {
        this.layer.clearLayers();
    }
    CreateMarker(latlong, popupTxt, show = false, icon) {
        let marker = new Marker(latlong);
        if (icon)
            marker.options.icon = icon;
        marker.bindPopup(popupTxt);
        marker.addTo(this.layer);
        if (show == true)
            marker.openPopup();
        marker.on("click", (e) => {
            this.map.panTo(marker.getLatLng());
        });
    }
    UpdateRadius(latlong, radius) {
        if (this.radiusCircle != null)
            this.radiusCircle.remove();
        this.radiusCircle = new Circle(latlong, {
            radius: (radius * 1000),
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2
        });
        this.radiusCircle.addTo(this.layer);
    }
}
